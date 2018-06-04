import Trigger from '../parsers/w3x/war3map.wtg/trigger';
import ECA from '../parsers/w3x/war3map.wtg/eca';
import Parameter from '../parsers/w3x/war3map.wtg/parameter';
import SubParameters from '../parsers/w3x/war3map.wtg/subparameters';

let weuFunctionMapping = [
  ['RemoveLocation', ['location']],
  ['DestroyGroup', ['group']],
  ['DestroyTrigger', ['trigger']],
  ['FirstOfGroup', ['group']],
  ['IsUnitOwnedByPlayer', ['unit', 'player']],
  ['SetHeroStr', ['unit', 'integer', 'boolean']],
  ['SetHeroAgi', ['unit', 'integer', 'boolean']],
  ['SetHeroInt', ['unit', 'integer', 'boolean']],
  ['GroupEnumUnitsSelected', ['group', 'player', 'boolexpr']],
  ['DisplayTextToPlayer', ['player', 'real', 'real', 'string']],
  ['DisplayTimedTextToPlayer', ['player', 'real', 'real', 'real', 'string']],
];

let weuPresets = [
  ['PermanentPerm', 'true'],
  ['UnitTypeDead', 'UNIT_TYPE_DEAD'], // UnitTypedead in WEU -.-
];

/**
   *
   * @param {*} stack
   * @return {string}
   */
export function stackToString(stack) {
  return stack.map((value) => {
    if (value instanceof Trigger) {
      return `Trigger ${value.name}`;
    } else if (value instanceof ECA) {
      switch (value.type) {
        case 0: return `Event ${value.name}`;
        case 1: return `Condition ${value.name}`;
        case 2: return `Action ${value.name}`;
      }
    } else if (value instanceof Parameter) {
      return `Parameter ${value.value}`;
    } else if (value instanceof SubParameters) {
      return `SubParameters ${value.name}`;
    }
  }).reverse().join(' > ');
}

/*
Cases to handle:
1) Inline GUI replacement.
2) Inlike Custom Script replacement.
3) Callback.
4) Trigger to jass.

If inline GUI:
Replace, but then need to continue checking the replacement parameters.

If inline Custon Script:
Need to go up to the nearest ECA and replace it.

If callback:
Will always be a SubParameters if using a RoC function such as IfThenElse and ForForce
Will always be a ECA if using a TFT function such as IfThenElseMultiple and ForForceMultiple

If Trigger:
Will happen if an event or a condition must be replaced to Custom Script.
*/

/**
 * A WEU converter.
 */
class WEUConverter {
  /**
   *
   * @param {*} map
   * @param {*} triggerData
   * @param {function} callback
   */
  constructor(map, triggerData, callback) {
    this.callback = callback;
    this.functions = {triggerData: {}, external: {}};
    this.presets = {triggerData: {}, external: {}};
    this.stack = [];
    this.generatedNames = {};

    this.addTriggerData(triggerData);
    this.addExternalFunctions(weuFunctionMapping);
    this.addExternalPresets(weuPresets);

    this.triggerFile = map.readTriggers(this.functions);
    this.customTextTriggerFile = map.readCustomTextTriggers();

    for (let trigger of this.triggerFile.triggers) {
      this.handleTrigger(trigger);
    }

    map.set('war3map.wtg', this.triggerFile.save());
    map.set('war3map.wct', this.customTextTriggerFile.save());
  }

  /**
   *
   * @param {ECA|SubParameters} object
   * @return {string}
   */
  generateCallbackName(object) {
    if (this.generatedNames[object.name] === undefined) {
      this.generatedNames[object.name] = 0;
    }

    let trigger = this.stack[this.stack.length - 1];

    return `${trigger.name.replace(/\s/g, '_')}_Func${this.generatedNames[object.name]++}_${object.name}`;
  }
  /**
   * Creates a new Custom Script ECA with the given script.
   *
   * @param {string} script
   * @return {ECA}
   */
  createCustomScriptECA(script) {
    let eca = new ECA();

    eca.type = 2; // Function
    eca.name = 'CustomScriptCode';
    eca.isEnabled = 1;

    let parameter = new Parameter();

    parameter.type = 3; // String
    parameter.value = script;

    eca.parameters[0] = parameter;

    return eca;
  }

