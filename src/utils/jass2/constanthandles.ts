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
import JassAnimType from './types/animtype';
import JassSubAnimType from './types/subanimtype';
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
import { JassEventId, JassGameState } from './types';

export interface ConstantHandles {
  playerColors: JassPlayerColor[];
  races: JassRace[];
  playerGameResults: JassPlayerGameResult[];
  allianceTypes: JassAllianceType[];
  versions: JassVersion[];
  attackTypes: JassAttackType[];
  damageTypes: JassDamageType[];
  weaponTypes: JassWeaponType[];
  pathingTypes: JassPathingType[];
  mouseButtonTypes: JassMouseButtonType[];
  animTypes: JassAnimType[];
  subAnimTypes: JassSubAnimType[];
  racePrefs: JassRacePreference[];
  mapControls: JassMapControl[];
  gameTypes: JassGameType[];
  mapFlags: JassMapFlag[];
  placements: JassPlacement[];
  startLocPrios: JassStartLocPrio[];
  mapDensities: JassMapDensity[];
  gameDifficulties: JassGameDifficulty[];
  gameSpeeds: JassGameSpeed[];
  playerSlotStates: JassPlayerSlotState[];
  volumeGroups: JassVolumeGroup[];
  gameStates: JassGameState[];
  playerStates: JassPlayerState[];
  unitStates: JassUnitState[];
  aiDifficulties: JassAiDifficulty[];
  playerScores: JassPlayerScore[];
  events: JassEventId[];
  limitOps: JassLimitOp[];
  unitTypes: JassUnitType[];
  itemTypes: JassItemType[];
  cameraFields: JassCameraField[];
  blendModes: JassBlendMode[];
  rarityControls: JassRarityControl[];
  texMapFlags: JassTexMapFlags[];
  fogStates: JassFogState[];
  effectTypes: JassEffectType[];
  soundTypes: JassSoundType[];
}

