// Stop the linter from complaining about uppercase function names.
/* eslint new-cap: "off" */

import {base256ToString} from '../../common/typecast';
import sstrhash2 from '../../common/sstrhash2';

// import JassHandle from './types/handle';
// import JassAgent from './types/agent';
// import JassEvent from './types/event';
// import JassPlayer from './types/player';
// import JassWidget from './types/widget';
import JassUnit from './types/unit';
// import JassDestructable from './types/destructable';
// import JassItem from './types/item';
// import JassAbility from './types/ability';
// import JassBuff from './types/buff';
import JassForce from './types/force';
import JassGroup from './types/group';
import JassTrigger from './types/trigger';
// import JassTriggerCondition from './types/triggercondition';
// import JassTriggerAction from './types/triggeraction';
import JassTimer from './types/timer';
import JassLocation from './types/location';
import JassRegion from './types/region';
import JassRect from './types/rect';
// import JassBoolexpr from './types/boolexpr';
// import JassSound from './types/sound';
// import JassConditionFunc from './types/conditionfunc';
// import JassFilterFunc from './types/filterfunc';
// import JassUnitPool from './types/unitpool';
// import JassItemPool from './types/itempool';
// import JassRace from './types/race';
// import JassAllianceType from './types/alliancetype';
// import JassRacePreference from './types/racepreference';
// import JassGameState from './types/gamestate';
// import JassIGameState from './types/igamestate';
// import JassFGameState from './types/fgamestate';
// import JassPlayerState from './types/playerstate';
// import JassPlayerScore from './types/playerscore';
// import JassPlayerGameResult from './types/playergameresult';
// import JassUnitState from './types/unitstate';
// import JassAiDifficulty from './types/aidifficulty';
// import JassEventId from './types/eventid';
// import JassGameEvent from './types/gameevent';
// import JassPlayerEvent from './types/playerevent';
// import JassPlayerUnitEvent from './types/playerunitevent';
// import JassUnitEvent from './types/unitevent';
// import JassLimitOp from './types/limitop';
// import JassWidgetEvent from './types/widgetevent';
// import JassDialogEvent from './types/dialogevent';
// import JassUnitType from './types/unittype';
// import JassGameSpeed from './types/gamespeed';
// import JassGameDifficulty from './types/gamedifficulty';
// import JassGameType from './types/gametype';
// import JassMapFlag from './types/mapflag';
// import JassMapVisibility from './types/mapvisibility';
// import JassMapSetting from './types/mapsetting';
// import JassMapDensity from './types/mapdensity';
// import JassMapControl from './types/mapcontrol';
// import JassPlayerSlotState from './types/playerslotstate';
// import JassVolumeGroup from './types/volumegroup';
// import JassCameraField from './types/camerafield';
import JassCameraSetup from './types/camerasetup';
// import JassPlayerColor from './types/playercolor';
// import JassPlacement from './types/placement';
// import JassStartLocPrio from './types/startlocprio';
// import JassRarityControl from './types/raritycontrol';
// import JassBlendMode from './types/blendmode';
// import JassTexMapFlags from './types/texmapflags';
// import JassEffect from './types/effect';
// import JassEffectType from './types/effecttype';
import JassWeatherEffect from './types/weathereffect';
// import JassTerrainDeformation from './types/terraindeformation';
// import JassFogState from './types/fogstate';
// import JassFogModifier from './types/fogmodifier';
// import JassDialog from './types/dialog';
// import JassButton from './types/button';
// import JassQuest from './types/quest';
// import JassQuestItem from './types/questitem';
// import JassDefeatCondition from './types/defeatcondition';
// import JassTimerDialog from './types/timerdialog';
// import JassLeaderboard from './types/leaderboard';
// import JassMultiboard from './types/multiboard';
// import JassMultiboardItem from './types/multiboarditem';
// import JassTrackable from './types/trackable';
// import JassGameCache from './types/gamecache';
// import JassVersion from './types/version';
// import JassItemType from './types/itemtype';
// import JassTextTag from './types/texttag';
// import JassAttackType from './types/attacktype';
// import JassDamageType from './types/damagetype';
// import JassWeaponType from './types/weapontype';
// import JassSoundType from './types/soundtype';
// import JassLightning from './types/lightning';
// import JassPathingType from './types/pathingtype';
// import JassImage from './types/image';
// import JassUbersplat from './types/ubersplat';
import JassHashTable from './types/hashtable';

/**
 * constant native ConvertRace takes integer i returns race
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassRace}
 */
export function ConvertRace(jass, i) {
  return jass.constantHandles.races[i];
}

/**
 * constant native ConvertAllianceType takes integer i returns alliancetype
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassAllianceType}
 */
export function ConvertAllianceType(jass, i) {
  return jass.constantHandles.allianceTypes[i];
}

/**
 * constant native ConvertRacePref takes integer i returns racepreference
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassRacePreference}
 */
export function ConvertRacePref(jass, i) {
  return jass.constantHandles.racePreferences[i];
}

/**
 * constant native ConvertIGameState takes integer i returns igamestate
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassIGameState}
 */
export function ConvertIGameState(jass, i) {
  return jass.constantHandles.iGameStates[i];
}

/**
 * constant native ConvertFGameState takes integer i returns fgamestate
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassFGameState}
 */
export function ConvertFGameState(jass, i) {
  return jass.constantHandles.fGameStates[i];
}

/**
 * constant native ConvertPlayerState takes integer i returns playerstate
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassPlayerState}
 */
export function ConvertPlayerState(jass, i) {
  return jass.constantHandles.playerStates[i];
}

/**
 * constant native ConvertPlayerScore takes integer i returns playerscore
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassPlayerScore}
 */
export function ConvertPlayerScore(jass, i) {
  return jass.constantHandles.playerScores[i];
}

/**
 * constant native ConvertPlayerGameResult takes integer i returns playergameresult
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassPlayerGameResult}
 */
export function ConvertPlayerGameResult(jass, i) {
  return jass.constantHandles.playerGameResults[i];
}

/**
 * constant native ConvertUnitState takes integer i returns unitstate
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassUnitState}
 */
export function ConvertUnitState(jass, i) {
  return jass.constantHandles.unitStates[i];
}

/**
 * constant native ConvertAIDifficulty takes integer i returns aidifficulty
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassAiDifficulty}
 */
export function ConvertAIDifficulty(jass, i) {
  return jass.constantHandles.aiDifficulties[i];
}

/**
 * constant native ConvertGameEvent takes integer i returns gameevent
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassGameEvent}
 */
export function ConvertGameEvent(jass, i) {
  return jass.constantHandles.events[i];
}

/**
 * constant native ConvertPlayerEvent takes integer i returns playerevent
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassPlayerEvent}
 */
export function ConvertPlayerEvent(jass, i) {
  return jass.constantHandles.events[i];
}

/**
 * constant native ConvertPlayerUnitEvent takes integer i returns playerunitevent
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassPlayerUnitEvent}
 */
export function ConvertPlayerUnitEvent(jass, i) {
  return jass.constantHandles.events[i];
}

/**
 * constant native ConvertWidgetEvent takes integer i returns widgetevent
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassWidgetEvent}
 */
export function ConvertWidgetEvent(jass, i) {
  return jass.constantHandles.events[i];
}

/**
 * constant native ConvertDialogEvent takes integer i returns dialogevent
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassDialogEvent}
 */
export function ConvertDialogEvent(jass, i) {
  return jass.constantHandles.events[i];
}

/**
 * constant native ConvertUnitEvent takes integer i returns unitevent
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassUnitEvent}
 */
export function ConvertUnitEvent(jass, i) {
  return jass.constantHandles.events[i];
}

/**
 * constant native ConvertLimitOp takes integer i returns limitop
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassLimitOp}
 */
export function ConvertLimitOp(jass, i) {
  return jass.constantHandles.limitOps[i];
}

/**
 * constant native ConvertUnitType takes integer i returns unittype
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassUnitType}
 */
export function ConvertUnitType(jass, i) {
  return jass.constantHandles.unitTypes[i];
}

/**
 * constant native ConvertGameSpeed takes integer i returns gamespeed
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassGameSpeed}
 */
export function ConvertGameSpeed(jass, i) {
  return jass.constantHandles.gameSpeeds[i];
}

/**
 * constant native ConvertPlacement takes integer i returns placement
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassPlacement}
 */
export function ConvertPlacement(jass, i) {
  return jass.constantHandles.placements[i];
}

/**
 * constant native ConvertStartLocPrio takes integer i returns startlocprio
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassStartLocPrio}
 */
export function ConvertStartLocPrio(jass, i) {
  return jass.constantHandles.startLocPrios[i];
}

/**
 * constant native ConvertGameDifficulty takes integer i returns gamedifficulty
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassGameDifficulty}
 */
export function ConvertGameDifficulty(jass, i) {
  return jass.constantHandles.gameDifficulties[i];
}

/**
 * constant native ConvertGameType takes integer i returns gametype
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassGameType}
 */
export function ConvertGameType(jass, i) {
  return jass.constantHandles.gameTypes[i];
}

/**
 * constant native ConvertMapFlag takes integer i returns mapflag
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassMapFlag}
 */
export function ConvertMapFlag(jass, i) {
  return jass.constantHandles.mapFlags[i];
}

/**
 * constant native ConvertMapVisibility takes integer i returns mapvisibility
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassMapVisibility}
 */
export function ConvertMapVisibility(jass, i) {
  return jass.constantHandles.mapVisibilities[i];
}

/**
 * constant native ConvertMapSetting takes integer i returns mapsetting
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassMapSetting}
 */
export function ConvertMapSetting(jass, i) {
  return jass.constantHandles.mapSettings[i];
}

/**
 * constant native ConvertMapDensity takes integer i returns mapdensity
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassMapDensity}
 */
export function ConvertMapDensity(jass, i) {
  return jass.constantHandles.mapDensities[i];
}

/**
 * constant native ConvertMapControl takes integer i returns mapcontrol
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassMapControl}
 */
export function ConvertMapControl(jass, i) {
  return jass.constantHandles.mapControls[i];
}

/**
 * constant native ConvertPlayerColor takes integer i returns playercolor
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassPlayerColor}
 */
export function ConvertPlayerColor(jass, i) {
  return jass.constantHandles.playerColors[i];
}

/**
 * constant native ConvertPlayerSlotState takes integer i returns playerslotstate
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassPlayerSlotState}
 */
export function ConvertPlayerSlotState(jass, i) {
  return jass.constantHandles.playerSlotStates[i];
}

/**
 * constant native ConvertVolumeGroup takes integer i returns volumegroup
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassVolumeGroup}
 */
export function ConvertVolumeGroup(jass, i) {
  return jass.constantHandles.volumeGroups[i];
}

/**
 * constant native ConvertCameraField takes integer i returns camerafield
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassCameraField}
 */
export function ConvertCameraField(jass, i) {
  return jass.constantHandles.cameraFields[i];
}

/**
 * constant native ConvertBlendMode takes integer i returns blendmode
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassBlendMode}
 */
export function ConvertBlendMode(jass, i) {
  return jass.constantHandles.blendModes[i];
}

/**
 * constant native ConvertRarityControl takes integer i returns raritycontrol
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassRarityControl}
 */
export function ConvertRarityControl(jass, i) {
  return jass.constantHandles.rarityControls[i];
}

/**
 * constant native ConvertTexMapFlags takes integer i returns texmapflags
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassTexMapFlags}
 */
export function ConvertTexMapFlags(jass, i) {
  return jass.constantHandles.texMapFlags[i];
}

/**
 * constant native ConvertFogState takes integer i returns fogstate
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassFogState}
 */
export function ConvertFogState(jass, i) {
  return jass.constantHandles.fogStates[i];
}

/**
 * constant native ConvertEffectType takes integer i returns effecttype
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassEffectType}
 */
export function ConvertEffectType(jass, i) {
  return jass.constantHandles.effectTypes[i];
}

/**
 * constant native ConvertVersion takes integer i returns version
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassVersion}
 */
export function ConvertVersion(jass, i) {
  return jass.constantHandles.versions[i];
}

/**
 * constant native ConvertItemType takes integer i returns itemtype
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassItemType}
 */
export function ConvertItemType(jass, i) {
  return jass.constantHandles.itemTypes[i];
}

/**
 * constant native ConvertAttackType takes integer i returns attacktype
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassAttackType}
 */
export function ConvertAttackType(jass, i) {
  return jass.constantHandles.attackTypes[i];
}

/**
 * constant native ConvertDamageType takes integer i returns damagetype
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassDamageType}
 */
export function ConvertDamageType(jass, i) {
  return jass.constantHandles.damageTypes[i];
}

/**
 * constant native ConvertWeaponType takes integer i returns weapontype
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassWeaponType}
 */
export function ConvertWeaponType(jass, i) {
  return jass.constantHandles.weaponTypes[i];
}

/**
 * constant native ConvertSoundType takes integer i returns soundtype
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassSoundType}
 */
export function ConvertSoundType(jass, i) {
  return jass.constantHandles.soundTypes[i];
}

/**
 * constant native ConvertPathingType takes integer i returns pathingtype
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {JassPathingType}
 */
export function ConvertPathingType(jass, i) {
  return jass.constantHandles.pathingTypes[i];
}

// /**
//  * constant native OrderId takes string orderIdString returns integer
//  *
//  * @param {JassContext} jass
//  * @param {string} orderIdString
//  * @return {number}
//  */
// export function OrderId(jass, orderIdString) {}

// /**
//  * constant native OrderId2String takes integer orderId returns string
//  *
//  * @param {JassContext} jass
//  * @param {number} orderId
//  * @return {string}
//  */
// export function OrderId2String(jass, orderId) {}

// /**
//  * constant native UnitId takes string unitIdString returns integer
//  *
//  * @param {JassContext} jass
//  * @param {string} unitIdString
//  * @return {number}
//  */
// export function UnitId(jass, unitIdString) {}

// /**
//  * constant native UnitId2String takes integer unitId returns string
//  *
//  * @param {JassContext} jass
//  * @param {number} unitId
//  * @return {string}
//  */
// export function UnitId2String(jass, unitId) {}

// /**
//  * constant native AbilityId takes string abilityIdString returns integer
//  *
//  * @param {JassContext} jass
//  * @param {string} abilityIdString
//  * @return {number}
//  */
// export function AbilityId(jass, abilityIdString) {}

// /**
//  * constant native AbilityId2String takes integer abilityId returns string
//  *
//  * @param {JassContext} jass
//  * @param {number} abilityId
//  * @return {string}
//  */
// export function AbilityId2String(jass, abilityId) {}

// /**
//  * constant native GetObjectName takes integer objectId returns string
//  *
//  * @param {JassContext} jass
//  * @param {number} objectId
//  * @return {string}
//  */
// export function GetObjectName(jass, objectId) {}

/**
 * constant native GetBJMaxPlayers takes nothing returns integer
 *
 * @param {JassContext} jass
 * @return {number}
 */
export function GetBJMaxPlayers(jass) {
  //For now hardcoded for 1.29+
  return 28;
}

/**
 * constant native GetBJMaxPlayers takes nothing returns integer
 *
 * @param {JassContext} jass
 * @return {number}
 */
export function GetBJPlayerNeutralVictim(jass) {
  //For now hardcoded for 1.29+
  return 24;
}

/**
 * constant native GetBJMaxPlayers takes nothing returns integer
 *
 * @param {JassContext} jass
 * @return {number}
 */
export function GetBJPlayerNeutralExtra(jass) {
  //For now hardcoded for 1.29+
  return 25;
}

/**
 * constant native GetBJMaxPlayers takes nothing returns integer
 *
 * @param {JassContext} jass
 * @return {number}
 */
export function GetBJMaxPlayerSlots(jass) {
  //For now hardcoded for 1.29+
  return 24;
}

/**
 * constant native GetBJMaxPlayers takes nothing returns integer
 *
 * @param {JassContext} jass
 * @return {number}
 */
export function GetPlayerNeutralPassive(jass) {
  //For now hardcoded for 1.29+
  return 26;
}

/**
 * constant native GetBJMaxPlayers takes nothing returns integer
 *
 * @param {JassContext} jass
 * @return {number}
 */
export function GetPlayerNeutralAggressive(jass) {
  //For now hardcoded for 1.29+
  return 27;
}

/**
 * native Deg2Rad takes real degrees returns real
 *
 * @param {JassContext} jass
 * @param {number} degrees
 * @return {number}
 */
