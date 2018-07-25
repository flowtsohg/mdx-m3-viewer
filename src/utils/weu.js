import Trigger from '../parsers/w3x/wtg/trigger';
import ECA from '../parsers/w3x/wtg/eca';
import Parameter from '../parsers/w3x/wtg/parameter';
import SubParameters from '../parsers/w3x/wtg/subparameters';
import CustomTextTrigger from '../parsers/w3x/wct/customtexttrigger';

/**
 * The data needed to convert one map.
 */
class WeuConverterData {
  /**
   * @param {TriggerData} triggerData
   */
  constructor(triggerData) {
    /** @member {TriggerData} */
    this.triggerData = triggerData;
    /** @member {?War3MapWts} */
    this.stringTable = null;
    /** @member {Array<Trigger|ECA|Parameter|SubParameters>} */
    this.stack = [];
    /** @member {Object<string, number>} */
    this.generatedNames = {};
    /** @member {Array<string>} */
    this.generatedFunctions = [];
    /** @member {Object<string, boolean>} */
    this.preplacedObjects = {};
    /** @member {Object} */
    this.output = {ok: false, error: '', changes: []};
  }
}

/**
 * Every time a reference to a preplaced object is encountered while testing the GUI, this will be called with isGUI being true.
 * Every time a reference to a preplaced object is converted to custom script, this will be called with isGUI being false.
 * This is used to track references that existed in GUI before the conversion, but that will be only in custom scripts afterwards.
 * References that are lost due to the conversion are then added in a new trigger called PreplacedObjectReferences.
 *
 * @param {WeuConverterData} data
 * @param {string} name
 * @param {boolean} isGUI
 */
function updateGUIRef(data, name, isGUI) {
  // For now track only units and destructibles.
  // Not sure what else needs tracking.
  if (name.startsWith('gg_unit') || name.startsWith('gg_dest')) {
    let preplacedObjects = data.preplacedObjects;

    // If the reference is already known to be used by GUI, no need to do anything.
    if (!preplacedObjects[name]) {
      preplacedObjects[name] = isGUI;
    }
  }
}

/**
 * @param {Array<Trigger|ECA|Parameter|SubParameters>} stack
 * @return {string}
 */
