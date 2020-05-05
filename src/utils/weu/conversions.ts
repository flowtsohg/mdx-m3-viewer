import Trigger from '../../parsers/w3x/wtg/trigger';
import ECA from '../../parsers/w3x/wtg/eca';
import Parameter from '../../parsers/w3x/wtg/parameter';
import SubParameters from '../../parsers/w3x/wtg/subparameters';
import WeuData from './data';
import { createCustomScriptECA, ensureNameSafety } from './utils';

/**
 * A list of vanilla operators that take 3 parameters.
 * The only one not here, which takes 2 parameters, is OperatorString.
 */
const OPERATOR_NAMES = new Set([
  'OperatorCompareBoolean',
  'OperatorCompareAbilityId',
  'OperatorCompareBuffId',
  'OperatorCompareDestructible',
  'OperatorCompareDestructableCode',
  'OperatorCompareButton',
  'OperatorCompareGameDifficulty',
  'OperatorCompareGameSpeed',
  'OperatorCompareHeroSkill',
  'OperatorCompareInteger',
  'OperatorCompareItem',
  'OperatorCompareItemType',
  'OperatorCompareItemCode',
  'OperatorCompareMouseButton',
  'OperatorCompareMeleeDifficulty',
  'OperatorCompareOrderCode',
  'OperatorComparePlayer',
  'OperatorComparePlayerColor',
  'OperatorComparePlayerControl',
  'OperatorComparePlayerSlotStatus',
  'OperatorCompareRace',
  'OperatorCompareReal',
  'OperatorCompareString',
  'OperatorCompareTechCode',
  'OperatorCompareTerrainType',
  'OperatorCompareTrigger',
  'OperatorCompareUnit',
  'OperatorCompareUnitCode',
  'OperatorInt',
  'OperatorReal',
]);

/**
 * A list of vanilla functions which have an implicit code parameter.
 * The control flow "functions" such as IfThenElseMultiple and ForLoopAMultiple are handled specifically.
 */
const HAS_IMPLICIT_CODE = new Set([
  'EnumDestructablesInRectAllMultiple',
  'EnumDestructablesInCircleBJMultiple',
  'EnumItemsInRectBJMultiple',
  'ForForceMultiple',
  'ForGroupMultiple',
]);

/**
 * Converts a Trigger to a custom script string.
 * Callbacks that are generated due to the conversion are added to the input callbacks array.
 */
export function convertTrigger(data: WeuData, trigger: Trigger, callbacks: string[]) {
  let name = ensureNameSafety(trigger.name);
  let events = [];
  let conditions = [];
  let actions = [];

  // Separate the events/conditions/actions.
  for (let eca of trigger.ecas) {
    if (eca.type === 0) {
      events.push(eca);
    } else if (eca.type === 1) {
      conditions.push(eca);
    } else {
      actions.push(eca);
    }
  }

  let functions = [];

  if (events.length || conditions.length || actions.length) {
    let initBody = [];
    let conditionsBody = [];
    let actionsBody = [];

    // Reference the global trigger that WE generates.
    let triggerName = `gg_trg_${name}`;

    // Events don't explicitly define the trigger parameter.
    // Therefore it is created here, and prepended below to the parameters of each event.
    let triggerParameter = new Parameter();
    triggerParameter.type = 3;
    triggerParameter.value = triggerName;

    initBody.push(`set ${triggerName} = CreateTrigger()`);

    // Convert the events.
    for (let event of events) {
      event.parameters.unshift(triggerParameter);

      for (let eca of convertFunctionCall(data, event, callbacks)) {
        initBody.push(eca.parameters[0].value);
      }
    }

    // Convert the conditions.
    if (conditions.length) {
      initBody.push(`call TriggerAddCondition(${triggerName}, Condition(function Trig_${name}_Conditions)`);

      for (let condition of conditions) {
        for (let eca of convertFunctionCall(data, condition, callbacks)) {
          conditionsBody.push(`if ${eca.parameters[0].value} then\r\n return true\r\nendif`);
        }
      }
    }

    // Convert the actions.
    if (actions.length) {
      initBody.push(`call TriggerAddAction(${triggerName}, function Trig_${name}_Actions)`);

      for (let action of actions) {
        for (let eca of convertFunctionCall(data, action, callbacks)) {
          actionsBody.push(eca.parameters[0].value);
        }
      }
    }

    // Add the actions function.
    if (actionsBody.length) {
      functions.push(`function Trig_${name}_Actions takes nothing returns nothing\r\n${actionsBody.join('\r\n')}\r\nendfunction`);
    }

    // Add the conditions function.
    if (conditionsBody.length) {
      functions.push(`function Trig_${name}_Conditions takes nothing returns boolean\r\n${conditionsBody.join('\r\n')}\r\nreturn false\r\nendfunction`);
    }

    // Add the initalization function.
    functions.push(`function InitTrig_${name} takes nothing returns nothing\r\n${initBody.join('\r\n')}\r\nendfunction`);
  }

  // Finally, return the whole trigger as Jass.
  return functions.join('\r\n');
}