export function Deg2Rad(jass, degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * native Rad2Deg takes real radians returns real
 *
 * @param {JassContext} jass
 * @param {number} radians
 * @return {number}
 */
export function Rad2Deg(jass, radians) {
  return radians * (180 / Math.PI);
}

/**
 * native Sin takes real radians returns real
 *
 * @param {JassContext} jass
 * @param {number} radians
 * @return {number}
 */
export function Sin(jass, radians) {
  return Math.sin(radians);
}

/**
 * native Cos takes real radians returns real
 *
 * @param {JassContext} jass
 * @param {number} radians
 * @return {number}
 */
export function Cos(jass, radians) {
  return Math.cos(radians);
}

/**
 * native Tan takes real radians returns real
 *
 * @param {JassContext} jass
 * @param {number} radians
 * @return {number}
 */
export function Tan(jass, radians) {
  return Math.tan(radians);
}

/**
 * native Asin takes real y returns real
 *
 * @param {JassContext} jass
 * @param {number} y
 * @return {number}
 */
export function Asin(jass, y) {
  return Math.asin(y);
}

/**
 * native Acos takes real x returns real
 *
 * @param {JassContext} jass
 * @param {number} x
 * @return {number}
 */
export function Acos(jass, x) {
  return Math.acos(x);
}

/**
 * native Atan takes real x returns real
 *
 * @param {JassContext} jass
 * @param {number} x
 * @return {number}
 */
export function Atan(jass, x) {
  return Math.atan(x);
}

/**
 * native Atan2 takes real y, real x returns real
 *
 * @param {JassContext} jass
 * @param {number} y
 * @param {number} x
 * @return {number}
 */
export function Atan2(jass, y, x) {
  return Math.atan2(y, x);
}

/**
 * native SquareRoot takes real x returns real
 *
 * @param {JassContext} jass
 * @param {number} x
 * @return {number}
 */
export function SquareRoot(jass, x) {
  return Math.sqrt(x);
}

/**
 * native Pow takes real x, real power returns real
 *
 * @param {JassContext} jass
 * @param {number} x
 * @param {number} power
 * @return {number}
 */
export function Pow(jass, x, power) {
  return Math.pow(x, power);
}

/**
 * native I2R takes integer i returns real
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {number}
 */
export function I2R(jass, i) {
  return i;
}

/**
 * native R2I takes real r returns integer
 *
 * @param {JassContext} jass
 * @param {number} r
 * @return {number}
 */
export function R2I(jass, r) {
  return r | 0;
}

/**
 * native I2S takes integer i returns string
 *
 * @param {JassContext} jass
 * @param {number} i
 * @return {string}
 */
export function I2S(jass, i) {
  return '' + i;
}

/**
 * native R2S takes real r returns string
 *
 * @param {JassContext} jass
 * @param {number} r
 * @return {string}
 */
export function R2S(jass, r) {
  return '' + r;
}

// /**
//  * native R2SW takes real r, integer width, integer precision returns string
//  *
//  * @param {JassContext} jass
//  * @param {number} r
//  * @param {number} width
//  * @param {number} precision
//  * @return {string}
//  */
// export function R2SW(jass, r, width, precision) {}

/**
 * native S2I takes string s returns integer
 *
 * @param {JassContext} jass
 * @param {string} s
 * @return {number}
 */
export function S2I(jass, s) {
  return parseInt(s, 10);
}

/**
 * native S2R takes string s returns real
 *
 * @param {JassContext} jass
 * @param {string} s
 * @return {number}
 */
export function S2R(jass, s) {
  return parseFloat(s);
}

/**
 * native GetHandleId takes handle h returns integer
 *
 * @param {JassContext} jass
 * @param {JassHandle} h
 * @return {number}
 */
export function GetHandleId(jass, h) {
  return h.handleId;
}

/**
 * native SubString takes string source, integer start, integer end returns string
 *
 * @param {JassContext} jass
 * @param {string} source
 * @param {number} start
 * @param {number} end
 * @return {string}
 */
export function SubString(jass, source, start, end) {
  return source.substring(start, end);
}

/**
 * native StringLength takes string s returns integer
 *
 * @param {JassContext} jass
 * @param {string} s
 * @return {number}
 */
export function StringLength(jass, s) {
  return s.length;
}

/**
 * native StringCase takes string source, boolean upper returns string
 *
 * @param {JassContext} jass
 * @param {string} source
 * @param {boolean} upper
 * @return {string}
 */
export function StringCase(jass, source, upper) {
  if (upper) {
    return source.toUpperCase();
  } else {
    return source.toLowerCase();
  }
}

/**
 * native StringHash takes string s returns integer
 *
 * @param {JassContext} jass
 * @param {string} s
 * @return {number}
 */
export function StringHash(jass, s) {
  return sstrhash2(s);
}

// /**
//  * native GetLocalizedString takes string source returns string
//  *
//  * @param {JassContext} jass
//  * @param {string} source
//  * @return {string}
//  */
// export function GetLocalizedString(jass, source) {}

// /**
//  * native GetLocalizedHotkey takes string source returns integer
//  *
//  * @param {JassContext} jass
//  * @param {string} source
//  * @return {number}
//  */
// export function GetLocalizedHotkey(jass, source) {}

/**
 * native SetMapName takes string name returns nothing
 *
 * @param {JassContext} jass
 * @param {string} name
 */
export function SetMapName(jass, name) {
  jass.mapName = name;
}

/**
 * native SetMapDescription takes string description returns nothing
 *
 * @param {JassContext} jass
 * @param {string} description
 */
export function SetMapDescription(jass, description) {
  jass.mapDescription = description;
}

/**
 * native SetTeams takes integer teamcount returns nothing
 *
 * @param {JassContext} jass
 * @param {number} teamcount
 */
export function SetTeams(jass, teamcount) {
  jass.teamCount = teamcount;
}

/**
 * native SetPlayers takes integer playercount returns nothing
 *
 * @param {JassContext} jass
 * @param {number} playercount
 */
export function SetPlayers(jass, playercount) {
  jass.playerCount = playercount;
}

/**
 * native DefineStartLocation takes integer whichStartLoc, real x, real y returns nothing
 *
 * @param {JassContext} jass
 * @param {number} whichStartLoc
 * @param {number} x
 * @param {number} y
 */
export function DefineStartLocation(jass, whichStartLoc, x, y) {
  jass.startLocations[whichStartLoc] = jass.addHandle(new JassLocation(jass, x, y));
}

/**
 * native DefineStartLocationLoc takes integer whichStartLoc, location whichLocation returns nothing
 *
 * @param {JassContext} jass
 * @param {number} whichStartLoc
 * @param {JassLocation} whichLocation
 */
export function DefineStartLocationLoc(jass, whichStartLoc, whichLocation) {
  DefineStartLocation(jass, whichStartLoc, whichLocation.x, whichLocation.y);
}

// /**
//  * native SetStartLocPrioCount takes integer whichStartLoc, integer prioSlotCount returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} whichStartLoc
//  * @param {number} prioSlotCount
//  */
// export function SetStartLocPrioCount(jass, whichStartLoc, prioSlotCount) {}

// /**
//  * native SetStartLocPrio takes integer whichStartLoc, integer prioSlotIndex, integer otherStartLocIndex, startlocprio priority returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} whichStartLoc
//  * @param {number} prioSlotIndex
//  * @param {number} otherStartLocIndex
//  * @param {JassStartLocPrio} priority
//  */
// export function SetStartLocPrio(jass, whichStartLoc, prioSlotIndex, otherStartLocIndex, priority) {}

// /**
//  * native GetStartLocPrioSlot takes integer whichStartLoc, integer prioSlotIndex returns integer
//  *
//  * @param {JassContext} jass
//  * @param {number} whichStartLoc
//  * @param {number} prioSlotIndex
//  * @return {number}
//  */
// export function GetStartLocPrioSlot(jass, whichStartLoc, prioSlotIndex) {}

// /**
//  * native GetStartLocPrio takes integer whichStartLoc, integer prioSlotIndex returns startlocprio
//  *
//  * @param {JassContext} jass
//  * @param {number} whichStartLoc
//  * @param {number} prioSlotIndex
//  * @return {JassStartLocPrio}
//  */
// export function GetStartLocPrio(jass, whichStartLoc, prioSlotIndex) {}

// /**
//  * native SetGameTypeSupported takes gametype whichGameType, boolean value returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGameType} whichGameType
//  * @param {boolean} value
//  */
// export function SetGameTypeSupported(jass, whichGameType, value) {}

// /**
//  * native SetMapFlag takes mapflag whichMapFlag, boolean value returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassMapFlag} whichMapFlag
//  * @param {boolean} value
//  */
// export function SetMapFlag(jass, whichMapFlag, value) {}

/**
 * native SetGamePlacement takes placement whichPlacementType returns nothing
 *
 * @param {JassContext} jass
 * @param {JassPlacement} whichPlacementType
 */
export function SetGamePlacement(jass, whichPlacementType) {
  jass.gamePlacement = whichPlacementType;
}

/**
 * native SetGameSpeed takes gamespeed whichspeed returns nothing
 *
 * @param {JassContext} jass
 * @param {JassGameSpeed} whichspeed
 */
export function SetGameSpeed(jass, whichspeed) {
  jass.gameSpeed = whichspeed;
}

/**
 * native SetGameDifficulty takes gamedifficulty whichdifficulty returns nothing
 *
 * @param {JassContext} jass
 * @param {JassGameDifficulty} whichdifficulty
 */
export function SetGameDifficulty(jass, whichdifficulty) {
  jass.gameDifficulty = whichdifficulty;
}

// /**
//  * native SetResourceDensity takes mapdensity whichdensity returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassMapDensity} whichdensity
//  */
// export function SetResourceDensity(jass, whichdensity) {}

// /**
//  * native SetCreatureDensity takes mapdensity whichdensity returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassMapDensity} whichdensity
//  */
// export function SetCreatureDensity(jass, whichdensity) {}

/**
 * native GetTeams takes nothing returns integer
 *
 * @param {JassContext} jass
 * @return {number}
 */
export function GetTeams(jass) {
  return jass.teamCount;
}

/**
 * native GetPlayers takes nothing returns integer
 *
 * @param {JassContext} jass
 * @return {number}
 */
export function GetPlayers(jass) {
  return jass.playerCount;
}

// /**
//  * native IsGameTypeSupported takes gametype whichGameType returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassGameType} whichGameType
//  * @return {boolean}
//  */
// export function IsGameTypeSupported(jass, whichGameType) {}

// /**
//  * native GetGameTypeSelected takes nothing returns gametype
//  *
//  * @param {JassContext} jass
//  * @return {JassGameType}
//  */
// export function GetGameTypeSelected(jass) {}

// /**
//  * native IsMapFlagSet takes mapflag whichMapFlag returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassMapFlag} whichMapFlag
//  * @return {boolean}
//  */
// export function IsMapFlagSet(jass, whichMapFlag) {}

/**
 * constant native GetGamePlacement takes nothing returns placement
 *
 * @param {JassContext} jass
 * @return {JassPlacement}
 */
export function GetGamePlacement(jass) {
  return jass.gamePlacement;
}

/**
 * constant native GetGameSpeed takes nothing returns gamespeed
 *
 * @param {JassContext} jass
 * @return {JassGameSpeed}
 */
export function GetGameSpeed(jass) {
  return jass.gameSpeed;
}

/**
 * constant native GetGameDifficulty takes nothing returns gamedifficulty
 *
 * @param {JassContext} jass
 * @return {JassGameDifficulty}
 */
export function GetGameDifficulty(jass) {
  return jass.gameDifficulty;
}

// /**
//  * constant native GetResourceDensity takes nothing returns mapdensity
//  *
//  * @param {JassContext} jass
//  * @return {JassMapDensity}
//  */
// export function GetResourceDensity(jass) {}

// /**
//  * constant native GetCreatureDensity takes nothing returns mapdensity
//  *
//  * @param {JassContext} jass
//  * @return {JassMapDensity}
//  */
// export function GetCreatureDensity(jass) {}

/**
 * constant native GetStartLocationX takes integer whichStartLocation returns real
 *
 * @param {JassContext} jass
 * @param {number} whichStartLocation
 * @return {number}
 */
export function GetStartLocationX(jass, whichStartLocation) {
  return jass.startLocations[whichStartLocation].x;
}

/**
 * constant native GetStartLocationY takes integer whichStartLocation returns real
 *
 * @param {JassContext} jass
 * @param {number} whichStartLocation
 * @return {number}
 */
export function GetStartLocationY(jass, whichStartLocation) {
  return jass.startLocations[whichStartLocation].y;
}

/**
 * constant native GetStartLocationLoc takes integer whichStartLocation returns location
 *
 * @param {JassContext} jass
 * @param {number} whichStartLocation
 * @return {JassLocation}
 */
export function GetStartLocationLoc(jass, whichStartLocation) {
  return jass.startLocations[whichStartLocation];
}

/**
 * native SetPlayerTeam takes player whichPlayer, integer whichTeam returns nothing
 *
 * @param {JassContext} jass
 * @param {JassPlayer} whichPlayer
 * @param {number} whichTeam
 */
export function SetPlayerTeam(jass, whichPlayer, whichTeam) {
  whichPlayer.team = whichTeam;
}

/**
 * native SetPlayerStartLocation takes player whichPlayer, integer startLocIndex returns nothing
 *
 * @param {JassContext} jass
 * @param {JassPlayer} whichPlayer
 * @param {number} startLocIndex
 */
export function SetPlayerStartLocation(jass, whichPlayer, startLocIndex) {
  whichPlayer.startLocation = startLocIndex;
}

/**
 * native ForcePlayerStartLocation takes player whichPlayer, integer startLocIndex returns nothing
 *
 * @param {JassContext} jass
 * @param {JassPlayer} whichPlayer
 * @param {number} startLocIndex
 */
export function ForcePlayerStartLocation(jass, whichPlayer, startLocIndex) {
  whichPlayer.forcedStartLocation = startLocIndex;
}

/**
 * native SetPlayerColor takes player whichPlayer, playercolor color returns nothing
 *
 * @param {JassContext} jass
 * @param {JassPlayer} whichPlayer
 * @param {JassPlayerColor} color
 */
export function SetPlayerColor(jass, whichPlayer, color) {
  whichPlayer.color = color;
}

/**
 * native SetPlayerAlliance takes player sourcePlayer, player otherPlayer, alliancetype whichAllianceSetting, boolean value returns nothing
 *
 * @param {JassContext} jass
 * @param {JassPlayer} sourcePlayer
 * @param {JassPlayer} otherPlayer
 * @param {JassAllianceType} whichAllianceSetting
 * @param {boolean} value
 */
export function SetPlayerAlliance(jass, sourcePlayer, otherPlayer, whichAllianceSetting, value) {
  let alliance = sourcePlayer.alliances.get(otherPlayer.index);
  let whichSetting = whichAllianceSetting.value;

  if (whichSetting === 0) {
    alliance.passive = value;
  } else if (whichSetting === 1) {
    alliance.helpRequest = value;
  } else if (whichSetting === 2) {
    alliance.helpResponse = value;
  } else if (whichSetting === 3) {
    alliance.sharedXp = value;
  } else if (whichSetting === 4) {
    alliance.sharedSpells = value;
  } else if (whichSetting === 5) {
    alliance.sharedVision = value;
  } else if (whichSetting === 6) {
    alliance.sharedControl = value;
  } else if (whichSetting === 7) {
    alliance.sharedAdvancedControl = value;
  } else if (whichSetting === 8) {
    alliance.rescuable = value;
  } else if (whichSetting === 9) {
    alliance.sharedVisionForced = value;
  }
}

// /**
//  * native SetPlayerTaxRate takes player sourcePlayer, player otherPlayer, playerstate whichResource, integer rate returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} sourcePlayer
//  * @param {JassPlayer} otherPlayer
//  * @param {JassPlayerState} whichResource
//  * @param {number} rate
//  */
// export function SetPlayerTaxRate(jass, sourcePlayer, otherPlayer, whichResource, rate) {}

/**
 * native SetPlayerRacePreference takes player whichPlayer, racepreference whichRacePreference returns nothing
 *
 * @param {JassContext} jass
 * @param {JassPlayer} whichPlayer
 * @param {JassRacePreference} whichRacePreference
 */
export function SetPlayerRacePreference(jass, whichPlayer, whichRacePreference) {
  whichPlayer.racePreference = whichRacePreference;
}

/**
 * native SetPlayerRaceSelectable takes player whichPlayer, boolean value returns nothing
 *
 * @param {JassContext} jass
 * @param {JassPlayer} whichPlayer
 * @param {boolean} value
 */
export function SetPlayerRaceSelectable(jass, whichPlayer, value) {
  whichPlayer.raceSelectable = value;
}

/**
 * native SetPlayerController takes player whichPlayer, mapcontrol controlType returns nothing
 *
 * @param {JassContext} jass
 * @param {JassPlayer} whichPlayer
 * @param {JassMapControl} controlType
 */
export function SetPlayerController(jass, whichPlayer, controlType) {
  whichPlayer.controller = controlType;
}

/**
 * native SetPlayerName takes player whichPlayer, string name returns nothing
 *
 * @param {JassContext} jass
 * @param {JassPlayer} whichPlayer
 * @param {string} name
 */
export function SetPlayerName(jass, whichPlayer, name) {
  whichPlayer.name = name;
}

// /**
//  * native SetPlayerOnScoreScreen takes player whichPlayer, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {boolean} flag
//  */
// export function SetPlayerOnScoreScreen(jass, whichPlayer, flag) {}

/**
 * native GetPlayerTeam takes player whichPlayer returns integer
 *
 * @param {JassContext} jass
 * @param {JassPlayer} whichPlayer
 * @return {number}
 */
export function GetPlayerTeam(jass, whichPlayer) {
  return whichPlayer.team;
}

/**
 * native GetPlayerStartLocation takes player whichPlayer returns integer
 *
 * @param {JassContext} jass
 * @param {JassPlayer} whichPlayer
 * @return {number}
 */
export function GetPlayerStartLocation(jass, whichPlayer) {
  return whichPlayer.startLocation;
}

/**
 * native GetPlayerColor takes player whichPlayer returns playercolor
 *
 * @param {JassContext} jass
 * @param {JassPlayer} whichPlayer
 * @return {JassPlayerColor}
 */
export function GetPlayerColor(jass, whichPlayer) {
  return whichPlayer.color;
}

/**
 * native GetPlayerSelectable takes player whichPlayer returns boolean
 *
 * @param {JassContext} jass
 * @param {JassPlayer} whichPlayer
 * @return {boolean}
 */
export function GetPlayerSelectable(jass, whichPlayer) {
  return whichPlayer.raceSelectable;
}

/**
 * native GetPlayerController takes player whichPlayer returns mapcontrol
 *
 * @param {JassContext} jass
 * @param {JassPlayer} whichPlayer
 * @return {JassMapControl}
 */
export function GetPlayerController(jass, whichPlayer) {
  return whichPlayer.controller;
}

// /**
//  * native GetPlayerSlotState takes player whichPlayer returns playerslotstate
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @return {JassPlayerSlotState}
//  */
// export function GetPlayerSlotState(jass, whichPlayer) {}

// /**
//  * native GetPlayerTaxRate takes player sourcePlayer, player otherPlayer, playerstate whichResource returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} sourcePlayer
//  * @param {JassPlayer} otherPlayer
//  * @param {JassPlayerState} whichResource
//  * @return {number}
//  */
// export function GetPlayerTaxRate(jass, sourcePlayer, otherPlayer, whichResource) {}

// /**
//  * native IsPlayerRacePrefSet takes player whichPlayer, racepreference pref returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {JassRacePreference} pref
//  * @return {boolean}
//  */
// export function IsPlayerRacePrefSet(jass, whichPlayer, pref) {}

/**
 * native GetPlayerName takes player whichPlayer returns string
 *
 * @param {JassContext} jass
 * @param {JassPlayer} whichPlayer
 * @return {string}
 */
export function GetPlayerName(jass, whichPlayer) {
  return whichPlayer.name;
}

/**
 * native CreateTimer takes nothing returns timer
 *
 * @param {JassContext} jass
 * @return {JassTimer}
 */
export function CreateTimer(jass) {
  return jass.addHandle(new JassTimer(jass));
}

/**
 * native DestroyTimer takes timer whichTimer returns nothing
 *
 * @param {JassContext} jass
 * @param {JassTimer} whichTimer
 */
export function DestroyTimer(jass, whichTimer) {
  jass.removeHandle(whichTimer);
}

/**
 * native TimerStart takes timer whichTimer, real timeout, boolean periodic, code handlerFunc returns nothing
 *
 * @param {JassContext} jass
 * @param {JassTimer} whichTimer
 * @param {number} timeout
 * @param {boolean} periodic
 * @param {function()} handlerFunc
 */
export function TimerStart(jass, whichTimer, timeout, periodic, handlerFunc) {
  whichTimer.elapsed = 0;
  whichTimer.timeout = timeout;
  whichTimer.periodic = periodic;
  whichTimer.handlerFunc = handlerFunc;

  jass.timers.add(whichTimer);
}

/**
 * native TimerGetElapsed takes timer whichTimer returns real
 *
 * @param {JassContext} jass
 * @param {JassTimer} whichTimer
 * @return {number}
 */
export function TimerGetElapsed(jass, whichTimer) {
  return whichTimer.elapsed;
}

/**
 * native TimerGetRemaining takes timer whichTimer returns real
 *
 * @param {JassContext} jass
 * @param {JassTimer} whichTimer
 * @return {number}
 */
export function TimerGetRemaining(jass, whichTimer) {
  return whichTimer.timeout - whichTimer.elapsed;
}

/**
 * native TimerGetTimeout takes timer whichTimer returns real
 *
 * @param {JassContext} jass
 * @param {JassTimer} whichTimer
 * @return {number}
 */
export function TimerGetTimeout(jass, whichTimer) {
  return whichTimer.timeout;
}

/**
 * native PauseTimer takes timer whichTimer returns nothing
 *
 * @param {JassContext} jass
 * @param {JassTimer} whichTimer
 */
export function PauseTimer(jass, whichTimer) {
  jass.timers.delete(whichTimer);
}

/**
 * native ResumeTimer takes timer whichTimer returns nothing
 *
 * @param {JassContext} jass
 * @param {JassTimer} whichTimer
 */
export function ResumeTimer(jass, whichTimer) {
  jass.timers.add(whichTimer);
}

// /**
//  * native GetExpiredTimer takes nothing returns timer
//  *
//  * @param {JassContext} jass
//  * @return {JassTimer}
//  */
// export function GetExpiredTimer(jass) {}

/**
 * native CreateGroup takes nothing returns group
 *
 * @param {JassContext} jass
 * @return {JassGroup}
 */
export function CreateGroup(jass) {
  return jass.addHandle(new JassGroup(jass));
}

/**
 * native DestroyGroup takes group whichGroup returns nothing
 *
 * @param {JassContext} jass
 * @param {JassGroup} whichGroup
 */
export function DestroyGroup(jass, whichGroup) {
  jass.removeHandle(whichGroup);
}

/**
 * native GroupAddUnit takes group whichGroup, unit whichUnit returns nothing
 *
 * @param {JassContext} jass
 * @param {JassGroup} whichGroup
 * @param {JassUnit} whichUnit
 */
export function GroupAddUnit(jass, whichGroup, whichUnit) {
  whichGroup.units.add(whichUnit);
}

/**
 * native GroupRemoveUnit takes group whichGroup, unit whichUnit returns nothing
 *
 * @param {JassContext} jass
 * @param {JassGroup} whichGroup
 * @param {JassUnit} whichUnit
 */
export function GroupRemoveUnit(jass, whichGroup, whichUnit) {
  whichGroup.units.delete(whichUnit);
}

/**
 * native GroupClear takes group whichGroup returns nothing
 *
 * @param {JassContext} jass
 * @param {JassGroup} whichGroup
 */
export function GroupClear(jass, whichGroup) {
  whichGroup.units.clear();
}

// /**
//  * native GroupEnumUnitsOfType takes group whichGroup, string unitname, boolexpr filter returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGroup} whichGroup
//  * @param {string} unitname
//  * @param {function(): boolean} filter
//  */
// export function GroupEnumUnitsOfType(jass, whichGroup, unitname, filter) {}

// /**
//  * native GroupEnumUnitsOfPlayer takes group whichGroup, player whichPlayer, boolexpr filter returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGroup} whichGroup
//  * @param {JassPlayer} whichPlayer
//  * @param {function(): boolean} filter
//  */
// export function GroupEnumUnitsOfPlayer(jass, whichGroup, whichPlayer, filter) {}

// /**
//  * native GroupEnumUnitsOfTypeCounted takes group whichGroup, string unitname, boolexpr filter, integer countLimit returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGroup} whichGroup
//  * @param {string} unitname
//  * @param {function(): boolean} filter
//  * @param {number} countLimit
//  */
// export function GroupEnumUnitsOfTypeCounted(jass, whichGroup, unitname, filter, countLimit) {}

// /**
//  * native GroupEnumUnitsInRect takes group whichGroup, rect r, boolexpr filter returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGroup} whichGroup
//  * @param {JassRect} r
//  * @param {function(): boolean} filter
//  */
// export function GroupEnumUnitsInRect(jass, whichGroup, r, filter) {}

// /**
//  * native GroupEnumUnitsInRectCounted takes group whichGroup, rect r, boolexpr filter, integer countLimit returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGroup} whichGroup
//  * @param {JassRect} r
//  * @param {function(): boolean} filter
//  * @param {number} countLimit
//  */
// export function GroupEnumUnitsInRectCounted(jass, whichGroup, r, filter, countLimit) {}

// /**
//  * native GroupEnumUnitsInRange takes group whichGroup, real x, real y, real radius, boolexpr filter returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGroup} whichGroup
//  * @param {number} x
//  * @param {number} y
//  * @param {number} radius
//  * @param {function(): boolean} filter
//  */
// export function GroupEnumUnitsInRange(jass, whichGroup, x, y, radius, filter) {}

// /**
//  * native GroupEnumUnitsInRangeOfLoc takes group whichGroup, location whichLocation, real radius, boolexpr filter returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGroup} whichGroup
//  * @param {JassLocation} whichLocation
//  * @param {number} radius
//  * @param {function(): boolean} filter
//  */
// export function GroupEnumUnitsInRangeOfLoc(jass, whichGroup, whichLocation, radius, filter) {}

// /**
//  * native GroupEnumUnitsInRangeCounted takes group whichGroup, real x, real y, real radius, boolexpr filter, integer countLimit returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGroup} whichGroup
//  * @param {number} x
//  * @param {number} y
//  * @param {number} radius
//  * @param {function(): boolean} filter
//  * @param {number} countLimit
//  */
// export function GroupEnumUnitsInRangeCounted(jass, whichGroup, x, y, radius, filter, countLimit) {}

// /**
//  * native GroupEnumUnitsInRangeOfLocCounted takes group whichGroup, location whichLocation, real radius, boolexpr filter, integer countLimit returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGroup} whichGroup
//  * @param {JassLocation} whichLocation
//  * @param {number} radius
//  * @param {function(): boolean} filter
//  * @param {number} countLimit
//  */
// export function GroupEnumUnitsInRangeOfLocCounted(jass, whichGroup, whichLocation, radius, filter, countLimit) {}

// /**
//  * native GroupEnumUnitsSelected takes group whichGroup, player whichPlayer, boolexpr filter returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGroup} whichGroup
//  * @param {JassPlayer} whichPlayer
//  * @param {function(): boolean} filter
//  */
// export function GroupEnumUnitsSelected(jass, whichGroup, whichPlayer, filter) {}

// /**
//  * native GroupImmediateOrder takes group whichGroup, string order returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassGroup} whichGroup
//  * @param {string} order
//  * @return {boolean}
//  */
// export function GroupImmediateOrder(jass, whichGroup, order) {}

// /**
//  * native GroupImmediateOrderById takes group whichGroup, integer order returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassGroup} whichGroup
//  * @param {number} order
//  * @return {boolean}
//  */
// export function GroupImmediateOrderById(jass, whichGroup, order) {}

// /**
//  * native GroupPointOrder takes group whichGroup, string order, real x, real y returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassGroup} whichGroup
//  * @param {string} order
//  * @param {number} x
//  * @param {number} y
//  * @return {boolean}
//  */
// export function GroupPointOrder(jass, whichGroup, order, x, y) {}

// /**
//  * native GroupPointOrderLoc takes group whichGroup, string order, location whichLocation returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassGroup} whichGroup
//  * @param {string} order
//  * @param {JassLocation} whichLocation
//  * @return {boolean}
//  */
// export function GroupPointOrderLoc(jass, whichGroup, order, whichLocation) {}

// /**
//  * native GroupPointOrderById takes group whichGroup, integer order, real x, real y returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassGroup} whichGroup
//  * @param {number} order
//  * @param {number} x
//  * @param {number} y
//  * @return {boolean}
//  */
// export function GroupPointOrderById(jass, whichGroup, order, x, y) {}

// /**
//  * native GroupPointOrderByIdLoc takes group whichGroup, integer order, location whichLocation returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassGroup} whichGroup
//  * @param {number} order
//  * @param {JassLocation} whichLocation
//  * @return {boolean}
//  */
// export function GroupPointOrderByIdLoc(jass, whichGroup, order, whichLocation) {}

// /**
//  * native GroupTargetOrder takes group whichGroup, string order, widget targetWidget returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassGroup} whichGroup
//  * @param {string} order
//  * @param {JassWidget} targetWidget
//  * @return {boolean}
//  */
// export function GroupTargetOrder(jass, whichGroup, order, targetWidget) {}

// /**
//  * native GroupTargetOrderById takes group whichGroup, integer order, widget targetWidget returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassGroup} whichGroup
//  * @param {number} order
//  * @param {JassWidget} targetWidget
//  * @return {boolean}
//  */
// export function GroupTargetOrderById(jass, whichGroup, order, targetWidget) {}

// /**
//  * native ForGroup takes group whichGroup, code callback returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGroup} whichGroup
//  * @param {function()} callback
//  */
// export function ForGroup(jass, whichGroup, callback) {}

/**
 * native FirstOfGroup takes group whichGroup returns unit
 *
 * @param {JassContext} jass
 * @param {JassGroup} whichGroup
 * @return {JassUnit}
 */
export function FirstOfGroup(jass, whichGroup) {
  let units = whichGroup.units;

  if (units.size) {
    let unit = units.values().next().value;

    units.delete(unit);

    return unit;
  } else {
    return null;
  }
}

/**
 * native CreateForce takes nothing returns force
 *
 * @param {JassContext} jass
 * @return {JassForce}
 */
export function CreateForce(jass) {
  return jass.addHandle(new JassForce(jass));
}

/**
 * native DestroyForce takes force whichForce returns nothing
 *
 * @param {JassContext} jass
 * @param {JassForce} whichForce
 */
export function DestroyForce(jass, whichForce) {
  jass.removeHandle(whichForce);
}

/**
 * native ForceAddPlayer takes force whichForce, player whichPlayer returns nothing
 *
 * @param {JassContext} jass
 * @param {JassForce} whichForce
 * @param {JassPlayer} whichPlayer
 */
export function ForceAddPlayer(jass, whichForce, whichPlayer) {
  whichForce.players.add(whichPlayer);
}

/**
 * native ForceRemovePlayer takes force whichForce, player whichPlayer returns nothing
 *
 * @param {JassContext} jass
 * @param {JassForce} whichForce
 * @param {JassPlayer} whichPlayer
 */
export function ForceRemovePlayer(jass, whichForce, whichPlayer) {
  whichForce.players.delete(whichPlayer);
}

/**
 * native ForceClear takes force whichForce returns nothing
 *
 * @param {JassContext} jass
 * @param {JassForce} whichForce
 */
export function ForceClear(jass, whichForce) {
  whichForce.players.clear();
}

// /**
//  * native ForceEnumPlayers takes force whichForce, boolexpr filter returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassForce} whichForce
//  * @param {function(): boolean} filter
//  */
// export function ForceEnumPlayers(jass, whichForce, filter) {}

// /**
//  * native ForceEnumPlayersCounted takes force whichForce, boolexpr filter, integer countLimit returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassForce} whichForce
//  * @param {function(): boolean} filter
//  * @param {number} countLimit
//  */
// export function ForceEnumPlayersCounted(jass, whichForce, filter, countLimit) {}

// /**
//  * native ForceEnumAllies takes force whichForce, player whichPlayer, boolexpr filter returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassForce} whichForce
//  * @param {JassPlayer} whichPlayer
//  * @param {function(): boolean} filter
//  */
// export function ForceEnumAllies(jass, whichForce, whichPlayer, filter) {}

// /**
//  * native ForceEnumEnemies takes force whichForce, player whichPlayer, boolexpr filter returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassForce} whichForce
//  * @param {JassPlayer} whichPlayer
//  * @param {function(): boolean} filter
//  */
// export function ForceEnumEnemies(jass, whichForce, whichPlayer, filter) {}

// /**
//  * native ForForce takes force whichForce, code callback returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassForce} whichForce
//  * @param {function()} callback
//  */
// export function ForForce(jass, whichForce, callback) {}

/**
 * native Rect takes real minx, real miny, real maxx, real maxy returns rect
 *
 * @param {JassContext} jass
 * @param {number} minx
 * @param {number} miny
 * @param {number} maxx
 * @param {number} maxy
 * @return {JassRect}
 */
export function Rect(jass, minx, miny, maxx, maxy) {
  return jass.addHandle(new JassRect(jass, minx, miny, maxx, maxy));
}

/**
 * native RectFromLoc takes location min, location max returns rect
 *
 * @param {JassContext} jass
 * @param {JassLocation} min
 * @param {JassLocation} max
 * @return {JassRect}
 */
export function RectFromLoc(jass, min, max) {
  return Rect(jass, min.x, min.y, max.x, max.y);
}

/**
 * native RemoveRect takes rect whichRect returns nothing
 *
 * @param {JassContext} jass
 * @param {JassRect} whichRect
 */
export function RemoveRect(jass, whichRect) {
  jass.removeHandle(whichRect);
}

/**
 * native SetRect takes rect whichRect, real minx, real miny, real maxx, real maxy returns nothing
 *
 * @param {JassContext} jass
 * @param {JassRect} whichRect
 * @param {number} minx
 * @param {number} miny
 * @param {number} maxx
 * @param {number} maxy
 */
export function SetRect(jass, whichRect, minx, miny, maxx, maxy) {
  let center = whichRect.center;
  let min = whichRect.min;
  let max = whichRect.max;

  center[0] = maxx - minx;
  center[1] = maxy - miny;
  min[0] = minx;
  min[1] = miny;
  max[0] = maxx;
  max[1] = maxy;
}

/**
 * native SetRectFromLoc takes rect whichRect, location min, location max returns nothing
 *
 * @param {JassContext} jass
 * @param {JassRect} whichRect
 * @param {JassLocation} min
 * @param {JassLocation} max
 */
export function SetRectFromLoc(jass, whichRect, min, max) {
  SetRect(jass, whichRect, min.x, min.y, max.x, max.y);
}

/**
 * native MoveRectTo takes rect whichRect, real newCenterX, real newCenterY returns nothing
 *
 * @param {JassContext} jass
 * @param {JassRect} whichRect
 * @param {number} newCenterX
 * @param {number} newCenterY
 */
export function MoveRectTo(jass, whichRect, newCenterX, newCenterY) {
  let center = whichRect.center;
  let min = whichRect.min;
  let max = whichRect.max;
  let halfWidth = (max[0] - min[0]) / 2;
  let halfHeight = (max[1] - min[1]) / 2;

  center[0] = newCenterX;
  center[1] = newCenterY;
  min[0] = newCenterX - halfWidth;
  min[1] = newCenterY - halfHeight;
  max[0] = newCenterX + halfWidth;
  max[1] = newCenterY + halfHeight;
}

/**
 * native MoveRectToLoc takes rect whichRect, location newCenterLoc returns nothing
 *
 * @param {JassContext} jass
 * @param {JassRect} whichRect
 * @param {JassLocation} newCenterLoc
 */
export function MoveRectToLoc(jass, whichRect, newCenterLoc) {
  MoveRectTo(jass, whichRect, newCenterLoc.x, newCenterLoc.y);
}

/**
 * native GetRectCenterX takes rect whichRect returns real
 *
 * @param {JassContext} jass
 * @param {JassRect} whichRect
 * @return {number}
 */
export function GetRectCenterX(jass, whichRect) {
  return whichRect.center[0];
}

/**
 * native GetRectCenterY takes rect whichRect returns real
 *
 * @param {JassContext} jass
 * @param {JassRect} whichRect
 * @return {number}
 */
export function GetRectCenterY(jass, whichRect) {
  return whichRect.center[1];
}

/**
 * native GetRectMinX takes rect whichRect returns real
 *
 * @param {JassContext} jass
 * @param {JassRect} whichRect
 * @return {number}
 */
export function GetRectMinX(jass, whichRect) {
  return whichRect.min[0];
}

/**
 * native GetRectMinY takes rect whichRect returns real
 *
 * @param {JassContext} jass
 * @param {JassRect} whichRect
 * @return {number}
 */
export function GetRectMinY(jass, whichRect) {
  return whichRect.min[1];
}

/**
 * native GetRectMaxX takes rect whichRect returns real
 *
 * @param {JassContext} jass
 * @param {JassRect} whichRect
 * @return {number}
 */
export function GetRectMaxX(jass, whichRect) {
  return whichRect.max[0];
}

/**
 * native GetRectMaxY takes rect whichRect returns real
 *
 * @param {JassContext} jass
 * @param {JassRect} whichRect
 * @return {number}
 */
export function GetRectMaxY(jass, whichRect) {
  return whichRect.max[1];
}

/**
 * native CreateRegion takes nothing returns region
 *
 * @param {JassContext} jass
 * @return {JassRegion}
 */
export function CreateRegion(jass) {
  return jass.addHandle(new JassRegion(jass));
}

/**
 * native RemoveRegion takes region whichRegion returns nothing
 *
 * @param {JassContext} jass
 * @param {JassRegion} whichRegion
 */
export function RemoveRegion(jass, whichRegion) {
  jass.removeHandle(whichRegion);
}

// /**
//  * native RegionAddRect takes region whichRegion, rect r returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassRegion} whichRegion
//  * @param {JassRect} r
//  */
// export function RegionAddRect(jass, whichRegion, r) {}

// /**
//  * native RegionClearRect takes region whichRegion, rect r returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassRegion} whichRegion
//  * @param {JassRect} r
//  */
// export function RegionClearRect(jass, whichRegion, r) {}

// /**
//  * native RegionAddCell takes region whichRegion, real x, real y returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassRegion} whichRegion
//  * @param {number} x
//  * @param {number} y
//  */
// export function RegionAddCell(jass, whichRegion, x, y) {}

// /**
//  * native RegionAddCellAtLoc takes region whichRegion, location whichLocation returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassRegion} whichRegion
//  * @param {JassLocation} whichLocation
//  */
// export function RegionAddCellAtLoc(jass, whichRegion, whichLocation) {}

// /**
//  * native RegionClearCell takes region whichRegion, real x, real y returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassRegion} whichRegion
//  * @param {number} x
//  * @param {number} y
//  */
// export function RegionClearCell(jass, whichRegion, x, y) {}

// /**
//  * native RegionClearCellAtLoc takes region whichRegion, location whichLocation returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassRegion} whichRegion
//  * @param {JassLocation} whichLocation
//  */
// export function RegionClearCellAtLoc(jass, whichRegion, whichLocation) {}

/**
 * native Location takes real x, real y returns location
 *
 * @param {JassContext} jass
 * @param {number} x
 * @param {number} y
 * @return {JassLocation}
 */
export function Location(jass, x, y) {
  return jass.addHandle(new JassLocation(jass, x, y));
}

/**
 * native RemoveLocation takes location whichLocation returns nothing
 *
 * @param {JassContext} jass
 * @param {JassLocation} whichLocation
 */
export function RemoveLocation(jass, whichLocation) {
  jass.removeHandle(whichLocation);
}

/**
 * native MoveLocation takes location whichLocation, real newX, real newY returns nothing
 *
 * @param {JassContext} jass
 * @param {JassLocation} whichLocation
 * @param {number} newX
 * @param {number} newY
 */
export function MoveLocation(jass, whichLocation, newX, newY) {
  whichLocation.x = newX;
  whichLocation.y = newY;
}

/**
 * native GetLocationX takes location whichLocation returns real
 *
 * @param {JassContext} jass
 * @param {JassLocation} whichLocation
 * @return {number}
 */
export function GetLocationX(jass, whichLocation) {
  return whichLocation.x;
}

/**
 * native GetLocationY takes location whichLocation returns real
 *
 * @param {JassContext} jass
 * @param {JassLocation} whichLocation
 * @return {number}
 */
export function GetLocationY(jass, whichLocation) {
  return whichLocation.y;
}

/**
 * native GetLocationZ takes location whichLocation returns real
 *
 * @param {JassContext} jass
 * @param {JassLocation} whichLocation
 * @return {number}
 */
export function GetLocationZ(jass, whichLocation) {
  return whichLocation.z;
}

// /**
//  * native IsUnitInRegion takes region whichRegion, unit whichUnit returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassRegion} whichRegion
//  * @param {JassUnit} whichUnit
//  * @return {boolean}
//  */
// export function IsUnitInRegion(jass, whichRegion, whichUnit) {}

// /**
//  * native IsPointInRegion takes region whichRegion, real x, real y returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassRegion} whichRegion
//  * @param {number} x
//  * @param {number} y
//  * @return {boolean}
//  */
// export function IsPointInRegion(jass, whichRegion, x, y) {}

// /**
//  * native IsLocationInRegion takes region whichRegion, location whichLocation returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassRegion} whichRegion
//  * @param {JassLocation} whichLocation
//  * @return {boolean}
//  */
// export function IsLocationInRegion(jass, whichRegion, whichLocation) {}

/**
 * native GetWorldBounds takes nothing returns rect
 *
 * @param {JassContext} jass
 * @return {JassRect}
 */
export function GetWorldBounds(jass) {
  if (jass.debugMode) {
    console.warn('GetWorldBounds not implemented!');
  }

  return jass.addHandle(new JassRect(jass, 0, 0, 0, 0))
}

/**
 * native CreateTrigger takes nothing returns trigger
 *
 * @param {JassContext} jass
 * @return {JassTrigger}
 */
export function CreateTrigger(jass) {
  return jass.addHandle(new JassTrigger(jass));
}

/**
 * native DestroyTrigger takes trigger whichTrigger returns nothing
 *
 * @param {JassContext} jass
 * @param {JassTrigger} whichTrigger
 */
export function DestroyTrigger(jass, whichTrigger) {
  jass.removeHandle(whichTrigger);
}

// /**
//  * native ResetTrigger takes trigger whichTrigger returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  */
// export function ResetTrigger(jass, whichTrigger) {}

/**
 * native EnableTrigger takes trigger whichTrigger returns nothing
 *
 * @param {JassContext} jass
 * @param {JassTrigger} whichTrigger
 */
export function EnableTrigger(jass, whichTrigger) {
  whichTrigger.enabled = true;
}

/**
 * native DisableTrigger takes trigger whichTrigger returns nothing
 *
 * @param {JassContext} jass
 * @param {JassTrigger} whichTrigger
 */
export function DisableTrigger(jass, whichTrigger) {
  whichTrigger.enabled = false;
}

/**
 * native IsTriggerEnabled takes trigger whichTrigger returns boolean
 *
 * @param {JassContext} jass
 * @param {JassTrigger} whichTrigger
 * @return {boolean}
 */
export function IsTriggerEnabled(jass, whichTrigger) {
  return whichTrigger.enabled;
}

// /**
//  * native TriggerWaitOnSleeps takes trigger whichTrigger, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {boolean} flag
//  */
// export function TriggerWaitOnSleeps(jass, whichTrigger, flag) {}

// /**
//  * native IsTriggerWaitOnSleeps takes trigger whichTrigger returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @return {boolean}
//  */
// export function IsTriggerWaitOnSleeps(jass, whichTrigger) {}

// /**
//  * constant native GetFilterUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetFilterUnit(jass) {}

// /**
//  * constant native GetEnumUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetEnumUnit(jass) {}

// /**
//  * constant native GetFilterDestructable takes nothing returns destructable
//  *
//  * @param {JassContext} jass
//  * @return {JassDestructable}
//  */
// export function GetFilterDestructable(jass) {}

// /**
//  * constant native GetEnumDestructable takes nothing returns destructable
//  *
//  * @param {JassContext} jass
//  * @return {JassDestructable}
//  */
// export function GetEnumDestructable(jass) {}

// /**
//  * constant native GetFilterItem takes nothing returns item
//  *
//  * @param {JassContext} jass
//  * @return {JassItem}
//  */
// export function GetFilterItem(jass) {}

// /**
//  * constant native GetEnumItem takes nothing returns item
//  *
//  * @param {JassContext} jass
//  * @return {JassItem}
//  */
// export function GetEnumItem(jass) {}

// /**
//  * constant native GetFilterPlayer takes nothing returns player
//  *
//  * @param {JassContext} jass
//  * @return {JassPlayer}
//  */
// export function GetFilterPlayer(jass) {}

// /**
//  * constant native GetEnumPlayer takes nothing returns player
//  *
//  * @param {JassContext} jass
//  * @return {JassPlayer}
//  */
// export function GetEnumPlayer(jass) {}

// /**
//  * constant native GetTriggeringTrigger takes nothing returns trigger
//  *
//  * @param {JassContext} jass
//  * @return {JassTrigger}
//  */
// export function GetTriggeringTrigger(jass) {}

// /**
//  * constant native GetTriggerEventId takes nothing returns eventid
//  *
//  * @param {JassContext} jass
//  * @return {JassEventId}
//  */
// export function GetTriggerEventId(jass) {}

// /**
//  * constant native GetTriggerEvalCount takes trigger whichTrigger returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @return {number}
//  */
// export function GetTriggerEvalCount(jass, whichTrigger) {}

// /**
//  * constant native GetTriggerExecCount takes trigger whichTrigger returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @return {number}
//  */
// export function GetTriggerExecCount(jass, whichTrigger) {}

/**
 * native ExecuteFunc takes string funcName returns nothing
 *
 * @param {JassContext} jass
 * @param {string} funcName
 */
export function ExecuteFunc(jass, funcName) {
  jass.call(funcName);
}

// /**
//  * native And takes boolexpr operandA, boolexpr operandB returns boolexpr
//  *
//  * @param {JassContext} jass
//  * @param {function(): boolean} operandA
//  * @param {function(): boolean} operandB
//  * @return {function(): boolean}
//  */
// export function And(jass, operandA, operandB) {}

// /**
//  * native Or takes boolexpr operandA, boolexpr operandB returns boolexpr
//  *
//  * @param {JassContext} jass
//  * @param {function(): boolean} operandA
//  * @param {function(): boolean} operandB
//  * @return {function(): boolean}
//  */
// export function Or(jass, operandA, operandB) {}

// /**
//  * native Not takes boolexpr operand returns boolexpr
//  *
//  * @param {JassContext} jass
//  * @param {function(): boolean} operand
//  * @return {function(): boolean}
//  */
// export function Not(jass, operand) {}

// /**
//  * native Condition takes code func returns conditionfunc
//  *
//  * @param {JassContext} jass
//  * @param {function()} func
//  * @return {function(): boolean}
//  */
// export function Condition(jass, func) {}

// /**
//  * native DestroyCondition takes conditionfunc c returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {function(): boolean} c
//  */
// export function DestroyCondition(jass, c) {}

// /**
//  * native Filter takes code func returns filterfunc
//  *
//  * @param {JassContext} jass
//  * @param {function()} func
//  * @return {function(): boolean}
//  */
// export function Filter(jass, func) {}

// /**
//  * native DestroyFilter takes filterfunc f returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {function(): boolean} f
//  */
// export function DestroyFilter(jass, f) {}

// /**
//  * native DestroyBoolExpr takes boolexpr e returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {function(): boolean} e
//  */
// export function DestroyBoolExpr(jass, e) {}

// /**
//  * native TriggerRegisterVariableEvent takes trigger whichTrigger, string varName, limitop opcode, real limitval returns event
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {string} varName
//  * @param {JassLimitOp} opcode
//  * @param {number} limitval
//  * @return {JassEvent}
//  */
// export function TriggerRegisterVariableEvent(jass, whichTrigger, varName, opcode, limitval) {}

// /**
//  * native TriggerRegisterTimerEvent takes trigger whichTrigger, real timeout, boolean periodic returns event
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {number} timeout
//  * @param {boolean} periodic
//  * @return {JassEvent}
//  */
// export function TriggerRegisterTimerEvent(jass, whichTrigger, timeout, periodic) {}

// /**
//  * native TriggerRegisterTimerExpireEvent takes trigger whichTrigger, timer t returns event
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {JassTimer} t
//  * @return {JassEvent}
//  */
// export function TriggerRegisterTimerExpireEvent(jass, whichTrigger, t) {}

// /**
//  * native TriggerRegisterGameStateEvent takes trigger whichTrigger, gamestate whichState, limitop opcode, real limitval returns event
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {JassGameState} whichState
//  * @param {JassLimitOp} opcode
//  * @param {number} limitval
//  * @return {JassEvent}
//  */
// export function TriggerRegisterGameStateEvent(jass, whichTrigger, whichState, opcode, limitval) {}

// /**
//  * native TriggerRegisterDialogEvent takes trigger whichTrigger, dialog whichDialog returns event
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {JassDialog} whichDialog
//  * @return {JassEvent}
//  */
// export function TriggerRegisterDialogEvent(jass, whichTrigger, whichDialog) {}

// /**
//  * native TriggerRegisterDialogButtonEvent takes trigger whichTrigger, button whichButton returns event
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {JassButton} whichButton
//  * @return {JassEvent}
//  */
// export function TriggerRegisterDialogButtonEvent(jass, whichTrigger, whichButton) {}

// /**
//  * constant native GetEventGameState takes nothing returns gamestate
//  *
//  * @param {JassContext} jass
//  * @return {JassGameState}
//  */
// export function GetEventGameState(jass) {}

// /**
//  * native TriggerRegisterGameEvent takes trigger whichTrigger, gameevent whichGameEvent returns event
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {JassGameEvent} whichGameEvent
//  * @return {JassEvent}
//  */
// export function TriggerRegisterGameEvent(jass, whichTrigger, whichGameEvent) {}

// /**
//  * constant native GetWinningPlayer takes nothing returns player
//  *
//  * @param {JassContext} jass
//  * @return {JassPlayer}
//  */
// export function GetWinningPlayer(jass) {}

// /**
//  * native TriggerRegisterEnterRegion takes trigger whichTrigger, region whichRegion, boolexpr filter returns event
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {JassRegion} whichRegion
//  * @param {function(): boolean} filter
//  * @return {JassEvent}
//  */
// export function TriggerRegisterEnterRegion(jass, whichTrigger, whichRegion, filter) {}

// /**
//  * constant native GetTriggeringRegion takes nothing returns region
//  *
//  * @param {JassContext} jass
//  * @return {JassRegion}
//  */
// export function GetTriggeringRegion(jass) {}

// /**
//  * constant native GetEnteringUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetEnteringUnit(jass) {}

// /**
//  * native TriggerRegisterLeaveRegion takes trigger whichTrigger, region whichRegion, boolexpr filter returns event
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {JassRegion} whichRegion
//  * @param {function(): boolean} filter
//  * @return {JassEvent}
//  */
// export function TriggerRegisterLeaveRegion(jass, whichTrigger, whichRegion, filter) {}

// /**
//  * constant native GetLeavingUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetLeavingUnit(jass) {}

// /**
//  * native TriggerRegisterTrackableHitEvent takes trigger whichTrigger, trackable t returns event
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {JassTrackable} t
//  * @return {JassEvent}
//  */
// export function TriggerRegisterTrackableHitEvent(jass, whichTrigger, t) {}

// /**
//  * native TriggerRegisterTrackableTrackEvent takes trigger whichTrigger, trackable t returns event
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {JassTrackable} t
//  * @return {JassEvent}
//  */
// export function TriggerRegisterTrackableTrackEvent(jass, whichTrigger, t) {}

// /**
//  * constant native GetTriggeringTrackable takes nothing returns trackable
//  *
//  * @param {JassContext} jass
//  * @return {JassTrackable}
//  */
// export function GetTriggeringTrackable(jass) {}

// /**
//  * constant native GetClickedButton takes nothing returns button
//  *
//  * @param {JassContext} jass
//  * @return {JassButton}
//  */
// export function GetClickedButton(jass) {}

// /**
//  * constant native GetClickedDialog takes nothing returns dialog
//  *
//  * @param {JassContext} jass
//  * @return {JassDialog}
//  */
// export function GetClickedDialog(jass) {}

// /**
//  * constant native GetTournamentFinishSoonTimeRemaining takes nothing returns real
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetTournamentFinishSoonTimeRemaining(jass) {}

// /**
//  * constant native GetTournamentFinishNowRule takes nothing returns integer
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetTournamentFinishNowRule(jass) {}

// /**
//  * constant native GetTournamentFinishNowPlayer takes nothing returns player
//  *
//  * @param {JassContext} jass
//  * @return {JassPlayer}
//  */
// export function GetTournamentFinishNowPlayer(jass) {}

// /**
//  * constant native GetTournamentScore takes player whichPlayer returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @return {number}
//  */
// export function GetTournamentScore(jass, whichPlayer) {}

// /**
//  * constant native GetSaveBasicFilename takes nothing returns string
//  *
//  * @param {JassContext} jass
//  * @return {string}
//  */
// export function GetSaveBasicFilename(jass) {}

// /**
//  * native TriggerRegisterPlayerEvent takes trigger whichTrigger, player whichPlayer, playerevent whichPlayerEvent returns event
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {JassPlayer} whichPlayer
//  * @param {JassPlayerEvent} whichPlayerEvent
//  * @return {JassEvent}
//  */
// export function TriggerRegisterPlayerEvent(jass, whichTrigger, whichPlayer, whichPlayerEvent) {}

// /**
//  * constant native GetTriggerPlayer takes nothing returns player
//  *
//  * @param {JassContext} jass
//  * @return {JassPlayer}
//  */
// export function GetTriggerPlayer(jass) {}

// /**
//  * native TriggerRegisterPlayerUnitEvent takes trigger whichTrigger, player whichPlayer, playerunitevent whichPlayerUnitEvent, boolexpr filter returns event
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {JassPlayer} whichPlayer
//  * @param {JassPlayerUnitEvent} whichPlayerUnitEvent
//  * @param {function(): boolean} filter
//  * @return {JassEvent}
//  */
// export function TriggerRegisterPlayerUnitEvent(jass, whichTrigger, whichPlayer, whichPlayerUnitEvent, filter) {}

// /**
//  * constant native GetLevelingUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetLevelingUnit(jass) {}

// /**
//  * constant native GetLearningUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetLearningUnit(jass) {}

// /**
//  * constant native GetLearnedSkill takes nothing returns integer
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetLearnedSkill(jass) {}

// /**
//  * constant native GetLearnedSkillLevel takes nothing returns integer
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetLearnedSkillLevel(jass) {}

// /**
//  * constant native GetRevivableUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetRevivableUnit(jass) {}

// /**
//  * constant native GetRevivingUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetRevivingUnit(jass) {}

// /**
//  * constant native GetAttacker takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetAttacker(jass) {}

// /**
//  * constant native GetRescuer takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetRescuer(jass) {}

// /**
//  * constant native GetDyingUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetDyingUnit(jass) {}

// /**
//  * constant native GetKillingUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetKillingUnit(jass) {}

// /**
//  * constant native GetDecayingUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetDecayingUnit(jass) {}

// /**
//  * constant native GetConstructingStructure takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetConstructingStructure(jass) {}

// /**
//  * constant native GetCancelledStructure takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetCancelledStructure(jass) {}

// /**
//  * constant native GetConstructedStructure takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetConstructedStructure(jass) {}

// /**
//  * constant native GetResearchingUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetResearchingUnit(jass) {}

// /**
//  * constant native GetResearched takes nothing returns integer
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetResearched(jass) {}

// /**
//  * constant native GetTrainedUnitType takes nothing returns integer
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetTrainedUnitType(jass) {}

// /**
//  * constant native GetTrainedUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetTrainedUnit(jass) {}

// /**
//  * constant native GetDetectedUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetDetectedUnit(jass) {}

// /**
//  * constant native GetSummoningUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetSummoningUnit(jass) {}

// /**
//  * constant native GetSummonedUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetSummonedUnit(jass) {}

// /**
//  * constant native GetTransportUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetTransportUnit(jass) {}

// /**
//  * constant native GetLoadedUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetLoadedUnit(jass) {}

// /**
//  * constant native GetSellingUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetSellingUnit(jass) {}

// /**
//  * constant native GetSoldUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetSoldUnit(jass) {}

// /**
//  * constant native GetBuyingUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetBuyingUnit(jass) {}

// /**
//  * constant native GetSoldItem takes nothing returns item
//  *
//  * @param {JassContext} jass
//  * @return {JassItem}
//  */
// export function GetSoldItem(jass) {}

// /**
//  * constant native GetChangingUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetChangingUnit(jass) {}

// /**
//  * constant native GetChangingUnitPrevOwner takes nothing returns player
//  *
//  * @param {JassContext} jass
//  * @return {JassPlayer}
//  */
// export function GetChangingUnitPrevOwner(jass) {}

// /**
//  * constant native GetManipulatingUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetManipulatingUnit(jass) {}

// /**
//  * constant native GetManipulatedItem takes nothing returns item
//  *
//  * @param {JassContext} jass
//  * @return {JassItem}
//  */
// export function GetManipulatedItem(jass) {}

// /**
//  * constant native GetOrderedUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetOrderedUnit(jass) {}

// /**
//  * constant native GetIssuedOrderId takes nothing returns integer
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetIssuedOrderId(jass) {}

// /**
//  * constant native GetOrderPointX takes nothing returns real
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetOrderPointX(jass) {}

// /**
//  * constant native GetOrderPointY takes nothing returns real
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetOrderPointY(jass) {}

// /**
//  * constant native GetOrderPointLoc takes nothing returns location
//  *
//  * @param {JassContext} jass
//  * @return {JassLocation}
//  */
// export function GetOrderPointLoc(jass) {}

// /**
//  * constant native GetOrderTarget takes nothing returns widget
//  *
//  * @param {JassContext} jass
//  * @return {JassWidget}
//  */
// export function GetOrderTarget(jass) {}

// /**
//  * constant native GetOrderTargetDestructable takes nothing returns destructable
//  *
//  * @param {JassContext} jass
//  * @return {JassDestructable}
//  */
// export function GetOrderTargetDestructable(jass) {}

// /**
//  * constant native GetOrderTargetItem takes nothing returns item
//  *
//  * @param {JassContext} jass
//  * @return {JassItem}
//  */
// export function GetOrderTargetItem(jass) {}

// /**
//  * constant native GetOrderTargetUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetOrderTargetUnit(jass) {}

// /**
//  * constant native GetSpellAbilityUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetSpellAbilityUnit(jass) {}

// /**
//  * constant native GetSpellAbilityId takes nothing returns integer
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetSpellAbilityId(jass) {}

// /**
//  * constant native GetSpellAbility takes nothing returns ability
//  *
//  * @param {JassContext} jass
//  * @return {JassAbility}
//  */
// export function GetSpellAbility(jass) {}

// /**
//  * constant native GetSpellTargetLoc takes nothing returns location
//  *
//  * @param {JassContext} jass
//  * @return {JassLocation}
//  */
// export function GetSpellTargetLoc(jass) {}

// /**
//  * constant native GetSpellTargetX takes nothing returns real
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetSpellTargetX(jass) {}

// /**
//  * constant native GetSpellTargetY takes nothing returns real
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetSpellTargetY(jass) {}

// /**
//  * constant native GetSpellTargetDestructable takes nothing returns destructable
//  *
//  * @param {JassContext} jass
//  * @return {JassDestructable}
//  */
// export function GetSpellTargetDestructable(jass) {}

// /**
//  * constant native GetSpellTargetItem takes nothing returns item
//  *
//  * @param {JassContext} jass
//  * @return {JassItem}
//  */
// export function GetSpellTargetItem(jass) {}

// /**
//  * constant native GetSpellTargetUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetSpellTargetUnit(jass) {}

// /**
//  * native TriggerRegisterPlayerAllianceChange takes trigger whichTrigger, player whichPlayer, alliancetype whichAlliance returns event
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {JassPlayer} whichPlayer
//  * @param {JassAllianceType} whichAlliance
//  * @return {JassEvent}
//  */
// export function TriggerRegisterPlayerAllianceChange(jass, whichTrigger, whichPlayer, whichAlliance) {}

// /**
//  * native TriggerRegisterPlayerStateEvent takes trigger whichTrigger, player whichPlayer, playerstate whichState, limitop opcode, real limitval returns event
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {JassPlayer} whichPlayer
//  * @param {JassPlayerState} whichState
//  * @param {JassLimitOp} opcode
//  * @param {number} limitval
//  * @return {JassEvent}
//  */
// export function TriggerRegisterPlayerStateEvent(jass, whichTrigger, whichPlayer, whichState, opcode, limitval) {}

// /**
//  * constant native GetEventPlayerState takes nothing returns playerstate
//  *
//  * @param {JassContext} jass
//  * @return {JassPlayerState}
//  */
// export function GetEventPlayerState(jass) {}

// /**
//  * native TriggerRegisterPlayerChatEvent takes trigger whichTrigger, player whichPlayer, string chatMessageToDetect, boolean exactMatchOnly returns event
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {JassPlayer} whichPlayer
//  * @param {string} chatMessageToDetect
//  * @param {boolean} exactMatchOnly
//  * @return {JassEvent}
//  */
// export function TriggerRegisterPlayerChatEvent(jass, whichTrigger, whichPlayer, chatMessageToDetect, exactMatchOnly) {}

// /**
//  * constant native GetEventPlayerChatString takes nothing returns string
//  *
//  * @param {JassContext} jass
//  * @return {string}
//  */
// export function GetEventPlayerChatString(jass) {}

// /**
//  * constant native GetEventPlayerChatStringMatched takes nothing returns string
//  *
//  * @param {JassContext} jass
//  * @return {string}
//  */
// export function GetEventPlayerChatStringMatched(jass) {}

// /**
//  * native TriggerRegisterDeathEvent takes trigger whichTrigger, widget whichWidget returns event
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {JassWidget} whichWidget
//  * @return {JassEvent}
//  */
// export function TriggerRegisterDeathEvent(jass, whichTrigger, whichWidget) {}

// /**
//  * constant native GetTriggerUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetTriggerUnit(jass) {}

// /**
//  * native TriggerRegisterUnitStateEvent takes trigger whichTrigger, unit whichUnit, unitstate whichState, limitop opcode, real limitval returns event
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {JassUnit} whichUnit
//  * @param {JassUnitState} whichState
//  * @param {JassLimitOp} opcode
//  * @param {number} limitval
//  * @return {JassEvent}
//  */
// export function TriggerRegisterUnitStateEvent(jass, whichTrigger, whichUnit, whichState, opcode, limitval) {}

// /**
//  * constant native GetEventUnitState takes nothing returns unitstate
//  *
//  * @param {JassContext} jass
//  * @return {JassUnitState}
//  */
// export function GetEventUnitState(jass) {}

// /**
//  * native TriggerRegisterUnitEvent takes trigger whichTrigger, unit whichUnit, unitevent whichEvent returns event
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {JassUnit} whichUnit
//  * @param {JassUnitEvent} whichEvent
//  * @return {JassEvent}
//  */
// export function TriggerRegisterUnitEvent(jass, whichTrigger, whichUnit, whichEvent) {}

// /**
//  * constant native GetEventDamage takes nothing returns real
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetEventDamage(jass) {}

// /**
//  * constant native GetEventDamageSource takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetEventDamageSource(jass) {}

// /**
//  * constant native GetEventDetectingPlayer takes nothing returns player
//  *
//  * @param {JassContext} jass
//  * @return {JassPlayer}
//  */
// export function GetEventDetectingPlayer(jass) {}

// /**
//  * native TriggerRegisterFilterUnitEvent takes trigger whichTrigger, unit whichUnit, unitevent whichEvent, boolexpr filter returns event
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {JassUnit} whichUnit
//  * @param {JassUnitEvent} whichEvent
//  * @param {function(): boolean} filter
//  * @return {JassEvent}
//  */
// export function TriggerRegisterFilterUnitEvent(jass, whichTrigger, whichUnit, whichEvent, filter) {}

// /**
//  * constant native GetEventTargetUnit takes nothing returns unit
//  *
//  * @param {JassContext} jass
//  * @return {JassUnit}
//  */
// export function GetEventTargetUnit(jass) {}

// /**
//  * native TriggerRegisterUnitInRange takes trigger whichTrigger, unit whichUnit, real range, boolexpr filter returns event
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {JassUnit} whichUnit
//  * @param {number} range
//  * @param {function(): boolean} filter
//  * @return {JassEvent}
//  */
// export function TriggerRegisterUnitInRange(jass, whichTrigger, whichUnit, range, filter) {}

// /**
//  * native TriggerAddCondition takes trigger whichTrigger, boolexpr condition returns triggercondition
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {function(): boolean} condition
//  * @return {function(): boolean}
//  */
// export function TriggerAddCondition(jass, whichTrigger, condition) {}

// /**
//  * native TriggerRemoveCondition takes trigger whichTrigger, triggercondition whichCondition returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {function(): boolean} whichCondition
//  */
// export function TriggerRemoveCondition(jass, whichTrigger, whichCondition) {}

// /**
//  * native TriggerClearConditions takes trigger whichTrigger returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  */
// export function TriggerClearConditions(jass, whichTrigger) {}

// /**
//  * native TriggerAddAction takes trigger whichTrigger, code actionFunc returns triggeraction
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {function()} actionFunc
//  * @return {function()}
//  */
// export function TriggerAddAction(jass, whichTrigger, actionFunc) {}

// /**
//  * native TriggerRemoveAction takes trigger whichTrigger, triggeraction whichAction returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @param {function()} whichAction
//  */
// export function TriggerRemoveAction(jass, whichTrigger, whichAction) {}

// /**
//  * native TriggerClearActions takes trigger whichTrigger returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  */
// export function TriggerClearActions(jass, whichTrigger) {}

// /**
//  * native TriggerSleepAction takes real timeout returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} timeout
//  */
// export function TriggerSleepAction(jass, timeout) {}

// /**
//  * native TriggerWaitForSound takes sound s, real offset returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassSound} s
//  * @param {number} offset
//  */
// export function TriggerWaitForSound(jass, s, offset) {}

// /**
//  * native TriggerEvaluate takes trigger whichTrigger returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  * @return {boolean}
//  */
// export function TriggerEvaluate(jass, whichTrigger) {}

// /**
//  * native TriggerExecute takes trigger whichTrigger returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  */
// export function TriggerExecute(jass, whichTrigger) {}

// /**
//  * native TriggerExecuteWait takes trigger whichTrigger returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTrigger} whichTrigger
//  */
// export function TriggerExecuteWait(jass, whichTrigger) {}

// /**
//  * native TriggerSyncStart takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function TriggerSyncStart(jass) {}

// /**
//  * native TriggerSyncReady takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function TriggerSyncReady(jass) {}

// /**
//  * native GetWidgetLife takes widget whichWidget returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassWidget} whichWidget
//  * @return {number}
//  */
// export function GetWidgetLife(jass, whichWidget) {}

// /**
//  * native SetWidgetLife takes widget whichWidget, real newLife returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassWidget} whichWidget
//  * @param {number} newLife
//  */
// export function SetWidgetLife(jass, whichWidget, newLife) {}

// /**
//  * native GetWidgetX takes widget whichWidget returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassWidget} whichWidget
//  * @return {number}
//  */
// export function GetWidgetX(jass, whichWidget) {}

// /**
//  * native GetWidgetY takes widget whichWidget returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassWidget} whichWidget
//  * @return {number}
//  */
// export function GetWidgetY(jass, whichWidget) {}

// /**
//  * constant native GetTriggerWidget takes nothing returns widget
//  *
//  * @param {JassContext} jass
//  * @return {JassWidget}
//  */
// export function GetTriggerWidget(jass) {}

// /**
//  * native CreateDestructable takes integer objectid, real x, real y, real face, real scale, integer variation returns destructable
//  *
//  * @param {JassContext} jass
//  * @param {number} objectid
//  * @param {number} x
//  * @param {number} y
//  * @param {number} face
//  * @param {number} scale
//  * @param {number} variation
//  * @return {JassDestructable}
//  */
// export function CreateDestructable(jass, objectid, x, y, face, scale, variation) {}

// /**
//  * native CreateDestructableZ takes integer objectid, real x, real y, real z, real face, real scale, integer variation returns destructable
//  *
//  * @param {JassContext} jass
//  * @param {number} objectid
//  * @param {number} x
//  * @param {number} y
//  * @param {number} z
//  * @param {number} face
//  * @param {number} scale
//  * @param {number} variation
//  * @return {JassDestructable}
//  */
// export function CreateDestructableZ(jass, objectid, x, y, z, face, scale, variation) {}

// /**
//  * native CreateDeadDestructable takes integer objectid, real x, real y, real face, real scale, integer variation returns destructable
//  *
//  * @param {JassContext} jass
//  * @param {number} objectid
//  * @param {number} x
//  * @param {number} y
//  * @param {number} face
//  * @param {number} scale
//  * @param {number} variation
//  * @return {JassDestructable}
//  */
// export function CreateDeadDestructable(jass, objectid, x, y, face, scale, variation) {}

// /**
//  * native CreateDeadDestructableZ takes integer objectid, real x, real y, real z, real face, real scale, integer variation returns destructable
//  *
//  * @param {JassContext} jass
//  * @param {number} objectid
//  * @param {number} x
//  * @param {number} y
//  * @param {number} z
//  * @param {number} face
//  * @param {number} scale
//  * @param {number} variation
//  * @return {JassDestructable}
//  */
// export function CreateDeadDestructableZ(jass, objectid, x, y, z, face, scale, variation) {}

// /**
//  * native RemoveDestructable takes destructable d returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassDestructable} d
//  */
// export function RemoveDestructable(jass, d) {}

// /**
//  * native KillDestructable takes destructable d returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassDestructable} d
//  */
// export function KillDestructable(jass, d) {}

// /**
//  * native SetDestructableInvulnerable takes destructable d, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassDestructable} d
//  * @param {boolean} flag
//  */
// export function SetDestructableInvulnerable(jass, d, flag) {}

// /**
//  * native IsDestructableInvulnerable takes destructable d returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassDestructable} d
//  * @return {boolean}
//  */
// export function IsDestructableInvulnerable(jass, d) {}

// /**
//  * native EnumDestructablesInRect takes rect r, boolexpr filter, code actionFunc returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassRect} r
//  * @param {function(): boolean} filter
//  * @param {function()} actionFunc
//  */
// export function EnumDestructablesInRect(jass, r, filter, actionFunc) {}

// /**
//  * native GetDestructableTypeId takes destructable d returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassDestructable} d
//  * @return {number}
//  */
// export function GetDestructableTypeId(jass, d) {}

// /**
//  * native GetDestructableX takes destructable d returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassDestructable} d
//  * @return {number}
//  */
// export function GetDestructableX(jass, d) {}

// /**
//  * native GetDestructableY takes destructable d returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassDestructable} d
//  * @return {number}
//  */
// export function GetDestructableY(jass, d) {}

// /**
//  * native SetDestructableLife takes destructable d, real life returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassDestructable} d
//  * @param {number} life
//  */
// export function SetDestructableLife(jass, d, life) {}

// /**
//  * native GetDestructableLife takes destructable d returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassDestructable} d
//  * @return {number}
//  */
// export function GetDestructableLife(jass, d) {}

// /**
//  * native SetDestructableMaxLife takes destructable d, real max returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassDestructable} d
//  * @param {number} max
//  */
// export function SetDestructableMaxLife(jass, d, max) {}

// /**
//  * native GetDestructableMaxLife takes destructable d returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassDestructable} d
//  * @return {number}
//  */
// export function GetDestructableMaxLife(jass, d) {}

// /**
//  * native DestructableRestoreLife takes destructable d, real life, boolean birth returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassDestructable} d
//  * @param {number} life
//  * @param {boolean} birth
//  */
// export function DestructableRestoreLife(jass, d, life, birth) {}

// /**
//  * native QueueDestructableAnimation takes destructable d, string whichAnimation returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassDestructable} d
//  * @param {string} whichAnimation
//  */
// export function QueueDestructableAnimation(jass, d, whichAnimation) {}

// /**
//  * native SetDestructableAnimation takes destructable d, string whichAnimation returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassDestructable} d
//  * @param {string} whichAnimation
//  */
// export function SetDestructableAnimation(jass, d, whichAnimation) {}

// /**
//  * native SetDestructableAnimationSpeed takes destructable d, real speedFactor returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassDestructable} d
//  * @param {number} speedFactor
//  */
// export function SetDestructableAnimationSpeed(jass, d, speedFactor) {}

// /**
//  * native ShowDestructable takes destructable d, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassDestructable} d
//  * @param {boolean} flag
//  */
// export function ShowDestructable(jass, d, flag) {}

// /**
//  * native GetDestructableOccluderHeight takes destructable d returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassDestructable} d
//  * @return {number}
//  */
// export function GetDestructableOccluderHeight(jass, d) {}

// /**
//  * native SetDestructableOccluderHeight takes destructable d, real height returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassDestructable} d
//  * @param {number} height
//  */
// export function SetDestructableOccluderHeight(jass, d, height) {}

// /**
//  * native GetDestructableName takes destructable d returns string
//  *
//  * @param {JassContext} jass
//  * @param {JassDestructable} d
//  * @return {string}
//  */
// export function GetDestructableName(jass, d) {}

// /**
//  * constant native GetTriggerDestructable takes nothing returns destructable
//  *
//  * @param {JassContext} jass
//  * @return {JassDestructable}
//  */
// export function GetTriggerDestructable(jass) {}

// /**
//  * native CreateItem takes integer itemid, real x, real y returns item
//  *
//  * @param {JassContext} jass
//  * @param {number} itemid
//  * @param {number} x
//  * @param {number} y
//  * @return {JassItem}
//  */
// export function CreateItem(jass, itemid, x, y) {}

// /**
//  * native RemoveItem takes item whichItem returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} whichItem
//  */
// export function RemoveItem(jass, whichItem) {}

// /**
//  * native GetItemPlayer takes item whichItem returns player
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} whichItem
//  * @return {JassPlayer}
//  */
// export function GetItemPlayer(jass, whichItem) {}