  /**
   * Creates a new comment ECA with the given comment.
   *
   * @param {string} comment
   * @return {ECA}
   */
  createCommentECA(comment) {
    let eca = new ECA();

    eca.type = 2; // Function
    eca.name = 'CommentString';
    eca.isEnabled = 1;

    let parameter = new Parameter();

    parameter.type = 3; // String
    parameter.value = comment; // Comment

    eca.parameters[0] = parameter;

    return eca;
  }

  /**
   * Gets the signature of the given function.
   *
   * @param {ECA|SubParameters} object
   * @return {Array<string>}
   */
  getFunctionSignature(object) {
    let name = object.name.toLowerCase();

    let functions = this.functions;
    let args = functions.triggerData[name];

    if (!args) {
      args = functions.external[name];

      if (!args) {
        throw new Error('Tried to get signature for unknown function', name);
      }
    }

    return args;
  }

  /**
   * Converts an ECA or SubParameters to an array of custom script ECAs.
   * Also creates callbacks when needed.
   *
   * @param {ECA|SubParameters} object
   * @return {string}
   */
  convertFunctionCallToCustomScript(object) {
    let ecas = [];
    let name = object.name;
    let parameters = object.parameters;
    let args = this.getFunctionSignature(object);
    let argCount = args.length;
    let isCode = false;
    let isBoolexpr = false;

    if (argCount) {
      let lastArg = args[argCount - 1];

      if (lastArg === 'code') {
        isCode = true;
      } else if (lastArg === 'boolexpr') {
        isBoolexpr = true;
      }
    }

    if (name === 'IfThenElse') {
      ecas.push(this.createCustomScriptECA(`if ${this.convertParameterToCustomScript(parameters[0], args[0])} then`));
      ecas.push(this.createCustomScriptECA(`call ${this.convertParameterToCustomScript(parameters[1], args[1])}`));
      ecas.push(this.createCustomScriptECA('else'));
      ecas.push(this.createCustomScriptECA(`call ${this.convertParameterToCustomScript(parameters[2], args[2])}`));
      ecas.push(this.createCustomScriptECA('endif'));
    } else if (isCode || isBoolexpr) {
      let callbackName = this.generateCallbackName(object);
      let call = `function ${callbackName}`;
      let returnType = 'nothing';
      let callOrReturn = 'call';

      if (isBoolexpr) {
        call = `Filter(${call})`;
        returnType = 'boolean';
        callOrReturn = 'return';
      }

      ecas.push(this.createCustomScriptECA(`call ${name}(${parameters.slice(0, -1).map((value, index) => this.convertParameterToCustomScript(value, args[index]))}, ${call})`));

      let callback = `
function ${callbackName} takes nothing returns ${returnType}
    ${callOrReturn} ${this.convertParameterToCustomScript(parameters[argCount - 1], args[argCount - 1])}
endfunction
`;

      this.customTextTriggerFile.trigger.text += callback.replace(/\n/g, '\r\n');

      if (this.callback) {
        this.callback('CallbackCreation', this.stack);
      }
    } else if (name === 'OperatorString') { // String concat
      ecas.push(this.createCustomScriptECA(`${this.convertParameterToCustomScript(parameters[0], args[0])} + ${this.convertParameterToCustomScript(parameters[1], args[1])}`));
    } else if (name.startsWith('Operator')) { // All other operators?
      ecas.push(this.createCustomScriptECA(`${this.convertParameterToCustomScript(parameters[0], args[0])} ${this.convertParameterToCustomScript(parameters[1], args[1])} ${this.convertParameterToCustomScript(parameters[2], args[2])}`));
    } else if (object instanceof ECA) {
      ecas.push(this.createCustomScriptECA(`call ${name}(${parameters.map((value, index) => this.convertParameterToCustomScript(value, args[index])).join(', ')})`));
    } else if (object instanceof SubParameters) {
      ecas.push(this.createCustomScriptECA(`${name}(${parameters.map((value, index) => this.convertParameterToCustomScript(value, args[index])).join(', ')})`));
    }

    return ecas;
  }

