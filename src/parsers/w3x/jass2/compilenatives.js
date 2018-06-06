import {parse} from './jass';
import ast from './ast';

/**
 * @param {Native} native
 * @return {string}
 */
function compileJassNative(native) {
  let jass = '';

  if (native.isConstant) {
    jass += 'constant ';
  }

  jass += `native ${native.name} takes `;

  if (native.args.length) {
    jass += native.args.map((arg) => `${arg.type} ${arg.name}`).join(', ');
  } else {
    jass += 'nothing';
  }

  return jass + ` returns ${native.returnType}`;
}

/**
 * @param {Array<FunctionArgument>} args
 * @return {string}
 */
function compileJsArgs(args) {
  if (args.length) {
    return ['jassContext'].concat(args.map((arg) => `${arg.name}`)).join(', ');
  } else {
    return 'jassContext';
  }
}
let typeMapping = {
  'handle': 'JassHandle',
  'code': 'function()',
  'integer': 'number',
  'real': 'number',
  'boolean': 'boolean',
  'string': 'string',
  'agent': 'JassAgent',
  'event': 'JassEvent',
  'player': 'JassPlayer',
  'widget': 'JassWidget',
  'unit': 'JassUnit',
  'destructable': 'JassDestructable',
  'item': 'JassItem',
  'ability': 'JassAbility',
  'buff': 'JassBuff',
  'force': 'JassForce',
  'group': 'JassGroup',
  'trigger': 'JassTrigger',
  'triggercondition': 'function(): boolean',
  'triggeraction': 'function()',
  'timer': 'JassTimer',
  'location': 'JassLocation',
  'region': 'JassRegion',
  'rect': 'JassRect',
  'boolexpr': 'function(): boolean',
  'sound': 'JassSound',
  'conditionfunc': 'function(): boolean',
  'filterfunc': 'function(): boolean',
  'unitpool': 'JassUnitPool',
  'itempool': 'JassItemPool',
  'race': 'JassRace',
  'alliancetype': 'JassAllianceType',
  'racepreference': 'JassRacePreference',
  'gamestate': 'JassGameState',
  'igamestate': 'JassIGameState',
  'fgamestate': 'JassFGameState',
  'playerstate': 'JassPlayerState',
  'playerscore': 'JassPlayerScore',
  'playergameresult': 'JassPlayerGameResult',
  'unitstate': 'JassUnitState',
  'aidifficulty': 'JassAiDifficulty',
  'eventid': 'JassEventId',
  'gameevent': 'JassGameEvent',
  'playerevent': 'JassPlayerEvent',
  'playerunitevent': 'JassPlayerUnitEvent',
  'unitevent': 'JassUnitEvent',
  'limitop': 'JassLimitOp',
  'widgetevent': 'JassWidgetEvent',
  'dialogevent': 'JassDialogEvent',
  'unittype': 'JassUnitType',
  'gamespeed': 'JassGameSpeed',
  'gamedifficulty': 'JassGameDifficulty',
  'gametype': 'JassGameType',
  'mapflag': 'JassMapFlag',
  'mapvisibility': 'JassMapVisibility',
  'mapsetting': 'JassMapSetting',
  'mapdensity': 'JassMapDensity',
  'mapcontrol': 'JassMapControl',
  'playerslotstate': 'JassPlayerSlotState',
  'volumegroup': 'JassVolumeGroup',
  'camerafield': 'JassCameraField',
  'camerasetup': 'JassCameraSetup',
  'playercolor': 'JassPlayerColor',
  'placement': 'JassPlacement',
  'startlocprio': 'JassStartLocPrio',
  'raritycontrol': 'JassRarityControl',
  'blendmode': 'JassBlendMode',
  'texmapflags': 'JassTexMapFlags',
  'effect': 'JassEffect',
  'effecttype': 'JassEffectType',
  'weathereffect': 'JassWeatherEffect',
  'terraindeformation': 'JassTerrainDeformation',
  'fogstate': 'JassFogState',
  'fogmodifier': 'JassFogModifier',
  'dialog': 'JassDialog',
  'button': 'JassButton',
  'quest': 'JassQuest',
  'questitem': 'JassQuestItem',
  'defeatcondition': 'JassDefeatCondition',
  'timerdialog': 'JassTimerDialog',
  'leaderboard': 'JassLeaderboard',
  'multiboard': 'JassMultiboard',
  'multiboarditem': 'JassMultiboardItem',
  'trackable': 'JassTrackable',
  'gamecache': 'JassGameCache',
  'version': 'JassVersion',
  'itemtype': 'JassItemType',
  'texttag': 'JassTextTag',
  'attacktype': 'JassAttackType',
  'damagetype': 'JassDamageType',
  'weapontype': 'JassWeaponType',
  'soundtype': 'JassSoundType',
  'lightning': 'JassLightning',
  'pathingtype': 'JassPathingType',
  'image': 'JassImage',
  'ubersplat': 'JassUberSplat',
  'hashtable': 'JassHashTable',
};

/**
 * @param {Native} node
 * @return {string}
 */
function compileJsDocSignature(node) {
  let args = ['param {JassContext} jassContext'];

  if (node.args.length) {
    args.push(...node.args.map((arg) => `param {${typeMapping[arg.type]}} ${arg.name}`));
  }

  if (node.returnType !== 'nothing') {
    args.push(`return {${typeMapping[node.returnType]}}`);
  }

  return '//  * @' + args.join('\n//  * @');
}

/**
 * @param {Native} node
 * @return {string}
 */
function compileJsDoc(node) {
  return `// /**
//  * ${compileJassNative(node)}
//  *
${compileJsDocSignature(node)}
//  */`;
}

/**
 * @param {Node} node
 * @return {string}
 */
function compileNode(node) {
  let result = '';

  if (node instanceof ast.Program) {
    result += node.blocks.map((block) => compileNode(block)).join('\n');
  } else if (node instanceof ast.Native) {
    let jsDoc = compileJsDoc(node);
    let js = `// export function ${node.name}(${compileJsArgs(node.args)}) {}\n`;

    result += `${jsDoc}\n${js}`;
  }

  return result;
}

/**
 * @param {string} jassCode
 * @return {string}
 */
export default function compileNatives(jassCode) {
  return compileNode(parse(jassCode));
}