// /**
//  * native GetItemTypeId takes item i returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} i
//  * @return {number}
//  */
// export function GetItemTypeId(jass, i) {}

// /**
//  * native GetItemX takes item i returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} i
//  * @return {number}
//  */
// export function GetItemX(jass, i) {}

// /**
//  * native GetItemY takes item i returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} i
//  * @return {number}
//  */
// export function GetItemY(jass, i) {}

// /**
//  * native SetItemPosition takes item i, real x, real y returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} i
//  * @param {number} x
//  * @param {number} y
//  */
// export function SetItemPosition(jass, i, x, y) {}

// /**
//  * native SetItemDropOnDeath takes item whichItem, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} whichItem
//  * @param {boolean} flag
//  */
// export function SetItemDropOnDeath(jass, whichItem, flag) {}

// /**
//  * native SetItemDroppable takes item i, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} i
//  * @param {boolean} flag
//  */
// export function SetItemDroppable(jass, i, flag) {}

// /**
//  * native SetItemPawnable takes item i, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} i
//  * @param {boolean} flag
//  */
// export function SetItemPawnable(jass, i, flag) {}

// /**
//  * native SetItemPlayer takes item whichItem, player whichPlayer, boolean changeColor returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} whichItem
//  * @param {JassPlayer} whichPlayer
//  * @param {boolean} changeColor
//  */
// export function SetItemPlayer(jass, whichItem, whichPlayer, changeColor) {}

// /**
//  * native SetItemInvulnerable takes item whichItem, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} whichItem
//  * @param {boolean} flag
//  */
// export function SetItemInvulnerable(jass, whichItem, flag) {}

// /**
//  * native IsItemInvulnerable takes item whichItem returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} whichItem
//  * @return {boolean}
//  */
// export function IsItemInvulnerable(jass, whichItem) {}

// /**
//  * native SetItemVisible takes item whichItem, boolean show returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} whichItem
//  * @param {boolean} show
//  */
// export function SetItemVisible(jass, whichItem, show) {}

// /**
//  * native IsItemVisible takes item whichItem returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} whichItem
//  * @return {boolean}
//  */
// export function IsItemVisible(jass, whichItem) {}

// /**
//  * native IsItemOwned takes item whichItem returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} whichItem
//  * @return {boolean}
//  */
// export function IsItemOwned(jass, whichItem) {}

// /**
//  * native IsItemPowerup takes item whichItem returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} whichItem
//  * @return {boolean}
//  */
// export function IsItemPowerup(jass, whichItem) {}

// /**
//  * native IsItemSellable takes item whichItem returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} whichItem
//  * @return {boolean}
//  */
// export function IsItemSellable(jass, whichItem) {}

// /**
//  * native IsItemPawnable takes item whichItem returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} whichItem
//  * @return {boolean}
//  */
// export function IsItemPawnable(jass, whichItem) {}

// /**
//  * native IsItemIdPowerup takes integer itemId returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {number} itemId
//  * @return {boolean}
//  */
// export function IsItemIdPowerup(jass, itemId) {}

// /**
//  * native IsItemIdSellable takes integer itemId returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {number} itemId
//  * @return {boolean}
//  */
// export function IsItemIdSellable(jass, itemId) {}

// /**
//  * native IsItemIdPawnable takes integer itemId returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {number} itemId
//  * @return {boolean}
//  */
// export function IsItemIdPawnable(jass, itemId) {}

// /**
//  * native EnumItemsInRect takes rect r, boolexpr filter, code actionFunc returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassRect} r
//  * @param {function(): boolean} filter
//  * @param {function()} actionFunc
//  */
// export function EnumItemsInRect(jass, r, filter, actionFunc) {}

// /**
//  * native GetItemLevel takes item whichItem returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} whichItem
//  * @return {number}
//  */
// export function GetItemLevel(jass, whichItem) {}

// /**
//  * native GetItemType takes item whichItem returns itemtype
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} whichItem
//  * @return {JassItemType}
//  */
// export function GetItemType(jass, whichItem) {}

// /**
//  * native SetItemDropID takes item whichItem, integer unitId returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} whichItem
//  * @param {number} unitId
//  */
// export function SetItemDropID(jass, whichItem, unitId) {}

// /**
//  * constant native GetItemName takes item whichItem returns string
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} whichItem
//  * @return {string}
//  */
// export function GetItemName(jass, whichItem) {}

// /**
//  * native GetItemCharges takes item whichItem returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} whichItem
//  * @return {number}
//  */
// export function GetItemCharges(jass, whichItem) {}

// /**
//  * native SetItemCharges takes item whichItem, integer charges returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} whichItem
//  * @param {number} charges
//  */
// export function SetItemCharges(jass, whichItem, charges) {}

// /**
//  * native GetItemUserData takes item whichItem returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} whichItem
//  * @return {number}
//  */
// export function GetItemUserData(jass, whichItem) {}

// /**
//  * native SetItemUserData takes item whichItem, integer data returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassItem} whichItem
//  * @param {number} data
//  */
// export function SetItemUserData(jass, whichItem, data) {}

/**
 * native CreateUnit takes player id, integer unitid, real x, real y, real face returns unit
 *
 * @param {JassContext} jass
 * @param {JassPlayer} id
 * @param {number} unitid
 * @param {number} x
 * @param {number} y
 * @param {number} face
 * @return {JassUnit}
 */
export function CreateUnit(jass, id, unitid, x, y, face) {
  return jass.addHandle(new JassUnit(jass, id, base256ToString(unitid), x, y, face));
}

// /**
//  * native CreateUnitByName takes player whichPlayer, string unitname, real x, real y, real face returns unit
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {string} unitname
//  * @param {number} x
//  * @param {number} y
//  * @param {number} face
//  * @return {JassUnit}
//  */
// export function CreateUnitByName(jass, whichPlayer, unitname, x, y, face) {}

/**
 * native CreateUnitAtLoc takes player id, integer unitid, location whichLocation, real face returns unit
 *
 * @param {JassContext} jass
 * @param {JassPlayer} id
 * @param {number} unitid
 * @param {JassLocation} whichLocation
 * @param {number} face
 * @return {JassUnit}
 */
export function CreateUnitAtLoc(jass, id, unitid, whichLocation, face) {
  return CreateUnit(jass, id, unitid, whichLocation.x, whichLocation.y, face);
}

// /**
//  * native CreateUnitAtLocByName takes player id, string unitname, location whichLocation, real face returns unit
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} id
//  * @param {string} unitname
//  * @param {JassLocation} whichLocation
//  * @param {number} face
//  * @return {JassUnit}
//  */
// export function CreateUnitAtLocByName(jass, id, unitname, whichLocation, face) {}

// /**
//  * native CreateCorpse takes player whichPlayer, integer unitid, real x, real y, real face returns unit
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {number} unitid
//  * @param {number} x
//  * @param {number} y
//  * @param {number} face
//  * @return {JassUnit}
//  */
// export function CreateCorpse(jass, whichPlayer, unitid, x, y, face) {}

// /**
//  * native KillUnit takes unit whichUnit returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  */
// export function KillUnit(jass, whichUnit) {}

// /**
//  * native RemoveUnit takes unit whichUnit returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  */
// export function RemoveUnit(jass, whichUnit) {}

// /**
//  * native ShowUnit takes unit whichUnit, boolean show returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {boolean} show
//  */
// export function ShowUnit(jass, whichUnit, show) {}

/**
 * native SetUnitState takes unit whichUnit, unitstate whichUnitState, real newVal returns nothing
 *
 * @param {JassContext} jass
 * @param {JassUnit} whichUnit
 * @param {JassUnitState} whichUnitState
 * @param {number} newVal
 */
export function SetUnitState(jass, whichUnit, whichUnitState, newVal) {
  if (whichUnitState.value === 0) {
    whichUnit.health = newVal;
  } else if (whichUnitState.value === 2) {
    whichUnit.mana = newVal;
  }
}

/**
 * native SetUnitX takes unit whichUnit, real newX returns nothing
 *
 * @param {JassContext} jass
 * @param {JassUnit} whichUnit
 * @param {number} newX
 */
export function SetUnitX(jass, whichUnit, newX) {
  whichUnit.location[0] = newX;
}

/**
 * native SetUnitY takes unit whichUnit, real newY returns nothing
 *
 * @param {JassContext} jass
 * @param {JassUnit} whichUnit
 * @param {number} newY
 */
export function SetUnitY(jass, whichUnit, newY) {
  whichUnit.location[1] = newY;
}

/**
 * native SetUnitPosition takes unit whichUnit, real newX, real newY returns nothing
 *
 * @param {JassContext} jass
 * @param {JassUnit} whichUnit
 * @param {number} newX
 * @param {number} newY
 */
export function SetUnitPosition(jass, whichUnit, newX, newY) {
  whichUnit.location[0] = newX;
  whichUnit.location[1] = newY;
}

/**
 * native SetUnitPositionLoc takes unit whichUnit, location whichLocation returns nothing
 *
 * @param {JassContext} jass
 * @param {JassUnit} whichUnit
 * @param {JassLocation} whichLocation
 */
export function SetUnitPositionLoc(jass, whichUnit, whichLocation) {
  whichUnit.location[0] = whichLocation.x;
  whichUnit.location[1] = whichLocation.y;
}

/**
 * native SetUnitFacing takes unit whichUnit, real facingAngle returns nothing
 *
 * @param {JassContext} jass
 * @param {JassUnit} whichUnit
 * @param {number} facingAngle
 */
export function SetUnitFacing(jass, whichUnit, facingAngle) {
  whichUnit.facing = facingAngle;
}

// /**
//  * native SetUnitFacingTimed takes unit whichUnit, real facingAngle, real duration returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} facingAngle
//  * @param {number} duration
//  */
// export function SetUnitFacingTimed(jass, whichUnit, facingAngle, duration) {}

// /**
//  * native SetUnitMoveSpeed takes unit whichUnit, real newSpeed returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} newSpeed
//  */
// export function SetUnitMoveSpeed(jass, whichUnit, newSpeed) {}

// /**
//  * native SetUnitFlyHeight takes unit whichUnit, real newHeight, real rate returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} newHeight
//  * @param {number} rate
//  */
// export function SetUnitFlyHeight(jass, whichUnit, newHeight, rate) {}

// /**
//  * native SetUnitTurnSpeed takes unit whichUnit, real newTurnSpeed returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} newTurnSpeed
//  */
// export function SetUnitTurnSpeed(jass, whichUnit, newTurnSpeed) {}

// /**
//  * native SetUnitPropWindow takes unit whichUnit, real newPropWindowAngle returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} newPropWindowAngle
//  */
// export function SetUnitPropWindow(jass, whichUnit, newPropWindowAngle) {}

/**
 * native SetUnitAcquireRange takes unit whichUnit, real newAcquireRange returns nothing
 *
 * @param {JassContext} jass
 * @param {JassUnit} whichUnit
 * @param {number} newAcquireRange
 */
export function SetUnitAcquireRange(jass, whichUnit, newAcquireRange) {
  whichUnit.acquireRange = newAcquireRange;
}

// /**
//  * native SetUnitCreepGuard takes unit whichUnit, boolean creepGuard returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {boolean} creepGuard
//  */
// export function SetUnitCreepGuard(jass, whichUnit, creepGuard) {}

/**
 * native GetUnitAcquireRange takes unit whichUnit returns real
 *
 * @param {JassContext} jass
 * @param {JassUnit} whichUnit
 * @return {number}
 */
export function GetUnitAcquireRange(jass, whichUnit) {
  return whichUnit.acquireRange;
}

// /**
//  * native GetUnitTurnSpeed takes unit whichUnit returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {number}
//  */
// export function GetUnitTurnSpeed(jass, whichUnit) {}

// /**
//  * native GetUnitPropWindow takes unit whichUnit returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {number}
//  */
// export function GetUnitPropWindow(jass, whichUnit) {}

// /**
//  * native GetUnitFlyHeight takes unit whichUnit returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {number}
//  */
// export function GetUnitFlyHeight(jass, whichUnit) {}

// /**
//  * native GetUnitDefaultAcquireRange takes unit whichUnit returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {number}
//  */
// export function GetUnitDefaultAcquireRange(jass, whichUnit) {}

// /**
//  * native GetUnitDefaultTurnSpeed takes unit whichUnit returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {number}
//  */
// export function GetUnitDefaultTurnSpeed(jass, whichUnit) {}

// /**
//  * native GetUnitDefaultPropWindow takes unit whichUnit returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {number}
//  */
// export function GetUnitDefaultPropWindow(jass, whichUnit) {}

// /**
//  * native GetUnitDefaultFlyHeight takes unit whichUnit returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {number}
//  */
// export function GetUnitDefaultFlyHeight(jass, whichUnit) {}

// /**
//  * native SetUnitOwner takes unit whichUnit, player whichPlayer, boolean changeColor returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassPlayer} whichPlayer
//  * @param {boolean} changeColor
//  */
// export function SetUnitOwner(jass, whichUnit, whichPlayer, changeColor) {}