function stackToString(stack) {
  return stack.map((object) => {
    if (object instanceof Trigger) {
      return `Trigger ${object.name}`;
    } else if (object instanceof ECA || object instanceof SubParameters) {
      return object.name;
    } else if (object instanceof Parameter) {
      return object.value;
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

  eca.type = 2; // Action

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
  return createCustomScriptOrCommentECA(script, false);
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
 * @param {WeuConverterData} data
 * @param {ECA|SubParameters} object
 * @return {string}
 */
function generateCallbackName(data, object) {
  if (data.generatedNames[object.name] === undefined) {
    data.generatedNames[object.name] = 0;
  }

  let trigger = data.stack[data.stack.length - 1];

  // Convert non-ASCII characters to underlines, for locales other than en.
  let name = trigger.name.split('').map((value) => value.charCodeAt(0) > 127 ? '_' : value).join('');

  return `Trig_${name.replace(/\s/g, '_')}_Func${data.generatedNames[object.name]++}_${object.name}`.replace(/_+/g, '_');
}

/**
 * Converts an ECA or SubParameters to an array of custom script ECAs.
 * Also creates callbacks when needed, which are added to the map header.
 *
 * @param {WeuConverterData} data
 * @param {ECA|SubParameters} object
 * @return {string}
 */
function convertFunctionCallToCustomScript(data, object) {
  let ecas = [];
  let parameters = object.parameters;
  let {args, scriptName} = data.triggerData.getFunction(object.type, object.name);
  let name = object.name;
  let argCount = args.length;
  let isCode = false;
  let isBoolexpr = false;

  scriptName = scriptName || object.name;

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
    ecas.push(createCustomScriptECA(`if ${convertParameterToCustomScript(data, parameters[0], args[0])} then`));
    ecas.push(createCustomScriptECA(`call ${convertParameterToCustomScript(data, parameters[1], args[1])}`));
    ecas.push(createCustomScriptECA('else'));
    ecas.push(createCustomScriptECA(`call ${convertParameterToCustomScript(data, parameters[2], args[2])}`));
    ecas.push(createCustomScriptECA('endif'));
  } else if (name === 'OrMultiple') {
    ecas[0] = createCustomScriptECA(object.ecas.slice().map((eca) => convertFunctionCallToCustomScript(data, eca).map((eca) => eca.parameters[0].value)).join(' or '));
  } else if (name === 'ForLoopAMultiple') {
    ecas.push(createCustomScriptECA(`set bj_forLoopAIndex = ${convertParameterToCustomScript(data, parameters[0], args[0])}`));
    ecas.push(createCustomScriptECA(`set bj_forLoopAIndexEnd = ${convertParameterToCustomScript(data, parameters[1], args[1])}`));
    ecas.push(createCustomScriptECA('loop'));
    ecas.push(createCustomScriptECA('exitwhen bj_forLoopAIndex > bj_forLoopAIndexEnd'));

    for (let action of object.ecas) {
      let replacements = convertFunctionCallToCustomScript(data, action);

      for (let replacement of replacements) {
        ecas.push(createCustomScriptECA(`${replacement.parameters[0].value}`));
      }
    }

    ecas.push(createCustomScriptECA('endloop'));
  } else if (name === 'IfThenElseMultiple') {
    let condition;
    let thenActions = [];
    let elseActions = [];

    for (let eca of object.ecas) {
      if (eca.group === 0) {
        condition = eca;
      } else if (eca.group === 1) {
        thenActions.push(eca);
      } else if (eca.group === 2) {
        elseActions.push(eca);
      }
    }

    ecas.push(createCustomScriptECA(`if ${convertFunctionCallToCustomScript(data, condition)[0].parameters[0].value} then`));

    for (let action of thenActions) {
      let replacements = convertFunctionCallToCustomScript(data, action);

      for (let replacement of replacements) {
        ecas.push(createCustomScriptECA(`${replacement.parameters[0].value}`));
      }
    }

    if (elseActions.length) {
      ecas.push(createCustomScriptECA('else'));

      for (let action of elseActions) {
        let replacements = convertFunctionCallToCustomScript(data, action);

        for (let replacement of replacements) {
          ecas.push(createCustomScriptECA(`${replacement.parameters[0].value}`));
        }
      }
    }

    ecas.push(createCustomScriptECA('endif'));
  } else if (isCode || isBoolexpr) {
    let callbackName = generateCallbackName(data, object);
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

    let callParams = [...parameters.slice(0, lastParam).map((value, index) => convertParameterToCustomScript(data, value, args[index])), call];

    if (object instanceof ECA) {
      ecas.push(createCustomScriptECA(`call ${scriptName}(${callParams.join(', ')})`));
    } else {
      ecas.push(createCustomScriptECA(`${scriptName}(${callParams.join(', ')})`));
    }

    let callback;
    let body = '';

    if (isMultiple) {
      body = object.ecas.map((eca) => convertFunctionCallToCustomScript(data, eca).map((customScript) => customScript.parameters[0].value).join('\n')).join('\n');
    } else {
      body = `${callOrReturn} ${convertParameterToCustomScript(data, parameters[lastParam], args[lastParam])}`;
    }

    callback = `function ${callbackName} takes nothing returns ${returnType}\n${body}\nendfunction`;

    data.generatedFunctions.push(callback);
    data.output.changes.push({type: 'generatedfunction', stack: stackToString(data.stack), data: callback});
  } else if (name === 'CustomScriptCode') {
    ecas[0] = object;
  } else if (name === 'SetVariable') {
    ecas.push(createCustomScriptECA(`set ${convertParameterToCustomScript(data, parameters[0], args[0])} = ${convertParameterToCustomScript(data, parameters[1], args[1])}`));
  } else if (name === 'OperatorString') { // String concat
    ecas.push(createCustomScriptECA(`${convertParameterToCustomScript(data, parameters[0], args[0])} + ${convertParameterToCustomScript(data, parameters[1], args[1])}`));
  } else if (name.startsWith('Operator')) { // All other operators?
    ecas.push(createCustomScriptECA(`${convertParameterToCustomScript(data, parameters[0], args[0])} ${convertParameterToCustomScript(data, parameters[1], args[1])} ${convertParameterToCustomScript(data, parameters[2], args[2])}`));
  } else if (object instanceof ECA) {
    ecas.push(createCustomScriptECA(`call ${scriptName}(${parameters.map((value, index) => convertParameterToCustomScript(data, value, args[index])).join(', ')})`));
  } else if (object instanceof SubParameters) {
    ecas.push(createCustomScriptECA(`${scriptName}(${parameters.map((value, index) => convertParameterToCustomScript(data, value, args[index])).join(', ')})`));
  }

  return ecas;
}

/**
 * Converts a parameter to custom script.
 *
 * @param {WeuConverterData} data
 * @param {Parameter} parameter
 * @param {string} dataType
 * @return {string}
 */
function convertParameterToCustomScript(data, parameter, dataType) {
  let type = parameter.type;
  let value = parameter.value;

  // 0: preset
  // 1: variable
  // 2: function
  // 3: literal
  // -1: invalid
  if (type === 0) {
    return data.triggerData.getPreset(value);
  } else if (type === 1) {
    if (value.startsWith('gg_')) {
      // Used to track global generated variables and their status.
      updateGUIRef(data, value, false);

      return value;
    } else {
      if (parameter.isArray) {
        return `udg_${value}[${convertParameterToCustomScript(data, parameter.arrayIndex, 'integer')}]`;
      } else {
        return `udg_${value}`;
      }
    }
  } else if (parameter.type === 2) {
    return convertFunctionCallToCustomScript(data, parameter.subParameters)[0].parameters[0].value;
  } else if (parameter.type === 3) {
    let baseType = data.triggerData.getBaseType(dataType);

    // "value"
    // scriptcode needs to be converted as-is, and doesn't need quotes.
    if (baseType === 'string' && dataType !== 'scriptcode') {
      // Inline string table entries.
      if (value.startsWith('TRIGSTR')) {
        let index = parseInt(value.slice(8));
        let string = data.stringTable.stringMap.get(index).replace(/\n/g, '\\n');
        let callbackName = `StringTable${index}`;
        let callback = `function ${callbackName} takes nothing returns string\nreturn "${string}"\nendfunction`;

        data.generatedFunctions.push(callback);
        data.output.changes.push({type: 'generatedstringtable', stack: stackToString(data.stack), data: {value, callback}});

        return `${callbackName}()`;
      }

      return `"${value.replace(/\\/g, '\\\\')}"`;
    }

    // 'value'
    if (baseType === 'integer' && isNaN(value)) {
      return `'${value}'`;
    }

    // value
    return value;
  } else {
    return '';
  }
}

/**
 * Given a call to IsUnitOwnedByPlayer that is inside an OperatorCompareBoolean, replace it with GetOwningPlayer in an OperatorComparePlayer.
 * This will only happen if the boolean comparison was compared against "true" or "false".
 * If the comparison term is more complex, the replacement will be skipped.
 *
 * @param {SubParameters} object
 * @return {boolean}
 */
function replaceIsUnitOwned(object) {
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
function replaceIsUnitInRange(object) {
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
function replaceSetHeroStat(object) {
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
 * Given a TriggerRegisterUnitStateEvent call, replace it with TriggerRegisterUnitLifeEvent/TriggerRegisterUnitManaEvent.
 * WEU has both event and action variations for TriggerRegisterUnitStateEvent.
 * This handles only the event, while the actions will be converted to custom script.
 *
 * @param {ECA} object
 * @return {boolean}
 */
function replaceTriggerRegisterUnitStateEvent(object) {
  let state = object.parameters[1].value;

  if (state === 'UnitStateLife') {
    object.name = 'TriggerRegisterUnitLifeEvent';
  } else if (state === 'UnitStateMana') {
    object.name = 'TriggerRegisterUnitManaEvent';
  } else {
    throw new Error(`Trying to replace unit state "${state}"`);
  }

  // Remove the state parameter.
  object.parameters.splice(1, 1);

  return true;
}

/**
 * Given a IsUnitType call inside an OperatorCompareBoolean, with the type being UNIT_TYPE_DEAD, replace it with IsUnitDeadBJ.
 * This may or may not have side effects on the game in some situations. Warcraft 3 is weird.
 * That is the reasoning behind not changing this for non-conditions, since they can be converted to custom scripts.
 *
 * @param {ECA} object
 * @return {boolean}
 */
function replaceIsUnitType(object) {
  let parameter = object.parameters[0];
  let subParameters = parameter.subParameters;
  let unitType = subParameters.parameters[1].value;

  // Exposed in WEU and YDWE as UnitTypedead (with the typo).
  if (unitType.toLowerCase() !== 'unittypedead') {
    return false;
  }

  parameter.value = 'IsUnitDeadBJ';

  subParameters.name = 'IsUnitDeadBJ';
  subParameters.parameters.length = 1;

  return true;
}

/**
 * Given a IsUnitRace call inside an OperatorCompareBoolean, replace it with GetUnitRace inside an OperatorCompareRace.
 * This will only happen for a simple true/false comparison.
 *
 * @param {ECA} object
 * @return {boolean}
 */
function replaceIsUnitRace(object) {
  let trueOrFalse = object.parameters[2].value;

  if (trueOrFalse !== 'true' && trueOrFalse !== 'false') {
    return false;
  }

  object.name = 'OperatorCompareRace';

  let operator = object.parameters[1].value;
  let race = object.parameters[0].subParameters.parameters[1];

  // IsUnitRace -> GetUnitRace.
  object.parameters[0].value = 'GetUnitRace';
  object.parameters[0].subParameters.name = 'GetUnitRace';

  // Remove the race from GetUnitRace.
  object.parameters[0].subParameters.parameters.length = 1;

  // And add it instead to OperatorCompareRace.
  object.parameters[2] = race;

  let isEqual = operator === 'OperatorEqualENE';
  let isTrue = trueOrFalse === 'true';

  // Essentially a XOR between the booleans.
  if (isEqual === isTrue) {
    object.parameters[1].value = 'OperatorEqualENE';
  } else {
    object.parameters[1].value = 'OperatorNotEqualENE';
  }

  return true;
}

/**
 * The Warcraft 3 1.29 PTR introduced many new functions.
 * A lot were later prepended with Blz to avoid name clashes with user functions.
 * This returns whether the given name matches one of these functions.
 *
 * @param {string} name
 * @return {boolean}
 */
function isBlzNeeded(name) {
  return name === 'GetTriggerPlayerMouseX' || name === 'GetTriggerPlayerMouseY' || name === 'GetTriggerPlayerMousePosition' || name === 'GetTriggerPlayerMouseButton' ||
    name === 'SetAbilityTooltip' || name === 'SetAbilityExtendedTooltip' || name === 'SetAbilityResearchTooltip' || name === 'SetAbilityResearchExtendedTooltip' ||
    name === 'GetAbilityTooltip' || name === 'GetAbilityExtendedTooltip' || name === 'GetAbilityResearchTooltip' || name === 'GetAbilityResearchExtendedTooltip' ||
    name === 'SetAbilityIcon' || name === 'GetAbilityIcon' || name === 'GetAbilityPosX' || name === 'GetAbilityPosY' || name === 'SetAbilityPosX' || name === 'SetAbilityPosY' ||
    name === 'GetUnitMaxHP' || name === 'SetUnitMaxHP' || name === 'GetUnitMaxMana' || name === 'SetUnitMaxMana' || name === 'SetItemName' || name === 'SetItemDescription' ||
    name === 'GetItemDescription' || name === 'SetItemTooltip' || name === 'GetItemTooltip' || name === 'SetItemExtendedTooltip' || name === 'GetItemExtendedTooltip' ||
    name === 'SetItemIconPath' || name === 'GetItemIconPath' || name === 'SetUnitName' || name === 'SetHeroProperName' || name === 'GetUnitBaseDamage' ||
    name === 'SetUnitBaseDamage' || name === 'GetUnitDiceNumber' || name === 'SetUnitDiceNumber' || name === 'GetUnitDiceSides' || name === 'SetUnitDiceSides' ||
    name === 'GetUnitAttackCooldown' || name === 'SetUnitAttackCooldown' || name === 'SetSpcialEffectColorByPlayer' || name === 'SetSpecialEffectColor' ||
    name === 'SetSpecialEffectAlpha' || name === 'SetSpecialEffectScale' || name === 'SetSpecialEffectPosition' || name === 'SetSpecialEffectHeight' ||
    name === 'SetSpecialEffectTimeScale' || name === 'SetSpecialEffectTime' || name === 'SetSpecialEffectOrientation' || name === 'SetSpecialEffectYaw' ||
    name === 'SetSpecialEffectPitch' || name === 'SetSpecialEffectRoll' || name === 'SetSpecialEffectX' || name === 'SetSpecialEffectY' || name === 'SetSpecialEffectZ' ||
    name === 'SetSpecialEffectPositionLoc' || name === 'GetLocalSpecialEffectX' || name === 'GetLocalSpecialEffectY' || name === 'GetLocalSpecialEffectZ' ||
    name === 'GetUnitArmor' || name === 'SetUnitArmor' || name === 'UnitHideAbility' || name === 'UnitDisableAbility' || name === 'UnitCancelTimedLife' ||
    name === 'IsUnitSelectable' || name === 'IsUnitInvulnerable' || name === 'UnitInterruptAttack' || name === 'GetUnitCollisionSize' || name === 'GetAbilityManaCost' ||
    name === 'GetAbilityCooldown' || name === 'SetUnitAbilityCooldown' || name === 'GetUnitAbilityCooldown' || name === 'GetUnitAbilityCooldownRemaining' ||
    name === 'EndUnitAbilityCooldown' || name === 'GetUnitAbilityManaCost' || name === 'SetEventDamage' ||
    // Note, the following two functions are available in the 1.29 PTR, but not in the public version!
    // They require version 1.30, which at the time of writing is in PTR.
    name === 'PlaySpecialEffect' || name === 'PlaySpecialEffectWithTimeScale';
}

/**
 * Try to find extended GUI that can be converted back to GUI.
 * This involves finding specific functions and cases where native function can be emulated via GUI functions.
 * This can avoid having to convert the extended GUI to custom script.
 * It's both nicer, and in the case of top-level events and conditions can avoid having to convert whole triggers.
 *
 * @param {WeuConverterData} data
 * @param {ECA|SubParameters} object
 * @return {boolean}
 */
function convertInlineGUI(data, object) {
  let name = object.name;

  if (name === 'OperatorCompareBoolean') {
    let value = object.parameters[0].value;

    if (value === 'IsUnitOwnedByPlayer') {
      return replaceIsUnitOwned(object);
    } else if (value === 'IsUnitInRange') {
      return replaceIsUnitInRange(object);
    } else if (value === 'IsUnitType' && object.group === -1) {
      return replaceIsUnitType(object);
    } else if (value === 'IsUnitRace') {
      return replaceIsUnitRace(object);
    }
  } else if (name === 'SetHeroStr' || name === 'SetHeroAgi' || name === 'SetHeroInt') {
    return replaceSetHeroStat(object);
  } else if (name === 'TriggerRegisterUnitStateEvent') {
    return replaceTriggerRegisterUnitStateEvent(object);
  } else if (isBlzNeeded(name)) {
    object.name = `Blz${name}`;

    // If this is a subparameters object, need to change the name also for the parent parameter.
    if (object instanceof SubParameters) {
      data.stack[1].value = `Blz${name}`;
    }

    // In the PTR this has 3 parameters, but later it became 2.
    if (name === 'GetAbilityIcon' || name === 'SetAbilityIcon') {
      object.parameters.pop();
    }

    return true;
  }

  return false;
}

/**
 * @param {WeuConverterData} data
 * @param {ECA|SubParameters} object
 * @return {boolean}
 */
function testFunctionCall(data, object) {
  // Check if this object can be converted back to normal GUI.
  // If it's already normal GUI, nothing will happen.
  if (convertInlineGUI(data, object)) {
    data.output.changes.push({type: 'inlinegui', stack: stackToString(data.stack)});
  }

  // If this function is not from normal GUI, it has to be converted.
  if (!data.triggerData.isBaseFunction(object.type, object.name)) {
    return true;
  }

  // Check the parameters.
  // Note that they will also be checked if GUI was inlined.
  // This is needed, because the inline functions don't check the parameters, only move them around.
  for (let parameter of object.parameters) {
    // Check for custom presets.
    if (parameter.type === 0 && data.triggerData.isCustomPreset(parameter.value)) {
      return true;
    }

    if (testParameter(data, parameter)) {
      return true;
    }
  }

  return false;
}

/**
 * @param {WeuConverterData} data
 * @param {SubParameters} subParameters
 * @return {boolean}
 */
function testSubParameters(data, subParameters) {
  data.stack.unshift(subParameters);

  if (testFunctionCall(data, subParameters)) {
    data.stack.shift();
    return true;
  }

  data.stack.shift();
  return false;
}

/**
 * @param {WeuConverterData} data
 * @param {Parameter} parameter
 * @return {boolean}
 */
function testParameter(data, parameter) {
  data.stack.unshift(parameter);

  let type = parameter.type;
  let value = parameter.value;

  if (type === 1) {
    if (value.startsWith('gg_')) {
      // Used to track global generated variables and their status.
      updateGUIRef(data, value, true);
    }
  } else if (type === 2) {
    if (testSubParameters(data, parameter.subParameters)) {
      data.stack.shift();
      return true;
    }
  }

  data.stack.shift();
  return false;
}

/**
 * Given the name of the parent of some child ECA, and the child's group, determine if it's a condition.
 *
 * @param {string} name
 * @param {number} group
 * @return {boolean}
 */
function isConditionECA(name, group) {
  if (group !== 0) {
    return false;
  }

  return name === 'AndMultiple' || name === 'OrMultiple' || name === 'IfThenElseMultiple';
}

/**
 * @param {SubParameters} subParameters
 * @param {number} group
 * @return {ECA}
 */
function subParametersToEca(subParameters, group) {
  let eca = new ECA();

  eca.name = subParameters.name;
  eca.type = subParameters.type;
  eca.group = group;
  eca.isEnabled = 1;
  eca.parameters.push(...subParameters.parameters);

  return eca;
}

/**
 * @param {WeuConverterData} data
 * @param {ECA} eca
 * @return {boolean}
 */
function convertSingleEcaToMultple(data, eca) {
  if (eca.name === 'IfThenElse') {
    let parameters = eca.parameters;
    let ifParam = subParametersToEca(parameters[0].subParameters, 0);
    let thenParam = subParametersToEca(parameters[1].subParameters, 1);
    let elseParam = subParametersToEca(parameters[2].subParameters, 2);

    eca.name = 'IfThenElseMultiple';
    eca.parameters.length = 0;
    eca.ecas.push(ifParam, thenParam, elseParam);

    return true;
  } else if (eca.name === 'ForGroup' || eca.name === 'ForForce') {
    let action = subParametersToEca(eca.parameters[1].subParameters, 0);

    eca.name = `${eca.name}Multiple`;
    eca.parameters.length = 1;
    eca.ecas.push(action);

    return true;
  }

  return false;
}

/**
 * @param {WeuConverterData} data
 * @param {ECA} eca
 * @return {boolean}
 */
function testECA(data, eca) {
  data.stack.unshift(eca);

  // Test if this function call, or anything down its hierarchy, needs to be converted to custom script.
  if (testFunctionCall(data, eca)) {
    // If conversion is needed, try first to see if this is a RoC control flow ECA, and convert it to its TFT equivalent.
    // This includes things like IfThenElse (RoC) and IfThenElseMultiple (TFT).
    // This allows to potentially only convert to custom script one part of the control flow block, rather than all of it.
    if (convertSingleEcaToMultple(data, eca)) {
      // If the test passes here (that is, false is returned), the TFT conversion allowed to handle the conversion down the hierarchy.
      // In this case, this ECA no longer needs to be converted to custom script.
      if (testFunctionCall(data, eca)) {
        data.stack.shift();
        return true;
      } else {
        data.output.changes.push({type: 'singletomultiple', stack: stackToString(data.stack)});
      }
    } else {
      data.stack.shift();
      return true;
    }
  }

  let outputEcas = [];

  // Test the child ECAs if there are any.
  for (let child of eca.ecas) {
    if (testECA(data, child)) {
      let customScripts;

      // If this is a condition ECA, make a custom script condition.
      if (isConditionECA(eca.name, child.group)) {
        let condition = convertFunctionCallToCustomScript(data, child)[0].parameters[0].value;

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
        customScripts = convertFunctionCallToCustomScript(data, child);
      }

      // All of the custom scripts should be in the same group as the original child.
      for (let script of customScripts) {
        script.group = child.group;
      }

      data.output.changes.push({type: 'inlinecustomscript', stack: stackToString(data.stack), data: customScripts.map((eca) => eca.parameters[0].value).join('\n')});
      outputEcas.push(...customScripts);
    } else {
      outputEcas.push(child);
    }
  }

  eca.ecas = outputEcas;

  data.stack.shift();
  return false;
}

/**
 * @param {WeuConverterData} data
 * @param {Trigger} trigger
 * @return {boolean}
 */
function testTrigger(data, trigger) {
  data.stack.unshift(trigger);

  let eventsAndConditions = [];
  let actions = [];

  for (let eca of trigger.ecas) {
    let type = eca.type;

    if (type === 0 || type === 1) {
      eventsAndConditions.push(eca);
    } else if (type === 2) {
      actions.push(eca);
    }
  }

  let outputEcas = [];

  for (let eventOrCondition of eventsAndConditions) {
    if (testECA(data, eventOrCondition)) {
      data.stack.shift();
      return true;
    }

    outputEcas.push(eventOrCondition);
  }

  for (let action of actions) {
    if (testECA(data, action)) {
      let customScripts = convertFunctionCallToCustomScript(data, action);

      data.output.changes.push({type: 'inlinecustomscript', stack: stackToString(data.stack), data: customScripts.map((eca) => eca.parameters[0].value).join('\n')});
      outputEcas.push(...customScripts);
    } else {
      outputEcas.push(action);
    }
  }

  trigger.ecas = outputEcas;

  data.stack.shift();
  return false;
}

/**
 * @param {wtg.File} triggerFile
 * @param {wct.File} customTextTriggerFile
 * @param {WeuConverterData} data
 */
function saveGUIRefs(triggerFile, customTextTriggerFile, data) {
  let references = [];

  // Get all of the references that are no longer references.
  for (let entry of Object.entries(data.preplacedObjects)) {
    if (!entry[1]) {
      references.push(entry[0]);
    }
  }

  // If there are indeed missing references, add them to a new trigger.
  if (references.length) {
    let trigger = new Trigger();
    trigger.name = 'PreplacedObjectReferences';
    trigger.isEnabled = 1;
    trigger.isInitiallyOff = 1;

    for (let reference of references) {
      let eca = new ECA();
      eca.type = 2;
      eca.isEnabled = 1;

      if (reference.startsWith('gg_unit')) {
        eca.name = 'RemoveUnit';
      } else if (reference.startsWith('gg_dest')) {
        eca.name = 'RemoveDestructable';
      }

      let parameter = new Parameter();
      parameter.type = 1;
      parameter.value = reference;

      eca.parameters[0] = parameter;

      trigger.ecas.push(eca);
    }

    triggerFile.triggers.push(trigger);
    customTextTriggerFile.triggers.push(new CustomTextTrigger());

    data.output.changes.push({type: 'references', data: references});
  }
}
/**
 * Convert extended GUI of a map back to something the World Editor can open.
 * The conversion depends on the given TriggerData object, which must be filled by the caller.
 * The conversion is in-place.
 *
 * @param {War3Map} map
 * @param {TriggerData} triggerData
 * @param {TriggerData} weTriggerData
 * @return {WeuConverterData}
 */
export default function convertWeu(map, triggerData, weTriggerData) {
  let triggerFile;
  let customTextTriggerFile;
  let data = new WeuConverterData(triggerData);
  let output = data.output;

  // Try to read the triggers file using the custom trigger data.
  try {
    triggerFile = map.readTriggers(triggerData);
  } catch (e) {
    output.error = `Failed to read the triggers file: ${e}`;
    return output;
  }

  // Try to read the custom text triggers file.
  try {
    customTextTriggerFile = map.readCustomTextTriggers();
  } catch (e) {
    output.error = `Failed to read the custom text triggers file: ${e}`;
    return output;
  }

  try {
    data.stringTable = map.readStringTable();
  } catch (e) {
    output.error = `Failed to read the string table file: ${e}`;
    return output;
  }

  // Test and convert the triggers as needed.
  for (let trigger of triggerFile.triggers) {
    try {
      if (testTrigger(data, trigger)) {
        // For now don't bother with converting whole triggers, since GUI conversions manage all of the maps I saw so far.
        output.error = `Trigger ${trigger.name} needs to be converted due to top-level event/condition, but full trigger conversion is not implemented yet`;
        return output;
      }
    } catch (e) {
      output.error = `Error at trigger ${trigger.name}: ${e}`;
      return output;
    }
  }

  // WE will only generate global variables for preplaced objects that are referenced directly by GUI.
  // Referencing them in custom text ECAs or custom text triggers doesn't cut it.
  // This function saves such references if they are deemed to be lost due to the conversion.
  // It does this by adding a new trigger called PreplacedObjectReferences, which is not initially on.
  // In it an ECA is added for each reference.
  // Note that this is not the case for all preplaced objects.
  // For example, triggers and regions seem to always be available.
  // For now only units and destructibles are checked.
  saveGUIRefs(triggerFile, customTextTriggerFile, data);

  // If there are generated functions, add them to the custom text triggers file.
  if (data.generatedFunctions.length) {
    for (let generatedFunction of data.generatedFunctions) {
      customTextTriggerFile.trigger.text += `\r\n${generatedFunction.replace(/\n/g, '\r\n')}`;
    }
  }

  // Save the triggers file back.
  map.set('war3map.wtg', triggerFile.save());

  // Save the custom text triggers file back.
  map.set('war3map.wct', customTextTriggerFile.save());

  // Now try to re-read the triggers file, but using the normal WE trigger data.
  // If this fails, WE will fail too.
  try {
    map.readTriggers(weTriggerData);
  } catch (e) {
    output.error = `Failed to validate the triggers file: ${e}`;
    return output;
  }

  output.ok = true;
  return output;
}