  /**
   * Given a call to IsUnitOwnedByPlayer that is inside an OperatorCompareBoolean, replace it with GetOwningPlayer in an OperatorComparePlayer.
   * This will only happen if the boolean comparison was compared against "true" or "false".
   * If the comparison term is more complex, the replacement will be skipped.
   *
   * @param {SubParameters} object
   * @return {boolean}
   */
  replaceIsUnitOwned(object) {
    let trueOrFalse = object.parameters[2].value;

    if (trueOrFalse !== 'true' && trueOrFalse !== 'false') {
      return false;
    }

    object.name = 'OperatorComparePlayer';

    let unit = object.parameters[0].subParameters.parameters[0];
    let otherPlayer = object.parameters[0].subParameters.parameters[1];

    // Change IsUnitOwnedByPlayer(unit, otherPlayer) to GetOwningPlayer(unit)
    object.parameters[0].value = 'GetOwningPlayer';
    object.parameters[0].subParameters.name = 'GetOwningPlayer';
    object.parameters[0].subParameters.parameters.length = 1;
    object.parameters[0].subParameters.parameters[0] = unit;

    // Equal or not equal
    if (trueOrFalse === 'true') {
      object.parameters[1].value = 'OperatorEqualENE';
    } else {
      object.parameters[1].value = 'OperatorNotEqualENE';
    }

    // Change false/true to otherPlayer
    object.parameters[2] = otherPlayer;

    return true;
  }

  /**
   * Given a call to SetHeroStr, SetHeroAgi, or SetHeroInt, replace it with ModifyHeroStat.
   * This will only happen if the change is permanent, since ModifyHeroStat is hardcoded for permanent changes.
   *
   * @param {ECA|SubParameters} object
   * @return {boolean}
   */
  replaceSetHeroStat(object) {
    let originalName = object.name;

    // If it's not permanent, can't change to GUI.
    if (object.parameters[2].value !== 'PermanentPerm') {
      return false;
    }

    let whichHero = object.parameters[0];
    let value = object.parameters[1];

    object.name = 'ModifyHeroStat';

    let whichStat = new Parameter();
    whichStat.type = 0; // preset
    whichStat.value = `HeroStat${originalName.slice(-3)}`;

    let modifyMethod = new Parameter();
    modifyMethod.type = 0; // preset
    modifyMethod.value = 'ModifyMethodSet';

    object.parameters[0] = whichStat;
    object.parameters[1] = whichHero;
    object.parameters[2] = modifyMethod;
    object.parameters[3] = value;

    return true;
  }

  /**
   * Try to find extended GUI that can be converted back to GUI.
   * This involves finding specific functions and cases where native function can be emulated via GUI functions.
   * This can avoid having to convert the extended GUI to custom script.
   * It's both nicer, and in the case of top-level events and conditions can avoid having to convert whole triggers.
   *
   * @param {ECA|SubParameters} object
   * @return {boolean}
   */
  handleInlineGUI(object) {
    if (object.name === 'OperatorCompareBoolean' && object.parameters[0].value === 'IsUnitOwnedByPlayer') {
      return this.replaceIsUnitOwned(object);
    } else if (object.name === 'SetHeroStr' || object.name === 'SetHeroAgi' || object.name === 'SetHeroInt') {
      return this.replaceSetHeroStat(object);
    }

    return false;
  }