// /**
//  * native SetUnitColor takes unit whichUnit, playercolor whichColor returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassPlayerColor} whichColor
//  */
// export function SetUnitColor(jass, whichUnit, whichColor) {}

// /**
//  * native SetUnitScale takes unit whichUnit, real scaleX, real scaleY, real scaleZ returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} scaleX
//  * @param {number} scaleY
//  * @param {number} scaleZ
//  */
// export function SetUnitScale(jass, whichUnit, scaleX, scaleY, scaleZ) {}

// /**
//  * native SetUnitTimeScale takes unit whichUnit, real timeScale returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} timeScale
//  */
// export function SetUnitTimeScale(jass, whichUnit, timeScale) {}

// /**
//  * native SetUnitBlendTime takes unit whichUnit, real blendTime returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} blendTime
//  */
// export function SetUnitBlendTime(jass, whichUnit, blendTime) {}

// /**
//  * native SetUnitVertexColor takes unit whichUnit, integer red, integer green, integer blue, integer alpha returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} red
//  * @param {number} green
//  * @param {number} blue
//  * @param {number} alpha
//  */
// export function SetUnitVertexColor(jass, whichUnit, red, green, blue, alpha) {}

// /**
//  * native QueueUnitAnimation takes unit whichUnit, string whichAnimation returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {string} whichAnimation
//  */
// export function QueueUnitAnimation(jass, whichUnit, whichAnimation) {}

// /**
//  * native SetUnitAnimation takes unit whichUnit, string whichAnimation returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {string} whichAnimation
//  */
// export function SetUnitAnimation(jass, whichUnit, whichAnimation) {}

// /**
//  * native SetUnitAnimationByIndex takes unit whichUnit, integer whichAnimation returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} whichAnimation
//  */
// export function SetUnitAnimationByIndex(jass, whichUnit, whichAnimation) {}

// /**
//  * native SetUnitAnimationWithRarity takes unit whichUnit, string whichAnimation, raritycontrol rarity returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {string} whichAnimation
//  * @param {JassRarityControl} rarity
//  */
// export function SetUnitAnimationWithRarity(jass, whichUnit, whichAnimation, rarity) {}

// /**
//  * native AddUnitAnimationProperties takes unit whichUnit, string animProperties, boolean add returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {string} animProperties
//  * @param {boolean} add
//  */
// export function AddUnitAnimationProperties(jass, whichUnit, animProperties, add) {}

// /**
//  * native SetUnitLookAt takes unit whichUnit, string whichBone, unit lookAtTarget, real offsetX, real offsetY, real offsetZ returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {string} whichBone
//  * @param {JassUnit} lookAtTarget
//  * @param {number} offsetX
//  * @param {number} offsetY
//  * @param {number} offsetZ
//  */
// export function SetUnitLookAt(jass, whichUnit, whichBone, lookAtTarget, offsetX, offsetY, offsetZ) {}

// /**
//  * native ResetUnitLookAt takes unit whichUnit returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  */
// export function ResetUnitLookAt(jass, whichUnit) {}

// /**
//  * native SetUnitRescuable takes unit whichUnit, player byWhichPlayer, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassPlayer} byWhichPlayer
//  * @param {boolean} flag
//  */
// export function SetUnitRescuable(jass, whichUnit, byWhichPlayer, flag) {}

// /**
//  * native SetUnitRescueRange takes unit whichUnit, real range returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} range
//  */
// export function SetUnitRescueRange(jass, whichUnit, range) {}

// /**
//  * native SetHeroStr takes unit whichHero, integer newStr, boolean permanent returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichHero
//  * @param {number} newStr
//  * @param {boolean} permanent
//  */
// export function SetHeroStr(jass, whichHero, newStr, permanent) {}

// /**
//  * native SetHeroAgi takes unit whichHero, integer newAgi, boolean permanent returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichHero
//  * @param {number} newAgi
//  * @param {boolean} permanent
//  */
// export function SetHeroAgi(jass, whichHero, newAgi, permanent) {}

// /**
//  * native SetHeroInt takes unit whichHero, integer newInt, boolean permanent returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichHero
//  * @param {number} newInt
//  * @param {boolean} permanent
//  */
// export function SetHeroInt(jass, whichHero, newInt, permanent) {}

// /**
//  * native GetHeroStr takes unit whichHero, boolean includeBonuses returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichHero
//  * @param {boolean} includeBonuses
//  * @return {number}
//  */
// export function GetHeroStr(jass, whichHero, includeBonuses) {}

// /**
//  * native GetHeroAgi takes unit whichHero, boolean includeBonuses returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichHero
//  * @param {boolean} includeBonuses
//  * @return {number}
//  */
// export function GetHeroAgi(jass, whichHero, includeBonuses) {}

// /**
//  * native GetHeroInt takes unit whichHero, boolean includeBonuses returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichHero
//  * @param {boolean} includeBonuses
//  * @return {number}
//  */
// export function GetHeroInt(jass, whichHero, includeBonuses) {}

// /**
//  * native UnitStripHeroLevel takes unit whichHero, integer howManyLevels returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichHero
//  * @param {number} howManyLevels
//  * @return {boolean}
//  */
// export function UnitStripHeroLevel(jass, whichHero, howManyLevels) {}

// /**
//  * native GetHeroXP takes unit whichHero returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichHero
//  * @return {number}
//  */
// export function GetHeroXP(jass, whichHero) {}

// /**
//  * native SetHeroXP takes unit whichHero, integer newXpVal, boolean showEyeCandy returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichHero
//  * @param {number} newXpVal
//  * @param {boolean} showEyeCandy
//  */
// export function SetHeroXP(jass, whichHero, newXpVal, showEyeCandy) {}

// /**
//  * native GetHeroSkillPoints takes unit whichHero returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichHero
//  * @return {number}
//  */
// export function GetHeroSkillPoints(jass, whichHero) {}

// /**
//  * native UnitModifySkillPoints takes unit whichHero, integer skillPointDelta returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichHero
//  * @param {number} skillPointDelta
//  * @return {boolean}
//  */
// export function UnitModifySkillPoints(jass, whichHero, skillPointDelta) {}

// /**
//  * native AddHeroXP takes unit whichHero, integer xpToAdd, boolean showEyeCandy returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichHero
//  * @param {number} xpToAdd
//  * @param {boolean} showEyeCandy
//  */
// export function AddHeroXP(jass, whichHero, xpToAdd, showEyeCandy) {}

// /**
//  * native SetHeroLevel takes unit whichHero, integer level, boolean showEyeCandy returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichHero
//  * @param {number} level
//  * @param {boolean} showEyeCandy
//  */
// export function SetHeroLevel(jass, whichHero, level, showEyeCandy) {}

// /**
//  * constant native GetHeroLevel takes unit whichHero returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichHero
//  * @return {number}
//  */
// export function GetHeroLevel(jass, whichHero) {}

// /**
//  * constant native GetUnitLevel takes unit whichUnit returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {number}
//  */
// export function GetUnitLevel(jass, whichUnit) {}

// /**
//  * native GetHeroProperName takes unit whichHero returns string
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichHero
//  * @return {string}
//  */
// export function GetHeroProperName(jass, whichHero) {}

// /**
//  * native SuspendHeroXP takes unit whichHero, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichHero
//  * @param {boolean} flag
//  */
// export function SuspendHeroXP(jass, whichHero, flag) {}

// /**
//  * native IsSuspendedXP takes unit whichHero returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichHero
//  * @return {boolean}
//  */
// export function IsSuspendedXP(jass, whichHero) {}

// /**
//  * native SelectHeroSkill takes unit whichHero, integer abilcode returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichHero
//  * @param {number} abilcode
//  */
// export function SelectHeroSkill(jass, whichHero, abilcode) {}

// /**
//  * native GetUnitAbilityLevel takes unit whichUnit, integer abilcode returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} abilcode
//  * @return {number}
//  */
// export function GetUnitAbilityLevel(jass, whichUnit, abilcode) {}

// /**
//  * native DecUnitAbilityLevel takes unit whichUnit, integer abilcode returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} abilcode
//  * @return {number}
//  */
// export function DecUnitAbilityLevel(jass, whichUnit, abilcode) {}

// /**
//  * native IncUnitAbilityLevel takes unit whichUnit, integer abilcode returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} abilcode
//  * @return {number}
//  */
// export function IncUnitAbilityLevel(jass, whichUnit, abilcode) {}

// /**
//  * native SetUnitAbilityLevel takes unit whichUnit, integer abilcode, integer level returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} abilcode
//  * @param {number} level
//  * @return {number}
//  */
// export function SetUnitAbilityLevel(jass, whichUnit, abilcode, level) {}

// /**
//  * native ReviveHero takes unit whichHero, real x, real y, boolean doEyecandy returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichHero
//  * @param {number} x
//  * @param {number} y
//  * @param {boolean} doEyecandy
//  * @return {boolean}
//  */
// export function ReviveHero(jass, whichHero, x, y, doEyecandy) {}

// /**
//  * native ReviveHeroLoc takes unit whichHero, location loc, boolean doEyecandy returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichHero
//  * @param {JassLocation} loc
//  * @param {boolean} doEyecandy
//  * @return {boolean}
//  */
// export function ReviveHeroLoc(jass, whichHero, loc, doEyecandy) {}

// /**
//  * native SetUnitExploded takes unit whichUnit, boolean exploded returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {boolean} exploded
//  */
// export function SetUnitExploded(jass, whichUnit, exploded) {}

// /**
//  * native SetUnitInvulnerable takes unit whichUnit, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {boolean} flag
//  */
// export function SetUnitInvulnerable(jass, whichUnit, flag) {}

// /**
//  * native PauseUnit takes unit whichUnit, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {boolean} flag
//  */
// export function PauseUnit(jass, whichUnit, flag) {}

// /**
//  * native IsUnitPaused takes unit whichHero returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichHero
//  * @return {boolean}
//  */
// export function IsUnitPaused(jass, whichHero) {}

// /**
//  * native SetUnitPathing takes unit whichUnit, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {boolean} flag
//  */
// export function SetUnitPathing(jass, whichUnit, flag) {}

// /**
//  * native ClearSelection takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function ClearSelection(jass) {}

// /**
//  * native SelectUnit takes unit whichUnit, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {boolean} flag
//  */
// export function SelectUnit(jass, whichUnit, flag) {}

// /**
//  * native GetUnitPointValue takes unit whichUnit returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {number}
//  */
// export function GetUnitPointValue(jass, whichUnit) {}

// /**
//  * native GetUnitPointValueByType takes integer unitType returns integer
//  *
//  * @param {JassContext} jass
//  * @param {number} unitType
//  * @return {number}
//  */
// export function GetUnitPointValueByType(jass, unitType) {}

// /**
//  * native UnitAddItem takes unit whichUnit, item whichItem returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassItem} whichItem
//  * @return {boolean}
//  */
// export function UnitAddItem(jass, whichUnit, whichItem) {}

// /**
//  * native UnitAddItemById takes unit whichUnit, integer itemId returns item
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} itemId
//  * @return {JassItem}
//  */
// export function UnitAddItemById(jass, whichUnit, itemId) {}

// /**
//  * native UnitAddItemToSlotById takes unit whichUnit, integer itemId, integer itemSlot returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} itemId
//  * @param {number} itemSlot
//  * @return {boolean}
//  */
// export function UnitAddItemToSlotById(jass, whichUnit, itemId, itemSlot) {}

// /**
//  * native UnitRemoveItem takes unit whichUnit, item whichItem returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassItem} whichItem
//  */
// export function UnitRemoveItem(jass, whichUnit, whichItem) {}

// /**
//  * native UnitRemoveItemFromSlot takes unit whichUnit, integer itemSlot returns item
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} itemSlot
//  * @return {JassItem}
//  */
// export function UnitRemoveItemFromSlot(jass, whichUnit, itemSlot) {}

// /**
//  * native UnitHasItem takes unit whichUnit, item whichItem returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassItem} whichItem
//  * @return {boolean}
//  */
// export function UnitHasItem(jass, whichUnit, whichItem) {}

// /**
//  * native UnitItemInSlot takes unit whichUnit, integer itemSlot returns item
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} itemSlot
//  * @return {JassItem}
//  */
// export function UnitItemInSlot(jass, whichUnit, itemSlot) {}

// /**
//  * native UnitInventorySize takes unit whichUnit returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {number}
//  */
// export function UnitInventorySize(jass, whichUnit) {}

// /**
//  * native UnitDropItemPoint takes unit whichUnit, item whichItem, real x, real y returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassItem} whichItem
//  * @param {number} x
//  * @param {number} y
//  * @return {boolean}
//  */
// export function UnitDropItemPoint(jass, whichUnit, whichItem, x, y) {}

// /**
//  * native UnitDropItemSlot takes unit whichUnit, item whichItem, integer slot returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassItem} whichItem
//  * @param {number} slot
//  * @return {boolean}
//  */
// export function UnitDropItemSlot(jass, whichUnit, whichItem, slot) {}

// /**
//  * native UnitDropItemTarget takes unit whichUnit, item whichItem, widget target returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassItem} whichItem
//  * @param {JassWidget} target
//  * @return {boolean}
//  */
// export function UnitDropItemTarget(jass, whichUnit, whichItem, target) {}

// /**
//  * native UnitUseItem takes unit whichUnit, item whichItem returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassItem} whichItem
//  * @return {boolean}
//  */
// export function UnitUseItem(jass, whichUnit, whichItem) {}

// /**
//  * native UnitUseItemPoint takes unit whichUnit, item whichItem, real x, real y returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassItem} whichItem
//  * @param {number} x
//  * @param {number} y
//  * @return {boolean}
//  */
// export function UnitUseItemPoint(jass, whichUnit, whichItem, x, y) {}

// /**
//  * native UnitUseItemTarget takes unit whichUnit, item whichItem, widget target returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassItem} whichItem
//  * @param {JassWidget} target
//  * @return {boolean}
//  */
// export function UnitUseItemTarget(jass, whichUnit, whichItem, target) {}

// /**
//  * constant native GetUnitX takes unit whichUnit returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {number}
//  */
// export function GetUnitX(jass, whichUnit) {}

// /**
//  * constant native GetUnitY takes unit whichUnit returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {number}
//  */
// export function GetUnitY(jass, whichUnit) {}

// /**
//  * constant native GetUnitLoc takes unit whichUnit returns location
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {JassLocation}
//  */
// export function GetUnitLoc(jass, whichUnit) {}

// /**
//  * constant native GetUnitFacing takes unit whichUnit returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {number}
//  */
// export function GetUnitFacing(jass, whichUnit) {}

// /**
//  * constant native GetUnitMoveSpeed takes unit whichUnit returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {number}
//  */
// export function GetUnitMoveSpeed(jass, whichUnit) {}

// /**
//  * constant native GetUnitDefaultMoveSpeed takes unit whichUnit returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {number}
//  */
// export function GetUnitDefaultMoveSpeed(jass, whichUnit) {}

/**
 * constant native GetUnitState takes unit whichUnit, unitstate whichUnitState returns real
 *
 * @param {JassContext} jass
 * @param {JassUnit} whichUnit
 * @param {JassUnitState} whichUnitState
 * @return {number}
 */
export function GetUnitState(jass, whichUnit, whichUnitState) {
  if (whichUnitState.value === 0) {
    return whichUnit.health;
  } else if (whichUnitState.value === 1) {
    return whichUnit.maxHealth;
  } else if (whichUnitState.value === 2) {
    return whichUnit.mana;
  } else if (whichUnitState.value === 3) {
    return whichUnit.maxMana;
  }
}

/**
 * constant native GetOwningPlayer takes unit whichUnit returns player
 *
 * @param {JassContext} jass
 * @param {JassUnit} whichUnit
 * @return {JassPlayer}
 */
export function GetOwningPlayer(jass, whichUnit) {
  return whichUnit.player;
}

// /**
//  * constant native GetUnitTypeId takes unit whichUnit returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {number}
//  */
// export function GetUnitTypeId(jass, whichUnit) {}

// /**
//  * constant native GetUnitRace takes unit whichUnit returns race
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {JassRace}
//  */
// export function GetUnitRace(jass, whichUnit) {}

// /**
//  * constant native GetUnitName takes unit whichUnit returns string
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {string}
//  */
// export function GetUnitName(jass, whichUnit) {}

// /**
//  * constant native GetUnitFoodUsed takes unit whichUnit returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {number}
//  */
// export function GetUnitFoodUsed(jass, whichUnit) {}

// /**
//  * constant native GetUnitFoodMade takes unit whichUnit returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {number}
//  */
// export function GetUnitFoodMade(jass, whichUnit) {}

// /**
//  * constant native GetFoodMade takes integer unitId returns integer
//  *
//  * @param {JassContext} jass
//  * @param {number} unitId
//  * @return {number}
//  */
// export function GetFoodMade(jass, unitId) {}

// /**
//  * constant native GetFoodUsed takes integer unitId returns integer
//  *
//  * @param {JassContext} jass
//  * @param {number} unitId
//  * @return {number}
//  */
// export function GetFoodUsed(jass, unitId) {}

// /**
//  * native SetUnitUseFood takes unit whichUnit, boolean useFood returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {boolean} useFood
//  */
// export function SetUnitUseFood(jass, whichUnit, useFood) {}

// /**
//  * constant native GetUnitRallyPoint takes unit whichUnit returns location
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {JassLocation}
//  */
// export function GetUnitRallyPoint(jass, whichUnit) {}

// /**
//  * constant native GetUnitRallyUnit takes unit whichUnit returns unit
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {JassUnit}
//  */
// export function GetUnitRallyUnit(jass, whichUnit) {}

// /**
//  * constant native GetUnitRallyDestructable takes unit whichUnit returns destructable
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {JassDestructable}
//  */
// export function GetUnitRallyDestructable(jass, whichUnit) {}

// /**
//  * constant native IsUnitInGroup takes unit whichUnit, group whichGroup returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassGroup} whichGroup
//  * @return {boolean}
//  */
// export function IsUnitInGroup(jass, whichUnit, whichGroup) {}

// /**
//  * constant native IsUnitInForce takes unit whichUnit, force whichForce returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassForce} whichForce
//  * @return {boolean}
//  */
// export function IsUnitInForce(jass, whichUnit, whichForce) {}

// /**
//  * constant native IsUnitOwnedByPlayer takes unit whichUnit, player whichPlayer returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassPlayer} whichPlayer
//  * @return {boolean}
//  */
// export function IsUnitOwnedByPlayer(jass, whichUnit, whichPlayer) {}

// /**
//  * constant native IsUnitAlly takes unit whichUnit, player whichPlayer returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassPlayer} whichPlayer
//  * @return {boolean}
//  */
// export function IsUnitAlly(jass, whichUnit, whichPlayer) {}

// /**
//  * constant native IsUnitEnemy takes unit whichUnit, player whichPlayer returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassPlayer} whichPlayer
//  * @return {boolean}
//  */
// export function IsUnitEnemy(jass, whichUnit, whichPlayer) {}

// /**
//  * constant native IsUnitVisible takes unit whichUnit, player whichPlayer returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassPlayer} whichPlayer
//  * @return {boolean}
//  */
// export function IsUnitVisible(jass, whichUnit, whichPlayer) {}

// /**
//  * constant native IsUnitDetected takes unit whichUnit, player whichPlayer returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassPlayer} whichPlayer
//  * @return {boolean}
//  */
// export function IsUnitDetected(jass, whichUnit, whichPlayer) {}

// /**
//  * constant native IsUnitInvisible takes unit whichUnit, player whichPlayer returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassPlayer} whichPlayer
//  * @return {boolean}
//  */
// export function IsUnitInvisible(jass, whichUnit, whichPlayer) {}

// /**
//  * constant native IsUnitFogged takes unit whichUnit, player whichPlayer returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassPlayer} whichPlayer
//  * @return {boolean}
//  */
// export function IsUnitFogged(jass, whichUnit, whichPlayer) {}

// /**
//  * constant native IsUnitMasked takes unit whichUnit, player whichPlayer returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassPlayer} whichPlayer
//  * @return {boolean}
//  */
// export function IsUnitMasked(jass, whichUnit, whichPlayer) {}

// /**
//  * constant native IsUnitSelected takes unit whichUnit, player whichPlayer returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassPlayer} whichPlayer
//  * @return {boolean}
//  */
// export function IsUnitSelected(jass, whichUnit, whichPlayer) {}

// /**
//  * constant native IsUnitRace takes unit whichUnit, race whichRace returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassRace} whichRace
//  * @return {boolean}
//  */
// export function IsUnitRace(jass, whichUnit, whichRace) {}

// /**
//  * constant native IsUnitType takes unit whichUnit, unittype whichUnitType returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassUnitType} whichUnitType
//  * @return {boolean}
//  */
// export function IsUnitType(jass, whichUnit, whichUnitType) {}

// /**
//  * constant native IsUnit takes unit whichUnit, unit whichSpecifiedUnit returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassUnit} whichSpecifiedUnit
//  * @return {boolean}
//  */
// export function IsUnit(jass, whichUnit, whichSpecifiedUnit) {}

// /**
//  * constant native IsUnitInRange takes unit whichUnit, unit otherUnit, real distance returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassUnit} otherUnit
//  * @param {number} distance
//  * @return {boolean}
//  */
// export function IsUnitInRange(jass, whichUnit, otherUnit, distance) {}

// /**
//  * constant native IsUnitInRangeXY takes unit whichUnit, real x, real y, real distance returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} x
//  * @param {number} y
//  * @param {number} distance
//  * @return {boolean}
//  */
// export function IsUnitInRangeXY(jass, whichUnit, x, y, distance) {}

// /**
//  * constant native IsUnitInRangeLoc takes unit whichUnit, location whichLocation, real distance returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassLocation} whichLocation
//  * @param {number} distance
//  * @return {boolean}
//  */
// export function IsUnitInRangeLoc(jass, whichUnit, whichLocation, distance) {}

// /**
//  * constant native IsUnitHidden takes unit whichUnit returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {boolean}
//  */
// export function IsUnitHidden(jass, whichUnit) {}

// /**
//  * constant native IsUnitIllusion takes unit whichUnit returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {boolean}
//  */
// export function IsUnitIllusion(jass, whichUnit) {}

// /**
//  * constant native IsUnitInTransport takes unit whichUnit, unit whichTransport returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassUnit} whichTransport
//  * @return {boolean}
//  */
// export function IsUnitInTransport(jass, whichUnit, whichTransport) {}

// /**
//  * constant native IsUnitLoaded takes unit whichUnit returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {boolean}
//  */
// export function IsUnitLoaded(jass, whichUnit) {}

// /**
//  * constant native IsHeroUnitId takes integer unitId returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {number} unitId
//  * @return {boolean}
//  */
// export function IsHeroUnitId(jass, unitId) {}

// /**
//  * constant native IsUnitIdType takes integer unitId, unittype whichUnitType returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {number} unitId
//  * @param {JassUnitType} whichUnitType
//  * @return {boolean}
//  */
// export function IsUnitIdType(jass, unitId, whichUnitType) {}

// /**
//  * native UnitShareVision takes unit whichUnit, player whichPlayer, boolean share returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassPlayer} whichPlayer
//  * @param {boolean} share
//  */
// export function UnitShareVision(jass, whichUnit, whichPlayer, share) {}

// /**
//  * native UnitSuspendDecay takes unit whichUnit, boolean suspend returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {boolean} suspend
//  */
// export function UnitSuspendDecay(jass, whichUnit, suspend) {}

// /**
//  * native UnitAddType takes unit whichUnit, unittype whichUnitType returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassUnitType} whichUnitType
//  * @return {boolean}
//  */
// export function UnitAddType(jass, whichUnit, whichUnitType) {}

// /**
//  * native UnitRemoveType takes unit whichUnit, unittype whichUnitType returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassUnitType} whichUnitType
//  * @return {boolean}
//  */
// export function UnitRemoveType(jass, whichUnit, whichUnitType) {}

// /**
//  * native UnitAddAbility takes unit whichUnit, integer abilityId returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} abilityId
//  * @return {boolean}
//  */
// export function UnitAddAbility(jass, whichUnit, abilityId) {}

// /**
//  * native UnitRemoveAbility takes unit whichUnit, integer abilityId returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} abilityId
//  * @return {boolean}
//  */
// export function UnitRemoveAbility(jass, whichUnit, abilityId) {}

// /**
//  * native UnitMakeAbilityPermanent takes unit whichUnit, boolean permanent, integer abilityId returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {boolean} permanent
//  * @param {number} abilityId
//  * @return {boolean}
//  */
// export function UnitMakeAbilityPermanent(jass, whichUnit, permanent, abilityId) {}

// /**
//  * native UnitRemoveBuffs takes unit whichUnit, boolean removePositive, boolean removeNegative returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {boolean} removePositive
//  * @param {boolean} removeNegative
//  */
// export function UnitRemoveBuffs(jass, whichUnit, removePositive, removeNegative) {}

// /**
//  * native UnitRemoveBuffsEx takes unit whichUnit, boolean removePositive, boolean removeNegative, boolean magic, boolean physical, boolean timedLife, boolean aura, boolean autoDispel returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {boolean} removePositive
//  * @param {boolean} removeNegative
//  * @param {boolean} magic
//  * @param {boolean} physical
//  * @param {boolean} timedLife
//  * @param {boolean} aura
//  * @param {boolean} autoDispel
//  */
// export function UnitRemoveBuffsEx(jass, whichUnit, removePositive, removeNegative, magic, physical, timedLife, aura, autoDispel) {}

// /**
//  * native UnitHasBuffsEx takes unit whichUnit, boolean removePositive, boolean removeNegative, boolean magic, boolean physical, boolean timedLife, boolean aura, boolean autoDispel returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {boolean} removePositive
//  * @param {boolean} removeNegative
//  * @param {boolean} magic
//  * @param {boolean} physical
//  * @param {boolean} timedLife
//  * @param {boolean} aura
//  * @param {boolean} autoDispel
//  * @return {boolean}
//  */
// export function UnitHasBuffsEx(jass, whichUnit, removePositive, removeNegative, magic, physical, timedLife, aura, autoDispel) {}

// /**
//  * native UnitCountBuffsEx takes unit whichUnit, boolean removePositive, boolean removeNegative, boolean magic, boolean physical, boolean timedLife, boolean aura, boolean autoDispel returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {boolean} removePositive
//  * @param {boolean} removeNegative
//  * @param {boolean} magic
//  * @param {boolean} physical
//  * @param {boolean} timedLife
//  * @param {boolean} aura
//  * @param {boolean} autoDispel
//  * @return {number}
//  */
// export function UnitCountBuffsEx(jass, whichUnit, removePositive, removeNegative, magic, physical, timedLife, aura, autoDispel) {}

// /**
//  * native UnitAddSleep takes unit whichUnit, boolean add returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {boolean} add
//  */
// export function UnitAddSleep(jass, whichUnit, add) {}

// /**
//  * native UnitCanSleep takes unit whichUnit returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {boolean}
//  */
// export function UnitCanSleep(jass, whichUnit) {}

// /**
//  * native UnitAddSleepPerm takes unit whichUnit, boolean add returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {boolean} add
//  */
// export function UnitAddSleepPerm(jass, whichUnit, add) {}

// /**
//  * native UnitCanSleepPerm takes unit whichUnit returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {boolean}
//  */
// export function UnitCanSleepPerm(jass, whichUnit) {}

// /**
//  * native UnitIsSleeping takes unit whichUnit returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {boolean}
//  */
// export function UnitIsSleeping(jass, whichUnit) {}

// /**
//  * native UnitWakeUp takes unit whichUnit returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  */
// export function UnitWakeUp(jass, whichUnit) {}

// /**
//  * native UnitApplyTimedLife takes unit whichUnit, integer buffId, real duration returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} buffId
//  * @param {number} duration
//  */
// export function UnitApplyTimedLife(jass, whichUnit, buffId, duration) {}

// /**
//  * native UnitIgnoreAlarm takes unit whichUnit, boolean flag returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {boolean} flag
//  * @return {boolean}
//  */
// export function UnitIgnoreAlarm(jass, whichUnit, flag) {}

// /**
//  * native UnitIgnoreAlarmToggled takes unit whichUnit returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {boolean}
//  */
// export function UnitIgnoreAlarmToggled(jass, whichUnit) {}

// /**
//  * native UnitResetCooldown takes unit whichUnit returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  */
// export function UnitResetCooldown(jass, whichUnit) {}

// /**
//  * native UnitSetConstructionProgress takes unit whichUnit, integer constructionPercentage returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} constructionPercentage
//  */
// export function UnitSetConstructionProgress(jass, whichUnit, constructionPercentage) {}

// /**
//  * native UnitSetUpgradeProgress takes unit whichUnit, integer upgradePercentage returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} upgradePercentage
//  */
// export function UnitSetUpgradeProgress(jass, whichUnit, upgradePercentage) {}

// /**
//  * native UnitPauseTimedLife takes unit whichUnit, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {boolean} flag
//  */
// export function UnitPauseTimedLife(jass, whichUnit, flag) {}

// /**
//  * native UnitSetUsesAltIcon takes unit whichUnit, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {boolean} flag
//  */
// export function UnitSetUsesAltIcon(jass, whichUnit, flag) {}

// /**
//  * native UnitDamagePoint takes unit whichUnit, real delay, real radius, real x, real y, real amount, boolean attack, boolean ranged, attacktype attackType, damagetype damageType, weapontype weaponType returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} delay
//  * @param {number} radius
//  * @param {number} x
//  * @param {number} y
//  * @param {number} amount
//  * @param {boolean} attack
//  * @param {boolean} ranged
//  * @param {JassAttackType} attackType
//  * @param {JassDamageType} damageType
//  * @param {JassWeaponType} weaponType
//  * @return {boolean}
//  */
// export function UnitDamagePoint(jass, whichUnit, delay, radius, x, y, amount, attack, ranged, attackType, damageType, weaponType) {}

// /**
//  * native UnitDamageTarget takes unit whichUnit, widget target, real amount, boolean attack, boolean ranged, attacktype attackType, damagetype damageType, weapontype weaponType returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {JassWidget} target
//  * @param {number} amount
//  * @param {boolean} attack
//  * @param {boolean} ranged
//  * @param {JassAttackType} attackType
//  * @param {JassDamageType} damageType
//  * @param {JassWeaponType} weaponType
//  * @return {boolean}
//  */
// export function UnitDamageTarget(jass, whichUnit, target, amount, attack, ranged, attackType, damageType, weaponType) {}

// /**
//  * native IssueImmediateOrder takes unit whichUnit, string order returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {string} order
//  * @return {boolean}
//  */
// export function IssueImmediateOrder(jass, whichUnit, order) {}

// /**
//  * native IssueImmediateOrderById takes unit whichUnit, integer order returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} order
//  * @return {boolean}
//  */
// export function IssueImmediateOrderById(jass, whichUnit, order) {}

// /**
//  * native IssuePointOrder takes unit whichUnit, string order, real x, real y returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {string} order
//  * @param {number} x
//  * @param {number} y
//  * @return {boolean}
//  */
// export function IssuePointOrder(jass, whichUnit, order, x, y) {}

// /**
//  * native IssuePointOrderLoc takes unit whichUnit, string order, location whichLocation returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {string} order
//  * @param {JassLocation} whichLocation
//  * @return {boolean}
//  */
// export function IssuePointOrderLoc(jass, whichUnit, order, whichLocation) {}

// /**
//  * native IssuePointOrderById takes unit whichUnit, integer order, real x, real y returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} order
//  * @param {number} x
//  * @param {number} y
//  * @return {boolean}
//  */
// export function IssuePointOrderById(jass, whichUnit, order, x, y) {}

// /**
//  * native IssuePointOrderByIdLoc takes unit whichUnit, integer order, location whichLocation returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} order
//  * @param {JassLocation} whichLocation
//  * @return {boolean}
//  */
// export function IssuePointOrderByIdLoc(jass, whichUnit, order, whichLocation) {}

// /**
//  * native IssueTargetOrder takes unit whichUnit, string order, widget targetWidget returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {string} order
//  * @param {JassWidget} targetWidget
//  * @return {boolean}
//  */
// export function IssueTargetOrder(jass, whichUnit, order, targetWidget) {}

// /**
//  * native IssueTargetOrderById takes unit whichUnit, integer order, widget targetWidget returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} order
//  * @param {JassWidget} targetWidget
//  * @return {boolean}
//  */
// export function IssueTargetOrderById(jass, whichUnit, order, targetWidget) {}

// /**
//  * native IssueInstantPointOrder takes unit whichUnit, string order, real x, real y, widget instantTargetWidget returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {string} order
//  * @param {number} x
//  * @param {number} y
//  * @param {JassWidget} instantTargetWidget
//  * @return {boolean}
//  */
// export function IssueInstantPointOrder(jass, whichUnit, order, x, y, instantTargetWidget) {}

// /**
//  * native IssueInstantPointOrderById takes unit whichUnit, integer order, real x, real y, widget instantTargetWidget returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} order
//  * @param {number} x
//  * @param {number} y
//  * @param {JassWidget} instantTargetWidget
//  * @return {boolean}
//  */
// export function IssueInstantPointOrderById(jass, whichUnit, order, x, y, instantTargetWidget) {}

// /**
//  * native IssueInstantTargetOrder takes unit whichUnit, string order, widget targetWidget, widget instantTargetWidget returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {string} order
//  * @param {JassWidget} targetWidget
//  * @param {JassWidget} instantTargetWidget
//  * @return {boolean}
//  */
// export function IssueInstantTargetOrder(jass, whichUnit, order, targetWidget, instantTargetWidget) {}

// /**
//  * native IssueInstantTargetOrderById takes unit whichUnit, integer order, widget targetWidget, widget instantTargetWidget returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} order
//  * @param {JassWidget} targetWidget
//  * @param {JassWidget} instantTargetWidget
//  * @return {boolean}
//  */
// export function IssueInstantTargetOrderById(jass, whichUnit, order, targetWidget, instantTargetWidget) {}

// /**
//  * native IssueBuildOrder takes unit whichPeon, string unitToBuild, real x, real y returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichPeon
//  * @param {string} unitToBuild
//  * @param {number} x
//  * @param {number} y
//  * @return {boolean}
//  */
// export function IssueBuildOrder(jass, whichPeon, unitToBuild, x, y) {}

// /**
//  * native IssueBuildOrderById takes unit whichPeon, integer unitId, real x, real y returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichPeon
//  * @param {number} unitId
//  * @param {number} x
//  * @param {number} y
//  * @return {boolean}
//  */
// export function IssueBuildOrderById(jass, whichPeon, unitId, x, y) {}

