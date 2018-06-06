import Trigger from '../parsers/w3x/war3map.wtg/trigger';
import ECA from '../parsers/w3x/war3map.wtg/eca';
import Parameter from '../parsers/w3x/war3map.wtg/parameter';
import SubParameters from '../parsers/w3x/war3map.wtg/subparameters';

/**
   *
   * @param {Array<Trigger|ECA|Parameter|SubParameters>} stack
   * @return {string}
   */
export function stackToString(stack) {
  return stack.map((value) => {
    if (value instanceof Trigger) {
      return `Trigger ${value.name}`;
    } else if (value instanceof ECA) {
      if (value.type === 0) {
        return `Event ${value.name}`;
      } else if (value.type === 1) {
        `Condition ${value.name}`;
      } else {
        return `Action ${value.name}`;
      }
    } else if (value instanceof Parameter) {
      return `Parameter ${value.value}`;
    } else if (value instanceof SubParameters) {
      return `SubParameters ${value.name}`;
    }
  }).reverse().join(' > ');
}

/**
 * Creates a new Custom Script or comment ECA with the given data.
 *
 * @param {string} data
 * @param {boolean} isComment
 * @return {ECA}
 */
function createCustomScriptOrCommentECA(data, isComment) {
  let eca = new ECA();

  eca.type = 2; // Function

  if (isComment) {
    eca.name = 'CommentString';
  } else {
    eca.name = 'CustomScriptCode';
  }

  eca.isEnabled = 1;

  let parameter = new Parameter();

  parameter.type = 3; // String
  parameter.value = data;

  eca.parameters[0] = parameter;

  return eca;
}

/**
 * Creates a new Custom Script ECA with the given script.
 *
 * @param {string} script
 * @return {ECA}
 */
function createCustomScriptECA(script) {
  return createCustomScriptOrCommentECA(script);
}

// /**
//  * Creates a new comment ECA with the given comment.
//  *
//  * @param {string} comment
//  * @return {ECA}
//  */
// function createCommentECA(comment) {
//   return createCustomScriptOrCommentECA(comment, true);
// }

/**
 * A WEU converter.
 */