  /**
   *
   * @param {SubParameters} subParameters
   * @return {string}
   */
  convertSubParametersToCustomScript(subParameters) {
    return this.convertFunctionCallToCustomScript(subParameters);
  }

  /**
   *
   * @param {string} name
   * @return {string}
   */
  getPreset(name) {
    let preset = this.presets.triggerData[name];

    if (preset === undefined) {
      preset = this.presets.external[name];

      if (preset === undefined) {
        throw new Error('Failed to find a preset', name);
      }
    }

    return preset;
  }

  /**
   *
   * @param {Parameter} parameter
   * @param {string} type
   * @return {string}
   */
  convertParameterToCustomScript(parameter, type) {
    // 0: preset
    // 1: variable
    // 2: function
    // 3: literal (need to test for strings)
    // -1: invalid
    if (parameter.type === 0) {
      return this.getPreset(parameter.value.toLowerCase());
    } else if (parameter.type === 1) {
      return `udg_${parameter.value}`;
    } else if (parameter.type === 2) {
      return this.convertSubParametersToCustomScript(parameter.subParameters)[0].parameters[0].value;
    } else if (parameter.type === 3) {
      let value = parameter.value;

      // "value"
      if (type === 'string') {
        return `"${value}"`;
      }

      // 'value'
      if (type === 'integer' && isNaN(value)) {
        return `'${value}'`;
      }

      // value
      return value;
    } else {
      return 'null';
    }
  }
  /**
   *
   * @param {ECA} eca
   * @return {string}
   */
  convertECAToCustomScript(eca) {
    return this.convertFunctionCallToCustomScript(eca);
  }

  /**
   * @param {ECA|SubParameters} object
   * @return {boolean}
   */
  handleCustomScript(object) {
    if (!this.functions.triggerData[object.name.toLowerCase()]) {
      for (let node of this.stack) {
        if (node instanceof ECA) {
          return this.convertECAToCustomScript(node);
        }
      }
    }
    return null;
  }

  /**
   *
   * @param {*} triggerData
   */
  addTriggerData(triggerData) {
    this.addTriggerDataFunctions(triggerData.getSection('TriggerActions'), false);
    this.addTriggerDataFunctions(triggerData.getSection('TriggerEvents'), false);
    this.addTriggerDataFunctions(triggerData.getSection('TriggerConditions'), false);
    this.addTriggerDataFunctions(triggerData.getSection('TriggerCalls'), true);

    this.addTriggerDataPresets(triggerData.getSection('TriggerParams'));
  }

  /**
   *
   * @param {*} section
   * @param {*} hasReturn
   */
  addTriggerDataFunctions(section, hasReturn) {
    for (let [key, value] of section) {
      // We don't care about metadata lines.
      if (key[0] !== '_') {
        let types = [];
        let tokens = value.split(',');

        // [TriggerCalls]
        if (hasReturn) {
          tokens = tokens.slice(3);
        }

        for (let argument of tokens) {
          // We don't care about constants.
          if (isNaN(argument) && argument !== 'nothing' && argument !== '') {
            types.push(argument);
          }
        }

        this.functions.triggerData[key] = types;
      }
    }
  }

