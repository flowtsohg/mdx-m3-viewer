import {lua_register, lua_pushinteger, lua_pushnumber, lua_pushstring, lua_pushlightuserdata, lua_touserdata, lua_pushboolean, lua_toboolean, LUA_REGISTRYINDEX, lua_yield, lua_pcall, lua_rawgeti} from 'fengari/src/lua';
import {luaL_checkstring, luaL_checkinteger, luaL_checknumber, luaL_ref, luaL_unref} from 'fengari/src/lauxlib';
import {JassTimer, JassGroup, JassLocation, JassForce, JassUnit, JassTrigger} from './types';

/**
 * constant native ConvertRace takes integer i returns race
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertRace(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.races[i]);

  return 1;
}

/**
 * constant native ConvertAllianceType takes integer i returns alliancetype
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertAllianceType(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.allianceTypes[i]);

  return 1;
}

/**
 * constant native ConvertRacePref takes integer i returns racepreference
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertRacePref(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.racePrefs[i]);

  return 1;
}

/**
 * constant native ConvertIGameState takes integer i returns igamestate
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertIGameState(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.gameStates[i]);

  return 1;
}

/**
 * constant native ConvertFGameState takes integer i returns fgamestate
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertFGameState(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.gameStates[i]);

  return 1;
}

/**
 * constant native ConvertPlayerState takes integer i returns playerstate
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertPlayerState(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.playerStates[i]);

  return 1;
}

/**
 * constant native ConvertPlayerScore takes integer i returns playerscore
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertPlayerScore(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.playerScores[i]);

  return 1;
}

/**
 * constant native ConvertPlayerGameResult takes integer i returns playergameresult
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertPlayerGameResult(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.playerGameResults[i]);

  return 1;
}

/**
 * constant native ConvertUnitState takes integer i returns unitstate
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertUnitState(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.unitStates[i]);

  return 1;
}

/**
 * constant native ConvertAIDifficulty takes integer i returns aidifficulty
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertAIDifficulty(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.aiDifficulties[i]);

  return 1;
}

/**
 * constant native ConvertGameEvent takes integer i returns gameevent
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertGameEvent(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.events[i]);

  return 1;
}

/**
 * constant native ConvertPlayerEvent takes integer i returns playerevent
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertPlayerEvent(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.events[i]);

  return 1;
}

/**
 * constant native ConvertPlayerUnitEvent takes integer i returns playerunitevent
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertPlayerUnitEvent(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.events[i]);

  return 1;
}

/**
 * constant native ConvertWidgetEvent takes integer i returns widgetevent
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertWidgetEvent(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.events[i]);

  return 1;
}

/**
 * constant native ConvertDialogEvent takes integer i returns dialogevent
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertDialogEvent(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.events[i]);

  return 1;
}

/**
 * constant native ConvertUnitEvent takes integer i returns unitevent
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertUnitEvent(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.events[i]);

  return 1;
}

/**
 * constant native ConvertLimitOp takes integer i returns limitop
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertLimitOp(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.limitOps[i]);

  return 1;
}

/**
 * constant native ConvertUnitType takes integer i returns unittype
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertUnitType(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.unitTypes[i]);

  return 1;
}

/**
 * constant native ConvertGameSpeed takes integer i returns gamespeed
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertGameSpeed(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.gameSpeeds[i]);

  return 1;
}

/**
 * constant native ConvertPlacement takes integer i returns placement
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertPlacement(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.placements[i]);

  return 1;
}

/**
 * constant native ConvertStartLocPrio takes integer i returns startlocprio
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertStartLocPrio(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.startLocPrios[i]);

  return 1;
}

/**
 * constant native ConvertGameDifficulty takes integer i returns gamedifficulty
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertGameDifficulty(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.gameDifficulties[i]);

  return 1;
}

/**
 * constant native ConvertGameType takes integer i returns gametype
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertGameType(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.gameTypes[i]);

  return 1;
}

/**
 * constant native ConvertMapFlag takes integer i returns mapflag
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertMapFlag(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.mapFlags[i]);

  return 1;
}

/**
 * constant native ConvertMapVisibility takes integer i returns mapvisibility
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertMapVisibility(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.mapVisibilities[i]);

  return 1;
}

/**
 * constant native ConvertMapSetting takes integer i returns mapsetting
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertMapSetting(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.mapSettings[i]);

  return 1;
}

/**
 * constant native ConvertMapDensity takes integer i returns mapdensity
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertMapDensity(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.mapDensities[i]);

  return 1;
}

/**
 * constant native ConvertMapControl takes integer i returns mapcontrol
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertMapControl(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.mapControls[i]);

  return 1;
}

/**
 * constant native ConvertPlayerColor takes integer i returns playercolor
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertPlayerColor(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.playerColors[i]);

  return 1;
}

/**
 * constant native ConvertPlayerSlotState takes integer i returns playerslotstate
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertPlayerSlotState(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.playerSlotStates[i]);

  return 1;
}

/**
 * constant native ConvertVolumeGroup takes integer i returns volumegroup
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertVolumeGroup(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.volumeGroups[i]);

  return 1;
}

/**
 * constant native ConvertCameraField takes integer i returns camerafield
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertCameraField(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.cameraFields[i]);

  return 1;
}

/**
 * constant native ConvertBlendMode takes integer i returns blendmode
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertBlendMode(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.blendModes[i]);

  return 1;
}

/**
 * constant native ConvertRarityControl takes integer i returns raritycontrol
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertRarityControl(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.rarityControls[i]);

  return 1;
}

/**
 * constant native ConvertTexMapFlags takes integer i returns texmapflags
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertTexMapFlags(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.texMapFlags[i]);

  return 1;
}

/**
 * constant native ConvertFogState takes integer i returns fogstate
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertFogState(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.fogStates[i]);

  return 1;
}

/**
 * constant native ConvertEffectType takes integer i returns effecttype
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertEffectType(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.effectTypes[i]);

  return 1;
}

/**
 * constant native ConvertVersion takes integer i returns version
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertVersion(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.versions[i]);

  return 1;
}

/**
 * constant native ConvertItemType takes integer i returns itemtype
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertItemType(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.itemTypes[i]);

  return 1;
}

/**
 * constant native ConvertAttackType takes integer i returns attacktype
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertAttackType(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.attackTypes[i]);

  return 1;
}

/**
 * constant native ConvertDamageType takes integer i returns damagetype
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertDamageType(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.damageTypes[i]);

  return 1;
}

/**
 * constant native ConvertWeaponType takes integer i returns weapontype
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertWeaponType(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.weaponTypes[i]);

  return 1;
}

/**
 * constant native ConvertSoundType takes integer i returns soundtype
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertSoundType(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.soundTypes[i]);

  return 1;
}

/**
 * constant native ConvertPathingType takes integer i returns pathingtype
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertPathingType(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.pathingTypes[i]);

  return 1;
}

/**
 * constant native ConvertMouseButtonType takes integer i returns mousebuttontype
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ConvertMouseButtonType(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.constantHandles.mouseButtonTypes[i]);

  return 1;
}

/**
 * constant native OrderId takes string orderIdString returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function OrderId(L) {
  let orderIdString = luaL_checkstring(L, 1);
  console.warn('OrderId was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * constant native OrderId2String takes integer orderId returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function OrderId2String(L) {
  let orderId = luaL_checkinteger(L, 1);
  console.warn('OrderId2String was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * constant native UnitId takes string unitIdString returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitId(L) {
  let unitIdString = luaL_checkstring(L, 1);
  console.warn('UnitId was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * constant native UnitId2String takes integer unitId returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitId2String(L) {
  let unitId = luaL_checkinteger(L, 1);
  console.warn('UnitId2String was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * constant native AbilityId takes string abilityIdString returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AbilityId(L) {
  let abilityIdString = luaL_checkstring(L, 1);
  console.warn('AbilityId was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * constant native AbilityId2String takes integer abilityId returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AbilityId2String(L) {
  let abilityId = luaL_checkinteger(L, 1);
  console.warn('AbilityId2String was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * constant native GetObjectName takes integer objectId returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetObjectName(L) {
  let objectId = luaL_checkinteger(L, 1);
  console.warn('GetObjectName was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * constant native GetBJMaxPlayers takes nothing returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetBJMaxPlayers(L) {
  lua_pushinteger(L, 28);

  return 1;
}

/**
 * constant native GetBJPlayerNeutralVictim takes nothing returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetBJPlayerNeutralVictim(L) {
  lua_pushinteger(L, 24);

  return 1;
}

/**
 * constant native GetBJPlayerNeutralExtra takes nothing returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetBJPlayerNeutralExtra(L) {
  lua_pushinteger(L, 25);

  return 1;
}

/**
 * constant native GetBJMaxPlayerSlots takes nothing returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetBJMaxPlayerSlots(L) {
  lua_pushinteger(L, 24);

  return 1;
}

/**
 * constant native GetPlayerNeutralPassive takes nothing returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetPlayerNeutralPassive(L) {
  lua_pushinteger(L, 26);

  return 1;
}

/**
 * constant native GetPlayerNeutralAggressive takes nothing returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetPlayerNeutralAggressive(L) {
  lua_pushinteger(L, 27);

  return 1;
}

/**
 * native Deg2Rad takes real degrees returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function Deg2Rad(L) {
  let degrees = luaL_checknumber(L, 1);

  lua_pushnumber(L, degrees * (Math.PI / 180));

  return 1;
}

/**
 * native Rad2Deg takes real radians returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function Rad2Deg(L) {
  let radians = luaL_checknumber(L, 1);

  lua_pushnumber(L, radians * (180 / Math.PI));

  return 1;
}

/**
 * native Sin takes real radians returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function Sin(L) {
  let radians = luaL_checknumber(L, 1);

  lua_pushnumber(L, Math.sin(radians));

  return 1;
}

/**
 * native Cos takes real radians returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function Cos(L) {
  let radians = luaL_checknumber(L, 1);

  lua_pushnumber(L, Math.cos(radians));

  return 1;
}

/**
 * native Tan takes real radians returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function Tan(L) {
  let radians = luaL_checknumber(L, 1);

  lua_pushnumber(L, Math.tan(radians));

  return 1;
}

/**
 * native Asin takes real y returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function Asin(L) {
  let y = luaL_checknumber(L, 1);

  lua_pushnumber(L, Math.asin(y));

  return 1;
}

/**
 * native Acos takes real x returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function Acos(L) {
  let x = luaL_checknumber(L, 1);

  lua_pushnumber(L, Math.acos(x));

  return 1;
}

/**
 * native Atan takes real x returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function Atan(L) {
  let x = luaL_checknumber(L, 1);

  lua_pushnumber(L, Math.atan(x));

  return 1;
}

/**
 * native Atan2 takes real y, real x returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function Atan2(L) {
  let y = luaL_checknumber(L, 1);
  let x = luaL_checknumber(L, 2);

  lua_pushnumber(L, Math.atan2(y, x));

  return 1;
}

/**
 * native SquareRoot takes real x returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SquareRoot(L) {
  let x = luaL_checknumber(L, 1);

  lua_pushnumber(L, Math.sqrt(x));

  return 1;
}

/**
 * native Pow takes real x, real power returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function Pow(L) {
  let x = luaL_checknumber(L, 1);
  let power = luaL_checknumber(L, 2);

  lua_pushnumber(L, Math.pow(x, power));

  return 1;
}

/**
 * native I2R takes integer i returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function I2R(L) {
  let i = luaL_checkinteger(L, 1);

  lua_pushnumber(L, i);

  return 1;
}

/**
 * native R2I takes real r returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function R2I(L) {
  let r = luaL_checknumber(L, 1);

  lua_pushinteger(L, r | 0);

  return 1;
}

/**
 * native I2S takes integer i returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function I2S(L) {
  let i = luaL_checkinteger(L, 1);
  console.warn('I2S was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native R2S takes real r returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function R2S(L) {
  let r = luaL_checknumber(L, 1);
  console.warn('R2S was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native R2SW takes real r, integer width, integer precision returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function R2SW(L) {
  let r = luaL_checknumber(L, 1);
  let width = luaL_checkinteger(L, 2);
  let precision = luaL_checkinteger(L, 3);
  console.warn('R2SW was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native S2I takes string s returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function S2I(L) {
  let s = luaL_checkstring(L, 1);
  console.warn('S2I was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native S2R takes string s returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function S2R(L) {
  let s = luaL_checkstring(L, 1);
  console.warn('S2R was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native GetHandleId takes handle h returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetHandleId(L) {
  let h = lua_touserdata(L, 1);

  lua_pushinteger(L, h.handleId);

  return 1;
}

/**
 * native SubString takes string source, integer start, integer end_ returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SubString(L) {
  let source = luaL_checkstring(L, 1);
  let start = luaL_checkinteger(L, 2);
  let end_ = luaL_checkinteger(L, 3);
  console.warn('SubString was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native StringLength takes string s returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function StringLength(L) {
  let s = luaL_checkstring(L, 1);
  console.warn('StringLength was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native StringCase takes string source, boolean upper returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function StringCase(L) {
  let source = luaL_checkstring(L, 1);
  let upper = lua_toboolean(L, 2);
  console.warn('StringCase was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native StringHash takes string s returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function StringHash(L) {
  let s = luaL_checkstring(L, 1);
  console.warn('StringHash was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native GetLocalizedString takes string source returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetLocalizedString(L) {
  let source = luaL_checkstring(L, 1);
  console.warn('GetLocalizedString was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native GetLocalizedHotkey takes string source returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetLocalizedHotkey(L) {
  let source = luaL_checkstring(L, 1);
  console.warn('GetLocalizedHotkey was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native SetMapName takes string name returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetMapName(L) {
  let name = luaL_checkstring(L, 1);
  console.warn('SetMapName was called but is not implemented :(');
  return 0
}

/**
 * native SetMapDescription takes string description returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetMapDescription(L) {
  let description = luaL_checkstring(L, 1);
  console.warn('SetMapDescription was called but is not implemented :(');
  return 0
}

/**
 * native SetTeams takes integer teamcount returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetTeams(L) {
  let teamcount = luaL_checkinteger(L, 1);
  console.warn('SetTeams was called but is not implemented :(');
  return 0
}

/**
 * native SetPlayers takes integer playercount returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetPlayers(L) {
  let playercount = luaL_checkinteger(L, 1);
  console.warn('SetPlayers was called but is not implemented :(');
  return 0
}

/**
 * native DefineStartLocation takes integer whichStartLoc, real x, real y returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DefineStartLocation(L) {
  let whichStartLoc = luaL_checkinteger(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);

  this.startLocations[whichStartLoc] = this.addHandle(new JassLocation(x, y));

  return 0
}

/**
 * native DefineStartLocationLoc takes integer whichStartLoc, location whichLocation returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DefineStartLocationLoc(L) {
  let whichStartLoc = luaL_checkinteger(L, 1);
  let whichLocation = lua_touserdata(L, 2);
  console.warn('DefineStartLocationLoc was called but is not implemented :(');
  return 0
}

/**
 * native SetStartLocPrioCount takes integer whichStartLoc, integer prioSlotCount returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetStartLocPrioCount(L) {
  let whichStartLoc = luaL_checkinteger(L, 1);
  let prioSlotCount = luaL_checkinteger(L, 2);
  console.warn('SetStartLocPrioCount was called but is not implemented :(');
  return 0
}

/**
 * native SetStartLocPrio takes integer whichStartLoc, integer prioSlotIndex, integer otherStartLocIndex, startlocprio priority returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetStartLocPrio(L) {
  let whichStartLoc = luaL_checkinteger(L, 1);
  let prioSlotIndex = luaL_checkinteger(L, 2);
  let otherStartLocIndex = luaL_checkinteger(L, 3);
  let priority = lua_touserdata(L, 4);
  console.warn('SetStartLocPrio was called but is not implemented :(');
  return 0
}

/**
 * native GetStartLocPrioSlot takes integer whichStartLoc, integer prioSlotIndex returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetStartLocPrioSlot(L) {
  let whichStartLoc = luaL_checkinteger(L, 1);
  let prioSlotIndex = luaL_checkinteger(L, 2);
  console.warn('GetStartLocPrioSlot was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native GetStartLocPrio takes integer whichStartLoc, integer prioSlotIndex returns startlocprio
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetStartLocPrio(L) {
  let whichStartLoc = luaL_checkinteger(L, 1);
  let prioSlotIndex = luaL_checkinteger(L, 2);
  console.warn('GetStartLocPrio was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native SetGameTypeSupported takes gametype whichGameType, boolean value returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetGameTypeSupported(L) {
  let whichGameType = lua_touserdata(L, 1);
  let value = lua_toboolean(L, 2);
  console.warn('SetGameTypeSupported was called but is not implemented :(');
  return 0
}

/**
 * native SetMapFlag takes mapflag whichMapFlag, boolean value returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetMapFlag(L) {
  let whichMapFlag = lua_touserdata(L, 1);
  let value = lua_toboolean(L, 2);
  console.warn('SetMapFlag was called but is not implemented :(');
  return 0
}

/**
 * native SetGamePlacement takes placement whichPlacementType returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetGamePlacement(L) {
  let whichPlacementType = lua_touserdata(L, 1);
  console.warn('SetGamePlacement was called but is not implemented :(');
  return 0
}

/**
 * native SetGameSpeed takes gamespeed whichspeed returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetGameSpeed(L) {
  let whichspeed = lua_touserdata(L, 1);
  console.warn('SetGameSpeed was called but is not implemented :(');
  return 0
}

/**
 * native SetGameDifficulty takes gamedifficulty whichdifficulty returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetGameDifficulty(L) {
  let whichdifficulty = lua_touserdata(L, 1);
  console.warn('SetGameDifficulty was called but is not implemented :(');
  return 0
}

/**
 * native SetResourceDensity takes mapdensity whichdensity returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetResourceDensity(L) {
  let whichdensity = lua_touserdata(L, 1);
  console.warn('SetResourceDensity was called but is not implemented :(');
  return 0
}

/**
 * native SetCreatureDensity takes mapdensity whichdensity returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetCreatureDensity(L) {
  let whichdensity = lua_touserdata(L, 1);
  console.warn('SetCreatureDensity was called but is not implemented :(');
  return 0
}

/**
 * native GetTeams takes nothing returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetTeams(L) {

  console.warn('GetTeams was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native GetPlayers takes nothing returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetPlayers(L) {

  console.warn('GetPlayers was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native IsGameTypeSupported takes gametype whichGameType returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsGameTypeSupported(L) {
  let whichGameType = lua_touserdata(L, 1);
  console.warn('IsGameTypeSupported was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native GetGameTypeSelected takes nothing returns gametype
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetGameTypeSelected(L) {

  console.warn('GetGameTypeSelected was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native IsMapFlagSet takes mapflag whichMapFlag returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsMapFlagSet(L) {
  let whichMapFlag = lua_touserdata(L, 1);
  console.warn('IsMapFlagSet was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native GetGamePlacement takes nothing returns placement
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetGamePlacement(L) {

  console.warn('GetGamePlacement was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetGameSpeed takes nothing returns gamespeed
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetGameSpeed(L) {

  console.warn('GetGameSpeed was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetGameDifficulty takes nothing returns gamedifficulty
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetGameDifficulty(L) {

  console.warn('GetGameDifficulty was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetResourceDensity takes nothing returns mapdensity
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetResourceDensity(L) {

  console.warn('GetResourceDensity was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetCreatureDensity takes nothing returns mapdensity
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetCreatureDensity(L) {

  console.warn('GetCreatureDensity was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetStartLocationX takes integer whichStartLocation returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetStartLocationX(L) {
  let whichStartLocation = luaL_checkinteger(L, 1);
  console.warn('GetStartLocationX was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetStartLocationY takes integer whichStartLocation returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetStartLocationY(L) {
  let whichStartLocation = luaL_checkinteger(L, 1);
  console.warn('GetStartLocationY was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetStartLocationLoc takes integer whichStartLocation returns location
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetStartLocationLoc(L) {
  let whichStartLocation = luaL_checkinteger(L, 1);
  console.warn('GetStartLocationLoc was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native SetPlayerTeam takes player whichPlayer, integer whichTeam returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetPlayerTeam(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let whichTeam = luaL_checkinteger(L, 2);
  console.warn('SetPlayerTeam was called but is not implemented :(');
  return 0
}

/**
 * native SetPlayerStartLocation takes player whichPlayer, integer startLocIndex returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetPlayerStartLocation(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let startLocIndex = luaL_checkinteger(L, 2);

  whichPlayer.startLocation = startLocIndex;

  return 0
}

/**
 * native ForcePlayerStartLocation takes player whichPlayer, integer startLocIndex returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ForcePlayerStartLocation(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let startLocIndex = luaL_checkinteger(L, 2);
  console.warn('ForcePlayerStartLocation was called but is not implemented :(');
  return 0
}

/**
 * native SetPlayerColor takes player whichPlayer, playercolor color returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetPlayerColor(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let color = lua_touserdata(L, 2);

  whichPlayer.color = color;

  return 0
}

/**
 * native SetPlayerAlliance takes player sourcePlayer, player otherPlayer, alliancetype whichAllianceSetting, boolean value returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetPlayerAlliance(L) {
  let sourcePlayer = lua_touserdata(L, 1);
  let otherPlayer = lua_touserdata(L, 2);
  let whichAllianceSetting = lua_touserdata(L, 3);
  let value = lua_toboolean(L, 4);
  console.warn('SetPlayerAlliance was called but is not implemented :(');
  return 0
}

/**
 * native SetPlayerTaxRate takes player sourcePlayer, player otherPlayer, playerstate whichResource, integer rate returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetPlayerTaxRate(L) {
  let sourcePlayer = lua_touserdata(L, 1);
  let otherPlayer = lua_touserdata(L, 2);
  let whichResource = lua_touserdata(L, 3);
  let rate = luaL_checkinteger(L, 4);
  console.warn('SetPlayerTaxRate was called but is not implemented :(');
  return 0
}

/**
 * native SetPlayerRacePreference takes player whichPlayer, racepreference whichRacePreference returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetPlayerRacePreference(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let whichRacePreference = lua_touserdata(L, 2);
  console.warn('SetPlayerRacePreference was called but is not implemented :(');
  return 0
}

/**
 * native SetPlayerRaceSelectable takes player whichPlayer, boolean value returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetPlayerRaceSelectable(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let value = lua_toboolean(L, 2);

  whichPlayer.raceSelectable = value;

  return 0
}

/**
 * native SetPlayerController takes player whichPlayer, mapcontrol controlType returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetPlayerController(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let controlType = lua_touserdata(L, 2);

  whichPlayer.controller = controlType;

  return 0
}

/**
 * native SetPlayerName takes player whichPlayer, string name returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetPlayerName(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let name = luaL_checkstring(L, 2);

  whichPlayer.name = name;

  return 0
}

/**
 * native SetPlayerOnScoreScreen takes player whichPlayer, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetPlayerOnScoreScreen(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('SetPlayerOnScoreScreen was called but is not implemented :(');
  return 0
}

/**
 * native GetPlayerTeam takes player whichPlayer returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetPlayerTeam(L) {
  let whichPlayer = lua_touserdata(L, 1);
  console.warn('GetPlayerTeam was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native GetPlayerStartLocation takes player whichPlayer returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetPlayerStartLocation(L) {
  let whichPlayer = lua_touserdata(L, 1);

  lua_pushinteger(L, whichPlayer.startLocation);

  return 1;
}

/**
 * native GetPlayerColor takes player whichPlayer returns playercolor
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetPlayerColor(L) {
  let whichPlayer = lua_touserdata(L, 1);

  lua_pushlightuserdata(L, whichPlayer.color);

  return 1;
}

/**
 * native GetPlayerSelectable takes player whichPlayer returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetPlayerSelectable(L) {
  let whichPlayer = lua_touserdata(L, 1);
  console.warn('GetPlayerSelectable was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native GetPlayerController takes player whichPlayer returns mapcontrol
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetPlayerController(L) {
  let whichPlayer = lua_touserdata(L, 1);

  lua_pushlightuserdata(L, whichPlayer.controller);

  return 1;
}

/**
 * native GetPlayerSlotState takes player whichPlayer returns playerslotstate
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetPlayerSlotState(L) {
  let whichPlayer = lua_touserdata(L, 1);
  console.warn('GetPlayerSlotState was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native GetPlayerTaxRate takes player sourcePlayer, player otherPlayer, playerstate whichResource returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetPlayerTaxRate(L) {
  let sourcePlayer = lua_touserdata(L, 1);
  let otherPlayer = lua_touserdata(L, 2);
  let whichResource = lua_touserdata(L, 3);
  console.warn('GetPlayerTaxRate was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native IsPlayerRacePrefSet takes player whichPlayer, racepreference pref returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsPlayerRacePrefSet(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let pref = lua_touserdata(L, 2);
  console.warn('IsPlayerRacePrefSet was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native GetPlayerName takes player whichPlayer returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetPlayerName(L) {
  let whichPlayer = lua_touserdata(L, 1);

  lua_pushstring(L, whichPlayer.name);

  return 1;
}

/**
 * native CreateTimer takes nothing returns timer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateTimer(L) {
  lua_pushlightuserdata(L, this.addHandle(new JassTimer()));

  return 1;
}

/**
 * native DestroyTimer takes timer whichTimer returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DestroyTimer(L) {
  let whichTimer = lua_touserdata(L, 1);

  // In case it's in the middle of running, remove it.
  this.timers.delete(whichTimer);

  this.freeHandle(whichTimer);

  return 0
}

/**
 * native TimerStart takes timer whichTimer, real timeout, boolean periodic, code handlerFunc returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TimerStart(L) {
  let whichTimer = lua_touserdata(L, 1);
  let timeout = luaL_checknumber(L, 2);
  let periodic = lua_toboolean(L, 3);
  let handlerFunc = luaL_ref(L, LUA_REGISTRYINDEX);

  whichTimer.elapsed = 0;
  whichTimer.timeout = timeout;
  whichTimer.periodic = periodic;
  whichTimer.handlerFunc = handlerFunc;

  this.timers.add(whichTimer);

  return 0
}

/**
 * native TimerGetElapsed takes timer whichTimer returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TimerGetElapsed(L) {
  let whichTimer = lua_touserdata(L, 1);

  lua_pushnumber(L, whichTimer.elapsed);

  return 1;
}

/**
 * native TimerGetRemaining takes timer whichTimer returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TimerGetRemaining(L) {
  let whichTimer = lua_touserdata(L, 1);

  lua_pushnumber(L, whichTimer.timeout - whichTimer.elapsed);

  return 1;
}

/**
 * native TimerGetTimeout takes timer whichTimer returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TimerGetTimeout(L) {
  let whichTimer = lua_touserdata(L, 1);

  lua_pushnumber(L, whichTimer.timeout);

  return 1;
}

/**
 * native PauseTimer takes timer whichTimer returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PauseTimer(L) {
  let whichTimer = lua_touserdata(L, 1);

  this.timers.delete(whichTimer);

  return 0
}

/**
 * native ResumeTimer takes timer whichTimer returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ResumeTimer(L) {
  let whichTimer = lua_touserdata(L, 1);

  this.timers.add(whichTimer);

  return 0
}

/**
 * native GetExpiredTimer takes nothing returns timer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetExpiredTimer(L) {
  lua_pushlightuserdata(L, this.currentThread.expiredTimer);

  return 1;
}

/**
 * native CreateGroup takes nothing returns group
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateGroup(L) {
  lua_pushlightuserdata(L, this.addHandle(new JassGroup()));

  return 1;
}

/**
 * native DestroyGroup takes group whichGroup returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DestroyGroup(L) {
  let whichGroup = lua_touserdata(L, 1);

  this.freeHandle(whichGroup);

  return 0
}

/**
 * native GroupAddUnit takes group whichGroup, unit whichUnit returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GroupAddUnit(L) {
  let whichGroup = lua_touserdata(L, 1);
  let whichUnit = lua_touserdata(L, 2);

  whichGroup.units.add(whichUnit);

  return 0
}

/**
 * native GroupRemoveUnit takes group whichGroup, unit whichUnit returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GroupRemoveUnit(L) {
  let whichGroup = lua_touserdata(L, 1);
  let whichUnit = lua_touserdata(L, 2);

  whichGroup.units.delete(whichUnit);

  return 0
}

/**
 * native GroupClear takes group whichGroup returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GroupClear(L) {
  let whichGroup = lua_touserdata(L, 1);

  whichGroup.units.clear();

  return 0
}

/**
 * native GroupEnumUnitsOfType takes group whichGroup, string unitname, boolexpr filter returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GroupEnumUnitsOfType(L) {
  let whichGroup = lua_touserdata(L, 1);
  let unitname = luaL_checkstring(L, 2);
  let filter = lua_touserdata(L, 3);
  console.warn('GroupEnumUnitsOfType was called but is not implemented :(');
  return 0
}

/**
 * native GroupEnumUnitsOfPlayer takes group whichGroup, player whichPlayer, boolexpr filter returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GroupEnumUnitsOfPlayer(L) {
  let whichGroup = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  let filter = lua_touserdata(L, 3);
  console.warn('GroupEnumUnitsOfPlayer was called but is not implemented :(');
  return 0
}

/**
 * native GroupEnumUnitsOfTypeCounted takes group whichGroup, string unitname, boolexpr filter, integer countLimit returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GroupEnumUnitsOfTypeCounted(L) {
  let whichGroup = lua_touserdata(L, 1);
  let unitname = luaL_checkstring(L, 2);
  let filter = lua_touserdata(L, 3);
  let countLimit = luaL_checkinteger(L, 4);
  console.warn('GroupEnumUnitsOfTypeCounted was called but is not implemented :(');
  return 0
}

/**
 * native GroupEnumUnitsInRect takes group whichGroup, rect r, boolexpr filter returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GroupEnumUnitsInRect(L) {
  let whichGroup = lua_touserdata(L, 1);
  let r = lua_touserdata(L, 2);
  let filter = lua_touserdata(L, 3);
  console.warn('GroupEnumUnitsInRect was called but is not implemented :(');
  return 0
}

/**
 * native GroupEnumUnitsInRectCounted takes group whichGroup, rect r, boolexpr filter, integer countLimit returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GroupEnumUnitsInRectCounted(L) {
  let whichGroup = lua_touserdata(L, 1);
  let r = lua_touserdata(L, 2);
  let filter = lua_touserdata(L, 3);
  let countLimit = luaL_checkinteger(L, 4);
  console.warn('GroupEnumUnitsInRectCounted was called but is not implemented :(');
  return 0
}

/**
 * native GroupEnumUnitsInRange takes group whichGroup, real x, real y, real radius, boolexpr filter returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GroupEnumUnitsInRange(L) {
  let whichGroup = lua_touserdata(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  let radius = luaL_checknumber(L, 4);
  let filter = lua_touserdata(L, 5);
  console.warn('GroupEnumUnitsInRange was called but is not implemented :(');
  return 0
}

/**
 * native GroupEnumUnitsInRangeOfLoc takes group whichGroup, location whichLocation, real radius, boolexpr filter returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GroupEnumUnitsInRangeOfLoc(L) {
  let whichGroup = lua_touserdata(L, 1);
  let whichLocation = lua_touserdata(L, 2);
  let radius = luaL_checknumber(L, 3);
  let filter = lua_touserdata(L, 4);
  console.warn('GroupEnumUnitsInRangeOfLoc was called but is not implemented :(');
  return 0
}

/**
 * native GroupEnumUnitsInRangeCounted takes group whichGroup, real x, real y, real radius, boolexpr filter, integer countLimit returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GroupEnumUnitsInRangeCounted(L) {
  let whichGroup = lua_touserdata(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  let radius = luaL_checknumber(L, 4);
  let filter = lua_touserdata(L, 5);
  let countLimit = luaL_checkinteger(L, 6);
  console.warn('GroupEnumUnitsInRangeCounted was called but is not implemented :(');
  return 0
}

/**
 * native GroupEnumUnitsInRangeOfLocCounted takes group whichGroup, location whichLocation, real radius, boolexpr filter, integer countLimit returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GroupEnumUnitsInRangeOfLocCounted(L) {
  let whichGroup = lua_touserdata(L, 1);
  let whichLocation = lua_touserdata(L, 2);
  let radius = luaL_checknumber(L, 3);
  let filter = lua_touserdata(L, 4);
  let countLimit = luaL_checkinteger(L, 5);
  console.warn('GroupEnumUnitsInRangeOfLocCounted was called but is not implemented :(');
  return 0
}

/**
 * native GroupEnumUnitsSelected takes group whichGroup, player whichPlayer, boolexpr filter returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GroupEnumUnitsSelected(L) {
  let whichGroup = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  let filter = lua_touserdata(L, 3);
  console.warn('GroupEnumUnitsSelected was called but is not implemented :(');
  return 0
}

/**
 * native GroupImmediateOrder takes group whichGroup, string order returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GroupImmediateOrder(L) {
  let whichGroup = lua_touserdata(L, 1);
  let order = luaL_checkstring(L, 2);
  console.warn('GroupImmediateOrder was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native GroupImmediateOrderById takes group whichGroup, integer order returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GroupImmediateOrderById(L) {
  let whichGroup = lua_touserdata(L, 1);
  let order = luaL_checkinteger(L, 2);
  console.warn('GroupImmediateOrderById was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native GroupPointOrder takes group whichGroup, string order, real x, real y returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GroupPointOrder(L) {
  let whichGroup = lua_touserdata(L, 1);
  let order = luaL_checkstring(L, 2);
  let x = luaL_checknumber(L, 3);
  let y = luaL_checknumber(L, 4);
  console.warn('GroupPointOrder was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native GroupPointOrderLoc takes group whichGroup, string order, location whichLocation returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GroupPointOrderLoc(L) {
  let whichGroup = lua_touserdata(L, 1);
  let order = luaL_checkstring(L, 2);
  let whichLocation = lua_touserdata(L, 3);
  console.warn('GroupPointOrderLoc was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native GroupPointOrderById takes group whichGroup, integer order, real x, real y returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GroupPointOrderById(L) {
  let whichGroup = lua_touserdata(L, 1);
  let order = luaL_checkinteger(L, 2);
  let x = luaL_checknumber(L, 3);
  let y = luaL_checknumber(L, 4);
  console.warn('GroupPointOrderById was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native GroupPointOrderByIdLoc takes group whichGroup, integer order, location whichLocation returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GroupPointOrderByIdLoc(L) {
  let whichGroup = lua_touserdata(L, 1);
  let order = luaL_checkinteger(L, 2);
  let whichLocation = lua_touserdata(L, 3);
  console.warn('GroupPointOrderByIdLoc was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native GroupTargetOrder takes group whichGroup, string order, widget targetWidget returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GroupTargetOrder(L) {
  let whichGroup = lua_touserdata(L, 1);
  let order = luaL_checkstring(L, 2);
  let targetWidget = lua_touserdata(L, 3);
  console.warn('GroupTargetOrder was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native GroupTargetOrderById takes group whichGroup, integer order, widget targetWidget returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GroupTargetOrderById(L) {
  let whichGroup = lua_touserdata(L, 1);
  let order = luaL_checkinteger(L, 2);
  let targetWidget = lua_touserdata(L, 3);
  console.warn('GroupTargetOrderById was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native ForGroup takes group whichGroup, code callback returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ForGroup(L) {
  let whichGroup = lua_touserdata(L, 1);
  let callback = luaL_ref(L, LUA_REGISTRYINDEX);

  for (let unit of whichGroup.units) {
    this.enumUnit = unit;

    this.call(callback);
  }

  this.enumUnit = null;

  luaL_unref(L, callback);

  return 0
}

/**
 * native FirstOfGroup takes group whichGroup returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function FirstOfGroup(L) {
  let whichGroup = lua_touserdata(L, 1);
  console.warn('FirstOfGroup was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native CreateForce takes nothing returns force
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateForce(L) {
  lua_pushlightuserdata(L, this.addHandle(new JassForce()));

  return 1;
}

/**
 * native DestroyForce takes force whichForce returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DestroyForce(L) {
  let whichForce = lua_touserdata(L, 1);

  this.freeHandle(whichForce);

  return 0
}

/**
 * native ForceAddPlayer takes force whichForce, player whichPlayer returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ForceAddPlayer(L) {
  let whichForce = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);

  whichForce.players.add(whichPlayer);

  return 0
}

/**
 * native ForceRemovePlayer takes force whichForce, player whichPlayer returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ForceRemovePlayer(L) {
  let whichForce = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);

  whichForce.players.delete(whichPlayer);

  return 0
}

/**
 * native ForceClear takes force whichForce returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ForceClear(L) {
  let whichForce = lua_touserdata(L, 1);

  whichForce.players.clear();

  return 0
}

/**
 * native ForceEnumPlayers takes force whichForce, boolexpr filter returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ForceEnumPlayers(L) {
  let whichForce = lua_touserdata(L, 1);
  let filter = lua_touserdata(L, 2);
  console.warn('ForceEnumPlayers was called but is not implemented :(');
  return 0
}

/**
 * native ForceEnumPlayersCounted takes force whichForce, boolexpr filter, integer countLimit returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ForceEnumPlayersCounted(L) {
  let whichForce = lua_touserdata(L, 1);
  let filter = lua_touserdata(L, 2);
  let countLimit = luaL_checkinteger(L, 3);
  console.warn('ForceEnumPlayersCounted was called but is not implemented :(');
  return 0
}

/**
 * native ForceEnumAllies takes force whichForce, player whichPlayer, boolexpr filter returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ForceEnumAllies(L) {
  let whichForce = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  let filter = lua_touserdata(L, 3);
  console.warn('ForceEnumAllies was called but is not implemented :(');
  return 0
}

/**
 * native ForceEnumEnemies takes force whichForce, player whichPlayer, boolexpr filter returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ForceEnumEnemies(L) {
  let whichForce = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  let filter = lua_touserdata(L, 3);
  console.warn('ForceEnumEnemies was called but is not implemented :(');
  return 0
}

/**
 * native ForForce takes force whichForce, code callback returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ForForce(L) {
  let whichForce = lua_touserdata(L, 1);
  let callback = luaL_ref(L, LUA_REGISTRYINDEX);
  
  for (let player of whichForce.players) {
    this.enumPlayer = player;

    this.call(callback);
  }

  this.enumPlayer = null;

  luaL_unref(L, callback);

  return 0
}

/**
 * native Rect takes real minx, real miny, real maxx, real maxy returns rect
 * 
 * @param {lua_State} L
 * @return {number}
 */
function Rect(L) {
  let minx = luaL_checknumber(L, 1);
  let miny = luaL_checknumber(L, 2);
  let maxx = luaL_checknumber(L, 3);
  let maxy = luaL_checknumber(L, 4);
  console.warn('Rect was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native RectFromLoc takes location min, location max returns rect
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RectFromLoc(L) {
  let min = lua_touserdata(L, 1);
  let max = lua_touserdata(L, 2);
  console.warn('RectFromLoc was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native RemoveRect takes rect whichRect returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RemoveRect(L) {
  let whichRect = lua_touserdata(L, 1);
  console.warn('RemoveRect was called but is not implemented :(');
  return 0
}

/**
 * native SetRect takes rect whichRect, real minx, real miny, real maxx, real maxy returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetRect(L) {
  let whichRect = lua_touserdata(L, 1);
  let minx = luaL_checknumber(L, 2);
  let miny = luaL_checknumber(L, 3);
  let maxx = luaL_checknumber(L, 4);
  let maxy = luaL_checknumber(L, 5);
  console.warn('SetRect was called but is not implemented :(');
  return 0
}

/**
 * native SetRectFromLoc takes rect whichRect, location min, location max returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetRectFromLoc(L) {
  let whichRect = lua_touserdata(L, 1);
  let min = lua_touserdata(L, 2);
  let max = lua_touserdata(L, 3);
  console.warn('SetRectFromLoc was called but is not implemented :(');
  return 0
}

/**
 * native MoveRectTo takes rect whichRect, real newCenterX, real newCenterY returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MoveRectTo(L) {
  let whichRect = lua_touserdata(L, 1);
  let newCenterX = luaL_checknumber(L, 2);
  let newCenterY = luaL_checknumber(L, 3);
  console.warn('MoveRectTo was called but is not implemented :(');
  return 0
}

/**
 * native MoveRectToLoc takes rect whichRect, location newCenterLoc returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MoveRectToLoc(L) {
  let whichRect = lua_touserdata(L, 1);
  let newCenterLoc = lua_touserdata(L, 2);
  console.warn('MoveRectToLoc was called but is not implemented :(');
  return 0
}

/**
 * native GetRectCenterX takes rect whichRect returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetRectCenterX(L) {
  let whichRect = lua_touserdata(L, 1);
  console.warn('GetRectCenterX was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native GetRectCenterY takes rect whichRect returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetRectCenterY(L) {
  let whichRect = lua_touserdata(L, 1);
  console.warn('GetRectCenterY was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native GetRectMinX takes rect whichRect returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetRectMinX(L) {
  let whichRect = lua_touserdata(L, 1);
  console.warn('GetRectMinX was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native GetRectMinY takes rect whichRect returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetRectMinY(L) {
  let whichRect = lua_touserdata(L, 1);
  console.warn('GetRectMinY was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native GetRectMaxX takes rect whichRect returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetRectMaxX(L) {
  let whichRect = lua_touserdata(L, 1);
  console.warn('GetRectMaxX was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native GetRectMaxY takes rect whichRect returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetRectMaxY(L) {
  let whichRect = lua_touserdata(L, 1);
  console.warn('GetRectMaxY was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native CreateRegion takes nothing returns region
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateRegion(L) {

  console.warn('CreateRegion was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native RemoveRegion takes region whichRegion returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RemoveRegion(L) {
  let whichRegion = lua_touserdata(L, 1);
  console.warn('RemoveRegion was called but is not implemented :(');
  return 0
}

/**
 * native RegionAddRect takes region whichRegion, rect r returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RegionAddRect(L) {
  let whichRegion = lua_touserdata(L, 1);
  let r = lua_touserdata(L, 2);
  console.warn('RegionAddRect was called but is not implemented :(');
  return 0
}

/**
 * native RegionClearRect takes region whichRegion, rect r returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RegionClearRect(L) {
  let whichRegion = lua_touserdata(L, 1);
  let r = lua_touserdata(L, 2);
  console.warn('RegionClearRect was called but is not implemented :(');
  return 0
}

/**
 * native RegionAddCell takes region whichRegion, real x, real y returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RegionAddCell(L) {
  let whichRegion = lua_touserdata(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  console.warn('RegionAddCell was called but is not implemented :(');
  return 0
}

/**
 * native RegionAddCellAtLoc takes region whichRegion, location whichLocation returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RegionAddCellAtLoc(L) {
  let whichRegion = lua_touserdata(L, 1);
  let whichLocation = lua_touserdata(L, 2);
  console.warn('RegionAddCellAtLoc was called but is not implemented :(');
  return 0
}

/**
 * native RegionClearCell takes region whichRegion, real x, real y returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RegionClearCell(L) {
  let whichRegion = lua_touserdata(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  console.warn('RegionClearCell was called but is not implemented :(');
  return 0
}

/**
 * native RegionClearCellAtLoc takes region whichRegion, location whichLocation returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RegionClearCellAtLoc(L) {
  let whichRegion = lua_touserdata(L, 1);
  let whichLocation = lua_touserdata(L, 2);
  console.warn('RegionClearCellAtLoc was called but is not implemented :(');
  return 0
}

/**
 * native Location takes real x, real y returns location
 * 
 * @param {lua_State} L
 * @return {number}
 */
function Location(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  console.warn('Location was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native RemoveLocation takes location whichLocation returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RemoveLocation(L) {
  let whichLocation = lua_touserdata(L, 1);
  console.warn('RemoveLocation was called but is not implemented :(');
  return 0
}

/**
 * native MoveLocation takes location whichLocation, real newX, real newY returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MoveLocation(L) {
  let whichLocation = lua_touserdata(L, 1);
  let newX = luaL_checknumber(L, 2);
  let newY = luaL_checknumber(L, 3);
  console.warn('MoveLocation was called but is not implemented :(');
  return 0
}

/**
 * native GetLocationX takes location whichLocation returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetLocationX(L) {
  let whichLocation = lua_touserdata(L, 1);
  console.warn('GetLocationX was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native GetLocationY takes location whichLocation returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetLocationY(L) {
  let whichLocation = lua_touserdata(L, 1);
  console.warn('GetLocationY was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native GetLocationZ takes location whichLocation returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetLocationZ(L) {
  let whichLocation = lua_touserdata(L, 1);
  console.warn('GetLocationZ was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native IsUnitInRegion takes region whichRegion, unit whichUnit returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsUnitInRegion(L) {
  let whichRegion = lua_touserdata(L, 1);
  let whichUnit = lua_touserdata(L, 2);
  console.warn('IsUnitInRegion was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IsPointInRegion takes region whichRegion, real x, real y returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsPointInRegion(L) {
  let whichRegion = lua_touserdata(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  console.warn('IsPointInRegion was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IsLocationInRegion takes region whichRegion, location whichLocation returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsLocationInRegion(L) {
  let whichRegion = lua_touserdata(L, 1);
  let whichLocation = lua_touserdata(L, 2);
  console.warn('IsLocationInRegion was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native GetWorldBounds takes nothing returns rect
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetWorldBounds(L) {

  console.warn('GetWorldBounds was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native CreateTrigger takes nothing returns trigger
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateTrigger(L) {
  lua_pushlightuserdata(L, this.addHandle(new JassTrigger()));

  return 1;
}

/**
 * native DestroyTrigger takes trigger whichTrigger returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DestroyTrigger(L) {
  let whichTrigger = lua_touserdata(L, 1);

  // In case it's registered, remove it.
  this.triggers.delete(whichTrigger);

  this.freeHandle(whichTrigger);

  return 0
}

/**
 * native ResetTrigger takes trigger whichTrigger returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ResetTrigger(L) {
  let whichTrigger = lua_touserdata(L, 1);
  console.warn('ResetTrigger was called but is not implemented :(');
  return 0
}

/**
 * native EnableTrigger takes trigger whichTrigger returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function EnableTrigger(L) {
  let whichTrigger = lua_touserdata(L, 1);
  console.warn('EnableTrigger was called but is not implemented :(');
  return 0
}

/**
 * native DisableTrigger takes trigger whichTrigger returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DisableTrigger(L) {
  let whichTrigger = lua_touserdata(L, 1);
  console.warn('DisableTrigger was called but is not implemented :(');
  return 0
}

/**
 * native IsTriggerEnabled takes trigger whichTrigger returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsTriggerEnabled(L) {
  let whichTrigger = lua_touserdata(L, 1);
  console.warn('IsTriggerEnabled was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native TriggerWaitOnSleeps takes trigger whichTrigger, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerWaitOnSleeps(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('TriggerWaitOnSleeps was called but is not implemented :(');
  return 0
}

/**
 * native IsTriggerWaitOnSleeps takes trigger whichTrigger returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsTriggerWaitOnSleeps(L) {
  let whichTrigger = lua_touserdata(L, 1);
  console.warn('IsTriggerWaitOnSleeps was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native GetFilterUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetFilterUnit(L) {
  lua_pushlightuserdata(L, this.filterUnit);

  return 1;
}

/**
 * constant native GetEnumUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetEnumUnit(L) {
  lua_pushlightuserdata(L, this.enumUnit);

  return 1;
}

/**
 * constant native GetFilterDestructable takes nothing returns destructable
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetFilterDestructable(L) {

  console.warn('GetFilterDestructable was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetEnumDestructable takes nothing returns destructable
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetEnumDestructable(L) {

  console.warn('GetEnumDestructable was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetFilterItem takes nothing returns item
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetFilterItem(L) {

  console.warn('GetFilterItem was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetEnumItem takes nothing returns item
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetEnumItem(L) {

  console.warn('GetEnumItem was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetFilterPlayer takes nothing returns player
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetFilterPlayer(L) {

  console.warn('GetFilterPlayer was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetEnumPlayer takes nothing returns player
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetEnumPlayer(L) {
  lua_pushlightuserdata(L, this.enumPlayer);

  return 1;
}

/**
 * constant native GetTriggeringTrigger takes nothing returns trigger
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetTriggeringTrigger(L) {
  lua_pushlightuserdata(L, this.currentThread.triggeringTrigger);
  
  return 1;
}

/**
 * constant native GetTriggerEventId takes nothing returns eventid
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetTriggerEventId(L) {

  console.warn('GetTriggerEventId was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetTriggerEvalCount takes trigger whichTrigger returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetTriggerEvalCount(L) {
  let whichTrigger = lua_touserdata(L, 1);
  console.warn('GetTriggerEvalCount was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * constant native GetTriggerExecCount takes trigger whichTrigger returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetTriggerExecCount(L) {
  let whichTrigger = lua_touserdata(L, 1);
  console.warn('GetTriggerExecCount was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native ExecuteFunc takes string funcName returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ExecuteFunc(L) {
  let funcName = luaL_checkstring(L, 1);
  console.warn('ExecuteFunc was called but is not implemented :(');
  return 0
}

/**
 * native And takes boolexpr operandA, boolexpr operandB returns boolexpr
 * 
 * @param {lua_State} L
 * @return {number}
 */
function And(L) {
  let operandA = lua_touserdata(L, 1);
  let operandB = lua_touserdata(L, 2);
  console.warn('And was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native Or takes boolexpr operandA, boolexpr operandB returns boolexpr
 * 
 * @param {lua_State} L
 * @return {number}
 */
function Or(L) {
  let operandA = lua_touserdata(L, 1);
  let operandB = lua_touserdata(L, 2);
  console.warn('Or was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native Not takes boolexpr operand returns boolexpr
 * 
 * @param {lua_State} L
 * @return {number}
 */
function Not(L) {
  let operand = lua_touserdata(L, 1);
  console.warn('Not was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native Condition takes code func returns conditionfunc
 * 
 * @param {lua_State} L
 * @return {number}
 */
function Condition(L) {
  let func = luaL_ref(L, LUA_REGISTRYINDEX);
  console.warn('Condition was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native DestroyCondition takes conditionfunc c returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DestroyCondition(L) {
  let c = lua_touserdata(L, 1);
  console.warn('DestroyCondition was called but is not implemented :(');
  return 0
}

/**
 * native Filter takes code func returns filterfunc
 * 
 * @param {lua_State} L
 * @return {number}
 */
function Filter(L) {
  let func = luaL_ref(L, LUA_REGISTRYINDEX);
  console.warn('Filter was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native DestroyFilter takes filterfunc f returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DestroyFilter(L) {
  let f = lua_touserdata(L, 1);
  console.warn('DestroyFilter was called but is not implemented :(');
  return 0
}

/**
 * native DestroyBoolExpr takes boolexpr e returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DestroyBoolExpr(L) {
  let e = lua_touserdata(L, 1);
  console.warn('DestroyBoolExpr was called but is not implemented :(');
  return 0
}

/**
 * native TriggerRegisterVariableEvent takes trigger whichTrigger, string varName, limitop opcode, real limitval returns event
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerRegisterVariableEvent(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let varName = luaL_checkstring(L, 2);
  let opcode = lua_touserdata(L, 3);
  let limitval = luaL_checknumber(L, 4);
  console.warn('TriggerRegisterVariableEvent was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native TriggerRegisterTimerEvent takes trigger whichTrigger, real timeout, boolean periodic returns event
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerRegisterTimerEvent(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let timeout = luaL_checknumber(L, 2);
  let periodic = lua_toboolean(L, 3);
  console.warn('TriggerRegisterTimerEvent was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native TriggerRegisterTimerExpireEvent takes trigger whichTrigger, timer t returns event
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerRegisterTimerExpireEvent(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let t = lua_touserdata(L, 2);
  console.warn('TriggerRegisterTimerExpireEvent was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native TriggerRegisterGameStateEvent takes trigger whichTrigger, gamestate whichState, limitop opcode, real limitval returns event
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerRegisterGameStateEvent(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let whichState = lua_touserdata(L, 2);
  let opcode = lua_touserdata(L, 3);
  let limitval = luaL_checknumber(L, 4);
  console.warn('TriggerRegisterGameStateEvent was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native TriggerRegisterDialogEvent takes trigger whichTrigger, dialog whichDialog returns event
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerRegisterDialogEvent(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let whichDialog = lua_touserdata(L, 2);
  console.warn('TriggerRegisterDialogEvent was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native TriggerRegisterDialogButtonEvent takes trigger whichTrigger, button whichButton returns event
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerRegisterDialogButtonEvent(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let whichButton = lua_touserdata(L, 2);
  console.warn('TriggerRegisterDialogButtonEvent was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetEventGameState takes nothing returns gamestate
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetEventGameState(L) {

  console.warn('GetEventGameState was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native TriggerRegisterGameEvent takes trigger whichTrigger, gameevent whichGameEvent returns event
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerRegisterGameEvent(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let whichGameEvent = lua_touserdata(L, 2);
  console.warn('TriggerRegisterGameEvent was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetWinningPlayer takes nothing returns player
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetWinningPlayer(L) {

  console.warn('GetWinningPlayer was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native TriggerRegisterEnterRegion takes trigger whichTrigger, region whichRegion, boolexpr filter returns event
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerRegisterEnterRegion(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let whichRegion = lua_touserdata(L, 2);
  let filter = lua_touserdata(L, 3);
  console.warn('TriggerRegisterEnterRegion was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetTriggeringRegion takes nothing returns region
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetTriggeringRegion(L) {

  console.warn('GetTriggeringRegion was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetEnteringUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetEnteringUnit(L) {

  console.warn('GetEnteringUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native TriggerRegisterLeaveRegion takes trigger whichTrigger, region whichRegion, boolexpr filter returns event
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerRegisterLeaveRegion(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let whichRegion = lua_touserdata(L, 2);
  let filter = lua_touserdata(L, 3);
  console.warn('TriggerRegisterLeaveRegion was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetLeavingUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetLeavingUnit(L) {

  console.warn('GetLeavingUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native TriggerRegisterTrackableHitEvent takes trigger whichTrigger, trackable t returns event
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerRegisterTrackableHitEvent(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let t = lua_touserdata(L, 2);
  console.warn('TriggerRegisterTrackableHitEvent was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native TriggerRegisterTrackableTrackEvent takes trigger whichTrigger, trackable t returns event
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerRegisterTrackableTrackEvent(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let t = lua_touserdata(L, 2);
  console.warn('TriggerRegisterTrackableTrackEvent was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetTriggeringTrackable takes nothing returns trackable
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetTriggeringTrackable(L) {

  console.warn('GetTriggeringTrackable was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetClickedButton takes nothing returns button
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetClickedButton(L) {

  console.warn('GetClickedButton was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetClickedDialog takes nothing returns dialog
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetClickedDialog(L) {

  console.warn('GetClickedDialog was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetTournamentFinishSoonTimeRemaining takes nothing returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetTournamentFinishSoonTimeRemaining(L) {

  console.warn('GetTournamentFinishSoonTimeRemaining was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetTournamentFinishNowRule takes nothing returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetTournamentFinishNowRule(L) {

  console.warn('GetTournamentFinishNowRule was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * constant native GetTournamentFinishNowPlayer takes nothing returns player
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetTournamentFinishNowPlayer(L) {

  console.warn('GetTournamentFinishNowPlayer was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetTournamentScore takes player whichPlayer returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetTournamentScore(L) {
  let whichPlayer = lua_touserdata(L, 1);
  console.warn('GetTournamentScore was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * constant native GetSaveBasicFilename takes nothing returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetSaveBasicFilename(L) {

  console.warn('GetSaveBasicFilename was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native TriggerRegisterPlayerEvent takes trigger whichTrigger, player whichPlayer, playerevent whichPlayerEvent returns event
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerRegisterPlayerEvent(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  let whichPlayerEvent = lua_touserdata(L, 3);
  console.warn('TriggerRegisterPlayerEvent was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetTriggerPlayer takes nothing returns player
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetTriggerPlayer(L) {

  console.warn('GetTriggerPlayer was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native TriggerRegisterPlayerUnitEvent takes trigger whichTrigger, player whichPlayer, playerunitevent whichPlayerUnitEvent, boolexpr filter returns event
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerRegisterPlayerUnitEvent(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  let whichPlayerUnitEvent = lua_touserdata(L, 3);
  let filter = lua_touserdata(L, 4);
  console.warn('TriggerRegisterPlayerUnitEvent was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetLevelingUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetLevelingUnit(L) {

  console.warn('GetLevelingUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetLearningUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetLearningUnit(L) {

  console.warn('GetLearningUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetLearnedSkill takes nothing returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetLearnedSkill(L) {

  console.warn('GetLearnedSkill was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * constant native GetLearnedSkillLevel takes nothing returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetLearnedSkillLevel(L) {

  console.warn('GetLearnedSkillLevel was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * constant native GetRevivableUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetRevivableUnit(L) {

  console.warn('GetRevivableUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetRevivingUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetRevivingUnit(L) {

  console.warn('GetRevivingUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetAttacker takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetAttacker(L) {

  console.warn('GetAttacker was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetRescuer takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetRescuer(L) {

  console.warn('GetRescuer was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetDyingUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetDyingUnit(L) {

  console.warn('GetDyingUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetKillingUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetKillingUnit(L) {

  console.warn('GetKillingUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetDecayingUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetDecayingUnit(L) {

  console.warn('GetDecayingUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetConstructingStructure takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetConstructingStructure(L) {

  console.warn('GetConstructingStructure was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetCancelledStructure takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetCancelledStructure(L) {

  console.warn('GetCancelledStructure was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetConstructedStructure takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetConstructedStructure(L) {

  console.warn('GetConstructedStructure was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetResearchingUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetResearchingUnit(L) {

  console.warn('GetResearchingUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetResearched takes nothing returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetResearched(L) {

  console.warn('GetResearched was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * constant native GetTrainedUnitType takes nothing returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetTrainedUnitType(L) {

  console.warn('GetTrainedUnitType was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * constant native GetTrainedUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetTrainedUnit(L) {

  console.warn('GetTrainedUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetDetectedUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetDetectedUnit(L) {

  console.warn('GetDetectedUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetSummoningUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetSummoningUnit(L) {

  console.warn('GetSummoningUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetSummonedUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetSummonedUnit(L) {

  console.warn('GetSummonedUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetTransportUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetTransportUnit(L) {

  console.warn('GetTransportUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetLoadedUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetLoadedUnit(L) {

  console.warn('GetLoadedUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetSellingUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetSellingUnit(L) {

  console.warn('GetSellingUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetSoldUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetSoldUnit(L) {

  console.warn('GetSoldUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetBuyingUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetBuyingUnit(L) {

  console.warn('GetBuyingUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetSoldItem takes nothing returns item
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetSoldItem(L) {

  console.warn('GetSoldItem was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetChangingUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetChangingUnit(L) {

  console.warn('GetChangingUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetChangingUnitPrevOwner takes nothing returns player
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetChangingUnitPrevOwner(L) {

  console.warn('GetChangingUnitPrevOwner was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetManipulatingUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetManipulatingUnit(L) {

  console.warn('GetManipulatingUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetManipulatedItem takes nothing returns item
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetManipulatedItem(L) {

  console.warn('GetManipulatedItem was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetOrderedUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetOrderedUnit(L) {

  console.warn('GetOrderedUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetIssuedOrderId takes nothing returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetIssuedOrderId(L) {

  console.warn('GetIssuedOrderId was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * constant native GetOrderPointX takes nothing returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetOrderPointX(L) {

  console.warn('GetOrderPointX was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetOrderPointY takes nothing returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetOrderPointY(L) {

  console.warn('GetOrderPointY was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetOrderPointLoc takes nothing returns location
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetOrderPointLoc(L) {

  console.warn('GetOrderPointLoc was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetOrderTarget takes nothing returns widget
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetOrderTarget(L) {

  console.warn('GetOrderTarget was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetOrderTargetDestructable takes nothing returns destructable
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetOrderTargetDestructable(L) {

  console.warn('GetOrderTargetDestructable was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetOrderTargetItem takes nothing returns item
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetOrderTargetItem(L) {

  console.warn('GetOrderTargetItem was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetOrderTargetUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetOrderTargetUnit(L) {

  console.warn('GetOrderTargetUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetSpellAbilityUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetSpellAbilityUnit(L) {

  console.warn('GetSpellAbilityUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetSpellAbilityId takes nothing returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetSpellAbilityId(L) {

  console.warn('GetSpellAbilityId was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * constant native GetSpellAbility takes nothing returns ability
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetSpellAbility(L) {

  console.warn('GetSpellAbility was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetSpellTargetLoc takes nothing returns location
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetSpellTargetLoc(L) {

  console.warn('GetSpellTargetLoc was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetSpellTargetX takes nothing returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetSpellTargetX(L) {

  console.warn('GetSpellTargetX was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetSpellTargetY takes nothing returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetSpellTargetY(L) {

  console.warn('GetSpellTargetY was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetSpellTargetDestructable takes nothing returns destructable
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetSpellTargetDestructable(L) {

  console.warn('GetSpellTargetDestructable was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetSpellTargetItem takes nothing returns item
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetSpellTargetItem(L) {

  console.warn('GetSpellTargetItem was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetSpellTargetUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetSpellTargetUnit(L) {

  console.warn('GetSpellTargetUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native TriggerRegisterPlayerAllianceChange takes trigger whichTrigger, player whichPlayer, alliancetype whichAlliance returns event
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerRegisterPlayerAllianceChange(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  let whichAlliance = lua_touserdata(L, 3);
  console.warn('TriggerRegisterPlayerAllianceChange was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native TriggerRegisterPlayerStateEvent takes trigger whichTrigger, player whichPlayer, playerstate whichState, limitop opcode, real limitval returns event
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerRegisterPlayerStateEvent(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  let whichState = lua_touserdata(L, 3);
  let opcode = lua_touserdata(L, 4);
  let limitval = luaL_checknumber(L, 5);
  console.warn('TriggerRegisterPlayerStateEvent was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetEventPlayerState takes nothing returns playerstate
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetEventPlayerState(L) {

  console.warn('GetEventPlayerState was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native TriggerRegisterPlayerChatEvent takes trigger whichTrigger, player whichPlayer, string chatMessageToDetect, boolean exactMatchOnly returns event
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerRegisterPlayerChatEvent(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  let chatMessageToDetect = luaL_checkstring(L, 3);
  let exactMatchOnly = lua_toboolean(L, 4);
  console.warn('TriggerRegisterPlayerChatEvent was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetEventPlayerChatString takes nothing returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetEventPlayerChatString(L) {

  console.warn('GetEventPlayerChatString was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * constant native GetEventPlayerChatStringMatched takes nothing returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetEventPlayerChatStringMatched(L) {

  console.warn('GetEventPlayerChatStringMatched was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native TriggerRegisterDeathEvent takes trigger whichTrigger, widget whichWidget returns event
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerRegisterDeathEvent(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let whichWidget = lua_touserdata(L, 2);
  console.warn('TriggerRegisterDeathEvent was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetTriggerUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetTriggerUnit(L) {
  lua_pushlightuserdata(L, this.currentThread.triggerUnit);
  
  return 1;
}

/**
 * native TriggerRegisterUnitStateEvent takes trigger whichTrigger, unit whichUnit, unitstate whichState, limitop opcode, real limitval returns event
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerRegisterUnitStateEvent(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let whichUnit = lua_touserdata(L, 2);
  let whichState = lua_touserdata(L, 3);
  let opcode = lua_touserdata(L, 4);
  let limitval = luaL_checknumber(L, 5);
  console.warn('TriggerRegisterUnitStateEvent was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetEventUnitState takes nothing returns unitstate
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetEventUnitState(L) {

  console.warn('GetEventUnitState was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native TriggerRegisterUnitEvent takes trigger whichTrigger, unit whichUnit, unitevent whichEvent returns event
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerRegisterUnitEvent(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let whichUnit = lua_touserdata(L, 2);
  let whichEvent = lua_touserdata(L, 3);
  console.warn('TriggerRegisterUnitEvent was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetEventDamage takes nothing returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetEventDamage(L) {

  console.warn('GetEventDamage was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetEventDamageSource takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetEventDamageSource(L) {

  console.warn('GetEventDamageSource was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetEventDetectingPlayer takes nothing returns player
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetEventDetectingPlayer(L) {

  console.warn('GetEventDetectingPlayer was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native TriggerRegisterFilterUnitEvent takes trigger whichTrigger, unit whichUnit, unitevent whichEvent, boolexpr filter returns event
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerRegisterFilterUnitEvent(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let whichUnit = lua_touserdata(L, 2);
  let whichEvent = lua_touserdata(L, 3);
  let filter = lua_touserdata(L, 4);
  console.warn('TriggerRegisterFilterUnitEvent was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetEventTargetUnit takes nothing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetEventTargetUnit(L) {

  console.warn('GetEventTargetUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native TriggerRegisterUnitInRange takes trigger whichTrigger, unit whichUnit, real range, boolexpr filter returns event
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerRegisterUnitInRange(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let whichUnit = lua_touserdata(L, 2);
  let range = luaL_checknumber(L, 3);
  let filter = lua_touserdata(L, 4);
  console.warn('TriggerRegisterUnitInRange was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native TriggerAddCondition takes trigger whichTrigger, boolexpr condition returns triggercondition
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerAddCondition(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let condition = lua_touserdata(L, 2);
  console.warn('TriggerAddCondition was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native TriggerRemoveCondition takes trigger whichTrigger, triggercondition whichCondition returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerRemoveCondition(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let whichCondition = lua_touserdata(L, 2);
  console.warn('TriggerRemoveCondition was called but is not implemented :(');
  return 0
}

/**
 * native TriggerClearConditions takes trigger whichTrigger returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerClearConditions(L) {
  let whichTrigger = lua_touserdata(L, 1);
  console.warn('TriggerClearConditions was called but is not implemented :(');
  return 0
}

/**
 * native TriggerAddAction takes trigger whichTrigger, code actionFunc returns triggeraction
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerAddAction(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let actionFunc = luaL_ref(L, LUA_REGISTRYINDEX);
  console.warn('TriggerAddAction was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native TriggerRemoveAction takes trigger whichTrigger, triggeraction whichAction returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerRemoveAction(L) {
  let whichTrigger = lua_touserdata(L, 1);
  let whichAction = lua_touserdata(L, 2);
  console.warn('TriggerRemoveAction was called but is not implemented :(');
  return 0
}

/**
 * native TriggerClearActions takes trigger whichTrigger returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerClearActions(L) {
  let whichTrigger = lua_touserdata(L, 1);
  console.warn('TriggerClearActions was called but is not implemented :(');
  return 0
}

/**
 * native TriggerSleepAction takes real timeout returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerSleepAction(L) {
  let timeout = luaL_checknumber(L, 1);

  lua_pushnumber(L, timeout);

  lua_yield(L, 1);

  return 0
}

/**
 * native TriggerWaitForSound takes sound s, real offset returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerWaitForSound(L) {
  let s = lua_touserdata(L, 1);
  let offset = luaL_checknumber(L, 2);
  console.warn('TriggerWaitForSound was called but is not implemented :(');
  return 0
}

/**
 * native TriggerEvaluate takes trigger whichTrigger returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerEvaluate(L) {
  let whichTrigger = lua_touserdata(L, 1);
  console.warn('TriggerEvaluate was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native TriggerExecute takes trigger whichTrigger returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerExecute(L) {
  let whichTrigger = lua_touserdata(L, 1);
  console.warn('TriggerExecute was called but is not implemented :(');
  return 0
}

/**
 * native TriggerExecuteWait takes trigger whichTrigger returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerExecuteWait(L) {
  let whichTrigger = lua_touserdata(L, 1);
  console.warn('TriggerExecuteWait was called but is not implemented :(');
  return 0
}

/**
 * native TriggerSyncStart takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerSyncStart(L) {

  console.warn('TriggerSyncStart was called but is not implemented :(');
  return 0
}

/**
 * native TriggerSyncReady takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TriggerSyncReady(L) {

  console.warn('TriggerSyncReady was called but is not implemented :(');
  return 0
}

/**
 * native GetWidgetLife takes widget whichWidget returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetWidgetLife(L) {
  let whichWidget = lua_touserdata(L, 1);
  console.warn('GetWidgetLife was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native SetWidgetLife takes widget whichWidget, real newLife returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetWidgetLife(L) {
  let whichWidget = lua_touserdata(L, 1);
  let newLife = luaL_checknumber(L, 2);
  console.warn('SetWidgetLife was called but is not implemented :(');
  return 0
}

/**
 * native GetWidgetX takes widget whichWidget returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetWidgetX(L) {
  let whichWidget = lua_touserdata(L, 1);
  console.warn('GetWidgetX was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native GetWidgetY takes widget whichWidget returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetWidgetY(L) {
  let whichWidget = lua_touserdata(L, 1);
  console.warn('GetWidgetY was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetTriggerWidget takes nothing returns widget
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetTriggerWidget(L) {

  console.warn('GetTriggerWidget was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native CreateDestructable takes integer objectid, real x, real y, real face, real scale, integer variation returns destructable
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateDestructable(L) {
  let objectid = luaL_checkinteger(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  let face = luaL_checknumber(L, 4);
  let scale = luaL_checknumber(L, 5);
  let variation = luaL_checkinteger(L, 6);
  console.warn('CreateDestructable was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native CreateDestructableZ takes integer objectid, real x, real y, real z, real face, real scale, integer variation returns destructable
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateDestructableZ(L) {
  let objectid = luaL_checkinteger(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  let z = luaL_checknumber(L, 4);
  let face = luaL_checknumber(L, 5);
  let scale = luaL_checknumber(L, 6);
  let variation = luaL_checkinteger(L, 7);
  console.warn('CreateDestructableZ was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native CreateDeadDestructable takes integer objectid, real x, real y, real face, real scale, integer variation returns destructable
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateDeadDestructable(L) {
  let objectid = luaL_checkinteger(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  let face = luaL_checknumber(L, 4);
  let scale = luaL_checknumber(L, 5);
  let variation = luaL_checkinteger(L, 6);
  console.warn('CreateDeadDestructable was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native CreateDeadDestructableZ takes integer objectid, real x, real y, real z, real face, real scale, integer variation returns destructable
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateDeadDestructableZ(L) {
  let objectid = luaL_checkinteger(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  let z = luaL_checknumber(L, 4);
  let face = luaL_checknumber(L, 5);
  let scale = luaL_checknumber(L, 6);
  let variation = luaL_checkinteger(L, 7);
  console.warn('CreateDeadDestructableZ was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native RemoveDestructable takes destructable d returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RemoveDestructable(L) {
  let d = lua_touserdata(L, 1);
  console.warn('RemoveDestructable was called but is not implemented :(');
  return 0
}

/**
 * native KillDestructable takes destructable d returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function KillDestructable(L) {
  let d = lua_touserdata(L, 1);
  console.warn('KillDestructable was called but is not implemented :(');
  return 0
}

/**
 * native SetDestructableInvulnerable takes destructable d, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetDestructableInvulnerable(L) {
  let d = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('SetDestructableInvulnerable was called but is not implemented :(');
  return 0
}

/**
 * native IsDestructableInvulnerable takes destructable d returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsDestructableInvulnerable(L) {
  let d = lua_touserdata(L, 1);
  console.warn('IsDestructableInvulnerable was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native EnumDestructablesInRect takes rect r, boolexpr filter, code actionFunc returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function EnumDestructablesInRect(L) {
  let r = lua_touserdata(L, 1);
  let filter = lua_touserdata(L, 2);
  let actionFunc = luaL_ref(L, LUA_REGISTRYINDEX);
  console.warn('EnumDestructablesInRect was called but is not implemented :(');
  return 0
}

/**
 * native GetDestructableTypeId takes destructable d returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetDestructableTypeId(L) {
  let d = lua_touserdata(L, 1);
  console.warn('GetDestructableTypeId was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native GetDestructableX takes destructable d returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetDestructableX(L) {
  let d = lua_touserdata(L, 1);
  console.warn('GetDestructableX was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native GetDestructableY takes destructable d returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetDestructableY(L) {
  let d = lua_touserdata(L, 1);
  console.warn('GetDestructableY was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native SetDestructableLife takes destructable d, real life returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetDestructableLife(L) {
  let d = lua_touserdata(L, 1);
  let life = luaL_checknumber(L, 2);
  console.warn('SetDestructableLife was called but is not implemented :(');
  return 0
}

/**
 * native GetDestructableLife takes destructable d returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetDestructableLife(L) {
  let d = lua_touserdata(L, 1);
  console.warn('GetDestructableLife was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native SetDestructableMaxLife takes destructable d, real max returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetDestructableMaxLife(L) {
  let d = lua_touserdata(L, 1);
  let max = luaL_checknumber(L, 2);
  console.warn('SetDestructableMaxLife was called but is not implemented :(');
  return 0
}

/**
 * native GetDestructableMaxLife takes destructable d returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetDestructableMaxLife(L) {
  let d = lua_touserdata(L, 1);
  console.warn('GetDestructableMaxLife was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native DestructableRestoreLife takes destructable d, real life, boolean birth returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DestructableRestoreLife(L) {
  let d = lua_touserdata(L, 1);
  let life = luaL_checknumber(L, 2);
  let birth = lua_toboolean(L, 3);
  console.warn('DestructableRestoreLife was called but is not implemented :(');
  return 0
}

/**
 * native QueueDestructableAnimation takes destructable d, string whichAnimation returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function QueueDestructableAnimation(L) {
  let d = lua_touserdata(L, 1);
  let whichAnimation = luaL_checkstring(L, 2);
  console.warn('QueueDestructableAnimation was called but is not implemented :(');
  return 0
}

/**
 * native SetDestructableAnimation takes destructable d, string whichAnimation returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetDestructableAnimation(L) {
  let d = lua_touserdata(L, 1);
  let whichAnimation = luaL_checkstring(L, 2);
  console.warn('SetDestructableAnimation was called but is not implemented :(');
  return 0
}

/**
 * native SetDestructableAnimationSpeed takes destructable d, real speedFactor returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetDestructableAnimationSpeed(L) {
  let d = lua_touserdata(L, 1);
  let speedFactor = luaL_checknumber(L, 2);
  console.warn('SetDestructableAnimationSpeed was called but is not implemented :(');
  return 0
}

/**
 * native ShowDestructable takes destructable d, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ShowDestructable(L) {
  let d = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('ShowDestructable was called but is not implemented :(');
  return 0
}

/**
 * native GetDestructableOccluderHeight takes destructable d returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetDestructableOccluderHeight(L) {
  let d = lua_touserdata(L, 1);
  console.warn('GetDestructableOccluderHeight was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native SetDestructableOccluderHeight takes destructable d, real height returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetDestructableOccluderHeight(L) {
  let d = lua_touserdata(L, 1);
  let height = luaL_checknumber(L, 2);
  console.warn('SetDestructableOccluderHeight was called but is not implemented :(');
  return 0
}

/**
 * native GetDestructableName takes destructable d returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetDestructableName(L) {
  let d = lua_touserdata(L, 1);
  console.warn('GetDestructableName was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * constant native GetTriggerDestructable takes nothing returns destructable
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetTriggerDestructable(L) {

  console.warn('GetTriggerDestructable was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native CreateItem takes integer itemid, real x, real y returns item
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateItem(L) {
  let itemid = luaL_checkinteger(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  console.warn('CreateItem was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native RemoveItem takes item whichItem returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RemoveItem(L) {
  let whichItem = lua_touserdata(L, 1);
  console.warn('RemoveItem was called but is not implemented :(');
  return 0
}

/**
 * native GetItemPlayer takes item whichItem returns player
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetItemPlayer(L) {
  let whichItem = lua_touserdata(L, 1);
  console.warn('GetItemPlayer was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native GetItemTypeId takes item i returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetItemTypeId(L) {
  let i = lua_touserdata(L, 1);
  console.warn('GetItemTypeId was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native GetItemX takes item i returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetItemX(L) {
  let i = lua_touserdata(L, 1);
  console.warn('GetItemX was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native GetItemY takes item i returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetItemY(L) {
  let i = lua_touserdata(L, 1);
  console.warn('GetItemY was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native SetItemPosition takes item i, real x, real y returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetItemPosition(L) {
  let i = lua_touserdata(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  console.warn('SetItemPosition was called but is not implemented :(');
  return 0
}

/**
 * native SetItemDropOnDeath takes item whichItem, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetItemDropOnDeath(L) {
  let whichItem = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('SetItemDropOnDeath was called but is not implemented :(');
  return 0
}

/**
 * native SetItemDroppable takes item i, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetItemDroppable(L) {
  let i = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('SetItemDroppable was called but is not implemented :(');
  return 0
}

/**
 * native SetItemPawnable takes item i, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetItemPawnable(L) {
  let i = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('SetItemPawnable was called but is not implemented :(');
  return 0
}

/**
 * native SetItemPlayer takes item whichItem, player whichPlayer, boolean changeColor returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetItemPlayer(L) {
  let whichItem = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  let changeColor = lua_toboolean(L, 3);
  console.warn('SetItemPlayer was called but is not implemented :(');
  return 0
}

/**
 * native SetItemInvulnerable takes item whichItem, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetItemInvulnerable(L) {
  let whichItem = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('SetItemInvulnerable was called but is not implemented :(');
  return 0
}

/**
 * native IsItemInvulnerable takes item whichItem returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsItemInvulnerable(L) {
  let whichItem = lua_touserdata(L, 1);
  console.warn('IsItemInvulnerable was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SetItemVisible takes item whichItem, boolean show returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetItemVisible(L) {
  let whichItem = lua_touserdata(L, 1);
  let show = lua_toboolean(L, 2);
  console.warn('SetItemVisible was called but is not implemented :(');
  return 0
}

/**
 * native IsItemVisible takes item whichItem returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsItemVisible(L) {
  let whichItem = lua_touserdata(L, 1);
  console.warn('IsItemVisible was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IsItemOwned takes item whichItem returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsItemOwned(L) {
  let whichItem = lua_touserdata(L, 1);
  console.warn('IsItemOwned was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IsItemPowerup takes item whichItem returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsItemPowerup(L) {
  let whichItem = lua_touserdata(L, 1);
  console.warn('IsItemPowerup was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IsItemSellable takes item whichItem returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsItemSellable(L) {
  let whichItem = lua_touserdata(L, 1);
  console.warn('IsItemSellable was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IsItemPawnable takes item whichItem returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsItemPawnable(L) {
  let whichItem = lua_touserdata(L, 1);
  console.warn('IsItemPawnable was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IsItemIdPowerup takes integer itemId returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsItemIdPowerup(L) {
  let itemId = luaL_checkinteger(L, 1);
  console.warn('IsItemIdPowerup was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IsItemIdSellable takes integer itemId returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsItemIdSellable(L) {
  let itemId = luaL_checkinteger(L, 1);
  console.warn('IsItemIdSellable was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IsItemIdPawnable takes integer itemId returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsItemIdPawnable(L) {
  let itemId = luaL_checkinteger(L, 1);
  console.warn('IsItemIdPawnable was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native EnumItemsInRect takes rect r, boolexpr filter, code actionFunc returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function EnumItemsInRect(L) {
  let r = lua_touserdata(L, 1);
  let filter = lua_touserdata(L, 2);
  let actionFunc = luaL_ref(L, LUA_REGISTRYINDEX);
  console.warn('EnumItemsInRect was called but is not implemented :(');
  return 0
}

/**
 * native GetItemLevel takes item whichItem returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetItemLevel(L) {
  let whichItem = lua_touserdata(L, 1);
  console.warn('GetItemLevel was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native GetItemType takes item whichItem returns itemtype
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetItemType(L) {
  let whichItem = lua_touserdata(L, 1);
  console.warn('GetItemType was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native SetItemDropID takes item whichItem, integer unitId returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetItemDropID(L) {
  let whichItem = lua_touserdata(L, 1);
  let unitId = luaL_checkinteger(L, 2);
  console.warn('SetItemDropID was called but is not implemented :(');
  return 0
}

/**
 * constant native GetItemName takes item whichItem returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetItemName(L) {
  let whichItem = lua_touserdata(L, 1);
  console.warn('GetItemName was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native GetItemCharges takes item whichItem returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetItemCharges(L) {
  let whichItem = lua_touserdata(L, 1);
  console.warn('GetItemCharges was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native SetItemCharges takes item whichItem, integer charges returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetItemCharges(L) {
  let whichItem = lua_touserdata(L, 1);
  let charges = luaL_checkinteger(L, 2);
  console.warn('SetItemCharges was called but is not implemented :(');
  return 0
}

/**
 * native GetItemUserData takes item whichItem returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetItemUserData(L) {
  let whichItem = lua_touserdata(L, 1);
  console.warn('GetItemUserData was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native SetItemUserData takes item whichItem, integer data returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetItemUserData(L) {
  let whichItem = lua_touserdata(L, 1);
  let data = luaL_checkinteger(L, 2);
  console.warn('SetItemUserData was called but is not implemented :(');
  return 0
}

/**
 * native CreateUnit takes player id, integer unitid, real x, real y, real face returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateUnit(L) {
  let id = lua_touserdata(L, 1);
  let unitid = luaL_checkinteger(L, 2);
  let x = luaL_checknumber(L, 3);
  let y = luaL_checknumber(L, 4);
  let face = luaL_checknumber(L, 5);

  lua_pushlightuserdata(L, this.addHandle(new JassUnit(id, unitid, x, y, face)));

  return 1;
}

/**
 * native CreateUnitByName takes player whichPlayer, string unitname, real x, real y, real face returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateUnitByName(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let unitname = luaL_checkstring(L, 2);
  let x = luaL_checknumber(L, 3);
  let y = luaL_checknumber(L, 4);
  let face = luaL_checknumber(L, 5);
  console.warn('CreateUnitByName was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native CreateUnitAtLoc takes player id, integer unitid, location whichLocation, real face returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateUnitAtLoc(L) {
  let id = lua_touserdata(L, 1);
  let unitid = luaL_checkinteger(L, 2);
  let whichLocation = lua_touserdata(L, 3);
  let face = luaL_checknumber(L, 4);
  console.warn('CreateUnitAtLoc was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native CreateUnitAtLocByName takes player id, string unitname, location whichLocation, real face returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateUnitAtLocByName(L) {
  let id = lua_touserdata(L, 1);
  let unitname = luaL_checkstring(L, 2);
  let whichLocation = lua_touserdata(L, 3);
  let face = luaL_checknumber(L, 4);
  console.warn('CreateUnitAtLocByName was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native CreateCorpse takes player whichPlayer, integer unitid, real x, real y, real face returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateCorpse(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let unitid = luaL_checkinteger(L, 2);
  let x = luaL_checknumber(L, 3);
  let y = luaL_checknumber(L, 4);
  let face = luaL_checknumber(L, 5);
  console.warn('CreateCorpse was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native KillUnit takes unit whichUnit returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function KillUnit(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('KillUnit was called but is not implemented :(');
  return 0
}

/**
 * native RemoveUnit takes unit whichUnit returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RemoveUnit(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('RemoveUnit was called but is not implemented :(');
  return 0
}

/**
 * native ShowUnit takes unit whichUnit, boolean show returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ShowUnit(L) {
  let whichUnit = lua_touserdata(L, 1);
  let show = lua_toboolean(L, 2);
  console.warn('ShowUnit was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitState takes unit whichUnit, unitstate whichUnitState, real newVal returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitState(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichUnitState = lua_touserdata(L, 2);
  let newVal = luaL_checknumber(L, 3);
  console.warn('SetUnitState was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitX takes unit whichUnit, real newX returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitX(L) {
  let whichUnit = lua_touserdata(L, 1);
  let newX = luaL_checknumber(L, 2);
  console.warn('SetUnitX was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitY takes unit whichUnit, real newY returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitY(L) {
  let whichUnit = lua_touserdata(L, 1);
  let newY = luaL_checknumber(L, 2);
  console.warn('SetUnitY was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitPosition takes unit whichUnit, real newX, real newY returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitPosition(L) {
  let whichUnit = lua_touserdata(L, 1);
  let newX = luaL_checknumber(L, 2);
  let newY = luaL_checknumber(L, 3);
  console.warn('SetUnitPosition was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitPositionLoc takes unit whichUnit, location whichLocation returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitPositionLoc(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichLocation = lua_touserdata(L, 2);
  console.warn('SetUnitPositionLoc was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitFacing takes unit whichUnit, real facingAngle returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitFacing(L) {
  let whichUnit = lua_touserdata(L, 1);
  let facingAngle = luaL_checknumber(L, 2);
  console.warn('SetUnitFacing was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitFacingTimed takes unit whichUnit, real facingAngle, real duration returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitFacingTimed(L) {
  let whichUnit = lua_touserdata(L, 1);
  let facingAngle = luaL_checknumber(L, 2);
  let duration = luaL_checknumber(L, 3);
  console.warn('SetUnitFacingTimed was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitMoveSpeed takes unit whichUnit, real newSpeed returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitMoveSpeed(L) {
  let whichUnit = lua_touserdata(L, 1);
  let newSpeed = luaL_checknumber(L, 2);
  console.warn('SetUnitMoveSpeed was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitFlyHeight takes unit whichUnit, real newHeight, real rate returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitFlyHeight(L) {
  let whichUnit = lua_touserdata(L, 1);
  let newHeight = luaL_checknumber(L, 2);
  let rate = luaL_checknumber(L, 3);
  console.warn('SetUnitFlyHeight was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitTurnSpeed takes unit whichUnit, real newTurnSpeed returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitTurnSpeed(L) {
  let whichUnit = lua_touserdata(L, 1);
  let newTurnSpeed = luaL_checknumber(L, 2);
  console.warn('SetUnitTurnSpeed was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitPropWindow takes unit whichUnit, real newPropWindowAngle returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitPropWindow(L) {
  let whichUnit = lua_touserdata(L, 1);
  let newPropWindowAngle = luaL_checknumber(L, 2);
  console.warn('SetUnitPropWindow was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitAcquireRange takes unit whichUnit, real newAcquireRange returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitAcquireRange(L) {
  let whichUnit = lua_touserdata(L, 1);
  let newAcquireRange = luaL_checknumber(L, 2);
  console.warn('SetUnitAcquireRange was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitCreepGuard takes unit whichUnit, boolean creepGuard returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitCreepGuard(L) {
  let whichUnit = lua_touserdata(L, 1);
  let creepGuard = lua_toboolean(L, 2);
  console.warn('SetUnitCreepGuard was called but is not implemented :(');
  return 0
}

/**
 * native GetUnitAcquireRange takes unit whichUnit returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitAcquireRange(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitAcquireRange was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native GetUnitTurnSpeed takes unit whichUnit returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitTurnSpeed(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitTurnSpeed was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native GetUnitPropWindow takes unit whichUnit returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitPropWindow(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitPropWindow was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native GetUnitFlyHeight takes unit whichUnit returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitFlyHeight(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitFlyHeight was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native GetUnitDefaultAcquireRange takes unit whichUnit returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitDefaultAcquireRange(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitDefaultAcquireRange was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native GetUnitDefaultTurnSpeed takes unit whichUnit returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitDefaultTurnSpeed(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitDefaultTurnSpeed was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native GetUnitDefaultPropWindow takes unit whichUnit returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitDefaultPropWindow(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitDefaultPropWindow was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native GetUnitDefaultFlyHeight takes unit whichUnit returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitDefaultFlyHeight(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitDefaultFlyHeight was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native SetUnitOwner takes unit whichUnit, player whichPlayer, boolean changeColor returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitOwner(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  let changeColor = lua_toboolean(L, 3);
  console.warn('SetUnitOwner was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitColor takes unit whichUnit, playercolor whichColor returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitColor(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichColor = lua_touserdata(L, 2);
  console.warn('SetUnitColor was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitScale takes unit whichUnit, real scaleX, real scaleY, real scaleZ returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitScale(L) {
  let whichUnit = lua_touserdata(L, 1);
  let scaleX = luaL_checknumber(L, 2);
  let scaleY = luaL_checknumber(L, 3);
  let scaleZ = luaL_checknumber(L, 4);
  console.warn('SetUnitScale was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitTimeScale takes unit whichUnit, real timeScale returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitTimeScale(L) {
  let whichUnit = lua_touserdata(L, 1);
  let timeScale = luaL_checknumber(L, 2);
  console.warn('SetUnitTimeScale was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitBlendTime takes unit whichUnit, real blendTime returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitBlendTime(L) {
  let whichUnit = lua_touserdata(L, 1);
  let blendTime = luaL_checknumber(L, 2);
  console.warn('SetUnitBlendTime was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitVertexColor takes unit whichUnit, integer red, integer green, integer blue, integer alpha returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitVertexColor(L) {
  let whichUnit = lua_touserdata(L, 1);
  let red = luaL_checkinteger(L, 2);
  let green = luaL_checkinteger(L, 3);
  let blue = luaL_checkinteger(L, 4);
  let alpha = luaL_checkinteger(L, 5);
  console.warn('SetUnitVertexColor was called but is not implemented :(');
  return 0
}

/**
 * native QueueUnitAnimation takes unit whichUnit, string whichAnimation returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function QueueUnitAnimation(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichAnimation = luaL_checkstring(L, 2);
  console.warn('QueueUnitAnimation was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitAnimation takes unit whichUnit, string whichAnimation returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitAnimation(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichAnimation = luaL_checkstring(L, 2);
  console.warn('SetUnitAnimation was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitAnimationByIndex takes unit whichUnit, integer whichAnimation returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitAnimationByIndex(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichAnimation = luaL_checkinteger(L, 2);
  console.warn('SetUnitAnimationByIndex was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitAnimationWithRarity takes unit whichUnit, string whichAnimation, raritycontrol rarity returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitAnimationWithRarity(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichAnimation = luaL_checkstring(L, 2);
  let rarity = lua_touserdata(L, 3);
  console.warn('SetUnitAnimationWithRarity was called but is not implemented :(');
  return 0
}

/**
 * native AddUnitAnimationProperties takes unit whichUnit, string animProperties, boolean add returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AddUnitAnimationProperties(L) {
  let whichUnit = lua_touserdata(L, 1);
  let animProperties = luaL_checkstring(L, 2);
  let add = lua_toboolean(L, 3);
  console.warn('AddUnitAnimationProperties was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitLookAt takes unit whichUnit, string whichBone, unit lookAtTarget, real offsetX, real offsetY, real offsetZ returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitLookAt(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichBone = luaL_checkstring(L, 2);
  let lookAtTarget = lua_touserdata(L, 3);
  let offsetX = luaL_checknumber(L, 4);
  let offsetY = luaL_checknumber(L, 5);
  let offsetZ = luaL_checknumber(L, 6);
  console.warn('SetUnitLookAt was called but is not implemented :(');
  return 0
}

/**
 * native ResetUnitLookAt takes unit whichUnit returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ResetUnitLookAt(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('ResetUnitLookAt was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitRescuable takes unit whichUnit, player byWhichPlayer, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitRescuable(L) {
  let whichUnit = lua_touserdata(L, 1);
  let byWhichPlayer = lua_touserdata(L, 2);
  let flag = lua_toboolean(L, 3);
  console.warn('SetUnitRescuable was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitRescueRange takes unit whichUnit, real range returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitRescueRange(L) {
  let whichUnit = lua_touserdata(L, 1);
  let range = luaL_checknumber(L, 2);
  console.warn('SetUnitRescueRange was called but is not implemented :(');
  return 0
}

/**
 * native SetHeroStr takes unit whichHero, integer newStr, boolean permanent returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetHeroStr(L) {
  let whichHero = lua_touserdata(L, 1);
  let newStr = luaL_checkinteger(L, 2);
  let permanent = lua_toboolean(L, 3);
  console.warn('SetHeroStr was called but is not implemented :(');
  return 0
}

/**
 * native SetHeroAgi takes unit whichHero, integer newAgi, boolean permanent returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetHeroAgi(L) {
  let whichHero = lua_touserdata(L, 1);
  let newAgi = luaL_checkinteger(L, 2);
  let permanent = lua_toboolean(L, 3);
  console.warn('SetHeroAgi was called but is not implemented :(');
  return 0
}

/**
 * native SetHeroInt takes unit whichHero, integer newInt, boolean permanent returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetHeroInt(L) {
  let whichHero = lua_touserdata(L, 1);
  let newInt = luaL_checkinteger(L, 2);
  let permanent = lua_toboolean(L, 3);
  console.warn('SetHeroInt was called but is not implemented :(');
  return 0
}

/**
 * native GetHeroStr takes unit whichHero, boolean includeBonuses returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetHeroStr(L) {
  let whichHero = lua_touserdata(L, 1);
  let includeBonuses = lua_toboolean(L, 2);
  console.warn('GetHeroStr was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native GetHeroAgi takes unit whichHero, boolean includeBonuses returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetHeroAgi(L) {
  let whichHero = lua_touserdata(L, 1);
  let includeBonuses = lua_toboolean(L, 2);
  console.warn('GetHeroAgi was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native GetHeroInt takes unit whichHero, boolean includeBonuses returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetHeroInt(L) {
  let whichHero = lua_touserdata(L, 1);
  let includeBonuses = lua_toboolean(L, 2);
  console.warn('GetHeroInt was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native UnitStripHeroLevel takes unit whichHero, integer howManyLevels returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitStripHeroLevel(L) {
  let whichHero = lua_touserdata(L, 1);
  let howManyLevels = luaL_checkinteger(L, 2);
  console.warn('UnitStripHeroLevel was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native GetHeroXP takes unit whichHero returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetHeroXP(L) {
  let whichHero = lua_touserdata(L, 1);
  console.warn('GetHeroXP was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native SetHeroXP takes unit whichHero, integer newXpVal, boolean showEyeCandy returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetHeroXP(L) {
  let whichHero = lua_touserdata(L, 1);
  let newXpVal = luaL_checkinteger(L, 2);
  let showEyeCandy = lua_toboolean(L, 3);
  console.warn('SetHeroXP was called but is not implemented :(');
  return 0
}

/**
 * native GetHeroSkillPoints takes unit whichHero returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetHeroSkillPoints(L) {
  let whichHero = lua_touserdata(L, 1);
  console.warn('GetHeroSkillPoints was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native UnitModifySkillPoints takes unit whichHero, integer skillPointDelta returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitModifySkillPoints(L) {
  let whichHero = lua_touserdata(L, 1);
  let skillPointDelta = luaL_checkinteger(L, 2);
  console.warn('UnitModifySkillPoints was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native AddHeroXP takes unit whichHero, integer xpToAdd, boolean showEyeCandy returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AddHeroXP(L) {
  let whichHero = lua_touserdata(L, 1);
  let xpToAdd = luaL_checkinteger(L, 2);
  let showEyeCandy = lua_toboolean(L, 3);
  console.warn('AddHeroXP was called but is not implemented :(');
  return 0
}

/**
 * native SetHeroLevel takes unit whichHero, integer level, boolean showEyeCandy returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetHeroLevel(L) {
  let whichHero = lua_touserdata(L, 1);
  let level = luaL_checkinteger(L, 2);
  let showEyeCandy = lua_toboolean(L, 3);
  console.warn('SetHeroLevel was called but is not implemented :(');
  return 0
}

/**
 * constant native GetHeroLevel takes unit whichHero returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetHeroLevel(L) {
  let whichHero = lua_touserdata(L, 1);
  console.warn('GetHeroLevel was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * constant native GetUnitLevel takes unit whichUnit returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitLevel(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitLevel was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native GetHeroProperName takes unit whichHero returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetHeroProperName(L) {
  let whichHero = lua_touserdata(L, 1);
  console.warn('GetHeroProperName was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native SuspendHeroXP takes unit whichHero, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SuspendHeroXP(L) {
  let whichHero = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('SuspendHeroXP was called but is not implemented :(');
  return 0
}

/**
 * native IsSuspendedXP takes unit whichHero returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsSuspendedXP(L) {
  let whichHero = lua_touserdata(L, 1);
  console.warn('IsSuspendedXP was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SelectHeroSkill takes unit whichHero, integer abilcode returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SelectHeroSkill(L) {
  let whichHero = lua_touserdata(L, 1);
  let abilcode = luaL_checkinteger(L, 2);
  console.warn('SelectHeroSkill was called but is not implemented :(');
  return 0
}

/**
 * native GetUnitAbilityLevel takes unit whichUnit, integer abilcode returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitAbilityLevel(L) {
  let whichUnit = lua_touserdata(L, 1);
  let abilcode = luaL_checkinteger(L, 2);
  console.warn('GetUnitAbilityLevel was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native DecUnitAbilityLevel takes unit whichUnit, integer abilcode returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DecUnitAbilityLevel(L) {
  let whichUnit = lua_touserdata(L, 1);
  let abilcode = luaL_checkinteger(L, 2);
  console.warn('DecUnitAbilityLevel was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native IncUnitAbilityLevel takes unit whichUnit, integer abilcode returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IncUnitAbilityLevel(L) {
  let whichUnit = lua_touserdata(L, 1);
  let abilcode = luaL_checkinteger(L, 2);
  console.warn('IncUnitAbilityLevel was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native SetUnitAbilityLevel takes unit whichUnit, integer abilcode, integer level returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitAbilityLevel(L) {
  let whichUnit = lua_touserdata(L, 1);
  let abilcode = luaL_checkinteger(L, 2);
  let level = luaL_checkinteger(L, 3);
  console.warn('SetUnitAbilityLevel was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native ReviveHero takes unit whichHero, real x, real y, boolean doEyecandy returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ReviveHero(L) {
  let whichHero = lua_touserdata(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  let doEyecandy = lua_toboolean(L, 4);
  console.warn('ReviveHero was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native ReviveHeroLoc takes unit whichHero, location loc, boolean doEyecandy returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ReviveHeroLoc(L) {
  let whichHero = lua_touserdata(L, 1);
  let loc = lua_touserdata(L, 2);
  let doEyecandy = lua_toboolean(L, 3);
  console.warn('ReviveHeroLoc was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SetUnitExploded takes unit whichUnit, boolean exploded returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitExploded(L) {
  let whichUnit = lua_touserdata(L, 1);
  let exploded = lua_toboolean(L, 2);
  console.warn('SetUnitExploded was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitInvulnerable takes unit whichUnit, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitInvulnerable(L) {
  let whichUnit = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('SetUnitInvulnerable was called but is not implemented :(');
  return 0
}

/**
 * native PauseUnit takes unit whichUnit, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PauseUnit(L) {
  let whichUnit = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('PauseUnit was called but is not implemented :(');
  return 0
}

/**
 * native IsUnitPaused takes unit whichHero returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsUnitPaused(L) {
  let whichHero = lua_touserdata(L, 1);
  console.warn('IsUnitPaused was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SetUnitPathing takes unit whichUnit, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitPathing(L) {
  let whichUnit = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('SetUnitPathing was called but is not implemented :(');
  return 0
}

/**
 * native ClearSelection takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ClearSelection(L) {

  console.warn('ClearSelection was called but is not implemented :(');
  return 0
}

/**
 * native SelectUnit takes unit whichUnit, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SelectUnit(L) {
  let whichUnit = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('SelectUnit was called but is not implemented :(');
  return 0
}

/**
 * native GetUnitPointValue takes unit whichUnit returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitPointValue(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitPointValue was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native GetUnitPointValueByType takes integer unitType returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitPointValueByType(L) {
  let unitType = luaL_checkinteger(L, 1);
  console.warn('GetUnitPointValueByType was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native UnitAddItem takes unit whichUnit, item whichItem returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitAddItem(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichItem = lua_touserdata(L, 2);
  console.warn('UnitAddItem was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native UnitAddItemById takes unit whichUnit, integer itemId returns item
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitAddItemById(L) {
  let whichUnit = lua_touserdata(L, 1);
  let itemId = luaL_checkinteger(L, 2);
  console.warn('UnitAddItemById was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native UnitAddItemToSlotById takes unit whichUnit, integer itemId, integer itemSlot returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitAddItemToSlotById(L) {
  let whichUnit = lua_touserdata(L, 1);
  let itemId = luaL_checkinteger(L, 2);
  let itemSlot = luaL_checkinteger(L, 3);
  console.warn('UnitAddItemToSlotById was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native UnitRemoveItem takes unit whichUnit, item whichItem returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitRemoveItem(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichItem = lua_touserdata(L, 2);
  console.warn('UnitRemoveItem was called but is not implemented :(');
  return 0
}

/**
 * native UnitRemoveItemFromSlot takes unit whichUnit, integer itemSlot returns item
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitRemoveItemFromSlot(L) {
  let whichUnit = lua_touserdata(L, 1);
  let itemSlot = luaL_checkinteger(L, 2);
  console.warn('UnitRemoveItemFromSlot was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native UnitHasItem takes unit whichUnit, item whichItem returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitHasItem(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichItem = lua_touserdata(L, 2);
  console.warn('UnitHasItem was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native UnitItemInSlot takes unit whichUnit, integer itemSlot returns item
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitItemInSlot(L) {
  let whichUnit = lua_touserdata(L, 1);
  let itemSlot = luaL_checkinteger(L, 2);
  console.warn('UnitItemInSlot was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native UnitInventorySize takes unit whichUnit returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitInventorySize(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('UnitInventorySize was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native UnitDropItemPoint takes unit whichUnit, item whichItem, real x, real y returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitDropItemPoint(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichItem = lua_touserdata(L, 2);
  let x = luaL_checknumber(L, 3);
  let y = luaL_checknumber(L, 4);
  console.warn('UnitDropItemPoint was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native UnitDropItemSlot takes unit whichUnit, item whichItem, integer slot returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitDropItemSlot(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichItem = lua_touserdata(L, 2);
  let slot = luaL_checkinteger(L, 3);
  console.warn('UnitDropItemSlot was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native UnitDropItemTarget takes unit whichUnit, item whichItem, widget target returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitDropItemTarget(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichItem = lua_touserdata(L, 2);
  let target = lua_touserdata(L, 3);
  console.warn('UnitDropItemTarget was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native UnitUseItem takes unit whichUnit, item whichItem returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitUseItem(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichItem = lua_touserdata(L, 2);
  console.warn('UnitUseItem was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native UnitUseItemPoint takes unit whichUnit, item whichItem, real x, real y returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitUseItemPoint(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichItem = lua_touserdata(L, 2);
  let x = luaL_checknumber(L, 3);
  let y = luaL_checknumber(L, 4);
  console.warn('UnitUseItemPoint was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native UnitUseItemTarget takes unit whichUnit, item whichItem, widget target returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitUseItemTarget(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichItem = lua_touserdata(L, 2);
  let target = lua_touserdata(L, 3);
  console.warn('UnitUseItemTarget was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native GetUnitX takes unit whichUnit returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitX(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitX was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetUnitY takes unit whichUnit returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitY(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitY was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetUnitLoc takes unit whichUnit returns location
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitLoc(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitLoc was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetUnitFacing takes unit whichUnit returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitFacing(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitFacing was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetUnitMoveSpeed takes unit whichUnit returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitMoveSpeed(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitMoveSpeed was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetUnitDefaultMoveSpeed takes unit whichUnit returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitDefaultMoveSpeed(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitDefaultMoveSpeed was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetUnitState takes unit whichUnit, unitstate whichUnitState returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitState(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichUnitState = lua_touserdata(L, 2);
  console.warn('GetUnitState was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetOwningPlayer takes unit whichUnit returns player
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetOwningPlayer(L) {
  let whichUnit = lua_touserdata(L, 1);

  lua_pushlightuserdata(L, whichUnit.player);

  return 1;
}

/**
 * constant native GetUnitTypeId takes unit whichUnit returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitTypeId(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitTypeId was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * constant native GetUnitRace takes unit whichUnit returns race
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitRace(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitRace was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetUnitName takes unit whichUnit returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitName(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitName was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * constant native GetUnitFoodUsed takes unit whichUnit returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitFoodUsed(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitFoodUsed was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * constant native GetUnitFoodMade takes unit whichUnit returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitFoodMade(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitFoodMade was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * constant native GetFoodMade takes integer unitId returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetFoodMade(L) {
  let unitId = luaL_checkinteger(L, 1);
  console.warn('GetFoodMade was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * constant native GetFoodUsed takes integer unitId returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetFoodUsed(L) {
  let unitId = luaL_checkinteger(L, 1);
  console.warn('GetFoodUsed was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native SetUnitUseFood takes unit whichUnit, boolean useFood returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitUseFood(L) {
  let whichUnit = lua_touserdata(L, 1);
  let useFood = lua_toboolean(L, 2);
  console.warn('SetUnitUseFood was called but is not implemented :(');
  return 0
}

/**
 * constant native GetUnitRallyPoint takes unit whichUnit returns location
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitRallyPoint(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitRallyPoint was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetUnitRallyUnit takes unit whichUnit returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitRallyUnit(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitRallyUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetUnitRallyDestructable takes unit whichUnit returns destructable
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitRallyDestructable(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitRallyDestructable was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native IsUnitInGroup takes unit whichUnit, group whichGroup returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsUnitInGroup(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichGroup = lua_touserdata(L, 2);
  console.warn('IsUnitInGroup was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsUnitInForce takes unit whichUnit, force whichForce returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsUnitInForce(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichForce = lua_touserdata(L, 2);
  console.warn('IsUnitInForce was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsUnitOwnedByPlayer takes unit whichUnit, player whichPlayer returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsUnitOwnedByPlayer(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  console.warn('IsUnitOwnedByPlayer was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsUnitAlly takes unit whichUnit, player whichPlayer returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsUnitAlly(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  console.warn('IsUnitAlly was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsUnitEnemy takes unit whichUnit, player whichPlayer returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsUnitEnemy(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  console.warn('IsUnitEnemy was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsUnitVisible takes unit whichUnit, player whichPlayer returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsUnitVisible(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  console.warn('IsUnitVisible was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsUnitDetected takes unit whichUnit, player whichPlayer returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsUnitDetected(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  console.warn('IsUnitDetected was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsUnitInvisible takes unit whichUnit, player whichPlayer returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsUnitInvisible(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  console.warn('IsUnitInvisible was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsUnitFogged takes unit whichUnit, player whichPlayer returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsUnitFogged(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  console.warn('IsUnitFogged was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsUnitMasked takes unit whichUnit, player whichPlayer returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsUnitMasked(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  console.warn('IsUnitMasked was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsUnitSelected takes unit whichUnit, player whichPlayer returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsUnitSelected(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  console.warn('IsUnitSelected was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsUnitRace takes unit whichUnit, race whichRace returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsUnitRace(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichRace = lua_touserdata(L, 2);
  console.warn('IsUnitRace was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsUnitType takes unit whichUnit, unittype whichUnitType returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsUnitType(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichUnitType = lua_touserdata(L, 2);
  console.warn('IsUnitType was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsUnit takes unit whichUnit, unit whichSpecifiedUnit returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsUnit(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichSpecifiedUnit = lua_touserdata(L, 2);
  console.warn('IsUnit was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsUnitInRange takes unit whichUnit, unit otherUnit, real distance returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsUnitInRange(L) {
  let whichUnit = lua_touserdata(L, 1);
  let otherUnit = lua_touserdata(L, 2);
  let distance = luaL_checknumber(L, 3);
  console.warn('IsUnitInRange was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsUnitInRangeXY takes unit whichUnit, real x, real y, real distance returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsUnitInRangeXY(L) {
  let whichUnit = lua_touserdata(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  let distance = luaL_checknumber(L, 4);
  console.warn('IsUnitInRangeXY was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsUnitInRangeLoc takes unit whichUnit, location whichLocation, real distance returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsUnitInRangeLoc(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichLocation = lua_touserdata(L, 2);
  let distance = luaL_checknumber(L, 3);
  console.warn('IsUnitInRangeLoc was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsUnitHidden takes unit whichUnit returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsUnitHidden(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('IsUnitHidden was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsUnitIllusion takes unit whichUnit returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsUnitIllusion(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('IsUnitIllusion was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsUnitInTransport takes unit whichUnit, unit whichTransport returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsUnitInTransport(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichTransport = lua_touserdata(L, 2);
  console.warn('IsUnitInTransport was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsUnitLoaded takes unit whichUnit returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsUnitLoaded(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('IsUnitLoaded was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsHeroUnitId takes integer unitId returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsHeroUnitId(L) {
  let unitId = luaL_checkinteger(L, 1);
  console.warn('IsHeroUnitId was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsUnitIdType takes integer unitId, unittype whichUnitType returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsUnitIdType(L) {
  let unitId = luaL_checkinteger(L, 1);
  let whichUnitType = lua_touserdata(L, 2);
  console.warn('IsUnitIdType was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native UnitShareVision takes unit whichUnit, player whichPlayer, boolean share returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitShareVision(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  let share = lua_toboolean(L, 3);
  console.warn('UnitShareVision was called but is not implemented :(');
  return 0
}

/**
 * native UnitSuspendDecay takes unit whichUnit, boolean suspend returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitSuspendDecay(L) {
  let whichUnit = lua_touserdata(L, 1);
  let suspend = lua_toboolean(L, 2);
  console.warn('UnitSuspendDecay was called but is not implemented :(');
  return 0
}

/**
 * native UnitAddType takes unit whichUnit, unittype whichUnitType returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitAddType(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichUnitType = lua_touserdata(L, 2);
  console.warn('UnitAddType was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native UnitRemoveType takes unit whichUnit, unittype whichUnitType returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitRemoveType(L) {
  let whichUnit = lua_touserdata(L, 1);
  let whichUnitType = lua_touserdata(L, 2);
  console.warn('UnitRemoveType was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native UnitAddAbility takes unit whichUnit, integer abilityId returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitAddAbility(L) {
  let whichUnit = lua_touserdata(L, 1);
  let abilityId = luaL_checkinteger(L, 2);
  console.warn('UnitAddAbility was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native UnitRemoveAbility takes unit whichUnit, integer abilityId returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitRemoveAbility(L) {
  let whichUnit = lua_touserdata(L, 1);
  let abilityId = luaL_checkinteger(L, 2);
  console.warn('UnitRemoveAbility was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native UnitMakeAbilityPermanent takes unit whichUnit, boolean permanent, integer abilityId returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitMakeAbilityPermanent(L) {
  let whichUnit = lua_touserdata(L, 1);
  let permanent = lua_toboolean(L, 2);
  let abilityId = luaL_checkinteger(L, 3);
  console.warn('UnitMakeAbilityPermanent was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native UnitRemoveBuffs takes unit whichUnit, boolean removePositive, boolean removeNegative returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitRemoveBuffs(L) {
  let whichUnit = lua_touserdata(L, 1);
  let removePositive = lua_toboolean(L, 2);
  let removeNegative = lua_toboolean(L, 3);
  console.warn('UnitRemoveBuffs was called but is not implemented :(');
  return 0
}

/**
 * native UnitRemoveBuffsEx takes unit whichUnit, boolean removePositive, boolean removeNegative, boolean magic, boolean physical, boolean timedLife, boolean aura, boolean autoDispel returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitRemoveBuffsEx(L) {
  let whichUnit = lua_touserdata(L, 1);
  let removePositive = lua_toboolean(L, 2);
  let removeNegative = lua_toboolean(L, 3);
  let magic = lua_toboolean(L, 4);
  let physical = lua_toboolean(L, 5);
  let timedLife = lua_toboolean(L, 6);
  let aura = lua_toboolean(L, 7);
  let autoDispel = lua_toboolean(L, 8);
  console.warn('UnitRemoveBuffsEx was called but is not implemented :(');
  return 0
}

/**
 * native UnitHasBuffsEx takes unit whichUnit, boolean removePositive, boolean removeNegative, boolean magic, boolean physical, boolean timedLife, boolean aura, boolean autoDispel returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitHasBuffsEx(L) {
  let whichUnit = lua_touserdata(L, 1);
  let removePositive = lua_toboolean(L, 2);
  let removeNegative = lua_toboolean(L, 3);
  let magic = lua_toboolean(L, 4);
  let physical = lua_toboolean(L, 5);
  let timedLife = lua_toboolean(L, 6);
  let aura = lua_toboolean(L, 7);
  let autoDispel = lua_toboolean(L, 8);
  console.warn('UnitHasBuffsEx was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native UnitCountBuffsEx takes unit whichUnit, boolean removePositive, boolean removeNegative, boolean magic, boolean physical, boolean timedLife, boolean aura, boolean autoDispel returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitCountBuffsEx(L) {
  let whichUnit = lua_touserdata(L, 1);
  let removePositive = lua_toboolean(L, 2);
  let removeNegative = lua_toboolean(L, 3);
  let magic = lua_toboolean(L, 4);
  let physical = lua_toboolean(L, 5);
  let timedLife = lua_toboolean(L, 6);
  let aura = lua_toboolean(L, 7);
  let autoDispel = lua_toboolean(L, 8);
  console.warn('UnitCountBuffsEx was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native UnitAddSleep takes unit whichUnit, boolean add returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitAddSleep(L) {
  let whichUnit = lua_touserdata(L, 1);
  let add = lua_toboolean(L, 2);
  console.warn('UnitAddSleep was called but is not implemented :(');
  return 0
}

/**
 * native UnitCanSleep takes unit whichUnit returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitCanSleep(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('UnitCanSleep was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native UnitAddSleepPerm takes unit whichUnit, boolean add returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitAddSleepPerm(L) {
  let whichUnit = lua_touserdata(L, 1);
  let add = lua_toboolean(L, 2);
  console.warn('UnitAddSleepPerm was called but is not implemented :(');
  return 0
}

/**
 * native UnitCanSleepPerm takes unit whichUnit returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitCanSleepPerm(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('UnitCanSleepPerm was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native UnitIsSleeping takes unit whichUnit returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitIsSleeping(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('UnitIsSleeping was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native UnitWakeUp takes unit whichUnit returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitWakeUp(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('UnitWakeUp was called but is not implemented :(');
  return 0
}

/**
 * native UnitApplyTimedLife takes unit whichUnit, integer buffId, real duration returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitApplyTimedLife(L) {
  let whichUnit = lua_touserdata(L, 1);
  let buffId = luaL_checkinteger(L, 2);
  let duration = luaL_checknumber(L, 3);
  console.warn('UnitApplyTimedLife was called but is not implemented :(');
  return 0
}

/**
 * native UnitIgnoreAlarm takes unit whichUnit, boolean flag returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitIgnoreAlarm(L) {
  let whichUnit = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('UnitIgnoreAlarm was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native UnitIgnoreAlarmToggled takes unit whichUnit returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitIgnoreAlarmToggled(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('UnitIgnoreAlarmToggled was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native UnitResetCooldown takes unit whichUnit returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitResetCooldown(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('UnitResetCooldown was called but is not implemented :(');
  return 0
}

/**
 * native UnitSetConstructionProgress takes unit whichUnit, integer constructionPercentage returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitSetConstructionProgress(L) {
  let whichUnit = lua_touserdata(L, 1);
  let constructionPercentage = luaL_checkinteger(L, 2);
  console.warn('UnitSetConstructionProgress was called but is not implemented :(');
  return 0
}

/**
 * native UnitSetUpgradeProgress takes unit whichUnit, integer upgradePercentage returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitSetUpgradeProgress(L) {
  let whichUnit = lua_touserdata(L, 1);
  let upgradePercentage = luaL_checkinteger(L, 2);
  console.warn('UnitSetUpgradeProgress was called but is not implemented :(');
  return 0
}

/**
 * native UnitPauseTimedLife takes unit whichUnit, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitPauseTimedLife(L) {
  let whichUnit = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('UnitPauseTimedLife was called but is not implemented :(');
  return 0
}

/**
 * native UnitSetUsesAltIcon takes unit whichUnit, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitSetUsesAltIcon(L) {
  let whichUnit = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('UnitSetUsesAltIcon was called but is not implemented :(');
  return 0
}

/**
 * native UnitDamagePoint takes unit whichUnit, real delay, real radius, real x, real y, real amount, boolean attack, boolean ranged, attacktype attackType, damagetype damageType, weapontype weaponType returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitDamagePoint(L) {
  let whichUnit = lua_touserdata(L, 1);
  let delay = luaL_checknumber(L, 2);
  let radius = luaL_checknumber(L, 3);
  let x = luaL_checknumber(L, 4);
  let y = luaL_checknumber(L, 5);
  let amount = luaL_checknumber(L, 6);
  let attack = lua_toboolean(L, 7);
  let ranged = lua_toboolean(L, 8);
  let attackType = lua_touserdata(L, 9);
  let damageType = lua_touserdata(L, 10);
  let weaponType = lua_touserdata(L, 11);
  console.warn('UnitDamagePoint was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native UnitDamageTarget takes unit whichUnit, widget target, real amount, boolean attack, boolean ranged, attacktype attackType, damagetype damageType, weapontype weaponType returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitDamageTarget(L) {
  let whichUnit = lua_touserdata(L, 1);
  let target = lua_touserdata(L, 2);
  let amount = luaL_checknumber(L, 3);
  let attack = lua_toboolean(L, 4);
  let ranged = lua_toboolean(L, 5);
  let attackType = lua_touserdata(L, 6);
  let damageType = lua_touserdata(L, 7);
  let weaponType = lua_touserdata(L, 8);
  console.warn('UnitDamageTarget was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IssueImmediateOrder takes unit whichUnit, string order returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IssueImmediateOrder(L) {
  let whichUnit = lua_touserdata(L, 1);
  let order = luaL_checkstring(L, 2);
  console.warn('IssueImmediateOrder was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IssueImmediateOrderById takes unit whichUnit, integer order returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IssueImmediateOrderById(L) {
  let whichUnit = lua_touserdata(L, 1);
  let order = luaL_checkinteger(L, 2);
  console.warn('IssueImmediateOrderById was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IssuePointOrder takes unit whichUnit, string order, real x, real y returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IssuePointOrder(L) {
  let whichUnit = lua_touserdata(L, 1);
  let order = luaL_checkstring(L, 2);
  let x = luaL_checknumber(L, 3);
  let y = luaL_checknumber(L, 4);
  console.warn('IssuePointOrder was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IssuePointOrderLoc takes unit whichUnit, string order, location whichLocation returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IssuePointOrderLoc(L) {
  let whichUnit = lua_touserdata(L, 1);
  let order = luaL_checkstring(L, 2);
  let whichLocation = lua_touserdata(L, 3);
  console.warn('IssuePointOrderLoc was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IssuePointOrderById takes unit whichUnit, integer order, real x, real y returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IssuePointOrderById(L) {
  let whichUnit = lua_touserdata(L, 1);
  let order = luaL_checkinteger(L, 2);
  let x = luaL_checknumber(L, 3);
  let y = luaL_checknumber(L, 4);
  console.warn('IssuePointOrderById was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IssuePointOrderByIdLoc takes unit whichUnit, integer order, location whichLocation returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IssuePointOrderByIdLoc(L) {
  let whichUnit = lua_touserdata(L, 1);
  let order = luaL_checkinteger(L, 2);
  let whichLocation = lua_touserdata(L, 3);
  console.warn('IssuePointOrderByIdLoc was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IssueTargetOrder takes unit whichUnit, string order, widget targetWidget returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IssueTargetOrder(L) {
  let whichUnit = lua_touserdata(L, 1);
  let order = luaL_checkstring(L, 2);
  let targetWidget = lua_touserdata(L, 3);
  console.warn('IssueTargetOrder was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IssueTargetOrderById takes unit whichUnit, integer order, widget targetWidget returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IssueTargetOrderById(L) {
  let whichUnit = lua_touserdata(L, 1);
  let order = luaL_checkinteger(L, 2);
  let targetWidget = lua_touserdata(L, 3);
  console.warn('IssueTargetOrderById was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IssueInstantPointOrder takes unit whichUnit, string order, real x, real y, widget instantTargetWidget returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IssueInstantPointOrder(L) {
  let whichUnit = lua_touserdata(L, 1);
  let order = luaL_checkstring(L, 2);
  let x = luaL_checknumber(L, 3);
  let y = luaL_checknumber(L, 4);
  let instantTargetWidget = lua_touserdata(L, 5);
  console.warn('IssueInstantPointOrder was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IssueInstantPointOrderById takes unit whichUnit, integer order, real x, real y, widget instantTargetWidget returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IssueInstantPointOrderById(L) {
  let whichUnit = lua_touserdata(L, 1);
  let order = luaL_checkinteger(L, 2);
  let x = luaL_checknumber(L, 3);
  let y = luaL_checknumber(L, 4);
  let instantTargetWidget = lua_touserdata(L, 5);
  console.warn('IssueInstantPointOrderById was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IssueInstantTargetOrder takes unit whichUnit, string order, widget targetWidget, widget instantTargetWidget returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IssueInstantTargetOrder(L) {
  let whichUnit = lua_touserdata(L, 1);
  let order = luaL_checkstring(L, 2);
  let targetWidget = lua_touserdata(L, 3);
  let instantTargetWidget = lua_touserdata(L, 4);
  console.warn('IssueInstantTargetOrder was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IssueInstantTargetOrderById takes unit whichUnit, integer order, widget targetWidget, widget instantTargetWidget returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IssueInstantTargetOrderById(L) {
  let whichUnit = lua_touserdata(L, 1);
  let order = luaL_checkinteger(L, 2);
  let targetWidget = lua_touserdata(L, 3);
  let instantTargetWidget = lua_touserdata(L, 4);
  console.warn('IssueInstantTargetOrderById was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IssueBuildOrder takes unit whichPeon, string unitToBuild, real x, real y returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IssueBuildOrder(L) {
  let whichPeon = lua_touserdata(L, 1);
  let unitToBuild = luaL_checkstring(L, 2);
  let x = luaL_checknumber(L, 3);
  let y = luaL_checknumber(L, 4);
  console.warn('IssueBuildOrder was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IssueBuildOrderById takes unit whichPeon, integer unitId, real x, real y returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IssueBuildOrderById(L) {
  let whichPeon = lua_touserdata(L, 1);
  let unitId = luaL_checkinteger(L, 2);
  let x = luaL_checknumber(L, 3);
  let y = luaL_checknumber(L, 4);
  console.warn('IssueBuildOrderById was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IssueNeutralImmediateOrder takes player forWhichPlayer, unit neutralStructure, string unitToBuild returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IssueNeutralImmediateOrder(L) {
  let forWhichPlayer = lua_touserdata(L, 1);
  let neutralStructure = lua_touserdata(L, 2);
  let unitToBuild = luaL_checkstring(L, 3);
  console.warn('IssueNeutralImmediateOrder was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IssueNeutralImmediateOrderById takes player forWhichPlayer, unit neutralStructure, integer unitId returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IssueNeutralImmediateOrderById(L) {
  let forWhichPlayer = lua_touserdata(L, 1);
  let neutralStructure = lua_touserdata(L, 2);
  let unitId = luaL_checkinteger(L, 3);
  console.warn('IssueNeutralImmediateOrderById was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IssueNeutralPointOrder takes player forWhichPlayer, unit neutralStructure, string unitToBuild, real x, real y returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IssueNeutralPointOrder(L) {
  let forWhichPlayer = lua_touserdata(L, 1);
  let neutralStructure = lua_touserdata(L, 2);
  let unitToBuild = luaL_checkstring(L, 3);
  let x = luaL_checknumber(L, 4);
  let y = luaL_checknumber(L, 5);
  console.warn('IssueNeutralPointOrder was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IssueNeutralPointOrderById takes player forWhichPlayer, unit neutralStructure, integer unitId, real x, real y returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IssueNeutralPointOrderById(L) {
  let forWhichPlayer = lua_touserdata(L, 1);
  let neutralStructure = lua_touserdata(L, 2);
  let unitId = luaL_checkinteger(L, 3);
  let x = luaL_checknumber(L, 4);
  let y = luaL_checknumber(L, 5);
  console.warn('IssueNeutralPointOrderById was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IssueNeutralTargetOrder takes player forWhichPlayer, unit neutralStructure, string unitToBuild, widget target returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IssueNeutralTargetOrder(L) {
  let forWhichPlayer = lua_touserdata(L, 1);
  let neutralStructure = lua_touserdata(L, 2);
  let unitToBuild = luaL_checkstring(L, 3);
  let target = lua_touserdata(L, 4);
  console.warn('IssueNeutralTargetOrder was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IssueNeutralTargetOrderById takes player forWhichPlayer, unit neutralStructure, integer unitId, widget target returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IssueNeutralTargetOrderById(L) {
  let forWhichPlayer = lua_touserdata(L, 1);
  let neutralStructure = lua_touserdata(L, 2);
  let unitId = luaL_checkinteger(L, 3);
  let target = lua_touserdata(L, 4);
  console.warn('IssueNeutralTargetOrderById was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native GetUnitCurrentOrder takes unit whichUnit returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitCurrentOrder(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitCurrentOrder was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native SetResourceAmount takes unit whichUnit, integer amount returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetResourceAmount(L) {
  let whichUnit = lua_touserdata(L, 1);
  let amount = luaL_checkinteger(L, 2);
  console.warn('SetResourceAmount was called but is not implemented :(');
  return 0
}

/**
 * native AddResourceAmount takes unit whichUnit, integer amount returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AddResourceAmount(L) {
  let whichUnit = lua_touserdata(L, 1);
  let amount = luaL_checkinteger(L, 2);
  console.warn('AddResourceAmount was called but is not implemented :(');
  return 0
}

/**
 * native GetResourceAmount takes unit whichUnit returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetResourceAmount(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetResourceAmount was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native WaygateGetDestinationX takes unit waygate returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function WaygateGetDestinationX(L) {
  let waygate = lua_touserdata(L, 1);
  console.warn('WaygateGetDestinationX was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native WaygateGetDestinationY takes unit waygate returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function WaygateGetDestinationY(L) {
  let waygate = lua_touserdata(L, 1);
  console.warn('WaygateGetDestinationY was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native WaygateSetDestination takes unit waygate, real x, real y returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function WaygateSetDestination(L) {
  let waygate = lua_touserdata(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  console.warn('WaygateSetDestination was called but is not implemented :(');
  return 0
}

/**
 * native WaygateActivate takes unit waygate, boolean activate returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function WaygateActivate(L) {
  let waygate = lua_touserdata(L, 1);
  let activate = lua_toboolean(L, 2);
  console.warn('WaygateActivate was called but is not implemented :(');
  return 0
}

/**
 * native WaygateIsActive takes unit waygate returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function WaygateIsActive(L) {
  let waygate = lua_touserdata(L, 1);
  console.warn('WaygateIsActive was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native AddItemToAllStock takes integer itemId, integer currentStock, integer stockMax returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AddItemToAllStock(L) {
  let itemId = luaL_checkinteger(L, 1);
  let currentStock = luaL_checkinteger(L, 2);
  let stockMax = luaL_checkinteger(L, 3);
  console.warn('AddItemToAllStock was called but is not implemented :(');
  return 0
}

/**
 * native AddItemToStock takes unit whichUnit, integer itemId, integer currentStock, integer stockMax returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AddItemToStock(L) {
  let whichUnit = lua_touserdata(L, 1);
  let itemId = luaL_checkinteger(L, 2);
  let currentStock = luaL_checkinteger(L, 3);
  let stockMax = luaL_checkinteger(L, 4);
  console.warn('AddItemToStock was called but is not implemented :(');
  return 0
}

/**
 * native AddUnitToAllStock takes integer unitId, integer currentStock, integer stockMax returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AddUnitToAllStock(L) {
  let unitId = luaL_checkinteger(L, 1);
  let currentStock = luaL_checkinteger(L, 2);
  let stockMax = luaL_checkinteger(L, 3);
  console.warn('AddUnitToAllStock was called but is not implemented :(');
  return 0
}

/**
 * native AddUnitToStock takes unit whichUnit, integer unitId, integer currentStock, integer stockMax returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AddUnitToStock(L) {
  let whichUnit = lua_touserdata(L, 1);
  let unitId = luaL_checkinteger(L, 2);
  let currentStock = luaL_checkinteger(L, 3);
  let stockMax = luaL_checkinteger(L, 4);
  console.warn('AddUnitToStock was called but is not implemented :(');
  return 0
}

/**
 * native RemoveItemFromAllStock takes integer itemId returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RemoveItemFromAllStock(L) {
  let itemId = luaL_checkinteger(L, 1);
  console.warn('RemoveItemFromAllStock was called but is not implemented :(');
  return 0
}

/**
 * native RemoveItemFromStock takes unit whichUnit, integer itemId returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RemoveItemFromStock(L) {
  let whichUnit = lua_touserdata(L, 1);
  let itemId = luaL_checkinteger(L, 2);
  console.warn('RemoveItemFromStock was called but is not implemented :(');
  return 0
}

/**
 * native RemoveUnitFromAllStock takes integer unitId returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RemoveUnitFromAllStock(L) {
  let unitId = luaL_checkinteger(L, 1);
  console.warn('RemoveUnitFromAllStock was called but is not implemented :(');
  return 0
}

/**
 * native RemoveUnitFromStock takes unit whichUnit, integer unitId returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RemoveUnitFromStock(L) {
  let whichUnit = lua_touserdata(L, 1);
  let unitId = luaL_checkinteger(L, 2);
  console.warn('RemoveUnitFromStock was called but is not implemented :(');
  return 0
}

/**
 * native SetAllItemTypeSlots takes integer slots returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetAllItemTypeSlots(L) {
  let slots = luaL_checkinteger(L, 1);
  console.warn('SetAllItemTypeSlots was called but is not implemented :(');
  return 0
}

/**
 * native SetAllUnitTypeSlots takes integer slots returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetAllUnitTypeSlots(L) {
  let slots = luaL_checkinteger(L, 1);
  console.warn('SetAllUnitTypeSlots was called but is not implemented :(');
  return 0
}

/**
 * native SetItemTypeSlots takes unit whichUnit, integer slots returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetItemTypeSlots(L) {
  let whichUnit = lua_touserdata(L, 1);
  let slots = luaL_checkinteger(L, 2);
  console.warn('SetItemTypeSlots was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitTypeSlots takes unit whichUnit, integer slots returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitTypeSlots(L) {
  let whichUnit = lua_touserdata(L, 1);
  let slots = luaL_checkinteger(L, 2);
  console.warn('SetUnitTypeSlots was called but is not implemented :(');
  return 0
}

/**
 * native GetUnitUserData takes unit whichUnit returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetUnitUserData(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('GetUnitUserData was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native SetUnitUserData takes unit whichUnit, integer data returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitUserData(L) {
  let whichUnit = lua_touserdata(L, 1);
  let data = luaL_checkinteger(L, 2);
  console.warn('SetUnitUserData was called but is not implemented :(');
  return 0
}

/**
 * constant native Player takes integer number returns player
 * 
 * @param {lua_State} L
 * @return {number}
 */
function Player(L) {
  let number = luaL_checkinteger(L, 1);

  lua_pushlightuserdata(L, this.players[number]);

  return 1;
}

/**
 * constant native GetLocalPlayer takes nothing returns player
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetLocalPlayer(L) {

  console.warn('GetLocalPlayer was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native IsPlayerAlly takes player whichPlayer, player otherPlayer returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsPlayerAlly(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let otherPlayer = lua_touserdata(L, 2);
  console.warn('IsPlayerAlly was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsPlayerEnemy takes player whichPlayer, player otherPlayer returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsPlayerEnemy(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let otherPlayer = lua_touserdata(L, 2);
  console.warn('IsPlayerEnemy was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsPlayerInForce takes player whichPlayer, force whichForce returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsPlayerInForce(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let whichForce = lua_touserdata(L, 2);
  console.warn('IsPlayerInForce was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsPlayerObserver takes player whichPlayer returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsPlayerObserver(L) {
  let whichPlayer = lua_touserdata(L, 1);
  console.warn('IsPlayerObserver was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsVisibleToPlayer takes real x, real y, player whichPlayer returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsVisibleToPlayer(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  let whichPlayer = lua_touserdata(L, 3);
  console.warn('IsVisibleToPlayer was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsLocationVisibleToPlayer takes location whichLocation, player whichPlayer returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsLocationVisibleToPlayer(L) {
  let whichLocation = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  console.warn('IsLocationVisibleToPlayer was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsFoggedToPlayer takes real x, real y, player whichPlayer returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsFoggedToPlayer(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  let whichPlayer = lua_touserdata(L, 3);
  console.warn('IsFoggedToPlayer was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsLocationFoggedToPlayer takes location whichLocation, player whichPlayer returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsLocationFoggedToPlayer(L) {
  let whichLocation = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  console.warn('IsLocationFoggedToPlayer was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsMaskedToPlayer takes real x, real y, player whichPlayer returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsMaskedToPlayer(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  let whichPlayer = lua_touserdata(L, 3);
  console.warn('IsMaskedToPlayer was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native IsLocationMaskedToPlayer takes location whichLocation, player whichPlayer returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsLocationMaskedToPlayer(L) {
  let whichLocation = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  console.warn('IsLocationMaskedToPlayer was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native GetPlayerRace takes player whichPlayer returns race
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetPlayerRace(L) {
  let whichPlayer = lua_touserdata(L, 1);

  lua_pushlightuserdata(L, whichPlayer.race);

  return 1;
}

/**
 * constant native GetPlayerId takes player whichPlayer returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetPlayerId(L) {
  let whichPlayer = lua_touserdata(L, 1);

  lua_pushinteger(L, whichPlayer.index);

  return 1;
}

/**
 * constant native GetPlayerUnitCount takes player whichPlayer, boolean includeIncomplete returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetPlayerUnitCount(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let includeIncomplete = lua_toboolean(L, 2);
  console.warn('GetPlayerUnitCount was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * constant native GetPlayerTypedUnitCount takes player whichPlayer, string unitName, boolean includeIncomplete, boolean includeUpgrades returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetPlayerTypedUnitCount(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let unitName = luaL_checkstring(L, 2);
  let includeIncomplete = lua_toboolean(L, 3);
  let includeUpgrades = lua_toboolean(L, 4);
  console.warn('GetPlayerTypedUnitCount was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * constant native GetPlayerStructureCount takes player whichPlayer, boolean includeIncomplete returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetPlayerStructureCount(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let includeIncomplete = lua_toboolean(L, 2);
  console.warn('GetPlayerStructureCount was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * constant native GetPlayerState takes player whichPlayer, playerstate whichPlayerState returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetPlayerState(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let whichPlayerState = lua_touserdata(L, 2);
  console.warn('GetPlayerState was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * constant native GetPlayerScore takes player whichPlayer, playerscore whichPlayerScore returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetPlayerScore(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let whichPlayerScore = lua_touserdata(L, 2);
  console.warn('GetPlayerScore was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * constant native GetPlayerAlliance takes player sourcePlayer, player otherPlayer, alliancetype whichAllianceSetting returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetPlayerAlliance(L) {
  let sourcePlayer = lua_touserdata(L, 1);
  let otherPlayer = lua_touserdata(L, 2);
  let whichAllianceSetting = lua_touserdata(L, 3);
  console.warn('GetPlayerAlliance was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native GetPlayerHandicap takes player whichPlayer returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetPlayerHandicap(L) {
  let whichPlayer = lua_touserdata(L, 1);
  console.warn('GetPlayerHandicap was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetPlayerHandicapXP takes player whichPlayer returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetPlayerHandicapXP(L) {
  let whichPlayer = lua_touserdata(L, 1);
  console.warn('GetPlayerHandicapXP was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native SetPlayerHandicap takes player whichPlayer, real handicap returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetPlayerHandicap(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let handicap = luaL_checknumber(L, 2);
  console.warn('SetPlayerHandicap was called but is not implemented :(');
  return 0
}

/**
 * constant native SetPlayerHandicapXP takes player whichPlayer, real handicap returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetPlayerHandicapXP(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let handicap = luaL_checknumber(L, 2);
  console.warn('SetPlayerHandicapXP was called but is not implemented :(');
  return 0
}

/**
 * constant native SetPlayerTechMaxAllowed takes player whichPlayer, integer techid, integer maximum returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetPlayerTechMaxAllowed(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let techid = luaL_checkinteger(L, 2);
  let maximum = luaL_checkinteger(L, 3);
  console.warn('SetPlayerTechMaxAllowed was called but is not implemented :(');
  return 0
}

/**
 * constant native GetPlayerTechMaxAllowed takes player whichPlayer, integer techid returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetPlayerTechMaxAllowed(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let techid = luaL_checkinteger(L, 2);
  console.warn('GetPlayerTechMaxAllowed was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * constant native AddPlayerTechResearched takes player whichPlayer, integer techid, integer levels returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AddPlayerTechResearched(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let techid = luaL_checkinteger(L, 2);
  let levels = luaL_checkinteger(L, 3);
  console.warn('AddPlayerTechResearched was called but is not implemented :(');
  return 0
}

/**
 * constant native SetPlayerTechResearched takes player whichPlayer, integer techid, integer setToLevel returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetPlayerTechResearched(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let techid = luaL_checkinteger(L, 2);
  let setToLevel = luaL_checkinteger(L, 3);
  console.warn('SetPlayerTechResearched was called but is not implemented :(');
  return 0
}

/**
 * constant native GetPlayerTechResearched takes player whichPlayer, integer techid, boolean specificonly returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetPlayerTechResearched(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let techid = luaL_checkinteger(L, 2);
  let specificonly = lua_toboolean(L, 3);
  console.warn('GetPlayerTechResearched was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * constant native GetPlayerTechCount takes player whichPlayer, integer techid, boolean specificonly returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetPlayerTechCount(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let techid = luaL_checkinteger(L, 2);
  let specificonly = lua_toboolean(L, 3);
  console.warn('GetPlayerTechCount was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native SetPlayerUnitsOwner takes player whichPlayer, integer newOwner returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetPlayerUnitsOwner(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let newOwner = luaL_checkinteger(L, 2);
  console.warn('SetPlayerUnitsOwner was called but is not implemented :(');
  return 0
}

/**
 * native CripplePlayer takes player whichPlayer, force toWhichPlayers, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CripplePlayer(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let toWhichPlayers = lua_touserdata(L, 2);
  let flag = lua_toboolean(L, 3);
  console.warn('CripplePlayer was called but is not implemented :(');
  return 0
}

/**
 * native SetPlayerAbilityAvailable takes player whichPlayer, integer abilid, boolean avail returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetPlayerAbilityAvailable(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let abilid = luaL_checkinteger(L, 2);
  let avail = lua_toboolean(L, 3);
  console.warn('SetPlayerAbilityAvailable was called but is not implemented :(');
  return 0
}

/**
 * native SetPlayerState takes player whichPlayer, playerstate whichPlayerState, integer value returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetPlayerState(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let whichPlayerState = lua_touserdata(L, 2);
  let value = luaL_checkinteger(L, 3);
  console.warn('SetPlayerState was called but is not implemented :(');
  return 0
}

/**
 * native RemovePlayer takes player whichPlayer, playergameresult gameResult returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RemovePlayer(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let gameResult = lua_touserdata(L, 2);
  console.warn('RemovePlayer was called but is not implemented :(');
  return 0
}

/**
 * native CachePlayerHeroData takes player whichPlayer returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CachePlayerHeroData(L) {
  let whichPlayer = lua_touserdata(L, 1);
  console.warn('CachePlayerHeroData was called but is not implemented :(');
  return 0
}

/**
 * native SetFogStateRect takes player forWhichPlayer, fogstate whichState, rect where, boolean useSharedVision returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetFogStateRect(L) {
  let forWhichPlayer = lua_touserdata(L, 1);
  let whichState = lua_touserdata(L, 2);
  let where = lua_touserdata(L, 3);
  let useSharedVision = lua_toboolean(L, 4);
  console.warn('SetFogStateRect was called but is not implemented :(');
  return 0
}

/**
 * native SetFogStateRadius takes player forWhichPlayer, fogstate whichState, real centerx, real centerY, real radius, boolean useSharedVision returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetFogStateRadius(L) {
  let forWhichPlayer = lua_touserdata(L, 1);
  let whichState = lua_touserdata(L, 2);
  let centerx = luaL_checknumber(L, 3);
  let centerY = luaL_checknumber(L, 4);
  let radius = luaL_checknumber(L, 5);
  let useSharedVision = lua_toboolean(L, 6);
  console.warn('SetFogStateRadius was called but is not implemented :(');
  return 0
}

/**
 * native SetFogStateRadiusLoc takes player forWhichPlayer, fogstate whichState, location center, real radius, boolean useSharedVision returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetFogStateRadiusLoc(L) {
  let forWhichPlayer = lua_touserdata(L, 1);
  let whichState = lua_touserdata(L, 2);
  let center = lua_touserdata(L, 3);
  let radius = luaL_checknumber(L, 4);
  let useSharedVision = lua_toboolean(L, 5);
  console.warn('SetFogStateRadiusLoc was called but is not implemented :(');
  return 0
}

/**
 * native FogMaskEnable takes boolean enable returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function FogMaskEnable(L) {
  let enable = lua_toboolean(L, 1);
  console.warn('FogMaskEnable was called but is not implemented :(');
  return 0
}

/**
 * native IsFogMaskEnabled takes nothing returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsFogMaskEnabled(L) {

  console.warn('IsFogMaskEnabled was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native FogEnable takes boolean enable returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function FogEnable(L) {
  let enable = lua_toboolean(L, 1);
  console.warn('FogEnable was called but is not implemented :(');
  return 0
}

/**
 * native IsFogEnabled takes nothing returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsFogEnabled(L) {

  console.warn('IsFogEnabled was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native CreateFogModifierRect takes player forWhichPlayer, fogstate whichState, rect where, boolean useSharedVision, boolean afterUnits returns fogmodifier
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateFogModifierRect(L) {
  let forWhichPlayer = lua_touserdata(L, 1);
  let whichState = lua_touserdata(L, 2);
  let where = lua_touserdata(L, 3);
  let useSharedVision = lua_toboolean(L, 4);
  let afterUnits = lua_toboolean(L, 5);
  console.warn('CreateFogModifierRect was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native CreateFogModifierRadius takes player forWhichPlayer, fogstate whichState, real centerx, real centerY, real radius, boolean useSharedVision, boolean afterUnits returns fogmodifier
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateFogModifierRadius(L) {
  let forWhichPlayer = lua_touserdata(L, 1);
  let whichState = lua_touserdata(L, 2);
  let centerx = luaL_checknumber(L, 3);
  let centerY = luaL_checknumber(L, 4);
  let radius = luaL_checknumber(L, 5);
  let useSharedVision = lua_toboolean(L, 6);
  let afterUnits = lua_toboolean(L, 7);
  console.warn('CreateFogModifierRadius was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native CreateFogModifierRadiusLoc takes player forWhichPlayer, fogstate whichState, location center, real radius, boolean useSharedVision, boolean afterUnits returns fogmodifier
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateFogModifierRadiusLoc(L) {
  let forWhichPlayer = lua_touserdata(L, 1);
  let whichState = lua_touserdata(L, 2);
  let center = lua_touserdata(L, 3);
  let radius = luaL_checknumber(L, 4);
  let useSharedVision = lua_toboolean(L, 5);
  let afterUnits = lua_toboolean(L, 6);
  console.warn('CreateFogModifierRadiusLoc was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native DestroyFogModifier takes fogmodifier whichFogModifier returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DestroyFogModifier(L) {
  let whichFogModifier = lua_touserdata(L, 1);
  console.warn('DestroyFogModifier was called but is not implemented :(');
  return 0
}

/**
 * native FogModifierStart takes fogmodifier whichFogModifier returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function FogModifierStart(L) {
  let whichFogModifier = lua_touserdata(L, 1);
  console.warn('FogModifierStart was called but is not implemented :(');
  return 0
}

/**
 * native FogModifierStop takes fogmodifier whichFogModifier returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function FogModifierStop(L) {
  let whichFogModifier = lua_touserdata(L, 1);
  console.warn('FogModifierStop was called but is not implemented :(');
  return 0
}

/**
 * native VersionGet takes nothing returns version
 * 
 * @param {lua_State} L
 * @return {number}
 */
function VersionGet(L) {

  console.warn('VersionGet was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native VersionCompatible takes version whichVersion returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function VersionCompatible(L) {
  let whichVersion = lua_touserdata(L, 1);
  console.warn('VersionCompatible was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native VersionSupported takes version whichVersion returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function VersionSupported(L) {
  let whichVersion = lua_touserdata(L, 1);
  console.warn('VersionSupported was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native EndGame takes boolean doScoreScreen returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function EndGame(L) {
  let doScoreScreen = lua_toboolean(L, 1);
  console.warn('EndGame was called but is not implemented :(');
  return 0
}

/**
 * native ChangeLevel takes string newLevel, boolean doScoreScreen returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ChangeLevel(L) {
  let newLevel = luaL_checkstring(L, 1);
  let doScoreScreen = lua_toboolean(L, 2);
  console.warn('ChangeLevel was called but is not implemented :(');
  return 0
}

/**
 * native RestartGame takes boolean doScoreScreen returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RestartGame(L) {
  let doScoreScreen = lua_toboolean(L, 1);
  console.warn('RestartGame was called but is not implemented :(');
  return 0
}

/**
 * native ReloadGame takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ReloadGame(L) {

  console.warn('ReloadGame was called but is not implemented :(');
  return 0
}

/**
 * native SetCampaignMenuRace takes race r returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetCampaignMenuRace(L) {
  let r = lua_touserdata(L, 1);
  console.warn('SetCampaignMenuRace was called but is not implemented :(');
  return 0
}

/**
 * native SetCampaignMenuRaceEx takes integer campaignIndex returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetCampaignMenuRaceEx(L) {
  let campaignIndex = luaL_checkinteger(L, 1);
  console.warn('SetCampaignMenuRaceEx was called but is not implemented :(');
  return 0
}

/**
 * native ForceCampaignSelectScreen takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ForceCampaignSelectScreen(L) {

  console.warn('ForceCampaignSelectScreen was called but is not implemented :(');
  return 0
}

/**
 * native LoadGame takes string saveFileName, boolean doScoreScreen returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadGame(L) {
  let saveFileName = luaL_checkstring(L, 1);
  let doScoreScreen = lua_toboolean(L, 2);
  console.warn('LoadGame was called but is not implemented :(');
  return 0
}

/**
 * native SaveGame takes string saveFileName returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveGame(L) {
  let saveFileName = luaL_checkstring(L, 1);
  console.warn('SaveGame was called but is not implemented :(');
  return 0
}

/**
 * native RenameSaveDirectory takes string sourceDirName, string destDirName returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RenameSaveDirectory(L) {
  let sourceDirName = luaL_checkstring(L, 1);
  let destDirName = luaL_checkstring(L, 2);
  console.warn('RenameSaveDirectory was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native RemoveSaveDirectory takes string sourceDirName returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RemoveSaveDirectory(L) {
  let sourceDirName = luaL_checkstring(L, 1);
  console.warn('RemoveSaveDirectory was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native CopySaveGame takes string sourceSaveName, string destSaveName returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CopySaveGame(L) {
  let sourceSaveName = luaL_checkstring(L, 1);
  let destSaveName = luaL_checkstring(L, 2);
  console.warn('CopySaveGame was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveGameExists takes string saveName returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveGameExists(L) {
  let saveName = luaL_checkstring(L, 1);
  console.warn('SaveGameExists was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SyncSelections takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SyncSelections(L) {

  console.warn('SyncSelections was called but is not implemented :(');
  return 0
}

/**
 * native SetFloatGameState takes fgamestate whichFloatGameState, real value returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetFloatGameState(L) {
  let whichFloatGameState = lua_touserdata(L, 1);
  let value = luaL_checknumber(L, 2);
  console.warn('SetFloatGameState was called but is not implemented :(');
  return 0
}

/**
 * constant native GetFloatGameState takes fgamestate whichFloatGameState returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetFloatGameState(L) {
  let whichFloatGameState = lua_touserdata(L, 1);
  console.warn('GetFloatGameState was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native SetIntegerGameState takes igamestate whichIntegerGameState, integer value returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetIntegerGameState(L) {
  let whichIntegerGameState = lua_touserdata(L, 1);
  let value = luaL_checkinteger(L, 2);
  console.warn('SetIntegerGameState was called but is not implemented :(');
  return 0
}

/**
 * constant native GetIntegerGameState takes igamestate whichIntegerGameState returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetIntegerGameState(L) {
  let whichIntegerGameState = lua_touserdata(L, 1);
  console.warn('GetIntegerGameState was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native SetTutorialCleared takes boolean cleared returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetTutorialCleared(L) {
  let cleared = lua_toboolean(L, 1);
  console.warn('SetTutorialCleared was called but is not implemented :(');
  return 0
}

/**
 * native SetMissionAvailable takes integer campaignNumber, integer missionNumber, boolean available returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetMissionAvailable(L) {
  let campaignNumber = luaL_checkinteger(L, 1);
  let missionNumber = luaL_checkinteger(L, 2);
  let available = lua_toboolean(L, 3);
  console.warn('SetMissionAvailable was called but is not implemented :(');
  return 0
}

/**
 * native SetCampaignAvailable takes integer campaignNumber, boolean available returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetCampaignAvailable(L) {
  let campaignNumber = luaL_checkinteger(L, 1);
  let available = lua_toboolean(L, 2);
  console.warn('SetCampaignAvailable was called but is not implemented :(');
  return 0
}

/**
 * native SetOpCinematicAvailable takes integer campaignNumber, boolean available returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetOpCinematicAvailable(L) {
  let campaignNumber = luaL_checkinteger(L, 1);
  let available = lua_toboolean(L, 2);
  console.warn('SetOpCinematicAvailable was called but is not implemented :(');
  return 0
}

/**
 * native SetEdCinematicAvailable takes integer campaignNumber, boolean available returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetEdCinematicAvailable(L) {
  let campaignNumber = luaL_checkinteger(L, 1);
  let available = lua_toboolean(L, 2);
  console.warn('SetEdCinematicAvailable was called but is not implemented :(');
  return 0
}

/**
 * native GetDefaultDifficulty takes nothing returns gamedifficulty
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetDefaultDifficulty(L) {

  console.warn('GetDefaultDifficulty was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native SetDefaultDifficulty takes gamedifficulty g returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetDefaultDifficulty(L) {
  let g = lua_touserdata(L, 1);
  console.warn('SetDefaultDifficulty was called but is not implemented :(');
  return 0
}

/**
 * native SetCustomCampaignButtonVisible takes integer whichButton, boolean visible returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetCustomCampaignButtonVisible(L) {
  let whichButton = luaL_checkinteger(L, 1);
  let visible = lua_toboolean(L, 2);
  console.warn('SetCustomCampaignButtonVisible was called but is not implemented :(');
  return 0
}

/**
 * native GetCustomCampaignButtonVisible takes integer whichButton returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetCustomCampaignButtonVisible(L) {
  let whichButton = luaL_checkinteger(L, 1);
  console.warn('GetCustomCampaignButtonVisible was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native DoNotSaveReplay takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DoNotSaveReplay(L) {

  console.warn('DoNotSaveReplay was called but is not implemented :(');
  return 0
}

/**
 * native DialogCreate takes nothing returns dialog
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DialogCreate(L) {

  console.warn('DialogCreate was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native DialogDestroy takes dialog whichDialog returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DialogDestroy(L) {
  let whichDialog = lua_touserdata(L, 1);
  console.warn('DialogDestroy was called but is not implemented :(');
  return 0
}

/**
 * native DialogClear takes dialog whichDialog returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DialogClear(L) {
  let whichDialog = lua_touserdata(L, 1);
  console.warn('DialogClear was called but is not implemented :(');
  return 0
}

/**
 * native DialogSetMessage takes dialog whichDialog, string messageText returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DialogSetMessage(L) {
  let whichDialog = lua_touserdata(L, 1);
  let messageText = luaL_checkstring(L, 2);
  console.warn('DialogSetMessage was called but is not implemented :(');
  return 0
}

/**
 * native DialogAddButton takes dialog whichDialog, string buttonText, integer hotkey returns button
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DialogAddButton(L) {
  let whichDialog = lua_touserdata(L, 1);
  let buttonText = luaL_checkstring(L, 2);
  let hotkey = luaL_checkinteger(L, 3);
  console.warn('DialogAddButton was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native DialogAddQuitButton takes dialog whichDialog, boolean doScoreScreen, string buttonText, integer hotkey returns button
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DialogAddQuitButton(L) {
  let whichDialog = lua_touserdata(L, 1);
  let doScoreScreen = lua_toboolean(L, 2);
  let buttonText = luaL_checkstring(L, 3);
  let hotkey = luaL_checkinteger(L, 4);
  console.warn('DialogAddQuitButton was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native DialogDisplay takes player whichPlayer, dialog whichDialog, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DialogDisplay(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let whichDialog = lua_touserdata(L, 2);
  let flag = lua_toboolean(L, 3);
  console.warn('DialogDisplay was called but is not implemented :(');
  return 0
}

/**
 * native ReloadGameCachesFromDisk takes nothing returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ReloadGameCachesFromDisk(L) {

  console.warn('ReloadGameCachesFromDisk was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native InitGameCache takes string campaignFile returns gamecache
 * 
 * @param {lua_State} L
 * @return {number}
 */
function InitGameCache(L) {
  let campaignFile = luaL_checkstring(L, 1);
  console.warn('InitGameCache was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native SaveGameCache takes gamecache whichCache returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveGameCache(L) {
  let whichCache = lua_touserdata(L, 1);
  console.warn('SaveGameCache was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native StoreInteger takes gamecache cache, string missionKey, string key, integer value returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function StoreInteger(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  let value = luaL_checkinteger(L, 4);
  console.warn('StoreInteger was called but is not implemented :(');
  return 0
}

/**
 * native StoreReal takes gamecache cache, string missionKey, string key, real value returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function StoreReal(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  let value = luaL_checknumber(L, 4);
  console.warn('StoreReal was called but is not implemented :(');
  return 0
}

/**
 * native StoreBoolean takes gamecache cache, string missionKey, string key, boolean value returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function StoreBoolean(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  let value = lua_toboolean(L, 4);
  console.warn('StoreBoolean was called but is not implemented :(');
  return 0
}

/**
 * native StoreUnit takes gamecache cache, string missionKey, string key, unit whichUnit returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function StoreUnit(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  let whichUnit = lua_touserdata(L, 4);
  console.warn('StoreUnit was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native StoreString takes gamecache cache, string missionKey, string key, string value returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function StoreString(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  let value = luaL_checkstring(L, 4);
  console.warn('StoreString was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SyncStoredInteger takes gamecache cache, string missionKey, string key returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SyncStoredInteger(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  console.warn('SyncStoredInteger was called but is not implemented :(');
  return 0
}

/**
 * native SyncStoredReal takes gamecache cache, string missionKey, string key returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SyncStoredReal(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  console.warn('SyncStoredReal was called but is not implemented :(');
  return 0
}

/**
 * native SyncStoredBoolean takes gamecache cache, string missionKey, string key returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SyncStoredBoolean(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  console.warn('SyncStoredBoolean was called but is not implemented :(');
  return 0
}

/**
 * native SyncStoredUnit takes gamecache cache, string missionKey, string key returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SyncStoredUnit(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  console.warn('SyncStoredUnit was called but is not implemented :(');
  return 0
}

/**
 * native SyncStoredString takes gamecache cache, string missionKey, string key returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SyncStoredString(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  console.warn('SyncStoredString was called but is not implemented :(');
  return 0
}

/**
 * native HaveStoredInteger takes gamecache cache, string missionKey, string key returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function HaveStoredInteger(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  console.warn('HaveStoredInteger was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native HaveStoredReal takes gamecache cache, string missionKey, string key returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function HaveStoredReal(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  console.warn('HaveStoredReal was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native HaveStoredBoolean takes gamecache cache, string missionKey, string key returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function HaveStoredBoolean(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  console.warn('HaveStoredBoolean was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native HaveStoredUnit takes gamecache cache, string missionKey, string key returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function HaveStoredUnit(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  console.warn('HaveStoredUnit was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native HaveStoredString takes gamecache cache, string missionKey, string key returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function HaveStoredString(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  console.warn('HaveStoredString was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native FlushGameCache takes gamecache cache returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function FlushGameCache(L) {
  let cache = lua_touserdata(L, 1);
  console.warn('FlushGameCache was called but is not implemented :(');
  return 0
}

/**
 * native FlushStoredMission takes gamecache cache, string missionKey returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function FlushStoredMission(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  console.warn('FlushStoredMission was called but is not implemented :(');
  return 0
}

/**
 * native FlushStoredInteger takes gamecache cache, string missionKey, string key returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function FlushStoredInteger(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  console.warn('FlushStoredInteger was called but is not implemented :(');
  return 0
}

/**
 * native FlushStoredReal takes gamecache cache, string missionKey, string key returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function FlushStoredReal(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  console.warn('FlushStoredReal was called but is not implemented :(');
  return 0
}

/**
 * native FlushStoredBoolean takes gamecache cache, string missionKey, string key returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function FlushStoredBoolean(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  console.warn('FlushStoredBoolean was called but is not implemented :(');
  return 0
}

/**
 * native FlushStoredUnit takes gamecache cache, string missionKey, string key returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function FlushStoredUnit(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  console.warn('FlushStoredUnit was called but is not implemented :(');
  return 0
}

/**
 * native FlushStoredString takes gamecache cache, string missionKey, string key returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function FlushStoredString(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  console.warn('FlushStoredString was called but is not implemented :(');
  return 0
}

/**
 * native GetStoredInteger takes gamecache cache, string missionKey, string key returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetStoredInteger(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  console.warn('GetStoredInteger was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native GetStoredReal takes gamecache cache, string missionKey, string key returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetStoredReal(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  console.warn('GetStoredReal was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native GetStoredBoolean takes gamecache cache, string missionKey, string key returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetStoredBoolean(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  console.warn('GetStoredBoolean was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native GetStoredString takes gamecache cache, string missionKey, string key returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetStoredString(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  console.warn('GetStoredString was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native RestoreUnit takes gamecache cache, string missionKey, string key, player forWhichPlayer, real x, real y, real facing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RestoreUnit(L) {
  let cache = lua_touserdata(L, 1);
  let missionKey = luaL_checkstring(L, 2);
  let key = luaL_checkstring(L, 3);
  let forWhichPlayer = lua_touserdata(L, 4);
  let x = luaL_checknumber(L, 5);
  let y = luaL_checknumber(L, 6);
  let facing = luaL_checknumber(L, 7);
  console.warn('RestoreUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native InitHashtable takes nothing returns hashtable
 * 
 * @param {lua_State} L
 * @return {number}
 */
function InitHashtable(L) {

  console.warn('InitHashtable was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native SaveInteger takes hashtable table, integer parentKey, integer childKey, integer value returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveInteger(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let value = luaL_checkinteger(L, 4);
  console.warn('SaveInteger was called but is not implemented :(');
  return 0
}

/**
 * native SaveReal takes hashtable table, integer parentKey, integer childKey, real value returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveReal(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let value = luaL_checknumber(L, 4);
  console.warn('SaveReal was called but is not implemented :(');
  return 0
}

/**
 * native SaveBoolean takes hashtable table, integer parentKey, integer childKey, boolean value returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveBoolean(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let value = lua_toboolean(L, 4);
  console.warn('SaveBoolean was called but is not implemented :(');
  return 0
}

/**
 * native SaveStr takes hashtable table, integer parentKey, integer childKey, string value returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveStr(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let value = luaL_checkstring(L, 4);
  console.warn('SaveStr was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SavePlayerHandle takes hashtable table, integer parentKey, integer childKey, player whichPlayer returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SavePlayerHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichPlayer = lua_touserdata(L, 4);
  console.warn('SavePlayerHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveWidgetHandle takes hashtable table, integer parentKey, integer childKey, widget whichWidget returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveWidgetHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichWidget = lua_touserdata(L, 4);
  console.warn('SaveWidgetHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveDestructableHandle takes hashtable table, integer parentKey, integer childKey, destructable whichDestructable returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveDestructableHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichDestructable = lua_touserdata(L, 4);
  console.warn('SaveDestructableHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveItemHandle takes hashtable table, integer parentKey, integer childKey, item whichItem returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveItemHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichItem = lua_touserdata(L, 4);
  console.warn('SaveItemHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveUnitHandle takes hashtable table, integer parentKey, integer childKey, unit whichUnit returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveUnitHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichUnit = lua_touserdata(L, 4);
  console.warn('SaveUnitHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveAbilityHandle takes hashtable table, integer parentKey, integer childKey, ability whichAbility returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveAbilityHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichAbility = lua_touserdata(L, 4);
  console.warn('SaveAbilityHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveTimerHandle takes hashtable table, integer parentKey, integer childKey, timer whichTimer returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveTimerHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichTimer = lua_touserdata(L, 4);
  console.warn('SaveTimerHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveTriggerHandle takes hashtable table, integer parentKey, integer childKey, trigger whichTrigger returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveTriggerHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichTrigger = lua_touserdata(L, 4);
  console.warn('SaveTriggerHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveTriggerConditionHandle takes hashtable table, integer parentKey, integer childKey, triggercondition whichTriggercondition returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveTriggerConditionHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichTriggercondition = lua_touserdata(L, 4);
  console.warn('SaveTriggerConditionHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveTriggerActionHandle takes hashtable table, integer parentKey, integer childKey, triggeraction whichTriggeraction returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveTriggerActionHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichTriggeraction = lua_touserdata(L, 4);
  console.warn('SaveTriggerActionHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveTriggerEventHandle takes hashtable table, integer parentKey, integer childKey, event whichEvent returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveTriggerEventHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichEvent = lua_touserdata(L, 4);
  console.warn('SaveTriggerEventHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveForceHandle takes hashtable table, integer parentKey, integer childKey, force whichForce returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveForceHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichForce = lua_touserdata(L, 4);
  console.warn('SaveForceHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveGroupHandle takes hashtable table, integer parentKey, integer childKey, group whichGroup returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveGroupHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichGroup = lua_touserdata(L, 4);
  console.warn('SaveGroupHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveLocationHandle takes hashtable table, integer parentKey, integer childKey, location whichLocation returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveLocationHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichLocation = lua_touserdata(L, 4);
  console.warn('SaveLocationHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveRectHandle takes hashtable table, integer parentKey, integer childKey, rect whichRect returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveRectHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichRect = lua_touserdata(L, 4);
  console.warn('SaveRectHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveBooleanExprHandle takes hashtable table, integer parentKey, integer childKey, boolexpr whichBoolexpr returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveBooleanExprHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichBoolexpr = lua_touserdata(L, 4);
  console.warn('SaveBooleanExprHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveSoundHandle takes hashtable table, integer parentKey, integer childKey, sound whichSound returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveSoundHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichSound = lua_touserdata(L, 4);
  console.warn('SaveSoundHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveEffectHandle takes hashtable table, integer parentKey, integer childKey, effect whichEffect returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveEffectHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichEffect = lua_touserdata(L, 4);
  console.warn('SaveEffectHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveUnitPoolHandle takes hashtable table, integer parentKey, integer childKey, unitpool whichUnitpool returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveUnitPoolHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichUnitpool = lua_touserdata(L, 4);
  console.warn('SaveUnitPoolHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveItemPoolHandle takes hashtable table, integer parentKey, integer childKey, itempool whichItempool returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveItemPoolHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichItempool = lua_touserdata(L, 4);
  console.warn('SaveItemPoolHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveQuestHandle takes hashtable table, integer parentKey, integer childKey, quest whichQuest returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveQuestHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichQuest = lua_touserdata(L, 4);
  console.warn('SaveQuestHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveQuestItemHandle takes hashtable table, integer parentKey, integer childKey, questitem whichQuestitem returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveQuestItemHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichQuestitem = lua_touserdata(L, 4);
  console.warn('SaveQuestItemHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveDefeatConditionHandle takes hashtable table, integer parentKey, integer childKey, defeatcondition whichDefeatcondition returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveDefeatConditionHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichDefeatcondition = lua_touserdata(L, 4);
  console.warn('SaveDefeatConditionHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveTimerDialogHandle takes hashtable table, integer parentKey, integer childKey, timerdialog whichTimerdialog returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveTimerDialogHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichTimerdialog = lua_touserdata(L, 4);
  console.warn('SaveTimerDialogHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveLeaderboardHandle takes hashtable table, integer parentKey, integer childKey, leaderboard whichLeaderboard returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveLeaderboardHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichLeaderboard = lua_touserdata(L, 4);
  console.warn('SaveLeaderboardHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveMultiboardHandle takes hashtable table, integer parentKey, integer childKey, multiboard whichMultiboard returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveMultiboardHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichMultiboard = lua_touserdata(L, 4);
  console.warn('SaveMultiboardHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveMultiboardItemHandle takes hashtable table, integer parentKey, integer childKey, multiboarditem whichMultiboarditem returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveMultiboardItemHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichMultiboarditem = lua_touserdata(L, 4);
  console.warn('SaveMultiboardItemHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveTrackableHandle takes hashtable table, integer parentKey, integer childKey, trackable whichTrackable returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveTrackableHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichTrackable = lua_touserdata(L, 4);
  console.warn('SaveTrackableHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveDialogHandle takes hashtable table, integer parentKey, integer childKey, dialog whichDialog returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveDialogHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichDialog = lua_touserdata(L, 4);
  console.warn('SaveDialogHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveButtonHandle takes hashtable table, integer parentKey, integer childKey, button whichButton returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveButtonHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichButton = lua_touserdata(L, 4);
  console.warn('SaveButtonHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveTextTagHandle takes hashtable table, integer parentKey, integer childKey, texttag whichTexttag returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveTextTagHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichTexttag = lua_touserdata(L, 4);
  console.warn('SaveTextTagHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveLightningHandle takes hashtable table, integer parentKey, integer childKey, lightning whichLightning returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveLightningHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichLightning = lua_touserdata(L, 4);
  console.warn('SaveLightningHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveImageHandle takes hashtable table, integer parentKey, integer childKey, image whichImage returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveImageHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichImage = lua_touserdata(L, 4);
  console.warn('SaveImageHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveUbersplatHandle takes hashtable table, integer parentKey, integer childKey, ubersplat whichUbersplat returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveUbersplatHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichUbersplat = lua_touserdata(L, 4);
  console.warn('SaveUbersplatHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveRegionHandle takes hashtable table, integer parentKey, integer childKey, region whichRegion returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveRegionHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichRegion = lua_touserdata(L, 4);
  console.warn('SaveRegionHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveFogStateHandle takes hashtable table, integer parentKey, integer childKey, fogstate whichFogState returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveFogStateHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichFogState = lua_touserdata(L, 4);
  console.warn('SaveFogStateHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveFogModifierHandle takes hashtable table, integer parentKey, integer childKey, fogmodifier whichFogModifier returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveFogModifierHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichFogModifier = lua_touserdata(L, 4);
  console.warn('SaveFogModifierHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveAgentHandle takes hashtable table, integer parentKey, integer childKey, agent whichAgent returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveAgentHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichAgent = lua_touserdata(L, 4);
  console.warn('SaveAgentHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SaveHashtableHandle takes hashtable table, integer parentKey, integer childKey, hashtable whichHashtable returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SaveHashtableHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  let whichHashtable = lua_touserdata(L, 4);
  console.warn('SaveHashtableHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native LoadInteger takes hashtable table, integer parentKey, integer childKey returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadInteger(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadInteger was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native LoadReal takes hashtable table, integer parentKey, integer childKey returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadReal(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadReal was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native LoadBoolean takes hashtable table, integer parentKey, integer childKey returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadBoolean(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadBoolean was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native LoadStr takes hashtable table, integer parentKey, integer childKey returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadStr(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadStr was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native LoadPlayerHandle takes hashtable table, integer parentKey, integer childKey returns player
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadPlayerHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadPlayerHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadWidgetHandle takes hashtable table, integer parentKey, integer childKey returns widget
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadWidgetHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadWidgetHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadDestructableHandle takes hashtable table, integer parentKey, integer childKey returns destructable
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadDestructableHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadDestructableHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadItemHandle takes hashtable table, integer parentKey, integer childKey returns item
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadItemHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadItemHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadUnitHandle takes hashtable table, integer parentKey, integer childKey returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadUnitHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadUnitHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadAbilityHandle takes hashtable table, integer parentKey, integer childKey returns ability
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadAbilityHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadAbilityHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadTimerHandle takes hashtable table, integer parentKey, integer childKey returns timer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadTimerHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadTimerHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadTriggerHandle takes hashtable table, integer parentKey, integer childKey returns trigger
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadTriggerHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadTriggerHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadTriggerConditionHandle takes hashtable table, integer parentKey, integer childKey returns triggercondition
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadTriggerConditionHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadTriggerConditionHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadTriggerActionHandle takes hashtable table, integer parentKey, integer childKey returns triggeraction
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadTriggerActionHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadTriggerActionHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadTriggerEventHandle takes hashtable table, integer parentKey, integer childKey returns event
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadTriggerEventHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadTriggerEventHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadForceHandle takes hashtable table, integer parentKey, integer childKey returns force
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadForceHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadForceHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadGroupHandle takes hashtable table, integer parentKey, integer childKey returns group
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadGroupHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadGroupHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadLocationHandle takes hashtable table, integer parentKey, integer childKey returns location
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadLocationHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadLocationHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadRectHandle takes hashtable table, integer parentKey, integer childKey returns rect
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadRectHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadRectHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadBooleanExprHandle takes hashtable table, integer parentKey, integer childKey returns boolexpr
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadBooleanExprHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadBooleanExprHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadSoundHandle takes hashtable table, integer parentKey, integer childKey returns sound
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadSoundHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadSoundHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadEffectHandle takes hashtable table, integer parentKey, integer childKey returns effect
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadEffectHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadEffectHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadUnitPoolHandle takes hashtable table, integer parentKey, integer childKey returns unitpool
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadUnitPoolHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadUnitPoolHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadItemPoolHandle takes hashtable table, integer parentKey, integer childKey returns itempool
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadItemPoolHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadItemPoolHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadQuestHandle takes hashtable table, integer parentKey, integer childKey returns quest
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadQuestHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadQuestHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadQuestItemHandle takes hashtable table, integer parentKey, integer childKey returns questitem
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadQuestItemHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadQuestItemHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadDefeatConditionHandle takes hashtable table, integer parentKey, integer childKey returns defeatcondition
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadDefeatConditionHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadDefeatConditionHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadTimerDialogHandle takes hashtable table, integer parentKey, integer childKey returns timerdialog
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadTimerDialogHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadTimerDialogHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadLeaderboardHandle takes hashtable table, integer parentKey, integer childKey returns leaderboard
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadLeaderboardHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadLeaderboardHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadMultiboardHandle takes hashtable table, integer parentKey, integer childKey returns multiboard
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadMultiboardHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadMultiboardHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadMultiboardItemHandle takes hashtable table, integer parentKey, integer childKey returns multiboarditem
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadMultiboardItemHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadMultiboardItemHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadTrackableHandle takes hashtable table, integer parentKey, integer childKey returns trackable
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadTrackableHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadTrackableHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadDialogHandle takes hashtable table, integer parentKey, integer childKey returns dialog
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadDialogHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadDialogHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadButtonHandle takes hashtable table, integer parentKey, integer childKey returns button
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadButtonHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadButtonHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadTextTagHandle takes hashtable table, integer parentKey, integer childKey returns texttag
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadTextTagHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadTextTagHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadLightningHandle takes hashtable table, integer parentKey, integer childKey returns lightning
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadLightningHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadLightningHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadImageHandle takes hashtable table, integer parentKey, integer childKey returns image
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadImageHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadImageHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadUbersplatHandle takes hashtable table, integer parentKey, integer childKey returns ubersplat
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadUbersplatHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadUbersplatHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadRegionHandle takes hashtable table, integer parentKey, integer childKey returns region
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadRegionHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadRegionHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadFogStateHandle takes hashtable table, integer parentKey, integer childKey returns fogstate
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadFogStateHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadFogStateHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadFogModifierHandle takes hashtable table, integer parentKey, integer childKey returns fogmodifier
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadFogModifierHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadFogModifierHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LoadHashtableHandle takes hashtable table, integer parentKey, integer childKey returns hashtable
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LoadHashtableHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('LoadHashtableHandle was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native HaveSavedInteger takes hashtable table, integer parentKey, integer childKey returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function HaveSavedInteger(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('HaveSavedInteger was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native HaveSavedReal takes hashtable table, integer parentKey, integer childKey returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function HaveSavedReal(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('HaveSavedReal was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native HaveSavedBoolean takes hashtable table, integer parentKey, integer childKey returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function HaveSavedBoolean(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('HaveSavedBoolean was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native HaveSavedString takes hashtable table, integer parentKey, integer childKey returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function HaveSavedString(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('HaveSavedString was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native HaveSavedHandle takes hashtable table, integer parentKey, integer childKey returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function HaveSavedHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('HaveSavedHandle was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native RemoveSavedInteger takes hashtable table, integer parentKey, integer childKey returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RemoveSavedInteger(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('RemoveSavedInteger was called but is not implemented :(');
  return 0
}

/**
 * native RemoveSavedReal takes hashtable table, integer parentKey, integer childKey returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RemoveSavedReal(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('RemoveSavedReal was called but is not implemented :(');
  return 0
}

/**
 * native RemoveSavedBoolean takes hashtable table, integer parentKey, integer childKey returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RemoveSavedBoolean(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('RemoveSavedBoolean was called but is not implemented :(');
  return 0
}

/**
 * native RemoveSavedString takes hashtable table, integer parentKey, integer childKey returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RemoveSavedString(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('RemoveSavedString was called but is not implemented :(');
  return 0
}

/**
 * native RemoveSavedHandle takes hashtable table, integer parentKey, integer childKey returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RemoveSavedHandle(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  let childKey = luaL_checkinteger(L, 3);
  console.warn('RemoveSavedHandle was called but is not implemented :(');
  return 0
}

/**
 * native FlushParentHashtable takes hashtable table returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function FlushParentHashtable(L) {
  let table = lua_touserdata(L, 1);
  console.warn('FlushParentHashtable was called but is not implemented :(');
  return 0
}

/**
 * native FlushChildHashtable takes hashtable table, integer parentKey returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function FlushChildHashtable(L) {
  let table = lua_touserdata(L, 1);
  let parentKey = luaL_checkinteger(L, 2);
  console.warn('FlushChildHashtable was called but is not implemented :(');
  return 0
}

/**
 * native GetRandomInt takes integer lowBound, integer highBound returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetRandomInt(L) {
  let lowBound = luaL_checkinteger(L, 1);
  let highBound = luaL_checkinteger(L, 2);
  console.warn('GetRandomInt was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native GetRandomReal takes real lowBound, real highBound returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetRandomReal(L) {
  let lowBound = luaL_checknumber(L, 1);
  let highBound = luaL_checknumber(L, 2);
  console.warn('GetRandomReal was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native CreateUnitPool takes nothing returns unitpool
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateUnitPool(L) {

  console.warn('CreateUnitPool was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native DestroyUnitPool takes unitpool whichPool returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DestroyUnitPool(L) {
  let whichPool = lua_touserdata(L, 1);
  console.warn('DestroyUnitPool was called but is not implemented :(');
  return 0
}

/**
 * native UnitPoolAddUnitType takes unitpool whichPool, integer unitId, real weight returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitPoolAddUnitType(L) {
  let whichPool = lua_touserdata(L, 1);
  let unitId = luaL_checkinteger(L, 2);
  let weight = luaL_checknumber(L, 3);
  console.warn('UnitPoolAddUnitType was called but is not implemented :(');
  return 0
}

/**
 * native UnitPoolRemoveUnitType takes unitpool whichPool, integer unitId returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitPoolRemoveUnitType(L) {
  let whichPool = lua_touserdata(L, 1);
  let unitId = luaL_checkinteger(L, 2);
  console.warn('UnitPoolRemoveUnitType was called but is not implemented :(');
  return 0
}

/**
 * native PlaceRandomUnit takes unitpool whichPool, player forWhichPlayer, real x, real y, real facing returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PlaceRandomUnit(L) {
  let whichPool = lua_touserdata(L, 1);
  let forWhichPlayer = lua_touserdata(L, 2);
  let x = luaL_checknumber(L, 3);
  let y = luaL_checknumber(L, 4);
  let facing = luaL_checknumber(L, 5);
  console.warn('PlaceRandomUnit was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native CreateItemPool takes nothing returns itempool
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateItemPool(L) {

  console.warn('CreateItemPool was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native DestroyItemPool takes itempool whichItemPool returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DestroyItemPool(L) {
  let whichItemPool = lua_touserdata(L, 1);
  console.warn('DestroyItemPool was called but is not implemented :(');
  return 0
}

/**
 * native ItemPoolAddItemType takes itempool whichItemPool, integer itemId, real weight returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ItemPoolAddItemType(L) {
  let whichItemPool = lua_touserdata(L, 1);
  let itemId = luaL_checkinteger(L, 2);
  let weight = luaL_checknumber(L, 3);
  console.warn('ItemPoolAddItemType was called but is not implemented :(');
  return 0
}

/**
 * native ItemPoolRemoveItemType takes itempool whichItemPool, integer itemId returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ItemPoolRemoveItemType(L) {
  let whichItemPool = lua_touserdata(L, 1);
  let itemId = luaL_checkinteger(L, 2);
  console.warn('ItemPoolRemoveItemType was called but is not implemented :(');
  return 0
}

/**
 * native PlaceRandomItem takes itempool whichItemPool, real x, real y returns item
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PlaceRandomItem(L) {
  let whichItemPool = lua_touserdata(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  console.warn('PlaceRandomItem was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native ChooseRandomCreep takes integer level returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ChooseRandomCreep(L) {
  let level = luaL_checkinteger(L, 1);
  console.warn('ChooseRandomCreep was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native ChooseRandomNPBuilding takes nothing returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ChooseRandomNPBuilding(L) {

  console.warn('ChooseRandomNPBuilding was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native ChooseRandomItem takes integer level returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ChooseRandomItem(L) {
  let level = luaL_checkinteger(L, 1);
  console.warn('ChooseRandomItem was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native ChooseRandomItemEx takes itemtype whichType, integer level returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ChooseRandomItemEx(L) {
  let whichType = lua_touserdata(L, 1);
  let level = luaL_checkinteger(L, 2);
  console.warn('ChooseRandomItemEx was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native SetRandomSeed takes integer seed returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetRandomSeed(L) {
  let seed = luaL_checkinteger(L, 1);
  console.warn('SetRandomSeed was called but is not implemented :(');
  return 0
}

/**
 * native SetTerrainFog takes real a, real b, real c, real d, real e returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetTerrainFog(L) {
  let a = luaL_checknumber(L, 1);
  let b = luaL_checknumber(L, 2);
  let c = luaL_checknumber(L, 3);
  let d = luaL_checknumber(L, 4);
  let e = luaL_checknumber(L, 5);
  console.warn('SetTerrainFog was called but is not implemented :(');
  return 0
}

/**
 * native ResetTerrainFog takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ResetTerrainFog(L) {

  console.warn('ResetTerrainFog was called but is not implemented :(');
  return 0
}

/**
 * native SetUnitFog takes real a, real b, real c, real d, real e returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUnitFog(L) {
  let a = luaL_checknumber(L, 1);
  let b = luaL_checknumber(L, 2);
  let c = luaL_checknumber(L, 3);
  let d = luaL_checknumber(L, 4);
  let e = luaL_checknumber(L, 5);
  console.warn('SetUnitFog was called but is not implemented :(');
  return 0
}

/**
 * native SetTerrainFogEx takes integer style, real zstart, real zend, real density, real red, real green, real blue returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetTerrainFogEx(L) {
  let style = luaL_checkinteger(L, 1);
  let zstart = luaL_checknumber(L, 2);
  let zend = luaL_checknumber(L, 3);
  let density = luaL_checknumber(L, 4);
  let red = luaL_checknumber(L, 5);
  let green = luaL_checknumber(L, 6);
  let blue = luaL_checknumber(L, 7);
  console.warn('SetTerrainFogEx was called but is not implemented :(');
  return 0
}

/**
 * native DisplayTextToPlayer takes player toPlayer, real x, real y, string message returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DisplayTextToPlayer(L) {
  let toPlayer = lua_touserdata(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  let message = luaL_checkstring(L, 4);
  console.warn('DisplayTextToPlayer was called but is not implemented :(');
  return 0
}

/**
 * native DisplayTimedTextToPlayer takes player toPlayer, real x, real y, real duration, string message returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DisplayTimedTextToPlayer(L) {
  let toPlayer = lua_touserdata(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  let duration = luaL_checknumber(L, 4);
  let message = luaL_checkstring(L, 5);
  console.warn('DisplayTimedTextToPlayer was called but is not implemented :(');
  return 0
}

/**
 * native DisplayTimedTextFromPlayer takes player toPlayer, real x, real y, real duration, string message returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DisplayTimedTextFromPlayer(L) {
  let toPlayer = lua_touserdata(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  let duration = luaL_checknumber(L, 4);
  let message = luaL_checkstring(L, 5);
  console.warn('DisplayTimedTextFromPlayer was called but is not implemented :(');
  return 0
}

/**
 * native ClearTextMessages takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ClearTextMessages(L) {

  console.warn('ClearTextMessages was called but is not implemented :(');
  return 0
}

/**
 * native SetDayNightModels takes string terrainDNCFile, string unitDNCFile returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetDayNightModels(L) {
  let terrainDNCFile = luaL_checkstring(L, 1);
  let unitDNCFile = luaL_checkstring(L, 2);
  console.warn('SetDayNightModels was called but is not implemented :(');
  return 0
}

/**
 * native SetSkyModel takes string skyModelFile returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetSkyModel(L) {
  let skyModelFile = luaL_checkstring(L, 1);
  console.warn('SetSkyModel was called but is not implemented :(');
  return 0
}

/**
 * native EnableUserControl takes boolean b returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function EnableUserControl(L) {
  let b = lua_toboolean(L, 1);
  console.warn('EnableUserControl was called but is not implemented :(');
  return 0
}

/**
 * native EnableUserUI takes boolean b returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function EnableUserUI(L) {
  let b = lua_toboolean(L, 1);
  console.warn('EnableUserUI was called but is not implemented :(');
  return 0
}

/**
 * native SuspendTimeOfDay takes boolean b returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SuspendTimeOfDay(L) {
  let b = lua_toboolean(L, 1);
  console.warn('SuspendTimeOfDay was called but is not implemented :(');
  return 0
}

/**
 * native SetTimeOfDayScale takes real r returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetTimeOfDayScale(L) {
  let r = luaL_checknumber(L, 1);
  console.warn('SetTimeOfDayScale was called but is not implemented :(');
  return 0
}

/**
 * native GetTimeOfDayScale takes nothing returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetTimeOfDayScale(L) {

  console.warn('GetTimeOfDayScale was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native ShowInterface takes boolean flag, real fadeDuration returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ShowInterface(L) {
  let flag = lua_toboolean(L, 1);
  let fadeDuration = luaL_checknumber(L, 2);
  console.warn('ShowInterface was called but is not implemented :(');
  return 0
}

/**
 * native PauseGame takes boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PauseGame(L) {
  let flag = lua_toboolean(L, 1);
  console.warn('PauseGame was called but is not implemented :(');
  return 0
}

/**
 * native UnitAddIndicator takes unit whichUnit, integer red, integer green, integer blue, integer alpha returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnitAddIndicator(L) {
  let whichUnit = lua_touserdata(L, 1);
  let red = luaL_checkinteger(L, 2);
  let green = luaL_checkinteger(L, 3);
  let blue = luaL_checkinteger(L, 4);
  let alpha = luaL_checkinteger(L, 5);
  console.warn('UnitAddIndicator was called but is not implemented :(');
  return 0
}

/**
 * native AddIndicator takes widget whichWidget, integer red, integer green, integer blue, integer alpha returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AddIndicator(L) {
  let whichWidget = lua_touserdata(L, 1);
  let red = luaL_checkinteger(L, 2);
  let green = luaL_checkinteger(L, 3);
  let blue = luaL_checkinteger(L, 4);
  let alpha = luaL_checkinteger(L, 5);
  console.warn('AddIndicator was called but is not implemented :(');
  return 0
}

/**
 * native PingMinimap takes real x, real y, real duration returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PingMinimap(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  let duration = luaL_checknumber(L, 3);
  console.warn('PingMinimap was called but is not implemented :(');
  return 0
}

/**
 * native PingMinimapEx takes real x, real y, real duration, integer red, integer green, integer blue, boolean extraEffects returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PingMinimapEx(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  let duration = luaL_checknumber(L, 3);
  let red = luaL_checkinteger(L, 4);
  let green = luaL_checkinteger(L, 5);
  let blue = luaL_checkinteger(L, 6);
  let extraEffects = lua_toboolean(L, 7);
  console.warn('PingMinimapEx was called but is not implemented :(');
  return 0
}

/**
 * native EnableOcclusion takes boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function EnableOcclusion(L) {
  let flag = lua_toboolean(L, 1);
  console.warn('EnableOcclusion was called but is not implemented :(');
  return 0
}

/**
 * native SetIntroShotText takes string introText returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetIntroShotText(L) {
  let introText = luaL_checkstring(L, 1);
  console.warn('SetIntroShotText was called but is not implemented :(');
  return 0
}

/**
 * native SetIntroShotModel takes string introModelPath returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetIntroShotModel(L) {
  let introModelPath = luaL_checkstring(L, 1);
  console.warn('SetIntroShotModel was called but is not implemented :(');
  return 0
}

/**
 * native EnableWorldFogBoundary takes boolean b returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function EnableWorldFogBoundary(L) {
  let b = lua_toboolean(L, 1);
  console.warn('EnableWorldFogBoundary was called but is not implemented :(');
  return 0
}

/**
 * native PlayModelCinematic takes string modelName returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PlayModelCinematic(L) {
  let modelName = luaL_checkstring(L, 1);
  console.warn('PlayModelCinematic was called but is not implemented :(');
  return 0
}

/**
 * native PlayCinematic takes string movieName returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PlayCinematic(L) {
  let movieName = luaL_checkstring(L, 1);
  console.warn('PlayCinematic was called but is not implemented :(');
  return 0
}

/**
 * native ForceUIKey takes string key returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ForceUIKey(L) {
  let key = luaL_checkstring(L, 1);
  console.warn('ForceUIKey was called but is not implemented :(');
  return 0
}

/**
 * native ForceUICancel takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ForceUICancel(L) {

  console.warn('ForceUICancel was called but is not implemented :(');
  return 0
}

/**
 * native DisplayLoadDialog takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DisplayLoadDialog(L) {

  console.warn('DisplayLoadDialog was called but is not implemented :(');
  return 0
}

/**
 * native SetAltMinimapIcon takes string iconPath returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetAltMinimapIcon(L) {
  let iconPath = luaL_checkstring(L, 1);
  console.warn('SetAltMinimapIcon was called but is not implemented :(');
  return 0
}

/**
 * native DisableRestartMission takes boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DisableRestartMission(L) {
  let flag = lua_toboolean(L, 1);
  console.warn('DisableRestartMission was called but is not implemented :(');
  return 0
}

/**
 * native CreateTextTag takes nothing returns texttag
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateTextTag(L) {

  console.warn('CreateTextTag was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native DestroyTextTag takes texttag t returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DestroyTextTag(L) {
  let t = lua_touserdata(L, 1);
  console.warn('DestroyTextTag was called but is not implemented :(');
  return 0
}

/**
 * native SetTextTagText takes texttag t, string s, real height returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetTextTagText(L) {
  let t = lua_touserdata(L, 1);
  let s = luaL_checkstring(L, 2);
  let height = luaL_checknumber(L, 3);
  console.warn('SetTextTagText was called but is not implemented :(');
  return 0
}

/**
 * native SetTextTagPos takes texttag t, real x, real y, real heightOffset returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetTextTagPos(L) {
  let t = lua_touserdata(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  let heightOffset = luaL_checknumber(L, 4);
  console.warn('SetTextTagPos was called but is not implemented :(');
  return 0
}

/**
 * native SetTextTagPosUnit takes texttag t, unit whichUnit, real heightOffset returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetTextTagPosUnit(L) {
  let t = lua_touserdata(L, 1);
  let whichUnit = lua_touserdata(L, 2);
  let heightOffset = luaL_checknumber(L, 3);
  console.warn('SetTextTagPosUnit was called but is not implemented :(');
  return 0
}

/**
 * native SetTextTagColor takes texttag t, integer red, integer green, integer blue, integer alpha returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetTextTagColor(L) {
  let t = lua_touserdata(L, 1);
  let red = luaL_checkinteger(L, 2);
  let green = luaL_checkinteger(L, 3);
  let blue = luaL_checkinteger(L, 4);
  let alpha = luaL_checkinteger(L, 5);
  console.warn('SetTextTagColor was called but is not implemented :(');
  return 0
}

/**
 * native SetTextTagVelocity takes texttag t, real xvel, real yvel returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetTextTagVelocity(L) {
  let t = lua_touserdata(L, 1);
  let xvel = luaL_checknumber(L, 2);
  let yvel = luaL_checknumber(L, 3);
  console.warn('SetTextTagVelocity was called but is not implemented :(');
  return 0
}

/**
 * native SetTextTagVisibility takes texttag t, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetTextTagVisibility(L) {
  let t = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('SetTextTagVisibility was called but is not implemented :(');
  return 0
}

/**
 * native SetTextTagSuspended takes texttag t, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetTextTagSuspended(L) {
  let t = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('SetTextTagSuspended was called but is not implemented :(');
  return 0
}

/**
 * native SetTextTagPermanent takes texttag t, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetTextTagPermanent(L) {
  let t = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('SetTextTagPermanent was called but is not implemented :(');
  return 0
}

/**
 * native SetTextTagAge takes texttag t, real age returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetTextTagAge(L) {
  let t = lua_touserdata(L, 1);
  let age = luaL_checknumber(L, 2);
  console.warn('SetTextTagAge was called but is not implemented :(');
  return 0
}

/**
 * native SetTextTagLifespan takes texttag t, real lifespan returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetTextTagLifespan(L) {
  let t = lua_touserdata(L, 1);
  let lifespan = luaL_checknumber(L, 2);
  console.warn('SetTextTagLifespan was called but is not implemented :(');
  return 0
}

/**
 * native SetTextTagFadepoint takes texttag t, real fadepoint returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetTextTagFadepoint(L) {
  let t = lua_touserdata(L, 1);
  let fadepoint = luaL_checknumber(L, 2);
  console.warn('SetTextTagFadepoint was called but is not implemented :(');
  return 0
}

/**
 * native SetReservedLocalHeroButtons takes integer reserved returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetReservedLocalHeroButtons(L) {
  let reserved = luaL_checkinteger(L, 1);
  console.warn('SetReservedLocalHeroButtons was called but is not implemented :(');
  return 0
}

/**
 * native GetAllyColorFilterState takes nothing returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetAllyColorFilterState(L) {

  console.warn('GetAllyColorFilterState was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native SetAllyColorFilterState takes integer state returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetAllyColorFilterState(L) {
  let state = luaL_checkinteger(L, 1);
  console.warn('SetAllyColorFilterState was called but is not implemented :(');
  return 0
}

/**
 * native GetCreepCampFilterState takes nothing returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetCreepCampFilterState(L) {

  console.warn('GetCreepCampFilterState was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SetCreepCampFilterState takes boolean state returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetCreepCampFilterState(L) {
  let state = lua_toboolean(L, 1);
  console.warn('SetCreepCampFilterState was called but is not implemented :(');
  return 0
}

/**
 * native EnableMinimapFilterButtons takes boolean enableAlly, boolean enableCreep returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function EnableMinimapFilterButtons(L) {
  let enableAlly = lua_toboolean(L, 1);
  let enableCreep = lua_toboolean(L, 2);
  console.warn('EnableMinimapFilterButtons was called but is not implemented :(');
  return 0
}

/**
 * native EnableDragSelect takes boolean state, boolean ui returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function EnableDragSelect(L) {
  let state = lua_toboolean(L, 1);
  let ui = lua_toboolean(L, 2);
  console.warn('EnableDragSelect was called but is not implemented :(');
  return 0
}

/**
 * native EnablePreSelect takes boolean state, boolean ui returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function EnablePreSelect(L) {
  let state = lua_toboolean(L, 1);
  let ui = lua_toboolean(L, 2);
  console.warn('EnablePreSelect was called but is not implemented :(');
  return 0
}

/**
 * native EnableSelect takes boolean state, boolean ui returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function EnableSelect(L) {
  let state = lua_toboolean(L, 1);
  let ui = lua_toboolean(L, 2);
  console.warn('EnableSelect was called but is not implemented :(');
  return 0
}

/**
 * native CreateTrackable takes string trackableModelPath, real x, real y, real facing returns trackable
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateTrackable(L) {
  let trackableModelPath = luaL_checkstring(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  let facing = luaL_checknumber(L, 4);
  console.warn('CreateTrackable was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native CreateQuest takes nothing returns quest
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateQuest(L) {

  console.warn('CreateQuest was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native DestroyQuest takes quest whichQuest returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DestroyQuest(L) {
  let whichQuest = lua_touserdata(L, 1);
  console.warn('DestroyQuest was called but is not implemented :(');
  return 0
}

/**
 * native QuestSetTitle takes quest whichQuest, string title returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function QuestSetTitle(L) {
  let whichQuest = lua_touserdata(L, 1);
  let title = luaL_checkstring(L, 2);
  console.warn('QuestSetTitle was called but is not implemented :(');
  return 0
}

/**
 * native QuestSetDescription takes quest whichQuest, string description returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function QuestSetDescription(L) {
  let whichQuest = lua_touserdata(L, 1);
  let description = luaL_checkstring(L, 2);
  console.warn('QuestSetDescription was called but is not implemented :(');
  return 0
}

/**
 * native QuestSetIconPath takes quest whichQuest, string iconPath returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function QuestSetIconPath(L) {
  let whichQuest = lua_touserdata(L, 1);
  let iconPath = luaL_checkstring(L, 2);
  console.warn('QuestSetIconPath was called but is not implemented :(');
  return 0
}

/**
 * native QuestSetRequired takes quest whichQuest, boolean required returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function QuestSetRequired(L) {
  let whichQuest = lua_touserdata(L, 1);
  let required = lua_toboolean(L, 2);
  console.warn('QuestSetRequired was called but is not implemented :(');
  return 0
}

/**
 * native QuestSetCompleted takes quest whichQuest, boolean completed returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function QuestSetCompleted(L) {
  let whichQuest = lua_touserdata(L, 1);
  let completed = lua_toboolean(L, 2);
  console.warn('QuestSetCompleted was called but is not implemented :(');
  return 0
}

/**
 * native QuestSetDiscovered takes quest whichQuest, boolean discovered returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function QuestSetDiscovered(L) {
  let whichQuest = lua_touserdata(L, 1);
  let discovered = lua_toboolean(L, 2);
  console.warn('QuestSetDiscovered was called but is not implemented :(');
  return 0
}

/**
 * native QuestSetFailed takes quest whichQuest, boolean failed returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function QuestSetFailed(L) {
  let whichQuest = lua_touserdata(L, 1);
  let failed = lua_toboolean(L, 2);
  console.warn('QuestSetFailed was called but is not implemented :(');
  return 0
}

/**
 * native QuestSetEnabled takes quest whichQuest, boolean enabled returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function QuestSetEnabled(L) {
  let whichQuest = lua_touserdata(L, 1);
  let enabled = lua_toboolean(L, 2);
  console.warn('QuestSetEnabled was called but is not implemented :(');
  return 0
}

/**
 * native IsQuestRequired takes quest whichQuest returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsQuestRequired(L) {
  let whichQuest = lua_touserdata(L, 1);
  console.warn('IsQuestRequired was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IsQuestCompleted takes quest whichQuest returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsQuestCompleted(L) {
  let whichQuest = lua_touserdata(L, 1);
  console.warn('IsQuestCompleted was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IsQuestDiscovered takes quest whichQuest returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsQuestDiscovered(L) {
  let whichQuest = lua_touserdata(L, 1);
  console.warn('IsQuestDiscovered was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IsQuestFailed takes quest whichQuest returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsQuestFailed(L) {
  let whichQuest = lua_touserdata(L, 1);
  console.warn('IsQuestFailed was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IsQuestEnabled takes quest whichQuest returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsQuestEnabled(L) {
  let whichQuest = lua_touserdata(L, 1);
  console.warn('IsQuestEnabled was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native QuestCreateItem takes quest whichQuest returns questitem
 * 
 * @param {lua_State} L
 * @return {number}
 */
function QuestCreateItem(L) {
  let whichQuest = lua_touserdata(L, 1);
  console.warn('QuestCreateItem was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native QuestItemSetDescription takes questitem whichQuestItem, string description returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function QuestItemSetDescription(L) {
  let whichQuestItem = lua_touserdata(L, 1);
  let description = luaL_checkstring(L, 2);
  console.warn('QuestItemSetDescription was called but is not implemented :(');
  return 0
}

/**
 * native QuestItemSetCompleted takes questitem whichQuestItem, boolean completed returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function QuestItemSetCompleted(L) {
  let whichQuestItem = lua_touserdata(L, 1);
  let completed = lua_toboolean(L, 2);
  console.warn('QuestItemSetCompleted was called but is not implemented :(');
  return 0
}

/**
 * native IsQuestItemCompleted takes questitem whichQuestItem returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsQuestItemCompleted(L) {
  let whichQuestItem = lua_touserdata(L, 1);
  console.warn('IsQuestItemCompleted was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native CreateDefeatCondition takes nothing returns defeatcondition
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateDefeatCondition(L) {

  console.warn('CreateDefeatCondition was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native DestroyDefeatCondition takes defeatcondition whichCondition returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DestroyDefeatCondition(L) {
  let whichCondition = lua_touserdata(L, 1);
  console.warn('DestroyDefeatCondition was called but is not implemented :(');
  return 0
}

/**
 * native DefeatConditionSetDescription takes defeatcondition whichCondition, string description returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DefeatConditionSetDescription(L) {
  let whichCondition = lua_touserdata(L, 1);
  let description = luaL_checkstring(L, 2);
  console.warn('DefeatConditionSetDescription was called but is not implemented :(');
  return 0
}

/**
 * native FlashQuestDialogButton takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function FlashQuestDialogButton(L) {

  console.warn('FlashQuestDialogButton was called but is not implemented :(');
  return 0
}

/**
 * native ForceQuestDialogUpdate takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ForceQuestDialogUpdate(L) {

  console.warn('ForceQuestDialogUpdate was called but is not implemented :(');
  return 0
}

/**
 * native CreateTimerDialog takes timer t returns timerdialog
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateTimerDialog(L) {
  let t = lua_touserdata(L, 1);
  console.warn('CreateTimerDialog was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native DestroyTimerDialog takes timerdialog whichDialog returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DestroyTimerDialog(L) {
  let whichDialog = lua_touserdata(L, 1);
  console.warn('DestroyTimerDialog was called but is not implemented :(');
  return 0
}

/**
 * native TimerDialogSetTitle takes timerdialog whichDialog, string title returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TimerDialogSetTitle(L) {
  let whichDialog = lua_touserdata(L, 1);
  let title = luaL_checkstring(L, 2);
  console.warn('TimerDialogSetTitle was called but is not implemented :(');
  return 0
}

/**
 * native TimerDialogSetTitleColor takes timerdialog whichDialog, integer red, integer green, integer blue, integer alpha returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TimerDialogSetTitleColor(L) {
  let whichDialog = lua_touserdata(L, 1);
  let red = luaL_checkinteger(L, 2);
  let green = luaL_checkinteger(L, 3);
  let blue = luaL_checkinteger(L, 4);
  let alpha = luaL_checkinteger(L, 5);
  console.warn('TimerDialogSetTitleColor was called but is not implemented :(');
  return 0
}

/**
 * native TimerDialogSetTimeColor takes timerdialog whichDialog, integer red, integer green, integer blue, integer alpha returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TimerDialogSetTimeColor(L) {
  let whichDialog = lua_touserdata(L, 1);
  let red = luaL_checkinteger(L, 2);
  let green = luaL_checkinteger(L, 3);
  let blue = luaL_checkinteger(L, 4);
  let alpha = luaL_checkinteger(L, 5);
  console.warn('TimerDialogSetTimeColor was called but is not implemented :(');
  return 0
}

/**
 * native TimerDialogSetSpeed takes timerdialog whichDialog, real speedMultFactor returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TimerDialogSetSpeed(L) {
  let whichDialog = lua_touserdata(L, 1);
  let speedMultFactor = luaL_checknumber(L, 2);
  console.warn('TimerDialogSetSpeed was called but is not implemented :(');
  return 0
}

/**
 * native TimerDialogDisplay takes timerdialog whichDialog, boolean display returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TimerDialogDisplay(L) {
  let whichDialog = lua_touserdata(L, 1);
  let display = lua_toboolean(L, 2);
  console.warn('TimerDialogDisplay was called but is not implemented :(');
  return 0
}

/**
 * native IsTimerDialogDisplayed takes timerdialog whichDialog returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsTimerDialogDisplayed(L) {
  let whichDialog = lua_touserdata(L, 1);
  console.warn('IsTimerDialogDisplayed was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native TimerDialogSetRealTimeRemaining takes timerdialog whichDialog, real timeRemaining returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TimerDialogSetRealTimeRemaining(L) {
  let whichDialog = lua_touserdata(L, 1);
  let timeRemaining = luaL_checknumber(L, 2);
  console.warn('TimerDialogSetRealTimeRemaining was called but is not implemented :(');
  return 0
}

/**
 * native CreateLeaderboard takes nothing returns leaderboard
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateLeaderboard(L) {

  console.warn('CreateLeaderboard was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native DestroyLeaderboard takes leaderboard lb returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DestroyLeaderboard(L) {
  let lb = lua_touserdata(L, 1);
  console.warn('DestroyLeaderboard was called but is not implemented :(');
  return 0
}

/**
 * native LeaderboardDisplay takes leaderboard lb, boolean show returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LeaderboardDisplay(L) {
  let lb = lua_touserdata(L, 1);
  let show = lua_toboolean(L, 2);
  console.warn('LeaderboardDisplay was called but is not implemented :(');
  return 0
}

/**
 * native IsLeaderboardDisplayed takes leaderboard lb returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsLeaderboardDisplayed(L) {
  let lb = lua_touserdata(L, 1);
  console.warn('IsLeaderboardDisplayed was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native LeaderboardGetItemCount takes leaderboard lb returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LeaderboardGetItemCount(L) {
  let lb = lua_touserdata(L, 1);
  console.warn('LeaderboardGetItemCount was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native LeaderboardSetSizeByItemCount takes leaderboard lb, integer count returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LeaderboardSetSizeByItemCount(L) {
  let lb = lua_touserdata(L, 1);
  let count = luaL_checkinteger(L, 2);
  console.warn('LeaderboardSetSizeByItemCount was called but is not implemented :(');
  return 0
}

/**
 * native LeaderboardAddItem takes leaderboard lb, string label, integer value, player p returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LeaderboardAddItem(L) {
  let lb = lua_touserdata(L, 1);
  let label = luaL_checkstring(L, 2);
  let value = luaL_checkinteger(L, 3);
  let p = lua_touserdata(L, 4);
  console.warn('LeaderboardAddItem was called but is not implemented :(');
  return 0
}

/**
 * native LeaderboardRemoveItem takes leaderboard lb, integer index returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LeaderboardRemoveItem(L) {
  let lb = lua_touserdata(L, 1);
  let index = luaL_checkinteger(L, 2);
  console.warn('LeaderboardRemoveItem was called but is not implemented :(');
  return 0
}

/**
 * native LeaderboardRemovePlayerItem takes leaderboard lb, player p returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LeaderboardRemovePlayerItem(L) {
  let lb = lua_touserdata(L, 1);
  let p = lua_touserdata(L, 2);
  console.warn('LeaderboardRemovePlayerItem was called but is not implemented :(');
  return 0
}

/**
 * native LeaderboardClear takes leaderboard lb returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LeaderboardClear(L) {
  let lb = lua_touserdata(L, 1);
  console.warn('LeaderboardClear was called but is not implemented :(');
  return 0
}

/**
 * native LeaderboardSortItemsByValue takes leaderboard lb, boolean ascending returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LeaderboardSortItemsByValue(L) {
  let lb = lua_touserdata(L, 1);
  let ascending = lua_toboolean(L, 2);
  console.warn('LeaderboardSortItemsByValue was called but is not implemented :(');
  return 0
}

/**
 * native LeaderboardSortItemsByPlayer takes leaderboard lb, boolean ascending returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LeaderboardSortItemsByPlayer(L) {
  let lb = lua_touserdata(L, 1);
  let ascending = lua_toboolean(L, 2);
  console.warn('LeaderboardSortItemsByPlayer was called but is not implemented :(');
  return 0
}

/**
 * native LeaderboardSortItemsByLabel takes leaderboard lb, boolean ascending returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LeaderboardSortItemsByLabel(L) {
  let lb = lua_touserdata(L, 1);
  let ascending = lua_toboolean(L, 2);
  console.warn('LeaderboardSortItemsByLabel was called but is not implemented :(');
  return 0
}

/**
 * native LeaderboardHasPlayerItem takes leaderboard lb, player p returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LeaderboardHasPlayerItem(L) {
  let lb = lua_touserdata(L, 1);
  let p = lua_touserdata(L, 2);
  console.warn('LeaderboardHasPlayerItem was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native LeaderboardGetPlayerIndex takes leaderboard lb, player p returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LeaderboardGetPlayerIndex(L) {
  let lb = lua_touserdata(L, 1);
  let p = lua_touserdata(L, 2);
  console.warn('LeaderboardGetPlayerIndex was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native LeaderboardSetLabel takes leaderboard lb, string label returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LeaderboardSetLabel(L) {
  let lb = lua_touserdata(L, 1);
  let label = luaL_checkstring(L, 2);
  console.warn('LeaderboardSetLabel was called but is not implemented :(');
  return 0
}

/**
 * native LeaderboardGetLabelText takes leaderboard lb returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LeaderboardGetLabelText(L) {
  let lb = lua_touserdata(L, 1);
  console.warn('LeaderboardGetLabelText was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native PlayerSetLeaderboard takes player toPlayer, leaderboard lb returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PlayerSetLeaderboard(L) {
  let toPlayer = lua_touserdata(L, 1);
  let lb = lua_touserdata(L, 2);
  console.warn('PlayerSetLeaderboard was called but is not implemented :(');
  return 0
}

/**
 * native PlayerGetLeaderboard takes player toPlayer returns leaderboard
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PlayerGetLeaderboard(L) {
  let toPlayer = lua_touserdata(L, 1);
  console.warn('PlayerGetLeaderboard was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native LeaderboardSetLabelColor takes leaderboard lb, integer red, integer green, integer blue, integer alpha returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LeaderboardSetLabelColor(L) {
  let lb = lua_touserdata(L, 1);
  let red = luaL_checkinteger(L, 2);
  let green = luaL_checkinteger(L, 3);
  let blue = luaL_checkinteger(L, 4);
  let alpha = luaL_checkinteger(L, 5);
  console.warn('LeaderboardSetLabelColor was called but is not implemented :(');
  return 0
}

/**
 * native LeaderboardSetValueColor takes leaderboard lb, integer red, integer green, integer blue, integer alpha returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LeaderboardSetValueColor(L) {
  let lb = lua_touserdata(L, 1);
  let red = luaL_checkinteger(L, 2);
  let green = luaL_checkinteger(L, 3);
  let blue = luaL_checkinteger(L, 4);
  let alpha = luaL_checkinteger(L, 5);
  console.warn('LeaderboardSetValueColor was called but is not implemented :(');
  return 0
}

/**
 * native LeaderboardSetStyle takes leaderboard lb, boolean showLabel, boolean showNames, boolean showValues, boolean showIcons returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LeaderboardSetStyle(L) {
  let lb = lua_touserdata(L, 1);
  let showLabel = lua_toboolean(L, 2);
  let showNames = lua_toboolean(L, 3);
  let showValues = lua_toboolean(L, 4);
  let showIcons = lua_toboolean(L, 5);
  console.warn('LeaderboardSetStyle was called but is not implemented :(');
  return 0
}

/**
 * native LeaderboardSetItemValue takes leaderboard lb, integer whichItem, integer val returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LeaderboardSetItemValue(L) {
  let lb = lua_touserdata(L, 1);
  let whichItem = luaL_checkinteger(L, 2);
  let val = luaL_checkinteger(L, 3);
  console.warn('LeaderboardSetItemValue was called but is not implemented :(');
  return 0
}

/**
 * native LeaderboardSetItemLabel takes leaderboard lb, integer whichItem, string val returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LeaderboardSetItemLabel(L) {
  let lb = lua_touserdata(L, 1);
  let whichItem = luaL_checkinteger(L, 2);
  let val = luaL_checkstring(L, 3);
  console.warn('LeaderboardSetItemLabel was called but is not implemented :(');
  return 0
}

/**
 * native LeaderboardSetItemStyle takes leaderboard lb, integer whichItem, boolean showLabel, boolean showValue, boolean showIcon returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LeaderboardSetItemStyle(L) {
  let lb = lua_touserdata(L, 1);
  let whichItem = luaL_checkinteger(L, 2);
  let showLabel = lua_toboolean(L, 3);
  let showValue = lua_toboolean(L, 4);
  let showIcon = lua_toboolean(L, 5);
  console.warn('LeaderboardSetItemStyle was called but is not implemented :(');
  return 0
}

/**
 * native LeaderboardSetItemLabelColor takes leaderboard lb, integer whichItem, integer red, integer green, integer blue, integer alpha returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LeaderboardSetItemLabelColor(L) {
  let lb = lua_touserdata(L, 1);
  let whichItem = luaL_checkinteger(L, 2);
  let red = luaL_checkinteger(L, 3);
  let green = luaL_checkinteger(L, 4);
  let blue = luaL_checkinteger(L, 5);
  let alpha = luaL_checkinteger(L, 6);
  console.warn('LeaderboardSetItemLabelColor was called but is not implemented :(');
  return 0
}

/**
 * native LeaderboardSetItemValueColor takes leaderboard lb, integer whichItem, integer red, integer green, integer blue, integer alpha returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function LeaderboardSetItemValueColor(L) {
  let lb = lua_touserdata(L, 1);
  let whichItem = luaL_checkinteger(L, 2);
  let red = luaL_checkinteger(L, 3);
  let green = luaL_checkinteger(L, 4);
  let blue = luaL_checkinteger(L, 5);
  let alpha = luaL_checkinteger(L, 6);
  console.warn('LeaderboardSetItemValueColor was called but is not implemented :(');
  return 0
}

/**
 * native CreateMultiboard takes nothing returns multiboard
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateMultiboard(L) {

  console.warn('CreateMultiboard was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native DestroyMultiboard takes multiboard lb returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DestroyMultiboard(L) {
  let lb = lua_touserdata(L, 1);
  console.warn('DestroyMultiboard was called but is not implemented :(');
  return 0
}

/**
 * native MultiboardDisplay takes multiboard lb, boolean show returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MultiboardDisplay(L) {
  let lb = lua_touserdata(L, 1);
  let show = lua_toboolean(L, 2);
  console.warn('MultiboardDisplay was called but is not implemented :(');
  return 0
}

/**
 * native IsMultiboardDisplayed takes multiboard lb returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsMultiboardDisplayed(L) {
  let lb = lua_touserdata(L, 1);
  console.warn('IsMultiboardDisplayed was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native MultiboardMinimize takes multiboard lb, boolean minimize returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MultiboardMinimize(L) {
  let lb = lua_touserdata(L, 1);
  let minimize = lua_toboolean(L, 2);
  console.warn('MultiboardMinimize was called but is not implemented :(');
  return 0
}

/**
 * native IsMultiboardMinimized takes multiboard lb returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsMultiboardMinimized(L) {
  let lb = lua_touserdata(L, 1);
  console.warn('IsMultiboardMinimized was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native MultiboardClear takes multiboard lb returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MultiboardClear(L) {
  let lb = lua_touserdata(L, 1);
  console.warn('MultiboardClear was called but is not implemented :(');
  return 0
}

/**
 * native MultiboardSetTitleText takes multiboard lb, string label returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MultiboardSetTitleText(L) {
  let lb = lua_touserdata(L, 1);
  let label = luaL_checkstring(L, 2);
  console.warn('MultiboardSetTitleText was called but is not implemented :(');
  return 0
}

/**
 * native MultiboardGetTitleText takes multiboard lb returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MultiboardGetTitleText(L) {
  let lb = lua_touserdata(L, 1);
  console.warn('MultiboardGetTitleText was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native MultiboardSetTitleTextColor takes multiboard lb, integer red, integer green, integer blue, integer alpha returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MultiboardSetTitleTextColor(L) {
  let lb = lua_touserdata(L, 1);
  let red = luaL_checkinteger(L, 2);
  let green = luaL_checkinteger(L, 3);
  let blue = luaL_checkinteger(L, 4);
  let alpha = luaL_checkinteger(L, 5);
  console.warn('MultiboardSetTitleTextColor was called but is not implemented :(');
  return 0
}

/**
 * native MultiboardGetRowCount takes multiboard lb returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MultiboardGetRowCount(L) {
  let lb = lua_touserdata(L, 1);
  console.warn('MultiboardGetRowCount was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native MultiboardGetColumnCount takes multiboard lb returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MultiboardGetColumnCount(L) {
  let lb = lua_touserdata(L, 1);
  console.warn('MultiboardGetColumnCount was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native MultiboardSetColumnCount takes multiboard lb, integer count returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MultiboardSetColumnCount(L) {
  let lb = lua_touserdata(L, 1);
  let count = luaL_checkinteger(L, 2);
  console.warn('MultiboardSetColumnCount was called but is not implemented :(');
  return 0
}

/**
 * native MultiboardSetRowCount takes multiboard lb, integer count returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MultiboardSetRowCount(L) {
  let lb = lua_touserdata(L, 1);
  let count = luaL_checkinteger(L, 2);
  console.warn('MultiboardSetRowCount was called but is not implemented :(');
  return 0
}

/**
 * native MultiboardSetItemsStyle takes multiboard lb, boolean showValues, boolean showIcons returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MultiboardSetItemsStyle(L) {
  let lb = lua_touserdata(L, 1);
  let showValues = lua_toboolean(L, 2);
  let showIcons = lua_toboolean(L, 3);
  console.warn('MultiboardSetItemsStyle was called but is not implemented :(');
  return 0
}

/**
 * native MultiboardSetItemsValue takes multiboard lb, string value returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MultiboardSetItemsValue(L) {
  let lb = lua_touserdata(L, 1);
  let value = luaL_checkstring(L, 2);
  console.warn('MultiboardSetItemsValue was called but is not implemented :(');
  return 0
}

/**
 * native MultiboardSetItemsValueColor takes multiboard lb, integer red, integer green, integer blue, integer alpha returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MultiboardSetItemsValueColor(L) {
  let lb = lua_touserdata(L, 1);
  let red = luaL_checkinteger(L, 2);
  let green = luaL_checkinteger(L, 3);
  let blue = luaL_checkinteger(L, 4);
  let alpha = luaL_checkinteger(L, 5);
  console.warn('MultiboardSetItemsValueColor was called but is not implemented :(');
  return 0
}

/**
 * native MultiboardSetItemsWidth takes multiboard lb, real width returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MultiboardSetItemsWidth(L) {
  let lb = lua_touserdata(L, 1);
  let width = luaL_checknumber(L, 2);
  console.warn('MultiboardSetItemsWidth was called but is not implemented :(');
  return 0
}

/**
 * native MultiboardSetItemsIcon takes multiboard lb, string iconPath returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MultiboardSetItemsIcon(L) {
  let lb = lua_touserdata(L, 1);
  let iconPath = luaL_checkstring(L, 2);
  console.warn('MultiboardSetItemsIcon was called but is not implemented :(');
  return 0
}

/**
 * native MultiboardGetItem takes multiboard lb, integer row, integer column returns multiboarditem
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MultiboardGetItem(L) {
  let lb = lua_touserdata(L, 1);
  let row = luaL_checkinteger(L, 2);
  let column = luaL_checkinteger(L, 3);
  console.warn('MultiboardGetItem was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native MultiboardReleaseItem takes multiboarditem mbi returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MultiboardReleaseItem(L) {
  let mbi = lua_touserdata(L, 1);
  console.warn('MultiboardReleaseItem was called but is not implemented :(');
  return 0
}

/**
 * native MultiboardSetItemStyle takes multiboarditem mbi, boolean showValue, boolean showIcon returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MultiboardSetItemStyle(L) {
  let mbi = lua_touserdata(L, 1);
  let showValue = lua_toboolean(L, 2);
  let showIcon = lua_toboolean(L, 3);
  console.warn('MultiboardSetItemStyle was called but is not implemented :(');
  return 0
}

/**
 * native MultiboardSetItemValue takes multiboarditem mbi, string val returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MultiboardSetItemValue(L) {
  let mbi = lua_touserdata(L, 1);
  let val = luaL_checkstring(L, 2);
  console.warn('MultiboardSetItemValue was called but is not implemented :(');
  return 0
}

/**
 * native MultiboardSetItemValueColor takes multiboarditem mbi, integer red, integer green, integer blue, integer alpha returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MultiboardSetItemValueColor(L) {
  let mbi = lua_touserdata(L, 1);
  let red = luaL_checkinteger(L, 2);
  let green = luaL_checkinteger(L, 3);
  let blue = luaL_checkinteger(L, 4);
  let alpha = luaL_checkinteger(L, 5);
  console.warn('MultiboardSetItemValueColor was called but is not implemented :(');
  return 0
}

/**
 * native MultiboardSetItemWidth takes multiboarditem mbi, real width returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MultiboardSetItemWidth(L) {
  let mbi = lua_touserdata(L, 1);
  let width = luaL_checknumber(L, 2);
  console.warn('MultiboardSetItemWidth was called but is not implemented :(');
  return 0
}

/**
 * native MultiboardSetItemIcon takes multiboarditem mbi, string iconFileName returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MultiboardSetItemIcon(L) {
  let mbi = lua_touserdata(L, 1);
  let iconFileName = luaL_checkstring(L, 2);
  console.warn('MultiboardSetItemIcon was called but is not implemented :(');
  return 0
}

/**
 * native MultiboardSuppressDisplay takes boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MultiboardSuppressDisplay(L) {
  let flag = lua_toboolean(L, 1);
  console.warn('MultiboardSuppressDisplay was called but is not implemented :(');
  return 0
}

/**
 * native SetCameraPosition takes real x, real y returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetCameraPosition(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  console.warn('SetCameraPosition was called but is not implemented :(');
  return 0
}

/**
 * native SetCameraQuickPosition takes real x, real y returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetCameraQuickPosition(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  console.warn('SetCameraQuickPosition was called but is not implemented :(');
  return 0
}

/**
 * native SetCameraBounds takes real x1, real y1, real x2, real y2, real x3, real y3, real x4, real y4 returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetCameraBounds(L) {
  let x1 = luaL_checknumber(L, 1);
  let y1 = luaL_checknumber(L, 2);
  let x2 = luaL_checknumber(L, 3);
  let y2 = luaL_checknumber(L, 4);
  let x3 = luaL_checknumber(L, 5);
  let y3 = luaL_checknumber(L, 6);
  let x4 = luaL_checknumber(L, 7);
  let y4 = luaL_checknumber(L, 8);
  console.warn('SetCameraBounds was called but is not implemented :(');
  return 0
}

/**
 * native StopCamera takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function StopCamera(L) {

  console.warn('StopCamera was called but is not implemented :(');
  return 0
}

/**
 * native ResetToGameCamera takes real duration returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ResetToGameCamera(L) {
  let duration = luaL_checknumber(L, 1);
  console.warn('ResetToGameCamera was called but is not implemented :(');
  return 0
}

/**
 * native PanCameraTo takes real x, real y returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PanCameraTo(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  console.warn('PanCameraTo was called but is not implemented :(');
  return 0
}

/**
 * native PanCameraToTimed takes real x, real y, real duration returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PanCameraToTimed(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  let duration = luaL_checknumber(L, 3);
  console.warn('PanCameraToTimed was called but is not implemented :(');
  return 0
}

/**
 * native PanCameraToWithZ takes real x, real y, real zOffsetDest returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PanCameraToWithZ(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  let zOffsetDest = luaL_checknumber(L, 3);
  console.warn('PanCameraToWithZ was called but is not implemented :(');
  return 0
}

/**
 * native PanCameraToTimedWithZ takes real x, real y, real zOffsetDest, real duration returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PanCameraToTimedWithZ(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  let zOffsetDest = luaL_checknumber(L, 3);
  let duration = luaL_checknumber(L, 4);
  console.warn('PanCameraToTimedWithZ was called but is not implemented :(');
  return 0
}

/**
 * native SetCinematicCamera takes string cameraModelFile returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetCinematicCamera(L) {
  let cameraModelFile = luaL_checkstring(L, 1);
  console.warn('SetCinematicCamera was called but is not implemented :(');
  return 0
}

/**
 * native SetCameraRotateMode takes real x, real y, real radiansToSweep, real duration returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetCameraRotateMode(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  let radiansToSweep = luaL_checknumber(L, 3);
  let duration = luaL_checknumber(L, 4);
  console.warn('SetCameraRotateMode was called but is not implemented :(');
  return 0
}

/**
 * native SetCameraField takes camerafield whichField, real value, real duration returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetCameraField(L) {
  let whichField = lua_touserdata(L, 1);
  let value = luaL_checknumber(L, 2);
  let duration = luaL_checknumber(L, 3);
  console.warn('SetCameraField was called but is not implemented :(');
  return 0
}

/**
 * native AdjustCameraField takes camerafield whichField, real offset, real duration returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AdjustCameraField(L) {
  let whichField = lua_touserdata(L, 1);
  let offset = luaL_checknumber(L, 2);
  let duration = luaL_checknumber(L, 3);
  console.warn('AdjustCameraField was called but is not implemented :(');
  return 0
}

/**
 * native SetCameraTargetController takes unit whichUnit, real xoffset, real yoffset, boolean inheritOrientation returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetCameraTargetController(L) {
  let whichUnit = lua_touserdata(L, 1);
  let xoffset = luaL_checknumber(L, 2);
  let yoffset = luaL_checknumber(L, 3);
  let inheritOrientation = lua_toboolean(L, 4);
  console.warn('SetCameraTargetController was called but is not implemented :(');
  return 0
}

/**
 * native SetCameraOrientController takes unit whichUnit, real xoffset, real yoffset returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetCameraOrientController(L) {
  let whichUnit = lua_touserdata(L, 1);
  let xoffset = luaL_checknumber(L, 2);
  let yoffset = luaL_checknumber(L, 3);
  console.warn('SetCameraOrientController was called but is not implemented :(');
  return 0
}

/**
 * native CreateCameraSetup takes nothing returns camerasetup
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateCameraSetup(L) {

  console.warn('CreateCameraSetup was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native CameraSetupSetField takes camerasetup whichSetup, camerafield whichField, real value, real duration returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CameraSetupSetField(L) {
  let whichSetup = lua_touserdata(L, 1);
  let whichField = lua_touserdata(L, 2);
  let value = luaL_checknumber(L, 3);
  let duration = luaL_checknumber(L, 4);
  console.warn('CameraSetupSetField was called but is not implemented :(');
  return 0
}

/**
 * native CameraSetupGetField takes camerasetup whichSetup, camerafield whichField returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CameraSetupGetField(L) {
  let whichSetup = lua_touserdata(L, 1);
  let whichField = lua_touserdata(L, 2);
  console.warn('CameraSetupGetField was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native CameraSetupSetDestPosition takes camerasetup whichSetup, real x, real y, real duration returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CameraSetupSetDestPosition(L) {
  let whichSetup = lua_touserdata(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  let duration = luaL_checknumber(L, 4);
  console.warn('CameraSetupSetDestPosition was called but is not implemented :(');
  return 0
}

/**
 * native CameraSetupGetDestPositionLoc takes camerasetup whichSetup returns location
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CameraSetupGetDestPositionLoc(L) {
  let whichSetup = lua_touserdata(L, 1);
  console.warn('CameraSetupGetDestPositionLoc was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native CameraSetupGetDestPositionX takes camerasetup whichSetup returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CameraSetupGetDestPositionX(L) {
  let whichSetup = lua_touserdata(L, 1);
  console.warn('CameraSetupGetDestPositionX was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native CameraSetupGetDestPositionY takes camerasetup whichSetup returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CameraSetupGetDestPositionY(L) {
  let whichSetup = lua_touserdata(L, 1);
  console.warn('CameraSetupGetDestPositionY was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native CameraSetupApply takes camerasetup whichSetup, boolean doPan, boolean panTimed returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CameraSetupApply(L) {
  let whichSetup = lua_touserdata(L, 1);
  let doPan = lua_toboolean(L, 2);
  let panTimed = lua_toboolean(L, 3);
  console.warn('CameraSetupApply was called but is not implemented :(');
  return 0
}

/**
 * native CameraSetupApplyWithZ takes camerasetup whichSetup, real zDestOffset returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CameraSetupApplyWithZ(L) {
  let whichSetup = lua_touserdata(L, 1);
  let zDestOffset = luaL_checknumber(L, 2);
  console.warn('CameraSetupApplyWithZ was called but is not implemented :(');
  return 0
}

/**
 * native CameraSetupApplyForceDuration takes camerasetup whichSetup, boolean doPan, real forceDuration returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CameraSetupApplyForceDuration(L) {
  let whichSetup = lua_touserdata(L, 1);
  let doPan = lua_toboolean(L, 2);
  let forceDuration = luaL_checknumber(L, 3);
  console.warn('CameraSetupApplyForceDuration was called but is not implemented :(');
  return 0
}

/**
 * native CameraSetupApplyForceDurationWithZ takes camerasetup whichSetup, real zDestOffset, real forceDuration returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CameraSetupApplyForceDurationWithZ(L) {
  let whichSetup = lua_touserdata(L, 1);
  let zDestOffset = luaL_checknumber(L, 2);
  let forceDuration = luaL_checknumber(L, 3);
  console.warn('CameraSetupApplyForceDurationWithZ was called but is not implemented :(');
  return 0
}

/**
 * native CameraSetTargetNoise takes real mag, real velocity returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CameraSetTargetNoise(L) {
  let mag = luaL_checknumber(L, 1);
  let velocity = luaL_checknumber(L, 2);
  console.warn('CameraSetTargetNoise was called but is not implemented :(');
  return 0
}

/**
 * native CameraSetSourceNoise takes real mag, real velocity returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CameraSetSourceNoise(L) {
  let mag = luaL_checknumber(L, 1);
  let velocity = luaL_checknumber(L, 2);
  console.warn('CameraSetSourceNoise was called but is not implemented :(');
  return 0
}

/**
 * native CameraSetTargetNoiseEx takes real mag, real velocity, boolean vertOnly returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CameraSetTargetNoiseEx(L) {
  let mag = luaL_checknumber(L, 1);
  let velocity = luaL_checknumber(L, 2);
  let vertOnly = lua_toboolean(L, 3);
  console.warn('CameraSetTargetNoiseEx was called but is not implemented :(');
  return 0
}

/**
 * native CameraSetSourceNoiseEx takes real mag, real velocity, boolean vertOnly returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CameraSetSourceNoiseEx(L) {
  let mag = luaL_checknumber(L, 1);
  let velocity = luaL_checknumber(L, 2);
  let vertOnly = lua_toboolean(L, 3);
  console.warn('CameraSetSourceNoiseEx was called but is not implemented :(');
  return 0
}

/**
 * native CameraSetSmoothingFactor takes real factor returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CameraSetSmoothingFactor(L) {
  let factor = luaL_checknumber(L, 1);
  console.warn('CameraSetSmoothingFactor was called but is not implemented :(');
  return 0
}

/**
 * native SetCineFilterTexture takes string filename returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetCineFilterTexture(L) {
  let filename = luaL_checkstring(L, 1);
  console.warn('SetCineFilterTexture was called but is not implemented :(');
  return 0
}

/**
 * native SetCineFilterBlendMode takes blendmode whichMode returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetCineFilterBlendMode(L) {
  let whichMode = lua_touserdata(L, 1);
  console.warn('SetCineFilterBlendMode was called but is not implemented :(');
  return 0
}

/**
 * native SetCineFilterTexMapFlags takes texmapflags whichFlags returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetCineFilterTexMapFlags(L) {
  let whichFlags = lua_touserdata(L, 1);
  console.warn('SetCineFilterTexMapFlags was called but is not implemented :(');
  return 0
}

/**
 * native SetCineFilterStartUV takes real minu, real minv, real maxu, real maxv returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetCineFilterStartUV(L) {
  let minu = luaL_checknumber(L, 1);
  let minv = luaL_checknumber(L, 2);
  let maxu = luaL_checknumber(L, 3);
  let maxv = luaL_checknumber(L, 4);
  console.warn('SetCineFilterStartUV was called but is not implemented :(');
  return 0
}

/**
 * native SetCineFilterEndUV takes real minu, real minv, real maxu, real maxv returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetCineFilterEndUV(L) {
  let minu = luaL_checknumber(L, 1);
  let minv = luaL_checknumber(L, 2);
  let maxu = luaL_checknumber(L, 3);
  let maxv = luaL_checknumber(L, 4);
  console.warn('SetCineFilterEndUV was called but is not implemented :(');
  return 0
}

/**
 * native SetCineFilterStartColor takes integer red, integer green, integer blue, integer alpha returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetCineFilterStartColor(L) {
  let red = luaL_checkinteger(L, 1);
  let green = luaL_checkinteger(L, 2);
  let blue = luaL_checkinteger(L, 3);
  let alpha = luaL_checkinteger(L, 4);
  console.warn('SetCineFilterStartColor was called but is not implemented :(');
  return 0
}

/**
 * native SetCineFilterEndColor takes integer red, integer green, integer blue, integer alpha returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetCineFilterEndColor(L) {
  let red = luaL_checkinteger(L, 1);
  let green = luaL_checkinteger(L, 2);
  let blue = luaL_checkinteger(L, 3);
  let alpha = luaL_checkinteger(L, 4);
  console.warn('SetCineFilterEndColor was called but is not implemented :(');
  return 0
}

/**
 * native SetCineFilterDuration takes real duration returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetCineFilterDuration(L) {
  let duration = luaL_checknumber(L, 1);
  console.warn('SetCineFilterDuration was called but is not implemented :(');
  return 0
}

/**
 * native DisplayCineFilter takes boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DisplayCineFilter(L) {
  let flag = lua_toboolean(L, 1);
  console.warn('DisplayCineFilter was called but is not implemented :(');
  return 0
}

/**
 * native IsCineFilterDisplayed takes nothing returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsCineFilterDisplayed(L) {

  console.warn('IsCineFilterDisplayed was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SetCinematicScene takes integer portraitUnitId, playercolor color, string speakerTitle, string text, real sceneDuration, real voiceoverDuration returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetCinematicScene(L) {
  let portraitUnitId = luaL_checkinteger(L, 1);
  let color = lua_touserdata(L, 2);
  let speakerTitle = luaL_checkstring(L, 3);
  let text = luaL_checkstring(L, 4);
  let sceneDuration = luaL_checknumber(L, 5);
  let voiceoverDuration = luaL_checknumber(L, 6);
  console.warn('SetCinematicScene was called but is not implemented :(');
  return 0
}

/**
 * native EndCinematicScene takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function EndCinematicScene(L) {

  console.warn('EndCinematicScene was called but is not implemented :(');
  return 0
}

/**
 * native ForceCinematicSubtitles takes boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ForceCinematicSubtitles(L) {
  let flag = lua_toboolean(L, 1);
  console.warn('ForceCinematicSubtitles was called but is not implemented :(');
  return 0
}

/**
 * native GetCameraMargin takes integer whichMargin returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetCameraMargin(L) {
  let whichMargin = luaL_checkinteger(L, 1);
  console.warn('GetCameraMargin was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetCameraBoundMinX takes nothing returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetCameraBoundMinX(L) {

  console.warn('GetCameraBoundMinX was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetCameraBoundMinY takes nothing returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetCameraBoundMinY(L) {

  console.warn('GetCameraBoundMinY was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetCameraBoundMaxX takes nothing returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetCameraBoundMaxX(L) {

  console.warn('GetCameraBoundMaxX was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetCameraBoundMaxY takes nothing returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetCameraBoundMaxY(L) {

  console.warn('GetCameraBoundMaxY was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetCameraField takes camerafield whichField returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetCameraField(L) {
  let whichField = lua_touserdata(L, 1);
  console.warn('GetCameraField was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetCameraTargetPositionX takes nothing returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetCameraTargetPositionX(L) {

  console.warn('GetCameraTargetPositionX was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetCameraTargetPositionY takes nothing returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetCameraTargetPositionY(L) {

  console.warn('GetCameraTargetPositionY was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetCameraTargetPositionZ takes nothing returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetCameraTargetPositionZ(L) {

  console.warn('GetCameraTargetPositionZ was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetCameraTargetPositionLoc takes nothing returns location
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetCameraTargetPositionLoc(L) {

  console.warn('GetCameraTargetPositionLoc was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * constant native GetCameraEyePositionX takes nothing returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetCameraEyePositionX(L) {

  console.warn('GetCameraEyePositionX was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetCameraEyePositionY takes nothing returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetCameraEyePositionY(L) {

  console.warn('GetCameraEyePositionY was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetCameraEyePositionZ takes nothing returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetCameraEyePositionZ(L) {

  console.warn('GetCameraEyePositionZ was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * constant native GetCameraEyePositionLoc takes nothing returns location
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetCameraEyePositionLoc(L) {

  console.warn('GetCameraEyePositionLoc was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native NewSoundEnvironment takes string environmentName returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function NewSoundEnvironment(L) {
  let environmentName = luaL_checkstring(L, 1);
  console.warn('NewSoundEnvironment was called but is not implemented :(');
  return 0
}

/**
 * native CreateSound takes string fileName, boolean looping, boolean is3D, boolean stopwhenoutofrange, integer fadeInRate, integer fadeOutRate, string eaxSetting returns sound
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateSound(L) {
  let fileName = luaL_checkstring(L, 1);
  let looping = lua_toboolean(L, 2);
  let is3D = lua_toboolean(L, 3);
  let stopwhenoutofrange = lua_toboolean(L, 4);
  let fadeInRate = luaL_checkinteger(L, 5);
  let fadeOutRate = luaL_checkinteger(L, 6);
  let eaxSetting = luaL_checkstring(L, 7);
  console.warn('CreateSound was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native CreateSoundFilenameWithLabel takes string fileName, boolean looping, boolean is3D, boolean stopwhenoutofrange, integer fadeInRate, integer fadeOutRate, string SLKEntryName returns sound
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateSoundFilenameWithLabel(L) {
  let fileName = luaL_checkstring(L, 1);
  let looping = lua_toboolean(L, 2);
  let is3D = lua_toboolean(L, 3);
  let stopwhenoutofrange = lua_toboolean(L, 4);
  let fadeInRate = luaL_checkinteger(L, 5);
  let fadeOutRate = luaL_checkinteger(L, 6);
  let SLKEntryName = luaL_checkstring(L, 7);
  console.warn('CreateSoundFilenameWithLabel was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native CreateSoundFromLabel takes string soundLabel, boolean looping, boolean is3D, boolean stopwhenoutofrange, integer fadeInRate, integer fadeOutRate returns sound
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateSoundFromLabel(L) {
  let soundLabel = luaL_checkstring(L, 1);
  let looping = lua_toboolean(L, 2);
  let is3D = lua_toboolean(L, 3);
  let stopwhenoutofrange = lua_toboolean(L, 4);
  let fadeInRate = luaL_checkinteger(L, 5);
  let fadeOutRate = luaL_checkinteger(L, 6);
  console.warn('CreateSoundFromLabel was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native CreateMIDISound takes string soundLabel, integer fadeInRate, integer fadeOutRate returns sound
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateMIDISound(L) {
  let soundLabel = luaL_checkstring(L, 1);
  let fadeInRate = luaL_checkinteger(L, 2);
  let fadeOutRate = luaL_checkinteger(L, 3);
  console.warn('CreateMIDISound was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native SetSoundParamsFromLabel takes sound soundHandle, string soundLabel returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetSoundParamsFromLabel(L) {
  let soundHandle = lua_touserdata(L, 1);
  let soundLabel = luaL_checkstring(L, 2);
  console.warn('SetSoundParamsFromLabel was called but is not implemented :(');
  return 0
}

/**
 * native SetSoundDistanceCutoff takes sound soundHandle, real cutoff returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetSoundDistanceCutoff(L) {
  let soundHandle = lua_touserdata(L, 1);
  let cutoff = luaL_checknumber(L, 2);
  console.warn('SetSoundDistanceCutoff was called but is not implemented :(');
  return 0
}

/**
 * native SetSoundChannel takes sound soundHandle, integer channel returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetSoundChannel(L) {
  let soundHandle = lua_touserdata(L, 1);
  let channel = luaL_checkinteger(L, 2);
  console.warn('SetSoundChannel was called but is not implemented :(');
  return 0
}

/**
 * native SetSoundVolume takes sound soundHandle, integer volume returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetSoundVolume(L) {
  let soundHandle = lua_touserdata(L, 1);
  let volume = luaL_checkinteger(L, 2);
  console.warn('SetSoundVolume was called but is not implemented :(');
  return 0
}

/**
 * native SetSoundPitch takes sound soundHandle, real pitch returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetSoundPitch(L) {
  let soundHandle = lua_touserdata(L, 1);
  let pitch = luaL_checknumber(L, 2);
  console.warn('SetSoundPitch was called but is not implemented :(');
  return 0
}

/**
 * native SetSoundPlayPosition takes sound soundHandle, integer millisecs returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetSoundPlayPosition(L) {
  let soundHandle = lua_touserdata(L, 1);
  let millisecs = luaL_checkinteger(L, 2);
  console.warn('SetSoundPlayPosition was called but is not implemented :(');
  return 0
}

/**
 * native SetSoundDistances takes sound soundHandle, real minDist, real maxDist returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetSoundDistances(L) {
  let soundHandle = lua_touserdata(L, 1);
  let minDist = luaL_checknumber(L, 2);
  let maxDist = luaL_checknumber(L, 3);
  console.warn('SetSoundDistances was called but is not implemented :(');
  return 0
}

/**
 * native SetSoundConeAngles takes sound soundHandle, real inside, real outside, integer outsideVolume returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetSoundConeAngles(L) {
  let soundHandle = lua_touserdata(L, 1);
  let inside = luaL_checknumber(L, 2);
  let outside = luaL_checknumber(L, 3);
  let outsideVolume = luaL_checkinteger(L, 4);
  console.warn('SetSoundConeAngles was called but is not implemented :(');
  return 0
}

/**
 * native SetSoundConeOrientation takes sound soundHandle, real x, real y, real z returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetSoundConeOrientation(L) {
  let soundHandle = lua_touserdata(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  let z = luaL_checknumber(L, 4);
  console.warn('SetSoundConeOrientation was called but is not implemented :(');
  return 0
}

/**
 * native SetSoundPosition takes sound soundHandle, real x, real y, real z returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetSoundPosition(L) {
  let soundHandle = lua_touserdata(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  let z = luaL_checknumber(L, 4);
  console.warn('SetSoundPosition was called but is not implemented :(');
  return 0
}

/**
 * native SetSoundVelocity takes sound soundHandle, real x, real y, real z returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetSoundVelocity(L) {
  let soundHandle = lua_touserdata(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  let z = luaL_checknumber(L, 4);
  console.warn('SetSoundVelocity was called but is not implemented :(');
  return 0
}

/**
 * native AttachSoundToUnit takes sound soundHandle, unit whichUnit returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AttachSoundToUnit(L) {
  let soundHandle = lua_touserdata(L, 1);
  let whichUnit = lua_touserdata(L, 2);
  console.warn('AttachSoundToUnit was called but is not implemented :(');
  return 0
}

/**
 * native StartSound takes sound soundHandle returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function StartSound(L) {
  let soundHandle = lua_touserdata(L, 1);
  console.warn('StartSound was called but is not implemented :(');
  return 0
}

/**
 * native StopSound takes sound soundHandle, boolean killWhenDone, boolean fadeOut returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function StopSound(L) {
  let soundHandle = lua_touserdata(L, 1);
  let killWhenDone = lua_toboolean(L, 2);
  let fadeOut = lua_toboolean(L, 3);
  console.warn('StopSound was called but is not implemented :(');
  return 0
}

/**
 * native KillSoundWhenDone takes sound soundHandle returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function KillSoundWhenDone(L) {
  let soundHandle = lua_touserdata(L, 1);
  console.warn('KillSoundWhenDone was called but is not implemented :(');
  return 0
}

/**
 * native SetMapMusic takes string musicName, boolean random, integer index returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetMapMusic(L) {
  let musicName = luaL_checkstring(L, 1);
  let random = lua_toboolean(L, 2);
  let index = luaL_checkinteger(L, 3);
  console.warn('SetMapMusic was called but is not implemented :(');
  return 0
}

/**
 * native ClearMapMusic takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ClearMapMusic(L) {

  console.warn('ClearMapMusic was called but is not implemented :(');
  return 0
}

/**
 * native PlayMusic takes string musicName returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PlayMusic(L) {
  let musicName = luaL_checkstring(L, 1);
  console.warn('PlayMusic was called but is not implemented :(');
  return 0
}

/**
 * native PlayMusicEx takes string musicName, integer frommsecs, integer fadeinmsecs returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PlayMusicEx(L) {
  let musicName = luaL_checkstring(L, 1);
  let frommsecs = luaL_checkinteger(L, 2);
  let fadeinmsecs = luaL_checkinteger(L, 3);
  console.warn('PlayMusicEx was called but is not implemented :(');
  return 0
}

/**
 * native StopMusic takes boolean fadeOut returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function StopMusic(L) {
  let fadeOut = lua_toboolean(L, 1);
  console.warn('StopMusic was called but is not implemented :(');
  return 0
}

/**
 * native ResumeMusic takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ResumeMusic(L) {

  console.warn('ResumeMusic was called but is not implemented :(');
  return 0
}

/**
 * native PlayThematicMusic takes string musicFileName returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PlayThematicMusic(L) {
  let musicFileName = luaL_checkstring(L, 1);
  console.warn('PlayThematicMusic was called but is not implemented :(');
  return 0
}

/**
 * native PlayThematicMusicEx takes string musicFileName, integer frommsecs returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PlayThematicMusicEx(L) {
  let musicFileName = luaL_checkstring(L, 1);
  let frommsecs = luaL_checkinteger(L, 2);
  console.warn('PlayThematicMusicEx was called but is not implemented :(');
  return 0
}

/**
 * native EndThematicMusic takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function EndThematicMusic(L) {

  console.warn('EndThematicMusic was called but is not implemented :(');
  return 0
}

/**
 * native SetMusicVolume takes integer volume returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetMusicVolume(L) {
  let volume = luaL_checkinteger(L, 1);
  console.warn('SetMusicVolume was called but is not implemented :(');
  return 0
}

/**
 * native SetMusicPlayPosition takes integer millisecs returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetMusicPlayPosition(L) {
  let millisecs = luaL_checkinteger(L, 1);
  console.warn('SetMusicPlayPosition was called but is not implemented :(');
  return 0
}

/**
 * native SetThematicMusicPlayPosition takes integer millisecs returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetThematicMusicPlayPosition(L) {
  let millisecs = luaL_checkinteger(L, 1);
  console.warn('SetThematicMusicPlayPosition was called but is not implemented :(');
  return 0
}

/**
 * native SetSoundDuration takes sound soundHandle, integer duration returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetSoundDuration(L) {
  let soundHandle = lua_touserdata(L, 1);
  let duration = luaL_checkinteger(L, 2);
  console.warn('SetSoundDuration was called but is not implemented :(');
  return 0
}

/**
 * native GetSoundDuration takes sound soundHandle returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetSoundDuration(L) {
  let soundHandle = lua_touserdata(L, 1);
  console.warn('GetSoundDuration was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native GetSoundFileDuration takes string musicFileName returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetSoundFileDuration(L) {
  let musicFileName = luaL_checkstring(L, 1);
  console.warn('GetSoundFileDuration was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native VolumeGroupSetVolume takes volumegroup vgroup, real scale returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function VolumeGroupSetVolume(L) {
  let vgroup = lua_touserdata(L, 1);
  let scale = luaL_checknumber(L, 2);
  console.warn('VolumeGroupSetVolume was called but is not implemented :(');
  return 0
}

/**
 * native VolumeGroupReset takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function VolumeGroupReset(L) {

  console.warn('VolumeGroupReset was called but is not implemented :(');
  return 0
}

/**
 * native GetSoundIsPlaying takes sound soundHandle returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetSoundIsPlaying(L) {
  let soundHandle = lua_touserdata(L, 1);
  console.warn('GetSoundIsPlaying was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native GetSoundIsLoading takes sound soundHandle returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetSoundIsLoading(L) {
  let soundHandle = lua_touserdata(L, 1);
  console.warn('GetSoundIsLoading was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native RegisterStackedSound takes sound soundHandle, boolean byPosition, real rectwidth, real rectheight returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RegisterStackedSound(L) {
  let soundHandle = lua_touserdata(L, 1);
  let byPosition = lua_toboolean(L, 2);
  let rectwidth = luaL_checknumber(L, 3);
  let rectheight = luaL_checknumber(L, 4);
  console.warn('RegisterStackedSound was called but is not implemented :(');
  return 0
}

/**
 * native UnregisterStackedSound takes sound soundHandle, boolean byPosition, real rectwidth, real rectheight returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function UnregisterStackedSound(L) {
  let soundHandle = lua_touserdata(L, 1);
  let byPosition = lua_toboolean(L, 2);
  let rectwidth = luaL_checknumber(L, 3);
  let rectheight = luaL_checknumber(L, 4);
  console.warn('UnregisterStackedSound was called but is not implemented :(');
  return 0
}

/**
 * native AddWeatherEffect takes rect where, integer effectID returns weathereffect
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AddWeatherEffect(L) {
  let where = lua_touserdata(L, 1);
  let effectID = luaL_checkinteger(L, 2);
  console.warn('AddWeatherEffect was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native RemoveWeatherEffect takes weathereffect whichEffect returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RemoveWeatherEffect(L) {
  let whichEffect = lua_touserdata(L, 1);
  console.warn('RemoveWeatherEffect was called but is not implemented :(');
  return 0
}

/**
 * native EnableWeatherEffect takes weathereffect whichEffect, boolean enable returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function EnableWeatherEffect(L) {
  let whichEffect = lua_touserdata(L, 1);
  let enable = lua_toboolean(L, 2);
  console.warn('EnableWeatherEffect was called but is not implemented :(');
  return 0
}

/**
 * native TerrainDeformCrater takes real x, real y, real radius, real depth, integer duration, boolean permanent returns terraindeformation
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TerrainDeformCrater(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  let radius = luaL_checknumber(L, 3);
  let depth = luaL_checknumber(L, 4);
  let duration = luaL_checkinteger(L, 5);
  let permanent = lua_toboolean(L, 6);
  console.warn('TerrainDeformCrater was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native TerrainDeformRipple takes real x, real y, real radius, real depth, integer duration, integer count, real spaceWaves, real timeWaves, real radiusStartPct, boolean limitNeg returns terraindeformation
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TerrainDeformRipple(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  let radius = luaL_checknumber(L, 3);
  let depth = luaL_checknumber(L, 4);
  let duration = luaL_checkinteger(L, 5);
  let count = luaL_checkinteger(L, 6);
  let spaceWaves = luaL_checknumber(L, 7);
  let timeWaves = luaL_checknumber(L, 8);
  let radiusStartPct = luaL_checknumber(L, 9);
  let limitNeg = lua_toboolean(L, 10);
  console.warn('TerrainDeformRipple was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native TerrainDeformWave takes real x, real y, real dirX, real dirY, real distance, real speed, real radius, real depth, integer trailTime, integer count returns terraindeformation
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TerrainDeformWave(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  let dirX = luaL_checknumber(L, 3);
  let dirY = luaL_checknumber(L, 4);
  let distance = luaL_checknumber(L, 5);
  let speed = luaL_checknumber(L, 6);
  let radius = luaL_checknumber(L, 7);
  let depth = luaL_checknumber(L, 8);
  let trailTime = luaL_checkinteger(L, 9);
  let count = luaL_checkinteger(L, 10);
  console.warn('TerrainDeformWave was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native TerrainDeformRandom takes real x, real y, real radius, real minDelta, real maxDelta, integer duration, integer updateInterval returns terraindeformation
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TerrainDeformRandom(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  let radius = luaL_checknumber(L, 3);
  let minDelta = luaL_checknumber(L, 4);
  let maxDelta = luaL_checknumber(L, 5);
  let duration = luaL_checkinteger(L, 6);
  let updateInterval = luaL_checkinteger(L, 7);
  console.warn('TerrainDeformRandom was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native TerrainDeformStop takes terraindeformation deformation, integer duration returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TerrainDeformStop(L) {
  let deformation = lua_touserdata(L, 1);
  let duration = luaL_checkinteger(L, 2);
  console.warn('TerrainDeformStop was called but is not implemented :(');
  return 0
}

/**
 * native TerrainDeformStopAll takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function TerrainDeformStopAll(L) {

  console.warn('TerrainDeformStopAll was called but is not implemented :(');
  return 0
}

/**
 * native AddSpecialEffect takes string modelName, real x, real y returns effect
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AddSpecialEffect(L) {
  let modelName = luaL_checkstring(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  console.warn('AddSpecialEffect was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native AddSpecialEffectLoc takes string modelName, location where returns effect
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AddSpecialEffectLoc(L) {
  let modelName = luaL_checkstring(L, 1);
  let where = lua_touserdata(L, 2);
  console.warn('AddSpecialEffectLoc was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native AddSpecialEffectTarget takes string modelName, widget targetWidget, string attachPointName returns effect
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AddSpecialEffectTarget(L) {
  let modelName = luaL_checkstring(L, 1);
  let targetWidget = lua_touserdata(L, 2);
  let attachPointName = luaL_checkstring(L, 3);
  console.warn('AddSpecialEffectTarget was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native DestroyEffect takes effect whichEffect returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DestroyEffect(L) {
  let whichEffect = lua_touserdata(L, 1);
  console.warn('DestroyEffect was called but is not implemented :(');
  return 0
}

/**
 * native AddSpellEffect takes string abilityString, effecttype t, real x, real y returns effect
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AddSpellEffect(L) {
  let abilityString = luaL_checkstring(L, 1);
  let t = lua_touserdata(L, 2);
  let x = luaL_checknumber(L, 3);
  let y = luaL_checknumber(L, 4);
  console.warn('AddSpellEffect was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native AddSpellEffectLoc takes string abilityString, effecttype t, location where returns effect
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AddSpellEffectLoc(L) {
  let abilityString = luaL_checkstring(L, 1);
  let t = lua_touserdata(L, 2);
  let where = lua_touserdata(L, 3);
  console.warn('AddSpellEffectLoc was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native AddSpellEffectById takes integer abilityId, effecttype t, real x, real y returns effect
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AddSpellEffectById(L) {
  let abilityId = luaL_checkinteger(L, 1);
  let t = lua_touserdata(L, 2);
  let x = luaL_checknumber(L, 3);
  let y = luaL_checknumber(L, 4);
  console.warn('AddSpellEffectById was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native AddSpellEffectByIdLoc takes integer abilityId, effecttype t, location where returns effect
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AddSpellEffectByIdLoc(L) {
  let abilityId = luaL_checkinteger(L, 1);
  let t = lua_touserdata(L, 2);
  let where = lua_touserdata(L, 3);
  console.warn('AddSpellEffectByIdLoc was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native AddSpellEffectTarget takes string modelName, effecttype t, widget targetWidget, string attachPoint returns effect
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AddSpellEffectTarget(L) {
  let modelName = luaL_checkstring(L, 1);
  let t = lua_touserdata(L, 2);
  let targetWidget = lua_touserdata(L, 3);
  let attachPoint = luaL_checkstring(L, 4);
  console.warn('AddSpellEffectTarget was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native AddSpellEffectTargetById takes integer abilityId, effecttype t, widget targetWidget, string attachPoint returns effect
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AddSpellEffectTargetById(L) {
  let abilityId = luaL_checkinteger(L, 1);
  let t = lua_touserdata(L, 2);
  let targetWidget = lua_touserdata(L, 3);
  let attachPoint = luaL_checkstring(L, 4);
  console.warn('AddSpellEffectTargetById was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native AddLightning takes string codeName, boolean checkVisibility, real x1, real y1, real x2, real y2 returns lightning
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AddLightning(L) {
  let codeName = luaL_checkstring(L, 1);
  let checkVisibility = lua_toboolean(L, 2);
  let x1 = luaL_checknumber(L, 3);
  let y1 = luaL_checknumber(L, 4);
  let x2 = luaL_checknumber(L, 5);
  let y2 = luaL_checknumber(L, 6);
  console.warn('AddLightning was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native AddLightningEx takes string codeName, boolean checkVisibility, real x1, real y1, real z1, real x2, real y2, real z2 returns lightning
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AddLightningEx(L) {
  let codeName = luaL_checkstring(L, 1);
  let checkVisibility = lua_toboolean(L, 2);
  let x1 = luaL_checknumber(L, 3);
  let y1 = luaL_checknumber(L, 4);
  let z1 = luaL_checknumber(L, 5);
  let x2 = luaL_checknumber(L, 6);
  let y2 = luaL_checknumber(L, 7);
  let z2 = luaL_checknumber(L, 8);
  console.warn('AddLightningEx was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native DestroyLightning takes lightning whichBolt returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DestroyLightning(L) {
  let whichBolt = lua_touserdata(L, 1);
  console.warn('DestroyLightning was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native MoveLightning takes lightning whichBolt, boolean checkVisibility, real x1, real y1, real x2, real y2 returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MoveLightning(L) {
  let whichBolt = lua_touserdata(L, 1);
  let checkVisibility = lua_toboolean(L, 2);
  let x1 = luaL_checknumber(L, 3);
  let y1 = luaL_checknumber(L, 4);
  let x2 = luaL_checknumber(L, 5);
  let y2 = luaL_checknumber(L, 6);
  console.warn('MoveLightning was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native MoveLightningEx takes lightning whichBolt, boolean checkVisibility, real x1, real y1, real z1, real x2, real y2, real z2 returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function MoveLightningEx(L) {
  let whichBolt = lua_touserdata(L, 1);
  let checkVisibility = lua_toboolean(L, 2);
  let x1 = luaL_checknumber(L, 3);
  let y1 = luaL_checknumber(L, 4);
  let z1 = luaL_checknumber(L, 5);
  let x2 = luaL_checknumber(L, 6);
  let y2 = luaL_checknumber(L, 7);
  let z2 = luaL_checknumber(L, 8);
  console.warn('MoveLightningEx was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native GetLightningColorA takes lightning whichBolt returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetLightningColorA(L) {
  let whichBolt = lua_touserdata(L, 1);
  console.warn('GetLightningColorA was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native GetLightningColorR takes lightning whichBolt returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetLightningColorR(L) {
  let whichBolt = lua_touserdata(L, 1);
  console.warn('GetLightningColorR was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native GetLightningColorG takes lightning whichBolt returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetLightningColorG(L) {
  let whichBolt = lua_touserdata(L, 1);
  console.warn('GetLightningColorG was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native GetLightningColorB takes lightning whichBolt returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetLightningColorB(L) {
  let whichBolt = lua_touserdata(L, 1);
  console.warn('GetLightningColorB was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native SetLightningColor takes lightning whichBolt, real r, real g, real b, real a returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetLightningColor(L) {
  let whichBolt = lua_touserdata(L, 1);
  let r = luaL_checknumber(L, 2);
  let g = luaL_checknumber(L, 3);
  let b = luaL_checknumber(L, 4);
  let a = luaL_checknumber(L, 5);
  console.warn('SetLightningColor was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native GetAbilityEffect takes string abilityString, effecttype t, integer index returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetAbilityEffect(L) {
  let abilityString = luaL_checkstring(L, 1);
  let t = lua_touserdata(L, 2);
  let index = luaL_checkinteger(L, 3);
  console.warn('GetAbilityEffect was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native GetAbilityEffectById takes integer abilityId, effecttype t, integer index returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetAbilityEffectById(L) {
  let abilityId = luaL_checkinteger(L, 1);
  let t = lua_touserdata(L, 2);
  let index = luaL_checkinteger(L, 3);
  console.warn('GetAbilityEffectById was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native GetAbilitySound takes string abilityString, soundtype t returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetAbilitySound(L) {
  let abilityString = luaL_checkstring(L, 1);
  let t = lua_touserdata(L, 2);
  console.warn('GetAbilitySound was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native GetAbilitySoundById takes integer abilityId, soundtype t returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetAbilitySoundById(L) {
  let abilityId = luaL_checkinteger(L, 1);
  let t = lua_touserdata(L, 2);
  console.warn('GetAbilitySoundById was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native GetTerrainCliffLevel takes real x, real y returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetTerrainCliffLevel(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  console.warn('GetTerrainCliffLevel was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native SetWaterBaseColor takes integer red, integer green, integer blue, integer alpha returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetWaterBaseColor(L) {
  let red = luaL_checkinteger(L, 1);
  let green = luaL_checkinteger(L, 2);
  let blue = luaL_checkinteger(L, 3);
  let alpha = luaL_checkinteger(L, 4);
  console.warn('SetWaterBaseColor was called but is not implemented :(');
  return 0
}

/**
 * native SetWaterDeforms takes boolean val returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetWaterDeforms(L) {
  let val = lua_toboolean(L, 1);
  console.warn('SetWaterDeforms was called but is not implemented :(');
  return 0
}

/**
 * native GetTerrainType takes real x, real y returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetTerrainType(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  console.warn('GetTerrainType was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native GetTerrainVariance takes real x, real y returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetTerrainVariance(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  console.warn('GetTerrainVariance was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native SetTerrainType takes real x, real y, integer terrainType, integer variation, integer area, integer shape returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetTerrainType(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  let terrainType = luaL_checkinteger(L, 3);
  let variation = luaL_checkinteger(L, 4);
  let area = luaL_checkinteger(L, 5);
  let shape = luaL_checkinteger(L, 6);
  console.warn('SetTerrainType was called but is not implemented :(');
  return 0
}

/**
 * native IsTerrainPathable takes real x, real y, pathingtype t returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsTerrainPathable(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  let t = lua_touserdata(L, 3);
  console.warn('IsTerrainPathable was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SetTerrainPathable takes real x, real y, pathingtype t, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetTerrainPathable(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  let t = lua_touserdata(L, 3);
  let flag = lua_toboolean(L, 4);
  console.warn('SetTerrainPathable was called but is not implemented :(');
  return 0
}

/**
 * native CreateImage takes string file, real sizeX, real sizeY, real sizeZ, real posX, real posY, real posZ, real originX, real originY, real originZ, integer imageType returns image
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateImage(L) {
  let file = luaL_checkstring(L, 1);
  let sizeX = luaL_checknumber(L, 2);
  let sizeY = luaL_checknumber(L, 3);
  let sizeZ = luaL_checknumber(L, 4);
  let posX = luaL_checknumber(L, 5);
  let posY = luaL_checknumber(L, 6);
  let posZ = luaL_checknumber(L, 7);
  let originX = luaL_checknumber(L, 8);
  let originY = luaL_checknumber(L, 9);
  let originZ = luaL_checknumber(L, 10);
  let imageType = luaL_checkinteger(L, 11);
  console.warn('CreateImage was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native DestroyImage takes image whichImage returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DestroyImage(L) {
  let whichImage = lua_touserdata(L, 1);
  console.warn('DestroyImage was called but is not implemented :(');
  return 0
}

/**
 * native ShowImage takes image whichImage, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ShowImage(L) {
  let whichImage = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('ShowImage was called but is not implemented :(');
  return 0
}

/**
 * native SetImageConstantHeight takes image whichImage, boolean flag, real height returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetImageConstantHeight(L) {
  let whichImage = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  let height = luaL_checknumber(L, 3);
  console.warn('SetImageConstantHeight was called but is not implemented :(');
  return 0
}

/**
 * native SetImagePosition takes image whichImage, real x, real y, real z returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetImagePosition(L) {
  let whichImage = lua_touserdata(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  let z = luaL_checknumber(L, 4);
  console.warn('SetImagePosition was called but is not implemented :(');
  return 0
}

/**
 * native SetImageColor takes image whichImage, integer red, integer green, integer blue, integer alpha returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetImageColor(L) {
  let whichImage = lua_touserdata(L, 1);
  let red = luaL_checkinteger(L, 2);
  let green = luaL_checkinteger(L, 3);
  let blue = luaL_checkinteger(L, 4);
  let alpha = luaL_checkinteger(L, 5);
  console.warn('SetImageColor was called but is not implemented :(');
  return 0
}

/**
 * native SetImageRender takes image whichImage, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetImageRender(L) {
  let whichImage = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('SetImageRender was called but is not implemented :(');
  return 0
}

/**
 * native SetImageRenderAlways takes image whichImage, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetImageRenderAlways(L) {
  let whichImage = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('SetImageRenderAlways was called but is not implemented :(');
  return 0
}

/**
 * native SetImageAboveWater takes image whichImage, boolean flag, boolean useWaterAlpha returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetImageAboveWater(L) {
  let whichImage = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  let useWaterAlpha = lua_toboolean(L, 3);
  console.warn('SetImageAboveWater was called but is not implemented :(');
  return 0
}

/**
 * native SetImageType takes image whichImage, integer imageType returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetImageType(L) {
  let whichImage = lua_touserdata(L, 1);
  let imageType = luaL_checkinteger(L, 2);
  console.warn('SetImageType was called but is not implemented :(');
  return 0
}

/**
 * native CreateUbersplat takes real x, real y, string name, integer red, integer green, integer blue, integer alpha, boolean forcePaused, boolean noBirthTime returns ubersplat
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateUbersplat(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  let name = luaL_checkstring(L, 3);
  let red = luaL_checkinteger(L, 4);
  let green = luaL_checkinteger(L, 5);
  let blue = luaL_checkinteger(L, 6);
  let alpha = luaL_checkinteger(L, 7);
  let forcePaused = lua_toboolean(L, 8);
  let noBirthTime = lua_toboolean(L, 9);
  console.warn('CreateUbersplat was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native DestroyUbersplat takes ubersplat whichSplat returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function DestroyUbersplat(L) {
  let whichSplat = lua_touserdata(L, 1);
  console.warn('DestroyUbersplat was called but is not implemented :(');
  return 0
}

/**
 * native ResetUbersplat takes ubersplat whichSplat returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ResetUbersplat(L) {
  let whichSplat = lua_touserdata(L, 1);
  console.warn('ResetUbersplat was called but is not implemented :(');
  return 0
}

/**
 * native FinishUbersplat takes ubersplat whichSplat returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function FinishUbersplat(L) {
  let whichSplat = lua_touserdata(L, 1);
  console.warn('FinishUbersplat was called but is not implemented :(');
  return 0
}

/**
 * native ShowUbersplat takes ubersplat whichSplat, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function ShowUbersplat(L) {
  let whichSplat = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('ShowUbersplat was called but is not implemented :(');
  return 0
}

/**
 * native SetUbersplatRender takes ubersplat whichSplat, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUbersplatRender(L) {
  let whichSplat = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('SetUbersplatRender was called but is not implemented :(');
  return 0
}

/**
 * native SetUbersplatRenderAlways takes ubersplat whichSplat, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetUbersplatRenderAlways(L) {
  let whichSplat = lua_touserdata(L, 1);
  let flag = lua_toboolean(L, 2);
  console.warn('SetUbersplatRenderAlways was called but is not implemented :(');
  return 0
}

/**
 * native SetBlight takes player whichPlayer, real x, real y, real radius, boolean addBlight returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetBlight(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  let radius = luaL_checknumber(L, 4);
  let addBlight = lua_toboolean(L, 5);
  console.warn('SetBlight was called but is not implemented :(');
  return 0
}

/**
 * native SetBlightRect takes player whichPlayer, rect r, boolean addBlight returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetBlightRect(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let r = lua_touserdata(L, 2);
  let addBlight = lua_toboolean(L, 3);
  console.warn('SetBlightRect was called but is not implemented :(');
  return 0
}

/**
 * native SetBlightPoint takes player whichPlayer, real x, real y, boolean addBlight returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetBlightPoint(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  let addBlight = lua_toboolean(L, 4);
  console.warn('SetBlightPoint was called but is not implemented :(');
  return 0
}

/**
 * native SetBlightLoc takes player whichPlayer, location whichLocation, real radius, boolean addBlight returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetBlightLoc(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let whichLocation = lua_touserdata(L, 2);
  let radius = luaL_checknumber(L, 3);
  let addBlight = lua_toboolean(L, 4);
  console.warn('SetBlightLoc was called but is not implemented :(');
  return 0
}

/**
 * native CreateBlightedGoldmine takes player id, real x, real y, real face returns unit
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CreateBlightedGoldmine(L) {
  let id = lua_touserdata(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  let face = luaL_checknumber(L, 4);
  console.warn('CreateBlightedGoldmine was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native IsPointBlighted takes real x, real y returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsPointBlighted(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  console.warn('IsPointBlighted was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native SetDoodadAnimation takes real x, real y, real radius, integer doodadID, boolean nearestOnly, string animName, boolean animRandom returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetDoodadAnimation(L) {
  let x = luaL_checknumber(L, 1);
  let y = luaL_checknumber(L, 2);
  let radius = luaL_checknumber(L, 3);
  let doodadID = luaL_checkinteger(L, 4);
  let nearestOnly = lua_toboolean(L, 5);
  let animName = luaL_checkstring(L, 6);
  let animRandom = lua_toboolean(L, 7);
  console.warn('SetDoodadAnimation was called but is not implemented :(');
  return 0
}

/**
 * native SetDoodadAnimationRect takes rect r, integer doodadID, string animName, boolean animRandom returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function SetDoodadAnimationRect(L) {
  let r = lua_touserdata(L, 1);
  let doodadID = luaL_checkinteger(L, 2);
  let animName = luaL_checkstring(L, 3);
  let animRandom = lua_toboolean(L, 4);
  console.warn('SetDoodadAnimationRect was called but is not implemented :(');
  return 0
}

/**
 * native StartMeleeAI takes player num, string script returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function StartMeleeAI(L) {
  let num = lua_touserdata(L, 1);
  let script = luaL_checkstring(L, 2);
  console.warn('StartMeleeAI was called but is not implemented :(');
  return 0
}

/**
 * native StartCampaignAI takes player num, string script returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function StartCampaignAI(L) {
  let num = lua_touserdata(L, 1);
  let script = luaL_checkstring(L, 2);
  console.warn('StartCampaignAI was called but is not implemented :(');
  return 0
}

/**
 * native CommandAI takes player num, integer command, integer data returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function CommandAI(L) {
  let num = lua_touserdata(L, 1);
  let command = luaL_checkinteger(L, 2);
  let data = luaL_checkinteger(L, 3);
  console.warn('CommandAI was called but is not implemented :(');
  return 0
}

/**
 * native PauseCompAI takes player p, boolean pause returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PauseCompAI(L) {
  let p = lua_touserdata(L, 1);
  let pause = lua_toboolean(L, 2);
  console.warn('PauseCompAI was called but is not implemented :(');
  return 0
}

/**
 * native GetAIDifficulty takes player num returns aidifficulty
 * 
 * @param {lua_State} L
 * @return {number}
 */
function GetAIDifficulty(L) {
  let num = lua_touserdata(L, 1);
  console.warn('GetAIDifficulty was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native RemoveGuardPosition takes unit hUnit returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RemoveGuardPosition(L) {
  let hUnit = lua_touserdata(L, 1);
  console.warn('RemoveGuardPosition was called but is not implemented :(');
  return 0
}

/**
 * native RecycleGuardPosition takes unit hUnit returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RecycleGuardPosition(L) {
  let hUnit = lua_touserdata(L, 1);
  console.warn('RecycleGuardPosition was called but is not implemented :(');
  return 0
}

/**
 * native RemoveAllGuardPositions takes player num returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function RemoveAllGuardPositions(L) {
  let num = lua_touserdata(L, 1);
  console.warn('RemoveAllGuardPositions was called but is not implemented :(');
  return 0
}

/**
 * native Cheat takes string cheatStr returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function Cheat(L) {
  let cheatStr = luaL_checkstring(L, 1);
  console.warn('Cheat was called but is not implemented :(');
  return 0
}

/**
 * native IsNoVictoryCheat takes nothing returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsNoVictoryCheat(L) {

  console.warn('IsNoVictoryCheat was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native IsNoDefeatCheat takes nothing returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function IsNoDefeatCheat(L) {

  console.warn('IsNoDefeatCheat was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native Preload takes string filename returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function Preload(L) {
  let filename = luaL_checkstring(L, 1);
  console.warn('Preload was called but is not implemented :(');
  return 0
}

/**
 * native PreloadEnd takes real timeout returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PreloadEnd(L) {
  let timeout = luaL_checknumber(L, 1);
  console.warn('PreloadEnd was called but is not implemented :(');
  return 0
}

/**
 * native PreloadStart takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PreloadStart(L) {

  console.warn('PreloadStart was called but is not implemented :(');
  return 0
}

/**
 * native PreloadRefresh takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PreloadRefresh(L) {

  console.warn('PreloadRefresh was called but is not implemented :(');
  return 0
}

/**
 * native PreloadEndEx takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PreloadEndEx(L) {

  console.warn('PreloadEndEx was called but is not implemented :(');
  return 0
}

/**
 * native PreloadGenClear takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PreloadGenClear(L) {

  console.warn('PreloadGenClear was called but is not implemented :(');
  return 0
}

/**
 * native PreloadGenStart takes nothing returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PreloadGenStart(L) {

  console.warn('PreloadGenStart was called but is not implemented :(');
  return 0
}

/**
 * native PreloadGenEnd takes string filename returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function PreloadGenEnd(L) {
  let filename = luaL_checkstring(L, 1);
  console.warn('PreloadGenEnd was called but is not implemented :(');
  return 0
}

/**
 * native Preloader takes string filename returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function Preloader(L) {
  let filename = luaL_checkstring(L, 1);
  console.warn('Preloader was called but is not implemented :(');
  return 0
}

/**
 * native AutomationTestStart takes string testName returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AutomationTestStart(L) {
  let testName = luaL_checkstring(L, 1);
  console.warn('AutomationTestStart was called but is not implemented :(');
  return 0
}

/**
 * native AutomationTestEnd takes string testName returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function AutomationTestEnd(L) {
  let testName = luaL_checkstring(L, 1);
  console.warn('AutomationTestEnd was called but is not implemented :(');
  return 0
}

/**
 * native BlzGetTriggerPlayerMouseX takes nothing returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetTriggerPlayerMouseX(L) {

  console.warn('BlzGetTriggerPlayerMouseX was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native BlzGetTriggerPlayerMouseY takes nothing returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetTriggerPlayerMouseY(L) {

  console.warn('BlzGetTriggerPlayerMouseY was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native BlzGetTriggerPlayerMousePosition takes nothing returns location
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetTriggerPlayerMousePosition(L) {

  console.warn('BlzGetTriggerPlayerMousePosition was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native BlzGetTriggerPlayerMouseButton takes nothing returns mousebuttontype
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetTriggerPlayerMouseButton(L) {

  console.warn('BlzGetTriggerPlayerMouseButton was called but is not implemented :(');
  lua_pushlightuserdata(L, {name: 'FAKE'});
  return 1;
}

/**
 * native BlzSetAbilityTooltip takes integer abilCode, string tooltip, integer level returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetAbilityTooltip(L) {
  let abilCode = luaL_checkinteger(L, 1);
  let tooltip = luaL_checkstring(L, 2);
  let level = luaL_checkinteger(L, 3);
  console.warn('BlzSetAbilityTooltip was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetAbilityActivatedTooltip takes integer abilCode, string tooltip, integer level returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetAbilityActivatedTooltip(L) {
  let abilCode = luaL_checkinteger(L, 1);
  let tooltip = luaL_checkstring(L, 2);
  let level = luaL_checkinteger(L, 3);
  console.warn('BlzSetAbilityActivatedTooltip was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetAbilityExtendedTooltip takes integer abilCode, string ExtendedTooltip, integer level returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetAbilityExtendedTooltip(L) {
  let abilCode = luaL_checkinteger(L, 1);
  let ExtendedTooltip = luaL_checkstring(L, 2);
  let level = luaL_checkinteger(L, 3);
  console.warn('BlzSetAbilityExtendedTooltip was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetAbilityActivatedExtendedTooltip takes integer abilCode, string ExtendedTooltip, integer level returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetAbilityActivatedExtendedTooltip(L) {
  let abilCode = luaL_checkinteger(L, 1);
  let ExtendedTooltip = luaL_checkstring(L, 2);
  let level = luaL_checkinteger(L, 3);
  console.warn('BlzSetAbilityActivatedExtendedTooltip was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetAbilityResearchTooltip takes integer abilCode, string researchTooltip, integer level returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetAbilityResearchTooltip(L) {
  let abilCode = luaL_checkinteger(L, 1);
  let researchTooltip = luaL_checkstring(L, 2);
  let level = luaL_checkinteger(L, 3);
  console.warn('BlzSetAbilityResearchTooltip was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetAbilityResearchExtendedTooltip takes integer abilCode, string researchExtendedTooltip, integer level returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetAbilityResearchExtendedTooltip(L) {
  let abilCode = luaL_checkinteger(L, 1);
  let researchExtendedTooltip = luaL_checkstring(L, 2);
  let level = luaL_checkinteger(L, 3);
  console.warn('BlzSetAbilityResearchExtendedTooltip was called but is not implemented :(');
  return 0
}

/**
 * native BlzGetAbilityTooltip takes integer abilCode, integer level returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetAbilityTooltip(L) {
  let abilCode = luaL_checkinteger(L, 1);
  let level = luaL_checkinteger(L, 2);
  console.warn('BlzGetAbilityTooltip was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native BlzGetAbilityActivatedTooltip takes integer abilCode, integer level returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetAbilityActivatedTooltip(L) {
  let abilCode = luaL_checkinteger(L, 1);
  let level = luaL_checkinteger(L, 2);
  console.warn('BlzGetAbilityActivatedTooltip was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native BlzGetAbilityExtendedTooltip takes integer abilCode, integer level returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetAbilityExtendedTooltip(L) {
  let abilCode = luaL_checkinteger(L, 1);
  let level = luaL_checkinteger(L, 2);
  console.warn('BlzGetAbilityExtendedTooltip was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native BlzGetAbilityActivatedExtendedTooltip takes integer abilCode, integer level returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetAbilityActivatedExtendedTooltip(L) {
  let abilCode = luaL_checkinteger(L, 1);
  let level = luaL_checkinteger(L, 2);
  console.warn('BlzGetAbilityActivatedExtendedTooltip was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native BlzGetAbilityResearchTooltip takes integer abilCode, integer level returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetAbilityResearchTooltip(L) {
  let abilCode = luaL_checkinteger(L, 1);
  let level = luaL_checkinteger(L, 2);
  console.warn('BlzGetAbilityResearchTooltip was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native BlzGetAbilityResearchExtendedTooltip takes integer abilCode, integer level returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetAbilityResearchExtendedTooltip(L) {
  let abilCode = luaL_checkinteger(L, 1);
  let level = luaL_checkinteger(L, 2);
  console.warn('BlzGetAbilityResearchExtendedTooltip was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native BlzSetAbilityIcon takes integer abilCode, string iconPath returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetAbilityIcon(L) {
  let abilCode = luaL_checkinteger(L, 1);
  let iconPath = luaL_checkstring(L, 2);
  console.warn('BlzSetAbilityIcon was called but is not implemented :(');
  return 0
}

/**
 * native BlzGetAbilityIcon takes integer abilCode returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetAbilityIcon(L) {
  let abilCode = luaL_checkinteger(L, 1);
  console.warn('BlzGetAbilityIcon was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native BlzSetAbilityActivatedIcon takes integer abilCode, string iconPath returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetAbilityActivatedIcon(L) {
  let abilCode = luaL_checkinteger(L, 1);
  let iconPath = luaL_checkstring(L, 2);
  console.warn('BlzSetAbilityActivatedIcon was called but is not implemented :(');
  return 0
}

/**
 * native BlzGetAbilityActivatedIcon takes integer abilCode returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetAbilityActivatedIcon(L) {
  let abilCode = luaL_checkinteger(L, 1);
  console.warn('BlzGetAbilityActivatedIcon was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native BlzGetAbilityPosX takes integer abilCode returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetAbilityPosX(L) {
  let abilCode = luaL_checkinteger(L, 1);
  console.warn('BlzGetAbilityPosX was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native BlzGetAbilityPosY takes integer abilCode returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetAbilityPosY(L) {
  let abilCode = luaL_checkinteger(L, 1);
  console.warn('BlzGetAbilityPosY was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native BlzSetAbilityPosX takes integer abilCode, integer x returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetAbilityPosX(L) {
  let abilCode = luaL_checkinteger(L, 1);
  let x = luaL_checkinteger(L, 2);
  console.warn('BlzSetAbilityPosX was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetAbilityPosY takes integer abilCode, integer y returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetAbilityPosY(L) {
  let abilCode = luaL_checkinteger(L, 1);
  let y = luaL_checkinteger(L, 2);
  console.warn('BlzSetAbilityPosY was called but is not implemented :(');
  return 0
}

/**
 * native BlzGetAbilityActivatedPosX takes integer abilCode returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetAbilityActivatedPosX(L) {
  let abilCode = luaL_checkinteger(L, 1);
  console.warn('BlzGetAbilityActivatedPosX was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native BlzGetAbilityActivatedPosY takes integer abilCode returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetAbilityActivatedPosY(L) {
  let abilCode = luaL_checkinteger(L, 1);
  console.warn('BlzGetAbilityActivatedPosY was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native BlzSetAbilityActivatedPosX takes integer abilCode, integer x returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetAbilityActivatedPosX(L) {
  let abilCode = luaL_checkinteger(L, 1);
  let x = luaL_checkinteger(L, 2);
  console.warn('BlzSetAbilityActivatedPosX was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetAbilityActivatedPosY takes integer abilCode, integer y returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetAbilityActivatedPosY(L) {
  let abilCode = luaL_checkinteger(L, 1);
  let y = luaL_checkinteger(L, 2);
  console.warn('BlzSetAbilityActivatedPosY was called but is not implemented :(');
  return 0
}

/**
 * native BlzGetUnitMaxHP takes unit whichUnit returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetUnitMaxHP(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('BlzGetUnitMaxHP was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native BlzSetUnitMaxHP takes unit whichUnit, integer hp returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetUnitMaxHP(L) {
  let whichUnit = lua_touserdata(L, 1);
  let hp = luaL_checkinteger(L, 2);
  console.warn('BlzSetUnitMaxHP was called but is not implemented :(');
  return 0
}

/**
 * native BlzGetUnitMaxMana takes unit whichUnit returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetUnitMaxMana(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('BlzGetUnitMaxMana was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native BlzSetUnitMaxMana takes unit whichUnit, integer mana returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetUnitMaxMana(L) {
  let whichUnit = lua_touserdata(L, 1);
  let mana = luaL_checkinteger(L, 2);
  console.warn('BlzSetUnitMaxMana was called but is not implemented :(');
  return 0
}

/**
 * native BlzDeleteHeroAbility takes unit whichUnit, integer abilCode returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzDeleteHeroAbility(L) {
  let whichUnit = lua_touserdata(L, 1);
  let abilCode = luaL_checkinteger(L, 2);
  console.warn('BlzDeleteHeroAbility was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetItemName takes item whichItem, string name returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetItemName(L) {
  let whichItem = lua_touserdata(L, 1);
  let name = luaL_checkstring(L, 2);
  console.warn('BlzSetItemName was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetItemDescription takes item whichItem, string name returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetItemDescription(L) {
  let whichItem = lua_touserdata(L, 1);
  let name = luaL_checkstring(L, 2);
  console.warn('BlzSetItemDescription was called but is not implemented :(');
  return 0
}

/**
 * native BlzGetItemDescription takes item whichItem returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetItemDescription(L) {
  let whichItem = lua_touserdata(L, 1);
  console.warn('BlzGetItemDescription was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native BlzSetItemTooltip takes item whichItem, string name returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetItemTooltip(L) {
  let whichItem = lua_touserdata(L, 1);
  let name = luaL_checkstring(L, 2);
  console.warn('BlzSetItemTooltip was called but is not implemented :(');
  return 0
}

/**
 * native BlzGetItemTooltip takes item whichItem returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetItemTooltip(L) {
  let whichItem = lua_touserdata(L, 1);
  console.warn('BlzGetItemTooltip was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native BlzSetItemExtendedTooltip takes item whichItem, string name returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetItemExtendedTooltip(L) {
  let whichItem = lua_touserdata(L, 1);
  let name = luaL_checkstring(L, 2);
  console.warn('BlzSetItemExtendedTooltip was called but is not implemented :(');
  return 0
}

/**
 * native BlzGetItemExtendedTooltip takes item whichItem returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetItemExtendedTooltip(L) {
  let whichItem = lua_touserdata(L, 1);
  console.warn('BlzGetItemExtendedTooltip was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native BlzSetItemIconPath takes item whichItem, string name returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetItemIconPath(L) {
  let whichItem = lua_touserdata(L, 1);
  let name = luaL_checkstring(L, 2);
  console.warn('BlzSetItemIconPath was called but is not implemented :(');
  return 0
}

/**
 * native BlzGetItemIconPath takes item whichItem returns string
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetItemIconPath(L) {
  let whichItem = lua_touserdata(L, 1);
  console.warn('BlzGetItemIconPath was called but is not implemented :(');
  lua_pushstring(L, '');
  return 1;
}

/**
 * native BlzSetUnitName takes unit whichUnit, string name returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetUnitName(L) {
  let whichUnit = lua_touserdata(L, 1);
  let name = luaL_checkstring(L, 2);
  console.warn('BlzSetUnitName was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetHeroProperName takes unit whichUnit, string name returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetHeroProperName(L) {
  let whichUnit = lua_touserdata(L, 1);
  let name = luaL_checkstring(L, 2);
  console.warn('BlzSetHeroProperName was called but is not implemented :(');
  return 0
}

/**
 * native BlzGetUnitBaseDamage takes unit whichUnit, integer weaponIndex returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetUnitBaseDamage(L) {
  let whichUnit = lua_touserdata(L, 1);
  let weaponIndex = luaL_checkinteger(L, 2);
  console.warn('BlzGetUnitBaseDamage was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native BlzSetUnitBaseDamage takes unit whichUnit, integer baseDamage, integer weaponIndex returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetUnitBaseDamage(L) {
  let whichUnit = lua_touserdata(L, 1);
  let baseDamage = luaL_checkinteger(L, 2);
  let weaponIndex = luaL_checkinteger(L, 3);
  console.warn('BlzSetUnitBaseDamage was called but is not implemented :(');
  return 0
}

/**
 * native BlzGetUnitDiceNumber takes unit whichUnit, integer weaponIndex returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetUnitDiceNumber(L) {
  let whichUnit = lua_touserdata(L, 1);
  let weaponIndex = luaL_checkinteger(L, 2);
  console.warn('BlzGetUnitDiceNumber was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native BlzSetUnitDiceNumber takes unit whichUnit, integer diceNumber, integer weaponIndex returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetUnitDiceNumber(L) {
  let whichUnit = lua_touserdata(L, 1);
  let diceNumber = luaL_checkinteger(L, 2);
  let weaponIndex = luaL_checkinteger(L, 3);
  console.warn('BlzSetUnitDiceNumber was called but is not implemented :(');
  return 0
}

/**
 * native BlzGetUnitDiceSides takes unit whichUnit, integer weaponIndex returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetUnitDiceSides(L) {
  let whichUnit = lua_touserdata(L, 1);
  let weaponIndex = luaL_checkinteger(L, 2);
  console.warn('BlzGetUnitDiceSides was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native BlzSetUnitDiceSides takes unit whichUnit, integer diceSides, integer weaponIndex returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetUnitDiceSides(L) {
  let whichUnit = lua_touserdata(L, 1);
  let diceSides = luaL_checkinteger(L, 2);
  let weaponIndex = luaL_checkinteger(L, 3);
  console.warn('BlzSetUnitDiceSides was called but is not implemented :(');
  return 0
}

/**
 * native BlzGetUnitAttackCooldown takes unit whichUnit, integer weaponIndex returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetUnitAttackCooldown(L) {
  let whichUnit = lua_touserdata(L, 1);
  let weaponIndex = luaL_checkinteger(L, 2);
  console.warn('BlzGetUnitAttackCooldown was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native BlzSetUnitAttackCooldown takes unit whichUnit, real cooldown, integer weaponIndex returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetUnitAttackCooldown(L) {
  let whichUnit = lua_touserdata(L, 1);
  let cooldown = luaL_checknumber(L, 2);
  let weaponIndex = luaL_checkinteger(L, 3);
  console.warn('BlzSetUnitAttackCooldown was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetSpecialEffectColorByPlayer takes effect whichEffect, player whichPlayer returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetSpecialEffectColorByPlayer(L) {
  let whichEffect = lua_touserdata(L, 1);
  let whichPlayer = lua_touserdata(L, 2);
  console.warn('BlzSetSpecialEffectColorByPlayer was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetSpecialEffectColor takes effect whichEffect, integer r, integer g, integer b returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetSpecialEffectColor(L) {
  let whichEffect = lua_touserdata(L, 1);
  let r = luaL_checkinteger(L, 2);
  let g = luaL_checkinteger(L, 3);
  let b = luaL_checkinteger(L, 4);
  console.warn('BlzSetSpecialEffectColor was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetSpecialEffectAlpha takes effect whichEffect, integer alpha returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetSpecialEffectAlpha(L) {
  let whichEffect = lua_touserdata(L, 1);
  let alpha = luaL_checkinteger(L, 2);
  console.warn('BlzSetSpecialEffectAlpha was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetSpecialEffectScale takes effect whichEffect, real scale returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetSpecialEffectScale(L) {
  let whichEffect = lua_touserdata(L, 1);
  let scale = luaL_checknumber(L, 2);
  console.warn('BlzSetSpecialEffectScale was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetSpecialEffectPosition takes effect whichEffect, real x, real y, real z returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetSpecialEffectPosition(L) {
  let whichEffect = lua_touserdata(L, 1);
  let x = luaL_checknumber(L, 2);
  let y = luaL_checknumber(L, 3);
  let z = luaL_checknumber(L, 4);
  console.warn('BlzSetSpecialEffectPosition was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetSpecialEffectHeight takes effect whichEffect, real height returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetSpecialEffectHeight(L) {
  let whichEffect = lua_touserdata(L, 1);
  let height = luaL_checknumber(L, 2);
  console.warn('BlzSetSpecialEffectHeight was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetSpecialEffectTimeScale takes effect whichEffect, real timeScale returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetSpecialEffectTimeScale(L) {
  let whichEffect = lua_touserdata(L, 1);
  let timeScale = luaL_checknumber(L, 2);
  console.warn('BlzSetSpecialEffectTimeScale was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetSpecialEffectTime takes effect whichEffect, real time returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetSpecialEffectTime(L) {
  let whichEffect = lua_touserdata(L, 1);
  let time = luaL_checknumber(L, 2);
  console.warn('BlzSetSpecialEffectTime was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetSpecialEffectOrientation takes effect whichEffect, real yaw, real pitch, real roll returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetSpecialEffectOrientation(L) {
  let whichEffect = lua_touserdata(L, 1);
  let yaw = luaL_checknumber(L, 2);
  let pitch = luaL_checknumber(L, 3);
  let roll = luaL_checknumber(L, 4);
  console.warn('BlzSetSpecialEffectOrientation was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetSpecialEffectYaw takes effect whichEffect, real yaw returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetSpecialEffectYaw(L) {
  let whichEffect = lua_touserdata(L, 1);
  let yaw = luaL_checknumber(L, 2);
  console.warn('BlzSetSpecialEffectYaw was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetSpecialEffectPitch takes effect whichEffect, real pitch returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetSpecialEffectPitch(L) {
  let whichEffect = lua_touserdata(L, 1);
  let pitch = luaL_checknumber(L, 2);
  console.warn('BlzSetSpecialEffectPitch was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetSpecialEffectRoll takes effect whichEffect, real roll returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetSpecialEffectRoll(L) {
  let whichEffect = lua_touserdata(L, 1);
  let roll = luaL_checknumber(L, 2);
  console.warn('BlzSetSpecialEffectRoll was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetSpecialEffectX takes effect whichEffect, real x returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetSpecialEffectX(L) {
  let whichEffect = lua_touserdata(L, 1);
  let x = luaL_checknumber(L, 2);
  console.warn('BlzSetSpecialEffectX was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetSpecialEffectY takes effect whichEffect, real y returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetSpecialEffectY(L) {
  let whichEffect = lua_touserdata(L, 1);
  let y = luaL_checknumber(L, 2);
  console.warn('BlzSetSpecialEffectY was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetSpecialEffectZ takes effect whichEffect, real z returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetSpecialEffectZ(L) {
  let whichEffect = lua_touserdata(L, 1);
  let z = luaL_checknumber(L, 2);
  console.warn('BlzSetSpecialEffectZ was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetSpecialEffectPositionLoc takes effect whichEffect, location loc returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetSpecialEffectPositionLoc(L) {
  let whichEffect = lua_touserdata(L, 1);
  let loc = lua_touserdata(L, 2);
  console.warn('BlzSetSpecialEffectPositionLoc was called but is not implemented :(');
  return 0
}

/**
 * native BlzGetLocalSpecialEffectX takes effect whichEffect returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetLocalSpecialEffectX(L) {
  let whichEffect = lua_touserdata(L, 1);
  console.warn('BlzGetLocalSpecialEffectX was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native BlzGetLocalSpecialEffectY takes effect whichEffect returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetLocalSpecialEffectY(L) {
  let whichEffect = lua_touserdata(L, 1);
  console.warn('BlzGetLocalSpecialEffectY was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native BlzGetLocalSpecialEffectZ takes effect whichEffect returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetLocalSpecialEffectZ(L) {
  let whichEffect = lua_touserdata(L, 1);
  console.warn('BlzGetLocalSpecialEffectZ was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native BlzGetUnitArmor takes unit whichUnit returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetUnitArmor(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('BlzGetUnitArmor was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native BlzSetUnitArmor takes unit whichUnit, real armorAmount returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetUnitArmor(L) {
  let whichUnit = lua_touserdata(L, 1);
  let armorAmount = luaL_checknumber(L, 2);
  console.warn('BlzSetUnitArmor was called but is not implemented :(');
  return 0
}

/**
 * native BlzUnitHideAbility takes unit whichUnit, integer abilId, boolean flag returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzUnitHideAbility(L) {
  let whichUnit = lua_touserdata(L, 1);
  let abilId = luaL_checkinteger(L, 2);
  let flag = lua_toboolean(L, 3);
  console.warn('BlzUnitHideAbility was called but is not implemented :(');
  return 0
}

/**
 * native BlzUnitDisableAbility takes unit whichUnit, integer abilId, boolean flag, boolean hideUI returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzUnitDisableAbility(L) {
  let whichUnit = lua_touserdata(L, 1);
  let abilId = luaL_checkinteger(L, 2);
  let flag = lua_toboolean(L, 3);
  let hideUI = lua_toboolean(L, 4);
  console.warn('BlzUnitDisableAbility was called but is not implemented :(');
  return 0
}

/**
 * native BlzUnitCancelTimedLife takes unit whichUnit returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzUnitCancelTimedLife(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('BlzUnitCancelTimedLife was called but is not implemented :(');
  return 0
}

/**
 * native BlzIsUnitSelectable takes unit whichUnit returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzIsUnitSelectable(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('BlzIsUnitSelectable was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native BlzIsUnitInvulnerable takes unit whichUnit returns boolean
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzIsUnitInvulnerable(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('BlzIsUnitInvulnerable was called but is not implemented :(');
  lua_pushboolean(L, false);
  return 1;
}

/**
 * native BlzUnitInterruptAttack takes unit whichUnit returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzUnitInterruptAttack(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('BlzUnitInterruptAttack was called but is not implemented :(');
  return 0
}

/**
 * native BlzGetUnitCollisionSize takes unit whichUnit returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetUnitCollisionSize(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('BlzGetUnitCollisionSize was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native BlzGetAbilityManaCost takes integer abilId, integer level returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetAbilityManaCost(L) {
  let abilId = luaL_checkinteger(L, 1);
  let level = luaL_checkinteger(L, 2);
  console.warn('BlzGetAbilityManaCost was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native BlzGetAbilityCooldown takes integer abilId, integer level returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetAbilityCooldown(L) {
  let abilId = luaL_checkinteger(L, 1);
  let level = luaL_checkinteger(L, 2);
  console.warn('BlzGetAbilityCooldown was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native BlzSetUnitAbilityCooldown takes unit whichUnit, integer abilId, integer level, real cooldown returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetUnitAbilityCooldown(L) {
  let whichUnit = lua_touserdata(L, 1);
  let abilId = luaL_checkinteger(L, 2);
  let level = luaL_checkinteger(L, 3);
  let cooldown = luaL_checknumber(L, 4);
  console.warn('BlzSetUnitAbilityCooldown was called but is not implemented :(');
  return 0
}

/**
 * native BlzGetUnitAbilityCooldown takes unit whichUnit, integer abilId, integer level returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetUnitAbilityCooldown(L) {
  let whichUnit = lua_touserdata(L, 1);
  let abilId = luaL_checkinteger(L, 2);
  let level = luaL_checkinteger(L, 3);
  console.warn('BlzGetUnitAbilityCooldown was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native BlzGetUnitAbilityCooldownRemaining takes unit whichUnit, integer abilId returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetUnitAbilityCooldownRemaining(L) {
  let whichUnit = lua_touserdata(L, 1);
  let abilId = luaL_checkinteger(L, 2);
  console.warn('BlzGetUnitAbilityCooldownRemaining was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native BlzEndUnitAbilityCooldown takes unit whichUnit, integer abilCode returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzEndUnitAbilityCooldown(L) {
  let whichUnit = lua_touserdata(L, 1);
  let abilCode = luaL_checkinteger(L, 2);
  console.warn('BlzEndUnitAbilityCooldown was called but is not implemented :(');
  return 0
}

/**
 * native BlzGetUnitAbilityManaCost takes unit whichUnit, integer abilId, integer level returns integer
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetUnitAbilityManaCost(L) {
  let whichUnit = lua_touserdata(L, 1);
  let abilId = luaL_checkinteger(L, 2);
  let level = luaL_checkinteger(L, 3);
  console.warn('BlzGetUnitAbilityManaCost was called but is not implemented :(');
  lua_pushinteger(L, 0);
  return 1;
}

/**
 * native BlzSetUnitAbilityManaCost takes unit whichUnit, integer abilId, integer level, integer manaCost returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetUnitAbilityManaCost(L) {
  let whichUnit = lua_touserdata(L, 1);
  let abilId = luaL_checkinteger(L, 2);
  let level = luaL_checkinteger(L, 3);
  let manaCost = luaL_checkinteger(L, 4);
  console.warn('BlzSetUnitAbilityManaCost was called but is not implemented :(');
  return 0
}

/**
 * native BlzGetLocalUnitZ takes unit whichUnit returns real
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzGetLocalUnitZ(L) {
  let whichUnit = lua_touserdata(L, 1);
  console.warn('BlzGetLocalUnitZ was called but is not implemented :(');
  lua_pushnumber(L, 0);
  return 1;
}

/**
 * native BlzDecPlayerTechResearched takes player whichPlayer, integer techid, integer levels returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzDecPlayerTechResearched(L) {
  let whichPlayer = lua_touserdata(L, 1);
  let techid = luaL_checkinteger(L, 2);
  let levels = luaL_checkinteger(L, 3);
  console.warn('BlzDecPlayerTechResearched was called but is not implemented :(');
  return 0
}

/**
 * native BlzSetEventDamage takes real damage returns nothing
 * 
 * @param {lua_State} L
 * @return {number}
 */
function BlzSetEventDamage(L) {
  let damage = luaL_checknumber(L, 1);
  console.warn('BlzSetEventDamage was called but is not implemented :(');
  return 0
}

/**
 * @param {LuaContext} C
 */
export default function bindNatives(C) {
  let L = C.L;

  lua_register(L, 'ConvertRace', ConvertRace.bind(C));
  lua_register(L, 'ConvertAllianceType', ConvertAllianceType.bind(C));
  lua_register(L, 'ConvertRacePref', ConvertRacePref.bind(C));
  lua_register(L, 'ConvertIGameState', ConvertIGameState.bind(C));
  lua_register(L, 'ConvertFGameState', ConvertFGameState.bind(C));
  lua_register(L, 'ConvertPlayerState', ConvertPlayerState.bind(C));
  lua_register(L, 'ConvertPlayerScore', ConvertPlayerScore.bind(C));
  lua_register(L, 'ConvertPlayerGameResult', ConvertPlayerGameResult.bind(C));
  lua_register(L, 'ConvertUnitState', ConvertUnitState.bind(C));
  lua_register(L, 'ConvertAIDifficulty', ConvertAIDifficulty.bind(C));
  lua_register(L, 'ConvertGameEvent', ConvertGameEvent.bind(C));
  lua_register(L, 'ConvertPlayerEvent', ConvertPlayerEvent.bind(C));
  lua_register(L, 'ConvertPlayerUnitEvent', ConvertPlayerUnitEvent.bind(C));
  lua_register(L, 'ConvertWidgetEvent', ConvertWidgetEvent.bind(C));
  lua_register(L, 'ConvertDialogEvent', ConvertDialogEvent.bind(C));
  lua_register(L, 'ConvertUnitEvent', ConvertUnitEvent.bind(C));
  lua_register(L, 'ConvertLimitOp', ConvertLimitOp.bind(C));
  lua_register(L, 'ConvertUnitType', ConvertUnitType.bind(C));
  lua_register(L, 'ConvertGameSpeed', ConvertGameSpeed.bind(C));
  lua_register(L, 'ConvertPlacement', ConvertPlacement.bind(C));
  lua_register(L, 'ConvertStartLocPrio', ConvertStartLocPrio.bind(C));
  lua_register(L, 'ConvertGameDifficulty', ConvertGameDifficulty.bind(C));
  lua_register(L, 'ConvertGameType', ConvertGameType.bind(C));
  lua_register(L, 'ConvertMapFlag', ConvertMapFlag.bind(C));
  lua_register(L, 'ConvertMapVisibility', ConvertMapVisibility.bind(C));
  lua_register(L, 'ConvertMapSetting', ConvertMapSetting.bind(C));
  lua_register(L, 'ConvertMapDensity', ConvertMapDensity.bind(C));
  lua_register(L, 'ConvertMapControl', ConvertMapControl.bind(C));
  lua_register(L, 'ConvertPlayerColor', ConvertPlayerColor.bind(C));
  lua_register(L, 'ConvertPlayerSlotState', ConvertPlayerSlotState.bind(C));
  lua_register(L, 'ConvertVolumeGroup', ConvertVolumeGroup.bind(C));
  lua_register(L, 'ConvertCameraField', ConvertCameraField.bind(C));
  lua_register(L, 'ConvertBlendMode', ConvertBlendMode.bind(C));
  lua_register(L, 'ConvertRarityControl', ConvertRarityControl.bind(C));
  lua_register(L, 'ConvertTexMapFlags', ConvertTexMapFlags.bind(C));
  lua_register(L, 'ConvertFogState', ConvertFogState.bind(C));
  lua_register(L, 'ConvertEffectType', ConvertEffectType.bind(C));
  lua_register(L, 'ConvertVersion', ConvertVersion.bind(C));
  lua_register(L, 'ConvertItemType', ConvertItemType.bind(C));
  lua_register(L, 'ConvertAttackType', ConvertAttackType.bind(C));
  lua_register(L, 'ConvertDamageType', ConvertDamageType.bind(C));
  lua_register(L, 'ConvertWeaponType', ConvertWeaponType.bind(C));
  lua_register(L, 'ConvertSoundType', ConvertSoundType.bind(C));
  lua_register(L, 'ConvertPathingType', ConvertPathingType.bind(C));
  lua_register(L, 'ConvertMouseButtonType', ConvertMouseButtonType.bind(C));
  lua_register(L, 'OrderId', OrderId.bind(C));
  lua_register(L, 'OrderId2String', OrderId2String.bind(C));
  lua_register(L, 'UnitId', UnitId.bind(C));
  lua_register(L, 'UnitId2String', UnitId2String.bind(C));
  lua_register(L, 'AbilityId', AbilityId.bind(C));
  lua_register(L, 'AbilityId2String', AbilityId2String.bind(C));
  lua_register(L, 'GetObjectName', GetObjectName.bind(C));
  lua_register(L, 'GetBJMaxPlayers', GetBJMaxPlayers.bind(C));
  lua_register(L, 'GetBJPlayerNeutralVictim', GetBJPlayerNeutralVictim.bind(C));
  lua_register(L, 'GetBJPlayerNeutralExtra', GetBJPlayerNeutralExtra.bind(C));
  lua_register(L, 'GetBJMaxPlayerSlots', GetBJMaxPlayerSlots.bind(C));
  lua_register(L, 'GetPlayerNeutralPassive', GetPlayerNeutralPassive.bind(C));
  lua_register(L, 'GetPlayerNeutralAggressive', GetPlayerNeutralAggressive.bind(C));
  lua_register(L, 'Deg2Rad', Deg2Rad.bind(C));
  lua_register(L, 'Rad2Deg', Rad2Deg.bind(C));
  lua_register(L, 'Sin', Sin.bind(C));
  lua_register(L, 'Cos', Cos.bind(C));
  lua_register(L, 'Tan', Tan.bind(C));
  lua_register(L, 'Asin', Asin.bind(C));
  lua_register(L, 'Acos', Acos.bind(C));
  lua_register(L, 'Atan', Atan.bind(C));
  lua_register(L, 'Atan2', Atan2.bind(C));
  lua_register(L, 'SquareRoot', SquareRoot.bind(C));
  lua_register(L, 'Pow', Pow.bind(C));
  lua_register(L, 'I2R', I2R.bind(C));
  lua_register(L, 'R2I', R2I.bind(C));
  lua_register(L, 'I2S', I2S.bind(C));
  lua_register(L, 'R2S', R2S.bind(C));
  lua_register(L, 'R2SW', R2SW.bind(C));
  lua_register(L, 'S2I', S2I.bind(C));
  lua_register(L, 'S2R', S2R.bind(C));
  lua_register(L, 'GetHandleId', GetHandleId.bind(C));
  lua_register(L, 'SubString', SubString.bind(C));
  lua_register(L, 'StringLength', StringLength.bind(C));
  lua_register(L, 'StringCase', StringCase.bind(C));
  lua_register(L, 'StringHash', StringHash.bind(C));
  lua_register(L, 'GetLocalizedString', GetLocalizedString.bind(C));
  lua_register(L, 'GetLocalizedHotkey', GetLocalizedHotkey.bind(C));
  lua_register(L, 'SetMapName', SetMapName.bind(C));
  lua_register(L, 'SetMapDescription', SetMapDescription.bind(C));
  lua_register(L, 'SetTeams', SetTeams.bind(C));
  lua_register(L, 'SetPlayers', SetPlayers.bind(C));
  lua_register(L, 'DefineStartLocation', DefineStartLocation.bind(C));
  lua_register(L, 'DefineStartLocationLoc', DefineStartLocationLoc.bind(C));
  lua_register(L, 'SetStartLocPrioCount', SetStartLocPrioCount.bind(C));
  lua_register(L, 'SetStartLocPrio', SetStartLocPrio.bind(C));
  lua_register(L, 'GetStartLocPrioSlot', GetStartLocPrioSlot.bind(C));
  lua_register(L, 'GetStartLocPrio', GetStartLocPrio.bind(C));
  lua_register(L, 'SetGameTypeSupported', SetGameTypeSupported.bind(C));
  lua_register(L, 'SetMapFlag', SetMapFlag.bind(C));
  lua_register(L, 'SetGamePlacement', SetGamePlacement.bind(C));
  lua_register(L, 'SetGameSpeed', SetGameSpeed.bind(C));
  lua_register(L, 'SetGameDifficulty', SetGameDifficulty.bind(C));
  lua_register(L, 'SetResourceDensity', SetResourceDensity.bind(C));
  lua_register(L, 'SetCreatureDensity', SetCreatureDensity.bind(C));
  lua_register(L, 'GetTeams', GetTeams.bind(C));
  lua_register(L, 'GetPlayers', GetPlayers.bind(C));
  lua_register(L, 'IsGameTypeSupported', IsGameTypeSupported.bind(C));
  lua_register(L, 'GetGameTypeSelected', GetGameTypeSelected.bind(C));
  lua_register(L, 'IsMapFlagSet', IsMapFlagSet.bind(C));
  lua_register(L, 'GetGamePlacement', GetGamePlacement.bind(C));
  lua_register(L, 'GetGameSpeed', GetGameSpeed.bind(C));
  lua_register(L, 'GetGameDifficulty', GetGameDifficulty.bind(C));
  lua_register(L, 'GetResourceDensity', GetResourceDensity.bind(C));
  lua_register(L, 'GetCreatureDensity', GetCreatureDensity.bind(C));
  lua_register(L, 'GetStartLocationX', GetStartLocationX.bind(C));
  lua_register(L, 'GetStartLocationY', GetStartLocationY.bind(C));
  lua_register(L, 'GetStartLocationLoc', GetStartLocationLoc.bind(C));
  lua_register(L, 'SetPlayerTeam', SetPlayerTeam.bind(C));
  lua_register(L, 'SetPlayerStartLocation', SetPlayerStartLocation.bind(C));
  lua_register(L, 'ForcePlayerStartLocation', ForcePlayerStartLocation.bind(C));
  lua_register(L, 'SetPlayerColor', SetPlayerColor.bind(C));
  lua_register(L, 'SetPlayerAlliance', SetPlayerAlliance.bind(C));
  lua_register(L, 'SetPlayerTaxRate', SetPlayerTaxRate.bind(C));
  lua_register(L, 'SetPlayerRacePreference', SetPlayerRacePreference.bind(C));
  lua_register(L, 'SetPlayerRaceSelectable', SetPlayerRaceSelectable.bind(C));
  lua_register(L, 'SetPlayerController', SetPlayerController.bind(C));
  lua_register(L, 'SetPlayerName', SetPlayerName.bind(C));
  lua_register(L, 'SetPlayerOnScoreScreen', SetPlayerOnScoreScreen.bind(C));
  lua_register(L, 'GetPlayerTeam', GetPlayerTeam.bind(C));
  lua_register(L, 'GetPlayerStartLocation', GetPlayerStartLocation.bind(C));
  lua_register(L, 'GetPlayerColor', GetPlayerColor.bind(C));
  lua_register(L, 'GetPlayerSelectable', GetPlayerSelectable.bind(C));
  lua_register(L, 'GetPlayerController', GetPlayerController.bind(C));
  lua_register(L, 'GetPlayerSlotState', GetPlayerSlotState.bind(C));
  lua_register(L, 'GetPlayerTaxRate', GetPlayerTaxRate.bind(C));
  lua_register(L, 'IsPlayerRacePrefSet', IsPlayerRacePrefSet.bind(C));
  lua_register(L, 'GetPlayerName', GetPlayerName.bind(C));
  lua_register(L, 'CreateTimer', CreateTimer.bind(C));
  lua_register(L, 'DestroyTimer', DestroyTimer.bind(C));
  lua_register(L, 'TimerStart', TimerStart.bind(C));
  lua_register(L, 'TimerGetElapsed', TimerGetElapsed.bind(C));
  lua_register(L, 'TimerGetRemaining', TimerGetRemaining.bind(C));
  lua_register(L, 'TimerGetTimeout', TimerGetTimeout.bind(C));
  lua_register(L, 'PauseTimer', PauseTimer.bind(C));
  lua_register(L, 'ResumeTimer', ResumeTimer.bind(C));
  lua_register(L, 'GetExpiredTimer', GetExpiredTimer.bind(C));
  lua_register(L, 'CreateGroup', CreateGroup.bind(C));
  lua_register(L, 'DestroyGroup', DestroyGroup.bind(C));
  lua_register(L, 'GroupAddUnit', GroupAddUnit.bind(C));
  lua_register(L, 'GroupRemoveUnit', GroupRemoveUnit.bind(C));
  lua_register(L, 'GroupClear', GroupClear.bind(C));
  lua_register(L, 'GroupEnumUnitsOfType', GroupEnumUnitsOfType.bind(C));
  lua_register(L, 'GroupEnumUnitsOfPlayer', GroupEnumUnitsOfPlayer.bind(C));
  lua_register(L, 'GroupEnumUnitsOfTypeCounted', GroupEnumUnitsOfTypeCounted.bind(C));
  lua_register(L, 'GroupEnumUnitsInRect', GroupEnumUnitsInRect.bind(C));
  lua_register(L, 'GroupEnumUnitsInRectCounted', GroupEnumUnitsInRectCounted.bind(C));
  lua_register(L, 'GroupEnumUnitsInRange', GroupEnumUnitsInRange.bind(C));
  lua_register(L, 'GroupEnumUnitsInRangeOfLoc', GroupEnumUnitsInRangeOfLoc.bind(C));
  lua_register(L, 'GroupEnumUnitsInRangeCounted', GroupEnumUnitsInRangeCounted.bind(C));
  lua_register(L, 'GroupEnumUnitsInRangeOfLocCounted', GroupEnumUnitsInRangeOfLocCounted.bind(C));
  lua_register(L, 'GroupEnumUnitsSelected', GroupEnumUnitsSelected.bind(C));
  lua_register(L, 'GroupImmediateOrder', GroupImmediateOrder.bind(C));
  lua_register(L, 'GroupImmediateOrderById', GroupImmediateOrderById.bind(C));
  lua_register(L, 'GroupPointOrder', GroupPointOrder.bind(C));
  lua_register(L, 'GroupPointOrderLoc', GroupPointOrderLoc.bind(C));
  lua_register(L, 'GroupPointOrderById', GroupPointOrderById.bind(C));
  lua_register(L, 'GroupPointOrderByIdLoc', GroupPointOrderByIdLoc.bind(C));
  lua_register(L, 'GroupTargetOrder', GroupTargetOrder.bind(C));
  lua_register(L, 'GroupTargetOrderById', GroupTargetOrderById.bind(C));
  lua_register(L, 'ForGroup', ForGroup.bind(C));
  lua_register(L, 'FirstOfGroup', FirstOfGroup.bind(C));
  lua_register(L, 'CreateForce', CreateForce.bind(C));
  lua_register(L, 'DestroyForce', DestroyForce.bind(C));
  lua_register(L, 'ForceAddPlayer', ForceAddPlayer.bind(C));
  lua_register(L, 'ForceRemovePlayer', ForceRemovePlayer.bind(C));
  lua_register(L, 'ForceClear', ForceClear.bind(C));
  lua_register(L, 'ForceEnumPlayers', ForceEnumPlayers.bind(C));
  lua_register(L, 'ForceEnumPlayersCounted', ForceEnumPlayersCounted.bind(C));
  lua_register(L, 'ForceEnumAllies', ForceEnumAllies.bind(C));
  lua_register(L, 'ForceEnumEnemies', ForceEnumEnemies.bind(C));
  lua_register(L, 'ForForce', ForForce.bind(C));
  lua_register(L, 'Rect', Rect.bind(C));
  lua_register(L, 'RectFromLoc', RectFromLoc.bind(C));
  lua_register(L, 'RemoveRect', RemoveRect.bind(C));
  lua_register(L, 'SetRect', SetRect.bind(C));
  lua_register(L, 'SetRectFromLoc', SetRectFromLoc.bind(C));
  lua_register(L, 'MoveRectTo', MoveRectTo.bind(C));
  lua_register(L, 'MoveRectToLoc', MoveRectToLoc.bind(C));
  lua_register(L, 'GetRectCenterX', GetRectCenterX.bind(C));
  lua_register(L, 'GetRectCenterY', GetRectCenterY.bind(C));
  lua_register(L, 'GetRectMinX', GetRectMinX.bind(C));
  lua_register(L, 'GetRectMinY', GetRectMinY.bind(C));
  lua_register(L, 'GetRectMaxX', GetRectMaxX.bind(C));
  lua_register(L, 'GetRectMaxY', GetRectMaxY.bind(C));
  lua_register(L, 'CreateRegion', CreateRegion.bind(C));
  lua_register(L, 'RemoveRegion', RemoveRegion.bind(C));
  lua_register(L, 'RegionAddRect', RegionAddRect.bind(C));
  lua_register(L, 'RegionClearRect', RegionClearRect.bind(C));
  lua_register(L, 'RegionAddCell', RegionAddCell.bind(C));
  lua_register(L, 'RegionAddCellAtLoc', RegionAddCellAtLoc.bind(C));
  lua_register(L, 'RegionClearCell', RegionClearCell.bind(C));
  lua_register(L, 'RegionClearCellAtLoc', RegionClearCellAtLoc.bind(C));
  lua_register(L, 'Location', Location.bind(C));
  lua_register(L, 'RemoveLocation', RemoveLocation.bind(C));
  lua_register(L, 'MoveLocation', MoveLocation.bind(C));
  lua_register(L, 'GetLocationX', GetLocationX.bind(C));
  lua_register(L, 'GetLocationY', GetLocationY.bind(C));
  lua_register(L, 'GetLocationZ', GetLocationZ.bind(C));
  lua_register(L, 'IsUnitInRegion', IsUnitInRegion.bind(C));
  lua_register(L, 'IsPointInRegion', IsPointInRegion.bind(C));
  lua_register(L, 'IsLocationInRegion', IsLocationInRegion.bind(C));
  lua_register(L, 'GetWorldBounds', GetWorldBounds.bind(C));
  lua_register(L, 'CreateTrigger', CreateTrigger.bind(C));
  lua_register(L, 'DestroyTrigger', DestroyTrigger.bind(C));
  lua_register(L, 'ResetTrigger', ResetTrigger.bind(C));
  lua_register(L, 'EnableTrigger', EnableTrigger.bind(C));
  lua_register(L, 'DisableTrigger', DisableTrigger.bind(C));
  lua_register(L, 'IsTriggerEnabled', IsTriggerEnabled.bind(C));
  lua_register(L, 'TriggerWaitOnSleeps', TriggerWaitOnSleeps.bind(C));
  lua_register(L, 'IsTriggerWaitOnSleeps', IsTriggerWaitOnSleeps.bind(C));
  lua_register(L, 'GetFilterUnit', GetFilterUnit.bind(C));
  lua_register(L, 'GetEnumUnit', GetEnumUnit.bind(C));
  lua_register(L, 'GetFilterDestructable', GetFilterDestructable.bind(C));
  lua_register(L, 'GetEnumDestructable', GetEnumDestructable.bind(C));
  lua_register(L, 'GetFilterItem', GetFilterItem.bind(C));
  lua_register(L, 'GetEnumItem', GetEnumItem.bind(C));
  lua_register(L, 'GetFilterPlayer', GetFilterPlayer.bind(C));
  lua_register(L, 'GetEnumPlayer', GetEnumPlayer.bind(C));
  lua_register(L, 'GetTriggeringTrigger', GetTriggeringTrigger.bind(C));
  lua_register(L, 'GetTriggerEventId', GetTriggerEventId.bind(C));
  lua_register(L, 'GetTriggerEvalCount', GetTriggerEvalCount.bind(C));
  lua_register(L, 'GetTriggerExecCount', GetTriggerExecCount.bind(C));
  lua_register(L, 'ExecuteFunc', ExecuteFunc.bind(C));
  lua_register(L, 'And', And.bind(C));
  lua_register(L, 'Or', Or.bind(C));
  lua_register(L, 'Not', Not.bind(C));
  lua_register(L, 'Condition', Condition.bind(C));
  lua_register(L, 'DestroyCondition', DestroyCondition.bind(C));
  lua_register(L, 'Filter', Filter.bind(C));
  lua_register(L, 'DestroyFilter', DestroyFilter.bind(C));
  lua_register(L, 'DestroyBoolExpr', DestroyBoolExpr.bind(C));
  lua_register(L, 'TriggerRegisterVariableEvent', TriggerRegisterVariableEvent.bind(C));
  lua_register(L, 'TriggerRegisterTimerEvent', TriggerRegisterTimerEvent.bind(C));
  lua_register(L, 'TriggerRegisterTimerExpireEvent', TriggerRegisterTimerExpireEvent.bind(C));
  lua_register(L, 'TriggerRegisterGameStateEvent', TriggerRegisterGameStateEvent.bind(C));
  lua_register(L, 'TriggerRegisterDialogEvent', TriggerRegisterDialogEvent.bind(C));
  lua_register(L, 'TriggerRegisterDialogButtonEvent', TriggerRegisterDialogButtonEvent.bind(C));
  lua_register(L, 'GetEventGameState', GetEventGameState.bind(C));
  lua_register(L, 'TriggerRegisterGameEvent', TriggerRegisterGameEvent.bind(C));
  lua_register(L, 'GetWinningPlayer', GetWinningPlayer.bind(C));
  lua_register(L, 'TriggerRegisterEnterRegion', TriggerRegisterEnterRegion.bind(C));
  lua_register(L, 'GetTriggeringRegion', GetTriggeringRegion.bind(C));
  lua_register(L, 'GetEnteringUnit', GetEnteringUnit.bind(C));
  lua_register(L, 'TriggerRegisterLeaveRegion', TriggerRegisterLeaveRegion.bind(C));
  lua_register(L, 'GetLeavingUnit', GetLeavingUnit.bind(C));
  lua_register(L, 'TriggerRegisterTrackableHitEvent', TriggerRegisterTrackableHitEvent.bind(C));
  lua_register(L, 'TriggerRegisterTrackableTrackEvent', TriggerRegisterTrackableTrackEvent.bind(C));
  lua_register(L, 'GetTriggeringTrackable', GetTriggeringTrackable.bind(C));
  lua_register(L, 'GetClickedButton', GetClickedButton.bind(C));
  lua_register(L, 'GetClickedDialog', GetClickedDialog.bind(C));
  lua_register(L, 'GetTournamentFinishSoonTimeRemaining', GetTournamentFinishSoonTimeRemaining.bind(C));
  lua_register(L, 'GetTournamentFinishNowRule', GetTournamentFinishNowRule.bind(C));
  lua_register(L, 'GetTournamentFinishNowPlayer', GetTournamentFinishNowPlayer.bind(C));
  lua_register(L, 'GetTournamentScore', GetTournamentScore.bind(C));
  lua_register(L, 'GetSaveBasicFilename', GetSaveBasicFilename.bind(C));
  lua_register(L, 'TriggerRegisterPlayerEvent', TriggerRegisterPlayerEvent.bind(C));
  lua_register(L, 'GetTriggerPlayer', GetTriggerPlayer.bind(C));
  lua_register(L, 'TriggerRegisterPlayerUnitEvent', TriggerRegisterPlayerUnitEvent.bind(C));
  lua_register(L, 'GetLevelingUnit', GetLevelingUnit.bind(C));
  lua_register(L, 'GetLearningUnit', GetLearningUnit.bind(C));
  lua_register(L, 'GetLearnedSkill', GetLearnedSkill.bind(C));
  lua_register(L, 'GetLearnedSkillLevel', GetLearnedSkillLevel.bind(C));
  lua_register(L, 'GetRevivableUnit', GetRevivableUnit.bind(C));
  lua_register(L, 'GetRevivingUnit', GetRevivingUnit.bind(C));
  lua_register(L, 'GetAttacker', GetAttacker.bind(C));
  lua_register(L, 'GetRescuer', GetRescuer.bind(C));
  lua_register(L, 'GetDyingUnit', GetDyingUnit.bind(C));
  lua_register(L, 'GetKillingUnit', GetKillingUnit.bind(C));
  lua_register(L, 'GetDecayingUnit', GetDecayingUnit.bind(C));
  lua_register(L, 'GetConstructingStructure', GetConstructingStructure.bind(C));
  lua_register(L, 'GetCancelledStructure', GetCancelledStructure.bind(C));
  lua_register(L, 'GetConstructedStructure', GetConstructedStructure.bind(C));
  lua_register(L, 'GetResearchingUnit', GetResearchingUnit.bind(C));
  lua_register(L, 'GetResearched', GetResearched.bind(C));
  lua_register(L, 'GetTrainedUnitType', GetTrainedUnitType.bind(C));
  lua_register(L, 'GetTrainedUnit', GetTrainedUnit.bind(C));
  lua_register(L, 'GetDetectedUnit', GetDetectedUnit.bind(C));
  lua_register(L, 'GetSummoningUnit', GetSummoningUnit.bind(C));
  lua_register(L, 'GetSummonedUnit', GetSummonedUnit.bind(C));
  lua_register(L, 'GetTransportUnit', GetTransportUnit.bind(C));
  lua_register(L, 'GetLoadedUnit', GetLoadedUnit.bind(C));
  lua_register(L, 'GetSellingUnit', GetSellingUnit.bind(C));
  lua_register(L, 'GetSoldUnit', GetSoldUnit.bind(C));
  lua_register(L, 'GetBuyingUnit', GetBuyingUnit.bind(C));
  lua_register(L, 'GetSoldItem', GetSoldItem.bind(C));
  lua_register(L, 'GetChangingUnit', GetChangingUnit.bind(C));
  lua_register(L, 'GetChangingUnitPrevOwner', GetChangingUnitPrevOwner.bind(C));
  lua_register(L, 'GetManipulatingUnit', GetManipulatingUnit.bind(C));
  lua_register(L, 'GetManipulatedItem', GetManipulatedItem.bind(C));
  lua_register(L, 'GetOrderedUnit', GetOrderedUnit.bind(C));
  lua_register(L, 'GetIssuedOrderId', GetIssuedOrderId.bind(C));
  lua_register(L, 'GetOrderPointX', GetOrderPointX.bind(C));
  lua_register(L, 'GetOrderPointY', GetOrderPointY.bind(C));
  lua_register(L, 'GetOrderPointLoc', GetOrderPointLoc.bind(C));
  lua_register(L, 'GetOrderTarget', GetOrderTarget.bind(C));
  lua_register(L, 'GetOrderTargetDestructable', GetOrderTargetDestructable.bind(C));
  lua_register(L, 'GetOrderTargetItem', GetOrderTargetItem.bind(C));
  lua_register(L, 'GetOrderTargetUnit', GetOrderTargetUnit.bind(C));
  lua_register(L, 'GetSpellAbilityUnit', GetSpellAbilityUnit.bind(C));
  lua_register(L, 'GetSpellAbilityId', GetSpellAbilityId.bind(C));
  lua_register(L, 'GetSpellAbility', GetSpellAbility.bind(C));
  lua_register(L, 'GetSpellTargetLoc', GetSpellTargetLoc.bind(C));
  lua_register(L, 'GetSpellTargetX', GetSpellTargetX.bind(C));
  lua_register(L, 'GetSpellTargetY', GetSpellTargetY.bind(C));
  lua_register(L, 'GetSpellTargetDestructable', GetSpellTargetDestructable.bind(C));
  lua_register(L, 'GetSpellTargetItem', GetSpellTargetItem.bind(C));
  lua_register(L, 'GetSpellTargetUnit', GetSpellTargetUnit.bind(C));
  lua_register(L, 'TriggerRegisterPlayerAllianceChange', TriggerRegisterPlayerAllianceChange.bind(C));
  lua_register(L, 'TriggerRegisterPlayerStateEvent', TriggerRegisterPlayerStateEvent.bind(C));
  lua_register(L, 'GetEventPlayerState', GetEventPlayerState.bind(C));
  lua_register(L, 'TriggerRegisterPlayerChatEvent', TriggerRegisterPlayerChatEvent.bind(C));
  lua_register(L, 'GetEventPlayerChatString', GetEventPlayerChatString.bind(C));
  lua_register(L, 'GetEventPlayerChatStringMatched', GetEventPlayerChatStringMatched.bind(C));
  lua_register(L, 'TriggerRegisterDeathEvent', TriggerRegisterDeathEvent.bind(C));
  lua_register(L, 'GetTriggerUnit', GetTriggerUnit.bind(C));
  lua_register(L, 'TriggerRegisterUnitStateEvent', TriggerRegisterUnitStateEvent.bind(C));
  lua_register(L, 'GetEventUnitState', GetEventUnitState.bind(C));
  lua_register(L, 'TriggerRegisterUnitEvent', TriggerRegisterUnitEvent.bind(C));
  lua_register(L, 'GetEventDamage', GetEventDamage.bind(C));
  lua_register(L, 'GetEventDamageSource', GetEventDamageSource.bind(C));
  lua_register(L, 'GetEventDetectingPlayer', GetEventDetectingPlayer.bind(C));
  lua_register(L, 'TriggerRegisterFilterUnitEvent', TriggerRegisterFilterUnitEvent.bind(C));
  lua_register(L, 'GetEventTargetUnit', GetEventTargetUnit.bind(C));
  lua_register(L, 'TriggerRegisterUnitInRange', TriggerRegisterUnitInRange.bind(C));
  lua_register(L, 'TriggerAddCondition', TriggerAddCondition.bind(C));
  lua_register(L, 'TriggerRemoveCondition', TriggerRemoveCondition.bind(C));
  lua_register(L, 'TriggerClearConditions', TriggerClearConditions.bind(C));
  lua_register(L, 'TriggerAddAction', TriggerAddAction.bind(C));
  lua_register(L, 'TriggerRemoveAction', TriggerRemoveAction.bind(C));
  lua_register(L, 'TriggerClearActions', TriggerClearActions.bind(C));
  lua_register(L, 'TriggerSleepAction', TriggerSleepAction.bind(C));
  lua_register(L, 'TriggerWaitForSound', TriggerWaitForSound.bind(C));
  lua_register(L, 'TriggerEvaluate', TriggerEvaluate.bind(C));
  lua_register(L, 'TriggerExecute', TriggerExecute.bind(C));
  lua_register(L, 'TriggerExecuteWait', TriggerExecuteWait.bind(C));
  lua_register(L, 'TriggerSyncStart', TriggerSyncStart.bind(C));
  lua_register(L, 'TriggerSyncReady', TriggerSyncReady.bind(C));
  lua_register(L, 'GetWidgetLife', GetWidgetLife.bind(C));
  lua_register(L, 'SetWidgetLife', SetWidgetLife.bind(C));
  lua_register(L, 'GetWidgetX', GetWidgetX.bind(C));
  lua_register(L, 'GetWidgetY', GetWidgetY.bind(C));
  lua_register(L, 'GetTriggerWidget', GetTriggerWidget.bind(C));
  lua_register(L, 'CreateDestructable', CreateDestructable.bind(C));
  lua_register(L, 'CreateDestructableZ', CreateDestructableZ.bind(C));
  lua_register(L, 'CreateDeadDestructable', CreateDeadDestructable.bind(C));
  lua_register(L, 'CreateDeadDestructableZ', CreateDeadDestructableZ.bind(C));
  lua_register(L, 'RemoveDestructable', RemoveDestructable.bind(C));
  lua_register(L, 'KillDestructable', KillDestructable.bind(C));
  lua_register(L, 'SetDestructableInvulnerable', SetDestructableInvulnerable.bind(C));
  lua_register(L, 'IsDestructableInvulnerable', IsDestructableInvulnerable.bind(C));
  lua_register(L, 'EnumDestructablesInRect', EnumDestructablesInRect.bind(C));
  lua_register(L, 'GetDestructableTypeId', GetDestructableTypeId.bind(C));
  lua_register(L, 'GetDestructableX', GetDestructableX.bind(C));
  lua_register(L, 'GetDestructableY', GetDestructableY.bind(C));
  lua_register(L, 'SetDestructableLife', SetDestructableLife.bind(C));
  lua_register(L, 'GetDestructableLife', GetDestructableLife.bind(C));
  lua_register(L, 'SetDestructableMaxLife', SetDestructableMaxLife.bind(C));
  lua_register(L, 'GetDestructableMaxLife', GetDestructableMaxLife.bind(C));
  lua_register(L, 'DestructableRestoreLife', DestructableRestoreLife.bind(C));
  lua_register(L, 'QueueDestructableAnimation', QueueDestructableAnimation.bind(C));
  lua_register(L, 'SetDestructableAnimation', SetDestructableAnimation.bind(C));
  lua_register(L, 'SetDestructableAnimationSpeed', SetDestructableAnimationSpeed.bind(C));
  lua_register(L, 'ShowDestructable', ShowDestructable.bind(C));
  lua_register(L, 'GetDestructableOccluderHeight', GetDestructableOccluderHeight.bind(C));
  lua_register(L, 'SetDestructableOccluderHeight', SetDestructableOccluderHeight.bind(C));
  lua_register(L, 'GetDestructableName', GetDestructableName.bind(C));
  lua_register(L, 'GetTriggerDestructable', GetTriggerDestructable.bind(C));
  lua_register(L, 'CreateItem', CreateItem.bind(C));
  lua_register(L, 'RemoveItem', RemoveItem.bind(C));
  lua_register(L, 'GetItemPlayer', GetItemPlayer.bind(C));
  lua_register(L, 'GetItemTypeId', GetItemTypeId.bind(C));
  lua_register(L, 'GetItemX', GetItemX.bind(C));
  lua_register(L, 'GetItemY', GetItemY.bind(C));
  lua_register(L, 'SetItemPosition', SetItemPosition.bind(C));
  lua_register(L, 'SetItemDropOnDeath', SetItemDropOnDeath.bind(C));
  lua_register(L, 'SetItemDroppable', SetItemDroppable.bind(C));
  lua_register(L, 'SetItemPawnable', SetItemPawnable.bind(C));
  lua_register(L, 'SetItemPlayer', SetItemPlayer.bind(C));
  lua_register(L, 'SetItemInvulnerable', SetItemInvulnerable.bind(C));
  lua_register(L, 'IsItemInvulnerable', IsItemInvulnerable.bind(C));
  lua_register(L, 'SetItemVisible', SetItemVisible.bind(C));
  lua_register(L, 'IsItemVisible', IsItemVisible.bind(C));
  lua_register(L, 'IsItemOwned', IsItemOwned.bind(C));
  lua_register(L, 'IsItemPowerup', IsItemPowerup.bind(C));
  lua_register(L, 'IsItemSellable', IsItemSellable.bind(C));
  lua_register(L, 'IsItemPawnable', IsItemPawnable.bind(C));
  lua_register(L, 'IsItemIdPowerup', IsItemIdPowerup.bind(C));
  lua_register(L, 'IsItemIdSellable', IsItemIdSellable.bind(C));
  lua_register(L, 'IsItemIdPawnable', IsItemIdPawnable.bind(C));
  lua_register(L, 'EnumItemsInRect', EnumItemsInRect.bind(C));
  lua_register(L, 'GetItemLevel', GetItemLevel.bind(C));
  lua_register(L, 'GetItemType', GetItemType.bind(C));
  lua_register(L, 'SetItemDropID', SetItemDropID.bind(C));
  lua_register(L, 'GetItemName', GetItemName.bind(C));
  lua_register(L, 'GetItemCharges', GetItemCharges.bind(C));
  lua_register(L, 'SetItemCharges', SetItemCharges.bind(C));
  lua_register(L, 'GetItemUserData', GetItemUserData.bind(C));
  lua_register(L, 'SetItemUserData', SetItemUserData.bind(C));
  lua_register(L, 'CreateUnit', CreateUnit.bind(C));
  lua_register(L, 'CreateUnitByName', CreateUnitByName.bind(C));
  lua_register(L, 'CreateUnitAtLoc', CreateUnitAtLoc.bind(C));
  lua_register(L, 'CreateUnitAtLocByName', CreateUnitAtLocByName.bind(C));
  lua_register(L, 'CreateCorpse', CreateCorpse.bind(C));
  lua_register(L, 'KillUnit', KillUnit.bind(C));
  lua_register(L, 'RemoveUnit', RemoveUnit.bind(C));
  lua_register(L, 'ShowUnit', ShowUnit.bind(C));
  lua_register(L, 'SetUnitState', SetUnitState.bind(C));
  lua_register(L, 'SetUnitX', SetUnitX.bind(C));
  lua_register(L, 'SetUnitY', SetUnitY.bind(C));
  lua_register(L, 'SetUnitPosition', SetUnitPosition.bind(C));
  lua_register(L, 'SetUnitPositionLoc', SetUnitPositionLoc.bind(C));
  lua_register(L, 'SetUnitFacing', SetUnitFacing.bind(C));
  lua_register(L, 'SetUnitFacingTimed', SetUnitFacingTimed.bind(C));
  lua_register(L, 'SetUnitMoveSpeed', SetUnitMoveSpeed.bind(C));
  lua_register(L, 'SetUnitFlyHeight', SetUnitFlyHeight.bind(C));
  lua_register(L, 'SetUnitTurnSpeed', SetUnitTurnSpeed.bind(C));
  lua_register(L, 'SetUnitPropWindow', SetUnitPropWindow.bind(C));
  lua_register(L, 'SetUnitAcquireRange', SetUnitAcquireRange.bind(C));
  lua_register(L, 'SetUnitCreepGuard', SetUnitCreepGuard.bind(C));
  lua_register(L, 'GetUnitAcquireRange', GetUnitAcquireRange.bind(C));
  lua_register(L, 'GetUnitTurnSpeed', GetUnitTurnSpeed.bind(C));
  lua_register(L, 'GetUnitPropWindow', GetUnitPropWindow.bind(C));
  lua_register(L, 'GetUnitFlyHeight', GetUnitFlyHeight.bind(C));
  lua_register(L, 'GetUnitDefaultAcquireRange', GetUnitDefaultAcquireRange.bind(C));
  lua_register(L, 'GetUnitDefaultTurnSpeed', GetUnitDefaultTurnSpeed.bind(C));
  lua_register(L, 'GetUnitDefaultPropWindow', GetUnitDefaultPropWindow.bind(C));
  lua_register(L, 'GetUnitDefaultFlyHeight', GetUnitDefaultFlyHeight.bind(C));
  lua_register(L, 'SetUnitOwner', SetUnitOwner.bind(C));
  lua_register(L, 'SetUnitColor', SetUnitColor.bind(C));
  lua_register(L, 'SetUnitScale', SetUnitScale.bind(C));
  lua_register(L, 'SetUnitTimeScale', SetUnitTimeScale.bind(C));
  lua_register(L, 'SetUnitBlendTime', SetUnitBlendTime.bind(C));
  lua_register(L, 'SetUnitVertexColor', SetUnitVertexColor.bind(C));
  lua_register(L, 'QueueUnitAnimation', QueueUnitAnimation.bind(C));
  lua_register(L, 'SetUnitAnimation', SetUnitAnimation.bind(C));
  lua_register(L, 'SetUnitAnimationByIndex', SetUnitAnimationByIndex.bind(C));
  lua_register(L, 'SetUnitAnimationWithRarity', SetUnitAnimationWithRarity.bind(C));
  lua_register(L, 'AddUnitAnimationProperties', AddUnitAnimationProperties.bind(C));
  lua_register(L, 'SetUnitLookAt', SetUnitLookAt.bind(C));
  lua_register(L, 'ResetUnitLookAt', ResetUnitLookAt.bind(C));
  lua_register(L, 'SetUnitRescuable', SetUnitRescuable.bind(C));
  lua_register(L, 'SetUnitRescueRange', SetUnitRescueRange.bind(C));
  lua_register(L, 'SetHeroStr', SetHeroStr.bind(C));
  lua_register(L, 'SetHeroAgi', SetHeroAgi.bind(C));
  lua_register(L, 'SetHeroInt', SetHeroInt.bind(C));
  lua_register(L, 'GetHeroStr', GetHeroStr.bind(C));
  lua_register(L, 'GetHeroAgi', GetHeroAgi.bind(C));
  lua_register(L, 'GetHeroInt', GetHeroInt.bind(C));
  lua_register(L, 'UnitStripHeroLevel', UnitStripHeroLevel.bind(C));
  lua_register(L, 'GetHeroXP', GetHeroXP.bind(C));
  lua_register(L, 'SetHeroXP', SetHeroXP.bind(C));
  lua_register(L, 'GetHeroSkillPoints', GetHeroSkillPoints.bind(C));
  lua_register(L, 'UnitModifySkillPoints', UnitModifySkillPoints.bind(C));
  lua_register(L, 'AddHeroXP', AddHeroXP.bind(C));
  lua_register(L, 'SetHeroLevel', SetHeroLevel.bind(C));
  lua_register(L, 'GetHeroLevel', GetHeroLevel.bind(C));
  lua_register(L, 'GetUnitLevel', GetUnitLevel.bind(C));
  lua_register(L, 'GetHeroProperName', GetHeroProperName.bind(C));
  lua_register(L, 'SuspendHeroXP', SuspendHeroXP.bind(C));
  lua_register(L, 'IsSuspendedXP', IsSuspendedXP.bind(C));
  lua_register(L, 'SelectHeroSkill', SelectHeroSkill.bind(C));
  lua_register(L, 'GetUnitAbilityLevel', GetUnitAbilityLevel.bind(C));
  lua_register(L, 'DecUnitAbilityLevel', DecUnitAbilityLevel.bind(C));
  lua_register(L, 'IncUnitAbilityLevel', IncUnitAbilityLevel.bind(C));
  lua_register(L, 'SetUnitAbilityLevel', SetUnitAbilityLevel.bind(C));
  lua_register(L, 'ReviveHero', ReviveHero.bind(C));
  lua_register(L, 'ReviveHeroLoc', ReviveHeroLoc.bind(C));
  lua_register(L, 'SetUnitExploded', SetUnitExploded.bind(C));
  lua_register(L, 'SetUnitInvulnerable', SetUnitInvulnerable.bind(C));
  lua_register(L, 'PauseUnit', PauseUnit.bind(C));
  lua_register(L, 'IsUnitPaused', IsUnitPaused.bind(C));
  lua_register(L, 'SetUnitPathing', SetUnitPathing.bind(C));
  lua_register(L, 'ClearSelection', ClearSelection.bind(C));
  lua_register(L, 'SelectUnit', SelectUnit.bind(C));
  lua_register(L, 'GetUnitPointValue', GetUnitPointValue.bind(C));
  lua_register(L, 'GetUnitPointValueByType', GetUnitPointValueByType.bind(C));
  lua_register(L, 'UnitAddItem', UnitAddItem.bind(C));
  lua_register(L, 'UnitAddItemById', UnitAddItemById.bind(C));
  lua_register(L, 'UnitAddItemToSlotById', UnitAddItemToSlotById.bind(C));
  lua_register(L, 'UnitRemoveItem', UnitRemoveItem.bind(C));
  lua_register(L, 'UnitRemoveItemFromSlot', UnitRemoveItemFromSlot.bind(C));
  lua_register(L, 'UnitHasItem', UnitHasItem.bind(C));
  lua_register(L, 'UnitItemInSlot', UnitItemInSlot.bind(C));
  lua_register(L, 'UnitInventorySize', UnitInventorySize.bind(C));
  lua_register(L, 'UnitDropItemPoint', UnitDropItemPoint.bind(C));
  lua_register(L, 'UnitDropItemSlot', UnitDropItemSlot.bind(C));
  lua_register(L, 'UnitDropItemTarget', UnitDropItemTarget.bind(C));
  lua_register(L, 'UnitUseItem', UnitUseItem.bind(C));
  lua_register(L, 'UnitUseItemPoint', UnitUseItemPoint.bind(C));
  lua_register(L, 'UnitUseItemTarget', UnitUseItemTarget.bind(C));
  lua_register(L, 'GetUnitX', GetUnitX.bind(C));
  lua_register(L, 'GetUnitY', GetUnitY.bind(C));
  lua_register(L, 'GetUnitLoc', GetUnitLoc.bind(C));
  lua_register(L, 'GetUnitFacing', GetUnitFacing.bind(C));
  lua_register(L, 'GetUnitMoveSpeed', GetUnitMoveSpeed.bind(C));
  lua_register(L, 'GetUnitDefaultMoveSpeed', GetUnitDefaultMoveSpeed.bind(C));
  lua_register(L, 'GetUnitState', GetUnitState.bind(C));
  lua_register(L, 'GetOwningPlayer', GetOwningPlayer.bind(C));
  lua_register(L, 'GetUnitTypeId', GetUnitTypeId.bind(C));
  lua_register(L, 'GetUnitRace', GetUnitRace.bind(C));
  lua_register(L, 'GetUnitName', GetUnitName.bind(C));
  lua_register(L, 'GetUnitFoodUsed', GetUnitFoodUsed.bind(C));
  lua_register(L, 'GetUnitFoodMade', GetUnitFoodMade.bind(C));
  lua_register(L, 'GetFoodMade', GetFoodMade.bind(C));
  lua_register(L, 'GetFoodUsed', GetFoodUsed.bind(C));
  lua_register(L, 'SetUnitUseFood', SetUnitUseFood.bind(C));
  lua_register(L, 'GetUnitRallyPoint', GetUnitRallyPoint.bind(C));
  lua_register(L, 'GetUnitRallyUnit', GetUnitRallyUnit.bind(C));
  lua_register(L, 'GetUnitRallyDestructable', GetUnitRallyDestructable.bind(C));
  lua_register(L, 'IsUnitInGroup', IsUnitInGroup.bind(C));
  lua_register(L, 'IsUnitInForce', IsUnitInForce.bind(C));
  lua_register(L, 'IsUnitOwnedByPlayer', IsUnitOwnedByPlayer.bind(C));
  lua_register(L, 'IsUnitAlly', IsUnitAlly.bind(C));
  lua_register(L, 'IsUnitEnemy', IsUnitEnemy.bind(C));
  lua_register(L, 'IsUnitVisible', IsUnitVisible.bind(C));
  lua_register(L, 'IsUnitDetected', IsUnitDetected.bind(C));
  lua_register(L, 'IsUnitInvisible', IsUnitInvisible.bind(C));
  lua_register(L, 'IsUnitFogged', IsUnitFogged.bind(C));
  lua_register(L, 'IsUnitMasked', IsUnitMasked.bind(C));
  lua_register(L, 'IsUnitSelected', IsUnitSelected.bind(C));
  lua_register(L, 'IsUnitRace', IsUnitRace.bind(C));
  lua_register(L, 'IsUnitType', IsUnitType.bind(C));
  lua_register(L, 'IsUnit', IsUnit.bind(C));
  lua_register(L, 'IsUnitInRange', IsUnitInRange.bind(C));
  lua_register(L, 'IsUnitInRangeXY', IsUnitInRangeXY.bind(C));
  lua_register(L, 'IsUnitInRangeLoc', IsUnitInRangeLoc.bind(C));
  lua_register(L, 'IsUnitHidden', IsUnitHidden.bind(C));
  lua_register(L, 'IsUnitIllusion', IsUnitIllusion.bind(C));
  lua_register(L, 'IsUnitInTransport', IsUnitInTransport.bind(C));
  lua_register(L, 'IsUnitLoaded', IsUnitLoaded.bind(C));
  lua_register(L, 'IsHeroUnitId', IsHeroUnitId.bind(C));
  lua_register(L, 'IsUnitIdType', IsUnitIdType.bind(C));
  lua_register(L, 'UnitShareVision', UnitShareVision.bind(C));
  lua_register(L, 'UnitSuspendDecay', UnitSuspendDecay.bind(C));
  lua_register(L, 'UnitAddType', UnitAddType.bind(C));
  lua_register(L, 'UnitRemoveType', UnitRemoveType.bind(C));
  lua_register(L, 'UnitAddAbility', UnitAddAbility.bind(C));
  lua_register(L, 'UnitRemoveAbility', UnitRemoveAbility.bind(C));
  lua_register(L, 'UnitMakeAbilityPermanent', UnitMakeAbilityPermanent.bind(C));
  lua_register(L, 'UnitRemoveBuffs', UnitRemoveBuffs.bind(C));
  lua_register(L, 'UnitRemoveBuffsEx', UnitRemoveBuffsEx.bind(C));
  lua_register(L, 'UnitHasBuffsEx', UnitHasBuffsEx.bind(C));
  lua_register(L, 'UnitCountBuffsEx', UnitCountBuffsEx.bind(C));
  lua_register(L, 'UnitAddSleep', UnitAddSleep.bind(C));
  lua_register(L, 'UnitCanSleep', UnitCanSleep.bind(C));
  lua_register(L, 'UnitAddSleepPerm', UnitAddSleepPerm.bind(C));
  lua_register(L, 'UnitCanSleepPerm', UnitCanSleepPerm.bind(C));
  lua_register(L, 'UnitIsSleeping', UnitIsSleeping.bind(C));
  lua_register(L, 'UnitWakeUp', UnitWakeUp.bind(C));
  lua_register(L, 'UnitApplyTimedLife', UnitApplyTimedLife.bind(C));
  lua_register(L, 'UnitIgnoreAlarm', UnitIgnoreAlarm.bind(C));
  lua_register(L, 'UnitIgnoreAlarmToggled', UnitIgnoreAlarmToggled.bind(C));
  lua_register(L, 'UnitResetCooldown', UnitResetCooldown.bind(C));
  lua_register(L, 'UnitSetConstructionProgress', UnitSetConstructionProgress.bind(C));
  lua_register(L, 'UnitSetUpgradeProgress', UnitSetUpgradeProgress.bind(C));
  lua_register(L, 'UnitPauseTimedLife', UnitPauseTimedLife.bind(C));
  lua_register(L, 'UnitSetUsesAltIcon', UnitSetUsesAltIcon.bind(C));
  lua_register(L, 'UnitDamagePoint', UnitDamagePoint.bind(C));
  lua_register(L, 'UnitDamageTarget', UnitDamageTarget.bind(C));
  lua_register(L, 'IssueImmediateOrder', IssueImmediateOrder.bind(C));
  lua_register(L, 'IssueImmediateOrderById', IssueImmediateOrderById.bind(C));
  lua_register(L, 'IssuePointOrder', IssuePointOrder.bind(C));
  lua_register(L, 'IssuePointOrderLoc', IssuePointOrderLoc.bind(C));
  lua_register(L, 'IssuePointOrderById', IssuePointOrderById.bind(C));
  lua_register(L, 'IssuePointOrderByIdLoc', IssuePointOrderByIdLoc.bind(C));
  lua_register(L, 'IssueTargetOrder', IssueTargetOrder.bind(C));
  lua_register(L, 'IssueTargetOrderById', IssueTargetOrderById.bind(C));
  lua_register(L, 'IssueInstantPointOrder', IssueInstantPointOrder.bind(C));
  lua_register(L, 'IssueInstantPointOrderById', IssueInstantPointOrderById.bind(C));
  lua_register(L, 'IssueInstantTargetOrder', IssueInstantTargetOrder.bind(C));
  lua_register(L, 'IssueInstantTargetOrderById', IssueInstantTargetOrderById.bind(C));
  lua_register(L, 'IssueBuildOrder', IssueBuildOrder.bind(C));
  lua_register(L, 'IssueBuildOrderById', IssueBuildOrderById.bind(C));
  lua_register(L, 'IssueNeutralImmediateOrder', IssueNeutralImmediateOrder.bind(C));
  lua_register(L, 'IssueNeutralImmediateOrderById', IssueNeutralImmediateOrderById.bind(C));
  lua_register(L, 'IssueNeutralPointOrder', IssueNeutralPointOrder.bind(C));
  lua_register(L, 'IssueNeutralPointOrderById', IssueNeutralPointOrderById.bind(C));
  lua_register(L, 'IssueNeutralTargetOrder', IssueNeutralTargetOrder.bind(C));
  lua_register(L, 'IssueNeutralTargetOrderById', IssueNeutralTargetOrderById.bind(C));
  lua_register(L, 'GetUnitCurrentOrder', GetUnitCurrentOrder.bind(C));
  lua_register(L, 'SetResourceAmount', SetResourceAmount.bind(C));
  lua_register(L, 'AddResourceAmount', AddResourceAmount.bind(C));
  lua_register(L, 'GetResourceAmount', GetResourceAmount.bind(C));
  lua_register(L, 'WaygateGetDestinationX', WaygateGetDestinationX.bind(C));
  lua_register(L, 'WaygateGetDestinationY', WaygateGetDestinationY.bind(C));
  lua_register(L, 'WaygateSetDestination', WaygateSetDestination.bind(C));
  lua_register(L, 'WaygateActivate', WaygateActivate.bind(C));
  lua_register(L, 'WaygateIsActive', WaygateIsActive.bind(C));
  lua_register(L, 'AddItemToAllStock', AddItemToAllStock.bind(C));
  lua_register(L, 'AddItemToStock', AddItemToStock.bind(C));
  lua_register(L, 'AddUnitToAllStock', AddUnitToAllStock.bind(C));
  lua_register(L, 'AddUnitToStock', AddUnitToStock.bind(C));
  lua_register(L, 'RemoveItemFromAllStock', RemoveItemFromAllStock.bind(C));
  lua_register(L, 'RemoveItemFromStock', RemoveItemFromStock.bind(C));
  lua_register(L, 'RemoveUnitFromAllStock', RemoveUnitFromAllStock.bind(C));
  lua_register(L, 'RemoveUnitFromStock', RemoveUnitFromStock.bind(C));
  lua_register(L, 'SetAllItemTypeSlots', SetAllItemTypeSlots.bind(C));
  lua_register(L, 'SetAllUnitTypeSlots', SetAllUnitTypeSlots.bind(C));
  lua_register(L, 'SetItemTypeSlots', SetItemTypeSlots.bind(C));
  lua_register(L, 'SetUnitTypeSlots', SetUnitTypeSlots.bind(C));
  lua_register(L, 'GetUnitUserData', GetUnitUserData.bind(C));
  lua_register(L, 'SetUnitUserData', SetUnitUserData.bind(C));
  lua_register(L, 'Player', Player.bind(C));
  lua_register(L, 'GetLocalPlayer', GetLocalPlayer.bind(C));
  lua_register(L, 'IsPlayerAlly', IsPlayerAlly.bind(C));
  lua_register(L, 'IsPlayerEnemy', IsPlayerEnemy.bind(C));
  lua_register(L, 'IsPlayerInForce', IsPlayerInForce.bind(C));
  lua_register(L, 'IsPlayerObserver', IsPlayerObserver.bind(C));
  lua_register(L, 'IsVisibleToPlayer', IsVisibleToPlayer.bind(C));
  lua_register(L, 'IsLocationVisibleToPlayer', IsLocationVisibleToPlayer.bind(C));
  lua_register(L, 'IsFoggedToPlayer', IsFoggedToPlayer.bind(C));
  lua_register(L, 'IsLocationFoggedToPlayer', IsLocationFoggedToPlayer.bind(C));
  lua_register(L, 'IsMaskedToPlayer', IsMaskedToPlayer.bind(C));
  lua_register(L, 'IsLocationMaskedToPlayer', IsLocationMaskedToPlayer.bind(C));
  lua_register(L, 'GetPlayerRace', GetPlayerRace.bind(C));
  lua_register(L, 'GetPlayerId', GetPlayerId.bind(C));
  lua_register(L, 'GetPlayerUnitCount', GetPlayerUnitCount.bind(C));
  lua_register(L, 'GetPlayerTypedUnitCount', GetPlayerTypedUnitCount.bind(C));
  lua_register(L, 'GetPlayerStructureCount', GetPlayerStructureCount.bind(C));
  lua_register(L, 'GetPlayerState', GetPlayerState.bind(C));
  lua_register(L, 'GetPlayerScore', GetPlayerScore.bind(C));
  lua_register(L, 'GetPlayerAlliance', GetPlayerAlliance.bind(C));
  lua_register(L, 'GetPlayerHandicap', GetPlayerHandicap.bind(C));
  lua_register(L, 'GetPlayerHandicapXP', GetPlayerHandicapXP.bind(C));
  lua_register(L, 'SetPlayerHandicap', SetPlayerHandicap.bind(C));
  lua_register(L, 'SetPlayerHandicapXP', SetPlayerHandicapXP.bind(C));
  lua_register(L, 'SetPlayerTechMaxAllowed', SetPlayerTechMaxAllowed.bind(C));
  lua_register(L, 'GetPlayerTechMaxAllowed', GetPlayerTechMaxAllowed.bind(C));
  lua_register(L, 'AddPlayerTechResearched', AddPlayerTechResearched.bind(C));
  lua_register(L, 'SetPlayerTechResearched', SetPlayerTechResearched.bind(C));
  lua_register(L, 'GetPlayerTechResearched', GetPlayerTechResearched.bind(C));
  lua_register(L, 'GetPlayerTechCount', GetPlayerTechCount.bind(C));
  lua_register(L, 'SetPlayerUnitsOwner', SetPlayerUnitsOwner.bind(C));
  lua_register(L, 'CripplePlayer', CripplePlayer.bind(C));
  lua_register(L, 'SetPlayerAbilityAvailable', SetPlayerAbilityAvailable.bind(C));
  lua_register(L, 'SetPlayerState', SetPlayerState.bind(C));
  lua_register(L, 'RemovePlayer', RemovePlayer.bind(C));
  lua_register(L, 'CachePlayerHeroData', CachePlayerHeroData.bind(C));
  lua_register(L, 'SetFogStateRect', SetFogStateRect.bind(C));
  lua_register(L, 'SetFogStateRadius', SetFogStateRadius.bind(C));
  lua_register(L, 'SetFogStateRadiusLoc', SetFogStateRadiusLoc.bind(C));
  lua_register(L, 'FogMaskEnable', FogMaskEnable.bind(C));
  lua_register(L, 'IsFogMaskEnabled', IsFogMaskEnabled.bind(C));
  lua_register(L, 'FogEnable', FogEnable.bind(C));
  lua_register(L, 'IsFogEnabled', IsFogEnabled.bind(C));
  lua_register(L, 'CreateFogModifierRect', CreateFogModifierRect.bind(C));
  lua_register(L, 'CreateFogModifierRadius', CreateFogModifierRadius.bind(C));
  lua_register(L, 'CreateFogModifierRadiusLoc', CreateFogModifierRadiusLoc.bind(C));
  lua_register(L, 'DestroyFogModifier', DestroyFogModifier.bind(C));
  lua_register(L, 'FogModifierStart', FogModifierStart.bind(C));
  lua_register(L, 'FogModifierStop', FogModifierStop.bind(C));
  lua_register(L, 'VersionGet', VersionGet.bind(C));
  lua_register(L, 'VersionCompatible', VersionCompatible.bind(C));
  lua_register(L, 'VersionSupported', VersionSupported.bind(C));
  lua_register(L, 'EndGame', EndGame.bind(C));
  lua_register(L, 'ChangeLevel', ChangeLevel.bind(C));
  lua_register(L, 'RestartGame', RestartGame.bind(C));
  lua_register(L, 'ReloadGame', ReloadGame.bind(C));
  lua_register(L, 'SetCampaignMenuRace', SetCampaignMenuRace.bind(C));
  lua_register(L, 'SetCampaignMenuRaceEx', SetCampaignMenuRaceEx.bind(C));
  lua_register(L, 'ForceCampaignSelectScreen', ForceCampaignSelectScreen.bind(C));
  lua_register(L, 'LoadGame', LoadGame.bind(C));
  lua_register(L, 'SaveGame', SaveGame.bind(C));
  lua_register(L, 'RenameSaveDirectory', RenameSaveDirectory.bind(C));
  lua_register(L, 'RemoveSaveDirectory', RemoveSaveDirectory.bind(C));
  lua_register(L, 'CopySaveGame', CopySaveGame.bind(C));
  lua_register(L, 'SaveGameExists', SaveGameExists.bind(C));
  lua_register(L, 'SyncSelections', SyncSelections.bind(C));
  lua_register(L, 'SetFloatGameState', SetFloatGameState.bind(C));
  lua_register(L, 'GetFloatGameState', GetFloatGameState.bind(C));
  lua_register(L, 'SetIntegerGameState', SetIntegerGameState.bind(C));
  lua_register(L, 'GetIntegerGameState', GetIntegerGameState.bind(C));
  lua_register(L, 'SetTutorialCleared', SetTutorialCleared.bind(C));
  lua_register(L, 'SetMissionAvailable', SetMissionAvailable.bind(C));
  lua_register(L, 'SetCampaignAvailable', SetCampaignAvailable.bind(C));
  lua_register(L, 'SetOpCinematicAvailable', SetOpCinematicAvailable.bind(C));
  lua_register(L, 'SetEdCinematicAvailable', SetEdCinematicAvailable.bind(C));
  lua_register(L, 'GetDefaultDifficulty', GetDefaultDifficulty.bind(C));
  lua_register(L, 'SetDefaultDifficulty', SetDefaultDifficulty.bind(C));
  lua_register(L, 'SetCustomCampaignButtonVisible', SetCustomCampaignButtonVisible.bind(C));
  lua_register(L, 'GetCustomCampaignButtonVisible', GetCustomCampaignButtonVisible.bind(C));
  lua_register(L, 'DoNotSaveReplay', DoNotSaveReplay.bind(C));
  lua_register(L, 'DialogCreate', DialogCreate.bind(C));
  lua_register(L, 'DialogDestroy', DialogDestroy.bind(C));
  lua_register(L, 'DialogClear', DialogClear.bind(C));
  lua_register(L, 'DialogSetMessage', DialogSetMessage.bind(C));
  lua_register(L, 'DialogAddButton', DialogAddButton.bind(C));
  lua_register(L, 'DialogAddQuitButton', DialogAddQuitButton.bind(C));
  lua_register(L, 'DialogDisplay', DialogDisplay.bind(C));
  lua_register(L, 'ReloadGameCachesFromDisk', ReloadGameCachesFromDisk.bind(C));
  lua_register(L, 'InitGameCache', InitGameCache.bind(C));
  lua_register(L, 'SaveGameCache', SaveGameCache.bind(C));
  lua_register(L, 'StoreInteger', StoreInteger.bind(C));
  lua_register(L, 'StoreReal', StoreReal.bind(C));
  lua_register(L, 'StoreBoolean', StoreBoolean.bind(C));
  lua_register(L, 'StoreUnit', StoreUnit.bind(C));
  lua_register(L, 'StoreString', StoreString.bind(C));
  lua_register(L, 'SyncStoredInteger', SyncStoredInteger.bind(C));
  lua_register(L, 'SyncStoredReal', SyncStoredReal.bind(C));
  lua_register(L, 'SyncStoredBoolean', SyncStoredBoolean.bind(C));
  lua_register(L, 'SyncStoredUnit', SyncStoredUnit.bind(C));
  lua_register(L, 'SyncStoredString', SyncStoredString.bind(C));
  lua_register(L, 'HaveStoredInteger', HaveStoredInteger.bind(C));
  lua_register(L, 'HaveStoredReal', HaveStoredReal.bind(C));
  lua_register(L, 'HaveStoredBoolean', HaveStoredBoolean.bind(C));
  lua_register(L, 'HaveStoredUnit', HaveStoredUnit.bind(C));
  lua_register(L, 'HaveStoredString', HaveStoredString.bind(C));
  lua_register(L, 'FlushGameCache', FlushGameCache.bind(C));
  lua_register(L, 'FlushStoredMission', FlushStoredMission.bind(C));
  lua_register(L, 'FlushStoredInteger', FlushStoredInteger.bind(C));
  lua_register(L, 'FlushStoredReal', FlushStoredReal.bind(C));
  lua_register(L, 'FlushStoredBoolean', FlushStoredBoolean.bind(C));
  lua_register(L, 'FlushStoredUnit', FlushStoredUnit.bind(C));
  lua_register(L, 'FlushStoredString', FlushStoredString.bind(C));
  lua_register(L, 'GetStoredInteger', GetStoredInteger.bind(C));
  lua_register(L, 'GetStoredReal', GetStoredReal.bind(C));
  lua_register(L, 'GetStoredBoolean', GetStoredBoolean.bind(C));
  lua_register(L, 'GetStoredString', GetStoredString.bind(C));
  lua_register(L, 'RestoreUnit', RestoreUnit.bind(C));
  lua_register(L, 'InitHashtable', InitHashtable.bind(C));
  lua_register(L, 'SaveInteger', SaveInteger.bind(C));
  lua_register(L, 'SaveReal', SaveReal.bind(C));
  lua_register(L, 'SaveBoolean', SaveBoolean.bind(C));
  lua_register(L, 'SaveStr', SaveStr.bind(C));
  lua_register(L, 'SavePlayerHandle', SavePlayerHandle.bind(C));
  lua_register(L, 'SaveWidgetHandle', SaveWidgetHandle.bind(C));
  lua_register(L, 'SaveDestructableHandle', SaveDestructableHandle.bind(C));
  lua_register(L, 'SaveItemHandle', SaveItemHandle.bind(C));
  lua_register(L, 'SaveUnitHandle', SaveUnitHandle.bind(C));
  lua_register(L, 'SaveAbilityHandle', SaveAbilityHandle.bind(C));
  lua_register(L, 'SaveTimerHandle', SaveTimerHandle.bind(C));
  lua_register(L, 'SaveTriggerHandle', SaveTriggerHandle.bind(C));
  lua_register(L, 'SaveTriggerConditionHandle', SaveTriggerConditionHandle.bind(C));
  lua_register(L, 'SaveTriggerActionHandle', SaveTriggerActionHandle.bind(C));
  lua_register(L, 'SaveTriggerEventHandle', SaveTriggerEventHandle.bind(C));
  lua_register(L, 'SaveForceHandle', SaveForceHandle.bind(C));
  lua_register(L, 'SaveGroupHandle', SaveGroupHandle.bind(C));
  lua_register(L, 'SaveLocationHandle', SaveLocationHandle.bind(C));
  lua_register(L, 'SaveRectHandle', SaveRectHandle.bind(C));
  lua_register(L, 'SaveBooleanExprHandle', SaveBooleanExprHandle.bind(C));
  lua_register(L, 'SaveSoundHandle', SaveSoundHandle.bind(C));
  lua_register(L, 'SaveEffectHandle', SaveEffectHandle.bind(C));
  lua_register(L, 'SaveUnitPoolHandle', SaveUnitPoolHandle.bind(C));
  lua_register(L, 'SaveItemPoolHandle', SaveItemPoolHandle.bind(C));
  lua_register(L, 'SaveQuestHandle', SaveQuestHandle.bind(C));
  lua_register(L, 'SaveQuestItemHandle', SaveQuestItemHandle.bind(C));
  lua_register(L, 'SaveDefeatConditionHandle', SaveDefeatConditionHandle.bind(C));
  lua_register(L, 'SaveTimerDialogHandle', SaveTimerDialogHandle.bind(C));
  lua_register(L, 'SaveLeaderboardHandle', SaveLeaderboardHandle.bind(C));
  lua_register(L, 'SaveMultiboardHandle', SaveMultiboardHandle.bind(C));
  lua_register(L, 'SaveMultiboardItemHandle', SaveMultiboardItemHandle.bind(C));
  lua_register(L, 'SaveTrackableHandle', SaveTrackableHandle.bind(C));
  lua_register(L, 'SaveDialogHandle', SaveDialogHandle.bind(C));
  lua_register(L, 'SaveButtonHandle', SaveButtonHandle.bind(C));
  lua_register(L, 'SaveTextTagHandle', SaveTextTagHandle.bind(C));
  lua_register(L, 'SaveLightningHandle', SaveLightningHandle.bind(C));
  lua_register(L, 'SaveImageHandle', SaveImageHandle.bind(C));
  lua_register(L, 'SaveUbersplatHandle', SaveUbersplatHandle.bind(C));
  lua_register(L, 'SaveRegionHandle', SaveRegionHandle.bind(C));
  lua_register(L, 'SaveFogStateHandle', SaveFogStateHandle.bind(C));
  lua_register(L, 'SaveFogModifierHandle', SaveFogModifierHandle.bind(C));
  lua_register(L, 'SaveAgentHandle', SaveAgentHandle.bind(C));
  lua_register(L, 'SaveHashtableHandle', SaveHashtableHandle.bind(C));
  lua_register(L, 'LoadInteger', LoadInteger.bind(C));
  lua_register(L, 'LoadReal', LoadReal.bind(C));
  lua_register(L, 'LoadBoolean', LoadBoolean.bind(C));
  lua_register(L, 'LoadStr', LoadStr.bind(C));
  lua_register(L, 'LoadPlayerHandle', LoadPlayerHandle.bind(C));
  lua_register(L, 'LoadWidgetHandle', LoadWidgetHandle.bind(C));
  lua_register(L, 'LoadDestructableHandle', LoadDestructableHandle.bind(C));
  lua_register(L, 'LoadItemHandle', LoadItemHandle.bind(C));
  lua_register(L, 'LoadUnitHandle', LoadUnitHandle.bind(C));
  lua_register(L, 'LoadAbilityHandle', LoadAbilityHandle.bind(C));
  lua_register(L, 'LoadTimerHandle', LoadTimerHandle.bind(C));
  lua_register(L, 'LoadTriggerHandle', LoadTriggerHandle.bind(C));
  lua_register(L, 'LoadTriggerConditionHandle', LoadTriggerConditionHandle.bind(C));
  lua_register(L, 'LoadTriggerActionHandle', LoadTriggerActionHandle.bind(C));
  lua_register(L, 'LoadTriggerEventHandle', LoadTriggerEventHandle.bind(C));
  lua_register(L, 'LoadForceHandle', LoadForceHandle.bind(C));
  lua_register(L, 'LoadGroupHandle', LoadGroupHandle.bind(C));
  lua_register(L, 'LoadLocationHandle', LoadLocationHandle.bind(C));
  lua_register(L, 'LoadRectHandle', LoadRectHandle.bind(C));
  lua_register(L, 'LoadBooleanExprHandle', LoadBooleanExprHandle.bind(C));
  lua_register(L, 'LoadSoundHandle', LoadSoundHandle.bind(C));
  lua_register(L, 'LoadEffectHandle', LoadEffectHandle.bind(C));
  lua_register(L, 'LoadUnitPoolHandle', LoadUnitPoolHandle.bind(C));
  lua_register(L, 'LoadItemPoolHandle', LoadItemPoolHandle.bind(C));
  lua_register(L, 'LoadQuestHandle', LoadQuestHandle.bind(C));
  lua_register(L, 'LoadQuestItemHandle', LoadQuestItemHandle.bind(C));
  lua_register(L, 'LoadDefeatConditionHandle', LoadDefeatConditionHandle.bind(C));
  lua_register(L, 'LoadTimerDialogHandle', LoadTimerDialogHandle.bind(C));
  lua_register(L, 'LoadLeaderboardHandle', LoadLeaderboardHandle.bind(C));
  lua_register(L, 'LoadMultiboardHandle', LoadMultiboardHandle.bind(C));
  lua_register(L, 'LoadMultiboardItemHandle', LoadMultiboardItemHandle.bind(C));
  lua_register(L, 'LoadTrackableHandle', LoadTrackableHandle.bind(C));
  lua_register(L, 'LoadDialogHandle', LoadDialogHandle.bind(C));
  lua_register(L, 'LoadButtonHandle', LoadButtonHandle.bind(C));
  lua_register(L, 'LoadTextTagHandle', LoadTextTagHandle.bind(C));
  lua_register(L, 'LoadLightningHandle', LoadLightningHandle.bind(C));
  lua_register(L, 'LoadImageHandle', LoadImageHandle.bind(C));
  lua_register(L, 'LoadUbersplatHandle', LoadUbersplatHandle.bind(C));
  lua_register(L, 'LoadRegionHandle', LoadRegionHandle.bind(C));
  lua_register(L, 'LoadFogStateHandle', LoadFogStateHandle.bind(C));
  lua_register(L, 'LoadFogModifierHandle', LoadFogModifierHandle.bind(C));
  lua_register(L, 'LoadHashtableHandle', LoadHashtableHandle.bind(C));
  lua_register(L, 'HaveSavedInteger', HaveSavedInteger.bind(C));
  lua_register(L, 'HaveSavedReal', HaveSavedReal.bind(C));
  lua_register(L, 'HaveSavedBoolean', HaveSavedBoolean.bind(C));
  lua_register(L, 'HaveSavedString', HaveSavedString.bind(C));
  lua_register(L, 'HaveSavedHandle', HaveSavedHandle.bind(C));
  lua_register(L, 'RemoveSavedInteger', RemoveSavedInteger.bind(C));
  lua_register(L, 'RemoveSavedReal', RemoveSavedReal.bind(C));
  lua_register(L, 'RemoveSavedBoolean', RemoveSavedBoolean.bind(C));
  lua_register(L, 'RemoveSavedString', RemoveSavedString.bind(C));
  lua_register(L, 'RemoveSavedHandle', RemoveSavedHandle.bind(C));
  lua_register(L, 'FlushParentHashtable', FlushParentHashtable.bind(C));
  lua_register(L, 'FlushChildHashtable', FlushChildHashtable.bind(C));
  lua_register(L, 'GetRandomInt', GetRandomInt.bind(C));
  lua_register(L, 'GetRandomReal', GetRandomReal.bind(C));
  lua_register(L, 'CreateUnitPool', CreateUnitPool.bind(C));
  lua_register(L, 'DestroyUnitPool', DestroyUnitPool.bind(C));
  lua_register(L, 'UnitPoolAddUnitType', UnitPoolAddUnitType.bind(C));
  lua_register(L, 'UnitPoolRemoveUnitType', UnitPoolRemoveUnitType.bind(C));
  lua_register(L, 'PlaceRandomUnit', PlaceRandomUnit.bind(C));
  lua_register(L, 'CreateItemPool', CreateItemPool.bind(C));
  lua_register(L, 'DestroyItemPool', DestroyItemPool.bind(C));
  lua_register(L, 'ItemPoolAddItemType', ItemPoolAddItemType.bind(C));
  lua_register(L, 'ItemPoolRemoveItemType', ItemPoolRemoveItemType.bind(C));
  lua_register(L, 'PlaceRandomItem', PlaceRandomItem.bind(C));
  lua_register(L, 'ChooseRandomCreep', ChooseRandomCreep.bind(C));
  lua_register(L, 'ChooseRandomNPBuilding', ChooseRandomNPBuilding.bind(C));
  lua_register(L, 'ChooseRandomItem', ChooseRandomItem.bind(C));
  lua_register(L, 'ChooseRandomItemEx', ChooseRandomItemEx.bind(C));
  lua_register(L, 'SetRandomSeed', SetRandomSeed.bind(C));
  lua_register(L, 'SetTerrainFog', SetTerrainFog.bind(C));
  lua_register(L, 'ResetTerrainFog', ResetTerrainFog.bind(C));
  lua_register(L, 'SetUnitFog', SetUnitFog.bind(C));
  lua_register(L, 'SetTerrainFogEx', SetTerrainFogEx.bind(C));
  lua_register(L, 'DisplayTextToPlayer', DisplayTextToPlayer.bind(C));
  lua_register(L, 'DisplayTimedTextToPlayer', DisplayTimedTextToPlayer.bind(C));
  lua_register(L, 'DisplayTimedTextFromPlayer', DisplayTimedTextFromPlayer.bind(C));
  lua_register(L, 'ClearTextMessages', ClearTextMessages.bind(C));
  lua_register(L, 'SetDayNightModels', SetDayNightModels.bind(C));
  lua_register(L, 'SetSkyModel', SetSkyModel.bind(C));
  lua_register(L, 'EnableUserControl', EnableUserControl.bind(C));
  lua_register(L, 'EnableUserUI', EnableUserUI.bind(C));
  lua_register(L, 'SuspendTimeOfDay', SuspendTimeOfDay.bind(C));
  lua_register(L, 'SetTimeOfDayScale', SetTimeOfDayScale.bind(C));
  lua_register(L, 'GetTimeOfDayScale', GetTimeOfDayScale.bind(C));
  lua_register(L, 'ShowInterface', ShowInterface.bind(C));
  lua_register(L, 'PauseGame', PauseGame.bind(C));
  lua_register(L, 'UnitAddIndicator', UnitAddIndicator.bind(C));
  lua_register(L, 'AddIndicator', AddIndicator.bind(C));
  lua_register(L, 'PingMinimap', PingMinimap.bind(C));
  lua_register(L, 'PingMinimapEx', PingMinimapEx.bind(C));
  lua_register(L, 'EnableOcclusion', EnableOcclusion.bind(C));
  lua_register(L, 'SetIntroShotText', SetIntroShotText.bind(C));
  lua_register(L, 'SetIntroShotModel', SetIntroShotModel.bind(C));
  lua_register(L, 'EnableWorldFogBoundary', EnableWorldFogBoundary.bind(C));
  lua_register(L, 'PlayModelCinematic', PlayModelCinematic.bind(C));
  lua_register(L, 'PlayCinematic', PlayCinematic.bind(C));
  lua_register(L, 'ForceUIKey', ForceUIKey.bind(C));
  lua_register(L, 'ForceUICancel', ForceUICancel.bind(C));
  lua_register(L, 'DisplayLoadDialog', DisplayLoadDialog.bind(C));
  lua_register(L, 'SetAltMinimapIcon', SetAltMinimapIcon.bind(C));
  lua_register(L, 'DisableRestartMission', DisableRestartMission.bind(C));
  lua_register(L, 'CreateTextTag', CreateTextTag.bind(C));
  lua_register(L, 'DestroyTextTag', DestroyTextTag.bind(C));
  lua_register(L, 'SetTextTagText', SetTextTagText.bind(C));
  lua_register(L, 'SetTextTagPos', SetTextTagPos.bind(C));
  lua_register(L, 'SetTextTagPosUnit', SetTextTagPosUnit.bind(C));
  lua_register(L, 'SetTextTagColor', SetTextTagColor.bind(C));
  lua_register(L, 'SetTextTagVelocity', SetTextTagVelocity.bind(C));
  lua_register(L, 'SetTextTagVisibility', SetTextTagVisibility.bind(C));
  lua_register(L, 'SetTextTagSuspended', SetTextTagSuspended.bind(C));
  lua_register(L, 'SetTextTagPermanent', SetTextTagPermanent.bind(C));
  lua_register(L, 'SetTextTagAge', SetTextTagAge.bind(C));
  lua_register(L, 'SetTextTagLifespan', SetTextTagLifespan.bind(C));
  lua_register(L, 'SetTextTagFadepoint', SetTextTagFadepoint.bind(C));
  lua_register(L, 'SetReservedLocalHeroButtons', SetReservedLocalHeroButtons.bind(C));
  lua_register(L, 'GetAllyColorFilterState', GetAllyColorFilterState.bind(C));
  lua_register(L, 'SetAllyColorFilterState', SetAllyColorFilterState.bind(C));
  lua_register(L, 'GetCreepCampFilterState', GetCreepCampFilterState.bind(C));
  lua_register(L, 'SetCreepCampFilterState', SetCreepCampFilterState.bind(C));
  lua_register(L, 'EnableMinimapFilterButtons', EnableMinimapFilterButtons.bind(C));
  lua_register(L, 'EnableDragSelect', EnableDragSelect.bind(C));
  lua_register(L, 'EnablePreSelect', EnablePreSelect.bind(C));
  lua_register(L, 'EnableSelect', EnableSelect.bind(C));
  lua_register(L, 'CreateTrackable', CreateTrackable.bind(C));
  lua_register(L, 'CreateQuest', CreateQuest.bind(C));
  lua_register(L, 'DestroyQuest', DestroyQuest.bind(C));
  lua_register(L, 'QuestSetTitle', QuestSetTitle.bind(C));
  lua_register(L, 'QuestSetDescription', QuestSetDescription.bind(C));
  lua_register(L, 'QuestSetIconPath', QuestSetIconPath.bind(C));
  lua_register(L, 'QuestSetRequired', QuestSetRequired.bind(C));
  lua_register(L, 'QuestSetCompleted', QuestSetCompleted.bind(C));
  lua_register(L, 'QuestSetDiscovered', QuestSetDiscovered.bind(C));
  lua_register(L, 'QuestSetFailed', QuestSetFailed.bind(C));
  lua_register(L, 'QuestSetEnabled', QuestSetEnabled.bind(C));
  lua_register(L, 'IsQuestRequired', IsQuestRequired.bind(C));
  lua_register(L, 'IsQuestCompleted', IsQuestCompleted.bind(C));
  lua_register(L, 'IsQuestDiscovered', IsQuestDiscovered.bind(C));
  lua_register(L, 'IsQuestFailed', IsQuestFailed.bind(C));
  lua_register(L, 'IsQuestEnabled', IsQuestEnabled.bind(C));
  lua_register(L, 'QuestCreateItem', QuestCreateItem.bind(C));
  lua_register(L, 'QuestItemSetDescription', QuestItemSetDescription.bind(C));
  lua_register(L, 'QuestItemSetCompleted', QuestItemSetCompleted.bind(C));
  lua_register(L, 'IsQuestItemCompleted', IsQuestItemCompleted.bind(C));
  lua_register(L, 'CreateDefeatCondition', CreateDefeatCondition.bind(C));
  lua_register(L, 'DestroyDefeatCondition', DestroyDefeatCondition.bind(C));
  lua_register(L, 'DefeatConditionSetDescription', DefeatConditionSetDescription.bind(C));
  lua_register(L, 'FlashQuestDialogButton', FlashQuestDialogButton.bind(C));
  lua_register(L, 'ForceQuestDialogUpdate', ForceQuestDialogUpdate.bind(C));
  lua_register(L, 'CreateTimerDialog', CreateTimerDialog.bind(C));
  lua_register(L, 'DestroyTimerDialog', DestroyTimerDialog.bind(C));
  lua_register(L, 'TimerDialogSetTitle', TimerDialogSetTitle.bind(C));
  lua_register(L, 'TimerDialogSetTitleColor', TimerDialogSetTitleColor.bind(C));
  lua_register(L, 'TimerDialogSetTimeColor', TimerDialogSetTimeColor.bind(C));
  lua_register(L, 'TimerDialogSetSpeed', TimerDialogSetSpeed.bind(C));
  lua_register(L, 'TimerDialogDisplay', TimerDialogDisplay.bind(C));
  lua_register(L, 'IsTimerDialogDisplayed', IsTimerDialogDisplayed.bind(C));
  lua_register(L, 'TimerDialogSetRealTimeRemaining', TimerDialogSetRealTimeRemaining.bind(C));
  lua_register(L, 'CreateLeaderboard', CreateLeaderboard.bind(C));
  lua_register(L, 'DestroyLeaderboard', DestroyLeaderboard.bind(C));
  lua_register(L, 'LeaderboardDisplay', LeaderboardDisplay.bind(C));
  lua_register(L, 'IsLeaderboardDisplayed', IsLeaderboardDisplayed.bind(C));
  lua_register(L, 'LeaderboardGetItemCount', LeaderboardGetItemCount.bind(C));
  lua_register(L, 'LeaderboardSetSizeByItemCount', LeaderboardSetSizeByItemCount.bind(C));
  lua_register(L, 'LeaderboardAddItem', LeaderboardAddItem.bind(C));
  lua_register(L, 'LeaderboardRemoveItem', LeaderboardRemoveItem.bind(C));
  lua_register(L, 'LeaderboardRemovePlayerItem', LeaderboardRemovePlayerItem.bind(C));
  lua_register(L, 'LeaderboardClear', LeaderboardClear.bind(C));
  lua_register(L, 'LeaderboardSortItemsByValue', LeaderboardSortItemsByValue.bind(C));
  lua_register(L, 'LeaderboardSortItemsByPlayer', LeaderboardSortItemsByPlayer.bind(C));
  lua_register(L, 'LeaderboardSortItemsByLabel', LeaderboardSortItemsByLabel.bind(C));
  lua_register(L, 'LeaderboardHasPlayerItem', LeaderboardHasPlayerItem.bind(C));
  lua_register(L, 'LeaderboardGetPlayerIndex', LeaderboardGetPlayerIndex.bind(C));
  lua_register(L, 'LeaderboardSetLabel', LeaderboardSetLabel.bind(C));
  lua_register(L, 'LeaderboardGetLabelText', LeaderboardGetLabelText.bind(C));
  lua_register(L, 'PlayerSetLeaderboard', PlayerSetLeaderboard.bind(C));
  lua_register(L, 'PlayerGetLeaderboard', PlayerGetLeaderboard.bind(C));
  lua_register(L, 'LeaderboardSetLabelColor', LeaderboardSetLabelColor.bind(C));
  lua_register(L, 'LeaderboardSetValueColor', LeaderboardSetValueColor.bind(C));
  lua_register(L, 'LeaderboardSetStyle', LeaderboardSetStyle.bind(C));
  lua_register(L, 'LeaderboardSetItemValue', LeaderboardSetItemValue.bind(C));
  lua_register(L, 'LeaderboardSetItemLabel', LeaderboardSetItemLabel.bind(C));
  lua_register(L, 'LeaderboardSetItemStyle', LeaderboardSetItemStyle.bind(C));
  lua_register(L, 'LeaderboardSetItemLabelColor', LeaderboardSetItemLabelColor.bind(C));
  lua_register(L, 'LeaderboardSetItemValueColor', LeaderboardSetItemValueColor.bind(C));
  lua_register(L, 'CreateMultiboard', CreateMultiboard.bind(C));
  lua_register(L, 'DestroyMultiboard', DestroyMultiboard.bind(C));
  lua_register(L, 'MultiboardDisplay', MultiboardDisplay.bind(C));
  lua_register(L, 'IsMultiboardDisplayed', IsMultiboardDisplayed.bind(C));
  lua_register(L, 'MultiboardMinimize', MultiboardMinimize.bind(C));
  lua_register(L, 'IsMultiboardMinimized', IsMultiboardMinimized.bind(C));
  lua_register(L, 'MultiboardClear', MultiboardClear.bind(C));
  lua_register(L, 'MultiboardSetTitleText', MultiboardSetTitleText.bind(C));
  lua_register(L, 'MultiboardGetTitleText', MultiboardGetTitleText.bind(C));
  lua_register(L, 'MultiboardSetTitleTextColor', MultiboardSetTitleTextColor.bind(C));
  lua_register(L, 'MultiboardGetRowCount', MultiboardGetRowCount.bind(C));
  lua_register(L, 'MultiboardGetColumnCount', MultiboardGetColumnCount.bind(C));
  lua_register(L, 'MultiboardSetColumnCount', MultiboardSetColumnCount.bind(C));
  lua_register(L, 'MultiboardSetRowCount', MultiboardSetRowCount.bind(C));
  lua_register(L, 'MultiboardSetItemsStyle', MultiboardSetItemsStyle.bind(C));
  lua_register(L, 'MultiboardSetItemsValue', MultiboardSetItemsValue.bind(C));
  lua_register(L, 'MultiboardSetItemsValueColor', MultiboardSetItemsValueColor.bind(C));
  lua_register(L, 'MultiboardSetItemsWidth', MultiboardSetItemsWidth.bind(C));
  lua_register(L, 'MultiboardSetItemsIcon', MultiboardSetItemsIcon.bind(C));
  lua_register(L, 'MultiboardGetItem', MultiboardGetItem.bind(C));
  lua_register(L, 'MultiboardReleaseItem', MultiboardReleaseItem.bind(C));
  lua_register(L, 'MultiboardSetItemStyle', MultiboardSetItemStyle.bind(C));
  lua_register(L, 'MultiboardSetItemValue', MultiboardSetItemValue.bind(C));
  lua_register(L, 'MultiboardSetItemValueColor', MultiboardSetItemValueColor.bind(C));
  lua_register(L, 'MultiboardSetItemWidth', MultiboardSetItemWidth.bind(C));
  lua_register(L, 'MultiboardSetItemIcon', MultiboardSetItemIcon.bind(C));
  lua_register(L, 'MultiboardSuppressDisplay', MultiboardSuppressDisplay.bind(C));
  lua_register(L, 'SetCameraPosition', SetCameraPosition.bind(C));
  lua_register(L, 'SetCameraQuickPosition', SetCameraQuickPosition.bind(C));
  lua_register(L, 'SetCameraBounds', SetCameraBounds.bind(C));
  lua_register(L, 'StopCamera', StopCamera.bind(C));
  lua_register(L, 'ResetToGameCamera', ResetToGameCamera.bind(C));
  lua_register(L, 'PanCameraTo', PanCameraTo.bind(C));
  lua_register(L, 'PanCameraToTimed', PanCameraToTimed.bind(C));
  lua_register(L, 'PanCameraToWithZ', PanCameraToWithZ.bind(C));
  lua_register(L, 'PanCameraToTimedWithZ', PanCameraToTimedWithZ.bind(C));
  lua_register(L, 'SetCinematicCamera', SetCinematicCamera.bind(C));
  lua_register(L, 'SetCameraRotateMode', SetCameraRotateMode.bind(C));
  lua_register(L, 'SetCameraField', SetCameraField.bind(C));
  lua_register(L, 'AdjustCameraField', AdjustCameraField.bind(C));
  lua_register(L, 'SetCameraTargetController', SetCameraTargetController.bind(C));
  lua_register(L, 'SetCameraOrientController', SetCameraOrientController.bind(C));
  lua_register(L, 'CreateCameraSetup', CreateCameraSetup.bind(C));
  lua_register(L, 'CameraSetupSetField', CameraSetupSetField.bind(C));
  lua_register(L, 'CameraSetupGetField', CameraSetupGetField.bind(C));
  lua_register(L, 'CameraSetupSetDestPosition', CameraSetupSetDestPosition.bind(C));
  lua_register(L, 'CameraSetupGetDestPositionLoc', CameraSetupGetDestPositionLoc.bind(C));
  lua_register(L, 'CameraSetupGetDestPositionX', CameraSetupGetDestPositionX.bind(C));
  lua_register(L, 'CameraSetupGetDestPositionY', CameraSetupGetDestPositionY.bind(C));
  lua_register(L, 'CameraSetupApply', CameraSetupApply.bind(C));
  lua_register(L, 'CameraSetupApplyWithZ', CameraSetupApplyWithZ.bind(C));
  lua_register(L, 'CameraSetupApplyForceDuration', CameraSetupApplyForceDuration.bind(C));
  lua_register(L, 'CameraSetupApplyForceDurationWithZ', CameraSetupApplyForceDurationWithZ.bind(C));
  lua_register(L, 'CameraSetTargetNoise', CameraSetTargetNoise.bind(C));
  lua_register(L, 'CameraSetSourceNoise', CameraSetSourceNoise.bind(C));
  lua_register(L, 'CameraSetTargetNoiseEx', CameraSetTargetNoiseEx.bind(C));
  lua_register(L, 'CameraSetSourceNoiseEx', CameraSetSourceNoiseEx.bind(C));
  lua_register(L, 'CameraSetSmoothingFactor', CameraSetSmoothingFactor.bind(C));
  lua_register(L, 'SetCineFilterTexture', SetCineFilterTexture.bind(C));
  lua_register(L, 'SetCineFilterBlendMode', SetCineFilterBlendMode.bind(C));
  lua_register(L, 'SetCineFilterTexMapFlags', SetCineFilterTexMapFlags.bind(C));
  lua_register(L, 'SetCineFilterStartUV', SetCineFilterStartUV.bind(C));
  lua_register(L, 'SetCineFilterEndUV', SetCineFilterEndUV.bind(C));
  lua_register(L, 'SetCineFilterStartColor', SetCineFilterStartColor.bind(C));
  lua_register(L, 'SetCineFilterEndColor', SetCineFilterEndColor.bind(C));
  lua_register(L, 'SetCineFilterDuration', SetCineFilterDuration.bind(C));
  lua_register(L, 'DisplayCineFilter', DisplayCineFilter.bind(C));
  lua_register(L, 'IsCineFilterDisplayed', IsCineFilterDisplayed.bind(C));
  lua_register(L, 'SetCinematicScene', SetCinematicScene.bind(C));
  lua_register(L, 'EndCinematicScene', EndCinematicScene.bind(C));
  lua_register(L, 'ForceCinematicSubtitles', ForceCinematicSubtitles.bind(C));
  lua_register(L, 'GetCameraMargin', GetCameraMargin.bind(C));
  lua_register(L, 'GetCameraBoundMinX', GetCameraBoundMinX.bind(C));
  lua_register(L, 'GetCameraBoundMinY', GetCameraBoundMinY.bind(C));
  lua_register(L, 'GetCameraBoundMaxX', GetCameraBoundMaxX.bind(C));
  lua_register(L, 'GetCameraBoundMaxY', GetCameraBoundMaxY.bind(C));
  lua_register(L, 'GetCameraField', GetCameraField.bind(C));
  lua_register(L, 'GetCameraTargetPositionX', GetCameraTargetPositionX.bind(C));
  lua_register(L, 'GetCameraTargetPositionY', GetCameraTargetPositionY.bind(C));
  lua_register(L, 'GetCameraTargetPositionZ', GetCameraTargetPositionZ.bind(C));
  lua_register(L, 'GetCameraTargetPositionLoc', GetCameraTargetPositionLoc.bind(C));
  lua_register(L, 'GetCameraEyePositionX', GetCameraEyePositionX.bind(C));
  lua_register(L, 'GetCameraEyePositionY', GetCameraEyePositionY.bind(C));
  lua_register(L, 'GetCameraEyePositionZ', GetCameraEyePositionZ.bind(C));
  lua_register(L, 'GetCameraEyePositionLoc', GetCameraEyePositionLoc.bind(C));
  lua_register(L, 'NewSoundEnvironment', NewSoundEnvironment.bind(C));
  lua_register(L, 'CreateSound', CreateSound.bind(C));
  lua_register(L, 'CreateSoundFilenameWithLabel', CreateSoundFilenameWithLabel.bind(C));
  lua_register(L, 'CreateSoundFromLabel', CreateSoundFromLabel.bind(C));
  lua_register(L, 'CreateMIDISound', CreateMIDISound.bind(C));
  lua_register(L, 'SetSoundParamsFromLabel', SetSoundParamsFromLabel.bind(C));
  lua_register(L, 'SetSoundDistanceCutoff', SetSoundDistanceCutoff.bind(C));
  lua_register(L, 'SetSoundChannel', SetSoundChannel.bind(C));
  lua_register(L, 'SetSoundVolume', SetSoundVolume.bind(C));
  lua_register(L, 'SetSoundPitch', SetSoundPitch.bind(C));
  lua_register(L, 'SetSoundPlayPosition', SetSoundPlayPosition.bind(C));
  lua_register(L, 'SetSoundDistances', SetSoundDistances.bind(C));
  lua_register(L, 'SetSoundConeAngles', SetSoundConeAngles.bind(C));
  lua_register(L, 'SetSoundConeOrientation', SetSoundConeOrientation.bind(C));
  lua_register(L, 'SetSoundPosition', SetSoundPosition.bind(C));
  lua_register(L, 'SetSoundVelocity', SetSoundVelocity.bind(C));
  lua_register(L, 'AttachSoundToUnit', AttachSoundToUnit.bind(C));
  lua_register(L, 'StartSound', StartSound.bind(C));
  lua_register(L, 'StopSound', StopSound.bind(C));
  lua_register(L, 'KillSoundWhenDone', KillSoundWhenDone.bind(C));
  lua_register(L, 'SetMapMusic', SetMapMusic.bind(C));
  lua_register(L, 'ClearMapMusic', ClearMapMusic.bind(C));
  lua_register(L, 'PlayMusic', PlayMusic.bind(C));
  lua_register(L, 'PlayMusicEx', PlayMusicEx.bind(C));
  lua_register(L, 'StopMusic', StopMusic.bind(C));
  lua_register(L, 'ResumeMusic', ResumeMusic.bind(C));
  lua_register(L, 'PlayThematicMusic', PlayThematicMusic.bind(C));
  lua_register(L, 'PlayThematicMusicEx', PlayThematicMusicEx.bind(C));
  lua_register(L, 'EndThematicMusic', EndThematicMusic.bind(C));
  lua_register(L, 'SetMusicVolume', SetMusicVolume.bind(C));
  lua_register(L, 'SetMusicPlayPosition', SetMusicPlayPosition.bind(C));
  lua_register(L, 'SetThematicMusicPlayPosition', SetThematicMusicPlayPosition.bind(C));
  lua_register(L, 'SetSoundDuration', SetSoundDuration.bind(C));
  lua_register(L, 'GetSoundDuration', GetSoundDuration.bind(C));
  lua_register(L, 'GetSoundFileDuration', GetSoundFileDuration.bind(C));
  lua_register(L, 'VolumeGroupSetVolume', VolumeGroupSetVolume.bind(C));
  lua_register(L, 'VolumeGroupReset', VolumeGroupReset.bind(C));
  lua_register(L, 'GetSoundIsPlaying', GetSoundIsPlaying.bind(C));
  lua_register(L, 'GetSoundIsLoading', GetSoundIsLoading.bind(C));
  lua_register(L, 'RegisterStackedSound', RegisterStackedSound.bind(C));
  lua_register(L, 'UnregisterStackedSound', UnregisterStackedSound.bind(C));
  lua_register(L, 'AddWeatherEffect', AddWeatherEffect.bind(C));
  lua_register(L, 'RemoveWeatherEffect', RemoveWeatherEffect.bind(C));
  lua_register(L, 'EnableWeatherEffect', EnableWeatherEffect.bind(C));
  lua_register(L, 'TerrainDeformCrater', TerrainDeformCrater.bind(C));
  lua_register(L, 'TerrainDeformRipple', TerrainDeformRipple.bind(C));
  lua_register(L, 'TerrainDeformWave', TerrainDeformWave.bind(C));
  lua_register(L, 'TerrainDeformRandom', TerrainDeformRandom.bind(C));
  lua_register(L, 'TerrainDeformStop', TerrainDeformStop.bind(C));
  lua_register(L, 'TerrainDeformStopAll', TerrainDeformStopAll.bind(C));
  lua_register(L, 'AddSpecialEffect', AddSpecialEffect.bind(C));
  lua_register(L, 'AddSpecialEffectLoc', AddSpecialEffectLoc.bind(C));
  lua_register(L, 'AddSpecialEffectTarget', AddSpecialEffectTarget.bind(C));
  lua_register(L, 'DestroyEffect', DestroyEffect.bind(C));
  lua_register(L, 'AddSpellEffect', AddSpellEffect.bind(C));
  lua_register(L, 'AddSpellEffectLoc', AddSpellEffectLoc.bind(C));
  lua_register(L, 'AddSpellEffectById', AddSpellEffectById.bind(C));
  lua_register(L, 'AddSpellEffectByIdLoc', AddSpellEffectByIdLoc.bind(C));
  lua_register(L, 'AddSpellEffectTarget', AddSpellEffectTarget.bind(C));
  lua_register(L, 'AddSpellEffectTargetById', AddSpellEffectTargetById.bind(C));
  lua_register(L, 'AddLightning', AddLightning.bind(C));
  lua_register(L, 'AddLightningEx', AddLightningEx.bind(C));
  lua_register(L, 'DestroyLightning', DestroyLightning.bind(C));
  lua_register(L, 'MoveLightning', MoveLightning.bind(C));
  lua_register(L, 'MoveLightningEx', MoveLightningEx.bind(C));
  lua_register(L, 'GetLightningColorA', GetLightningColorA.bind(C));
  lua_register(L, 'GetLightningColorR', GetLightningColorR.bind(C));
  lua_register(L, 'GetLightningColorG', GetLightningColorG.bind(C));
  lua_register(L, 'GetLightningColorB', GetLightningColorB.bind(C));
  lua_register(L, 'SetLightningColor', SetLightningColor.bind(C));
  lua_register(L, 'GetAbilityEffect', GetAbilityEffect.bind(C));
  lua_register(L, 'GetAbilityEffectById', GetAbilityEffectById.bind(C));
  lua_register(L, 'GetAbilitySound', GetAbilitySound.bind(C));
  lua_register(L, 'GetAbilitySoundById', GetAbilitySoundById.bind(C));
  lua_register(L, 'GetTerrainCliffLevel', GetTerrainCliffLevel.bind(C));
  lua_register(L, 'SetWaterBaseColor', SetWaterBaseColor.bind(C));
  lua_register(L, 'SetWaterDeforms', SetWaterDeforms.bind(C));
  lua_register(L, 'GetTerrainType', GetTerrainType.bind(C));
  lua_register(L, 'GetTerrainVariance', GetTerrainVariance.bind(C));
  lua_register(L, 'SetTerrainType', SetTerrainType.bind(C));
  lua_register(L, 'IsTerrainPathable', IsTerrainPathable.bind(C));
  lua_register(L, 'SetTerrainPathable', SetTerrainPathable.bind(C));
  lua_register(L, 'CreateImage', CreateImage.bind(C));
  lua_register(L, 'DestroyImage', DestroyImage.bind(C));
  lua_register(L, 'ShowImage', ShowImage.bind(C));
  lua_register(L, 'SetImageConstantHeight', SetImageConstantHeight.bind(C));
  lua_register(L, 'SetImagePosition', SetImagePosition.bind(C));
  lua_register(L, 'SetImageColor', SetImageColor.bind(C));
  lua_register(L, 'SetImageRender', SetImageRender.bind(C));
  lua_register(L, 'SetImageRenderAlways', SetImageRenderAlways.bind(C));
  lua_register(L, 'SetImageAboveWater', SetImageAboveWater.bind(C));
  lua_register(L, 'SetImageType', SetImageType.bind(C));
  lua_register(L, 'CreateUbersplat', CreateUbersplat.bind(C));
  lua_register(L, 'DestroyUbersplat', DestroyUbersplat.bind(C));
  lua_register(L, 'ResetUbersplat', ResetUbersplat.bind(C));
  lua_register(L, 'FinishUbersplat', FinishUbersplat.bind(C));
  lua_register(L, 'ShowUbersplat', ShowUbersplat.bind(C));
  lua_register(L, 'SetUbersplatRender', SetUbersplatRender.bind(C));
  lua_register(L, 'SetUbersplatRenderAlways', SetUbersplatRenderAlways.bind(C));
  lua_register(L, 'SetBlight', SetBlight.bind(C));
  lua_register(L, 'SetBlightRect', SetBlightRect.bind(C));
  lua_register(L, 'SetBlightPoint', SetBlightPoint.bind(C));
  lua_register(L, 'SetBlightLoc', SetBlightLoc.bind(C));
  lua_register(L, 'CreateBlightedGoldmine', CreateBlightedGoldmine.bind(C));
  lua_register(L, 'IsPointBlighted', IsPointBlighted.bind(C));
  lua_register(L, 'SetDoodadAnimation', SetDoodadAnimation.bind(C));
  lua_register(L, 'SetDoodadAnimationRect', SetDoodadAnimationRect.bind(C));
  lua_register(L, 'StartMeleeAI', StartMeleeAI.bind(C));
  lua_register(L, 'StartCampaignAI', StartCampaignAI.bind(C));
  lua_register(L, 'CommandAI', CommandAI.bind(C));
  lua_register(L, 'PauseCompAI', PauseCompAI.bind(C));
  lua_register(L, 'GetAIDifficulty', GetAIDifficulty.bind(C));
  lua_register(L, 'RemoveGuardPosition', RemoveGuardPosition.bind(C));
  lua_register(L, 'RecycleGuardPosition', RecycleGuardPosition.bind(C));
  lua_register(L, 'RemoveAllGuardPositions', RemoveAllGuardPositions.bind(C));
  lua_register(L, 'Cheat', Cheat.bind(C));
  lua_register(L, 'IsNoVictoryCheat', IsNoVictoryCheat.bind(C));
  lua_register(L, 'IsNoDefeatCheat', IsNoDefeatCheat.bind(C));
  lua_register(L, 'Preload', Preload.bind(C));
  lua_register(L, 'PreloadEnd', PreloadEnd.bind(C));
  lua_register(L, 'PreloadStart', PreloadStart.bind(C));
  lua_register(L, 'PreloadRefresh', PreloadRefresh.bind(C));
  lua_register(L, 'PreloadEndEx', PreloadEndEx.bind(C));
  lua_register(L, 'PreloadGenClear', PreloadGenClear.bind(C));
  lua_register(L, 'PreloadGenStart', PreloadGenStart.bind(C));
  lua_register(L, 'PreloadGenEnd', PreloadGenEnd.bind(C));
  lua_register(L, 'Preloader', Preloader.bind(C));
  lua_register(L, 'AutomationTestStart', AutomationTestStart.bind(C));
  lua_register(L, 'AutomationTestEnd', AutomationTestEnd.bind(C));
  lua_register(L, 'BlzGetTriggerPlayerMouseX', BlzGetTriggerPlayerMouseX.bind(C));
  lua_register(L, 'BlzGetTriggerPlayerMouseY', BlzGetTriggerPlayerMouseY.bind(C));
  lua_register(L, 'BlzGetTriggerPlayerMousePosition', BlzGetTriggerPlayerMousePosition.bind(C));
  lua_register(L, 'BlzGetTriggerPlayerMouseButton', BlzGetTriggerPlayerMouseButton.bind(C));
  lua_register(L, 'BlzSetAbilityTooltip', BlzSetAbilityTooltip.bind(C));
  lua_register(L, 'BlzSetAbilityActivatedTooltip', BlzSetAbilityActivatedTooltip.bind(C));
  lua_register(L, 'BlzSetAbilityExtendedTooltip', BlzSetAbilityExtendedTooltip.bind(C));
  lua_register(L, 'BlzSetAbilityActivatedExtendedTooltip', BlzSetAbilityActivatedExtendedTooltip.bind(C));
  lua_register(L, 'BlzSetAbilityResearchTooltip', BlzSetAbilityResearchTooltip.bind(C));
  lua_register(L, 'BlzSetAbilityResearchExtendedTooltip', BlzSetAbilityResearchExtendedTooltip.bind(C));
  lua_register(L, 'BlzGetAbilityTooltip', BlzGetAbilityTooltip.bind(C));
  lua_register(L, 'BlzGetAbilityActivatedTooltip', BlzGetAbilityActivatedTooltip.bind(C));
  lua_register(L, 'BlzGetAbilityExtendedTooltip', BlzGetAbilityExtendedTooltip.bind(C));
  lua_register(L, 'BlzGetAbilityActivatedExtendedTooltip', BlzGetAbilityActivatedExtendedTooltip.bind(C));
  lua_register(L, 'BlzGetAbilityResearchTooltip', BlzGetAbilityResearchTooltip.bind(C));
  lua_register(L, 'BlzGetAbilityResearchExtendedTooltip', BlzGetAbilityResearchExtendedTooltip.bind(C));
  lua_register(L, 'BlzSetAbilityIcon', BlzSetAbilityIcon.bind(C));
  lua_register(L, 'BlzGetAbilityIcon', BlzGetAbilityIcon.bind(C));
  lua_register(L, 'BlzSetAbilityActivatedIcon', BlzSetAbilityActivatedIcon.bind(C));
  lua_register(L, 'BlzGetAbilityActivatedIcon', BlzGetAbilityActivatedIcon.bind(C));
  lua_register(L, 'BlzGetAbilityPosX', BlzGetAbilityPosX.bind(C));
  lua_register(L, 'BlzGetAbilityPosY', BlzGetAbilityPosY.bind(C));
  lua_register(L, 'BlzSetAbilityPosX', BlzSetAbilityPosX.bind(C));
  lua_register(L, 'BlzSetAbilityPosY', BlzSetAbilityPosY.bind(C));
  lua_register(L, 'BlzGetAbilityActivatedPosX', BlzGetAbilityActivatedPosX.bind(C));
  lua_register(L, 'BlzGetAbilityActivatedPosY', BlzGetAbilityActivatedPosY.bind(C));
  lua_register(L, 'BlzSetAbilityActivatedPosX', BlzSetAbilityActivatedPosX.bind(C));
  lua_register(L, 'BlzSetAbilityActivatedPosY', BlzSetAbilityActivatedPosY.bind(C));
  lua_register(L, 'BlzGetUnitMaxHP', BlzGetUnitMaxHP.bind(C));
  lua_register(L, 'BlzSetUnitMaxHP', BlzSetUnitMaxHP.bind(C));
  lua_register(L, 'BlzGetUnitMaxMana', BlzGetUnitMaxMana.bind(C));
  lua_register(L, 'BlzSetUnitMaxMana', BlzSetUnitMaxMana.bind(C));
  lua_register(L, 'BlzDeleteHeroAbility', BlzDeleteHeroAbility.bind(C));
  lua_register(L, 'BlzSetItemName', BlzSetItemName.bind(C));
  lua_register(L, 'BlzSetItemDescription', BlzSetItemDescription.bind(C));
  lua_register(L, 'BlzGetItemDescription', BlzGetItemDescription.bind(C));
  lua_register(L, 'BlzSetItemTooltip', BlzSetItemTooltip.bind(C));
  lua_register(L, 'BlzGetItemTooltip', BlzGetItemTooltip.bind(C));
  lua_register(L, 'BlzSetItemExtendedTooltip', BlzSetItemExtendedTooltip.bind(C));
  lua_register(L, 'BlzGetItemExtendedTooltip', BlzGetItemExtendedTooltip.bind(C));
  lua_register(L, 'BlzSetItemIconPath', BlzSetItemIconPath.bind(C));
  lua_register(L, 'BlzGetItemIconPath', BlzGetItemIconPath.bind(C));
  lua_register(L, 'BlzSetUnitName', BlzSetUnitName.bind(C));
  lua_register(L, 'BlzSetHeroProperName', BlzSetHeroProperName.bind(C));
  lua_register(L, 'BlzGetUnitBaseDamage', BlzGetUnitBaseDamage.bind(C));
  lua_register(L, 'BlzSetUnitBaseDamage', BlzSetUnitBaseDamage.bind(C));
  lua_register(L, 'BlzGetUnitDiceNumber', BlzGetUnitDiceNumber.bind(C));
  lua_register(L, 'BlzSetUnitDiceNumber', BlzSetUnitDiceNumber.bind(C));
  lua_register(L, 'BlzGetUnitDiceSides', BlzGetUnitDiceSides.bind(C));
  lua_register(L, 'BlzSetUnitDiceSides', BlzSetUnitDiceSides.bind(C));
  lua_register(L, 'BlzGetUnitAttackCooldown', BlzGetUnitAttackCooldown.bind(C));
  lua_register(L, 'BlzSetUnitAttackCooldown', BlzSetUnitAttackCooldown.bind(C));
  lua_register(L, 'BlzSetSpecialEffectColorByPlayer', BlzSetSpecialEffectColorByPlayer.bind(C));
  lua_register(L, 'BlzSetSpecialEffectColor', BlzSetSpecialEffectColor.bind(C));
  lua_register(L, 'BlzSetSpecialEffectAlpha', BlzSetSpecialEffectAlpha.bind(C));
  lua_register(L, 'BlzSetSpecialEffectScale', BlzSetSpecialEffectScale.bind(C));
  lua_register(L, 'BlzSetSpecialEffectPosition', BlzSetSpecialEffectPosition.bind(C));
  lua_register(L, 'BlzSetSpecialEffectHeight', BlzSetSpecialEffectHeight.bind(C));
  lua_register(L, 'BlzSetSpecialEffectTimeScale', BlzSetSpecialEffectTimeScale.bind(C));
  lua_register(L, 'BlzSetSpecialEffectTime', BlzSetSpecialEffectTime.bind(C));
  lua_register(L, 'BlzSetSpecialEffectOrientation', BlzSetSpecialEffectOrientation.bind(C));
  lua_register(L, 'BlzSetSpecialEffectYaw', BlzSetSpecialEffectYaw.bind(C));
  lua_register(L, 'BlzSetSpecialEffectPitch', BlzSetSpecialEffectPitch.bind(C));
  lua_register(L, 'BlzSetSpecialEffectRoll', BlzSetSpecialEffectRoll.bind(C));
  lua_register(L, 'BlzSetSpecialEffectX', BlzSetSpecialEffectX.bind(C));
  lua_register(L, 'BlzSetSpecialEffectY', BlzSetSpecialEffectY.bind(C));
  lua_register(L, 'BlzSetSpecialEffectZ', BlzSetSpecialEffectZ.bind(C));
  lua_register(L, 'BlzSetSpecialEffectPositionLoc', BlzSetSpecialEffectPositionLoc.bind(C));
  lua_register(L, 'BlzGetLocalSpecialEffectX', BlzGetLocalSpecialEffectX.bind(C));
  lua_register(L, 'BlzGetLocalSpecialEffectY', BlzGetLocalSpecialEffectY.bind(C));
  lua_register(L, 'BlzGetLocalSpecialEffectZ', BlzGetLocalSpecialEffectZ.bind(C));
  lua_register(L, 'BlzGetUnitArmor', BlzGetUnitArmor.bind(C));
  lua_register(L, 'BlzSetUnitArmor', BlzSetUnitArmor.bind(C));
  lua_register(L, 'BlzUnitHideAbility', BlzUnitHideAbility.bind(C));
  lua_register(L, 'BlzUnitDisableAbility', BlzUnitDisableAbility.bind(C));
  lua_register(L, 'BlzUnitCancelTimedLife', BlzUnitCancelTimedLife.bind(C));
  lua_register(L, 'BlzIsUnitSelectable', BlzIsUnitSelectable.bind(C));
  lua_register(L, 'BlzIsUnitInvulnerable', BlzIsUnitInvulnerable.bind(C));
  lua_register(L, 'BlzUnitInterruptAttack', BlzUnitInterruptAttack.bind(C));
  lua_register(L, 'BlzGetUnitCollisionSize', BlzGetUnitCollisionSize.bind(C));
  lua_register(L, 'BlzGetAbilityManaCost', BlzGetAbilityManaCost.bind(C));
  lua_register(L, 'BlzGetAbilityCooldown', BlzGetAbilityCooldown.bind(C));
  lua_register(L, 'BlzSetUnitAbilityCooldown', BlzSetUnitAbilityCooldown.bind(C));
  lua_register(L, 'BlzGetUnitAbilityCooldown', BlzGetUnitAbilityCooldown.bind(C));
  lua_register(L, 'BlzGetUnitAbilityCooldownRemaining', BlzGetUnitAbilityCooldownRemaining.bind(C));
  lua_register(L, 'BlzEndUnitAbilityCooldown', BlzEndUnitAbilityCooldown.bind(C));
  lua_register(L, 'BlzGetUnitAbilityManaCost', BlzGetUnitAbilityManaCost.bind(C));
  lua_register(L, 'BlzSetUnitAbilityManaCost', BlzSetUnitAbilityManaCost.bind(C));
  lua_register(L, 'BlzGetLocalUnitZ', BlzGetLocalUnitZ.bind(C));
  lua_register(L, 'BlzDecPlayerTechResearched', BlzDecPlayerTechResearched.bind(C));
  lua_register(L, 'BlzSetEventDamage', BlzSetEventDamage.bind(C));
}