class WEUConverter {
  /**
   *
   * @param {War3Map} map
   * @param {TriggerData} triggerData
   * @param {function} callback
   */
  constructor(map, triggerData, callback) {
    this.callback = callback;
    this.stack = [];
    this.generatedNames = {};
    this.triggerData = triggerData;
    this.triggerFile = null;
    this.customTextTriggerFile = null;

    try {
      this.triggerFile = map.readTriggers(triggerData);
    } catch (e) {
      if (callback) {
        callback({type: 'error', name: 'war3map.wtg', data: `Failed to read the trigger file: ${e}`});
      }

      return;
    }

    try {
      this.customTextTriggerFile = map.readCustomTextTriggers();
    } catch (e) {
      if (callback) {
        callback({type: 'error', name: 'war3map.wtc', data: `Failed to read the custom text trigger file: ${e}`});
      }

      return;
    }

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
   * Converts an ECA or SubParameters to an array of custom script ECAs.
   * Also creates callbacks when needed, which are added to the map header.
   *
   * @param {ECA|SubParameters} object
   * @return {string}
   */
  convertFunctionCallToCustomScript(object) {
    let ecas = [];
    let name = object.name;
    let parameters = object.parameters;
    let args = this.triggerData.getFunction(object.name);
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

    // IfThenElse and other control flow "functions" must come before the generic code/boolexpr callback handling, since they don't follow the same rules.
    if (name === 'IfThenElse') {
      ecas.push(createCustomScriptECA(`if ${this.convertParameterToCustomScript(parameters[0], args[0])} then`));
      ecas.push(createCustomScriptECA(`call ${this.convertParameterToCustomScript(parameters[1], args[1])}`));
      ecas.push(createCustomScriptECA('else'));
      ecas.push(createCustomScriptECA(`call ${this.convertParameterToCustomScript(parameters[2], args[2])}`));
      ecas.push(createCustomScriptECA('endif'));
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

      ecas.push(createCustomScriptECA(`call ${name}(${parameters.slice(0, -1).map((value, index) => this.convertParameterToCustomScript(value, args[index]))}, ${call})`));

      let callback = `
function ${callbackName} takes nothing returns ${returnType}
    ${callOrReturn} ${this.convertParameterToCustomScript(parameters[argCount - 1], args[argCount - 1])}
endfunction
`;

      this.customTextTriggerFile.trigger.text += callback.replace(/\n/g, '\r\n');

      if (this.callback) {
        this.callback({type: 'changed', name: 'CallbackCreation', data: this.stack});
      }
    } else if (name === 'OperatorString') { // String concat
      ecas.push(createCustomScriptECA(`${this.convertParameterToCustomScript(parameters[0], args[0])} + ${this.convertParameterToCustomScript(parameters[1], args[1])}`));
    } else if (name.startsWith('Operator')) { // All other operators?
      ecas.push(createCustomScriptECA(`${this.convertParameterToCustomScript(parameters[0], args[0])} ${this.convertParameterToCustomScript(parameters[1], args[1])} ${this.convertParameterToCustomScript(parameters[2], args[2])}`));
    } else if (object instanceof ECA) {
      ecas.push(createCustomScriptECA(`call ${name}(${parameters.map((value, index) => this.convertParameterToCustomScript(value, args[index])).join(', ')})`));
    } else if (object instanceof SubParameters) {
      ecas.push(createCustomScriptECA(`${name}(${parameters.map((value, index) => this.convertParameterToCustomScript(value, args[index])).join(', ')})`));
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
   * Given a call to IsUnitInRange that is inside an OperatorCompareBoolean, replace it with DistanceBetweenPoints in an OperatorCompareReal.
   * This will only happen if the boolean comparison was compared against "true" or "false".
   * If the comparison term is more complex, the replacement will be skipped.
   *
   * @param {ECA|SubParameters} object
   * @return {boolean}
   */
  replaceIsUnitInRange(object) {
    let trueOrFalse = object.parameters[2].value;

    if (trueOrFalse !== 'true' && trueOrFalse !== 'false') {
      return false;
    }

    object.name = 'OperatorCompareReal';

    let unit = object.parameters[0].subParameters.parameters[0];
    let otherUnit = object.parameters[0].subParameters.parameters[1];
    let range = object.parameters[0].subParameters.parameters[2];

    object.parameters[0].value = 'DistanceBetweenPoints';
    object.parameters[0].subParameters.name = 'DistanceBetweenPoints';

    let getUnitLoc1 = new Parameter();
    getUnitLoc1.type = 2; // function
    getUnitLoc1.value = 'GetUnitLoc';
    getUnitLoc1.subParameters = new SubParameters();
    getUnitLoc1.subParameters.beginParameters = 1;
    getUnitLoc1.subParameters.type = 3;
    getUnitLoc1.subParameters.name = 'GetUnitLoc';
    getUnitLoc1.subParameters.parameters[0] = unit;

    let getUnitLoc2 = new Parameter();
    getUnitLoc2.type = 2; // function
    getUnitLoc2.value = 'GetUnitLoc';
    getUnitLoc2.subParameters = new SubParameters();
    getUnitLoc2.subParameters.beginParameters = 1;
    getUnitLoc2.subParameters.type = 3;
    getUnitLoc2.subParameters.name = 'GetUnitLoc';
    getUnitLoc2.subParameters.parameters[0] = otherUnit;

    let operator = new Parameter();
    operator.type = 0; // preset


    if (trueOrFalse === 'true') {
      operator.value = 'OperatorLessEq';
    } else {
      operator.value = 'OperatorGreater';
    }

    object.parameters[0].subParameters.parameters.length = 0;
    object.parameters[0].subParameters.parameters[0] = getUnitLoc1;
    object.parameters[0].subParameters.parameters[1] = getUnitLoc2;

    object.parameters[1] = operator;

    object.parameters[2] = range;

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
    // If it's not permanent, can't change to GUI.
    if (object.parameters[2].value !== 'PermanentPerm') {
      return false;
    }

    let name = object.name;
    let whichHero = object.parameters[0];
    let value = object.parameters[1];

    object.name = 'ModifyHeroStat';

    let whichStat = new Parameter();
    whichStat.type = 0; // preset
    whichStat.value = `HeroStat${name.slice(-3)}`;

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
    if (object.name === 'OperatorCompareBoolean') {
      if (object.parameters[0].value === 'IsUnitOwnedByPlayer') {
        return this.replaceIsUnitOwned(object);
      } else if (object.parameters[0].value === 'IsUnitInRange') {
        return this.replaceIsUnitInRange(object);
      }
    } else if (object.name === 'SetHeroStr' || object.name === 'SetHeroAgi' || object.name === 'SetHeroInt') {
      return this.replaceSetHeroStat(object);
    }

    return false;
  }

  /**
   * Converts a parameter to custom script.
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
      return this.triggerData.getPreset(parameter.value);
    } else if (parameter.type === 1) {
      return `udg_${parameter.value}`;
    } else if (parameter.type === 2) {
      return this.convertFunctionCallToCustomScript(parameter.subParameters)[0].parameters[0].value;
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
   * If the given function is not in the trigger data, go back to the nearest ECA in the stack, and convert everything starting from it to custom script.
   * In case that happens, an array of ECAs will be returned, which are the replacement of the original ECA.
   *
   * @param {ECA|SubParameters} object
   * @return {Array<ECA>|null}
   */
  handleCustomScript(object) {
    if (!this.triggerData.functions[object.name.toLowerCase()]) {
      for (let node of this.stack) {
        if (node instanceof ECA) {
          return this.convertFunctionCallToCustomScript(node);
        }
      }
    }
    return null;
  }

  /**
   *
   * @param {ECA|SubParameters} object
   * @return {Array<ECA>|null}
   */
  handleFunctionCall(object) {
    // Check if any GUI inlining is relevant.
    // If it's not, check if custom scripts are needed.
    if (this.handleInlineGUI(object)) {
      if (this.callback) {
        this.callback({type: 'changed', name: 'InlineGUI', data: this.stack});
      }
    } else {
      let replacements = this.handleCustomScript(object);

      if (replacements) {
        if (this.callback) {
          this.callback({type: 'changed', name: 'InlineCustomScript', data: this.stack});
        }

        this.stack.shift();
        return replacements;
      }
    }

    // Check the parameters.
    // Note that they will also be checked if GUI was inlined.
    // This is needed, because the inline functions don't check the parameters, only move them around.
    for (let parameter of object.parameters) {
      let replacements = this.handleParameter(parameter);

      if (replacements) {
        this.stack.shift();
        return replacements;
      }
    }

    return null;
  }

  /**
   * @param {SubParameters} subParameters
   * @return {Array<ECA>|null}
   */
  handleSubParameters(subParameters) {
    this.stack.unshift(subParameters);

    let replacements = this.handleFunctionCall(subParameters);

    this.stack.shift();
    return replacements;
  }

  /**
   * @param {Parameter} parameter
   * @return {Array<ECA>|null}
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
   * @param {ECA} eca
   * @param {boolean} isChild
   * @return {Array<ECA>|null}
   */
  handleECA(eca, isChild) {
    this.stack.unshift(eca);

    let replacements = this.handleFunctionCall(eca);

    if (replacements) {
      this.stack.unshift();
      return replacements;
    }

    let newEcas = [];

    for (let child of eca.ecas) {
      let replacements = this.handleECA(child, true);

      if (replacements) {
        for (let replacement of replacements) {
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
   * @param {Trigger} trigger
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
 * @param {War3Map} map
 * @param {TriggerData} triggerData
 * @param {function} callback
 * @return {WEUConverter}
 */
export function convertWeu(map, triggerData, callback) {
  return new WEUConverter(map, triggerData, callback);
}