// /**
//  * native IssueNeutralImmediateOrder takes player forWhichPlayer, unit neutralStructure, string unitToBuild returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} forWhichPlayer
//  * @param {JassUnit} neutralStructure
//  * @param {string} unitToBuild
//  * @return {boolean}
//  */
// export function IssueNeutralImmediateOrder(jass, forWhichPlayer, neutralStructure, unitToBuild) {}

// /**
//  * native IssueNeutralImmediateOrderById takes player forWhichPlayer, unit neutralStructure, integer unitId returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} forWhichPlayer
//  * @param {JassUnit} neutralStructure
//  * @param {number} unitId
//  * @return {boolean}
//  */
// export function IssueNeutralImmediateOrderById(jass, forWhichPlayer, neutralStructure, unitId) {}

// /**
//  * native IssueNeutralPointOrder takes player forWhichPlayer, unit neutralStructure, string unitToBuild, real x, real y returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} forWhichPlayer
//  * @param {JassUnit} neutralStructure
//  * @param {string} unitToBuild
//  * @param {number} x
//  * @param {number} y
//  * @return {boolean}
//  */
// export function IssueNeutralPointOrder(jass, forWhichPlayer, neutralStructure, unitToBuild, x, y) {}

// /**
//  * native IssueNeutralPointOrderById takes player forWhichPlayer, unit neutralStructure, integer unitId, real x, real y returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} forWhichPlayer
//  * @param {JassUnit} neutralStructure
//  * @param {number} unitId
//  * @param {number} x
//  * @param {number} y
//  * @return {boolean}
//  */
// export function IssueNeutralPointOrderById(jass, forWhichPlayer, neutralStructure, unitId, x, y) {}

// /**
//  * native IssueNeutralTargetOrder takes player forWhichPlayer, unit neutralStructure, string unitToBuild, widget target returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} forWhichPlayer
//  * @param {JassUnit} neutralStructure
//  * @param {string} unitToBuild
//  * @param {JassWidget} target
//  * @return {boolean}
//  */
// export function IssueNeutralTargetOrder(jass, forWhichPlayer, neutralStructure, unitToBuild, target) {}

// /**
//  * native IssueNeutralTargetOrderById takes player forWhichPlayer, unit neutralStructure, integer unitId, widget target returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} forWhichPlayer
//  * @param {JassUnit} neutralStructure
//  * @param {number} unitId
//  * @param {JassWidget} target
//  * @return {boolean}
//  */
// export function IssueNeutralTargetOrderById(jass, forWhichPlayer, neutralStructure, unitId, target) {}

// /**
//  * native GetUnitCurrentOrder takes unit whichUnit returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {number}
//  */
// export function GetUnitCurrentOrder(jass, whichUnit) {}

// /**
//  * native SetResourceAmount takes unit whichUnit, integer amount returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} amount
//  */
// export function SetResourceAmount(jass, whichUnit, amount) {}

// /**
//  * native AddResourceAmount takes unit whichUnit, integer amount returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} amount
//  */
// export function AddResourceAmount(jass, whichUnit, amount) {}

// /**
//  * native GetResourceAmount takes unit whichUnit returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {number}
//  */
// export function GetResourceAmount(jass, whichUnit) {}

// /**
//  * native WaygateGetDestinationX takes unit waygate returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} waygate
//  * @return {number}
//  */
// export function WaygateGetDestinationX(jass, waygate) {}

// /**
//  * native WaygateGetDestinationY takes unit waygate returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} waygate
//  * @return {number}
//  */
// export function WaygateGetDestinationY(jass, waygate) {}

// /**
//  * native WaygateSetDestination takes unit waygate, real x, real y returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} waygate
//  * @param {number} x
//  * @param {number} y
//  */
// export function WaygateSetDestination(jass, waygate, x, y) {}

// /**
//  * native WaygateActivate takes unit waygate, boolean activate returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} waygate
//  * @param {boolean} activate
//  */
// export function WaygateActivate(jass, waygate, activate) {}

// /**
//  * native WaygateIsActive takes unit waygate returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} waygate
//  * @return {boolean}
//  */
// export function WaygateIsActive(jass, waygate) {}

// /**
//  * native AddItemToAllStock takes integer itemId, integer currentStock, integer stockMax returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} itemId
//  * @param {number} currentStock
//  * @param {number} stockMax
//  */
// export function AddItemToAllStock(jass, itemId, currentStock, stockMax) {}

// /**
//  * native AddItemToStock takes unit whichUnit, integer itemId, integer currentStock, integer stockMax returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} itemId
//  * @param {number} currentStock
//  * @param {number} stockMax
//  */
// export function AddItemToStock(jass, whichUnit, itemId, currentStock, stockMax) {}

// /**
//  * native AddUnitToAllStock takes integer unitId, integer currentStock, integer stockMax returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} unitId
//  * @param {number} currentStock
//  * @param {number} stockMax
//  */
// export function AddUnitToAllStock(jass, unitId, currentStock, stockMax) {}

// /**
//  * native AddUnitToStock takes unit whichUnit, integer unitId, integer currentStock, integer stockMax returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} unitId
//  * @param {number} currentStock
//  * @param {number} stockMax
//  */
// export function AddUnitToStock(jass, whichUnit, unitId, currentStock, stockMax) {}

// /**
//  * native RemoveItemFromAllStock takes integer itemId returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} itemId
//  */
// export function RemoveItemFromAllStock(jass, itemId) {}

// /**
//  * native RemoveItemFromStock takes unit whichUnit, integer itemId returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} itemId
//  */
// export function RemoveItemFromStock(jass, whichUnit, itemId) {}

// /**
//  * native RemoveUnitFromAllStock takes integer unitId returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} unitId
//  */
// export function RemoveUnitFromAllStock(jass, unitId) {}

// /**
//  * native RemoveUnitFromStock takes unit whichUnit, integer unitId returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} unitId
//  */
// export function RemoveUnitFromStock(jass, whichUnit, unitId) {}

// /**
//  * native SetAllItemTypeSlots takes integer slots returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} slots
//  */
// export function SetAllItemTypeSlots(jass, slots) {}

// /**
//  * native SetAllUnitTypeSlots takes integer slots returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} slots
//  */
// export function SetAllUnitTypeSlots(jass, slots) {}

// /**
//  * native SetItemTypeSlots takes unit whichUnit, integer slots returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} slots
//  */
// export function SetItemTypeSlots(jass, whichUnit, slots) {}

// /**
//  * native SetUnitTypeSlots takes unit whichUnit, integer slots returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} slots
//  */
// export function SetUnitTypeSlots(jass, whichUnit, slots) {}

// /**
//  * native GetUnitUserData takes unit whichUnit returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @return {number}
//  */
// export function GetUnitUserData(jass, whichUnit) {}

// /**
//  * native SetUnitUserData takes unit whichUnit, integer data returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} data
//  */
// export function SetUnitUserData(jass, whichUnit, data) {}

/**
 * constant native Player takes integer number returns player
 *
 * @param {JassContext} jass
 * @param {number} number
 * @return {JassPlayer}
 */
export function Player(jass, number) {
  return jass.players[number];
}

// /**
//  * constant native GetLocalPlayer takes nothing returns player
//  *
//  * @param {JassContext} jass
//  * @return {JassPlayer}
//  */
// export function GetLocalPlayer(jass) {}

// /**
//  * constant native IsPlayerAlly takes player whichPlayer, player otherPlayer returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {JassPlayer} otherPlayer
//  * @return {boolean}
//  */
// export function IsPlayerAlly(jass, whichPlayer, otherPlayer) {}

// /**
//  * constant native IsPlayerEnemy takes player whichPlayer, player otherPlayer returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {JassPlayer} otherPlayer
//  * @return {boolean}
//  */
// export function IsPlayerEnemy(jass, whichPlayer, otherPlayer) {}

// /**
//  * constant native IsPlayerInForce takes player whichPlayer, force whichForce returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {JassForce} whichForce
//  * @return {boolean}
//  */
// export function IsPlayerInForce(jass, whichPlayer, whichForce) {}

// /**
//  * constant native IsPlayerObserver takes player whichPlayer returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @return {boolean}
//  */
// export function IsPlayerObserver(jass, whichPlayer) {}

// /**
//  * constant native IsVisibleToPlayer takes real x, real y, player whichPlayer returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  * @param {JassPlayer} whichPlayer
//  * @return {boolean}
//  */
// export function IsVisibleToPlayer(jass, x, y, whichPlayer) {}

// /**
//  * constant native IsLocationVisibleToPlayer takes location whichLocation, player whichPlayer returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassLocation} whichLocation
//  * @param {JassPlayer} whichPlayer
//  * @return {boolean}
//  */
// export function IsLocationVisibleToPlayer(jass, whichLocation, whichPlayer) {}

// /**
//  * constant native IsFoggedToPlayer takes real x, real y, player whichPlayer returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  * @param {JassPlayer} whichPlayer
//  * @return {boolean}
//  */
// export function IsFoggedToPlayer(jass, x, y, whichPlayer) {}

// /**
//  * constant native IsLocationFoggedToPlayer takes location whichLocation, player whichPlayer returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassLocation} whichLocation
//  * @param {JassPlayer} whichPlayer
//  * @return {boolean}
//  */
// export function IsLocationFoggedToPlayer(jass, whichLocation, whichPlayer) {}

// /**
//  * constant native IsMaskedToPlayer takes real x, real y, player whichPlayer returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  * @param {JassPlayer} whichPlayer
//  * @return {boolean}
//  */
// export function IsMaskedToPlayer(jass, x, y, whichPlayer) {}

// /**
//  * constant native IsLocationMaskedToPlayer takes location whichLocation, player whichPlayer returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassLocation} whichLocation
//  * @param {JassPlayer} whichPlayer
//  * @return {boolean}
//  */
// export function IsLocationMaskedToPlayer(jass, whichLocation, whichPlayer) {}

// /**
//  * constant native GetPlayerRace takes player whichPlayer returns race
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @return {JassRace}
//  */
// export function GetPlayerRace(jass, whichPlayer) {}

/**
 * constant native GetPlayerId takes player whichPlayer returns integer
 *
 * @param {JassContext} jass
 * @param {JassPlayer} whichPlayer
 * @return {number}
 */
export function GetPlayerId(jass, whichPlayer) {
  return whichPlayer.index;
}

// /**
//  * constant native GetPlayerUnitCount takes player whichPlayer, boolean includeIncomplete returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {boolean} includeIncomplete
//  * @return {number}
//  */
// export function GetPlayerUnitCount(jass, whichPlayer, includeIncomplete) {}

// /**
//  * constant native GetPlayerTypedUnitCount takes player whichPlayer, string unitName, boolean includeIncomplete, boolean includeUpgrades returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {string} unitName
//  * @param {boolean} includeIncomplete
//  * @param {boolean} includeUpgrades
//  * @return {number}
//  */
// export function GetPlayerTypedUnitCount(jass, whichPlayer, unitName, includeIncomplete, includeUpgrades) {}

// /**
//  * constant native GetPlayerStructureCount takes player whichPlayer, boolean includeIncomplete returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {boolean} includeIncomplete
//  * @return {number}
//  */
// export function GetPlayerStructureCount(jass, whichPlayer, includeIncomplete) {}

// /**
//  * constant native GetPlayerState takes player whichPlayer, playerstate whichPlayerState returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {JassPlayerState} whichPlayerState
//  * @return {number}
//  */
// export function GetPlayerState(jass, whichPlayer, whichPlayerState) {}

// /**
//  * constant native GetPlayerScore takes player whichPlayer, playerscore whichPlayerScore returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {JassPlayerScore} whichPlayerScore
//  * @return {number}
//  */
// export function GetPlayerScore(jass, whichPlayer, whichPlayerScore) {}

// /**
//  * constant native GetPlayerAlliance takes player sourcePlayer, player otherPlayer, alliancetype whichAllianceSetting returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} sourcePlayer
//  * @param {JassPlayer} otherPlayer
//  * @param {JassAllianceType} whichAllianceSetting
//  * @return {boolean}
//  */
// export function GetPlayerAlliance(jass, sourcePlayer, otherPlayer, whichAllianceSetting) {}

// /**
//  * constant native GetPlayerHandicap takes player whichPlayer returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @return {number}
//  */
// export function GetPlayerHandicap(jass, whichPlayer) {}

// /**
//  * constant native GetPlayerHandicapXP takes player whichPlayer returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @return {number}
//  */
// export function GetPlayerHandicapXP(jass, whichPlayer) {}

// /**
//  * constant native SetPlayerHandicap takes player whichPlayer, real handicap returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {number} handicap
//  */
// export function SetPlayerHandicap(jass, whichPlayer, handicap) {}

// /**
//  * constant native SetPlayerHandicapXP takes player whichPlayer, real handicap returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {number} handicap
//  */
// export function SetPlayerHandicapXP(jass, whichPlayer, handicap) {}

// /**
//  * constant native SetPlayerTechMaxAllowed takes player whichPlayer, integer techid, integer maximum returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {number} techid
//  * @param {number} maximum
//  */
// export function SetPlayerTechMaxAllowed(jass, whichPlayer, techid, maximum) {}

// /**
//  * constant native GetPlayerTechMaxAllowed takes player whichPlayer, integer techid returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {number} techid
//  * @return {number}
//  */
// export function GetPlayerTechMaxAllowed(jass, whichPlayer, techid) {}

// /**
//  * constant native AddPlayerTechResearched takes player whichPlayer, integer techid, integer levels returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {number} techid
//  * @param {number} levels
//  */
// export function AddPlayerTechResearched(jass, whichPlayer, techid, levels) {}

// /**
//  * constant native SetPlayerTechResearched takes player whichPlayer, integer techid, integer setToLevel returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {number} techid
//  * @param {number} setToLevel
//  */
// export function SetPlayerTechResearched(jass, whichPlayer, techid, setToLevel) {}

// /**
//  * constant native GetPlayerTechResearched takes player whichPlayer, integer techid, boolean specificonly returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {number} techid
//  * @param {boolean} specificonly
//  * @return {boolean}
//  */
// export function GetPlayerTechResearched(jass, whichPlayer, techid, specificonly) {}

// /**
//  * constant native GetPlayerTechCount takes player whichPlayer, integer techid, boolean specificonly returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {number} techid
//  * @param {boolean} specificonly
//  * @return {number}
//  */
// export function GetPlayerTechCount(jass, whichPlayer, techid, specificonly) {}

// /**
//  * native SetPlayerUnitsOwner takes player whichPlayer, integer newOwner returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {number} newOwner
//  */
// export function SetPlayerUnitsOwner(jass, whichPlayer, newOwner) {}

// /**
//  * native CripplePlayer takes player whichPlayer, force toWhichPlayers, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {JassForce} toWhichPlayers
//  * @param {boolean} flag
//  */
// export function CripplePlayer(jass, whichPlayer, toWhichPlayers, flag) {}

// /**
//  * native SetPlayerAbilityAvailable takes player whichPlayer, integer abilid, boolean avail returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {number} abilid
//  * @param {boolean} avail
//  */
// export function SetPlayerAbilityAvailable(jass, whichPlayer, abilid, avail) {}

// /**
//  * native SetPlayerState takes player whichPlayer, playerstate whichPlayerState, integer value returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {JassPlayerState} whichPlayerState
//  * @param {number} value
//  */
// export function SetPlayerState(jass, whichPlayer, whichPlayerState, value) {}

// /**
//  * native RemovePlayer takes player whichPlayer, playergameresult gameResult returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {JassPlayerGameResult} gameResult
//  */
// export function RemovePlayer(jass, whichPlayer, gameResult) {}

// /**
//  * native CachePlayerHeroData takes player whichPlayer returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  */
// export function CachePlayerHeroData(jass, whichPlayer) {}

// /**
//  * native SetFogStateRect takes player forWhichPlayer, fogstate whichState, rect where, boolean useSharedVision returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} forWhichPlayer
//  * @param {JassFogState} whichState
//  * @param {JassRect} where
//  * @param {boolean} useSharedVision
//  */
// export function SetFogStateRect(jass, forWhichPlayer, whichState, where, useSharedVision) {}

// /**
//  * native SetFogStateRadius takes player forWhichPlayer, fogstate whichState, real centerx, real centerY, real radius, boolean useSharedVision returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} forWhichPlayer
//  * @param {JassFogState} whichState
//  * @param {number} centerx
//  * @param {number} centerY
//  * @param {number} radius
//  * @param {boolean} useSharedVision
//  */
// export function SetFogStateRadius(jass, forWhichPlayer, whichState, centerx, centerY, radius, useSharedVision) {}

// /**
//  * native SetFogStateRadiusLoc takes player forWhichPlayer, fogstate whichState, location center, real radius, boolean useSharedVision returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} forWhichPlayer
//  * @param {JassFogState} whichState
//  * @param {JassLocation} center
//  * @param {number} radius
//  * @param {boolean} useSharedVision
//  */
// export function SetFogStateRadiusLoc(jass, forWhichPlayer, whichState, center, radius, useSharedVision) {}

// /**
//  * native FogMaskEnable takes boolean enable returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {boolean} enable
//  */
// export function FogMaskEnable(jass, enable) {}

// /**
//  * native IsFogMaskEnabled takes nothing returns boolean
//  *
//  * @param {JassContext} jass
//  * @return {boolean}
//  */
// export function IsFogMaskEnabled(jass) {}

// /**
//  * native FogEnable takes boolean enable returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {boolean} enable
//  */
// export function FogEnable(jass, enable) {}

// /**
//  * native IsFogEnabled takes nothing returns boolean
//  *
//  * @param {JassContext} jass
//  * @return {boolean}
//  */
// export function IsFogEnabled(jass) {}

// /**
//  * native CreateFogModifierRect takes player forWhichPlayer, fogstate whichState, rect where, boolean useSharedVision, boolean afterUnits returns fogmodifier
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} forWhichPlayer
//  * @param {JassFogState} whichState
//  * @param {JassRect} where
//  * @param {boolean} useSharedVision
//  * @param {boolean} afterUnits
//  * @return {JassFogModifier}
//  */
// export function CreateFogModifierRect(jass, forWhichPlayer, whichState, where, useSharedVision, afterUnits) {}

// /**
//  * native CreateFogModifierRadius takes player forWhichPlayer, fogstate whichState, real centerx, real centerY, real radius, boolean useSharedVision, boolean afterUnits returns fogmodifier
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} forWhichPlayer
//  * @param {JassFogState} whichState
//  * @param {number} centerx
//  * @param {number} centerY
//  * @param {number} radius
//  * @param {boolean} useSharedVision
//  * @param {boolean} afterUnits
//  * @return {JassFogModifier}
//  */
// export function CreateFogModifierRadius(jass, forWhichPlayer, whichState, centerx, centerY, radius, useSharedVision, afterUnits) {}

// /**
//  * native CreateFogModifierRadiusLoc takes player forWhichPlayer, fogstate whichState, location center, real radius, boolean useSharedVision, boolean afterUnits returns fogmodifier
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} forWhichPlayer
//  * @param {JassFogState} whichState
//  * @param {JassLocation} center
//  * @param {number} radius
//  * @param {boolean} useSharedVision
//  * @param {boolean} afterUnits
//  * @return {JassFogModifier}
//  */
// export function CreateFogModifierRadiusLoc(jass, forWhichPlayer, whichState, center, radius, useSharedVision, afterUnits) {}

// /**
//  * native DestroyFogModifier takes fogmodifier whichFogModifier returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassFogModifier} whichFogModifier
//  */
// export function DestroyFogModifier(jass, whichFogModifier) {}

// /**
//  * native FogModifierStart takes fogmodifier whichFogModifier returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassFogModifier} whichFogModifier
//  */
// export function FogModifierStart(jass, whichFogModifier) {}

// /**
//  * native FogModifierStop takes fogmodifier whichFogModifier returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassFogModifier} whichFogModifier
//  */
// export function FogModifierStop(jass, whichFogModifier) {}

// /**
//  * native VersionGet takes nothing returns version
//  *
//  * @param {JassContext} jass
//  * @return {JassVersion}
//  */
// export function VersionGet(jass) {}

// /**
//  * native VersionCompatible takes version whichVersion returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassVersion} whichVersion
//  * @return {boolean}
//  */
// export function VersionCompatible(jass, whichVersion) {}

// /**
//  * native VersionSupported takes version whichVersion returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassVersion} whichVersion
//  * @return {boolean}
//  */
// export function VersionSupported(jass, whichVersion) {}

// /**
//  * native EndGame takes boolean doScoreScreen returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {boolean} doScoreScreen
//  */
// export function EndGame(jass, doScoreScreen) {}

// /**
//  * native ChangeLevel takes string newLevel, boolean doScoreScreen returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {string} newLevel
//  * @param {boolean} doScoreScreen
//  */
// export function ChangeLevel(jass, newLevel, doScoreScreen) {}

// /**
//  * native RestartGame takes boolean doScoreScreen returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {boolean} doScoreScreen
//  */
// export function RestartGame(jass, doScoreScreen) {}

// /**
//  * native ReloadGame takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function ReloadGame(jass) {}

// /**
//  * native SetCampaignMenuRace takes race r returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassRace} r
//  */
// export function SetCampaignMenuRace(jass, r) {}

// /**
//  * native SetCampaignMenuRaceEx takes integer campaignIndex returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} campaignIndex
//  */
// export function SetCampaignMenuRaceEx(jass, campaignIndex) {}

// /**
//  * native ForceCampaignSelectScreen takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function ForceCampaignSelectScreen(jass) {}

// /**
//  * native LoadGame takes string saveFileName, boolean doScoreScreen returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {string} saveFileName
//  * @param {boolean} doScoreScreen
//  */
// export function LoadGame(jass, saveFileName, doScoreScreen) {}

// /**
//  * native SaveGame takes string saveFileName returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {string} saveFileName
//  */
// export function SaveGame(jass, saveFileName) {}

// /**
//  * native RenameSaveDirectory takes string sourceDirName, string destDirName returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {string} sourceDirName
//  * @param {string} destDirName
//  * @return {boolean}
//  */
// export function RenameSaveDirectory(jass, sourceDirName, destDirName) {}

// /**
//  * native RemoveSaveDirectory takes string sourceDirName returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {string} sourceDirName
//  * @return {boolean}
//  */
// export function RemoveSaveDirectory(jass, sourceDirName) {}

// /**
//  * native CopySaveGame takes string sourceSaveName, string destSaveName returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {string} sourceSaveName
//  * @param {string} destSaveName
//  * @return {boolean}
//  */
// export function CopySaveGame(jass, sourceSaveName, destSaveName) {}

// /**
//  * native SaveGameExists takes string saveName returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {string} saveName
//  * @return {boolean}
//  */
// export function SaveGameExists(jass, saveName) {}

// /**
//  * native SyncSelections takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function SyncSelections(jass) {}

// /**
//  * native SetFloatGameState takes fgamestate whichFloatGameState, real value returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassFGameState} whichFloatGameState
//  * @param {number} value
//  */
// export function SetFloatGameState(jass, whichFloatGameState, value) {}

// /**
//  * constant native GetFloatGameState takes fgamestate whichFloatGameState returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassFGameState} whichFloatGameState
//  * @return {number}
//  */
// export function GetFloatGameState(jass, whichFloatGameState) {}

// /**
//  * native SetIntegerGameState takes igamestate whichIntegerGameState, integer value returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassIGameState} whichIntegerGameState
//  * @param {number} value
//  */
// export function SetIntegerGameState(jass, whichIntegerGameState, value) {}

// /**
//  * constant native GetIntegerGameState takes igamestate whichIntegerGameState returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassIGameState} whichIntegerGameState
//  * @return {number}
//  */
// export function GetIntegerGameState(jass, whichIntegerGameState) {}

// /**
//  * native SetTutorialCleared takes boolean cleared returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {boolean} cleared
//  */
// export function SetTutorialCleared(jass, cleared) {}

// /**
//  * native SetMissionAvailable takes integer campaignNumber, integer missionNumber, boolean available returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} campaignNumber
//  * @param {number} missionNumber
//  * @param {boolean} available
//  */
// export function SetMissionAvailable(jass, campaignNumber, missionNumber, available) {}

// /**
//  * native SetCampaignAvailable takes integer campaignNumber, boolean available returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} campaignNumber
//  * @param {boolean} available
//  */
// export function SetCampaignAvailable(jass, campaignNumber, available) {}

// /**
//  * native SetOpCinematicAvailable takes integer campaignNumber, boolean available returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} campaignNumber
//  * @param {boolean} available
//  */
// export function SetOpCinematicAvailable(jass, campaignNumber, available) {}

// /**
//  * native SetEdCinematicAvailable takes integer campaignNumber, boolean available returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} campaignNumber
//  * @param {boolean} available
//  */
// export function SetEdCinematicAvailable(jass, campaignNumber, available) {}

// /**
//  * native GetDefaultDifficulty takes nothing returns gamedifficulty
//  *
//  * @param {JassContext} jass
//  * @return {JassGameDifficulty}
//  */
// export function GetDefaultDifficulty(jass) {}

// /**
//  * native SetDefaultDifficulty takes gamedifficulty g returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGameDifficulty} g
//  */
// export function SetDefaultDifficulty(jass, g) {}

// /**
//  * native SetCustomCampaignButtonVisible takes integer whichButton, boolean visible returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} whichButton
//  * @param {boolean} visible
//  */
// export function SetCustomCampaignButtonVisible(jass, whichButton, visible) {}

// /**
//  * native GetCustomCampaignButtonVisible takes integer whichButton returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {number} whichButton
//  * @return {boolean}
//  */
// export function GetCustomCampaignButtonVisible(jass, whichButton) {}

// /**
//  * native DoNotSaveReplay takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function DoNotSaveReplay(jass) {}

// /**
//  * native DialogCreate takes nothing returns dialog
//  *
//  * @param {JassContext} jass
//  * @return {JassDialog}
//  */
// export function DialogCreate(jass) {}

// /**
//  * native DialogDestroy takes dialog whichDialog returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassDialog} whichDialog
//  */
// export function DialogDestroy(jass, whichDialog) {}

// /**
//  * native DialogClear takes dialog whichDialog returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassDialog} whichDialog
//  */
// export function DialogClear(jass, whichDialog) {}

// /**
//  * native DialogSetMessage takes dialog whichDialog, string messageText returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassDialog} whichDialog
//  * @param {string} messageText
//  */
// export function DialogSetMessage(jass, whichDialog, messageText) {}

// /**
//  * native DialogAddButton takes dialog whichDialog, string buttonText, integer hotkey returns button
//  *
//  * @param {JassContext} jass
//  * @param {JassDialog} whichDialog
//  * @param {string} buttonText
//  * @param {number} hotkey
//  * @return {JassButton}
//  */
// export function DialogAddButton(jass, whichDialog, buttonText, hotkey) {}

// /**
//  * native DialogAddQuitButton takes dialog whichDialog, boolean doScoreScreen, string buttonText, integer hotkey returns button
//  *
//  * @param {JassContext} jass
//  * @param {JassDialog} whichDialog
//  * @param {boolean} doScoreScreen
//  * @param {string} buttonText
//  * @param {number} hotkey
//  * @return {JassButton}
//  */
// export function DialogAddQuitButton(jass, whichDialog, doScoreScreen, buttonText, hotkey) {}

// /**
//  * native DialogDisplay takes player whichPlayer, dialog whichDialog, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {JassDialog} whichDialog
//  * @param {boolean} flag
//  */
// export function DialogDisplay(jass, whichPlayer, whichDialog, flag) {}

// /**
//  * native ReloadGameCachesFromDisk takes nothing returns boolean
//  *
//  * @param {JassContext} jass
//  * @return {boolean}
//  */
// export function ReloadGameCachesFromDisk(jass) {}

// /**
//  * native InitGameCache takes string campaignFile returns gamecache
//  *
//  * @param {JassContext} jass
//  * @param {string} campaignFile
//  * @return {JassGameCache}
//  */
// export function InitGameCache(jass, campaignFile) {}

// /**
//  * native SaveGameCache takes gamecache whichCache returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} whichCache
//  * @return {boolean}
//  */
// export function SaveGameCache(jass, whichCache) {}

// /**
//  * native StoreInteger takes gamecache cache, string missionKey, string key, integer value returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  * @param {number} value
//  */
// export function StoreInteger(jass, cache, missionKey, key, value) {}

// /**
//  * native StoreReal takes gamecache cache, string missionKey, string key, real value returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  * @param {number} value
//  */
// export function StoreReal(jass, cache, missionKey, key, value) {}

// /**
//  * native StoreBoolean takes gamecache cache, string missionKey, string key, boolean value returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  * @param {boolean} value
//  */
// export function StoreBoolean(jass, cache, missionKey, key, value) {}

// /**
//  * native StoreUnit takes gamecache cache, string missionKey, string key, unit whichUnit returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  * @param {JassUnit} whichUnit
//  * @return {boolean}
//  */
// export function StoreUnit(jass, cache, missionKey, key, whichUnit) {}

// /**
//  * native StoreString takes gamecache cache, string missionKey, string key, string value returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  * @param {string} value
//  * @return {boolean}
//  */
// export function StoreString(jass, cache, missionKey, key, value) {}

// /**
//  * native SyncStoredInteger takes gamecache cache, string missionKey, string key returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  */
// export function SyncStoredInteger(jass, cache, missionKey, key) {}

// /**
//  * native SyncStoredReal takes gamecache cache, string missionKey, string key returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  */
// export function SyncStoredReal(jass, cache, missionKey, key) {}

// /**
//  * native SyncStoredBoolean takes gamecache cache, string missionKey, string key returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  */
// export function SyncStoredBoolean(jass, cache, missionKey, key) {}

// /**
//  * native SyncStoredUnit takes gamecache cache, string missionKey, string key returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  */
// export function SyncStoredUnit(jass, cache, missionKey, key) {}

// /**
//  * native SyncStoredString takes gamecache cache, string missionKey, string key returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  */
// export function SyncStoredString(jass, cache, missionKey, key) {}

// /**
//  * native HaveStoredInteger takes gamecache cache, string missionKey, string key returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  * @return {boolean}
//  */
// export function HaveStoredInteger(jass, cache, missionKey, key) {}

// /**
//  * native HaveStoredReal takes gamecache cache, string missionKey, string key returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  * @return {boolean}
//  */
// export function HaveStoredReal(jass, cache, missionKey, key) {}

// /**
//  * native HaveStoredBoolean takes gamecache cache, string missionKey, string key returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  * @return {boolean}
//  */
// export function HaveStoredBoolean(jass, cache, missionKey, key) {}

// /**
//  * native HaveStoredUnit takes gamecache cache, string missionKey, string key returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  * @return {boolean}
//  */
// export function HaveStoredUnit(jass, cache, missionKey, key) {}

// /**
//  * native HaveStoredString takes gamecache cache, string missionKey, string key returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  * @return {boolean}
//  */
// export function HaveStoredString(jass, cache, missionKey, key) {}

// /**
//  * native FlushGameCache takes gamecache cache returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  */
// export function FlushGameCache(jass, cache) {}

// /**
//  * native FlushStoredMission takes gamecache cache, string missionKey returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  */
// export function FlushStoredMission(jass, cache, missionKey) {}

// /**
//  * native FlushStoredInteger takes gamecache cache, string missionKey, string key returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  */
// export function FlushStoredInteger(jass, cache, missionKey, key) {}

// /**
//  * native FlushStoredReal takes gamecache cache, string missionKey, string key returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  */
// export function FlushStoredReal(jass, cache, missionKey, key) {}

// /**
//  * native FlushStoredBoolean takes gamecache cache, string missionKey, string key returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  */
// export function FlushStoredBoolean(jass, cache, missionKey, key) {}

// /**
//  * native FlushStoredUnit takes gamecache cache, string missionKey, string key returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  */
// export function FlushStoredUnit(jass, cache, missionKey, key) {}

// /**
//  * native FlushStoredString takes gamecache cache, string missionKey, string key returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  */
// export function FlushStoredString(jass, cache, missionKey, key) {}

// /**
//  * native GetStoredInteger takes gamecache cache, string missionKey, string key returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  * @return {number}
//  */
// export function GetStoredInteger(jass, cache, missionKey, key) {}

// /**
//  * native GetStoredReal takes gamecache cache, string missionKey, string key returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  * @return {number}
//  */
// export function GetStoredReal(jass, cache, missionKey, key) {}

// /**
//  * native GetStoredBoolean takes gamecache cache, string missionKey, string key returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  * @return {boolean}
//  */
// export function GetStoredBoolean(jass, cache, missionKey, key) {}

// /**
//  * native GetStoredString takes gamecache cache, string missionKey, string key returns string
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  * @return {string}
//  */
// export function GetStoredString(jass, cache, missionKey, key) {}

// /**
//  * native RestoreUnit takes gamecache cache, string missionKey, string key, player forWhichPlayer, real x, real y, real facing returns unit
//  *
//  * @param {JassContext} jass
//  * @param {JassGameCache} cache
//  * @param {string} missionKey
//  * @param {string} key
//  * @param {JassPlayer} forWhichPlayer
//  * @param {number} x
//  * @param {number} y
//  * @param {number} facing
//  * @return {JassUnit}
//  */
// export function RestoreUnit(jass, cache, missionKey, key, forWhichPlayer, x, y, facing) {}

/**
 * native InitHashtable takes nothing returns hashtable
 *
 * @param {JassContext} jass
 * @return {JassHashTable}
 */
export function InitHashtable(jass) {
  return jass.addHandle(new JassHashTable(jass));
}

/**
 * native SaveInteger takes hashtable table, integer parentKey, integer childKey, integer value returns nothing
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {number} value
 */
export function SaveInteger(jass, table, parentKey, childKey, value) {
  table.save(parentKey, childKey, value);
}

/**
 * native SaveReal takes hashtable table, integer parentKey, integer childKey, real value returns nothing
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {number} value
 */
export function SaveReal(jass, table, parentKey, childKey, value) {
  table.save(parentKey, childKey, value);
}

/**
 * native SaveBoolean takes hashtable table, integer parentKey, integer childKey, boolean value returns nothing
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {boolean} value
 */
export function SaveBoolean(jass, table, parentKey, childKey, value) {
  table.save(parentKey, childKey, value);
}

/**
 * native SaveStr takes hashtable table, integer parentKey, integer childKey, string value returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {string} value
 * @return {boolean}
 */
export function SaveStr(jass, table, parentKey, childKey, value) {
  return table.save(parentKey, childKey, value);
}

