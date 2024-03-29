import Trigger from '../../../parsers/w3x/wtg/trigger';
import ECA from '../../../parsers/w3x/wtg/eca';
import Parameter from '../../../parsers/w3x/wtg/parameter';
import SubParameters from '../../../parsers/w3x/wtg/subparameters';
import WeuData from './data';
import { createCustomScriptECA, convertSingleToMultiple, isConditionECA, ensureCustomScriptCodeSafety } from './utils';
import { convertFunctionCall } from './conversions';
import transformFunction from './transformations/functions';
import transformPreset from './transformations/presets';

interface ConvertionResult {
  convert: boolean;
  reason: string;
}

export function processTrigger(data: WeuData, trigger: Trigger, callbacks: string[]): ConvertionResult {
  data.push(trigger);

  const eventsAndConditions = [];
  const actions = [];

  for (const eca of trigger.ecas) {
    const type = eca.type;

    if (type === 0 || type === 1) {
      eventsAndConditions.push(eca);
    } else if (type === 2) {
      actions.push(eca);
    }
  }

  const outputEcas = [];

  for (const eventOrCondition of eventsAndConditions) {
    const result = processECA(data, eventOrCondition, callbacks);

    if (result.convert) {
      data.pop();
      return result;
    }

    outputEcas.push(eventOrCondition);
  }

  for (const action of actions) {
    const result = processECA(data, action, callbacks);

    if (result.convert) {
      const customScripts = convertFunctionCall(data, action, callbacks);

      data.change('inlinecustomscript', result.reason, customScripts.map((eca) => eca.parameters[0].value).join('\n'));
      outputEcas.push(...customScripts);
    } else {
      outputEcas.push(action);
    }
  }

  trigger.ecas = ensureCustomScriptCodeSafety(outputEcas);

  data.pop();
  return { convert: false, reason: '' };
}

export function processECA(data: WeuData, eca: ECA, callbacks: string[]): ConvertionResult {
  data.push(eca);

  // Test if this function call, or anything down its hierarchy, needs to be converted to custom script.
  const result = processFunctionCall(data, eca, callbacks);

  if (result.convert) {
    const reason = result.reason;

    // If conversion is needed, try first to see if this is a RoC control flow ECA, and convert it to its TFT equivalent.
    // This includes things like IfThenElse (RoC) and IfThenElseMultiple (TFT).
    // This allows to potentially only convert to custom script one part of the control flow block, rather than all of it.
    if (convertSingleToMultiple(eca)) {
      // If the test passes here (that is, false is returned), the TFT conversion allowed to handle the conversion down the hierarchy.
      // In this case, this ECA no longer needs to be converted to custom script.
      const result = processFunctionCall(data, eca, callbacks);

      if (result.convert) {
        data.pop();
        return result;
      } else {
        data.change('singletomultiple', reason, eca.name);
      }
    } else {
      data.pop();
      return result;
    }
  }

  const outputEcas = [];

  // Test the child ECAs if there are any.
  for (const child of eca.ecas) {
    const result = processECA(data, child, callbacks);

    if (result.convert) {
      let customScripts;

      // If this is a condition ECA, make a custom script condition.
      if (isConditionECA(eca.name, child.group)) {
        let condition = convertFunctionCall(data, child, callbacks)[0].parameters[0].value;

        // Normally type 2 (function) ECAs have the call keyword prepended to them.
        // If one was added, remove it now, since this is a condition.
        if (condition.startsWith('call ')) {
          condition = condition.slice(5);
        }

        let finalCondition;
        let returnValue;

        // IfThenElseMultiple and AndMultiple return false if any condition is false.
        // OrMultiple needs to return true if any condition is true.
        if (eca.name === 'OrMultiple') {
          finalCondition = condition;
          returnValue = 'true';
        } else {
          finalCondition = `not (${condition})`;
          returnValue = 'false';
        }

        customScripts = [
          createCustomScriptECA(`if ${finalCondition} then`),
          createCustomScriptECA(`return ${returnValue}`),
          createCustomScriptECA('endif'),
        ];
      } else {
        customScripts = convertFunctionCall(data, child, callbacks);
      }

      // All of the custom scripts should be in the same group as the original child.
      for (const script of customScripts) {
        script.group = child.group;
      }

      data.change('inlinecustomscript', result.reason, customScripts.map((eca) => eca.parameters[0].value).join('\n'));
      outputEcas.push(...customScripts);
    } else {
      outputEcas.push(child);
    }
  }

  eca.ecas = ensureCustomScriptCodeSafety(outputEcas);

  data.pop();
  return { convert: false, reason: '' };
}

function processFunctionCall(data: WeuData, object: ECA | SubParameters, callbacks: string[]): ConvertionResult {
  const name = object.name;

  // Check if this object can be converted back to normal GUI.
  // If it's already normal GUI, nothing will happen.
  if (transformFunction(data, object)) {
    data.change('inlinegui', name, object.name);
  }

  // If this function is not from normal GUI, it has to be converted.
  if (!data.triggerData.isBaseFunction(object.type, object.name)) {
    return { convert: true, reason: object.name };
  }

  // Check the parameters.
  // Note that they will also be checked if GUI was inlined.
  // This is needed, because the inline functions don't check the parameters, only move them around.
  for (const parameter of object.parameters) {
    // Check for custom presets.
    if (parameter.type === 0 && data.triggerData.isCustomPreset(parameter.value)) {
      const value = parameter.value;

      if (transformPreset(data, parameter)) {
        data.change('inlinepreset', value, parameter.value);
      } else {
        return { convert: true, reason: value };
      }
    }

    const result = processParameter(data, parameter, callbacks);

    if (result.convert) {
      return result;
    }
  }

  return { convert: false, reason: '' };
}

function processParameter(data: WeuData, parameter: Parameter, callbacks: string[]): { convert: boolean, reason: string } {
  data.push(parameter);

  const type = parameter.type;
  const value = parameter.value;

  if (type === 1) {
    if (value.startsWith('gg_')) {
      // Used to track global generated variables and their status.
      data.updateGUIReference(value, true);
    }
  } else if (type === 2) {
    const result = processSubParameters(data, <SubParameters>parameter.subParameters, callbacks);

    if (result.convert) {
      data.pop();
      return result;
    }
  }

  // If this is an array element, test the array index.
  const index = parameter.arrayIndex;

  if (index) {
    const result = processParameter(data, index, callbacks);

    if (result.convert) {
      data.pop();
      return result;
    }
  }

  data.pop();
  return { convert: false, reason: '' };
}

function processSubParameters(data: WeuData, subParameters: SubParameters, callbacks: string[]): ConvertionResult {
  data.push(subParameters);

  const result = processFunctionCall(data, subParameters, callbacks);

  if (result.convert) {
    data.pop();
    return result;
  }

  data.pop();
  return { convert: false, reason: '' };
}
