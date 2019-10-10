import JassPlayerColor from './types/playercolor';
import JassRace from './types/race';
import JassPlayerGameResult from './types/playergameresult';
import JassAllianceType from './types/alliancetype';
import JassVersion from './types/version';
import JassAttackType from './types/attacktype';
import JassDamageType from './types/damagetype';
import JassWeaponType from './types/weapontype';
import JassPathingType from './types/pathingtype';
import JassMouseButtonType from './types/mousebuttontype';
import JassRacePreference from './types/racepreference';
import JassMapControl from './types/mapcontrol';
import JassGameType from './types/gametype';
import JassMapFlag from './types/mapflag';
import JassPlacement from './types/placement';
import JassStartLocPrio from './types/startlocprio';
import JassMapDensity from './types/mapdensity';
import JassGameDifficulty from './types/gamedifficulty';
import JassGameSpeed from './types/gamespeed';
import JassPlayerSlotState from './types/playerslotstate';
import JassVolumeGroup from './types/volumegroup';
import JassIGameState from './types/igamestate';
import JassFGameState from './types/fgamestate';
import JassPlayerState from './types/playerstate';
import JassUnitState from './types/unitstate';
import JassAiDifficulty from './types/aidifficulty';
import JassPlayerScore from './types/playerscore';
import JassGameEvent from './types/gameevent';
import JassPlayerEvent from './types/playerevent';
import JassPlayerUnitEvent from './types/playerunitevent';
import JassUnitEvent from './types/unitevent';
import JassWidgetEvent from './types/widgetevent';
import JassDialogEvent from './types/dialogevent';
import JassLimitOp from './types/limitop';
import JassUnitType from './types/unittype';
import JassItemType from './types/itemtype';
import JassCameraField from './types/camerafield';
import JassBlendMode from './types/blendmode';
import JassRarityControl from './types/raritycontrol';
import JassTexMapFlags from './types/texmapflags';
import JassFogState from './types/fogstate';
import JassEffectType from './types/effecttype';
import JassSoundType from './types/soundtype';

/**
 * @param {LuaContext} C
 * @return {Object}
 */