/**
 * native SavePlayerHandle takes hashtable table, integer parentKey, integer childKey, player whichPlayer returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassPlayer} whichPlayer
 * @return {boolean}
 */
export function SavePlayerHandle(jass, table, parentKey, childKey, whichPlayer) {
  return table.save(parentKey, childKey, whichPlayer);
}

/**
 * native SaveWidgetHandle takes hashtable table, integer parentKey, integer childKey, widget whichWidget returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassWidget} whichWidget
 * @return {boolean}
 */
export function SaveWidgetHandle(jass, table, parentKey, childKey, whichWidget) {
  return table.save(parentKey, childKey, whichWidget);
}

/**
 * native SaveDestructableHandle takes hashtable table, integer parentKey, integer childKey, destructable whichDestructable returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassDestructable} whichDestructable
 * @return {boolean}
 */
export function SaveDestructableHandle(jass, table, parentKey, childKey, whichDestructable) {
  return table.save(parentKey, childKey, whichDestructable);
}

/**
 * native SaveItemHandle takes hashtable table, integer parentKey, integer childKey, item whichItem returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassItem} whichItem
 * @return {boolean}
 */
export function SaveItemHandle(jass, table, parentKey, childKey, whichItem) {
  return table.save(parentKey, childKey, whichItem);
}

/**
 * native SaveUnitHandle takes hashtable table, integer parentKey, integer childKey, unit whichUnit returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassUnit} whichUnit
 * @return {boolean}
 */
export function SaveUnitHandle(jass, table, parentKey, childKey, whichUnit) {
  return table.save(parentKey, childKey, whichUnit);
}

/**
 * native SaveAbilityHandle takes hashtable table, integer parentKey, integer childKey, ability whichAbility returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassAbility} whichAbility
 * @return {boolean}
 */
export function SaveAbilityHandle(jass, table, parentKey, childKey, whichAbility) {
  return table.save(parentKey, childKey, whichAbility);
}

/**
 * native SaveTimerHandle takes hashtable table, integer parentKey, integer childKey, timer whichTimer returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassTimer} whichTimer
 * @return {boolean}
 */
export function SaveTimerHandle(jass, table, parentKey, childKey, whichTimer) {
  return table.save(parentKey, childKey, whichTimer);
}

/**
 * native SaveTriggerHandle takes hashtable table, integer parentKey, integer childKey, trigger whichTrigger returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassTrigger} whichTrigger
 * @return {boolean}
 */
export function SaveTriggerHandle(jass, table, parentKey, childKey, whichTrigger) {
  return table.save(parentKey, childKey, whichTrigger);
}

/**
 * native SaveTriggerConditionHandle takes hashtable table, integer parentKey, integer childKey, triggercondition whichTriggercondition returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {function(): boolean} whichTriggercondition
 * @return {boolean}
 */
export function SaveTriggerConditionHandle(jass, table, parentKey, childKey, whichTriggercondition) {
  return table.save(parentKey, childKey, whichTriggercondition);
}

/**
 * native SaveTriggerActionHandle takes hashtable table, integer parentKey, integer childKey, triggeraction whichTriggeraction returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {function()} whichTriggeraction
 * @return {boolean}
 */
export function SaveTriggerActionHandle(jass, table, parentKey, childKey, whichTriggeraction) {
  return table.save(parentKey, childKey, whichTriggeraction);
}

/**
 * native SaveTriggerEventHandle takes hashtable table, integer parentKey, integer childKey, event whichEvent returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassEvent} whichEvent
 * @return {boolean}
 */
export function SaveTriggerEventHandle(jass, table, parentKey, childKey, whichEvent) {
  return table.save(parentKey, childKey, whichEvent);
}

/**
 * native SaveForceHandle takes hashtable table, integer parentKey, integer childKey, force whichForce returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassForce} whichForce
 * @return {boolean}
 */
export function SaveForceHandle(jass, table, parentKey, childKey, whichForce) {
  return table.save(parentKey, childKey, whichForce);
}

/**
 * native SaveGroupHandle takes hashtable table, integer parentKey, integer childKey, group whichGroup returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassGroup} whichGroup
 * @return {boolean}
 */
export function SaveGroupHandle(jass, table, parentKey, childKey, whichGroup) {
  return table.save(parentKey, childKey, whichGroup);
}

/**
 * native SaveLocationHandle takes hashtable table, integer parentKey, integer childKey, location whichLocation returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassLocation} whichLocation
 * @return {boolean}
 */
export function SaveLocationHandle(jass, table, parentKey, childKey, whichLocation) {
  return table.save(parentKey, childKey, whichLocation);
}

/**
 * native SaveRectHandle takes hashtable table, integer parentKey, integer childKey, rect whichRect returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassRect} whichRect
 * @return {boolean}
 */
export function SaveRectHandle(jass, table, parentKey, childKey, whichRect) {
  return table.save(parentKey, childKey, whichRect);
}

/**
 * native SaveBooleanExprHandle takes hashtable table, integer parentKey, integer childKey, boolexpr whichBoolexpr returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {function(): boolean} whichBoolexpr
 * @return {boolean}
 */
export function SaveBooleanExprHandle(jass, table, parentKey, childKey, whichBoolexpr) {
  return table.save(parentKey, childKey, whichBoolexpr);
}

/**
 * native SaveSoundHandle takes hashtable table, integer parentKey, integer childKey, sound whichSound returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassSound} whichSound
 * @return {boolean}
 */
export function SaveSoundHandle(jass, table, parentKey, childKey, whichSound) {
  return table.save(parentKey, childKey, whichSound);
}

/**
 * native SaveEffectHandle takes hashtable table, integer parentKey, integer childKey, effect whichEffect returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassEffect} whichEffect
 * @return {boolean}
 */
export function SaveEffectHandle(jass, table, parentKey, childKey, whichEffect) {
  return table.save(parentKey, childKey, whichEffect);
}

/**
 * native SaveUnitPoolHandle takes hashtable table, integer parentKey, integer childKey, unitpool whichUnitpool returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassUnitPool} whichUnitpool
 * @return {boolean}
 */
export function SaveUnitPoolHandle(jass, table, parentKey, childKey, whichUnitpool) {
  return table.save(parentKey, childKey, whichUnitpool);
}

/**
 * native SaveItemPoolHandle takes hashtable table, integer parentKey, integer childKey, itempool whichItempool returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassItemPool} whichItempool
 * @return {boolean}
 */
export function SaveItemPoolHandle(jass, table, parentKey, childKey, whichItempool) {
  return table.save(parentKey, childKey, whichItempool);
}

/**
 * native SaveQuestHandle takes hashtable table, integer parentKey, integer childKey, quest whichQuest returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassQuest} whichQuest
 * @return {boolean}
 */
export function SaveQuestHandle(jass, table, parentKey, childKey, whichQuest) {
  return table.save(parentKey, childKey, whichQuest);
}

/**
 * native SaveQuestItemHandle takes hashtable table, integer parentKey, integer childKey, questitem whichQuestitem returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassQuestItem} whichQuestitem
 * @return {boolean}
 */
export function SaveQuestItemHandle(jass, table, parentKey, childKey, whichQuestitem) {
  return table.save(parentKey, childKey, whichQuestitem);
}

/**
 * native SaveDefeatConditionHandle takes hashtable table, integer parentKey, integer childKey, defeatcondition whichDefeatcondition returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassDefeatCondition} whichDefeatcondition
 * @return {boolean}
 */
export function SaveDefeatConditionHandle(jass, table, parentKey, childKey, whichDefeatcondition) {
  return table.save(parentKey, childKey, whichDefeatcondition);
}

/**
 * native SaveTimerDialogHandle takes hashtable table, integer parentKey, integer childKey, timerdialog whichTimerdialog returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassTimerDialog} whichTimerdialog
 * @return {boolean}
 */
export function SaveTimerDialogHandle(jass, table, parentKey, childKey, whichTimerdialog) {
  return table.save(parentKey, childKey, whichTimerdialog);
}

/**
 * native SaveLeaderboardHandle takes hashtable table, integer parentKey, integer childKey, leaderboard whichLeaderboard returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassLeaderboard} whichLeaderboard
 * @return {boolean}
 */
export function SaveLeaderboardHandle(jass, table, parentKey, childKey, whichLeaderboard) {
  return table.save(parentKey, childKey, whichLeaderboard);
}

/**
 * native SaveMultiboardHandle takes hashtable table, integer parentKey, integer childKey, multiboard whichMultiboard returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassMultiboard} whichMultiboard
 * @return {boolean}
 */
export function SaveMultiboardHandle(jass, table, parentKey, childKey, whichMultiboard) {
  return table.save(parentKey, childKey, whichMultiboard);
}

/**
 * native SaveMultiboardItemHandle takes hashtable table, integer parentKey, integer childKey, multiboarditem whichMultiboarditem returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassMultiboardItem} whichMultiboarditem
 * @return {boolean}
 */
export function SaveMultiboardItemHandle(jass, table, parentKey, childKey, whichMultiboarditem) {
  return table.save(parentKey, childKey, whichMultiboarditem);
}

/**
 * native SaveTrackableHandle takes hashtable table, integer parentKey, integer childKey, trackable whichTrackable returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassTrackable} whichTrackable
 * @return {boolean}
 */
export function SaveTrackableHandle(jass, table, parentKey, childKey, whichTrackable) {
  return table.save(parentKey, childKey, whichTrackable);
}

/**
 * native SaveDialogHandle takes hashtable table, integer parentKey, integer childKey, dialog whichDialog returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassDialog} whichDialog
 * @return {boolean}
 */
export function SaveDialogHandle(jass, table, parentKey, childKey, whichDialog) {
  return table.save(parentKey, childKey, whichDialog);
}

/**
 * native SaveButtonHandle takes hashtable table, integer parentKey, integer childKey, button whichButton returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassButton} whichButton
 * @return {boolean}
 */
export function SaveButtonHandle(jass, table, parentKey, childKey, whichButton) {
  return table.save(parentKey, childKey, whichButton);
}

/**
 * native SaveTextTagHandle takes hashtable table, integer parentKey, integer childKey, texttag whichTexttag returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassTextTag} whichTexttag
 * @return {boolean}
 */
export function SaveTextTagHandle(jass, table, parentKey, childKey, whichTexttag) {
  return table.save(parentKey, childKey, whichTexttag);
}

/**
 * native SaveLightningHandle takes hashtable table, integer parentKey, integer childKey, lightning whichLightning returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassLightning} whichLightning
 * @return {boolean}
 */
export function SaveLightningHandle(jass, table, parentKey, childKey, whichLightning) {
  return table.save(parentKey, childKey, whichLightning);
}

/**
 * native SaveImageHandle takes hashtable table, integer parentKey, integer childKey, image whichImage returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassImage} whichImage
 * @return {boolean}
 */
export function SaveImageHandle(jass, table, parentKey, childKey, whichImage) {
  return table.save(parentKey, childKey, whichImage);
}

/**
 * native SaveUbersplatHandle takes hashtable table, integer parentKey, integer childKey, ubersplat whichUbersplat returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassUberSplat} whichUbersplat
 * @return {boolean}
 */
export function SaveUbersplatHandle(jass, table, parentKey, childKey, whichUbersplat) {
  return table.save(parentKey, childKey, whichUbersplat);
}

/**
 * native SaveRegionHandle takes hashtable table, integer parentKey, integer childKey, region whichRegion returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassRegion} whichRegion
 * @return {boolean}
 */
export function SaveRegionHandle(jass, table, parentKey, childKey, whichRegion) {
  return table.save(parentKey, childKey, whichRegion);
}

/**
 * native SaveFogStateHandle takes hashtable table, integer parentKey, integer childKey, fogstate whichFogState returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassFogState} whichFogState
 * @return {boolean}
 */
export function SaveFogStateHandle(jass, table, parentKey, childKey, whichFogState) {
  return table.save(parentKey, childKey, whichFogState);
}

/**
 * native SaveFogModifierHandle takes hashtable table, integer parentKey, integer childKey, fogmodifier whichFogModifier returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassFogModifier} whichFogModifier
 * @return {boolean}
 */
export function SaveFogModifierHandle(jass, table, parentKey, childKey, whichFogModifier) {
  return table.save(parentKey, childKey, whichFogModifier);
}

/**
 * native SaveAgentHandle takes hashtable table, integer parentKey, integer childKey, agent whichAgent returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassAgent} whichAgent
 * @return {boolean}
 */
export function SaveAgentHandle(jass, table, parentKey, childKey, whichAgent) {
  return table.save(parentKey, childKey, whichAgent);
}

/**
 * native SaveHashtableHandle takes hashtable table, integer parentKey, integer childKey, hashtable whichHashtable returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @param {JassHashTable} whichHashtable
 * @return {boolean}
 */
export function SaveHashtableHandle(jass, table, parentKey, childKey, whichHashtable) {
  return table.save(parentKey, childKey, whichHashtable);
}

/**
 * native LoadInteger takes hashtable table, integer parentKey, integer childKey returns integer
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {number}
 */
export function LoadInteger(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, 0);
}

/**
 * native LoadReal takes hashtable table, integer parentKey, integer childKey returns real
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {number}
 */
export function LoadReal(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, 0);
}

/**
 * native LoadBoolean takes hashtable table, integer parentKey, integer childKey returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {boolean}
 */
export function LoadBoolean(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, false);
}

/**
 * native LoadStr takes hashtable table, integer parentKey, integer childKey returns string
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {string}
 */
export function LoadStr(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadPlayerHandle takes hashtable table, integer parentKey, integer childKey returns player
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassPlayer}
 */
export function LoadPlayerHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadWidgetHandle takes hashtable table, integer parentKey, integer childKey returns widget
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassWidget}
 */
export function LoadWidgetHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadDestructableHandle takes hashtable table, integer parentKey, integer childKey returns destructable
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassDestructable}
 */
export function LoadDestructableHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadItemHandle takes hashtable table, integer parentKey, integer childKey returns item
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassItem}
 */
export function LoadItemHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadUnitHandle takes hashtable table, integer parentKey, integer childKey returns unit
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassUnit}
 */
export function LoadUnitHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadAbilityHandle takes hashtable table, integer parentKey, integer childKey returns ability
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassAbility}
 */
export function LoadAbilityHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadTimerHandle takes hashtable table, integer parentKey, integer childKey returns timer
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassTimer}
 */
export function LoadTimerHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadTriggerHandle takes hashtable table, integer parentKey, integer childKey returns trigger
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassTrigger}
 */
export function LoadTriggerHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadTriggerConditionHandle takes hashtable table, integer parentKey, integer childKey returns triggercondition
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {function(): boolean}
 */
export function LoadTriggerConditionHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadTriggerActionHandle takes hashtable table, integer parentKey, integer childKey returns triggeraction
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {function()}
 */
export function LoadTriggerActionHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadTriggerEventHandle takes hashtable table, integer parentKey, integer childKey returns event
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassEvent}
 */
export function LoadTriggerEventHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadForceHandle takes hashtable table, integer parentKey, integer childKey returns force
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassForce}
 */
export function LoadForceHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadGroupHandle takes hashtable table, integer parentKey, integer childKey returns group
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassGroup}
 */
export function LoadGroupHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadLocationHandle takes hashtable table, integer parentKey, integer childKey returns location
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassLocation}
 */
export function LoadLocationHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadRectHandle takes hashtable table, integer parentKey, integer childKey returns rect
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassRect}
 */
export function LoadRectHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadBooleanExprHandle takes hashtable table, integer parentKey, integer childKey returns boolexpr
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {function(): boolean}
 */
export function LoadBooleanExprHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadSoundHandle takes hashtable table, integer parentKey, integer childKey returns sound
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassSound}
 */
export function LoadSoundHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadEffectHandle takes hashtable table, integer parentKey, integer childKey returns effect
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassEffect}
 */
export function LoadEffectHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadUnitPoolHandle takes hashtable table, integer parentKey, integer childKey returns unitpool
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassUnitPool}
 */
export function LoadUnitPoolHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadItemPoolHandle takes hashtable table, integer parentKey, integer childKey returns itempool
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassItemPool}
 */
export function LoadItemPoolHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadQuestHandle takes hashtable table, integer parentKey, integer childKey returns quest
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassQuest}
 */
export function LoadQuestHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadQuestItemHandle takes hashtable table, integer parentKey, integer childKey returns questitem
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassQuestItem}
 */
export function LoadQuestItemHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadDefeatConditionHandle takes hashtable table, integer parentKey, integer childKey returns defeatcondition
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassDefeatCondition}
 */
export function LoadDefeatConditionHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadTimerDialogHandle takes hashtable table, integer parentKey, integer childKey returns timerdialog
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassTimerDialog}
 */
export function LoadTimerDialogHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadLeaderboardHandle takes hashtable table, integer parentKey, integer childKey returns leaderboard
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassLeaderboard}
 */
export function LoadLeaderboardHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadMultiboardHandle takes hashtable table, integer parentKey, integer childKey returns multiboard
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassMultiboard}
 */
export function LoadMultiboardHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadMultiboardItemHandle takes hashtable table, integer parentKey, integer childKey returns multiboarditem
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassMultiboardItem}
 */
export function LoadMultiboardItemHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadTrackableHandle takes hashtable table, integer parentKey, integer childKey returns trackable
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassTrackable}
 */
export function LoadTrackableHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadDialogHandle takes hashtable table, integer parentKey, integer childKey returns dialog
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassDialog}
 */
export function LoadDialogHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadButtonHandle takes hashtable table, integer parentKey, integer childKey returns button
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassButton}
 */
export function LoadButtonHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadTextTagHandle takes hashtable table, integer parentKey, integer childKey returns texttag
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassTextTag}
 */
export function LoadTextTagHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadLightningHandle takes hashtable table, integer parentKey, integer childKey returns lightning
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassLightning}
 */
export function LoadLightningHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadImageHandle takes hashtable table, integer parentKey, integer childKey returns image
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassImage}
 */
export function LoadImageHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadUbersplatHandle takes hashtable table, integer parentKey, integer childKey returns ubersplat
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassUberSplat}
 */
export function LoadUbersplatHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadRegionHandle takes hashtable table, integer parentKey, integer childKey returns region
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassRegion}
 */
export function LoadRegionHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadFogStateHandle takes hashtable table, integer parentKey, integer childKey returns fogstate
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassFogState}
 */
export function LoadFogStateHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadFogModifierHandle takes hashtable table, integer parentKey, integer childKey returns fogmodifier
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassFogModifier}
 */
export function LoadFogModifierHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native LoadHashtableHandle takes hashtable table, integer parentKey, integer childKey returns hashtable
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {JassHashTable}
 */
export function LoadHashtableHandle(jass, table, parentKey, childKey) {
  return table.load(parentKey, childKey, null);
}

/**
 * native HaveSavedInteger takes hashtable table, integer parentKey, integer childKey returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {boolean}
 */
export function HaveSavedInteger(jass, table, parentKey, childKey) {
  return table.have(parentKey, childKey);
}

/**
 * native HaveSavedReal takes hashtable table, integer parentKey, integer childKey returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {boolean}
 */
export function HaveSavedReal(jass, table, parentKey, childKey) {
  return table.have(parentKey, childKey);
}

/**
 * native HaveSavedBoolean takes hashtable table, integer parentKey, integer childKey returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {boolean}
 */
export function HaveSavedBoolean(jass, table, parentKey, childKey) {
  return table.have(parentKey, childKey);
}

/**
 * native HaveSavedString takes hashtable table, integer parentKey, integer childKey returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {boolean}
 */
export function HaveSavedString(jass, table, parentKey, childKey) {
  return table.have(parentKey, childKey);
}

/**
 * native HaveSavedHandle takes hashtable table, integer parentKey, integer childKey returns boolean
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 * @return {boolean}
 */
export function HaveSavedHandle(jass, table, parentKey, childKey) {
  return table.have(parentKey, childKey);
}

/**
 * native RemoveSavedInteger takes hashtable table, integer parentKey, integer childKey returns nothing
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 */
export function RemoveSavedInteger(jass, table, parentKey, childKey) {
  table.remove(parentKey, childKey);
}

/**
 * native RemoveSavedReal takes hashtable table, integer parentKey, integer childKey returns nothing
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 */
export function RemoveSavedReal(jass, table, parentKey, childKey) {
  table.remove(parentKey, childKey);
}

/**
 * native RemoveSavedBoolean takes hashtable table, integer parentKey, integer childKey returns nothing
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 */
export function RemoveSavedBoolean(jass, table, parentKey, childKey) {
  table.remove(parentKey, childKey);
}

/**
 * native RemoveSavedString takes hashtable table, integer parentKey, integer childKey returns nothing
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 */
export function RemoveSavedString(jass, table, parentKey, childKey) {
  table.remove(parentKey, childKey);
}

/**
 * native RemoveSavedHandle takes hashtable table, integer parentKey, integer childKey returns nothing
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 * @param {number} childKey
 */
export function RemoveSavedHandle(jass, table, parentKey, childKey) {
  table.remove(parentKey, childKey);
}

/**
 * native FlushParentHashtable takes hashtable table returns nothing
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 */
export function FlushParentHashtable(jass, table) {
  table.flush();
}

/**
 * native FlushChildHashtable takes hashtable table, integer parentKey returns nothing
 *
 * @param {JassContext} jass
 * @param {JassHashTable} table
 * @param {number} parentKey
 */
export function FlushChildHashtable(jass, table, parentKey) {
  table.flushChild(parentKey);
}

/**
 * native GetRandomInt takes integer lowBound, integer highBound returns integer
 *
 * @param {JassContext} jass
 * @param {number} lowBound
 * @param {number} highBound
 * @return {number}
 */
export function GetRandomInt(jass, lowBound, highBound) {
  return GetRandomReal() | 0;
}

/**
 * native GetRandomReal takes real lowBound, real highBound returns real
 *
 * @param {JassContext} jass
 * @param {number} lowBound
 * @param {number} highBound
 * @return {number}
 */
export function GetRandomReal(jass, lowBound, highBound) {
  return lowBound + Math.random() * (highBound - lowBound);
}

// /**
//  * native CreateUnitPool takes nothing returns unitpool
//  *
//  * @param {JassContext} jass
//  * @return {JassUnitPool}
//  */
// export function CreateUnitPool(jass) {}

// /**
//  * native DestroyUnitPool takes unitpool whichPool returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnitPool} whichPool
//  */
// export function DestroyUnitPool(jass, whichPool) {}

// /**
//  * native UnitPoolAddUnitType takes unitpool whichPool, integer unitId, real weight returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnitPool} whichPool
//  * @param {number} unitId
//  * @param {number} weight
//  */
// export function UnitPoolAddUnitType(jass, whichPool, unitId, weight) {}

// /**
//  * native UnitPoolRemoveUnitType takes unitpool whichPool, integer unitId returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnitPool} whichPool
//  * @param {number} unitId
//  */
// export function UnitPoolRemoveUnitType(jass, whichPool, unitId) {}

// /**
//  * native PlaceRandomUnit takes unitpool whichPool, player forWhichPlayer, real x, real y, real facing returns unit
//  *
//  * @param {JassContext} jass
//  * @param {JassUnitPool} whichPool
//  * @param {JassPlayer} forWhichPlayer
//  * @param {number} x
//  * @param {number} y
//  * @param {number} facing
//  * @return {JassUnit}
//  */
// export function PlaceRandomUnit(jass, whichPool, forWhichPlayer, x, y, facing) {}

// /**
//  * native CreateItemPool takes nothing returns itempool
//  *
//  * @param {JassContext} jass
//  * @return {JassItemPool}
//  */
// export function CreateItemPool(jass) {}

// /**
//  * native DestroyItemPool takes itempool whichItemPool returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassItemPool} whichItemPool
//  */
// export function DestroyItemPool(jass, whichItemPool) {}

// /**
//  * native ItemPoolAddItemType takes itempool whichItemPool, integer itemId, real weight returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassItemPool} whichItemPool
//  * @param {number} itemId
//  * @param {number} weight
//  */
// export function ItemPoolAddItemType(jass, whichItemPool, itemId, weight) {}

// /**
//  * native ItemPoolRemoveItemType takes itempool whichItemPool, integer itemId returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassItemPool} whichItemPool
//  * @param {number} itemId
//  */
// export function ItemPoolRemoveItemType(jass, whichItemPool, itemId) {}

// /**
//  * native PlaceRandomItem takes itempool whichItemPool, real x, real y returns item
//  *
//  * @param {JassContext} jass
//  * @param {JassItemPool} whichItemPool
//  * @param {number} x
//  * @param {number} y
//  * @return {JassItem}
//  */
// export function PlaceRandomItem(jass, whichItemPool, x, y) {}

// /**
//  * native ChooseRandomCreep takes integer level returns integer
//  *
//  * @param {JassContext} jass
//  * @param {number} level
//  * @return {number}
//  */
// export function ChooseRandomCreep(jass, level) {}

// /**
//  * native ChooseRandomNPBuilding takes nothing returns integer
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function ChooseRandomNPBuilding(jass) {}

// /**
//  * native ChooseRandomItem takes integer level returns integer
//  *
//  * @param {JassContext} jass
//  * @param {number} level
//  * @return {number}
//  */
// export function ChooseRandomItem(jass, level) {}

// /**
//  * native ChooseRandomItemEx takes itemtype whichType, integer level returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassItemType} whichType
//  * @param {number} level
//  * @return {number}
//  */
// export function ChooseRandomItemEx(jass, whichType, level) {}

// /**
//  * native SetRandomSeed takes integer seed returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} seed
//  */
// export function SetRandomSeed(jass, seed) {}

// /**
//  * native SetTerrainFog takes real a, real b, real c, real d, real e returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} a
//  * @param {number} b
//  * @param {number} c
//  * @param {number} d
//  * @param {number} e
//  */
// export function SetTerrainFog(jass, a, b, c, d, e) {}

// /**
//  * native ResetTerrainFog takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function ResetTerrainFog(jass) {}

// /**
//  * native SetUnitFog takes real a, real b, real c, real d, real e returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} a
//  * @param {number} b
//  * @param {number} c
//  * @param {number} d
//  * @param {number} e
//  */
// export function SetUnitFog(jass, a, b, c, d, e) {}

// /**
//  * native SetTerrainFogEx takes integer style, real zstart, real zend, real density, real red, real green, real blue returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} style
//  * @param {number} zstart
//  * @param {number} zend
//  * @param {number} density
//  * @param {number} red
//  * @param {number} green
//  * @param {number} blue
//  */
// export function SetTerrainFogEx(jass, style, zstart, zend, density, red, green, blue) {}

// /**
//  * native DisplayTextToPlayer takes player toPlayer, real x, real y, string message returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} toPlayer
//  * @param {number} x
//  * @param {number} y
//  * @param {string} message
//  */
// export function DisplayTextToPlayer(jass, toPlayer, x, y, message) {}

// /**
//  * native DisplayTimedTextToPlayer takes player toPlayer, real x, real y, real duration, string message returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} toPlayer
//  * @param {number} x
//  * @param {number} y
//  * @param {number} duration
//  * @param {string} message
//  */
// export function DisplayTimedTextToPlayer(jass, toPlayer, x, y, duration, message) {}

// /**
//  * native DisplayTimedTextFromPlayer takes player toPlayer, real x, real y, real duration, string message returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} toPlayer
//  * @param {number} x
//  * @param {number} y
//  * @param {number} duration
//  * @param {string} message
//  */
// export function DisplayTimedTextFromPlayer(jass, toPlayer, x, y, duration, message) {}

// /**
//  * native ClearTextMessages takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function ClearTextMessages(jass) {}

// /**
//  * native SetDayNightModels takes string terrainDNCFile, string unitDNCFile returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {string} terrainDNCFile
//  * @param {string} unitDNCFile
//  */
// export function SetDayNightModels(jass, terrainDNCFile, unitDNCFile) {}

// /**
//  * native SetSkyModel takes string skyModelFile returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {string} skyModelFile
//  */
// export function SetSkyModel(jass, skyModelFile) {}

// /**
//  * native EnableUserControl takes boolean b returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {boolean} b
//  */
// export function EnableUserControl(jass, b) {}

// /**
//  * native EnableUserUI takes boolean b returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {boolean} b
//  */
// export function EnableUserUI(jass, b) {}

// /**
//  * native SuspendTimeOfDay takes boolean b returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {boolean} b
//  */
// export function SuspendTimeOfDay(jass, b) {}

// /**
//  * native SetTimeOfDayScale takes real r returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} r
//  */
// export function SetTimeOfDayScale(jass, r) {}

// /**
//  * native GetTimeOfDayScale takes nothing returns real
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetTimeOfDayScale(jass) {}

// /**
//  * native ShowInterface takes boolean flag, real fadeDuration returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {boolean} flag
//  * @param {number} fadeDuration
//  */
// export function ShowInterface(jass, flag, fadeDuration) {}

// /**
//  * native PauseGame takes boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {boolean} flag
//  */
// export function PauseGame(jass, flag) {}

// /**
//  * native UnitAddIndicator takes unit whichUnit, integer red, integer green, integer blue, integer alpha returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} red
//  * @param {number} green
//  * @param {number} blue
//  * @param {number} alpha
//  */
// export function UnitAddIndicator(jass, whichUnit, red, green, blue, alpha) {}

// /**
//  * native AddIndicator takes widget whichWidget, integer red, integer green, integer blue, integer alpha returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassWidget} whichWidget
//  * @param {number} red
//  * @param {number} green
//  * @param {number} blue
//  * @param {number} alpha
//  */
// export function AddIndicator(jass, whichWidget, red, green, blue, alpha) {}

// /**
//  * native PingMinimap takes real x, real y, real duration returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  * @param {number} duration
//  */
// export function PingMinimap(jass, x, y, duration) {}

// /**
//  * native PingMinimapEx takes real x, real y, real duration, integer red, integer green, integer blue, boolean extraEffects returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  * @param {number} duration
//  * @param {number} red
//  * @param {number} green
//  * @param {number} blue
//  * @param {boolean} extraEffects
//  */
// export function PingMinimapEx(jass, x, y, duration, red, green, blue, extraEffects) {}

// /**
//  * native EnableOcclusion takes boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {boolean} flag
//  */
// export function EnableOcclusion(jass, flag) {}

// /**
//  * native SetIntroShotText takes string introText returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {string} introText
//  */
// export function SetIntroShotText(jass, introText) {}

// /**
//  * native SetIntroShotModel takes string introModelPath returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {string} introModelPath
//  */
// export function SetIntroShotModel(jass, introModelPath) {}

// /**
//  * native EnableWorldFogBoundary takes boolean b returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {boolean} b
//  */
// export function EnableWorldFogBoundary(jass, b) {}

// /**
//  * native PlayModelCinematic takes string modelName returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {string} modelName
//  */
// export function PlayModelCinematic(jass, modelName) {}

// /**
//  * native PlayCinematic takes string movieName returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {string} movieName
//  */
// export function PlayCinematic(jass, movieName) {}

// /**
//  * native ForceUIKey takes string key returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {string} key
//  */
// export function ForceUIKey(jass, key) {}

// /**
//  * native ForceUICancel takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function ForceUICancel(jass) {}

// /**
//  * native DisplayLoadDialog takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function DisplayLoadDialog(jass) {}

// /**
//  * native SetAltMinimapIcon takes string iconPath returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {string} iconPath
//  */
// export function SetAltMinimapIcon(jass, iconPath) {}

// /**
//  * native DisableRestartMission takes boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {boolean} flag
//  */
// export function DisableRestartMission(jass, flag) {}

// /**
//  * native CreateTextTag takes nothing returns texttag
//  *
//  * @param {JassContext} jass
//  * @return {JassTextTag}
//  */
// export function CreateTextTag(jass) {}

// /**
//  * native DestroyTextTag takes texttag t returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTextTag} t
//  */
// export function DestroyTextTag(jass, t) {}

// /**
//  * native SetTextTagText takes texttag t, string s, real height returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTextTag} t
//  * @param {string} s
//  * @param {number} height
//  */
// export function SetTextTagText(jass, t, s, height) {}

// /**
//  * native SetTextTagPos takes texttag t, real x, real y, real heightOffset returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTextTag} t
//  * @param {number} x
//  * @param {number} y
//  * @param {number} heightOffset
//  */
// export function SetTextTagPos(jass, t, x, y, heightOffset) {}

// /**
//  * native SetTextTagPosUnit takes texttag t, unit whichUnit, real heightOffset returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTextTag} t
//  * @param {JassUnit} whichUnit
//  * @param {number} heightOffset
//  */
// export function SetTextTagPosUnit(jass, t, whichUnit, heightOffset) {}

// /**
//  * native SetTextTagColor takes texttag t, integer red, integer green, integer blue, integer alpha returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTextTag} t
//  * @param {number} red
//  * @param {number} green
//  * @param {number} blue
//  * @param {number} alpha
//  */
// export function SetTextTagColor(jass, t, red, green, blue, alpha) {}

// /**
//  * native SetTextTagVelocity takes texttag t, real xvel, real yvel returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTextTag} t
//  * @param {number} xvel
//  * @param {number} yvel
//  */
// export function SetTextTagVelocity(jass, t, xvel, yvel) {}

// /**
//  * native SetTextTagVisibility takes texttag t, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTextTag} t
//  * @param {boolean} flag
//  */
// export function SetTextTagVisibility(jass, t, flag) {}

// /**
//  * native SetTextTagSuspended takes texttag t, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTextTag} t
//  * @param {boolean} flag
//  */
// export function SetTextTagSuspended(jass, t, flag) {}

// /**
//  * native SetTextTagPermanent takes texttag t, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTextTag} t
//  * @param {boolean} flag
//  */
// export function SetTextTagPermanent(jass, t, flag) {}

// /**
//  * native SetTextTagAge takes texttag t, real age returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTextTag} t
//  * @param {number} age
//  */
// export function SetTextTagAge(jass, t, age) {}

// /**
//  * native SetTextTagLifespan takes texttag t, real lifespan returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTextTag} t
//  * @param {number} lifespan
//  */
// export function SetTextTagLifespan(jass, t, lifespan) {}

// /**
//  * native SetTextTagFadepoint takes texttag t, real fadepoint returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTextTag} t
//  * @param {number} fadepoint
//  */
// export function SetTextTagFadepoint(jass, t, fadepoint) {}

// /**
//  * native SetReservedLocalHeroButtons takes integer reserved returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} reserved
//  */
// export function SetReservedLocalHeroButtons(jass, reserved) {}

// /**
//  * native GetAllyColorFilterState takes nothing returns integer
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetAllyColorFilterState(jass) {}

// /**
//  * native SetAllyColorFilterState takes integer state returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} state
//  */
// export function SetAllyColorFilterState(jass, state) {}

