import ECA from '../../parsers/w3x/wtg/eca';
import Parameter from '../../parsers/w3x/wtg/parameter';
import SubParameters from '../../parsers/w3x/wtg/subparameters';
import WeuData from './data';
import { convertParameterInline } from './conversions';

function rename(name: string) {
  return function (data: WeuData, object: ECA | SubParameters) {
    object.name = name;

    return true;
  };
}

function swapParameters01(name: string) {
  return function (data: WeuData, object: ECA | SubParameters) {
    let parameters = object.parameters;

    object.name = name;
    [parameters[0], parameters[1]] = [parameters[1], parameters[0]];

    return true;
  };
}

function swapParameters02(name: string) {
  return function (data: WeuData, object: ECA | SubParameters) {
    let parameters = object.parameters;

    object.name = name;
    [parameters[0], parameters[2]] = [parameters[2], parameters[0]];

    return true;
  };
}

function swapParameters0123(name: string) {
  return function (data: WeuData, object: ECA | SubParameters) {
    let parameters = object.parameters;

    object.name = name;
    [parameters[0], parameters[1], parameters[2], parameters[3]] = [parameters[3], parameters[2], parameters[1], parameters[0]];

    return true;
  };
}

function replaceSetHeroStrAgiInt(data: WeuData, object: ECA | SubParameters) {
  let parameters = object.parameters;
  let permanent = convertParameterInline(data, object.parameters[2], 'boolean');

  if (permanent !== 'true') {
    return false;
  }

  let name = object.name;
  let whichHero = parameters[0];
  let value = parameters[1];

  object.name = 'ModifyHeroStat';

  let whichStat = new Parameter();
  whichStat.type = 0; // preset
  whichStat.value = `HeroStat${name.slice(-3)}`;

  let modifyMethod = new Parameter();
  modifyMethod.type = 0; // preset
  modifyMethod.value = 'ModifyMethodSet';

  parameters[0] = whichStat;
  parameters[1] = whichHero;
  parameters[2] = modifyMethod;
  parameters[3] = value;

  return true;
}