  /**
   *
   * @param {*} section
   */
  addTriggerDataPresets(section) {
    for (let [key, value] of section) {
      let tokens = value.split(',');

      // Note that the operators are enclosed by "" for some reason.
      // Note that string literals are enclosed by backticks.
      this.presets.triggerData[key] = tokens[2].replace(/"/g, '').replace(/`/g, '"');
    }
  }

  /**
   * Adds external function argument arrays.
   * This is used to register extended GUI functions.
   *
   * @param {*} iterable
   */
  addExternalFunctions(iterable) {
    for (let [key, value] of iterable) {
      this.functions.external[key.toLowerCase()] = value;
    }
  }

  /**
   * Adds external presets.
   * This is used to register extended GUI presets.
   *
   * @param {*} iterable
   */
  addExternalPresets(iterable) {
    for (let [key, value] of iterable) {
      this.presets.external[key.toLowerCase()] = value;
    }
  }

  /**
   *
   * @param {*} subParameters
   * @return {number}
   */
  handleSubParameters(subParameters) {
    this.stack.unshift(subParameters);

    // Check if any GUI inlining is relevant.
    // If it's not, check if custom scripts are needed.
    if (this.handleInlineGUI(subParameters)) {
      if (this.callback) {
        this.callback('InlineGUI', this.stack);
      }
    } else {
      let replacements = this.handleCustomScript(subParameters);
      if (replacements) {
        if (this.callback) {
          this.callback('InlineCustomScript', this.stack);
        }
        this.stack.shift();
        return replacements;
      }
    }

    // Check the parameters.
    // Note that they will also be checked if GUI was inlined.
    // This is needed, because the inline functions don't check the parameters, only move them around.
    for (let parameter of subParameters.parameters) {
      let replacements = this.handleParameter(parameter);
      if (replacements) {
        this.stack.shift();
        return replacements;
      }
    }

    this.stack.shift();
    return null;
  }

  /**
   *
   * @param {*} parameter
   * @return {number}
   */
  handleParameter(parameter) {
    this.stack.unshift(parameter);

    if (parameter.subParameters) {
      let replacements = this.handleSubParameters(parameter.subParameters);
      if (replacements) {
        this.stack.shift();
        return replacements;
      }
    }

    this.stack.shift();
    return null;
  }

  /**
   *
   * @param {*} eca
   * @param {*} isChild
   * @return {number}
   */
  handleECA(eca, isChild) {
    this.stack.unshift(eca);

    if (this.handleInlineGUI(eca)) {
      if (this.callback) {
        this.callback('InlineGUI', this.stack);
      }
      this.stack.shift();
      return null;
    }

    let replacements = this.handleCustomScript(eca);
    if (replacements) {
      if (this.callback) {
        this.callback('InlineCustomScript', this.stack);
      }
      this.stack.shift();
      return replacements;
    }

    for (let parameter of eca.parameters) {
      let replacements = this.handleParameter(parameter);
      if (replacements) {
        this.stack.shift();
        return replacements;
      }
    }

    let newEcas = [];

    for (let child of eca.ecas) {
      let replacements = this.handleECA(child, true);
      if (replacements) {
        replacements.unshift(this.createCommentECA('CONVERTED AUTOMATICALLY'));
        for (let replacement of replacements) {
          // console.log('replacement group is', replacement.group, 'should be 0?', child)
          replacement.group = 0;
        }
        newEcas.push(...replacements);
      } else {
        newEcas.push(child);
      }
    }

    eca.ecas = newEcas;

    this.stack.shift();
    return null;
  }

  /**
   *
   * @param {*} trigger
   */
  handleTrigger(trigger) {
    this.stack.unshift(trigger);

    let newEcas = [];

    for (let eca of trigger.ecas) {
      let replacements = this.handleECA(eca, false);
      if (replacements) {
        // If an event or a condition need to be replaced, the whole trigger needs to be replaced.
        if (eca.type === 0 || eca.type === 1) {
          console.log('NEED TO REPLACE WHOLE TRIGGER', trigger.name);
          console.log('REASON:', eca);
        } else {
          replacements.unshift(this.createCommentECA('CONVERTED AUTOMATICALLY'));
          for (let replacement of replacements) {
            // console.log('replacement group is', replacement.group, 'should be -1 (top level)')
            replacement.group = -1;
          }
          newEcas.push(...replacements);
        }
      } else {
        newEcas.push(eca);
      }
    }

    trigger.ecas = newEcas;

    this.stack.shift();
  }
}

/**
 *
 * @param {*} map
 * @param {*} triggerData
 * @param {function} callback
 * @return {*}
 */
export function convertWeu(map, triggerData, callback) {
  return new WEUConverter(map, triggerData, callback);
}