// /**
//  * native GetCreepCampFilterState takes nothing returns boolean
//  *
//  * @param {JassContext} jass
//  * @return {boolean}
//  */
// export function GetCreepCampFilterState(jass) {}

// /**
//  * native SetCreepCampFilterState takes boolean state returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {boolean} state
//  */
// export function SetCreepCampFilterState(jass, state) {}

// /**
//  * native EnableMinimapFilterButtons takes boolean enableAlly, boolean enableCreep returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {boolean} enableAlly
//  * @param {boolean} enableCreep
//  */
// export function EnableMinimapFilterButtons(jass, enableAlly, enableCreep) {}

// /**
//  * native EnableDragSelect takes boolean state, boolean ui returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {boolean} state
//  * @param {boolean} ui
//  */
// export function EnableDragSelect(jass, state, ui) {}

// /**
//  * native EnablePreSelect takes boolean state, boolean ui returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {boolean} state
//  * @param {boolean} ui
//  */
// export function EnablePreSelect(jass, state, ui) {}

// /**
//  * native EnableSelect takes boolean state, boolean ui returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {boolean} state
//  * @param {boolean} ui
//  */
// export function EnableSelect(jass, state, ui) {}

// /**
//  * native CreateTrackable takes string trackableModelPath, real x, real y, real facing returns trackable
//  *
//  * @param {JassContext} jass
//  * @param {string} trackableModelPath
//  * @param {number} x
//  * @param {number} y
//  * @param {number} facing
//  * @return {JassTrackable}
//  */
// export function CreateTrackable(jass, trackableModelPath, x, y, facing) {}

// /**
//  * native CreateQuest takes nothing returns quest
//  *
//  * @param {JassContext} jass
//  * @return {JassQuest}
//  */
// export function CreateQuest(jass) {}

// /**
//  * native DestroyQuest takes quest whichQuest returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassQuest} whichQuest
//  */
// export function DestroyQuest(jass, whichQuest) {}

// /**
//  * native QuestSetTitle takes quest whichQuest, string title returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassQuest} whichQuest
//  * @param {string} title
//  */
// export function QuestSetTitle(jass, whichQuest, title) {}

// /**
//  * native QuestSetDescription takes quest whichQuest, string description returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassQuest} whichQuest
//  * @param {string} description
//  */
// export function QuestSetDescription(jass, whichQuest, description) {}

// /**
//  * native QuestSetIconPath takes quest whichQuest, string iconPath returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassQuest} whichQuest
//  * @param {string} iconPath
//  */
// export function QuestSetIconPath(jass, whichQuest, iconPath) {}

// /**
//  * native QuestSetRequired takes quest whichQuest, boolean required returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassQuest} whichQuest
//  * @param {boolean} required
//  */
// export function QuestSetRequired(jass, whichQuest, required) {}

// /**
//  * native QuestSetCompleted takes quest whichQuest, boolean completed returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassQuest} whichQuest
//  * @param {boolean} completed
//  */
// export function QuestSetCompleted(jass, whichQuest, completed) {}

// /**
//  * native QuestSetDiscovered takes quest whichQuest, boolean discovered returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassQuest} whichQuest
//  * @param {boolean} discovered
//  */
// export function QuestSetDiscovered(jass, whichQuest, discovered) {}

// /**
//  * native QuestSetFailed takes quest whichQuest, boolean failed returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassQuest} whichQuest
//  * @param {boolean} failed
//  */
// export function QuestSetFailed(jass, whichQuest, failed) {}

// /**
//  * native QuestSetEnabled takes quest whichQuest, boolean enabled returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassQuest} whichQuest
//  * @param {boolean} enabled
//  */
// export function QuestSetEnabled(jass, whichQuest, enabled) {}

// /**
//  * native IsQuestRequired takes quest whichQuest returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassQuest} whichQuest
//  * @return {boolean}
//  */
// export function IsQuestRequired(jass, whichQuest) {}

// /**
//  * native IsQuestCompleted takes quest whichQuest returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassQuest} whichQuest
//  * @return {boolean}
//  */
// export function IsQuestCompleted(jass, whichQuest) {}

// /**
//  * native IsQuestDiscovered takes quest whichQuest returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassQuest} whichQuest
//  * @return {boolean}
//  */
// export function IsQuestDiscovered(jass, whichQuest) {}

// /**
//  * native IsQuestFailed takes quest whichQuest returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassQuest} whichQuest
//  * @return {boolean}
//  */
// export function IsQuestFailed(jass, whichQuest) {}

// /**
//  * native IsQuestEnabled takes quest whichQuest returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassQuest} whichQuest
//  * @return {boolean}
//  */
// export function IsQuestEnabled(jass, whichQuest) {}

// /**
//  * native QuestCreateItem takes quest whichQuest returns questitem
//  *
//  * @param {JassContext} jass
//  * @param {JassQuest} whichQuest
//  * @return {JassQuestItem}
//  */
// export function QuestCreateItem(jass, whichQuest) {}

// /**
//  * native QuestItemSetDescription takes questitem whichQuestItem, string description returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassQuestItem} whichQuestItem
//  * @param {string} description
//  */
// export function QuestItemSetDescription(jass, whichQuestItem, description) {}

// /**
//  * native QuestItemSetCompleted takes questitem whichQuestItem, boolean completed returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassQuestItem} whichQuestItem
//  * @param {boolean} completed
//  */
// export function QuestItemSetCompleted(jass, whichQuestItem, completed) {}

// /**
//  * native IsQuestItemCompleted takes questitem whichQuestItem returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassQuestItem} whichQuestItem
//  * @return {boolean}
//  */
// export function IsQuestItemCompleted(jass, whichQuestItem) {}

// /**
//  * native CreateDefeatCondition takes nothing returns defeatcondition
//  *
//  * @param {JassContext} jass
//  * @return {JassDefeatCondition}
//  */
// export function CreateDefeatCondition(jass) {}

// /**
//  * native DestroyDefeatCondition takes defeatcondition whichCondition returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassDefeatCondition} whichCondition
//  */
// export function DestroyDefeatCondition(jass, whichCondition) {}

// /**
//  * native DefeatConditionSetDescription takes defeatcondition whichCondition, string description returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassDefeatCondition} whichCondition
//  * @param {string} description
//  */
// export function DefeatConditionSetDescription(jass, whichCondition, description) {}

// /**
//  * native FlashQuestDialogButton takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function FlashQuestDialogButton(jass) {}

// /**
//  * native ForceQuestDialogUpdate takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function ForceQuestDialogUpdate(jass) {}

// /**
//  * native CreateTimerDialog takes timer t returns timerdialog
//  *
//  * @param {JassContext} jass
//  * @param {JassTimer} t
//  * @return {JassTimerDialog}
//  */
// export function CreateTimerDialog(jass, t) {}

// /**
//  * native DestroyTimerDialog takes timerdialog whichDialog returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTimerDialog} whichDialog
//  */
// export function DestroyTimerDialog(jass, whichDialog) {}

// /**
//  * native TimerDialogSetTitle takes timerdialog whichDialog, string title returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTimerDialog} whichDialog
//  * @param {string} title
//  */
// export function TimerDialogSetTitle(jass, whichDialog, title) {}

// /**
//  * native TimerDialogSetTitleColor takes timerdialog whichDialog, integer red, integer green, integer blue, integer alpha returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTimerDialog} whichDialog
//  * @param {number} red
//  * @param {number} green
//  * @param {number} blue
//  * @param {number} alpha
//  */
// export function TimerDialogSetTitleColor(jass, whichDialog, red, green, blue, alpha) {}

// /**
//  * native TimerDialogSetTimeColor takes timerdialog whichDialog, integer red, integer green, integer blue, integer alpha returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTimerDialog} whichDialog
//  * @param {number} red
//  * @param {number} green
//  * @param {number} blue
//  * @param {number} alpha
//  */
// export function TimerDialogSetTimeColor(jass, whichDialog, red, green, blue, alpha) {}

// /**
//  * native TimerDialogSetSpeed takes timerdialog whichDialog, real speedMultFactor returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTimerDialog} whichDialog
//  * @param {number} speedMultFactor
//  */
// export function TimerDialogSetSpeed(jass, whichDialog, speedMultFactor) {}

// /**
//  * native TimerDialogDisplay takes timerdialog whichDialog, boolean display returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTimerDialog} whichDialog
//  * @param {boolean} display
//  */
// export function TimerDialogDisplay(jass, whichDialog, display) {}

// /**
//  * native IsTimerDialogDisplayed takes timerdialog whichDialog returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassTimerDialog} whichDialog
//  * @return {boolean}
//  */
// export function IsTimerDialogDisplayed(jass, whichDialog) {}

// /**
//  * native TimerDialogSetRealTimeRemaining takes timerdialog whichDialog, real timeRemaining returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTimerDialog} whichDialog
//  * @param {number} timeRemaining
//  */
// export function TimerDialogSetRealTimeRemaining(jass, whichDialog, timeRemaining) {}

// /**
//  * native CreateLeaderboard takes nothing returns leaderboard
//  *
//  * @param {JassContext} jass
//  * @return {JassLeaderboard}
//  */
// export function CreateLeaderboard(jass) {}

// /**
//  * native DestroyLeaderboard takes leaderboard lb returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassLeaderboard} lb
//  */
// export function DestroyLeaderboard(jass, lb) {}

// /**
//  * native LeaderboardDisplay takes leaderboard lb, boolean show returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassLeaderboard} lb
//  * @param {boolean} show
//  */
// export function LeaderboardDisplay(jass, lb, show) {}

// /**
//  * native IsLeaderboardDisplayed takes leaderboard lb returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassLeaderboard} lb
//  * @return {boolean}
//  */
// export function IsLeaderboardDisplayed(jass, lb) {}

// /**
//  * native LeaderboardGetItemCount takes leaderboard lb returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassLeaderboard} lb
//  * @return {number}
//  */
// export function LeaderboardGetItemCount(jass, lb) {}

// /**
//  * native LeaderboardSetSizeByItemCount takes leaderboard lb, integer count returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassLeaderboard} lb
//  * @param {number} count
//  */
// export function LeaderboardSetSizeByItemCount(jass, lb, count) {}

// /**
//  * native LeaderboardAddItem takes leaderboard lb, string label, integer value, player p returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassLeaderboard} lb
//  * @param {string} label
//  * @param {number} value
//  * @param {JassPlayer} p
//  */
// export function LeaderboardAddItem(jass, lb, label, value, p) {}

// /**
//  * native LeaderboardRemoveItem takes leaderboard lb, integer index returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassLeaderboard} lb
//  * @param {number} index
//  */
// export function LeaderboardRemoveItem(jass, lb, index) {}

// /**
//  * native LeaderboardRemovePlayerItem takes leaderboard lb, player p returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassLeaderboard} lb
//  * @param {JassPlayer} p
//  */
// export function LeaderboardRemovePlayerItem(jass, lb, p) {}

// /**
//  * native LeaderboardClear takes leaderboard lb returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassLeaderboard} lb
//  */
// export function LeaderboardClear(jass, lb) {}

// /**
//  * native LeaderboardSortItemsByValue takes leaderboard lb, boolean ascending returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassLeaderboard} lb
//  * @param {boolean} ascending
//  */
// export function LeaderboardSortItemsByValue(jass, lb, ascending) {}

// /**
//  * native LeaderboardSortItemsByPlayer takes leaderboard lb, boolean ascending returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassLeaderboard} lb
//  * @param {boolean} ascending
//  */
// export function LeaderboardSortItemsByPlayer(jass, lb, ascending) {}

// /**
//  * native LeaderboardSortItemsByLabel takes leaderboard lb, boolean ascending returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassLeaderboard} lb
//  * @param {boolean} ascending
//  */
// export function LeaderboardSortItemsByLabel(jass, lb, ascending) {}

// /**
//  * native LeaderboardHasPlayerItem takes leaderboard lb, player p returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassLeaderboard} lb
//  * @param {JassPlayer} p
//  * @return {boolean}
//  */
// export function LeaderboardHasPlayerItem(jass, lb, p) {}

// /**
//  * native LeaderboardGetPlayerIndex takes leaderboard lb, player p returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassLeaderboard} lb
//  * @param {JassPlayer} p
//  * @return {number}
//  */
// export function LeaderboardGetPlayerIndex(jass, lb, p) {}

// /**
//  * native LeaderboardSetLabel takes leaderboard lb, string label returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassLeaderboard} lb
//  * @param {string} label
//  */
// export function LeaderboardSetLabel(jass, lb, label) {}

// /**
//  * native LeaderboardGetLabelText takes leaderboard lb returns string
//  *
//  * @param {JassContext} jass
//  * @param {JassLeaderboard} lb
//  * @return {string}
//  */
// export function LeaderboardGetLabelText(jass, lb) {}

// /**
//  * native PlayerSetLeaderboard takes player toPlayer, leaderboard lb returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} toPlayer
//  * @param {JassLeaderboard} lb
//  */
// export function PlayerSetLeaderboard(jass, toPlayer, lb) {}

// /**
//  * native PlayerGetLeaderboard takes player toPlayer returns leaderboard
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} toPlayer
//  * @return {JassLeaderboard}
//  */
// export function PlayerGetLeaderboard(jass, toPlayer) {}

// /**
//  * native LeaderboardSetLabelColor takes leaderboard lb, integer red, integer green, integer blue, integer alpha returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassLeaderboard} lb
//  * @param {number} red
//  * @param {number} green
//  * @param {number} blue
//  * @param {number} alpha
//  */
// export function LeaderboardSetLabelColor(jass, lb, red, green, blue, alpha) {}

// /**
//  * native LeaderboardSetValueColor takes leaderboard lb, integer red, integer green, integer blue, integer alpha returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassLeaderboard} lb
//  * @param {number} red
//  * @param {number} green
//  * @param {number} blue
//  * @param {number} alpha
//  */
// export function LeaderboardSetValueColor(jass, lb, red, green, blue, alpha) {}

// /**
//  * native LeaderboardSetStyle takes leaderboard lb, boolean showLabel, boolean showNames, boolean showValues, boolean showIcons returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassLeaderboard} lb
//  * @param {boolean} showLabel
//  * @param {boolean} showNames
//  * @param {boolean} showValues
//  * @param {boolean} showIcons
//  */
// export function LeaderboardSetStyle(jass, lb, showLabel, showNames, showValues, showIcons) {}

// /**
//  * native LeaderboardSetItemValue takes leaderboard lb, integer whichItem, integer val returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassLeaderboard} lb
//  * @param {number} whichItem
//  * @param {number} val
//  */
// export function LeaderboardSetItemValue(jass, lb, whichItem, val) {}

// /**
//  * native LeaderboardSetItemLabel takes leaderboard lb, integer whichItem, string val returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassLeaderboard} lb
//  * @param {number} whichItem
//  * @param {string} val
//  */
// export function LeaderboardSetItemLabel(jass, lb, whichItem, val) {}

// /**
//  * native LeaderboardSetItemStyle takes leaderboard lb, integer whichItem, boolean showLabel, boolean showValue, boolean showIcon returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassLeaderboard} lb
//  * @param {number} whichItem
//  * @param {boolean} showLabel
//  * @param {boolean} showValue
//  * @param {boolean} showIcon
//  */
// export function LeaderboardSetItemStyle(jass, lb, whichItem, showLabel, showValue, showIcon) {}

// /**
//  * native LeaderboardSetItemLabelColor takes leaderboard lb, integer whichItem, integer red, integer green, integer blue, integer alpha returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassLeaderboard} lb
//  * @param {number} whichItem
//  * @param {number} red
//  * @param {number} green
//  * @param {number} blue
//  * @param {number} alpha
//  */
// export function LeaderboardSetItemLabelColor(jass, lb, whichItem, red, green, blue, alpha) {}

// /**
//  * native LeaderboardSetItemValueColor takes leaderboard lb, integer whichItem, integer red, integer green, integer blue, integer alpha returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassLeaderboard} lb
//  * @param {number} whichItem
//  * @param {number} red
//  * @param {number} green
//  * @param {number} blue
//  * @param {number} alpha
//  */
// export function LeaderboardSetItemValueColor(jass, lb, whichItem, red, green, blue, alpha) {}

// /**
//  * native CreateMultiboard takes nothing returns multiboard
//  *
//  * @param {JassContext} jass
//  * @return {JassMultiboard}
//  */
// export function CreateMultiboard(jass) {}

// /**
//  * native DestroyMultiboard takes multiboard lb returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboard} lb
//  */
// export function DestroyMultiboard(jass, lb) {}

// /**
//  * native MultiboardDisplay takes multiboard lb, boolean show returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboard} lb
//  * @param {boolean} show
//  */
// export function MultiboardDisplay(jass, lb, show) {}

// /**
//  * native IsMultiboardDisplayed takes multiboard lb returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboard} lb
//  * @return {boolean}
//  */
// export function IsMultiboardDisplayed(jass, lb) {}

// /**
//  * native MultiboardMinimize takes multiboard lb, boolean minimize returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboard} lb
//  * @param {boolean} minimize
//  */
// export function MultiboardMinimize(jass, lb, minimize) {}

// /**
//  * native IsMultiboardMinimized takes multiboard lb returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboard} lb
//  * @return {boolean}
//  */
// export function IsMultiboardMinimized(jass, lb) {}

// /**
//  * native MultiboardClear takes multiboard lb returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboard} lb
//  */
// export function MultiboardClear(jass, lb) {}

// /**
//  * native MultiboardSetTitleText takes multiboard lb, string label returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboard} lb
//  * @param {string} label
//  */
// export function MultiboardSetTitleText(jass, lb, label) {}

// /**
//  * native MultiboardGetTitleText takes multiboard lb returns string
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboard} lb
//  * @return {string}
//  */
// export function MultiboardGetTitleText(jass, lb) {}

// /**
//  * native MultiboardSetTitleTextColor takes multiboard lb, integer red, integer green, integer blue, integer alpha returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboard} lb
//  * @param {number} red
//  * @param {number} green
//  * @param {number} blue
//  * @param {number} alpha
//  */
// export function MultiboardSetTitleTextColor(jass, lb, red, green, blue, alpha) {}

// /**
//  * native MultiboardGetRowCount takes multiboard lb returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboard} lb
//  * @return {number}
//  */
// export function MultiboardGetRowCount(jass, lb) {}

// /**
//  * native MultiboardGetColumnCount takes multiboard lb returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboard} lb
//  * @return {number}
//  */
// export function MultiboardGetColumnCount(jass, lb) {}

// /**
//  * native MultiboardSetColumnCount takes multiboard lb, integer count returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboard} lb
//  * @param {number} count
//  */
// export function MultiboardSetColumnCount(jass, lb, count) {}

// /**
//  * native MultiboardSetRowCount takes multiboard lb, integer count returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboard} lb
//  * @param {number} count
//  */
// export function MultiboardSetRowCount(jass, lb, count) {}

// /**
//  * native MultiboardSetItemsStyle takes multiboard lb, boolean showValues, boolean showIcons returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboard} lb
//  * @param {boolean} showValues
//  * @param {boolean} showIcons
//  */
// export function MultiboardSetItemsStyle(jass, lb, showValues, showIcons) {}

// /**
//  * native MultiboardSetItemsValue takes multiboard lb, string value returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboard} lb
//  * @param {string} value
//  */
// export function MultiboardSetItemsValue(jass, lb, value) {}

// /**
//  * native MultiboardSetItemsValueColor takes multiboard lb, integer red, integer green, integer blue, integer alpha returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboard} lb
//  * @param {number} red
//  * @param {number} green
//  * @param {number} blue
//  * @param {number} alpha
//  */
// export function MultiboardSetItemsValueColor(jass, lb, red, green, blue, alpha) {}

// /**
//  * native MultiboardSetItemsWidth takes multiboard lb, real width returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboard} lb
//  * @param {number} width
//  */
// export function MultiboardSetItemsWidth(jass, lb, width) {}

// /**
//  * native MultiboardSetItemsIcon takes multiboard lb, string iconPath returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboard} lb
//  * @param {string} iconPath
//  */
// export function MultiboardSetItemsIcon(jass, lb, iconPath) {}

// /**
//  * native MultiboardGetItem takes multiboard lb, integer row, integer column returns multiboarditem
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboard} lb
//  * @param {number} row
//  * @param {number} column
//  * @return {JassMultiboardItem}
//  */
// export function MultiboardGetItem(jass, lb, row, column) {}

// /**
//  * native MultiboardReleaseItem takes multiboarditem mbi returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboardItem} mbi
//  */
// export function MultiboardReleaseItem(jass, mbi) {}

// /**
//  * native MultiboardSetItemStyle takes multiboarditem mbi, boolean showValue, boolean showIcon returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboardItem} mbi
//  * @param {boolean} showValue
//  * @param {boolean} showIcon
//  */
// export function MultiboardSetItemStyle(jass, mbi, showValue, showIcon) {}

// /**
//  * native MultiboardSetItemValue takes multiboarditem mbi, string val returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboardItem} mbi
//  * @param {string} val
//  */
// export function MultiboardSetItemValue(jass, mbi, val) {}

// /**
//  * native MultiboardSetItemValueColor takes multiboarditem mbi, integer red, integer green, integer blue, integer alpha returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboardItem} mbi
//  * @param {number} red
//  * @param {number} green
//  * @param {number} blue
//  * @param {number} alpha
//  */
// export function MultiboardSetItemValueColor(jass, mbi, red, green, blue, alpha) {}

// /**
//  * native MultiboardSetItemWidth takes multiboarditem mbi, real width returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboardItem} mbi
//  * @param {number} width
//  */
// export function MultiboardSetItemWidth(jass, mbi, width) {}

// /**
//  * native MultiboardSetItemIcon takes multiboarditem mbi, string iconFileName returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassMultiboardItem} mbi
//  * @param {string} iconFileName
//  */
// export function MultiboardSetItemIcon(jass, mbi, iconFileName) {}

// /**
//  * native MultiboardSuppressDisplay takes boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {boolean} flag
//  */
// export function MultiboardSuppressDisplay(jass, flag) {}

// /**
//  * native SetCameraPosition takes real x, real y returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  */
// export function SetCameraPosition(jass, x, y) {}

// /**
//  * native SetCameraQuickPosition takes real x, real y returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  */
// export function SetCameraQuickPosition(jass, x, y) {}

// /**
//  * native SetCameraBounds takes real x1, real y1, real x2, real y2, real x3, real y3, real x4, real y4 returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} x1
//  * @param {number} y1
//  * @param {number} x2
//  * @param {number} y2
//  * @param {number} x3
//  * @param {number} y3
//  * @param {number} x4
//  * @param {number} y4
//  */
// export function SetCameraBounds(jass, x1, y1, x2, y2, x3, y3, x4, y4) {}

// /**
//  * native StopCamera takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function StopCamera(jass) {}

// /**
//  * native ResetToGameCamera takes real duration returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} duration
//  */
// export function ResetToGameCamera(jass, duration) {}

// /**
//  * native PanCameraTo takes real x, real y returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  */
// export function PanCameraTo(jass, x, y) {}

// /**
//  * native PanCameraToTimed takes real x, real y, real duration returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  * @param {number} duration
//  */
// export function PanCameraToTimed(jass, x, y, duration) {}

// /**
//  * native PanCameraToWithZ takes real x, real y, real zOffsetDest returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  * @param {number} zOffsetDest
//  */
// export function PanCameraToWithZ(jass, x, y, zOffsetDest) {}

// /**
//  * native PanCameraToTimedWithZ takes real x, real y, real zOffsetDest, real duration returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  * @param {number} zOffsetDest
//  * @param {number} duration
//  */
// export function PanCameraToTimedWithZ(jass, x, y, zOffsetDest, duration) {}

// /**
//  * native SetCinematicCamera takes string cameraModelFile returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {string} cameraModelFile
//  */
// export function SetCinematicCamera(jass, cameraModelFile) {}

// /**
//  * native SetCameraRotateMode takes real x, real y, real radiansToSweep, real duration returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  * @param {number} radiansToSweep
//  * @param {number} duration
//  */
// export function SetCameraRotateMode(jass, x, y, radiansToSweep, duration) {}

// /**
//  * native SetCameraField takes camerafield whichField, real value, real duration returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassCameraField} whichField
//  * @param {number} value
//  * @param {number} duration
//  */
// export function SetCameraField(jass, whichField, value, duration) {}

// /**
//  * native AdjustCameraField takes camerafield whichField, real offset, real duration returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassCameraField} whichField
//  * @param {number} offset
//  * @param {number} duration
//  */
// export function AdjustCameraField(jass, whichField, offset, duration) {}

// /**
//  * native SetCameraTargetController takes unit whichUnit, real xoffset, real yoffset, boolean inheritOrientation returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} xoffset
//  * @param {number} yoffset
//  * @param {boolean} inheritOrientation
//  */
// export function SetCameraTargetController(jass, whichUnit, xoffset, yoffset, inheritOrientation) {}

// /**
//  * native SetCameraOrientController takes unit whichUnit, real xoffset, real yoffset returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} whichUnit
//  * @param {number} xoffset
//  * @param {number} yoffset
//  */
// export function SetCameraOrientController(jass, whichUnit, xoffset, yoffset) {}

/**
 * native CreateCameraSetup takes nothing returns camerasetup
 *
 * @param {JassContext} jass
 * @return {JassCameraSetup}
 */
export function CreateCameraSetup(jass) {
  return jass.addHandle(new JassCameraSetup(jass));
}

/**
 * native CameraSetupSetField takes camerasetup whichSetup, camerafield whichField, real value, real duration returns nothing
 *
 * @param {JassContext} jass
 * @param {JassCameraSetup} whichSetup
 * @param {JassCameraField} whichField
 * @param {number} value
 * @param {number} duration
 */
export function CameraSetupSetField(jass, whichSetup, whichField, value, duration) {
  if (duration > 0) {
    console.warn('CameraSetupSetField: duration not supported');
  }

  if (whichField.value === 0) {
    whichSetup.targetDistance = value;
  } else if (whichField.value === 1) {
    whichSetup.farZ = value;
  } else if (whichField.value === 2) {
    whichSetup.angleOfAttack = value;
  } else if (whichField.value === 3) {
    whichSetup.fieldOfView = value;
  } else if (whichField.value === 4) {
    whichSetup.roll = value;
  } else if (whichField.value === 5) {
    whichSetup.rotation = value;
  } else if (whichField.value === 6) {
    whichSetup.zOffset = value;
  }
}

/**
 * native CameraSetupGetField takes camerasetup whichSetup, camerafield whichField returns real
 *
 * @param {JassContext} jass
 * @param {JassCameraSetup} whichSetup
 * @param {JassCameraField} whichField
 * @return {number}
 */
export function CameraSetupGetField(jass, whichSetup, whichField) {
  if (whichField.value === 0) {
    return whichSetup.targetDistance;
  } else if (whichField.value === 1) {
    return whichSetup.farZ;
  } else if (whichField.value === 2) {
    return whichSetup.angleOfAttack;
  } else if (whichField.value === 3) {
    return whichSetup.fieldOfView;
  } else if (whichField.value === 4) {
    return whichSetup.roll;
  } else if (whichField.value === 5) {
    return whichSetup.rotation;
  } else if (whichField.value === 6) {
    return whichSetup.zOffset;
  }
}

/**
 * native CameraSetupSetDestPosition takes camerasetup whichSetup, real x, real y, real duration returns nothing
 *
 * @param {JassContext} jass
 * @param {JassCameraSetup} whichSetup
 * @param {number} x
 * @param {number} y
 * @param {number} duration
 */
export function CameraSetupSetDestPosition(jass, whichSetup, x, y, duration) {
  if (duration > 0) {
    console.warn('CameraSetupSetDestPosition: duration not supported');
  }

  whichSetup.destPosition.x = x;
  whichSetup.destPosition.y = y;
}

/**
 * native CameraSetupGetDestPositionLoc takes camerasetup whichSetup returns location
 *
 * @param {JassContext} jass
 * @param {JassCameraSetup} whichSetup
 * @return {JassLocation}
 */
export function CameraSetupGetDestPositionLoc(jass, whichSetup) {
  return whichSetup.destPosition;
}

/**
 * native CameraSetupGetDestPositionX takes camerasetup whichSetup returns real
 *
 * @param {JassContext} jass
 * @param {JassCameraSetup} whichSetup
 * @return {number}
 */
export function CameraSetupGetDestPositionX(jass, whichSetup) {
  return whichSetup.destPosition.x;
}

/**
 * native CameraSetupGetDestPositionY takes camerasetup whichSetup returns real
 *
 * @param {JassContext} jass
 * @param {JassCameraSetup} whichSetup
 * @return {number}
 */
export function CameraSetupGetDestPositionY(jass, whichSetup) {
  return whichSetup.destPosition.y;
}

// /**
//  * native CameraSetupApply takes camerasetup whichSetup, boolean doPan, boolean panTimed returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassCameraSetup} whichSetup
//  * @param {boolean} doPan
//  * @param {boolean} panTimed
//  */
// export function CameraSetupApply(jass, whichSetup, doPan, panTimed) {}

// /**
//  * native CameraSetupApplyWithZ takes camerasetup whichSetup, real zDestOffset returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassCameraSetup} whichSetup
//  * @param {number} zDestOffset
//  */
// export function CameraSetupApplyWithZ(jass, whichSetup, zDestOffset) {}

// /**
//  * native CameraSetupApplyForceDuration takes camerasetup whichSetup, boolean doPan, real forceDuration returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassCameraSetup} whichSetup
//  * @param {boolean} doPan
//  * @param {number} forceDuration
//  */
// export function CameraSetupApplyForceDuration(jass, whichSetup, doPan, forceDuration) {}

// /**
//  * native CameraSetupApplyForceDurationWithZ takes camerasetup whichSetup, real zDestOffset, real forceDuration returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassCameraSetup} whichSetup
//  * @param {number} zDestOffset
//  * @param {number} forceDuration
//  */
// export function CameraSetupApplyForceDurationWithZ(jass, whichSetup, zDestOffset, forceDuration) {}

// /**
//  * native CameraSetTargetNoise takes real mag, real velocity returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} mag
//  * @param {number} velocity
//  */
// export function CameraSetTargetNoise(jass, mag, velocity) {}

// /**
//  * native CameraSetSourceNoise takes real mag, real velocity returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} mag
//  * @param {number} velocity
//  */
// export function CameraSetSourceNoise(jass, mag, velocity) {}

// /**
//  * native CameraSetTargetNoiseEx takes real mag, real velocity, boolean vertOnly returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} mag
//  * @param {number} velocity
//  * @param {boolean} vertOnly
//  */
// export function CameraSetTargetNoiseEx(jass, mag, velocity, vertOnly) {}

// /**
//  * native CameraSetSourceNoiseEx takes real mag, real velocity, boolean vertOnly returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} mag
//  * @param {number} velocity
//  * @param {boolean} vertOnly
//  */
// export function CameraSetSourceNoiseEx(jass, mag, velocity, vertOnly) {}

// /**
//  * native CameraSetSmoothingFactor takes real factor returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} factor
//  */
// export function CameraSetSmoothingFactor(jass, factor) {}

// /**
//  * native SetCineFilterTexture takes string filename returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {string} filename
//  */
// export function SetCineFilterTexture(jass, filename) {}

// /**
//  * native SetCineFilterBlendMode takes blendmode whichMode returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassBlendMode} whichMode
//  */
// export function SetCineFilterBlendMode(jass, whichMode) {}

// /**
//  * native SetCineFilterTexMapFlags takes texmapflags whichFlags returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTexMapFlags} whichFlags
//  */
// export function SetCineFilterTexMapFlags(jass, whichFlags) {}

// /**
//  * native SetCineFilterStartUV takes real minu, real minv, real maxu, real maxv returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} minu
//  * @param {number} minv
//  * @param {number} maxu
//  * @param {number} maxv
//  */
// export function SetCineFilterStartUV(jass, minu, minv, maxu, maxv) {}

// /**
//  * native SetCineFilterEndUV takes real minu, real minv, real maxu, real maxv returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} minu
//  * @param {number} minv
//  * @param {number} maxu
//  * @param {number} maxv
//  */
// export function SetCineFilterEndUV(jass, minu, minv, maxu, maxv) {}

// /**
//  * native SetCineFilterStartColor takes integer red, integer green, integer blue, integer alpha returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} red
//  * @param {number} green
//  * @param {number} blue
//  * @param {number} alpha
//  */
// export function SetCineFilterStartColor(jass, red, green, blue, alpha) {}

// /**
//  * native SetCineFilterEndColor takes integer red, integer green, integer blue, integer alpha returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} red
//  * @param {number} green
//  * @param {number} blue
//  * @param {number} alpha
//  */
// export function SetCineFilterEndColor(jass, red, green, blue, alpha) {}

// /**
//  * native SetCineFilterDuration takes real duration returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} duration
//  */
// export function SetCineFilterDuration(jass, duration) {}

// /**
//  * native DisplayCineFilter takes boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {boolean} flag
//  */
// export function DisplayCineFilter(jass, flag) {}

// /**
//  * native IsCineFilterDisplayed takes nothing returns boolean
//  *
//  * @param {JassContext} jass
//  * @return {boolean}
//  */
// export function IsCineFilterDisplayed(jass) {}

// /**
//  * native SetCinematicScene takes integer portraitUnitId, playercolor color, string speakerTitle, string text, real sceneDuration, real voiceoverDuration returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} portraitUnitId
//  * @param {JassPlayerColor} color
//  * @param {string} speakerTitle
//  * @param {string} text
//  * @param {number} sceneDuration
//  * @param {number} voiceoverDuration
//  */
// export function SetCinematicScene(jass, portraitUnitId, color, speakerTitle, text, sceneDuration, voiceoverDuration) {}

// /**
//  * native EndCinematicScene takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function EndCinematicScene(jass) {}

// /**
//  * native ForceCinematicSubtitles takes boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {boolean} flag
//  */
// export function ForceCinematicSubtitles(jass, flag) {}

// /**
//  * native GetCameraMargin takes integer whichMargin returns real
//  *
//  * @param {JassContext} jass
//  * @param {number} whichMargin
//  * @return {number}
//  */
// export function GetCameraMargin(jass, whichMargin) {}

// /**
//  * constant native GetCameraBoundMinX takes nothing returns real
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetCameraBoundMinX(jass) {}

// /**
//  * constant native GetCameraBoundMinY takes nothing returns real
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetCameraBoundMinY(jass) {}

// /**
//  * constant native GetCameraBoundMaxX takes nothing returns real
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetCameraBoundMaxX(jass) {}

