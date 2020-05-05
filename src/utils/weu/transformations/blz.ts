import ECA from '../../../parsers/w3x/wtg/eca';
import Parameter from '../../../parsers/w3x/wtg/parameter';
import SubParameters from '../../../parsers/w3x/wtg/subparameters';
import WeuData from '../data';

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

export default function transformBlz(data: WeuData, object: ECA | SubParameters) {
  let name = object.name;

  if (!isBlzNeeded(name)) {
    return false;
  }

  object.name = `Blz${name}`;

  // If this is a subparameters object, need to change the name also for the parent parameter.
  if (object instanceof SubParameters) {
    (<Parameter>data.stack[1]).value = `Blz${name}`;
  }

  let parameters = object.parameters;

  // In the PTR these functions had 3 parameters, but later it became 2.
  if ((name === 'GetAbilityIcon' || name === 'SetAbilityIcon') && parameters.length === 3) {
    parameters.pop();
  }

  return true;
}