/**
 * Converts an ECA or SubParameters to an array of custom script ECAs.
 * Callbacks that are generated due to the conversion are added to the input callbacks array.
 */
export function convertFunctionCall(data: WeuData, object: ECA | SubParameters, callbacks: string[]) {
  let name = object.name;
  let ecas: string[] = [];
  let parameters = object.parameters;
  let signature = data.triggerData.getFunction(object.type, object.name);

  if (!signature) {
    throw new Error(`Could not find a function signature: ${name}. Stack: ${data.stackToString()}`);
  }

  let { args, scriptName } = signature;
  let argCount = args.length;
  let isCode = false;
  let isBoolexpr = false;
  let isScriptCode = false;
  let ecaObject = <ECA>object; // Get correct typing for the cases where the object is known to be an ECA.

  scriptName = scriptName || object.name;

  if (argCount) {
    let lastArg = args[argCount - 1];

    if (lastArg === 'code' || HAS_IMPLICIT_CODE.has(name)) {
      isCode = true;
    } else if (lastArg === 'boolexpr') {
      isBoolexpr = true;
    } else if (lastArg === 'scriptcode') {
      isScriptCode = true;
    }
  }

  // IfThenElse and other control flow "functions" must come before the generic code/boolexpr callback handling, since they don't follow the same rules.
  if (name === 'IfThenElse') {
    ecas.push(`if ${convertParameter(data, parameters[0], args[0], callbacks)} then`);
    ecas.push(`call ${convertParameter(data, parameters[1], args[1], callbacks)}`);
    ecas.push('else');
    ecas.push(`call ${convertParameter(data, parameters[2], args[2], callbacks)}`);
    ecas.push('endif');
  } else if (name === 'OrMultiple') {
    ecas.push(ecaObject.ecas.slice().map((eca) => convertFunctionCall(data, eca, callbacks).map((eca) => eca.parameters[0].value)).join(' or '));
  } else if (name === 'AndMultiple') {
    ecas.push(ecaObject.ecas.slice().map((eca) => convertFunctionCall(data, eca, callbacks).map((eca) => eca.parameters[0].value)).join(' and '));
  } else if (name === 'ForLoopAMultiple' || name === 'ForLoopBMultiple' || name === 'ForLoopVarMultiple') {
    let loopName = 'A';

    if (name === 'ForLoopBMultiple') {
      loopName = 'B';
    } else if (name === 'ForLoopVarMultiple') {
      loopName = 'Var';
    }

    let index;

    if (loopName === 'A' || loopName === 'B') {
      index = `bj_forLoop${loopName}Index`;

      let indexEnd = `${index}End`;

      ecas.push(`set ${index} = ${convertParameter(data, parameters[0], args[0], callbacks)}`);
      ecas.push(`set ${indexEnd} = ${convertParameter(data, parameters[1], args[1], callbacks)}`);
      ecas.push('loop');
      ecas.push(`exitwhen ${index} > ${indexEnd}`);
    } else {
      index = convertParameter(data, parameters[0], args[0], callbacks);

      ecas.push(`set ${index} = ${convertParameter(data, parameters[1], args[1], callbacks)}`);
      ecas.push('loop');
      ecas.push(`exitwhen ${index} > ${convertParameter(data, parameters[2], args[2], callbacks)}`);
    }

    for (let action of ecaObject.ecas) {
      let replacements = convertFunctionCall(data, action, callbacks);

      for (let replacement of replacements) {
        ecas.push(`${replacement.parameters[0].value}`);
      }
    }

    ecas.push(`set ${index} = ${index} + 1`);
    ecas.push('endloop');
  } else if (name === 'IfThenElseMultiple') {
    let condition;
    let thenActions = [];
    let elseActions = [];

    for (let eca of ecaObject.ecas) {
      if (eca.group === 0) {
        condition = eca;
      } else if (eca.group === 1) {
        thenActions.push(eca);
      } else if (eca.group === 2) {
        elseActions.push(eca);
      }
    }

    if (condition) {
      ecas.push(`if ${convertFunctionCall(data, condition, callbacks)[0].parameters[0].value} then`);
    }

    for (let action of thenActions) {
      let replacements = convertFunctionCall(data, action, callbacks);

      for (let replacement of replacements) {
        ecas.push(`${replacement.parameters[0].value}`);
      }
    }

    if (elseActions.length) {
      ecas.push('else');

      for (let action of elseActions) {
        let replacements = convertFunctionCall(data, action, callbacks);

        for (let replacement of replacements) {
          ecas.push(`${replacement.parameters[0].value}`);
        }
      }
    }

    ecas.push('endif');
  } else if (isCode || isBoolexpr) {
    let triggerName = data.getTriggerName();
    let callbackName = `Trig_${ensureNameSafety(triggerName)}_Func${callbacks.length}`;
    let call = `function ${callbackName}`;
    let returnType = 'nothing';
    let callOrReturn = 'call';
    let lastParam = parameters.length - 1;
    let isMultiple = object.name.endsWith('Multiple');

    if (isBoolexpr) {
      call = `Filter(${call})`;
      returnType = 'boolean';
      callOrReturn = 'return';
    }

    if (isMultiple) {
      lastParam = parameters.length;
    }

    // The callback names are based on where they are in the callback array.
    // This breaks when one of the convert functions below need to create more callbacks before actually adding this one to the callbacks array.
    // To solve this, add a placeholder and save the index, and then use the index after converting everything.
    let callbackIndex = callbacks.length;
    callbacks[callbackIndex] = 'NOTHING';

    let callParams = [...parameters.slice(0, lastParam).map((value, index) => convertParameter(data, value, args[index], callbacks)), call];

    if (object instanceof ECA) {
      ecas.push(`call ${scriptName}(${callParams.join(', ')})`);
    } else {
      ecas.push(`${scriptName}(${callParams.join(', ')})`);
    }

    let body;

    if (isMultiple) {
      body = ecaObject.ecas.map((eca) => convertFunctionCall(data, eca, callbacks).map((customScript) => customScript.parameters[0].value).join('\r\n')).join('\r\n');
    } else {
      body = `${callOrReturn} ${convertParameter(data, parameters[lastParam], args[lastParam], callbacks)}`;
    }

    // Now use the callback index and replace the placeholder.
    callbacks[callbackIndex] = `function ${callbackName} takes nothing returns ${returnType}\r\n${body}\r\nendfunction`;
  } else if (isScriptCode) {
    ecas.push(convertParameter(data, ecaObject.parameters[0], 'scriptcode', callbacks));
  } else if (name === 'SetVariable') {
    ecas.push(`set ${convertParameter(data, parameters[0], args[0], callbacks)} = ${convertParameter(data, parameters[1], args[1], callbacks)}`);
  } else if (name === 'OperatorString') { // String concat
    ecas.push(`${convertParameter(data, parameters[0], args[0], callbacks)} + ${convertParameter(data, parameters[1], args[1], callbacks)}`);
  } else if (OPERATOR_NAMES.has(name)) { // All other operators
    ecas.push(`${convertParameter(data, parameters[0], args[0], callbacks)} ${convertParameter(data, parameters[1], args[1], callbacks)} ${convertParameter(data, parameters[2], args[2], callbacks)}`);
  } else if (name === 'CommentString') { // Comment
    ecas.push(`// ${parameters[0].value}`);
  } else if (name === 'GetBooleanAnd') {
    ecas.push(`(${convertParameter(data, parameters[0], args[0], callbacks)} and ${convertParameter(data, parameters[1], args[1], callbacks)})`);
  } else if (name === 'GetBooleanOr') {
    ecas.push(`(${convertParameter(data, parameters[0], args[0], callbacks)} or ${convertParameter(data, parameters[1], args[1], callbacks)})`);
  } else if (object instanceof ECA) {
    // If this is a trigger event, there is the implicit trigger parameter at the beginning.
    if (object.type === 0) {
      args = ['trigger', ...args];
    }

    ecas.push(`call ${scriptName}(${parameters.map((value, index) => convertParameter(data, value, args[index], callbacks)).join(', ')})`);
  } else if (object instanceof SubParameters) {
    ecas.push(`${scriptName}(${parameters.map((value, index) => convertParameter(data, value, args[index], callbacks)).join(', ')})`);
  }

  return ecas.map((eca) => createCustomScriptECA(eca));
}