// /**
//  * constant native GetCameraBoundMaxY takes nothing returns real
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetCameraBoundMaxY(jass) {}

// /**
//  * constant native GetCameraField takes camerafield whichField returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassCameraField} whichField
//  * @return {number}
//  */
// export function GetCameraField(jass, whichField) {}

// /**
//  * constant native GetCameraTargetPositionX takes nothing returns real
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetCameraTargetPositionX(jass) {}

// /**
//  * constant native GetCameraTargetPositionY takes nothing returns real
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetCameraTargetPositionY(jass) {}

// /**
//  * constant native GetCameraTargetPositionZ takes nothing returns real
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetCameraTargetPositionZ(jass) {}

// /**
//  * constant native GetCameraTargetPositionLoc takes nothing returns location
//  *
//  * @param {JassContext} jass
//  * @return {JassLocation}
//  */
// export function GetCameraTargetPositionLoc(jass) {}

// /**
//  * constant native GetCameraEyePositionX takes nothing returns real
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetCameraEyePositionX(jass) {}

// /**
//  * constant native GetCameraEyePositionY takes nothing returns real
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetCameraEyePositionY(jass) {}

// /**
//  * constant native GetCameraEyePositionZ takes nothing returns real
//  *
//  * @param {JassContext} jass
//  * @return {number}
//  */
// export function GetCameraEyePositionZ(jass) {}

// /**
//  * constant native GetCameraEyePositionLoc takes nothing returns location
//  *
//  * @param {JassContext} jass
//  * @return {JassLocation}
//  */
// export function GetCameraEyePositionLoc(jass) {}

// /**
//  * native NewSoundEnvironment takes string environmentName returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {string} environmentName
//  */
// export function NewSoundEnvironment(jass, environmentName) {}

// /**
//  * native CreateSound takes string fileName, boolean looping, boolean is3D, boolean stopwhenoutofrange, integer fadeInRate, integer fadeOutRate, string eaxSetting returns sound
//  *
//  * @param {JassContext} jass
//  * @param {string} fileName
//  * @param {boolean} looping
//  * @param {boolean} is3D
//  * @param {boolean} stopwhenoutofrange
//  * @param {number} fadeInRate
//  * @param {number} fadeOutRate
//  * @param {string} eaxSetting
//  * @return {JassSound}
//  */
// export function CreateSound(jass, fileName, looping, is3D, stopwhenoutofrange, fadeInRate, fadeOutRate, eaxSetting) {}

// /**
//  * native CreateSoundFilenameWithLabel takes string fileName, boolean looping, boolean is3D, boolean stopwhenoutofrange, integer fadeInRate, integer fadeOutRate, string SLKEntryName returns sound
//  *
//  * @param {JassContext} jass
//  * @param {string} fileName
//  * @param {boolean} looping
//  * @param {boolean} is3D
//  * @param {boolean} stopwhenoutofrange
//  * @param {number} fadeInRate
//  * @param {number} fadeOutRate
//  * @param {string} SLKEntryName
//  * @return {JassSound}
//  */
// export function CreateSoundFilenameWithLabel(jass, fileName, looping, is3D, stopwhenoutofrange, fadeInRate, fadeOutRate, SLKEntryName) {}

// /**
//  * native CreateSoundFromLabel takes string soundLabel, boolean looping, boolean is3D, boolean stopwhenoutofrange, integer fadeInRate, integer fadeOutRate returns sound
//  *
//  * @param {JassContext} jass
//  * @param {string} soundLabel
//  * @param {boolean} looping
//  * @param {boolean} is3D
//  * @param {boolean} stopwhenoutofrange
//  * @param {number} fadeInRate
//  * @param {number} fadeOutRate
//  * @return {JassSound}
//  */
// export function CreateSoundFromLabel(jass, soundLabel, looping, is3D, stopwhenoutofrange, fadeInRate, fadeOutRate) {}

// /**
//  * native CreateMIDISound takes string soundLabel, integer fadeInRate, integer fadeOutRate returns sound
//  *
//  * @param {JassContext} jass
//  * @param {string} soundLabel
//  * @param {number} fadeInRate
//  * @param {number} fadeOutRate
//  * @return {JassSound}
//  */
// export function CreateMIDISound(jass, soundLabel, fadeInRate, fadeOutRate) {}

// /**
//  * native SetSoundParamsFromLabel takes sound soundHandle, string soundLabel returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassSound} soundHandle
//  * @param {string} soundLabel
//  */
// export function SetSoundParamsFromLabel(jass, soundHandle, soundLabel) {}

// /**
//  * native SetSoundDistanceCutoff takes sound soundHandle, real cutoff returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassSound} soundHandle
//  * @param {number} cutoff
//  */
// export function SetSoundDistanceCutoff(jass, soundHandle, cutoff) {}

// /**
//  * native SetSoundChannel takes sound soundHandle, integer channel returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassSound} soundHandle
//  * @param {number} channel
//  */
// export function SetSoundChannel(jass, soundHandle, channel) {}

// /**
//  * native SetSoundVolume takes sound soundHandle, integer volume returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassSound} soundHandle
//  * @param {number} volume
//  */
// export function SetSoundVolume(jass, soundHandle, volume) {}

// /**
//  * native SetSoundPitch takes sound soundHandle, real pitch returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassSound} soundHandle
//  * @param {number} pitch
//  */
// export function SetSoundPitch(jass, soundHandle, pitch) {}

// /**
//  * native SetSoundPlayPosition takes sound soundHandle, integer millisecs returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassSound} soundHandle
//  * @param {number} millisecs
//  */
// export function SetSoundPlayPosition(jass, soundHandle, millisecs) {}

// /**
//  * native SetSoundDistances takes sound soundHandle, real minDist, real maxDist returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassSound} soundHandle
//  * @param {number} minDist
//  * @param {number} maxDist
//  */
// export function SetSoundDistances(jass, soundHandle, minDist, maxDist) {}

// /**
//  * native SetSoundConeAngles takes sound soundHandle, real inside, real outside, integer outsideVolume returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassSound} soundHandle
//  * @param {number} inside
//  * @param {number} outside
//  * @param {number} outsideVolume
//  */
// export function SetSoundConeAngles(jass, soundHandle, inside, outside, outsideVolume) {}

// /**
//  * native SetSoundConeOrientation takes sound soundHandle, real x, real y, real z returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassSound} soundHandle
//  * @param {number} x
//  * @param {number} y
//  * @param {number} z
//  */
// export function SetSoundConeOrientation(jass, soundHandle, x, y, z) {}

// /**
//  * native SetSoundPosition takes sound soundHandle, real x, real y, real z returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassSound} soundHandle
//  * @param {number} x
//  * @param {number} y
//  * @param {number} z
//  */
// export function SetSoundPosition(jass, soundHandle, x, y, z) {}

// /**
//  * native SetSoundVelocity takes sound soundHandle, real x, real y, real z returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassSound} soundHandle
//  * @param {number} x
//  * @param {number} y
//  * @param {number} z
//  */
// export function SetSoundVelocity(jass, soundHandle, x, y, z) {}

// /**
//  * native AttachSoundToUnit takes sound soundHandle, unit whichUnit returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassSound} soundHandle
//  * @param {JassUnit} whichUnit
//  */
// export function AttachSoundToUnit(jass, soundHandle, whichUnit) {}

// /**
//  * native StartSound takes sound soundHandle returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassSound} soundHandle
//  */
// export function StartSound(jass, soundHandle) {}

// /**
//  * native StopSound takes sound soundHandle, boolean killWhenDone, boolean fadeOut returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassSound} soundHandle
//  * @param {boolean} killWhenDone
//  * @param {boolean} fadeOut
//  */
// export function StopSound(jass, soundHandle, killWhenDone, fadeOut) {}

// /**
//  * native KillSoundWhenDone takes sound soundHandle returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassSound} soundHandle
//  */
// export function KillSoundWhenDone(jass, soundHandle) {}

// /**
//  * native SetMapMusic takes string musicName, boolean random, integer index returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {string} musicName
//  * @param {boolean} random
//  * @param {number} index
//  */
// export function SetMapMusic(jass, musicName, random, index) {}

// /**
//  * native ClearMapMusic takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function ClearMapMusic(jass) {}

// /**
//  * native PlayMusic takes string musicName returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {string} musicName
//  */
// export function PlayMusic(jass, musicName) {}

// /**
//  * native PlayMusicEx takes string musicName, integer frommsecs, integer fadeinmsecs returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {string} musicName
//  * @param {number} frommsecs
//  * @param {number} fadeinmsecs
//  */
// export function PlayMusicEx(jass, musicName, frommsecs, fadeinmsecs) {}

// /**
//  * native StopMusic takes boolean fadeOut returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {boolean} fadeOut
//  */
// export function StopMusic(jass, fadeOut) {}

// /**
//  * native ResumeMusic takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function ResumeMusic(jass) {}

// /**
//  * native PlayThematicMusic takes string musicFileName returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {string} musicFileName
//  */
// export function PlayThematicMusic(jass, musicFileName) {}

// /**
//  * native PlayThematicMusicEx takes string musicFileName, integer frommsecs returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {string} musicFileName
//  * @param {number} frommsecs
//  */
// export function PlayThematicMusicEx(jass, musicFileName, frommsecs) {}

// /**
//  * native EndThematicMusic takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function EndThematicMusic(jass) {}

// /**
//  * native SetMusicVolume takes integer volume returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} volume
//  */
// export function SetMusicVolume(jass, volume) {}

// /**
//  * native SetMusicPlayPosition takes integer millisecs returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} millisecs
//  */
// export function SetMusicPlayPosition(jass, millisecs) {}

// /**
//  * native SetThematicMusicPlayPosition takes integer millisecs returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} millisecs
//  */
// export function SetThematicMusicPlayPosition(jass, millisecs) {}

// /**
//  * native SetSoundDuration takes sound soundHandle, integer duration returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassSound} soundHandle
//  * @param {number} duration
//  */
// export function SetSoundDuration(jass, soundHandle, duration) {}

// /**
//  * native GetSoundDuration takes sound soundHandle returns integer
//  *
//  * @param {JassContext} jass
//  * @param {JassSound} soundHandle
//  * @return {number}
//  */
// export function GetSoundDuration(jass, soundHandle) {}

// /**
//  * native GetSoundFileDuration takes string musicFileName returns integer
//  *
//  * @param {JassContext} jass
//  * @param {string} musicFileName
//  * @return {number}
//  */
// export function GetSoundFileDuration(jass, musicFileName) {}

// /**
//  * native VolumeGroupSetVolume takes volumegroup vgroup, real scale returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassVolumeGroup} vgroup
//  * @param {number} scale
//  */
// export function VolumeGroupSetVolume(jass, vgroup, scale) {}

// /**
//  * native VolumeGroupReset takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function VolumeGroupReset(jass) {}

// /**
//  * native GetSoundIsPlaying takes sound soundHandle returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassSound} soundHandle
//  * @return {boolean}
//  */
// export function GetSoundIsPlaying(jass, soundHandle) {}

// /**
//  * native GetSoundIsLoading takes sound soundHandle returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassSound} soundHandle
//  * @return {boolean}
//  */
// export function GetSoundIsLoading(jass, soundHandle) {}

// /**
//  * native RegisterStackedSound takes sound soundHandle, boolean byPosition, real rectwidth, real rectheight returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassSound} soundHandle
//  * @param {boolean} byPosition
//  * @param {number} rectwidth
//  * @param {number} rectheight
//  */
// export function RegisterStackedSound(jass, soundHandle, byPosition, rectwidth, rectheight) {}

// /**
//  * native UnregisterStackedSound takes sound soundHandle, boolean byPosition, real rectwidth, real rectheight returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassSound} soundHandle
//  * @param {boolean} byPosition
//  * @param {number} rectwidth
//  * @param {number} rectheight
//  */
// export function UnregisterStackedSound(jass, soundHandle, byPosition, rectwidth, rectheight) {}

/**
 * native AddWeatherEffect takes rect where, integer effectID returns weathereffect
 *
 * @param {JassContext} jass
 * @param {JassRect} where
 * @param {number} effectID
 * @return {JassWeatherEffect}
 */
export function AddWeatherEffect(jass, where, effectID) {
  return jass.addHandle(new JassWeatherEffect(jass, where, base256ToString(effectID)));
}

/**
 * native RemoveWeatherEffect takes weathereffect whichEffect returns nothing
 *
 * @param {JassContext} jass
 * @param {JassWeatherEffect} whichEffect
 */
export function RemoveWeatherEffect(jass, whichEffect) {
  jass.removeHandle(whichEffect);
}

/**
 * native EnableWeatherEffect takes weathereffect whichEffect, boolean enable returns nothing
 *
 * @param {JassContext} jass
 * @param {JassWeatherEffect} whichEffect
 * @param {boolean} enable
 */
export function EnableWeatherEffect(jass, whichEffect, enable) {
  whichEffect.enabled = enable;
}

// /**
//  * native TerrainDeformCrater takes real x, real y, real radius, real depth, integer duration, boolean permanent returns terraindeformation
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  * @param {number} radius
//  * @param {number} depth
//  * @param {number} duration
//  * @param {boolean} permanent
//  * @return {JassTerrainDeformation}
//  */
// export function TerrainDeformCrater(jass, x, y, radius, depth, duration, permanent) {}

// /**
//  * native TerrainDeformRipple takes real x, real y, real radius, real depth, integer duration, integer count, real spaceWaves, real timeWaves, real radiusStartPct, boolean limitNeg returns terraindeformation
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  * @param {number} radius
//  * @param {number} depth
//  * @param {number} duration
//  * @param {number} count
//  * @param {number} spaceWaves
//  * @param {number} timeWaves
//  * @param {number} radiusStartPct
//  * @param {boolean} limitNeg
//  * @return {JassTerrainDeformation}
//  */
// export function TerrainDeformRipple(jass, x, y, radius, depth, duration, count, spaceWaves, timeWaves, radiusStartPct, limitNeg) {}

// /**
//  * native TerrainDeformWave takes real x, real y, real dirX, real dirY, real distance, real speed, real radius, real depth, integer trailTime, integer count returns terraindeformation
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  * @param {number} dirX
//  * @param {number} dirY
//  * @param {number} distance
//  * @param {number} speed
//  * @param {number} radius
//  * @param {number} depth
//  * @param {number} trailTime
//  * @param {number} count
//  * @return {JassTerrainDeformation}
//  */
// export function TerrainDeformWave(jass, x, y, dirX, dirY, distance, speed, radius, depth, trailTime, count) {}

// /**
//  * native TerrainDeformRandom takes real x, real y, real radius, real minDelta, real maxDelta, integer duration, integer updateInterval returns terraindeformation
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  * @param {number} radius
//  * @param {number} minDelta
//  * @param {number} maxDelta
//  * @param {number} duration
//  * @param {number} updateInterval
//  * @return {JassTerrainDeformation}
//  */
// export function TerrainDeformRandom(jass, x, y, radius, minDelta, maxDelta, duration, updateInterval) {}

// /**
//  * native TerrainDeformStop takes terraindeformation deformation, integer duration returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassTerrainDeformation} deformation
//  * @param {number} duration
//  */
// export function TerrainDeformStop(jass, deformation, duration) {}

// /**
//  * native TerrainDeformStopAll takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function TerrainDeformStopAll(jass) {}

// /**
//  * native AddSpecialEffect takes string modelName, real x, real y returns effect
//  *
//  * @param {JassContext} jass
//  * @param {string} modelName
//  * @param {number} x
//  * @param {number} y
//  * @return {JassEffect}
//  */
// export function AddSpecialEffect(jass, modelName, x, y) {}

// /**
//  * native AddSpecialEffectLoc takes string modelName, location where returns effect
//  *
//  * @param {JassContext} jass
//  * @param {string} modelName
//  * @param {JassLocation} where
//  * @return {JassEffect}
//  */
// export function AddSpecialEffectLoc(jass, modelName, where) {}

// /**
//  * native AddSpecialEffectTarget takes string modelName, widget targetWidget, string attachPointName returns effect
//  *
//  * @param {JassContext} jass
//  * @param {string} modelName
//  * @param {JassWidget} targetWidget
//  * @param {string} attachPointName
//  * @return {JassEffect}
//  */
// export function AddSpecialEffectTarget(jass, modelName, targetWidget, attachPointName) {}

// /**
//  * native DestroyEffect takes effect whichEffect returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassEffect} whichEffect
//  */
// export function DestroyEffect(jass, whichEffect) {}

// /**
//  * native AddSpellEffect takes string abilityString, effecttype t, real x, real y returns effect
//  *
//  * @param {JassContext} jass
//  * @param {string} abilityString
//  * @param {JassEffectType} t
//  * @param {number} x
//  * @param {number} y
//  * @return {JassEffect}
//  */
// export function AddSpellEffect(jass, abilityString, t, x, y) {}

// /**
//  * native AddSpellEffectLoc takes string abilityString, effecttype t, location where returns effect
//  *
//  * @param {JassContext} jass
//  * @param {string} abilityString
//  * @param {JassEffectType} t
//  * @param {JassLocation} where
//  * @return {JassEffect}
//  */
// export function AddSpellEffectLoc(jass, abilityString, t, where) {}

// /**
//  * native AddSpellEffectById takes integer abilityId, effecttype t, real x, real y returns effect
//  *
//  * @param {JassContext} jass
//  * @param {number} abilityId
//  * @param {JassEffectType} t
//  * @param {number} x
//  * @param {number} y
//  * @return {JassEffect}
//  */
// export function AddSpellEffectById(jass, abilityId, t, x, y) {}

// /**
//  * native AddSpellEffectByIdLoc takes integer abilityId, effecttype t, location where returns effect
//  *
//  * @param {JassContext} jass
//  * @param {number} abilityId
//  * @param {JassEffectType} t
//  * @param {JassLocation} where
//  * @return {JassEffect}
//  */
// export function AddSpellEffectByIdLoc(jass, abilityId, t, where) {}

// /**
//  * native AddSpellEffectTarget takes string modelName, effecttype t, widget targetWidget, string attachPoint returns effect
//  *
//  * @param {JassContext} jass
//  * @param {string} modelName
//  * @param {JassEffectType} t
//  * @param {JassWidget} targetWidget
//  * @param {string} attachPoint
//  * @return {JassEffect}
//  */
// export function AddSpellEffectTarget(jass, modelName, t, targetWidget, attachPoint) {}

// /**
//  * native AddSpellEffectTargetById takes integer abilityId, effecttype t, widget targetWidget, string attachPoint returns effect
//  *
//  * @param {JassContext} jass
//  * @param {number} abilityId
//  * @param {JassEffectType} t
//  * @param {JassWidget} targetWidget
//  * @param {string} attachPoint
//  * @return {JassEffect}
//  */
// export function AddSpellEffectTargetById(jass, abilityId, t, targetWidget, attachPoint) {}

// /**
//  * native AddLightning takes string codeName, boolean checkVisibility, real x1, real y1, real x2, real y2 returns lightning
//  *
//  * @param {JassContext} jass
//  * @param {string} codeName
//  * @param {boolean} checkVisibility
//  * @param {number} x1
//  * @param {number} y1
//  * @param {number} x2
//  * @param {number} y2
//  * @return {JassLightning}
//  */
// export function AddLightning(jass, codeName, checkVisibility, x1, y1, x2, y2) {}

// /**
//  * native AddLightningEx takes string codeName, boolean checkVisibility, real x1, real y1, real z1, real x2, real y2, real z2 returns lightning
//  *
//  * @param {JassContext} jass
//  * @param {string} codeName
//  * @param {boolean} checkVisibility
//  * @param {number} x1
//  * @param {number} y1
//  * @param {number} z1
//  * @param {number} x2
//  * @param {number} y2
//  * @param {number} z2
//  * @return {JassLightning}
//  */
// export function AddLightningEx(jass, codeName, checkVisibility, x1, y1, z1, x2, y2, z2) {}

// /**
//  * native DestroyLightning takes lightning whichBolt returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassLightning} whichBolt
//  * @return {boolean}
//  */
// export function DestroyLightning(jass, whichBolt) {}

// /**
//  * native MoveLightning takes lightning whichBolt, boolean checkVisibility, real x1, real y1, real x2, real y2 returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassLightning} whichBolt
//  * @param {boolean} checkVisibility
//  * @param {number} x1
//  * @param {number} y1
//  * @param {number} x2
//  * @param {number} y2
//  * @return {boolean}
//  */
// export function MoveLightning(jass, whichBolt, checkVisibility, x1, y1, x2, y2) {}

// /**
//  * native MoveLightningEx takes lightning whichBolt, boolean checkVisibility, real x1, real y1, real z1, real x2, real y2, real z2 returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassLightning} whichBolt
//  * @param {boolean} checkVisibility
//  * @param {number} x1
//  * @param {number} y1
//  * @param {number} z1
//  * @param {number} x2
//  * @param {number} y2
//  * @param {number} z2
//  * @return {boolean}
//  */
// export function MoveLightningEx(jass, whichBolt, checkVisibility, x1, y1, z1, x2, y2, z2) {}

// /**
//  * native GetLightningColorA takes lightning whichBolt returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassLightning} whichBolt
//  * @return {number}
//  */
// export function GetLightningColorA(jass, whichBolt) {}

// /**
//  * native GetLightningColorR takes lightning whichBolt returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassLightning} whichBolt
//  * @return {number}
//  */
// export function GetLightningColorR(jass, whichBolt) {}

// /**
//  * native GetLightningColorG takes lightning whichBolt returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassLightning} whichBolt
//  * @return {number}
//  */
// export function GetLightningColorG(jass, whichBolt) {}

// /**
//  * native GetLightningColorB takes lightning whichBolt returns real
//  *
//  * @param {JassContext} jass
//  * @param {JassLightning} whichBolt
//  * @return {number}
//  */
// export function GetLightningColorB(jass, whichBolt) {}

// /**
//  * native SetLightningColor takes lightning whichBolt, real r, real g, real b, real a returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {JassLightning} whichBolt
//  * @param {number} r
//  * @param {number} g
//  * @param {number} b
//  * @param {number} a
//  * @return {boolean}
//  */
// export function SetLightningColor(jass, whichBolt, r, g, b, a) {}

// /**
//  * native GetAbilityEffect takes string abilityString, effecttype t, integer index returns string
//  *
//  * @param {JassContext} jass
//  * @param {string} abilityString
//  * @param {JassEffectType} t
//  * @param {number} index
//  * @return {string}
//  */
// export function GetAbilityEffect(jass, abilityString, t, index) {}

// /**
//  * native GetAbilityEffectById takes integer abilityId, effecttype t, integer index returns string
//  *
//  * @param {JassContext} jass
//  * @param {number} abilityId
//  * @param {JassEffectType} t
//  * @param {number} index
//  * @return {string}
//  */
// export function GetAbilityEffectById(jass, abilityId, t, index) {}

// /**
//  * native GetAbilitySound takes string abilityString, soundtype t returns string
//  *
//  * @param {JassContext} jass
//  * @param {string} abilityString
//  * @param {JassSoundType} t
//  * @return {string}
//  */
// export function GetAbilitySound(jass, abilityString, t) {}

// /**
//  * native GetAbilitySoundById takes integer abilityId, soundtype t returns string
//  *
//  * @param {JassContext} jass
//  * @param {number} abilityId
//  * @param {JassSoundType} t
//  * @return {string}
//  */
// export function GetAbilitySoundById(jass, abilityId, t) {}

// /**
//  * native GetTerrainCliffLevel takes real x, real y returns integer
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  * @return {number}
//  */
// export function GetTerrainCliffLevel(jass, x, y) {}

// /**
//  * native SetWaterBaseColor takes integer red, integer green, integer blue, integer alpha returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} red
//  * @param {number} green
//  * @param {number} blue
//  * @param {number} alpha
//  */
// export function SetWaterBaseColor(jass, red, green, blue, alpha) {}

// /**
//  * native SetWaterDeforms takes boolean val returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {boolean} val
//  */
// export function SetWaterDeforms(jass, val) {}

// /**
//  * native GetTerrainType takes real x, real y returns integer
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  * @return {number}
//  */
// export function GetTerrainType(jass, x, y) {}

// /**
//  * native GetTerrainVariance takes real x, real y returns integer
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  * @return {number}
//  */
// export function GetTerrainVariance(jass, x, y) {}

// /**
//  * native SetTerrainType takes real x, real y, integer terrainType, integer variation, integer area, integer shape returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  * @param {number} terrainType
//  * @param {number} variation
//  * @param {number} area
//  * @param {number} shape
//  */
// export function SetTerrainType(jass, x, y, terrainType, variation, area, shape) {}

// /**
//  * native IsTerrainPathable takes real x, real y, pathingtype t returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  * @param {JassPathingType} t
//  * @return {boolean}
//  */
// export function IsTerrainPathable(jass, x, y, t) {}

// /**
//  * native SetTerrainPathable takes real x, real y, pathingtype t, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  * @param {JassPathingType} t
//  * @param {boolean} flag
//  */
// export function SetTerrainPathable(jass, x, y, t, flag) {}

// /**
//  * native CreateImage takes string file, real sizeX, real sizeY, real sizeZ, real posX, real posY, real posZ, real originX, real originY, real originZ, integer imageType returns image
//  *
//  * @param {JassContext} jass
//  * @param {string} file
//  * @param {number} sizeX
//  * @param {number} sizeY
//  * @param {number} sizeZ
//  * @param {number} posX
//  * @param {number} posY
//  * @param {number} posZ
//  * @param {number} originX
//  * @param {number} originY
//  * @param {number} originZ
//  * @param {number} imageType
//  * @return {JassImage}
//  */
// export function CreateImage(jass, file, sizeX, sizeY, sizeZ, posX, posY, posZ, originX, originY, originZ, imageType) {}

// /**
//  * native DestroyImage takes image whichImage returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassImage} whichImage
//  */
// export function DestroyImage(jass, whichImage) {}

// /**
//  * native ShowImage takes image whichImage, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassImage} whichImage
//  * @param {boolean} flag
//  */
// export function ShowImage(jass, whichImage, flag) {}

// /**
//  * native SetImageConstantHeight takes image whichImage, boolean flag, real height returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassImage} whichImage
//  * @param {boolean} flag
//  * @param {number} height
//  */
// export function SetImageConstantHeight(jass, whichImage, flag, height) {}

// /**
//  * native SetImagePosition takes image whichImage, real x, real y, real z returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassImage} whichImage
//  * @param {number} x
//  * @param {number} y
//  * @param {number} z
//  */
// export function SetImagePosition(jass, whichImage, x, y, z) {}

// /**
//  * native SetImageColor takes image whichImage, integer red, integer green, integer blue, integer alpha returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassImage} whichImage
//  * @param {number} red
//  * @param {number} green
//  * @param {number} blue
//  * @param {number} alpha
//  */
// export function SetImageColor(jass, whichImage, red, green, blue, alpha) {}

// /**
//  * native SetImageRender takes image whichImage, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassImage} whichImage
//  * @param {boolean} flag
//  */
// export function SetImageRender(jass, whichImage, flag) {}

// /**
//  * native SetImageRenderAlways takes image whichImage, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassImage} whichImage
//  * @param {boolean} flag
//  */
// export function SetImageRenderAlways(jass, whichImage, flag) {}

// /**
//  * native SetImageAboveWater takes image whichImage, boolean flag, boolean useWaterAlpha returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassImage} whichImage
//  * @param {boolean} flag
//  * @param {boolean} useWaterAlpha
//  */
// export function SetImageAboveWater(jass, whichImage, flag, useWaterAlpha) {}

// /**
//  * native SetImageType takes image whichImage, integer imageType returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassImage} whichImage
//  * @param {number} imageType
//  */
// export function SetImageType(jass, whichImage, imageType) {}

// /**
//  * native CreateUbersplat takes real x, real y, string name, integer red, integer green, integer blue, integer alpha, boolean forcePaused, boolean noBirthTime returns ubersplat
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  * @param {string} name
//  * @param {number} red
//  * @param {number} green
//  * @param {number} blue
//  * @param {number} alpha
//  * @param {boolean} forcePaused
//  * @param {boolean} noBirthTime
//  * @return {JassUberSplat}
//  */
// export function CreateUbersplat(jass, x, y, name, red, green, blue, alpha, forcePaused, noBirthTime) {}

// /**
//  * native DestroyUbersplat takes ubersplat whichSplat returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUberSplat} whichSplat
//  */
// export function DestroyUbersplat(jass, whichSplat) {}

// /**
//  * native ResetUbersplat takes ubersplat whichSplat returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUberSplat} whichSplat
//  */
// export function ResetUbersplat(jass, whichSplat) {}

// /**
//  * native FinishUbersplat takes ubersplat whichSplat returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUberSplat} whichSplat
//  */
// export function FinishUbersplat(jass, whichSplat) {}

// /**
//  * native ShowUbersplat takes ubersplat whichSplat, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUberSplat} whichSplat
//  * @param {boolean} flag
//  */
// export function ShowUbersplat(jass, whichSplat, flag) {}

// /**
//  * native SetUbersplatRender takes ubersplat whichSplat, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUberSplat} whichSplat
//  * @param {boolean} flag
//  */
// export function SetUbersplatRender(jass, whichSplat, flag) {}

// /**
//  * native SetUbersplatRenderAlways takes ubersplat whichSplat, boolean flag returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUberSplat} whichSplat
//  * @param {boolean} flag
//  */
// export function SetUbersplatRenderAlways(jass, whichSplat, flag) {}

// /**
//  * native SetBlight takes player whichPlayer, real x, real y, real radius, boolean addBlight returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {number} x
//  * @param {number} y
//  * @param {number} radius
//  * @param {boolean} addBlight
//  */
// export function SetBlight(jass, whichPlayer, x, y, radius, addBlight) {}

// /**
//  * native SetBlightRect takes player whichPlayer, rect r, boolean addBlight returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {JassRect} r
//  * @param {boolean} addBlight
//  */
// export function SetBlightRect(jass, whichPlayer, r, addBlight) {}

// /**
//  * native SetBlightPoint takes player whichPlayer, real x, real y, boolean addBlight returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {number} x
//  * @param {number} y
//  * @param {boolean} addBlight
//  */
// export function SetBlightPoint(jass, whichPlayer, x, y, addBlight) {}

// /**
//  * native SetBlightLoc takes player whichPlayer, location whichLocation, real radius, boolean addBlight returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} whichPlayer
//  * @param {JassLocation} whichLocation
//  * @param {number} radius
//  * @param {boolean} addBlight
//  */
// export function SetBlightLoc(jass, whichPlayer, whichLocation, radius, addBlight) {}

// /**
//  * native CreateBlightedGoldmine takes player id, real x, real y, real face returns unit
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} id
//  * @param {number} x
//  * @param {number} y
//  * @param {number} face
//  * @return {JassUnit}
//  */
// export function CreateBlightedGoldmine(jass, id, x, y, face) {}

// /**
//  * native IsPointBlighted takes real x, real y returns boolean
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  * @return {boolean}
//  */
// export function IsPointBlighted(jass, x, y) {}

// /**
//  * native SetDoodadAnimation takes real x, real y, real radius, integer doodadID, boolean nearestOnly, string animName, boolean animRandom returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} x
//  * @param {number} y
//  * @param {number} radius
//  * @param {number} doodadID
//  * @param {boolean} nearestOnly
//  * @param {string} animName
//  * @param {boolean} animRandom
//  */
// export function SetDoodadAnimation(jass, x, y, radius, doodadID, nearestOnly, animName, animRandom) {}

// /**
//  * native SetDoodadAnimationRect takes rect r, integer doodadID, string animName, boolean animRandom returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassRect} r
//  * @param {number} doodadID
//  * @param {string} animName
//  * @param {boolean} animRandom
//  */
// export function SetDoodadAnimationRect(jass, r, doodadID, animName, animRandom) {}

// /**
//  * native StartMeleeAI takes player num, string script returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} num
//  * @param {string} script
//  */
// export function StartMeleeAI(jass, num, script) {}

// /**
//  * native StartCampaignAI takes player num, string script returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} num
//  * @param {string} script
//  */
// export function StartCampaignAI(jass, num, script) {}

// /**
//  * native CommandAI takes player num, integer command, integer data returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} num
//  * @param {number} command
//  * @param {number} data
//  */
// export function CommandAI(jass, num, command, data) {}

// /**
//  * native PauseCompAI takes player p, boolean pause returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} p
//  * @param {boolean} pause
//  */
// export function PauseCompAI(jass, p, pause) {}

// /**
//  * native GetAIDifficulty takes player num returns aidifficulty
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} num
//  * @return {JassAiDifficulty}
//  */
// export function GetAIDifficulty(jass, num) {}

// /**
//  * native RemoveGuardPosition takes unit hUnit returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} hUnit
//  */
// export function RemoveGuardPosition(jass, hUnit) {}

// /**
//  * native RecycleGuardPosition takes unit hUnit returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassUnit} hUnit
//  */
// export function RecycleGuardPosition(jass, hUnit) {}

// /**
//  * native RemoveAllGuardPositions takes player num returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {JassPlayer} num
//  */
// export function RemoveAllGuardPositions(jass, num) {}

// /**
//  * native Cheat takes string cheatStr returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {string} cheatStr
//  */
// export function Cheat(jass, cheatStr) {}

// /**
//  * native IsNoVictoryCheat takes nothing returns boolean
//  *
//  * @param {JassContext} jass
//  * @return {boolean}
//  */
// export function IsNoVictoryCheat(jass) {}

// /**
//  * native IsNoDefeatCheat takes nothing returns boolean
//  *
//  * @param {JassContext} jass
//  * @return {boolean}
//  */
// export function IsNoDefeatCheat(jass) {}

// /**
//  * native Preload takes string filename returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {string} filename
//  */
// export function Preload(jass, filename) {}

// /**
//  * native PreloadEnd takes real timeout returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {number} timeout
//  */
// export function PreloadEnd(jass, timeout) {}

// /**
//  * native PreloadStart takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function PreloadStart(jass) {}

// /**
//  * native PreloadRefresh takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function PreloadRefresh(jass) {}

// /**
//  * native PreloadEndEx takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function PreloadEndEx(jass) {}

// /**
//  * native PreloadGenClear takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function PreloadGenClear(jass) {}

// /**
//  * native PreloadGenStart takes nothing returns nothing
//  *
//  * @param {JassContext} jass
//  */
// export function PreloadGenStart(jass) {}

// /**
//  * native PreloadGenEnd takes string filename returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {string} filename
//  */
// export function PreloadGenEnd(jass, filename) {}

// /**
//  * native Preloader takes string filename returns nothing
//  *
//  * @param {JassContext} jass
//  * @param {string} filename
//  */
// export function Preloader(jass, filename) {}