export default function constantHandles(C) {
  let handles = {
    playerColors: {},
    races: {},
    playerGameResults: {},
    allianceTypes: {},
    versions: {},
    attackTypes: {},
    damageTypes: {},
    weaponTypes: {},
    pathingTypes: {},
    mouseButtonTypes: {},
    racePrefs: {},
    mapControls: {},
    gameTypes: {},
    mapFlags: {},
    placements: {},
    startLocPrios: {},
    mapDensities: {},
    gameDifficulties: {},
    gameSpeeds: {},
    playerSlotStates: {},
    volumeGroups: {},
    gameStates: {},
    playerStates: {},
    unitStates: {},
    aiDifficulties: {},
    playerScores: {},
    events: {},
    limitOps: {},
    unitTypes: {},
    itemTypes: {},
    cameraFields: {},
    blendModes: {},
    rarityControls: {},
    texMapFlags: {},
    fogStates: {},
    effectTypes: {},
    soundTypes: {},
  };

  for (let i = 0; i < 24; i++) {
    handles.playerColors[i] = new JassPlayerColor(i);
  }

  for (let i = 0; i < 8; i++) {
    handles.races[i] = new JassRace(i);
  }

  for (let i = 0; i < 4; i++) {
    handles.playerGameResults[i] = new JassPlayerGameResult(i);
  }

  for (let i = 0; i < 10; i++) {
    handles.allianceTypes[i] = new JassAllianceType(i);
  }

  for (let i = 0; i < 2; i++) {
    handles.versions[i] = new JassVersion(i);
  }

  for (let i = 0; i < 7; i++) {
    handles.attackTypes[i] = new JassAttackType(i);
  }

  for (let i = 0; i < 27; i++) {
    // Note: 1, 2, 3, 6, and 7 not exposed in common.j
    handles.damageTypes[i] = new JassDamageType(i);
  }

  for (let i = 0; i < 24; i++) {
    handles.weaponTypes[i] = new JassWeaponType(i);
  }

  for (let i = 0; i < 8; i++) {
    handles.pathingTypes[i] = new JassPathingType(i);
  }

  for (let i = 0; i < 4; i++) {
    handles.mouseButtonTypes[i] = new JassMouseButtonType(i);
  }

  for (let i = 0; i < 8; i++) {
    let p = Math.pow(2, i);

    handles.racePrefs[p] = new JassRacePreference(p);
  }

  for (let i = 0; i < 6; i++) {
    handles.mapControls[i] = new JassMapControl(i);
  }

  for (let i = 0; i < 8; i++) {
    let p = Math.pow(2, i);

    handles.gameTypes[p] = new JassGameType(p);
  }

  for (let i = 0; i < 20; i++) {
    let p = Math.pow(2, i);

    handles.mapFlags[p] = new JassMapFlag(p);
  }

  for (let i = 0; i < 4; i++) {
    handles.placements[i] = new JassPlacement(i);
  }

  for (let i = 0; i < 3; i++) {
    handles.startLocPrios[i] = new JassStartLocPrio(i);
  }

  for (let i = 0; i < 4; i++) {
    handles.mapDensities[i] = new JassMapDensity(i);
  }

  for (let i = 0; i < 4; i++) {
    handles.gameDifficulties[i] = new JassGameDifficulty(i);
  }

  for (let i = 0; i < 5; i++) {
    handles.gameSpeeds[i] = new JassGameSpeed(i);
  }

  for (let i = 0; i < 3; i++) {
    handles.playerSlotStates[i] = new JassPlayerSlotState(i);
  }

  for (let i = 0; i < 8; i++) {
    handles.volumeGroups[i] = new JassVolumeGroup(i);
  }

  for (let i = 0; i < 2; i++) {
    handles.gameStates[i] = new JassIGameState(i);
  }

  for (let i = 2; i < 3; i++) {
    handles.gameStates[i] = new JassFGameState(i);
  }

  for (let i = 0; i < 26; i++) {
    // Note: 17-24 not exposed in common.j
    handles.playerStates[i] = new JassPlayerState(i);
  }

  for (let i = 0; i < 4; i++) {
    handles.unitStates[i] = new JassUnitState(i);
  }

  for (let i = 0; i < 3; i++) {
    handles.aiDifficulties[i] = new JassAiDifficulty(i);
  }

  for (let i = 0; i < 25; i++) {
    handles.playerScores[i] = new JassPlayerScore(i);
  }

  for (let i = 0; i < 11; i++) {
    handles.events[i] = new JassGameEvent(i);
  }

  for (let i = 11; i < 18; i++) {
    handles.events[i] = new JassPlayerEvent(i);
  }

  for (let i = 18; i < 52; i++) {
    handles.events[i] = new JassPlayerUnitEvent(i);
  }

  for (let i = 52; i < 89; i++) {
    handles.events[i] = new JassUnitEvent(i);
  }

  for (let i = 89; i < 90; i++) {
    handles.events[i] = new JassWidgetEvent(i);
  }

  for (let i = 90; i < 92; i++) {
    handles.events[i] = new JassDialogEvent(i);
  }

  for (let i = 256; i < 260; i++) {
    handles.events[i] = new JassGameEvent(i);
  }

  for (let i = 261; i < 269; i++) {
    handles.events[i] = new JassPlayerEvent(i);
  }

  for (let i = 269; i < 278; i++) {
    handles.events[i] = new JassPlayerUnitEvent(i);
  }

  for (let i = 286; i < 295; i++) {
    handles.events[i] = new JassUnitEvent(i);
  }

  for (let i = 0; i < 6; i++) {
    handles.limitOps[i] = new JassLimitOp(i);
  }

  for (let i = 0; i < 27; i++) {
    handles.unitTypes[i] = new JassUnitType(i);
  }

  for (let i = 0; i < 9; i++) {
    handles.itemTypes[i] = new JassItemType(i);
  }

  for (let i = 0; i < 7; i++) {
    handles.cameraFields[i] = new JassCameraField(i);
  }

  for (let i = 0; i < 6; i++) {
    handles.blendModes[i] = new JassBlendMode(i);
  }

  for (let i = 0; i < 1; i++) {
    handles.rarityControls[i] = new JassRarityControl(i);
  }

  for (let i = 0; i < 4; i++) {
    handles.texMapFlags[i] = new JassTexMapFlags(i);
  }

  for (let i = 0; i < 3; i++) {
    let p = Math.pow(2, i);

    handles.fogStates[p] = new JassFogState(p);
  }

  for (let i = 0; i < 7; i++) {
    handles.effectTypes[i] = new JassEffectType(i);
  }

  for (let i = 0; i < 2; i++) {
    handles.soundTypes[i] = new JassSoundType(i);
  }

  return handles;
}