function replaceTriggerRegisterUnitStateEvent(data: WeuData, object: ECA | SubParameters) {
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

function replaceOperatorCompareBoolean(data: WeuData, object: ECA | SubParameters) {
  let value = object.parameters[0].value;

  if (value === 'IsUnitOwnedByPlayer') {
    return replaceIsUnitOwned(data, object);
  } else if (value === 'IsUnitType') {
    return replaceIsUnitType(data, object);
  } else if (value === 'IsUnitRace') {
    return replaceIsUnitRace(data, object);
  }
}

const replacements = {
  UnitDamageTarget(data: WeuData, object: ECA | SubParameters) {
    let parameters = object.parameters;
    let attack = convertParameterInline(data, parameters[3], 'boolean');
    let ranged = convertParameterInline(data, parameters[4], 'boolean');
    let weaponType = convertParameterInline(data, parameters[7], 'weapontype');

    if (attack !== 'true' || ranged !== 'false' || weaponType !== 'WEAPON_TYPE_WHOKNOWS') {
      return false;
    }

    object.name = 'UnitDamageTargetBJ';

    // Remove the attack and ranged parameters.
    parameters.splice(3, 2);

    // Remove the weapon type paramter.
    parameters.length = 5;

    return true;
  },

  DecUnitAbilityLevel: swapParameters01('DecUnitAbilityLevelSwapped'),
  IncUnitAbilityLevel: swapParameters01('IncUnitAbilityLevelSwapped'),
  SetUnitAbilityLevel: swapParameters01('SetUnitAbilityLevelSwapped'),
  GetUnitAbilityLevel: swapParameters01('GetUnitAbilityLevelSwapped'),
  UnitAddItem: swapParameters01('UnitAddItemSwapped'),
  UnitRemoveItem: swapParameters01('UnitRemoveItemSwapped'),
  UnitRemoveAbility: swapParameters01('UnitRemoveAbilityBJ'),
  UnitAddAbility: swapParameters01('UnitAddAbilityBJ'),
  GetUnitState: swapParameters01('GetUnitStateSwap'),
  SetPlayerAbilityAvailable: swapParameters02('SetPlayerAbilityAvailableBJ'),
  PauseUnit: swapParameters01('PauseUnitBJ'),

  FogEnable(data: WeuData, object: ECA) {
    let parameters = object.parameters;
    let enable = convertParameterInline(data, parameters[0], 'boolean');

    if (enable !== 'true' && enable !== 'false') {
      return false;
    }

    if (enable === 'true') {
      object.name = 'FogEnableOn';
    } else {
      object.name = 'FogEnableOff';
    }

    parameters.length = 0;

    return true;
  },


  DialogDisplay: swapParameters02('DialogDisplayBJ'),
  DialogSetMessage: rename('DialogSetMessageBJ'),
  DialogClear: rename('DialogClearBJ'),
  GetClickedButton: rename('GetClickedButtonBJ'),
  GetClickedDialog: rename('GetClickedDialogBJ'),
  GroupAddUnit: swapParameters01('GroupAddUnitSimple'),
  GroupRemoveUnit: swapParameters01('GroupRemoveUnitSimple'),
  IsUnitHidden: rename('IsUnitHiddenBJ'),

  ShowUnit(data: WeuData, object: ECA) {
    let parameters = object.parameters;
    let show = convertParameterInline(data, parameters[1], 'boolean');

    if (show !== 'true' && show !== 'false') {
      return false;
    }

    if (show === 'true') {
      object.name = 'ShowUnitShow';
    } else {
      object.name = 'ShowUnitHide';
    }

    parameters.length = 1;

    return true;
  },

  TimerDialogDisplay: swapParameters01('TimerDialogDisplayBJ'),
  UnitApplyTimedLife: swapParameters02('UnitApplyTimedLifeBJ'),
  GetLearnedSkill: rename('GetLearnedSkillBJ'),

  GetRandomReal(data: WeuData, object: ECA | SubParameters) {
    let parameters = object.parameters;
    let lowBound = parseInt(convertParameterInline(data, parameters[0], 'integer'));
    let highBound = parseInt(convertParameterInline(data, parameters[1], 'integer'));

    if (lowBound === 0) {
      if (highBound === 360) {
        object.name = 'GetRandomDirectionDeg';
        parameters.length = 0;

        return true;
      } else if (highBound === 100) {
        object.name = 'GetRandomPercentageBJ';
        parameters.length = 0;

        return true;
      }
    }

    return false;
  },

  StoreReal: swapParameters0123('StoreRealBJ'),
  StoreInteger: swapParameters0123('StoreIntegerBJ'),

  SaveReal: swapParameters0123('SaveRealBJ'),
  SaveInteger: swapParameters0123('SaveIntegerBJ'),


  GetStoredReal: swapParameters02('GetStoredRealBJ'),
  GetStoredInteger: swapParameters02('GetStoredIntegerBJ'),

  LoadReal: swapParameters02('LoadRealBJ'),
  LoadInteger: swapParameters02('LoadIntegerBJ'),

  SetHeroStr: replaceSetHeroStrAgiInt,
  SetHeroAgi: replaceSetHeroStrAgiInt,
  SetHeroInt: replaceSetHeroStrAgiInt,

  TriggerRegisterUnitStateEvent: replaceTriggerRegisterUnitStateEvent,

  OperatorCompareBoolean: replaceOperatorCompareBoolean,
};

/**
 * Given a call to IsUnitOwnedByPlayer that is inside an OperatorCompareBoolean, replace it with GetOwningPlayer in an OperatorComparePlayer.
 * This will only happen if the boolean comparison was compared against "true" or "false".
 * If the comparison term is more complex, the replacement will be skipped.
 */
function replaceIsUnitOwned(data: WeuData, object: ECA | SubParameters) {
  let parameters = object.parameters;
  let trueOrFalse = convertParameterInline(data, parameters[2], 'boolean');

  if (trueOrFalse !== 'true' && trueOrFalse !== 'false') {
    return false;
  }

  object.name = 'OperatorComparePlayer';

  let isUnitOwned = <SubParameters>parameters[0].subParameters;
  let unit = isUnitOwned.parameters[0];
  let otherPlayer = isUnitOwned.parameters[1];

  // Change IsUnitOwnedByPlayer(unit, otherPlayer) to GetOwningPlayer(unit)
  parameters[0].value = 'GetOwningPlayer';
  isUnitOwned.name = 'GetOwningPlayer';
  isUnitOwned.parameters.length = 1;
  isUnitOwned.parameters[0] = unit;

  // Equal or not equal
  if (trueOrFalse === 'true') {
    parameters[1].value = 'OperatorEqualENE';
  } else {
    parameters[1].value = 'OperatorNotEqualENE';
  }

  // Change false/true to otherPlayer
  parameters[2] = otherPlayer;

  return true;
}

/**
 * Given a IsUnitType call inside an OperatorCompareBoolean, with the type being UNIT_TYPE_DEAD, replace it with IsUnitDeadBJ.
 * This may or may not have side effects on the game in some situations. Warcraft 3 is weird.
 * That is the reasoning behind not changing this for non-conditions, since they can be converted to custom scripts.
 */
function replaceIsUnitType(data: WeuData, object: ECA | SubParameters) {
  let parameter = object.parameters[0];
  let subParameters = <SubParameters>parameter.subParameters;
  let unitType = convertParameterInline(data, subParameters.parameters[1], 'unittype');

  if (unitType !== 'UNIT_TYPE_DEAD') {
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
 */
function replaceIsUnitRace(data: WeuData, object: ECA | SubParameters) {
  let parameters = object.parameters;
  let trueOrFalse = convertParameterInline(data, parameters[2], 'boolean');

  if (trueOrFalse !== 'true' && trueOrFalse !== 'false') {
    return false;
  }

  object.name = 'OperatorCompareRace';

  let operator = parameters[1].value;
  let getUnitRace = <SubParameters>parameters[0].subParameters;
  let race = getUnitRace.parameters[1];

  // IsUnitRace -> GetUnitRace.
  parameters[0].value = 'GetUnitRace';
  getUnitRace.name = 'GetUnitRace';

  // Remove the race from GetUnitRace.
  getUnitRace.parameters.length = 1;

  // And add it instead to OperatorCompareRace.
  parameters[2] = race;

  let isEqual = operator === 'OperatorEqualENE';
  let isTrue = trueOrFalse === 'true';

  // Essentially a XOR between the booleans.
  if (isEqual === isTrue) {
    parameters[1].value = 'OperatorEqualENE';
  } else {
    parameters[1].value = 'OperatorNotEqualENE';
  }

  return true;
}

/**
 * The Warcraft 3 1.29 PTR introduced many new functions.
 * A lot were later prepended with Blz to avoid name clashes with user functions.
 * This returns whether the given name matches one of these functions.
 */
function isBlzNeeded(name: string) {
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

function replaceBlz(data: WeuData, object: ECA | SubParameters) {
  if (!isBlzNeeded(name)) {
    return false;
  }

  object.name = `Blz${name}`;

  // If this is a subparameters object, need to change the name also for the parent parameter.
  if (object instanceof SubParameters) {
    (<Parameter>data.stack[1]).value = `Blz${name}`;
  }

  let parameters = object.parameters;

  // In the PTR this had 3 parameters, but later it became 2.
  if ((name === 'GetAbilityIcon' || name === 'SetAbilityIcon') && parameters.length === 3) {
    parameters.pop();
  }

  return true;
}

/**
 * Try to find extended GUI that can be converted back to GUI.
 * This involves finding specific functions and cases where native function can be emulated via GUI functions.
 * This can avoid having to convert the extended GUI to custom script.
 * It's both nicer, and in the case of top-level events and conditions can avoid having to convert whole triggers.
 */
export default function replaceGUI(data: WeuData, object: ECA | SubParameters) {
  let replacement = replacements[object.name];

  if (replacement) {
    return replacement(data, object);
  }

  return replaceBlz(data, object);
}