export default function constantHandles(): ConstantHandles {
  const playerColors = [];
  const races = [];
  const playerGameResults = [];
  const allianceTypes = [];
  const versions = [];
  const attackTypes = [];
  const damageTypes = [];
  const weaponTypes = [];
  const pathingTypes = [];
  const mouseButtonTypes = [];
  const animTypes = [];
  const subAnimTypes = [];
  const racePrefs = [];
  const mapControls = [];
  const gameTypes = [];
  const mapFlags = [];
  const placements = [];
  const startLocPrios = [];
  const mapDensities = [];
  const gameDifficulties = [];
  const gameSpeeds = [];
  const playerSlotStates = [];
  const volumeGroups = [];
  const gameStates = [];
  const playerStates = [];
  const unitStates = [];
  const aiDifficulties = [];
  const playerScores = [];
  const events = [];
  const limitOps = [];
  const unitTypes = [];
  const itemTypes = [];
  const cameraFields = [];
  const blendModes = [];
  const rarityControls = [];
  const texMapFlags = [];
  const fogStates = [];
  const effectTypes = [];
  const soundTypes = [];

  for (let i = 0; i < 24; i++) {
    playerColors[i] = new JassPlayerColor(i);
  }

  for (let i = 0; i < 8; i++) {
    races[i] = new JassRace(i);
  }

  for (let i = 0; i < 4; i++) {
    playerGameResults[i] = new JassPlayerGameResult(i);
  }

  for (let i = 0; i < 10; i++) {
    allianceTypes[i] = new JassAllianceType(i);
  }

  for (let i = 0; i < 2; i++) {
    versions[i] = new JassVersion(i);
  }

  for (let i = 0; i < 7; i++) {
    attackTypes[i] = new JassAttackType(i);
  }

  for (let i = 0; i < 27; i++) {
    // Note: 1, 2, 3, 6, and 7 not exposed in common.j
    damageTypes[i] = new JassDamageType(i);
  }

  for (let i = 0; i < 24; i++) {
    weaponTypes[i] = new JassWeaponType(i);
  }

  for (let i = 0; i < 8; i++) {
    pathingTypes[i] = new JassPathingType(i);
  }

  for (let i = 0; i < 4; i++) {
    mouseButtonTypes[i] = new JassMouseButtonType(i);
  }

  for (let i = 0; i < 11; i++) {
    animTypes[i] = new JassAnimType(i);
  }

  for (let i = 11; i < 63; i++) {
    subAnimTypes[i] = new JassSubAnimType(i);
  }

  for (let i = 0; i < 8; i++) {
    const p = Math.pow(2, i);

    racePrefs[p] = new JassRacePreference(p);
  }

  for (let i = 0; i < 6; i++) {
    mapControls[i] = new JassMapControl(i);
  }

  for (let i = 0; i < 8; i++) {
    const p = Math.pow(2, i);

    gameTypes[p] = new JassGameType(p);
  }

  for (let i = 0; i < 20; i++) {
    const p = Math.pow(2, i);

    mapFlags[p] = new JassMapFlag(p);
  }

  for (let i = 0; i < 4; i++) {
    placements[i] = new JassPlacement(i);
  }

  for (let i = 0; i < 3; i++) {
    startLocPrios[i] = new JassStartLocPrio(i);
  }

  for (let i = 0; i < 4; i++) {
    mapDensities[i] = new JassMapDensity(i);
  }

  for (let i = 0; i < 4; i++) {
    gameDifficulties[i] = new JassGameDifficulty(i);
  }

  for (let i = 0; i < 5; i++) {
    gameSpeeds[i] = new JassGameSpeed(i);
  }

  for (let i = 0; i < 3; i++) {
    playerSlotStates[i] = new JassPlayerSlotState(i);
  }

  for (let i = 0; i < 8; i++) {
    volumeGroups[i] = new JassVolumeGroup(i);
  }

  for (let i = 0; i < 2; i++) {
    gameStates[i] = new JassIGameState(i);
  }

  for (let i = 2; i < 3; i++) {
    gameStates[i] = new JassFGameState(i);
  }

  for (let i = 0; i < 26; i++) {
    // Note: 17-24 not exposed in common.j
    playerStates[i] = new JassPlayerState(i);
  }

  for (let i = 0; i < 4; i++) {
    unitStates[i] = new JassUnitState(i);
  }

  for (let i = 0; i < 3; i++) {
    aiDifficulties[i] = new JassAiDifficulty(i);
  }

  for (let i = 0; i < 25; i++) {
    playerScores[i] = new JassPlayerScore(i);
  }

  for (let i = 0; i < 11; i++) {
    events[i] = new JassGameEvent(i);
  }

  for (let i = 11; i < 18; i++) {
    events[i] = new JassPlayerEvent(i);
  }

  for (let i = 18; i < 52; i++) {
    events[i] = new JassPlayerUnitEvent(i);
  }

  for (let i = 52; i < 89; i++) {
    events[i] = new JassUnitEvent(i);
  }

  for (let i = 89; i < 90; i++) {
    events[i] = new JassWidgetEvent(i);
  }

  for (let i = 90; i < 92; i++) {
    events[i] = new JassDialogEvent(i);
  }

  for (let i = 256; i < 260; i++) {
    events[i] = new JassGameEvent(i);
  }

  for (let i = 261; i < 269; i++) {
    events[i] = new JassPlayerEvent(i);
  }

  for (let i = 269; i < 278; i++) {
    events[i] = new JassPlayerUnitEvent(i);
  }

  for (let i = 286; i < 295; i++) {
    events[i] = new JassUnitEvent(i);
  }

  for (let i = 0; i < 6; i++) {
    limitOps[i] = new JassLimitOp(i);
  }

  for (let i = 0; i < 27; i++) {
    unitTypes[i] = new JassUnitType(i);
  }

  for (let i = 0; i < 9; i++) {
    itemTypes[i] = new JassItemType(i);
  }

  for (let i = 0; i < 7; i++) {
    cameraFields[i] = new JassCameraField(i);
  }

  for (let i = 0; i < 6; i++) {
    blendModes[i] = new JassBlendMode(i);
  }

  for (let i = 0; i < 1; i++) {
    rarityControls[i] = new JassRarityControl(i);
  }

  for (let i = 0; i < 4; i++) {
    texMapFlags[i] = new JassTexMapFlags(i);
  }

  for (let i = 0; i < 3; i++) {
    const p = Math.pow(2, i);

    fogStates[p] = new JassFogState(p);
  }

  for (let i = 0; i < 7; i++) {
    effectTypes[i] = new JassEffectType(i);
  }

  for (let i = 0; i < 2; i++) {
    soundTypes[i] = new JassSoundType(i);
  }

  return {
    playerColors,
    races,
    playerGameResults,
    allianceTypes,
    versions,
    attackTypes,
    damageTypes,
    weaponTypes,
    pathingTypes,
    mouseButtonTypes,
    animTypes,
    subAnimTypes,
    racePrefs,
    mapControls,
    gameTypes,
    mapFlags,
    placements,
    startLocPrios,
    mapDensities,
    gameDifficulties,
    gameSpeeds,
    playerSlotStates,
    volumeGroups,
    gameStates,
    playerStates,
    unitStates,
    aiDifficulties,
    playerScores,
    events,
    limitOps,
    unitTypes,
    itemTypes,
    cameraFields,
    blendModes,
    rarityControls,
    texMapFlags,
    fogStates,
    effectTypes,
    soundTypes,
  };
}