/**
 * Converts a parameter to custom script.
 * Callbacks that are generated due to the conversion are added to the input callbacks array.
 */
export function convertParameter(data: WeuData, parameter: Parameter, dataType: string, callbacks: string[]) {
  let type = parameter.type;
  let value = parameter.value;

  if (type === 0) {
    let preset = data.triggerData.getPreset(value);

    if (preset === undefined) {
      throw new Error(`Failed to find a preset: "${name}"`);
    }

    return preset;
  } else if (type === 1) {
    if (value.startsWith('gg_')) {
      // Used to track global generated variables and their status.
      data.updateGUIReference(value, false);

      return value;
    } else {
      let global = `udg_${value}`;

      if (parameter.isArray && parameter.arrayIndex) {
        global += `[${convertParameter(data, parameter.arrayIndex, 'integer', callbacks)}]`;
      }

      return global;
    }
  } else if (parameter.type === 2) {
    return convertFunctionCall(data, <SubParameters>parameter.subParameters, callbacks)[0].parameters[0].value;
  } else if (parameter.type === 3) {
    let baseType = data.triggerData.getBaseType(dataType);

    // "value"
    // scriptcode needs to be converted as-is, and doesn't need quotes.
    if (baseType === 'string' && dataType !== 'scriptcode') {
      // Inline string table entries.
      if (value.startsWith('TRIGSTR')) {
        let index = parseInt(value.slice(8));
        let entry = data.stringTable.stringMap.get(index)

        if (entry) {
          return `"${entry.replace(/\r\n/g, '\\r\n')}"`;
        } else {
          data.change('missingstring', 'Entry not found in the string table', value);
        }
      }

      return `"${value.replace(/\\/g, '\\\\')}"`;
    }

    // 'value'
    if (baseType === 'integer' && isNaN(parseInt(value))) {
      return `'${value}'`;
    }

    // value
    return value;
  } else {
    return '';
  }
}

/**
 * Convert a parameter to a custom script string, discarding any generated callbacks.
 */
export function convertParameterInline(data: WeuData, parameter: Parameter, dataType: string) {
  return convertParameter(data, parameter, dataType, []);
}
