import { degToRad, radToDeg, uintToTag, randomInRange } from '../../../common/math';

import JassHandle from './types/handle';
import JassAgent from './types/agent';
// import JassEvent from './types/event';
import JassPlayer from './types/player';
import JassWidget from './types/widget';
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
import JassRace from './types/race';
import JassAllianceType from './types/alliancetype';
import JassRacePreference from './types/racepreference';
import JassGameState from './types/gamestate';
import JassIGameState from './types/igamestate';
import JassFGameState from './types/fgamestate';
import JassPlayerState from './types/playerstate';
import JassPlayerScore from './types/playerscore';
import JassPlayerGameResult from './types/playergameresult';
import JassUnitState from './types/unitstate';
import JassAiDifficulty from './types/aidifficulty';
import JassEventId from './types/eventid';
import JassGameEvent from './types/gameevent';
import JassPlayerEvent from './types/playerevent';
import JassPlayerUnitEvent from './types/playerunitevent';
import JassUnitEvent from './types/unitevent';
import JassLimitOp from './types/limitop';
import JassWidgetEvent from './types/widgetevent';
import JassDialogEvent from './types/dialogevent';
import JassUnitType from './types/unittype';
import JassGameSpeed from './types/gamespeed';
import JassGameDifficulty from './types/gamedifficulty';
import JassGameType from './types/gametype';
import JassMapFlag from './types/mapflag';
import JassMapVisibility from './types/mapvisibility';
import JassMapSetting from './types/mapsetting';
import JassMapDensity from './types/mapdensity';
import JassMapControl from './types/mapcontrol';
import JassPlayerSlotState from './types/playerslotstate';
import JassVolumeGroup from './types/volumegroup';
import JassCameraField from './types/camerafield';
import JassCameraSetup from './types/camerasetup';
import JassPlayerColor from './types/playercolor';
import JassPlacement from './types/placement';
import JassStartLocPrio from './types/startlocprio';
import JassRarityControl from './types/raritycontrol';
import JassBlendMode from './types/blendmode';
import JassTexMapFlags from './types/texmapflags';
// import JassEffect from './types/effect';
import JassEffectType from './types/effecttype';
import JassWeatherEffect from './types/weathereffect';
// import JassTerrainDeformation from './types/terraindeformation';
import JassFogState from './types/fogstate';
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
import JassVersion from './types/version';
import JassItemType from './types/itemType';
// import JassTextTag from './types/texttag';
import JassAttackType from './types/attacktype';
import JassDamageType from './types/damagetype';
import JassWeaponType from './types/weapontype';
import JassSoundType from './types/soundtype';
// import JassLightning from './types/lightning';
import JassPathingType from './types/pathingtype';
// import JassImage from './types/image';
// import JassUbersplat from './types/ubersplat';
// import JassHashtable from './types/hashtable';

// constant native ConvertRace takes integer i returns race
export function ConvertRace(jassContext, i) {
    return jassContext.constantHandles.races[i];
}

// constant native ConvertAllianceType takes integer i returns alliancetype
export function ConvertAllianceType(jassContext, i) {
    return jassContext.constantHandles.allianceTypes[i];
}

// constant native ConvertRacePref takes integer i returns racepreference
export function ConvertRacePref(jassContext, i) {
    return jassContext.constantHandles.racePreferences[i];
}

// constant native ConvertIGameState takes integer i returns igamestate
export function ConvertIGameState(jassContext, i) {
    return jassContext.constantHandles.iGameStates[i];
}

// constant native ConvertFGameState takes integer i returns fgamestate
export function ConvertFGameState(jassContext, i) {
    return jassContext.constantHandles.fGameStates[i];
}

// constant native ConvertPlayerState takes integer i returns playerstate
export function ConvertPlayerState(jassContext, i) {
    return jassContext.constantHandles.playerStates[i];
}

// constant native ConvertPlayerScore takes integer i returns playerscore
export function ConvertPlayerScore(jassContext, i) {
    return jassContext.constantHandles.playerScores[i];
}

// constant native ConvertPlayerGameResult takes integer i returns playergameresult
export function ConvertPlayerGameResult(jassContext, i) {
    return jassContext.constantHandles.playerGameResults[i];
}

// constant native ConvertUnitState takes integer i returns unitstate
export function ConvertUnitState(jassContext, i) {
    return jassContext.constantHandles.unitStates[i];
}

// constant native ConvertAIDifficulty takes integer i returns aidifficulty
export function ConvertAIDifficulty(jassContext, i) {
    return jassContext.constantHandles.aiDifficulties[i];
}

// constant native ConvertGameEvent takes integer i returns gameevent
export function ConvertGameEvent(jassContext, i) {
    return jassContext.constantHandles.events[i];
}

// constant native ConvertPlayerEvent takes integer i returns playerevent
export function ConvertPlayerEvent(jassContext, i) {
    return jassContext.constantHandles.events[i];
}

// constant native ConvertPlayerUnitEvent takes integer i returns playerunitevent
export function ConvertPlayerUnitEvent(jassContext, i) {
    return jassContext.constantHandles.events[i];
}

// constant native ConvertWidgetEvent takes integer i returns widgetevent
export function ConvertWidgetEvent(jassContext, i) {
    return jassContext.constantHandles.events[i];
}

// constant native ConvertDialogEvent takes integer i returns dialogevent
export function ConvertDialogEvent(jassContext, i) {
    return jassContext.constantHandles.events[i];
}

// constant native ConvertUnitEvent takes integer i returns unitevent
export function ConvertUnitEvent(jassContext, i) {
    return jassContext.constantHandles.events[i];
}

// constant native ConvertLimitOp takes integer i returns limitop
export function ConvertLimitOp(jassContext, i) {
    return jassContext.constantHandles.limitOps[i];
}

// constant native ConvertUnitType takes integer i returns unittype
export function ConvertUnitType(jassContext, i) {
    return jassContext.constantHandles.unitTypes[i];
}

// constant native ConvertGameSpeed takes integer i returns gamespeed
export function ConvertGameSpeed(jassContext, i) {
    return jassContext.constantHandles.gameSpeeds[i];
}

// constant native ConvertPlacement takes integer i returns placement
export function ConvertPlacement(jassContext, i) {
    return jassContext.constantHandles.placements[i];
}

// constant native ConvertStartLocPrio takes integer i returns startlocprio
export function ConvertStartLocPrio(jassContext, i) {
    return jassContext.constantHandles.startLocPrios[i];
}

// constant native ConvertGameDifficulty takes integer i returns gamedifficulty
export function ConvertGameDifficulty(jassContext, i) {
    return jassContext.constantHandles.gameDifficulties[i];
}

// constant native ConvertGameType takes integer i returns gametype
export function ConvertGameType(jassContext, i) {
    return jassContext.constantHandles.gameTypes[i];
}

// constant native ConvertMapFlag takes integer i returns mapflag
export function ConvertMapFlag(jassContext, i) {
    return jassContext.constantHandles.mapFlags[i];
}

// constant native ConvertMapVisibility takes integer i returns mapvisibility
export function ConvertMapVisibility(jassContext, i) {
    return jassContext.constantHandles.mapVisibilities[i];
}

// constant native ConvertMapSetting takes integer i returns mapsetting
export function ConvertMapSetting(jassContext, i) {
    return jassContext.constantHandles.mapSettings[i];
}

// constant native ConvertMapDensity takes integer i returns mapdensity
export function ConvertMapDensity(jassContext, i) {
    return jassContext.constantHandles.mapDensities[i];
}

// constant native ConvertMapControl takes integer i returns mapcontrol
export function ConvertMapControl(jassContext, i) {
    return jassContext.constantHandles.mapControls[i];
}

// constant native ConvertPlayerColor takes integer i returns playercolor
export function ConvertPlayerColor(jassContext, i) {
    return jassContext.constantHandles.playerColors[i];
}

// constant native ConvertPlayerSlotState takes integer i returns playerslotstate
export function ConvertPlayerSlotState(jassContext, i) {
    return jassContext.constantHandles.playerSlotStates[i];
}

// constant native ConvertVolumeGroup takes integer i returns volumegroup
export function ConvertVolumeGroup(jassContext, i) {
    return jassContext.constantHandles.volumeGroups[i];
}

// constant native ConvertCameraField takes integer i returns camerafield
export function ConvertCameraField(jassContext, i) {
    return jassContext.constantHandles.cameraFields[i];
}

// constant native ConvertBlendMode takes integer i returns blendmode
export function ConvertBlendMode(jassContext, i) {
    return jassContext.constantHandles.blendModes[i];
}

// constant native ConvertRarityControl takes integer i returns raritycontrol
export function ConvertRarityControl(jassContext, i) {
    return jassContext.constantHandles.rarityControls[i];
}

// constant native ConvertTexMapFlags takes integer i returns texmapflags
export function ConvertTexMapFlags(jassContext, i) {
    return jassContext.constantHandles.texMapFlags[i];
}

// constant native ConvertFogState takes integer i returns fogstate
export function ConvertFogState(jassContext, i) {
    return jassContext.constantHandles.fogStates[i];
}

// constant native ConvertEffectType takes integer i returns effecttype
export function ConvertEffectType(jassContext, i) {
    return jassContext.constantHandles.effectTypes[i];
}

// constant native ConvertVersion takes integer i returns version
export function ConvertVersion(jassContext, i) {
    return jassContext.constantHandles.versions[i];
}

// constant native ConvertItemType takes integer i returns itemtype
export function ConvertItemType(jassContext, i) {
    return jassContext.constantHandles.itemTypes[i];
}

// constant native ConvertAttackType takes integer i returns attacktype
export function ConvertAttackType(jassContext, i) {
    return jassContext.constantHandles.attackTypes[i];
}

// constant native ConvertDamageType takes integer i returns damagetype
export function ConvertDamageType(jassContext, i) {
    return jassContext.constantHandles.damageTypes[i];
}

// constant native ConvertWeaponType takes integer i returns weapontype
export function ConvertWeaponType(jassContext, i) {
    return jassContext.constantHandles.weaponTypes[i];
}

// constant native ConvertSoundType takes integer i returns soundtype
export function ConvertSoundType(jassContext, i) {
    return jassContext.constantHandles.soundTypes[i];
}

// constant native ConvertPathingType takes integer i returns pathingtype
export function ConvertPathingType(jassContext, i) {
    return jassContext.constantHandles.pathingTypes[i];
}

// // constant native OrderId takes string orderIdString returns integer
// export function OrderId(jassContext, orderIdString) {

// }

// // constant native OrderId2String takes integer orderId returns string
// export function OrderId2String(jassContext, orderId) {

// }

// // constant native UnitId takes string unitIdString returns integer
// export function UnitId(jassContext, unitIdString) {

// }

// // constant native UnitId2String takes integer unitId returns string
// export function UnitId2String(jassContext, unitId) {

// }

// // constant native AbilityId takes string abilityIdString returns integer
// export function AbilityId(jassContext, abilityIdString) {

// }

// // constant native AbilityId2String takes integer abilityId returns string
// export function AbilityId2String(jassContext, abilityId) {

// }

// // constant native GetObjectName takes integer objectId returns string
// export function GetObjectName(jassContext, objectId) {

// }


// native Deg2Rad takes real degrees returns real
export function Deg2Rad(jassContext, degrees) {
    return degToRad(degrees);
}

// native Rad2Deg takes real radians returns real
export function Rad2Deg(jassContext, radians) {
    return radToDeg(degrees);
}

// native Sin takes real radians returns real
export function Sin(jassContext, radians) {
    return Math.sin(radians);
}

// native Cos takes real radians returns real
export function Cos(jassContext, radians) {
    return Math.cos(radians);
}

// native Tan takes real radians returns real
export function Tan(jassContext, radians) {
    return Math.tan(radians);
}

// native Asin takes real y returns real
export function Asin(jassContext, y) {
    return Math.asin(y);
}

// native Acos takes real x returns real
export function Acos(jassContext, x) {
    return Math.acos(x);
}

// native Atan takes real x returns real
export function Atan(jassContext, x) {
    return Math.atan(x);
}

// native Atan2 takes real y, real x returns real
export function Atan2(jassContext, y, x) {
    return Math.atan2(y, x);
}

// native SquareRoot takes real x returns real
export function SquareRoot(jassContext, x) {
    return Math.sqrt(x);
}

// native Pow takes real x, real power returns real
export function Pow(jassContext, x, power) {
    return Math.pow(x, power);
}

// native I2R takes integer i returns real
export function I2R(jassContext, i) {
    return i;
}

// native R2I takes real r returns integer
export function R2I(jassContext, r) {
    return r;
}

// native I2S takes integer i returns string
export function I2S(jassContext, i) {
    return '' + i;
}

// native R2S takes real r returns string
export function R2S(jassContext, r) {
    return '' + r;
}

// // native R2SW takes real r, integer width, integer precision returns string
// export function R2SW(jassContext, r, width, precision) {

// }

// native S2I takes string s returns integer
export function S2I(jassContext, s) {
    return parseInt(s);
}

// native S2R takes string s returns real
export function S2R(jassContext, s) {
    return parseFloat(s);
}

// native GetHandleId takes handle h returns integer
export function GetHandleId(jassContext, h) {
    return h.handleId;
}

// native SubString takes string source, integer start, integer end returns string
export function SubString(jassContext, source, start, end) {
    return source.substring(start, end);
}

// native StringLength takes string s returns integer
export function StringLength(jassContext, s) {
    return s.length;
}

// native StringCase takes string source, boolean upper returns string
export function StringCase(jassContext, source, upper) {
    if (upper) {
        return source.toUpperCase();
    } else {
        return source.toLowerCase();
    }
}

// // native StringHash takes string s returns integer
// export function StringHash(jassContext, s) {

// }

// // native GetLocalizedString takes string source returns string
// export function GetLocalizedString(jassContext, source) {

// }

// // native GetLocalizedHotkey takes string source returns integer
// export function GetLocalizedHotkey(jassContext, source) {

// }

// native SetMapName takes string name returns nothing
export function SetMapName(jassContext, name) {
    jassContext.mapName = name;
}

// native SetMapDescription takes string description returns nothing
export function SetMapDescription(jassContext, description) {
    jassContext.mapDescription = description;
}

// native SetTeams takes integer teamcount returns nothing
export function SetTeams(jassContext, teamcount) {
    jassContext.teamCount = teamcount;
}

// native SetPlayers takes integer playercount returns nothing
export function SetPlayers(jassContext, playercount) {
    jassContext.playerCount = playercount;
}

// native DefineStartLocation takes integer whichStartLoc, real x, real y returns nothing
export function DefineStartLocation(jassContext, whichStartLoc, x, y) {
    jassContext.startLocations[whichStartLoc] = jassContext.addHandle(new JassLocation(jassContext, x, y));
}

// native DefineStartLocationLoc takes integer whichStartLoc, location whichLocation returns nothing
export function DefineStartLocationLoc(jassContext, whichStartLoc, whichLocation) {
    DefineStartLocation(jassContext, whichStartLoc, whichLocation.x, whichLocation.y);
}

// // native SetStartLocPrioCount takes integer whichStartLoc, integer prioSlotCount returns nothing
// export function SetStartLocPrioCount(jassContext, whichStartLoc, prioSlotCount) {

// }

// // native SetStartLocPrio takes integer whichStartLoc, integer prioSlotIndex, integer otherStartLocIndex, startlocprio priority returns nothing
// export function SetStartLocPrio(jassContext, whichStartLoc, prioSlotIndex, otherStartLocIndex, priority) {

// }

// // native GetStartLocPrioSlot takes integer whichStartLoc, integer prioSlotIndex returns integer
// export function GetStartLocPrioSlot(jassContext, whichStartLoc, prioSlotIndex) {

// }

// // native GetStartLocPrio takes integer whichStartLoc, integer prioSlotIndex returns startlocprio
// export function GetStartLocPrio(jassContext, whichStartLoc, prioSlotIndex) {

// }

// // native SetGameTypeSupported takes gametype whichGameType, boolean value returns nothing
// export function SetGameTypeSupported(jassContext, whichGameType, value) {

// }

// // native SetMapFlag takes mapflag whichMapFlag, boolean value returns nothing
// export function SetMapFlag(jassContext, whichMapFlag, value) {

// }

// native SetGamePlacement takes placement whichPlacementType returns nothing
export function SetGamePlacement(jassContext, whichPlacementType) {
    jassContext.mapPlacement = whichPlacementType;
}

// native SetGameSpeed takes gamespeed whichspeed returns nothing
export function SetGameSpeed(jassContext, whichspeed) {
    jassContext.mapSpeed = whichspeed;
}

// native SetGameDifficulty takes gamedifficulty whichdifficulty returns nothing
export function SetGameDifficulty(jassContext, whichdifficulty) {
    jassContext.mapDifficulty = whichdifficulty;
}

// // native SetResourceDensity takes mapdensity whichdensity returns nothing
// export function SetResourceDensity(jassContext, whichdensity) {

// }

// // native SetCreatureDensity takes mapdensity whichdensity returns nothing
// export function SetCreatureDensity(jassContext, whichdensity) {

// }

// native GetTeams takes nothing returns integer
export function GetTeams(jassContext) {
    return jassContext.teamCount;
}

// native GetPlayers takes nothing returns integer
export function GetPlayers(jassContext) {
    return jassContext.playerCount;
}

// // native IsGameTypeSupported takes gametype whichGameType returns boolean
// export function IsGameTypeSupported(jassContext, whichGameType) {

// }

// // native GetGameTypeSelected takes nothing returns gametype
// export function GetGameTypeSelected(jassContext) {

// }

// // native IsMapFlagSet takes mapflag whichMapFlag returns boolean
// export function IsMapFlagSet(jassContext, whichMapFlag) {

// }

// constant native GetGamePlacement takes nothing returns placement
export function GetGamePlacement(jassContext) {
    return jassContext.mapPlacement;
}

// constant native GetGameSpeed takes nothing returns gamespeed
export function GetGameSpeed(jassContext) {
    return jassContext.mapSpeed;
}

// constant native GetGameDifficulty takes nothing returns gamedifficulty
export function GetGameDifficulty(jassContext) {
    return jassContext.mapDifficulty;
}

// // constant native GetResourceDensity takes nothing returns mapdensity
// export function GetResourceDensity(jassContext) {

// }

// // constant native GetCreatureDensity takes nothing returns mapdensity
// export function GetCreatureDensity(jassContext) {

// }

// constant native GetStartLocationX takes integer whichStartLocation returns real
export function GetStartLocationX(jassContext, whichStartLocation) {
    return jassContext.startLocations[whichStartLocation].x;
}

// constant native GetStartLocationY takes integer whichStartLocation returns real
export function GetStartLocationY(jassContext, whichStartLocation) {
    return jassContext.startLocations[whichStartLocation].y;
}

// constant native GetStartLocationLoc takes integer whichStartLocation returns location
export function GetStartLocationLoc(jassContext, whichStartLocation) {
    return jassContext.startLocations[whichStartLocation];
}

// native SetPlayerTeam takes player whichPlayer, integer whichTeam returns nothing
export function SetPlayerTeam(jassContext, whichPlayer, whichTeam) {
    whichPlayer.team = whichTeam;
}

// native SetPlayerStartLocation takes player whichPlayer, integer startLocIndex returns nothing
export function SetPlayerStartLocation(jassContext, whichPlayer, startLocIndex) {
    whichPlayer.startLocation = startLocIndex;
}

// native ForcePlayerStartLocation takes player whichPlayer, integer startLocIndex returns nothing
export function ForcePlayerStartLocation(jassContext, whichPlayer, startLocIndex) {
    whichPlayer.forcedStartLocation = startLocIndex;
}

// native SetPlayerColor takes player whichPlayer, playercolor color returns nothing
export function SetPlayerColor(jassContext, whichPlayer, color) {
    whichPlayer.color = color;
}

// native SetPlayerAlliance takes player sourcePlayer, player otherPlayer, alliancetype whichAllianceSetting, boolean value returns nothing
export function SetPlayerAlliance(jassContext, sourcePlayer, otherPlayer, whichAllianceSetting, value) {
    let alliance = sourcePlayer.alliances.get(otherPlayer);

    // Until I handle alliances in a better way, inject it when needed.
    if (!alliance) {
        alliance = {
            passive: false,
            helpRequest: false,
            helpResponse: false,
            sharedXp: false,
            sharedSpells: false,
            sharedVision: false,
            sharedControl: false,
            sharedAdvancedControl: false,
            rescuable: false,
            sharedVisionForced: false
        };

        sourcePlayer.alliances.set(otherPlayer, alliance);
    }

    switch (whichAllianceSetting.value) {
        case 0:
            alliance.passive = value;
            return;
        case 1:
            alliance.helpRequest = value;
            return;
        case 2:
            alliance.helpResponse = value;
            return;
        case 3:
            alliance.sharedXp = value;
            return;
        case 4:
            alliance.sharedSpells = value;
            return;
        case 5:
            alliance.sharedVision = value;
            return;
        case 6:
            alliance.sharedControl = value;
            return;
        case 7:
            alliance.sharedAdvancedControl = value;
            return;
        case 8:
            alliance.rescuable = value;
            return;
        case 9:
            alliance.sharedVisionForced = value;
            return;
    }
}

// // native SetPlayerTaxRate takes player sourcePlayer, player otherPlayer, playerstate whichResource, integer rate returns nothing
// export function SetPlayerTaxRate(jassContext, sourcePlayer, otherPlayer, whichResource, rate) {

// }

// native SetPlayerRacePreference takes player whichPlayer, racepreference whichRacePreference returns nothing
export function SetPlayerRacePreference(jassContext, whichPlayer, whichRacePreference) {
    whichPlayer.racePreference = whichRacePreference;
}

// native SetPlayerRaceSelectable takes player whichPlayer, boolean value returns nothing
export function SetPlayerRaceSelectable(jassContext, whichPlayer, value) {
    whichPlayer.raceSelectable = value;
}

// native SetPlayerController takes player whichPlayer, mapcontrol controlType returns nothing
export function SetPlayerController(jassContext, whichPlayer, controlType) {
    whichPlayer.controller = controlType
}

// native SetPlayerName takes player whichPlayer, string name returns nothing
export function SetPlayerName(jassContext, whichPlayer, name) {
    whichPlayer.name = name
}

// // native SetPlayerOnScoreScreen takes player whichPlayer, boolean flag returns nothing
// export function SetPlayerOnScoreScreen(jassContext, whichPlayer, flag) {

// }

// native GetPlayerTeam takes player whichPlayer returns integer
export function GetPlayerTeam(jassContext, whichPlayer) {
    return whichPlayer.team;
}

// native GetPlayerStartLocation takes player whichPlayer returns integer
export function GetPlayerStartLocation(jassContext, whichPlayer) {
    return whichPlayer.startLocation;
}

// native GetPlayerColor takes player whichPlayer returns playercolor
export function GetPlayerColor(jassContext, whichPlayer) {
    return whichPlayer.color;
}

// native GetPlayerSelectable takes player whichPlayer returns boolean
export function GetPlayerSelectable(jassContext, whichPlayer) {
    return whichPlayer.raceSelectable;
}

// native GetPlayerController takes player whichPlayer returns mapcontrol
export function GetPlayerController(jassContext, whichPlayer) {
    return whichPlayer.controller;
}

// // native GetPlayerSlotState takes player whichPlayer returns playerslotstate
// export function GetPlayerSlotState(jassContext, whichPlayer) {

// }

// // native GetPlayerTaxRate takes player sourcePlayer, player otherPlayer, playerstate whichResource returns integer
// export function GetPlayerTaxRate(jassContext, sourcePlayer, otherPlayer, whichResource) {

// }

// // native IsPlayerRacePrefSet takes player whichPlayer, racepreference pref returns boolean
// export function IsPlayerRacePrefSet(jassContext, whichPlayer, pref) {

// }

// native GetPlayerName takes player whichPlayer returns string
export function GetPlayerName(jassContext, whichPlayer) {
    return whichPlayer.name;
}

// native CreateTimer takes nothing returns timer
export function CreateTimer(jassContext) {
    return jassContext.addHandle(new JassTimer(jassContext));
}

// native DestroyTimer takes timer whichTimer returns nothing
export function DestroyTimer(jassContext, whichTimer) {
    jassContext.removeHandle(whichTimer);
}

// native TimerStart takes timer whichTimer, real timeout, boolean periodic, code handlerFunc returns nothing
export function TimerStart(jassContext, whichTimer, timeout, periodic, handlerFunc) {
    whichTimer.elapsed = 0;
    whichTimer.timeout = timeout;
    whichTimer.periodic = periodic;
    whichTimer.handlerFunc = handlerFunc;

    jassContext.timers.add(whichTimer);
}

// native TimerGetElapsed takes timer whichTimer returns real
export function TimerGetElapsed(jassContext, whichTimer) {
    return whichTimer.elapsed;
}

// native TimerGetRemaining takes timer whichTimer returns real
export function TimerGetRemaining(jassContext, whichTimer) {
    return whichTimer.timeout - whichTimer.elapsed;
}

// native TimerGetTimeout takes timer whichTimer returns real
export function TimerGetTimeout(jassContext, whichTimer) {
    return whichTimer.timeout;
}

// native PauseTimer takes timer whichTimer returns nothing
export function PauseTimer(jassContext, whichTimer) {
    jassContext.timers.delete(whichTimer);
}

// native ResumeTimer takes timer whichTimer returns nothing
export function ResumeTimer(jassContext, whichTimer) {
    jassContext.timers.add(whichTimer);
}

// // native GetExpiredTimer takes nothing returns timer
// export function GetExpiredTimer(jassContext) {
    
// }

// native CreateGroup takes nothing returns group
export function CreateGroup(jassContext) {
    return jassContext.addHandle(new JassGroup(jassContext));
}

// native DestroyGroup takes group whichGroup returns nothing
export function DestroyGroup(jassContext, whichGroup) {
    jassContext.removeHandle(whichGroup);
}

// native GroupAddUnit takes group whichGroup, unit whichUnit returns nothing
export function GroupAddUnit(jassContext, whichGroup, whichUnit) {
    whichGroup.units.add(whichUnit);
}

// native GroupRemoveUnit takes group whichGroup, unit whichUnit returns nothing
export function GroupRemoveUnit(jassContext, whichGroup, whichUnit) {
    whichGroup.units.delete(whichUnit);
}

// native GroupClear takes group whichGroup returns nothing
export function GroupClear(jassContext, whichGroup) {
    whichGroup.units.clear();
}

// // native GroupEnumUnitsOfType takes group whichGroup, string unitname, boolexpr filter returns nothing
// export function GroupEnumUnitsOfType(jassContext, whichGroup, unitname, filter) {

// }

// // native GroupEnumUnitsOfPlayer takes group whichGroup, player whichPlayer, boolexpr filter returns nothing
// export function GroupEnumUnitsOfPlayer(jassContext, whichGroup, whichPlayer, filter) {

// }

// // native GroupEnumUnitsOfTypeCounted takes group whichGroup, string unitname, boolexpr filter, integer countLimit returns nothing
// export function GroupEnumUnitsOfTypeCounted(jassContext, whichGroup, unitname, filter, countLimit) {

// }

// // native GroupEnumUnitsInRect takes group whichGroup, rect r, boolexpr filter returns nothing
// export function GroupEnumUnitsInRect(jassContext, whichGroup, r, filter) {

// }

// // native GroupEnumUnitsInRectCounted takes group whichGroup, rect r, boolexpr filter, integer countLimit returns nothing
// export function GroupEnumUnitsInRectCounted(jassContext, whichGroup, r, filter, countLimit) {

// }

// // native GroupEnumUnitsInRange takes group whichGroup, real x, real y, real radius, boolexpr filter returns nothing
// export function GroupEnumUnitsInRange(jassContext, whichGroup, x, y, radius, filter) {

// }

// // native GroupEnumUnitsInRangeOfLoc takes group whichGroup, location whichLocation, real radius, boolexpr filter returns nothing
// export function GroupEnumUnitsInRangeOfLoc(jassContext, whichGroup, whichLocation, radius, filter) {

// }

// // native GroupEnumUnitsInRangeCounted takes group whichGroup, real x, real y, real radius, boolexpr filter, integer countLimit returns nothing
// export function GroupEnumUnitsInRangeCounted(jassContext, whichGroup, x, y, radius, filter, countLimit) {

// }

// // native GroupEnumUnitsInRangeOfLocCounted takes group whichGroup, location whichLocation, real radius, boolexpr filter, integer countLimit returns nothing
// export function GroupEnumUnitsInRangeOfLocCounted(jassContext, whichGroup, whichLocation, radius, filter, countLimit) {

// }

// // native GroupEnumUnitsSelected takes group whichGroup, player whichPlayer, boolexpr filter returns nothing
// export function GroupEnumUnitsSelected(jassContext, whichGroup, whichPlayer, filter) {

// }

// // native GroupImmediateOrder takes group whichGroup, string order returns boolean
// export function GroupImmediateOrder(jassContext, whichGroup, order) {

// }

// // native GroupImmediateOrderById takes group whichGroup, integer order returns boolean
// export function GroupImmediateOrderById(jassContext, whichGroup, order) {

// }

// // native GroupPointOrder takes group whichGroup, string order, real x, real y returns boolean
// export function GroupPointOrder(jassContext, whichGroup, order, x, y) {

// }

// // native GroupPointOrderLoc takes group whichGroup, string order, location whichLocation returns boolean
// export function GroupPointOrderLoc(jassContext, whichGroup, order, whichLocation) {

// }

// // native GroupPointOrderById takes group whichGroup, integer order, real x, real y returns boolean
// export function GroupPointOrderById(jassContext, whichGroup, order, x, y) {

// }

// // native GroupPointOrderByIdLoc takes group whichGroup, integer order, location whichLocation returns boolean
// export function GroupPointOrderByIdLoc(jassContext, whichGroup, order, whichLocation) {

// }

// // native GroupTargetOrder takes group whichGroup, string order, widget targetWidget returns boolean
// export function GroupTargetOrder(jassContext, whichGroup, order, targetWidget) {

// }

// // native GroupTargetOrderById takes group whichGroup, integer order, widget targetWidget returns boolean
// export function GroupTargetOrderById(jassContext, whichGroup, order, targetWidget) {

// }

// // native ForGroup takes group whichGroup, code callback returns nothing
// export function ForGroup(jassContext, whichGroup, callback) {

// }

// native FirstOfGroup takes group whichGroup returns unit
export function FirstOfGroup(jassContext, whichGroup) {
    return whichGroup.units.shift() || null;
}

// native CreateForce takes nothing returns force
export function CreateForce(jassContext) {
    return jassContext.addHandle(new JassForce(jassContext));
}

// native DestroyForce takes force whichForce returns nothing
export function DestroyForce(jassContext, whichForce) {
    jassContext.removeHandle(whichForce);
}

// native ForceAddPlayer takes force whichForce, player whichPlayer returns nothing
export function ForceAddPlayer(jassContext, whichForce, whichPlayer) {
    whichForce.players.add(whichPlayer);
}

// native ForceRemovePlayer takes force whichForce, player whichPlayer returns nothing
export function ForceRemovePlayer(jassContext, whichForce, whichPlayer) {
    whichForce.players.delete(whichPlayer);
}

// native ForceClear takes force whichForce returns nothing
export function ForceClear(jassContext, whichForce) {
    whichForce.players.clear();
}

// // native ForceEnumPlayers takes force whichForce, boolexpr filter returns nothing
// export function ForceEnumPlayers(jassContext, whichForce, filter) {

// }

// // native ForceEnumPlayersCounted takes force whichForce, boolexpr filter, integer countLimit returns nothing
// export function ForceEnumPlayersCounted(jassContext, whichForce, filter, countLimit) {

// }

// // native ForceEnumAllies takes force whichForce, player whichPlayer, boolexpr filter returns nothing
// export function ForceEnumAllies(jassContext, whichForce, whichPlayer, filter) {

// }

// // native ForceEnumEnemies takes force whichForce, player whichPlayer, boolexpr filter returns nothing
// export function ForceEnumEnemies(jassContext, whichForce, whichPlayer, filter) {

// }

// // native ForForce takes force whichForce, code callback returns nothing
// export function ForForce(jassContext, whichForce, callback) {

// }

// native Rect takes real minx, real miny, real maxx, real maxy returns rect
export function Rect(jassContext, minx, miny, maxx, maxy) {
    return jassContext.addHandle(new JassRect(jassContext, minx, miny, maxx, maxy));
}

// native RectFromLoc takes location min, location max returns rect
export function RectFromLoc(jassContext, min, max) {
    return Rect(jassContext, min.x, min.y, max.x, max.y);
}

// native RemoveRect takes rect whichRect returns nothing
export function RemoveRect(jassContext, whichRect) {
    jassContext.removeHandle(whichRect);
}

// native SetRect takes rect whichRect, real minx, real miny, real maxx, real maxy returns nothing
export function SetRect(jassContext, whichRect, minx, miny, maxx, maxy) {
    let center = whichRect.center,
        min = whichRect.min,
        max = whichRect.max;

    center[0] = maxx - minx;
    center[1] = maxy - miny;
    min[0] = minx;
    min[1] = miny;
    max[0] = maxx;
    max[1] = maxy;
}

// native SetRectFromLoc takes rect whichRect, location min, location max returns nothing
export function SetRectFromLoc(jassContext, whichRect, min, max) {
    SetRect(jassContext, whichRect, min.x, min.y, max.x, max.y);
}

// native MoveRectTo takes rect whichRect, real newCenterX, real newCenterY returns nothing
export function MoveRectTo(jassContext, whichRect, newCenterX, newCenterY) {
    let center = whichRect.center,
        min = whichRect.min,
        max = whichRect.max,
        halfWidth = (max[0] - min[0]) / 2,
        halfHeight = (max[1] - min[1]) / 2;

    center[0] = newCenterX;
    center[1] = newCenterY;
    min[0] = newCenterX - halfWidth;
    min[1] = newCenterY - halfHeight;
    max[0] = newCenterX + halfWidth;
    max[1] = newCenterY + halfHeight;
}

// native MoveRectToLoc takes rect whichRect, location newCenterLoc returns nothing
export function MoveRectToLoc(jassContext, whichRect, newCenterLoc) {
    MoveRectTo(jassContext, whichRect, newCenterLoc.x, newCenterLoc.y);
}

// native GetRectCenterX takes rect whichRect returns real
export function GetRectCenterX(jassContext, whichRect) {
    return whichRect.center[0];
}

// native GetRectCenterY takes rect whichRect returns real
export function GetRectCenterY(jassContext, whichRect) {
    return whichRect.center[1];
}

// native GetRectMinX takes rect whichRect returns real
export function GetRectMinX(jassContext, whichRect) {
    return whichRect.min[0];
}

// native GetRectMinY takes rect whichRect returns real
export function GetRectMinY(jassContext, whichRect) {
    return whichRect.min[1];
}

// native GetRectMaxX takes rect whichRect returns real
export function GetRectMaxX(jassContext, whichRect) {
    return whichRect.max[0];
}

// native GetRectMaxY takes rect whichRect returns real
export function GetRectMaxY(jassContext, whichRect) {
    return whichRect.max[1];
}

// native CreateRegion takes nothing returns region
export function CreateRegion(jassContext) {
    return jassContext.addHandle(new JassRegion(jassContext));
}

// native RemoveRegion takes region whichRegion returns nothing
export function RemoveRegion(jassContext, whichRegion) {
    jassContext.removeHandle(whichRegion);
}

// // native RegionAddRect takes region whichRegion, rect r returns nothing
// export function RegionAddRect(jassContext, whichRegion, r) {

// }

// // native RegionClearRect takes region whichRegion, rect r returns nothing
// export function RegionClearRect(jassContext, whichRegion, r) {

// }

// // native RegionAddCell takes region whichRegion, real x, real y returns nothing
// export function RegionAddCell(jassContext, whichRegion, x, y) {

// }

// // native RegionAddCellAtLoc takes region whichRegion, location whichLocation returns nothing
// export function RegionAddCellAtLoc(jassContext, whichRegion, whichLocation) {

// }

// // native RegionClearCell takes region whichRegion, real x, real y returns nothing
// export function RegionClearCell(jassContext, whichRegion, x, y) {

// }

// // native RegionClearCellAtLoc takes region whichRegion, location whichLocation returns nothing
// export function RegionClearCellAtLoc(jassContext, whichRegion, whichLocation) {

// }

// native Location takes real x, real y returns location
export function Location(jassContext, x, y) {
    return jassContext.addHandle(new JassLocation(jassContext, x, y));
}

// native RemoveLocation takes location whichLocation returns nothing
export function RemoveLocation(jassContext, whichLocation) {
    jassContext.removeHandle(whichLocation);
}

// native MoveLocation takes location whichLocation, real newX, real newY returns nothing
export function MoveLocation(jassContext, whichLocation, newX, newY) {
    whichLocation.x = newX;
    whichLocation.y = newY;
}

// native GetLocationX takes location whichLocation returns real
export function GetLocationX(jassContext, whichLocation) {
    return whichLocation.x;
}

// native GetLocationY takes location whichLocation returns real
export function GetLocationY(jassContext, whichLocation) {
    return whichLocation.y;
}

// native GetLocationZ takes location whichLocation returns real
export function GetLocationZ(jassContext, whichLocation) {
    return whichLocation.z;
}

// // native IsUnitInRegion takes region whichRegion, unit whichUnit returns boolean
// export function IsUnitInRegion(jassContext, whichRegion, whichUnit) {

// }

// // native IsPointInRegion takes region whichRegion, real x, real y returns boolean
// export function IsPointInRegion(jassContext, whichRegion, x, y) {

// }

// // native IsLocationInRegion takes region whichRegion, location whichLocation returns boolean
// export function IsLocationInRegion(jassContext, whichRegion, whichLocation) {

// }

// // native GetWorldBounds takes nothing returns rect
// export function GetWorldBounds(jassContext) {

// }

// native CreateTrigger takes nothing returns trigger
export function CreateTrigger(jassContext) {
    return jassContext.addHandle(new JassTrigger(jassContext));
}

// native DestroyTrigger takes trigger whichTrigger returns nothing
export function DestroyTrigger(jassContext, whichTrigger) {
    jassContext.removeHandle(whichTrigger);
}

// // native ResetTrigger takes trigger whichTrigger returns nothing
// export function ResetTrigger(jassContext, whichTrigger) {

// }

// native EnableTrigger takes trigger whichTrigger returns nothing
export function EnableTrigger(jassContext, whichTrigger) {
    whichTrigger.enabled = true;
}

// native DisableTrigger takes trigger whichTrigger returns nothing
export function DisableTrigger(jassContext, whichTrigger) {
    whichTrigger.enabled = false;
}

// native IsTriggerEnabled takes trigger whichTrigger returns boolean
export function IsTriggerEnabled(jassContext, whichTrigger) {
    return whichTrigger.enabled;;
}

// // native TriggerWaitOnSleeps takes trigger whichTrigger, boolean flag returns nothing
// export function TriggerWaitOnSleeps(jassContext, whichTrigger, flag) {

// }

// // native IsTriggerWaitOnSleeps takes trigger whichTrigger returns boolean
// export function IsTriggerWaitOnSleeps(jassContext, whichTrigger) {

// }

// // constant native GetFilterUnit takes nothing returns unit
// export function GetFilterUnit(jassContext) {

// }

// // constant native GetEnumUnit takes nothing returns unit
// export function GetEnumUnit(jassContext) {

// }

// // constant native GetFilterDestructable takes nothing returns destructable
// export function GetFilterDestructable(jassContext) {

// }

// // constant native GetEnumDestructable takes nothing returns destructable
// export function GetEnumDestructable(jassContext) {

// }

// // constant native GetFilterItem takes nothing returns item
// export function GetFilterItem(jassContext) {

// }

// // constant native GetEnumItem takes nothing returns item
// export function GetEnumItem(jassContext) {

// }

// // constant native GetFilterPlayer takes nothing returns player
// export function GetFilterPlayer(jassContext) {

// }

// // constant native GetEnumPlayer takes nothing returns player
// export function GetEnumPlayer(jassContext) {

// }

// // constant native GetTriggeringTrigger takes nothing returns trigger
// export function GetTriggeringTrigger(jassContext) {

// }

// // constant native GetTriggerEventId takes nothing returns eventid
// export function GetTriggerEventId(jassContext) {

// }

// // constant native GetTriggerEvalCount takes trigger whichTrigger returns integer
// export function GetTriggerEvalCount(jassContext, whichTrigger) {

// }

// // constant native GetTriggerExecCount takes trigger whichTrigger returns integer
// export function GetTriggerExecCount(jassContext, whichTrigger) {

// }

// native ExecuteFunc takes string funcName returns nothing
export function ExecuteFunc(jassContext, funcName) {
    jassContext.call(funcName);
}

// // native And takes boolexpr operandA, boolexpr operandB returns boolexpr
// export function And(jassContext, operandA, operandB) {
    
// }

// // native Or takes boolexpr operandA, boolexpr operandB returns boolexpr
// export function Or(jassContext, operandA, operandB) {

// }

// // native Not takes boolexpr operand returns boolexpr
// export function Not(jassContext, operand) {

// }

// // native Condition takes code func returns conditionfunc
// export function Condition(jassContext, func) {

// }

// // native DestroyCondition takes conditionfunc c returns nothing
// export function DestroyCondition(jassContext, c) {

// }

// // native Filter takes code func returns filterfunc
// export function Filter(jassContext, func) {

// }

// // native DestroyFilter takes filterfunc f returns nothing
// export function DestroyFilter(jassContext, f) {

// }

// // native DestroyBoolExpr takes boolexpr e returns nothing
// export function DestroyBoolExpr(jassContext, e) {

// }

// // native TriggerRegisterVariableEvent takes trigger whichTrigger, string varName, limitop opcode, real limitval returns event
// export function TriggerRegisterVariableEvent(jassContext, whichTrigger, varName, opcode, limitval) {

// }

// // native TriggerRegisterTimerEvent takes trigger whichTrigger, real timeout, boolean periodic returns event
// export function TriggerRegisterTimerEvent(jassContext, whichTrigger, timeout, periodic) {

// }

// // native TriggerRegisterTimerExpireEvent takes trigger whichTrigger, timer t returns event
// export function TriggerRegisterTimerExpireEvent(jassContext, whichTrigger, t) {

// }

// // native TriggerRegisterGameStateEvent takes trigger whichTrigger, gamestate whichState, limitop opcode, real limitval returns event
// export function TriggerRegisterGameStateEvent(jassContext, whichTrigger, whichState, opcode, limitval) {

// }

// // native TriggerRegisterDialogEvent takes trigger whichTrigger, dialog whichDialog returns event
// export function TriggerRegisterDialogEvent(jassContext, whichTrigger, whichDialog) {

// }

// // native TriggerRegisterDialogButtonEvent takes trigger whichTrigger, button whichButton returns event
// export function TriggerRegisterDialogButtonEvent(jassContext, whichTrigger, whichButton) {

// }

// // constant native GetEventGameState takes nothing returns gamestate
// export function GetEventGameState(jassContext) {

// }

// // native TriggerRegisterGameEvent takes trigger whichTrigger, gameevent whichGameEvent returns event
// export function TriggerRegisterGameEvent(jassContext, whichTrigger, whichGameEvent) {

// }

// // constant native GetWinningPlayer takes nothing returns player
// export function GetWinningPlayer(jassContext) {

// }

// // native TriggerRegisterEnterRegion takes trigger whichTrigger, region whichRegion, boolexpr filter returns event
// export function TriggerRegisterEnterRegion(jassContext, whichTrigger, whichRegion, filter) {

// }

// // constant native GetTriggeringRegion takes nothing returns region
// export function GetTriggeringRegion(jassContext) {

// }

// // constant native GetEnteringUnit takes nothing returns unit
// export function GetEnteringUnit(jassContext) {

// }

// // native TriggerRegisterLeaveRegion takes trigger whichTrigger, region whichRegion, boolexpr filter returns event
// export function TriggerRegisterLeaveRegion(jassContext, whichTrigger, whichRegion, filter) {

// }

// // constant native GetLeavingUnit takes nothing returns unit
// export function GetLeavingUnit(jassContext) {

// }

// // native TriggerRegisterTrackableHitEvent takes trigger whichTrigger, trackable t returns event
// export function TriggerRegisterTrackableHitEvent(jassContext, whichTrigger, t) {

// }

// // native TriggerRegisterTrackableTrackEvent takes trigger whichTrigger, trackable t returns event
// export function TriggerRegisterTrackableTrackEvent(jassContext, whichTrigger, t) {

// }

// // constant native GetTriggeringTrackable takes nothing returns trackable
// export function GetTriggeringTrackable(jassContext) {

// }

// // constant native GetClickedButton takes nothing returns button
// export function GetClickedButton(jassContext) {

// }

// // constant native GetClickedDialog takes nothing returns dialog
// export function GetClickedDialog(jassContext) {

// }

// // constant native GetTournamentFinishSoonTimeRemaining takes nothing returns real
// export function GetTournamentFinishSoonTimeRemaining(jassContext) {

// }

// // constant native GetTournamentFinishNowRule takes nothing returns integer
// export function GetTournamentFinishNowRule(jassContext) {

// }

// // constant native GetTournamentFinishNowPlayer takes nothing returns player
// export function GetTournamentFinishNowPlayer(jassContext) {

// }

// // constant native GetTournamentScore takes player whichPlayer returns integer
// export function GetTournamentScore(jassContext, whichPlayer) {

// }

// // constant native GetSaveBasicFilename takes nothing returns string
// export function GetSaveBasicFilename(jassContext) {

// }

// // native TriggerRegisterPlayerEvent takes trigger whichTrigger, player whichPlayer, playerevent whichPlayerEvent returns event
// export function TriggerRegisterPlayerEvent(jassContext, whichTrigger, whichPlayer, whichPlayerEvent) {

// }

// // constant native GetTriggerPlayer takes nothing returns player
// export function GetTriggerPlayer(jassContext) {

// }

// // native TriggerRegisterPlayerUnitEvent takes trigger whichTrigger, player whichPlayer, playerunitevent whichPlayerUnitEvent, boolexpr filter returns event
// export function TriggerRegisterPlayerUnitEvent(jassContext, whichTrigger, whichPlayer, whichPlayerUnitEvent, filter) {

// }

// // constant native GetLevelingUnit takes nothing returns unit
// export function GetLevelingUnit(jassContext) {

// }

// // constant native GetLearningUnit takes nothing returns unit
// export function GetLearningUnit(jassContext) {

// }

// // constant native GetLearnedSkill takes nothing returns integer
// export function GetLearnedSkill(jassContext) {

// }

// // constant native GetLearnedSkillLevel takes nothing returns integer
// export function GetLearnedSkillLevel(jassContext) {

// }

// // constant native GetRevivableUnit takes nothing returns unit
// export function GetRevivableUnit(jassContext) {

// }

// // constant native GetRevivingUnit takes nothing returns unit
// export function GetRevivingUnit(jassContext) {

// }

// // constant native GetAttacker takes nothing returns unit
// export function GetAttacker(jassContext) {

// }

// // constant native GetRescuer takes nothing returns unit
// export function GetRescuer(jassContext) {

// }

// // constant native GetDyingUnit takes nothing returns unit
// export function GetDyingUnit(jassContext) {

// }

// // constant native GetKillingUnit takes nothing returns unit
// export function GetKillingUnit(jassContext) {

// }

// // constant native GetDecayingUnit takes nothing returns unit
// export function GetDecayingUnit(jassContext) {

// }

// // constant native GetConstructingStructure takes nothing returns unit
// export function GetConstructingStructure(jassContext) {

// }

// // constant native GetCancelledStructure takes nothing returns unit
// export function GetCancelledStructure(jassContext) {

// }

// // constant native GetConstructedStructure takes nothing returns unit
// export function GetConstructedStructure(jassContext) {

// }

// // constant native GetResearchingUnit takes nothing returns unit
// export function GetResearchingUnit(jassContext) {

// }

// // constant native GetResearched takes nothing returns integer
// export function GetResearched(jassContext) {

// }

// // constant native GetTrainedUnitType takes nothing returns integer
// export function GetTrainedUnitType(jassContext) {

// }

// // constant native GetTrainedUnit takes nothing returns unit
// export function GetTrainedUnit(jassContext) {

// }

// // constant native GetDetectedUnit takes nothing returns unit
// export function GetDetectedUnit(jassContext) {

// }

// // constant native GetSummoningUnit takes nothing returns unit
// export function GetSummoningUnit(jassContext) {

// }

// // constant native GetSummonedUnit takes nothing returns unit
// export function GetSummonedUnit(jassContext) {

// }

// // constant native GetTransportUnit takes nothing returns unit
// export function GetTransportUnit(jassContext) {

// }

// // constant native GetLoadedUnit takes nothing returns unit
// export function GetLoadedUnit(jassContext) {

// }

// // constant native GetSellingUnit takes nothing returns unit
// export function GetSellingUnit(jassContext) {

// }

// // constant native GetSoldUnit takes nothing returns unit
// export function GetSoldUnit(jassContext) {

// }

// // constant native GetBuyingUnit takes nothing returns unit
// export function GetBuyingUnit(jassContext) {

// }

// // constant native GetSoldItem takes nothing returns item
// export function GetSoldItem(jassContext) {

// }

// // constant native GetChangingUnit takes nothing returns unit
// export function GetChangingUnit(jassContext) {

// }

// // constant native GetChangingUnitPrevOwner takes nothing returns player
// export function GetChangingUnitPrevOwner(jassContext) {

// }

// // constant native GetManipulatingUnit takes nothing returns unit
// export function GetManipulatingUnit(jassContext) {

// }

// // constant native GetManipulatedItem takes nothing returns item
// export function GetManipulatedItem(jassContext) {

// }

// // constant native GetOrderedUnit takes nothing returns unit
// export function GetOrderedUnit(jassContext) {

// }

// // constant native GetIssuedOrderId takes nothing returns integer
// export function GetIssuedOrderId(jassContext) {

// }

// // constant native GetOrderPointX takes nothing returns real
// export function GetOrderPointX(jassContext) {

// }

// // constant native GetOrderPointY takes nothing returns real
// export function GetOrderPointY(jassContext) {

// }

// // constant native GetOrderPointLoc takes nothing returns location
// export function GetOrderPointLoc(jassContext) {

// }

// // constant native GetOrderTarget takes nothing returns widget
// export function GetOrderTarget(jassContext) {

// }

// // constant native GetOrderTargetDestructable takes nothing returns destructable
// export function GetOrderTargetDestructable(jassContext) {

// }

// // constant native GetOrderTargetItem takes nothing returns item
// export function GetOrderTargetItem(jassContext) {

// }

// // constant native GetOrderTargetUnit takes nothing returns unit
// export function GetOrderTargetUnit(jassContext) {

// }

// // constant native GetSpellAbilityUnit takes nothing returns unit
// export function GetSpellAbilityUnit(jassContext) {

// }

// // constant native GetSpellAbilityId takes nothing returns integer
// export function GetSpellAbilityId(jassContext) {

// }

// // constant native GetSpellAbility takes nothing returns ability
// export function GetSpellAbility(jassContext) {

// }

// // constant native GetSpellTargetLoc takes nothing returns location
// export function GetSpellTargetLoc(jassContext) {

// }

// // constant native GetSpellTargetX takes nothing returns real
// export function GetSpellTargetX(jassContext) {

// }

// // constant native GetSpellTargetY takes nothing returns real
// export function GetSpellTargetY(jassContext) {

// }

// // constant native GetSpellTargetDestructable takes nothing returns destructable
// export function GetSpellTargetDestructable(jassContext) {

// }

// // constant native GetSpellTargetItem takes nothing returns item
// export function GetSpellTargetItem(jassContext) {

// }

// // constant native GetSpellTargetUnit takes nothing returns unit
// export function GetSpellTargetUnit(jassContext) {

// }

// // native TriggerRegisterPlayerAllianceChange takes trigger whichTrigger, player whichPlayer, alliancetype whichAlliance returns event
// export function TriggerRegisterPlayerAllianceChange(jassContext, whichTrigger, whichPlayer, whichAlliance) {

// }

// // native TriggerRegisterPlayerStateEvent takes trigger whichTrigger, player whichPlayer, playerstate whichState, limitop opcode, real limitval returns event
// export function TriggerRegisterPlayerStateEvent(jassContext, whichTrigger, whichPlayer, whichState, opcode, limitval) {

// }

// // constant native GetEventPlayerState takes nothing returns playerstate
// export function GetEventPlayerState(jassContext) {

// }

// // native TriggerRegisterPlayerChatEvent takes trigger whichTrigger, player whichPlayer, string chatMessageToDetect, boolean exactMatchOnly returns event
// export function TriggerRegisterPlayerChatEvent(jassContext, whichTrigger, whichPlayer, chatMessageToDetect, exactMatchOnly) {

// }

// // constant native GetEventPlayerChatString takes nothing returns string
// export function GetEventPlayerChatString(jassContext) {

// }

// // constant native GetEventPlayerChatStringMatched takes nothing returns string
// export function GetEventPlayerChatStringMatched(jassContext) {

// }

// // native TriggerRegisterDeathEvent takes trigger whichTrigger, widget whichWidget returns event
// export function TriggerRegisterDeathEvent(jassContext, whichTrigger, whichWidget) {

// }

// // constant native GetTriggerUnit takes nothing returns unit
// export function GetTriggerUnit(jassContext) {

// }

// // native TriggerRegisterUnitStateEvent takes trigger whichTrigger, unit whichUnit, unitstate whichState, limitop opcode, real limitval returns event
// export function TriggerRegisterUnitStateEvent(jassContext, whichTrigger, whichUnit, whichState, opcode, limitval) {

// }

// // constant native GetEventUnitState takes nothing returns unitstate
// export function GetEventUnitState(jassContext) {

// }

// // native TriggerRegisterUnitEvent takes trigger whichTrigger, unit whichUnit, unitevent whichEvent returns event
// export function TriggerRegisterUnitEvent(jassContext, whichTrigger, whichUnit, whichEvent) {

// }

// // constant native GetEventDamage takes nothing returns real
// export function GetEventDamage(jassContext) {

// }

// // constant native GetEventDamageSource takes nothing returns unit
// export function GetEventDamageSource(jassContext) {

// }

// // constant native GetEventDetectingPlayer takes nothing returns player
// export function GetEventDetectingPlayer(jassContext) {

// }

// // native TriggerRegisterFilterUnitEvent takes trigger whichTrigger, unit whichUnit, unitevent whichEvent, boolexpr filter returns event
// export function TriggerRegisterFilterUnitEvent(jassContext, whichTrigger, whichUnit, whichEvent, filter) {

// }

// // constant native GetEventTargetUnit takes nothing returns unit
// export function GetEventTargetUnit(jassContext) {

// }

// // native TriggerRegisterUnitInRange takes trigger whichTrigger, unit whichUnit, real range, boolexpr filter returns event
// export function TriggerRegisterUnitInRange(jassContext, whichTrigger, whichUnit, range, filter) {

// }

// // native TriggerAddCondition takes trigger whichTrigger, boolexpr condition returns triggercondition
// export function TriggerAddCondition(jassContext, whichTrigger, condition) {

// }

// // native TriggerRemoveCondition takes trigger whichTrigger, triggercondition whichCondition returns nothing
// export function TriggerRemoveCondition(jassContext, whichTrigger, whichCondition) {

// }

// // native TriggerClearConditions takes trigger whichTrigger returns nothing
// export function TriggerClearConditions(jassContext, whichTrigger) {

// }

// // native TriggerAddAction takes trigger whichTrigger, code actionFunc returns triggeraction
// export function TriggerAddAction(jassContext, whichTrigger, actionFunc) {

// }

// // native TriggerRemoveAction takes trigger whichTrigger, triggeraction whichAction returns nothing
// export function TriggerRemoveAction(jassContext, whichTrigger, whichAction) {

// }

// // native TriggerClearActions takes trigger whichTrigger returns nothing
// export function TriggerClearActions(jassContext, whichTrigger) {

// }

// // native TriggerSleepAction takes real timeout returns nothing
// export function TriggerSleepAction(jassContext, timeout) {

// }

// // native TriggerWaitForSound takes sound s, real offset returns nothing
// export function TriggerWaitForSound(jassContext, s, offset) {

// }

// // native TriggerEvaluate takes trigger whichTrigger returns boolean
// export function TriggerEvaluate(jassContext, whichTrigger) {

// }

// // native TriggerExecute takes trigger whichTrigger returns nothing
// export function TriggerExecute(jassContext, whichTrigger) {

// }

// // native TriggerExecuteWait takes trigger whichTrigger returns nothing
// export function TriggerExecuteWait(jassContext, whichTrigger) {

// }

// // native TriggerSyncStart takes nothing returns nothing
// export function TriggerSyncStart(jassContext) {

// }

// // native TriggerSyncReady takes nothing returns nothing
// export function TriggerSyncReady(jassContext) {

// }

// // native GetWidgetLife takes widget whichWidget returns real
// export function GetWidgetLife(jassContext, whichWidget) {

// }

// // native SetWidgetLife takes widget whichWidget, real newLife returns nothing
// export function SetWidgetLife(jassContext, whichWidget, newLife) {

// }

// // native GetWidgetX takes widget whichWidget returns real
// export function GetWidgetX(jassContext, whichWidget) {

// }

// // native GetWidgetY takes widget whichWidget returns real
// export function GetWidgetY(jassContext, whichWidget) {

// }

// // constant native GetTriggerWidget takes nothing returns widget
// export function GetTriggerWidget(jassContext) {

// }

// // native CreateDestructable takes integer objectid, real x, real y, real face, real scale, integer variation returns destructable
// export function CreateDestructable(jassContext, objectid, x, y, face, scale, variation) {

// }

// // native CreateDestructableZ takes integer objectid, real x, real y, real z, real face, real scale, integer variation returns destructable
// export function CreateDestructableZ(jassContext, objectid, x, y, z, face, scale, variation) {

// }

// // native CreateDeadDestructable takes integer objectid, real x, real y, real face, real scale, integer variation returns destructable
// export function CreateDeadDestructable(jassContext, objectid, x, y, face, scale, variation) {

// }

// // native CreateDeadDestructableZ takes integer objectid, real x, real y, real z, real face, real scale, integer variation returns destructable
// export function CreateDeadDestructableZ(jassContext, objectid, x, y, z, face, scale, variation) {

// }

// // native RemoveDestructable takes destructable d returns nothing
// export function RemoveDestructable(jassContext, d) {

// }

// // native KillDestructable takes destructable d returns nothing
// export function KillDestructable(jassContext, d) {

// }

// // native SetDestructableInvulnerable takes destructable d, boolean flag returns nothing
// export function SetDestructableInvulnerable(jassContext, d, flag) {

// }

// // native IsDestructableInvulnerable takes destructable d returns boolean
// export function IsDestructableInvulnerable(jassContext, d) {

// }

// // native EnumDestructablesInRect takes rect r, boolexpr filter, code actionFunc returns nothing
// export function EnumDestructablesInRect(jassContext, r, filter, actionFunc) {

// }

// // native GetDestructableTypeId takes destructable d returns integer
// export function GetDestructableTypeId(jassContext, d) {

// }

// // native GetDestructableX takes destructable d returns real
// export function GetDestructableX(jassContext, d) {

// }

// // native GetDestructableY takes destructable d returns real
// export function GetDestructableY(jassContext, d) {

// }

// // native SetDestructableLife takes destructable d, real life returns nothing
// export function SetDestructableLife(jassContext, d, life) {

// }

// // native GetDestructableLife takes destructable d returns real
// export function GetDestructableLife(jassContext, d) {

// }

// // native SetDestructableMaxLife takes destructable d, real max returns nothing
// export function SetDestructableMaxLife(jassContext, d, max) {

// }

// // native GetDestructableMaxLife takes destructable d returns real
// export function GetDestructableMaxLife(jassContext, d) {

// }

// // native DestructableRestoreLife takes destructable d, real life, boolean birth returns nothing
// export function DestructableRestoreLife(jassContext, d, life, birth) {

// }

// // native QueueDestructableAnimation takes destructable d, string whichAnimation returns nothing
// export function QueueDestructableAnimation(jassContext, d, whichAnimation) {

// }

// // native SetDestructableAnimation takes destructable d, string whichAnimation returns nothing
// export function SetDestructableAnimation(jassContext, d, whichAnimation) {

// }

// // native SetDestructableAnimationSpeed takes destructable d, real speedFactor returns nothing
// export function SetDestructableAnimationSpeed(jassContext, d, speedFactor) {

// }

// // native ShowDestructable takes destructable d, boolean flag returns nothing
// export function ShowDestructable(jassContext, d, flag) {

// }

// // native GetDestructableOccluderHeight takes destructable d returns real
// export function GetDestructableOccluderHeight(jassContext, d) {

// }

// // native SetDestructableOccluderHeight takes destructable d, real height returns nothing
// export function SetDestructableOccluderHeight(jassContext, d, height) {

// }

// // native GetDestructableName takes destructable d returns string
// export function GetDestructableName(jassContext, d) {

// }

// // constant native GetTriggerDestructable takes nothing returns destructable
// export function GetTriggerDestructable(jassContext) {

// }

// // native CreateItem takes integer itemid, real x, real y returns item
// export function CreateItem(jassContext, itemid, x, y) {

// }

// // native RemoveItem takes item whichItem returns nothing
// export function RemoveItem(jassContext, whichItem) {

// }

// // native GetItemPlayer takes item whichItem returns player
// export function GetItemPlayer(jassContext, whichItem) {

// }

// // native GetItemTypeId takes item i returns integer
// export function GetItemTypeId(jassContext, i) {

// }

// // native GetItemX takes item i returns real
// export function GetItemX(jassContext, i) {

// }

// // native GetItemY takes item i returns real
// export function GetItemY(jassContext, i) {

// }

// // native SetItemPosition takes item i, real x, real y returns nothing
// export function SetItemPosition(jassContext, i, x, y) {

// }

// // native SetItemDropOnDeath takes item whichItem, boolean flag returns nothing
// export function SetItemDropOnDeath(jassContext, whichItem, flag) {

// }

// // native SetItemDroppable takes item i, boolean flag returns nothing
// export function SetItemDroppable(jassContext, i, flag) {

// }

// // native SetItemPawnable takes item i, boolean flag returns nothing
// export function SetItemPawnable(jassContext, i, flag) {

// }

// // native SetItemPlayer takes item whichItem, player whichPlayer, boolean changeColor returns nothing
// export function SetItemPlayer(jassContext, whichItem, whichPlayer, changeColor) {

// }

// // native SetItemInvulnerable takes item whichItem, boolean flag returns nothing
// export function SetItemInvulnerable(jassContext, whichItem, flag) {

// }

// // native IsItemInvulnerable takes item whichItem returns boolean
// export function IsItemInvulnerable(jassContext, whichItem) {

// }

// // native SetItemVisible takes item whichItem, boolean show returns nothing
// export function SetItemVisible(jassContext, whichItem, show) {

// }

// // native IsItemVisible takes item whichItem returns boolean
// export function IsItemVisible(jassContext, whichItem) {

// }

// // native IsItemOwned takes item whichItem returns boolean
// export function IsItemOwned(jassContext, whichItem) {

// }

// // native IsItemPowerup takes item whichItem returns boolean
// export function IsItemPowerup(jassContext, whichItem) {

// }

// // native IsItemSellable takes item whichItem returns boolean
// export function IsItemSellable(jassContext, whichItem) {

// }

// // native IsItemPawnable takes item whichItem returns boolean
// export function IsItemPawnable(jassContext, whichItem) {

// }

// // native IsItemIdPowerup takes integer itemId returns boolean
// export function IsItemIdPowerup(jassContext, itemId) {

// }

// // native IsItemIdSellable takes integer itemId returns boolean
// export function IsItemIdSellable(jassContext, itemId) {

// }

// // native IsItemIdPawnable takes integer itemId returns boolean
// export function IsItemIdPawnable(jassContext, itemId) {

// }

// // native EnumItemsInRect takes rect r, boolexpr filter, code actionFunc returns nothing
// export function EnumItemsInRect(jassContext, r, filter, actionFunc) {

// }

// // native GetItemLevel takes item whichItem returns integer
// export function GetItemLevel(jassContext, whichItem) {

// }

// // native GetItemType takes item whichItem returns itemtype
// export function GetItemType(jassContext, whichItem) {

// }

// // native SetItemDropID takes item whichItem, integer unitId returns nothing
// export function SetItemDropID(jassContext, whichItem, unitId) {

// }

// // constant native GetItemName takes item whichItem returns string
// export function GetItemName(jassContext, whichItem) {

// }

// // native GetItemCharges takes item whichItem returns integer
// export function GetItemCharges(jassContext, whichItem) {

// }

// // native SetItemCharges takes item whichItem, integer charges returns nothing
// export function SetItemCharges(jassContext, whichItem, charges) {

// }

// // native GetItemUserData takes item whichItem returns integer
// export function GetItemUserData(jassContext, whichItem) {

// }

// // native SetItemUserData takes item whichItem, integer data returns nothing
// export function SetItemUserData(jassContext, whichItem, data) {

// }

// native CreateUnit takes player id, integer unitid, real x, real y, real face returns unit
export function CreateUnit(jassContext, id, unitid, x, y, face) {
    return jassContext.addHandle(new JassUnit(jassContext, id, uintToTag(unitid), x, y, face));
}

// // native CreateUnitByName takes player whichPlayer, string unitname, real x, real y, real face returns unit
// export function CreateUnitByName(jassContext, whichPlayer, unitname, x, y, face) {

// }

// native CreateUnitAtLoc takes player id, integer unitid, location whichLocation, real face returns unit
export function CreateUnitAtLoc(jassContext, id, unitid, whichLocation, face) {
    return CreateUnit(jassContext, id, unitid, whichLocation.x, whichLocation.y, face);
}

// // native CreateUnitAtLocByName takes player id, string unitname, location whichLocation, real face returns unit
// export function CreateUnitAtLocByName(jassContext, id, unitname, whichLocation, face) {

// }

// // native CreateCorpse takes player whichPlayer, integer unitid, real x, real y, real face returns unit
// export function CreateCorpse(jassContext, whichPlayer, unitid, x, y, face) {

// }

// // native KillUnit takes unit whichUnit returns nothing
// export function KillUnit(jassContext, whichUnit) {

// }

// // native RemoveUnit takes unit whichUnit returns nothing
// export function RemoveUnit(jassContext, whichUnit) {

// }

// // native ShowUnit takes unit whichUnit, boolean show returns nothing
// export function ShowUnit(jassContext, whichUnit, show) {

// }

// native SetUnitState takes unit whichUnit, unitstate whichUnitState, real newVal returns nothing
export function SetUnitState(jassContext, whichUnit, whichUnitState, newVal) {
    if (whichUnitState.value === 0) {
        whichUnit.health = newVal;
    } else if (whichUnitState.value === 2) {
        whichUnit.mana = newVal;
    }
}

// native SetUnitX takes unit whichUnit, real newX returns nothing
export function SetUnitX(jassContext, whichUnit, newX) {
    whichUnit.location[0] = newX;
}

// native SetUnitY takes unit whichUnit, real newY returns nothing
export function SetUnitY(jassContext, whichUnit, newY) {
    whichUnit.location[1] = newY;
}

// native SetUnitPosition takes unit whichUnit, real newX, real newY returns nothing
export function SetUnitPosition(jassContext, whichUnit, newX, newY) {
    whichUnit.location[0] = newX;
    whichUnit.location[1] = newY;
}

// native SetUnitPositionLoc takes unit whichUnit, location whichLocation returns nothing
export function SetUnitPositionLoc(jassContext, whichUnit, whichLocation) {
    whichUnit.location[0] = whichLocation.x;
    whichUnit.location[1] = whichLocation.y;
}

// native SetUnitFacing takes unit whichUnit, real facingAngle returns nothing
export function SetUnitFacing(jassContext, whichUnit, facingAngle) {
    whichUnit.facing = facingAngle;
}

// // native SetUnitFacingTimed takes unit whichUnit, real facingAngle, real duration returns nothing
// export function SetUnitFacingTimed(jassContext, whichUnit, facingAngle, duration) {

// }

// // native SetUnitMoveSpeed takes unit whichUnit, real newSpeed returns nothing
// export function SetUnitMoveSpeed(jassContext, whichUnit, newSpeed) {

// }

// // native SetUnitFlyHeight takes unit whichUnit, real newHeight, real rate returns nothing
// export function SetUnitFlyHeight(jassContext, whichUnit, newHeight, rate) {

// }

// // native SetUnitTurnSpeed takes unit whichUnit, real newTurnSpeed returns nothing
// export function SetUnitTurnSpeed(jassContext, whichUnit, newTurnSpeed) {

// }

// // native SetUnitPropWindow takes unit whichUnit, real newPropWindowAngle returns nothing
// export function SetUnitPropWindow(jassContext, whichUnit, newPropWindowAngle) {

// }

// native SetUnitAcquireRange takes unit whichUnit, real newAcquireRange returns nothing
export function SetUnitAcquireRange(jassContext, whichUnit, newAcquireRange) {
    whichUnit.acquireRange = newAcquireRange;
}

// // native SetUnitCreepGuard takes unit whichUnit, boolean creepGuard returns nothing
// export function SetUnitCreepGuard(jassContext, whichUnit, creepGuard) {

// }

// native GetUnitAcquireRange takes unit whichUnit returns real
export function GetUnitAcquireRange(jassContext, whichUnit) {
    return whichUnit.acquireRange;
}

// // native GetUnitTurnSpeed takes unit whichUnit returns real
// export function GetUnitTurnSpeed(jassContext, whichUnit) {

// }

// // native GetUnitPropWindow takes unit whichUnit returns real
// export function GetUnitPropWindow(jassContext, whichUnit) {

// }

// // native GetUnitFlyHeight takes unit whichUnit returns real
// export function GetUnitFlyHeight(jassContext, whichUnit) {

// }

// // native GetUnitDefaultAcquireRange takes unit whichUnit returns real
// export function GetUnitDefaultAcquireRange(jassContext, whichUnit) {

// }

// // native GetUnitDefaultTurnSpeed takes unit whichUnit returns real
// export function GetUnitDefaultTurnSpeed(jassContext, whichUnit) {

// }

// // native GetUnitDefaultPropWindow takes unit whichUnit returns real
// export function GetUnitDefaultPropWindow(jassContext, whichUnit) {

// }

// // native GetUnitDefaultFlyHeight takes unit whichUnit returns real
// export function GetUnitDefaultFlyHeight(jassContext, whichUnit) {

// }

// // native SetUnitOwner takes unit whichUnit, player whichPlayer, boolean changeColor returns nothing
// export function SetUnitOwner(jassContext, whichUnit, whichPlayer, changeColor) {

// }

// // native SetUnitColor takes unit whichUnit, playercolor whichColor returns nothing
// export function SetUnitColor(jassContext, whichUnit, whichColor) {

// }

// // native SetUnitScale takes unit whichUnit, real scaleX, real scaleY, real scaleZ returns nothing
// export function SetUnitScale(jassContext, whichUnit, scaleX, scaleY, scaleZ) {

// }

// // native SetUnitTimeScale takes unit whichUnit, real timeScale returns nothing
// export function SetUnitTimeScale(jassContext, whichUnit, timeScale) {

// }

// // native SetUnitBlendTime takes unit whichUnit, real blendTime returns nothing
// export function SetUnitBlendTime(jassContext, whichUnit, blendTime) {

// }

// // native SetUnitVertexColor takes unit whichUnit, integer red, integer green, integer blue, integer alpha returns nothing
// export function SetUnitVertexColor(jassContext, whichUnit, red, green, blue, alpha) {

// }

// // native QueueUnitAnimation takes unit whichUnit, string whichAnimation returns nothing
// export function QueueUnitAnimation(jassContext, whichUnit, whichAnimation) {

// }

// // native SetUnitAnimation takes unit whichUnit, string whichAnimation returns nothing
// export function SetUnitAnimation(jassContext, whichUnit, whichAnimation) {

// }

// // native SetUnitAnimationByIndex takes unit whichUnit, integer whichAnimation returns nothing
// export function SetUnitAnimationByIndex(jassContext, whichUnit, whichAnimation) {

// }

// // native SetUnitAnimationWithRarity takes unit whichUnit, string whichAnimation, raritycontrol rarity returns nothing
// export function SetUnitAnimationWithRarity(jassContext, whichUnit, whichAnimation, rarity) {

// }

// // native AddUnitAnimationProperties takes unit whichUnit, string animProperties, boolean add returns nothing
// export function AddUnitAnimationProperties(jassContext, whichUnit, animProperties, add) {

// }

// // native SetUnitLookAt takes unit whichUnit, string whichBone, unit lookAtTarget, real offsetX, real offsetY, real offsetZ returns nothing
// export function SetUnitLookAt(jassContext, whichUnit, whichBone, lookAtTarget, offsetX, offsetY, offsetZ) {

// }

// // native ResetUnitLookAt takes unit whichUnit returns nothing
// export function ResetUnitLookAt(jassContext, whichUnit) {

// }

// // native SetUnitRescuable takes unit whichUnit, player byWhichPlayer, boolean flag returns nothing
// export function SetUnitRescuable(jassContext, whichUnit, byWhichPlayer, flag) {

// }

// // native SetUnitRescueRange takes unit whichUnit, real range returns nothing
// export function SetUnitRescueRange(jassContext, whichUnit, range) {

// }

// // native SetHeroStr takes unit whichHero, integer newStr, boolean permanent returns nothing
// export function SetHeroStr(jassContext, whichHero, newStr, permanent) {

// }

// // native SetHeroAgi takes unit whichHero, integer newAgi, boolean permanent returns nothing
// export function SetHeroAgi(jassContext, whichHero, newAgi, permanent) {

// }

// // native SetHeroInt takes unit whichHero, integer newInt, boolean permanent returns nothing
// export function SetHeroInt(jassContext, whichHero, newInt, permanent) {

// }

// // native GetHeroStr takes unit whichHero, boolean includeBonuses returns integer
// export function GetHeroStr(jassContext, whichHero, includeBonuses) {

// }

// // native GetHeroAgi takes unit whichHero, boolean includeBonuses returns integer
// export function GetHeroAgi(jassContext, whichHero, includeBonuses) {

// }

// // native GetHeroInt takes unit whichHero, boolean includeBonuses returns integer
// export function GetHeroInt(jassContext, whichHero, includeBonuses) {

// }

// // native UnitStripHeroLevel takes unit whichHero, integer howManyLevels returns boolean
// export function UnitStripHeroLevel(jassContext, whichHero, howManyLevels) {

// }

// // native GetHeroXP takes unit whichHero returns integer
// export function GetHeroXP(jassContext, whichHero) {

// }

// // native SetHeroXP takes unit whichHero, integer newXpVal, boolean showEyeCandy returns nothing
// export function SetHeroXP(jassContext, whichHero, newXpVal, showEyeCandy) {

// }

// // native GetHeroSkillPoints takes unit whichHero returns integer
// export function GetHeroSkillPoints(jassContext, whichHero) {

// }

// // native UnitModifySkillPoints takes unit whichHero, integer skillPointDelta returns boolean
// export function UnitModifySkillPoints(jassContext, whichHero, skillPointDelta) {

// }

// // native AddHeroXP takes unit whichHero, integer xpToAdd, boolean showEyeCandy returns nothing
// export function AddHeroXP(jassContext, whichHero, xpToAdd, showEyeCandy) {

// }

// // native SetHeroLevel takes unit whichHero, integer level, boolean showEyeCandy returns nothing
// export function SetHeroLevel(jassContext, whichHero, level, showEyeCandy) {

// }

// // constant native GetHeroLevel takes unit whichHero returns integer
// export function GetHeroLevel(jassContext, whichHero) {

// }

// // constant native GetUnitLevel takes unit whichUnit returns integer
// export function GetUnitLevel(jassContext, whichUnit) {

// }

// // native GetHeroProperName takes unit whichHero returns string
// export function GetHeroProperName(jassContext, whichHero) {

// }

// // native SuspendHeroXP takes unit whichHero, boolean flag returns nothing
// export function SuspendHeroXP(jassContext, whichHero, flag) {

// }

// // native IsSuspendedXP takes unit whichHero returns boolean
// export function IsSuspendedXP(jassContext, whichHero) {

// }

// // native SelectHeroSkill takes unit whichHero, integer abilcode returns nothing
// export function SelectHeroSkill(jassContext, whichHero, abilcode) {

// }

// // native GetUnitAbilityLevel takes unit whichUnit, integer abilcode returns integer
// export function GetUnitAbilityLevel(jassContext, whichUnit, abilcode) {

// }

// // native DecUnitAbilityLevel takes unit whichUnit, integer abilcode returns integer
// export function DecUnitAbilityLevel(jassContext, whichUnit, abilcode) {

// }

// // native IncUnitAbilityLevel takes unit whichUnit, integer abilcode returns integer
// export function IncUnitAbilityLevel(jassContext, whichUnit, abilcode) {

// }

// // native SetUnitAbilityLevel takes unit whichUnit, integer abilcode, integer level returns integer
// export function SetUnitAbilityLevel(jassContext, whichUnit, abilcode, level) {

// }

// // native ReviveHero takes unit whichHero, real x, real y, boolean doEyecandy returns boolean
// export function ReviveHero(jassContext, whichHero, x, y, doEyecandy) {

// }

// // native ReviveHeroLoc takes unit whichHero, location loc, boolean doEyecandy returns boolean
// export function ReviveHeroLoc(jassContext, whichHero, loc, doEyecandy) {

// }

// // native SetUnitExploded takes unit whichUnit, boolean exploded returns nothing
// export function SetUnitExploded(jassContext, whichUnit, exploded) {

// }

// // native SetUnitInvulnerable takes unit whichUnit, boolean flag returns nothing
// export function SetUnitInvulnerable(jassContext, whichUnit, flag) {

// }

// // native PauseUnit takes unit whichUnit, boolean flag returns nothing
// export function PauseUnit(jassContext, whichUnit, flag) {

// }

// // native IsUnitPaused takes unit whichHero returns boolean
// export function IsUnitPaused(jassContext, whichHero) {

// }

// // native SetUnitPathing takes unit whichUnit, boolean flag returns nothing
// export function SetUnitPathing(jassContext, whichUnit, flag) {

// }

// // native ClearSelection takes nothing returns nothing
// export function ClearSelection(jassContext) {

// }

// // native SelectUnit takes unit whichUnit, boolean flag returns nothing
// export function SelectUnit(jassContext, whichUnit, flag) {

// }

// // native GetUnitPointValue takes unit whichUnit returns integer
// export function GetUnitPointValue(jassContext, whichUnit) {

// }

// // native GetUnitPointValueByType takes integer unitType returns integer
// export function GetUnitPointValueByType(jassContext, unitType) {

// }

// // native UnitAddItem takes unit whichUnit, item whichItem returns boolean
// export function UnitAddItem(jassContext, whichUnit, whichItem) {

// }

// // native UnitAddItemById takes unit whichUnit, integer itemId returns item
// export function UnitAddItemById(jassContext, whichUnit, itemId) {

// }

// // native UnitAddItemToSlotById takes unit whichUnit, integer itemId, integer itemSlot returns boolean
// export function UnitAddItemToSlotById(jassContext, whichUnit, itemId, itemSlot) {

// }

// // native UnitRemoveItem takes unit whichUnit, item whichItem returns nothing
// export function UnitRemoveItem(jassContext, whichUnit, whichItem) {

// }

// // native UnitRemoveItemFromSlot takes unit whichUnit, integer itemSlot returns item
// export function UnitRemoveItemFromSlot(jassContext, whichUnit, itemSlot) {

// }

// // native UnitHasItem takes unit whichUnit, item whichItem returns boolean
// export function UnitHasItem(jassContext, whichUnit, whichItem) {

// }

// // native UnitItemInSlot takes unit whichUnit, integer itemSlot returns item
// export function UnitItemInSlot(jassContext, whichUnit, itemSlot) {

// }

// // native UnitInventorySize takes unit whichUnit returns integer
// export function UnitInventorySize(jassContext, whichUnit) {

// }

// // native UnitDropItemPoint takes unit whichUnit, item whichItem, real x, real y returns boolean
// export function UnitDropItemPoint(jassContext, whichUnit, whichItem, x, y) {

// }

// // native UnitDropItemSlot takes unit whichUnit, item whichItem, integer slot returns boolean
// export function UnitDropItemSlot(jassContext, whichUnit, whichItem, slot) {

// }

// // native UnitDropItemTarget takes unit whichUnit, item whichItem, widget target returns boolean
// export function UnitDropItemTarget(jassContext, whichUnit, whichItem, target) {

// }

// // native UnitUseItem takes unit whichUnit, item whichItem returns boolean
// export function UnitUseItem(jassContext, whichUnit, whichItem) {

// }

// // native UnitUseItemPoint takes unit whichUnit, item whichItem, real x, real y returns boolean
// export function UnitUseItemPoint(jassContext, whichUnit, whichItem, x, y) {

// }

// // native UnitUseItemTarget takes unit whichUnit, item whichItem, widget target returns boolean
// export function UnitUseItemTarget(jassContext, whichUnit, whichItem, target) {

// }

// // constant native GetUnitX takes unit whichUnit returns real
// export function GetUnitX(jassContext, whichUnit) {

// }

// // constant native GetUnitY takes unit whichUnit returns real
// export function GetUnitY(jassContext, whichUnit) {

// }

// // constant native GetUnitLoc takes unit whichUnit returns location
// export function GetUnitLoc(jassContext, whichUnit) {

// }

// // constant native GetUnitFacing takes unit whichUnit returns real
// export function GetUnitFacing(jassContext, whichUnit) {

// }

// // constant native GetUnitMoveSpeed takes unit whichUnit returns real
// export function GetUnitMoveSpeed(jassContext, whichUnit) {

// }

// // constant native GetUnitDefaultMoveSpeed takes unit whichUnit returns real
// export function GetUnitDefaultMoveSpeed(jassContext, whichUnit) {

// }

// constant native GetUnitState takes unit whichUnit, unitstate whichUnitState returns real
export function GetUnitState(jassContext, whichUnit, whichUnitState) {
    if (whichUnitState.value === 0) {
        return whichUnit.health;
    } else if (whichUnitState.value === 1) {
        return whichUnit.maxHealth
    } else if (whichUnitState.value === 2) {
        return whichUnit.mana;
    } else if (whichUnitState.value === 3) {
        return whichUnit.maxMana;
    }
}

// constant native GetOwningPlayer takes unit whichUnit returns player
export function GetOwningPlayer(jassContext, whichUnit) {
    return whichUnit.player;
}

// // constant native GetUnitTypeId takes unit whichUnit returns integer
// export function GetUnitTypeId(jassContext, whichUnit) {

// }

// // constant native GetUnitRace takes unit whichUnit returns race
// export function GetUnitRace(jassContext, whichUnit) {

// }

// // constant native GetUnitName takes unit whichUnit returns string
// export function GetUnitName(jassContext, whichUnit) {

// }

// // constant native GetUnitFoodUsed takes unit whichUnit returns integer
// export function GetUnitFoodUsed(jassContext, whichUnit) {

// }

// // constant native GetUnitFoodMade takes unit whichUnit returns integer
// export function GetUnitFoodMade(jassContext, whichUnit) {

// }

// // constant native GetFoodMade takes integer unitId returns integer
// export function GetFoodMade(jassContext, unitId) {

// }

// // constant native GetFoodUsed takes integer unitId returns integer
// export function GetFoodUsed(jassContext, unitId) {

// }

// // native SetUnitUseFood takes unit whichUnit, boolean useFood returns nothing
// export function SetUnitUseFood(jassContext, whichUnit, useFood) {

// }

// // constant native GetUnitRallyPoint takes unit whichUnit returns location
// export function GetUnitRallyPoint(jassContext, whichUnit) {

// }

// // constant native GetUnitRallyUnit takes unit whichUnit returns unit
// export function GetUnitRallyUnit(jassContext, whichUnit) {

// }

// // constant native GetUnitRallyDestructable takes unit whichUnit returns destructable
// export function GetUnitRallyDestructable(jassContext, whichUnit) {

// }

// // constant native IsUnitInGroup takes unit whichUnit, group whichGroup returns boolean
// export function IsUnitInGroup(jassContext, whichUnit, whichGroup) {

// }

// // constant native IsUnitInForce takes unit whichUnit, force whichForce returns boolean
// export function IsUnitInForce(jassContext, whichUnit, whichForce) {

// }

// // constant native IsUnitOwnedByPlayer takes unit whichUnit, player whichPlayer returns boolean
// export function IsUnitOwnedByPlayer(jassContext, whichUnit, whichPlayer) {

// }

// // constant native IsUnitAlly takes unit whichUnit, player whichPlayer returns boolean
// export function IsUnitAlly(jassContext, whichUnit, whichPlayer) {

// }

// // constant native IsUnitEnemy takes unit whichUnit, player whichPlayer returns boolean
// export function IsUnitEnemy(jassContext, whichUnit, whichPlayer) {

// }

// // constant native IsUnitVisible takes unit whichUnit, player whichPlayer returns boolean
// export function IsUnitVisible(jassContext, whichUnit, whichPlayer) {

// }

// // constant native IsUnitDetected takes unit whichUnit, player whichPlayer returns boolean
// export function IsUnitDetected(jassContext, whichUnit, whichPlayer) {

// }

// // constant native IsUnitInvisible takes unit whichUnit, player whichPlayer returns boolean
// export function IsUnitInvisible(jassContext, whichUnit, whichPlayer) {

// }

// // constant native IsUnitFogged takes unit whichUnit, player whichPlayer returns boolean
// export function IsUnitFogged(jassContext, whichUnit, whichPlayer) {

// }

// // constant native IsUnitMasked takes unit whichUnit, player whichPlayer returns boolean
// export function IsUnitMasked(jassContext, whichUnit, whichPlayer) {

// }

// // constant native IsUnitSelected takes unit whichUnit, player whichPlayer returns boolean
// export function IsUnitSelected(jassContext, whichUnit, whichPlayer) {

// }

// // constant native IsUnitRace takes unit whichUnit, race whichRace returns boolean
// export function IsUnitRace(jassContext, whichUnit, whichRace) {

// }

// // constant native IsUnitType takes unit whichUnit, unittype whichUnitType returns boolean
// export function IsUnitType(jassContext, whichUnit, whichUnitType) {

// }

// // constant native IsUnit takes unit whichUnit, unit whichSpecifiedUnit returns boolean
// export function IsUnit(jassContext, whichUnit, whichSpecifiedUnit) {

// }

// // constant native IsUnitInRange takes unit whichUnit, unit otherUnit, real distance returns boolean
// export function IsUnitInRange(jassContext, whichUnit, otherUnit, distance) {

// }

// // constant native IsUnitInRangeXY takes unit whichUnit, real x, real y, real distance returns boolean
// export function IsUnitInRangeXY(jassContext, whichUnit, x, y, distance) {

// }

// // constant native IsUnitInRangeLoc takes unit whichUnit, location whichLocation, real distance returns boolean
// export function IsUnitInRangeLoc(jassContext, whichUnit, whichLocation, distance) {

// }

// // constant native IsUnitHidden takes unit whichUnit returns boolean
// export function IsUnitHidden(jassContext, whichUnit) {

// }

// // constant native IsUnitIllusion takes unit whichUnit returns boolean
// export function IsUnitIllusion(jassContext, whichUnit) {

// }

// // constant native IsUnitInTransport takes unit whichUnit, unit whichTransport returns boolean
// export function IsUnitInTransport(jassContext, whichUnit, whichTransport) {

// }

// // constant native IsUnitLoaded takes unit whichUnit returns boolean
// export function IsUnitLoaded(jassContext, whichUnit) {

// }

// // constant native IsHeroUnitId takes integer unitId returns boolean
// export function IsHeroUnitId(jassContext, unitId) {

// }

// // constant native IsUnitIdType takes integer unitId, unittype whichUnitType returns boolean
// export function IsUnitIdType(jassContext, unitId, whichUnitType) {

// }

// // native UnitShareVision takes unit whichUnit, player whichPlayer, boolean share returns nothing
// export function UnitShareVision(jassContext, whichUnit, whichPlayer, share) {

// }

// // native UnitSuspendDecay takes unit whichUnit, boolean suspend returns nothing
// export function UnitSuspendDecay(jassContext, whichUnit, suspend) {

// }

// // native UnitAddType takes unit whichUnit, unittype whichUnitType returns boolean
// export function UnitAddType(jassContext, whichUnit, whichUnitType) {

// }

// // native UnitRemoveType takes unit whichUnit, unittype whichUnitType returns boolean
// export function UnitRemoveType(jassContext, whichUnit, whichUnitType) {

// }

// // native UnitAddAbility takes unit whichUnit, integer abilityId returns boolean
// export function UnitAddAbility(jassContext, whichUnit, abilityId) {

// }

// // native UnitRemoveAbility takes unit whichUnit, integer abilityId returns boolean
// export function UnitRemoveAbility(jassContext, whichUnit, abilityId) {

// }

// // native UnitMakeAbilityPermanent takes unit whichUnit, boolean permanent, integer abilityId returns boolean
// export function UnitMakeAbilityPermanent(jassContext, whichUnit, permanent, abilityId) {

// }

// // native UnitRemoveBuffs takes unit whichUnit, boolean removePositive, boolean removeNegative returns nothing
// export function UnitRemoveBuffs(jassContext, whichUnit, removePositive, removeNegative) {

// }

// // native UnitRemoveBuffsEx takes unit whichUnit, boolean removePositive, boolean removeNegative, boolean magic, boolean physical, boolean timedLife, boolean aura, boolean autoDispel returns nothing
// export function UnitRemoveBuffsEx(jassContext, whichUnit, removePositive, removeNegative, magic, physical, timedLife, aura, autoDispel) {

// }

// // native UnitHasBuffsEx takes unit whichUnit, boolean removePositive, boolean removeNegative, boolean magic, boolean physical, boolean timedLife, boolean aura, boolean autoDispel returns boolean
// export function UnitHasBuffsEx(jassContext, whichUnit, removePositive, removeNegative, magic, physical, timedLife, aura, autoDispel) {

// }

// // native UnitCountBuffsEx takes unit whichUnit, boolean removePositive, boolean removeNegative, boolean magic, boolean physical, boolean timedLife, boolean aura, boolean autoDispel returns integer
// export function UnitCountBuffsEx(jassContext, whichUnit, removePositive, removeNegative, magic, physical, timedLife, aura, autoDispel) {

// }

// // native UnitAddSleep takes unit whichUnit, boolean add returns nothing
// export function UnitAddSleep(jassContext, whichUnit, add) {

// }

// // native UnitCanSleep takes unit whichUnit returns boolean
// export function UnitCanSleep(jassContext, whichUnit) {

// }

// // native UnitAddSleepPerm takes unit whichUnit, boolean add returns nothing
// export function UnitAddSleepPerm(jassContext, whichUnit, add) {

// }

// // native UnitCanSleepPerm takes unit whichUnit returns boolean
// export function UnitCanSleepPerm(jassContext, whichUnit) {

// }

// // native UnitIsSleeping takes unit whichUnit returns boolean
// export function UnitIsSleeping(jassContext, whichUnit) {

// }

// // native UnitWakeUp takes unit whichUnit returns nothing
// export function UnitWakeUp(jassContext, whichUnit) {

// }

// // native UnitApplyTimedLife takes unit whichUnit, integer buffId, real duration returns nothing
// export function UnitApplyTimedLife(jassContext, whichUnit, buffId, duration) {

// }

// // native UnitIgnoreAlarm takes unit whichUnit, boolean flag returns boolean
// export function UnitIgnoreAlarm(jassContext, whichUnit, flag) {

// }

// // native UnitIgnoreAlarmToggled takes unit whichUnit returns boolean
// export function UnitIgnoreAlarmToggled(jassContext, whichUnit) {

// }

// // native UnitResetCooldown takes unit whichUnit returns nothing
// export function UnitResetCooldown(jassContext, whichUnit) {

// }

// // native UnitSetConstructionProgress takes unit whichUnit, integer constructionPercentage returns nothing
// export function UnitSetConstructionProgress(jassContext, whichUnit, constructionPercentage) {

// }

// // native UnitSetUpgradeProgress takes unit whichUnit, integer upgradePercentage returns nothing
// export function UnitSetUpgradeProgress(jassContext, whichUnit, upgradePercentage) {

// }

// // native UnitPauseTimedLife takes unit whichUnit, boolean flag returns nothing
// export function UnitPauseTimedLife(jassContext, whichUnit, flag) {

// }

// // native UnitSetUsesAltIcon takes unit whichUnit, boolean flag returns nothing
// export function UnitSetUsesAltIcon(jassContext, whichUnit, flag) {

// }

// // native UnitDamagePoint takes unit whichUnit, real delay, real radius, real x, real y, real amount, boolean attack, boolean ranged, attacktype attackType, damagetype damageType, weapontype weaponType returns boolean
// export function UnitDamagePoint(jassContext, whichUnit, delay, radius, x, y, amount, attack, ranged, attackType, damageType, weaponType) {

// }

// // native UnitDamageTarget takes unit whichUnit, widget target, real amount, boolean attack, boolean ranged, attacktype attackType, damagetype damageType, weapontype weaponType returns boolean
// export function UnitDamageTarget(jassContext, whichUnit, target, amount, attack, ranged, attackType, damageType, weaponType) {

// }

// // native IssueImmediateOrder takes unit whichUnit, string order returns boolean
// export function IssueImmediateOrder(jassContext, whichUnit, order) {

// }

// // native IssueImmediateOrderById takes unit whichUnit, integer order returns boolean
// export function IssueImmediateOrderById(jassContext, whichUnit, order) {

// }

// // native IssuePointOrder takes unit whichUnit, string order, real x, real y returns boolean
// export function IssuePointOrder(jassContext, whichUnit, order, x, y) {

// }

// // native IssuePointOrderLoc takes unit whichUnit, string order, location whichLocation returns boolean
// export function IssuePointOrderLoc(jassContext, whichUnit, order, whichLocation) {

// }

// // native IssuePointOrderById takes unit whichUnit, integer order, real x, real y returns boolean
// export function IssuePointOrderById(jassContext, whichUnit, order, x, y) {

// }

// // native IssuePointOrderByIdLoc takes unit whichUnit, integer order, location whichLocation returns boolean
// export function IssuePointOrderByIdLoc(jassContext, whichUnit, order, whichLocation) {

// }

// // native IssueTargetOrder takes unit whichUnit, string order, widget targetWidget returns boolean
// export function IssueTargetOrder(jassContext, whichUnit, order, targetWidget) {

// }

// // native IssueTargetOrderById takes unit whichUnit, integer order, widget targetWidget returns boolean
// export function IssueTargetOrderById(jassContext, whichUnit, order, targetWidget) {

// }

// // native IssueInstantPointOrder takes unit whichUnit, string order, real x, real y, widget instantTargetWidget returns boolean
// export function IssueInstantPointOrder(jassContext, whichUnit, order, x, y, instantTargetWidget) {

// }

// // native IssueInstantPointOrderById takes unit whichUnit, integer order, real x, real y, widget instantTargetWidget returns boolean
// export function IssueInstantPointOrderById(jassContext, whichUnit, order, x, y, instantTargetWidget) {

// }

// // native IssueInstantTargetOrder takes unit whichUnit, string order, widget targetWidget, widget instantTargetWidget returns boolean
// export function IssueInstantTargetOrder(jassContext, whichUnit, order, targetWidget, instantTargetWidget) {

// }

// // native IssueInstantTargetOrderById takes unit whichUnit, integer order, widget targetWidget, widget instantTargetWidget returns boolean
// export function IssueInstantTargetOrderById(jassContext, whichUnit, order, targetWidget, instantTargetWidget) {

// }

// // native IssueBuildOrder takes unit whichPeon, string unitToBuild, real x, real y returns boolean
// export function IssueBuildOrder(jassContext, whichPeon, unitToBuild, x, y) {

// }

// // native IssueBuildOrderById takes unit whichPeon, integer unitId, real x, real y returns boolean
// export function IssueBuildOrderById(jassContext, whichPeon, unitId, x, y) {

// }

// // native IssueNeutralImmediateOrder takes player forWhichPlayer, unit neutralStructure, string unitToBuild returns boolean
// export function IssueNeutralImmediateOrder(jassContext, forWhichPlayer, neutralStructure, unitToBuild) {

// }

// // native IssueNeutralImmediateOrderById takes player forWhichPlayer, unit neutralStructure, integer unitId returns boolean
// export function IssueNeutralImmediateOrderById(jassContext, forWhichPlayer, neutralStructure, unitId) {

// }

// // native IssueNeutralPointOrder takes player forWhichPlayer, unit neutralStructure, string unitToBuild, real x, real y returns boolean
// export function IssueNeutralPointOrder(jassContext, forWhichPlayer, neutralStructure, unitToBuild, x, y) {

// }

// // native IssueNeutralPointOrderById takes player forWhichPlayer, unit neutralStructure, integer unitId, real x, real y returns boolean
// export function IssueNeutralPointOrderById(jassContext, forWhichPlayer, neutralStructure, unitId, x, y) {

// }

// // native IssueNeutralTargetOrder takes player forWhichPlayer, unit neutralStructure, string unitToBuild, widget target returns boolean
// export function IssueNeutralTargetOrder(jassContext, forWhichPlayer, neutralStructure, unitToBuild, target) {

// }

// // native IssueNeutralTargetOrderById takes player forWhichPlayer, unit neutralStructure, integer unitId, widget target returns boolean
// export function IssueNeutralTargetOrderById(jassContext, forWhichPlayer, neutralStructure, unitId, target) {

// }

// // native GetUnitCurrentOrder takes unit whichUnit returns integer
// export function GetUnitCurrentOrder(jassContext, whichUnit) {

// }

// // native SetResourceAmount takes unit whichUnit, integer amount returns nothing
// export function SetResourceAmount(jassContext, whichUnit, amount) {

// }

// // native AddResourceAmount takes unit whichUnit, integer amount returns nothing
// export function AddResourceAmount(jassContext, whichUnit, amount) {

// }

// // native GetResourceAmount takes unit whichUnit returns integer
// export function GetResourceAmount(jassContext, whichUnit) {

// }

// // native WaygateGetDestinationX takes unit waygate returns real
// export function WaygateGetDestinationX(jassContext, waygate) {

// }

// // native WaygateGetDestinationY takes unit waygate returns real
// export function WaygateGetDestinationY(jassContext, waygate) {

// }

// // native WaygateSetDestination takes unit waygate, real x, real y returns nothing
// export function WaygateSetDestination(jassContext, waygate, x, y) {

// }

// // native WaygateActivate takes unit waygate, boolean activate returns nothing
// export function WaygateActivate(jassContext, waygate, activate) {

// }

// // native WaygateIsActive takes unit waygate returns boolean
// export function WaygateIsActive(jassContext, waygate) {

// }

// // native AddItemToAllStock takes integer itemId, integer currentStock, integer stockMax returns nothing
// export function AddItemToAllStock(jassContext, itemId, currentStock, stockMax) {

// }

// // native AddItemToStock takes unit whichUnit, integer itemId, integer currentStock, integer stockMax returns nothing
// export function AddItemToStock(jassContext, whichUnit, itemId, currentStock, stockMax) {

// }

// // native AddUnitToAllStock takes integer unitId, integer currentStock, integer stockMax returns nothing
// export function AddUnitToAllStock(jassContext, unitId, currentStock, stockMax) {

// }

// // native AddUnitToStock takes unit whichUnit, integer unitId, integer currentStock, integer stockMax returns nothing
// export function AddUnitToStock(jassContext, whichUnit, unitId, currentStock, stockMax) {

// }

// // native RemoveItemFromAllStock takes integer itemId returns nothing
// export function RemoveItemFromAllStock(jassContext, itemId) {

// }

// // native RemoveItemFromStock takes unit whichUnit, integer itemId returns nothing
// export function RemoveItemFromStock(jassContext, whichUnit, itemId) {

// }

// // native RemoveUnitFromAllStock takes integer unitId returns nothing
// export function RemoveUnitFromAllStock(jassContext, unitId) {

// }

// // native RemoveUnitFromStock takes unit whichUnit, integer unitId returns nothing
// export function RemoveUnitFromStock(jassContext, whichUnit, unitId) {

// }

// // native SetAllItemTypeSlots takes integer slots returns nothing
// export function SetAllItemTypeSlots(jassContext, slots) {

// }

// // native SetAllUnitTypeSlots takes integer slots returns nothing
// export function SetAllUnitTypeSlots(jassContext, slots) {

// }

// // native SetItemTypeSlots takes unit whichUnit, integer slots returns nothing
// export function SetItemTypeSlots(jassContext, whichUnit, slots) {

// }

// // native SetUnitTypeSlots takes unit whichUnit, integer slots returns nothing
// export function SetUnitTypeSlots(jassContext, whichUnit, slots) {

// }

// // native GetUnitUserData takes unit whichUnit returns integer
// export function GetUnitUserData(jassContext, whichUnit) {

// }

// // native SetUnitUserData takes unit whichUnit, integer data returns nothing
// export function SetUnitUserData(jassContext, whichUnit, data) {

// }

// constant native Player takes integer number returns player
export function Player(jassContext, number) {
    return jassContext.players[number];
}

// // constant native GetLocalPlayer takes nothing returns player
// export function GetLocalPlayer(jassContext) {

// }

// // constant native IsPlayerAlly takes player whichPlayer, player otherPlayer returns boolean
// export function IsPlayerAlly(jassContext, whichPlayer, otherPlayer) {

// }

// // constant native IsPlayerEnemy takes player whichPlayer, player otherPlayer returns boolean
// export function IsPlayerEnemy(jassContext, whichPlayer, otherPlayer) {

// }

// // constant native IsPlayerInForce takes player whichPlayer, force whichForce returns boolean
// export function IsPlayerInForce(jassContext, whichPlayer, whichForce) {

// }

// // constant native IsPlayerObserver takes player whichPlayer returns boolean
// export function IsPlayerObserver(jassContext, whichPlayer) {

// }

// // constant native IsVisibleToPlayer takes real x, real y, player whichPlayer returns boolean
// export function IsVisibleToPlayer(jassContext, x, y, whichPlayer) {

// }

// // constant native IsLocationVisibleToPlayer takes location whichLocation, player whichPlayer returns boolean
// export function IsLocationVisibleToPlayer(jassContext, whichLocation, whichPlayer) {

// }

// // constant native IsFoggedToPlayer takes real x, real y, player whichPlayer returns boolean
// export function IsFoggedToPlayer(jassContext, x, y, whichPlayer) {

// }

// // constant native IsLocationFoggedToPlayer takes location whichLocation, player whichPlayer returns boolean
// export function IsLocationFoggedToPlayer(jassContext, whichLocation, whichPlayer) {

// }

// // constant native IsMaskedToPlayer takes real x, real y, player whichPlayer returns boolean
// export function IsMaskedToPlayer(jassContext, x, y, whichPlayer) {

// }

// // constant native IsLocationMaskedToPlayer takes location whichLocation, player whichPlayer returns boolean
// export function IsLocationMaskedToPlayer(jassContext, whichLocation, whichPlayer) {

// }

// // constant native GetPlayerRace takes player whichPlayer returns race
// export function GetPlayerRace(jassContext, whichPlayer) {

// }

// constant native GetPlayerId takes player whichPlayer returns integer
export function GetPlayerId(jassContext, whichPlayer) {
    return whichPlayer.index;
}

// // constant native GetPlayerUnitCount takes player whichPlayer, boolean includeIncomplete returns integer
// export function GetPlayerUnitCount(jassContext, whichPlayer, includeIncomplete) {

// }

// // constant native GetPlayerTypedUnitCount takes player whichPlayer, string unitName, boolean includeIncomplete, boolean includeUpgrades returns integer
// export function GetPlayerTypedUnitCount(jassContext, whichPlayer, unitName, includeIncomplete, includeUpgrades) {

// }

// // constant native GetPlayerStructureCount takes player whichPlayer, boolean includeIncomplete returns integer
// export function GetPlayerStructureCount(jassContext, whichPlayer, includeIncomplete) {

// }

// // constant native GetPlayerState takes player whichPlayer, playerstate whichPlayerState returns integer
// export function GetPlayerState(jassContext, whichPlayer, whichPlayerState) {

// }

// // constant native GetPlayerScore takes player whichPlayer, playerscore whichPlayerScore returns integer
// export function GetPlayerScore(jassContext, whichPlayer, whichPlayerScore) {

// }

// // constant native GetPlayerAlliance takes player sourcePlayer, player otherPlayer, alliancetype whichAllianceSetting returns boolean
// export function GetPlayerAlliance(jassContext, sourcePlayer, otherPlayer, whichAllianceSetting) {

// }

// // constant native GetPlayerHandicap takes player whichPlayer returns real
// export function GetPlayerHandicap(jassContext, whichPlayer) {

// }

// // constant native GetPlayerHandicapXP takes player whichPlayer returns real
// export function GetPlayerHandicapXP(jassContext, whichPlayer) {

// }

// // constant native SetPlayerHandicap takes player whichPlayer, real handicap returns nothing
// export function SetPlayerHandicap(jassContext, whichPlayer, handicap) {

// }

// // constant native SetPlayerHandicapXP takes player whichPlayer, real handicap returns nothing
// export function SetPlayerHandicapXP(jassContext, whichPlayer, handicap) {

// }

// // constant native SetPlayerTechMaxAllowed takes player whichPlayer, integer techid, integer maximum returns nothing
// export function SetPlayerTechMaxAllowed(jassContext, whichPlayer, techid, maximum) {

// }

// // constant native GetPlayerTechMaxAllowed takes player whichPlayer, integer techid returns integer
// export function GetPlayerTechMaxAllowed(jassContext, whichPlayer, techid) {

// }

// // constant native AddPlayerTechResearched takes player whichPlayer, integer techid, integer levels returns nothing
// export function AddPlayerTechResearched(jassContext, whichPlayer, techid, levels) {

// }

// // constant native SetPlayerTechResearched takes player whichPlayer, integer techid, integer setToLevel returns nothing
// export function SetPlayerTechResearched(jassContext, whichPlayer, techid, setToLevel) {

// }

// // constant native GetPlayerTechResearched takes player whichPlayer, integer techid, boolean specificonly returns boolean
// export function GetPlayerTechResearched(jassContext, whichPlayer, techid, specificonly) {

// }

// // constant native GetPlayerTechCount takes player whichPlayer, integer techid, boolean specificonly returns integer
// export function GetPlayerTechCount(jassContext, whichPlayer, techid, specificonly) {

// }

// // native SetPlayerUnitsOwner takes player whichPlayer, integer newOwner returns nothing
// export function SetPlayerUnitsOwner(jassContext, whichPlayer, newOwner) {

// }

// // native CripplePlayer takes player whichPlayer, force toWhichPlayers, boolean flag returns nothing
// export function CripplePlayer(jassContext, whichPlayer, toWhichPlayers, flag) {

// }

// // native SetPlayerAbilityAvailable takes player whichPlayer, integer abilid, boolean avail returns nothing
// export function SetPlayerAbilityAvailable(jassContext, whichPlayer, abilid, avail) {

// }

// // native SetPlayerState takes player whichPlayer, playerstate whichPlayerState, integer value returns nothing
// export function SetPlayerState(jassContext, whichPlayer, whichPlayerState, value) {

// }

// // native RemovePlayer takes player whichPlayer, playergameresult gameResult returns nothing
// export function RemovePlayer(jassContext, whichPlayer, gameResult) {

// }

// // native CachePlayerHeroData takes player whichPlayer returns nothing
// export function CachePlayerHeroData(jassContext, whichPlayer) {

// }

// // native SetFogStateRect takes player forWhichPlayer, fogstate whichState, rect where, boolean useSharedVision returns nothing
// export function SetFogStateRect(jassContext, forWhichPlayer, whichState, where, useSharedVision) {

// }

// // native SetFogStateRadius takes player forWhichPlayer, fogstate whichState, real centerx, real centerY, real radius, boolean useSharedVision returns nothing
// export function SetFogStateRadius(jassContext, forWhichPlayer, whichState, centerx, centerY, radius, useSharedVision) {

// }

// // native SetFogStateRadiusLoc takes player forWhichPlayer, fogstate whichState, location center, real radius, boolean useSharedVision returns nothing
// export function SetFogStateRadiusLoc(jassContext, forWhichPlayer, whichState, center, radius, useSharedVision) {

// }

// // native FogMaskEnable takes boolean enable returns nothing
// export function FogMaskEnable(jassContext, enable) {

// }

// // native IsFogMaskEnabled takes nothing returns boolean
// export function IsFogMaskEnabled(jassContext) {

// }

// // native FogEnable takes boolean enable returns nothing
// export function FogEnable(jassContext, enable) {

// }

// // native IsFogEnabled takes nothing returns boolean
// export function IsFogEnabled(jassContext) {

// }

// // native CreateFogModifierRect takes player forWhichPlayer, fogstate whichState, rect where, boolean useSharedVision, boolean afterUnits returns fogmodifier
// export function CreateFogModifierRect(jassContext, forWhichPlayer, whichState, where, useSharedVision, afterUnits) {

// }

// // native CreateFogModifierRadius takes player forWhichPlayer, fogstate whichState, real centerx, real centerY, real radius, boolean useSharedVision, boolean afterUnits returns fogmodifier
// export function CreateFogModifierRadius(jassContext, forWhichPlayer, whichState, centerx, centerY, radius, useSharedVision, afterUnits) {

// }

// // native CreateFogModifierRadiusLoc takes player forWhichPlayer, fogstate whichState, location center, real radius, boolean useSharedVision, boolean afterUnits returns fogmodifier
// export function CreateFogModifierRadiusLoc(jassContext, forWhichPlayer, whichState, center, radius, useSharedVision, afterUnits) {

// }

// // native DestroyFogModifier takes fogmodifier whichFogModifier returns nothing
// export function DestroyFogModifier(jassContext, whichFogModifier) {

// }

// // native FogModifierStart takes fogmodifier whichFogModifier returns nothing
// export function FogModifierStart(jassContext, whichFogModifier) {

// }

// // native FogModifierStop takes fogmodifier whichFogModifier returns nothing
// export function FogModifierStop(jassContext, whichFogModifier) {

// }

// // native VersionGet takes nothing returns version
// export function VersionGet(jassContext) {

// }

// // native VersionCompatible takes version whichVersion returns boolean
// export function VersionCompatible(jassContext, whichVersion) {

// }

// // native VersionSupported takes version whichVersion returns boolean
// export function VersionSupported(jassContext, whichVersion) {

// }

// // native EndGame takes boolean doScoreScreen returns nothing
// export function EndGame(jassContext, doScoreScreen) {

// }

// // native ChangeLevel takes string newLevel, boolean doScoreScreen returns nothing
// export function ChangeLevel(jassContext, newLevel, doScoreScreen) {

// }

// // native RestartGame takes boolean doScoreScreen returns nothing
// export function RestartGame(jassContext, doScoreScreen) {

// }

// // native ReloadGame takes nothing returns nothing
// export function ReloadGame(jassContext) {

// }

// // native SetCampaignMenuRace takes race r returns nothing
// export function SetCampaignMenuRace(jassContext, r) {

// }

// // native SetCampaignMenuRaceEx takes integer campaignIndex returns nothing
// export function SetCampaignMenuRaceEx(jassContext, campaignIndex) {

// }

// // native ForceCampaignSelectScreen takes nothing returns nothing
// export function ForceCampaignSelectScreen(jassContext) {

// }

// // native LoadGame takes string saveFileName, boolean doScoreScreen returns nothing
// export function LoadGame(jassContext, saveFileName, doScoreScreen) {

// }

// // native SaveGame takes string saveFileName returns nothing
// export function SaveGame(jassContext, saveFileName) {

// }

// // native RenameSaveDirectory takes string sourceDirName, string destDirName returns boolean
// export function RenameSaveDirectory(jassContext, sourceDirName, destDirName) {

// }

// // native RemoveSaveDirectory takes string sourceDirName returns boolean
// export function RemoveSaveDirectory(jassContext, sourceDirName) {

// }

// // native CopySaveGame takes string sourceSaveName, string destSaveName returns boolean
// export function CopySaveGame(jassContext, sourceSaveName, destSaveName) {

// }

// // native SaveGameExists takes string saveName returns boolean
// export function SaveGameExists(jassContext, saveName) {

// }

// // native SyncSelections takes nothing returns nothing
// export function SyncSelections(jassContext) {

// }

// // native SetFloatGameState takes fgamestate whichFloatGameState, real value returns nothing
// export function SetFloatGameState(jassContext, whichFloatGameState, value) {

// }

// // constant native GetFloatGameState takes fgamestate whichFloatGameState returns real
// export function GetFloatGameState(jassContext, whichFloatGameState) {

// }

// // native SetIntegerGameState takes igamestate whichIntegerGameState, integer value returns nothing
// export function SetIntegerGameState(jassContext, whichIntegerGameState, value) {

// }

// // constant native GetIntegerGameState takes igamestate whichIntegerGameState returns integer
// export function GetIntegerGameState(jassContext, whichIntegerGameState) {

// }

// // native SetTutorialCleared takes boolean cleared returns nothing
// export function SetTutorialCleared(jassContext, cleared) {

// }

// // native SetMissionAvailable takes integer campaignNumber, integer missionNumber, boolean available returns nothing
// export function SetMissionAvailable(jassContext, campaignNumber, missionNumber, available) {

// }

// // native SetCampaignAvailable takes integer campaignNumber, boolean available returns nothing
// export function SetCampaignAvailable(jassContext, campaignNumber, available) {

// }

// // native SetOpCinematicAvailable takes integer campaignNumber, boolean available returns nothing
// export function SetOpCinematicAvailable(jassContext, campaignNumber, available) {

// }

// // native SetEdCinematicAvailable takes integer campaignNumber, boolean available returns nothing
// export function SetEdCinematicAvailable(jassContext, campaignNumber, available) {

// }

// // native GetDefaultDifficulty takes nothing returns gamedifficulty
// export function GetDefaultDifficulty(jassContext) {

// }

// // native SetDefaultDifficulty takes gamedifficulty g returns nothing
// export function SetDefaultDifficulty(jassContext, g) {

// }

// // native SetCustomCampaignButtonVisible takes integer whichButton, boolean visible returns nothing
// export function SetCustomCampaignButtonVisible(jassContext, whichButton, visible) {

// }

// // native GetCustomCampaignButtonVisible takes integer whichButton returns boolean
// export function GetCustomCampaignButtonVisible(jassContext, whichButton) {

// }

// // native DoNotSaveReplay takes nothing returns nothing
// export function DoNotSaveReplay(jassContext) {

// }

// // native DialogCreate takes nothing returns dialog
// export function DialogCreate(jassContext) {

// }

// // native DialogDestroy takes dialog whichDialog returns nothing
// export function DialogDestroy(jassContext, whichDialog) {

// }

// // native DialogClear takes dialog whichDialog returns nothing
// export function DialogClear(jassContext, whichDialog) {

// }

// // native DialogSetMessage takes dialog whichDialog, string messageText returns nothing
// export function DialogSetMessage(jassContext, whichDialog, messageText) {

// }

// // native DialogAddButton takes dialog whichDialog, string buttonText, integer hotkey returns button
// export function DialogAddButton(jassContext, whichDialog, buttonText, hotkey) {

// }

// // native DialogAddQuitButton takes dialog whichDialog, boolean doScoreScreen, string buttonText, integer hotkey returns button
// export function DialogAddQuitButton(jassContext, whichDialog, doScoreScreen, buttonText, hotkey) {

// }

// // native DialogDisplay takes player whichPlayer, dialog whichDialog, boolean flag returns nothing
// export function DialogDisplay(jassContext, whichPlayer, whichDialog, flag) {

// }

// // native ReloadGameCachesFromDisk takes nothing returns boolean
// export function ReloadGameCachesFromDisk(jassContext) {

// }

// // native InitGameCache takes string campaignFile returns gamecache
// export function InitGameCache(jassContext, campaignFile) {

// }

// // native SaveGameCache takes gamecache whichCache returns boolean
// export function SaveGameCache(jassContext, whichCache) {

// }

// // native StoreInteger takes gamecache cache, string missionKey, string key, integer value returns nothing
// export function StoreInteger(jassContext, cache, missionKey, key, value) {

// }

// // native StoreReal takes gamecache cache, string missionKey, string key, real value returns nothing
// export function StoreReal(jassContext, cache, missionKey, key, value) {

// }

// // native StoreBoolean takes gamecache cache, string missionKey, string key, boolean value returns nothing
// export function StoreBoolean(jassContext, cache, missionKey, key, value) {

// }

// // native StoreUnit takes gamecache cache, string missionKey, string key, unit whichUnit returns boolean
// export function StoreUnit(jassContext, cache, missionKey, key, whichUnit) {

// }

// // native StoreString takes gamecache cache, string missionKey, string key, string value returns boolean
// export function StoreString(jassContext, cache, missionKey, key, value) {

// }

// // native SyncStoredInteger takes gamecache cache, string missionKey, string key returns nothing
// export function SyncStoredInteger(jassContext, cache, missionKey, key) {

// }

// // native SyncStoredReal takes gamecache cache, string missionKey, string key returns nothing
// export function SyncStoredReal(jassContext, cache, missionKey, key) {

// }

// // native SyncStoredBoolean takes gamecache cache, string missionKey, string key returns nothing
// export function SyncStoredBoolean(jassContext, cache, missionKey, key) {

// }

// // native SyncStoredUnit takes gamecache cache, string missionKey, string key returns nothing
// export function SyncStoredUnit(jassContext, cache, missionKey, key) {

// }

// // native SyncStoredString takes gamecache cache, string missionKey, string key returns nothing
// export function SyncStoredString(jassContext, cache, missionKey, key) {

// }

// // native HaveStoredInteger takes gamecache cache, string missionKey, string key returns boolean
// export function HaveStoredInteger(jassContext, cache, missionKey, key) {

// }

// // native HaveStoredReal takes gamecache cache, string missionKey, string key returns boolean
// export function HaveStoredReal(jassContext, cache, missionKey, key) {

// }

// // native HaveStoredBoolean takes gamecache cache, string missionKey, string key returns boolean
// export function HaveStoredBoolean(jassContext, cache, missionKey, key) {

// }

// // native HaveStoredUnit takes gamecache cache, string missionKey, string key returns boolean
// export function HaveStoredUnit(jassContext, cache, missionKey, key) {

// }

// // native HaveStoredString takes gamecache cache, string missionKey, string key returns boolean
// export function HaveStoredString(jassContext, cache, missionKey, key) {

// }

// // native FlushGameCache takes gamecache cache returns nothing
// export function FlushGameCache(jassContext, cache) {

// }

// // native FlushStoredMission takes gamecache cache, string missionKey returns nothing
// export function FlushStoredMission(jassContext, cache, missionKey) {

// }

// // native FlushStoredInteger takes gamecache cache, string missionKey, string key returns nothing
// export function FlushStoredInteger(jassContext, cache, missionKey, key) {

// }

// // native FlushStoredReal takes gamecache cache, string missionKey, string key returns nothing
// export function FlushStoredReal(jassContext, cache, missionKey, key) {

// }

// // native FlushStoredBoolean takes gamecache cache, string missionKey, string key returns nothing
// export function FlushStoredBoolean(jassContext, cache, missionKey, key) {

// }

// // native FlushStoredUnit takes gamecache cache, string missionKey, string key returns nothing
// export function FlushStoredUnit(jassContext, cache, missionKey, key) {

// }

// // native FlushStoredString takes gamecache cache, string missionKey, string key returns nothing
// export function FlushStoredString(jassContext, cache, missionKey, key) {

// }

// // native GetStoredInteger takes gamecache cache, string missionKey, string key returns integer
// export function GetStoredInteger(jassContext, cache, missionKey, key) {

// }

// // native GetStoredReal takes gamecache cache, string missionKey, string key returns real
// export function GetStoredReal(jassContext, cache, missionKey, key) {

// }

// // native GetStoredBoolean takes gamecache cache, string missionKey, string key returns boolean
// export function GetStoredBoolean(jassContext, cache, missionKey, key) {

// }

// // native GetStoredString takes gamecache cache, string missionKey, string key returns string
// export function GetStoredString(jassContext, cache, missionKey, key) {

// }

// // native RestoreUnit takes gamecache cache, string missionKey, string key, player forWhichPlayer, real x, real y, real facing returns unit
// export function RestoreUnit(jassContext, cache, missionKey, key, forWhichPlayer, x, y, facing) {

// }

// // native InitHashtable takes nothing returns hashtable
// export function InitHashtable(jassContext) {

// }

// // native SaveInteger takes hashtable table, integer parentKey, integer childKey, integer value returns nothing
// export function SaveInteger(jassContext, table, parentKey, childKey, value) {

// }

// // native SaveReal takes hashtable table, integer parentKey, integer childKey, real value returns nothing
// export function SaveReal(jassContext, table, parentKey, childKey, value) {

// }

// // native SaveBoolean takes hashtable table, integer parentKey, integer childKey, boolean value returns nothing
// export function SaveBoolean(jassContext, table, parentKey, childKey, value) {

// }

// // native SaveStr takes hashtable table, integer parentKey, integer childKey, string value returns boolean
// export function SaveStr(jassContext, table, parentKey, childKey, value) {

// }

// // native SavePlayerHandle takes hashtable table, integer parentKey, integer childKey, player whichPlayer returns boolean
// export function SavePlayerHandle(jassContext, table, parentKey, childKey, whichPlayer) {

// }

// // native SaveWidgetHandle takes hashtable table, integer parentKey, integer childKey, widget whichWidget returns boolean
// export function SaveWidgetHandle(jassContext, table, parentKey, childKey, whichWidget) {

// }

// // native SaveDestructableHandle takes hashtable table, integer parentKey, integer childKey, destructable whichDestructable returns boolean
// export function SaveDestructableHandle(jassContext, table, parentKey, childKey, whichDestructable) {

// }

// // native SaveItemHandle takes hashtable table, integer parentKey, integer childKey, item whichItem returns boolean
// export function SaveItemHandle(jassContext, table, parentKey, childKey, whichItem) {

// }

// // native SaveUnitHandle takes hashtable table, integer parentKey, integer childKey, unit whichUnit returns boolean
// export function SaveUnitHandle(jassContext, table, parentKey, childKey, whichUnit) {

// }

// // native SaveAbilityHandle takes hashtable table, integer parentKey, integer childKey, ability whichAbility returns boolean
// export function SaveAbilityHandle(jassContext, table, parentKey, childKey, whichAbility) {

// }

// // native SaveTimerHandle takes hashtable table, integer parentKey, integer childKey, timer whichTimer returns boolean
// export function SaveTimerHandle(jassContext, table, parentKey, childKey, whichTimer) {

// }

// // native SaveTriggerHandle takes hashtable table, integer parentKey, integer childKey, trigger whichTrigger returns boolean
// export function SaveTriggerHandle(jassContext, table, parentKey, childKey, whichTrigger) {

// }

// // native SaveTriggerConditionHandle takes hashtable table, integer parentKey, integer childKey, triggercondition whichTriggercondition returns boolean
// export function SaveTriggerConditionHandle(jassContext, table, parentKey, childKey, whichTriggercondition) {

// }

// // native SaveTriggerActionHandle takes hashtable table, integer parentKey, integer childKey, triggeraction whichTriggeraction returns boolean
// export function SaveTriggerActionHandle(jassContext, table, parentKey, childKey, whichTriggeraction) {

// }

// // native SaveTriggerEventHandle takes hashtable table, integer parentKey, integer childKey, event whichEvent returns boolean
// export function SaveTriggerEventHandle(jassContext, table, parentKey, childKey, whichEvent) {

// }

// // native SaveForceHandle takes hashtable table, integer parentKey, integer childKey, force whichForce returns boolean
// export function SaveForceHandle(jassContext, table, parentKey, childKey, whichForce) {

// }

// // native SaveGroupHandle takes hashtable table, integer parentKey, integer childKey, group whichGroup returns boolean
// export function SaveGroupHandle(jassContext, table, parentKey, childKey, whichGroup) {

// }

// // native SaveLocationHandle takes hashtable table, integer parentKey, integer childKey, location whichLocation returns boolean
// export function SaveLocationHandle(jassContext, table, parentKey, childKey, whichLocation) {

// }

// // native SaveRectHandle takes hashtable table, integer parentKey, integer childKey, rect whichRect returns boolean
// export function SaveRectHandle(jassContext, table, parentKey, childKey, whichRect) {

// }

// // native SaveBooleanExprHandle takes hashtable table, integer parentKey, integer childKey, boolexpr whichBoolexpr returns boolean
// export function SaveBooleanExprHandle(jassContext, table, parentKey, childKey, whichBoolexpr) {

// }

// // native SaveSoundHandle takes hashtable table, integer parentKey, integer childKey, sound whichSound returns boolean
// export function SaveSoundHandle(jassContext, table, parentKey, childKey, whichSound) {

// }

// // native SaveEffectHandle takes hashtable table, integer parentKey, integer childKey, effect whichEffect returns boolean
// export function SaveEffectHandle(jassContext, table, parentKey, childKey, whichEffect) {

// }

// // native SaveUnitPoolHandle takes hashtable table, integer parentKey, integer childKey, unitpool whichUnitpool returns boolean
// export function SaveUnitPoolHandle(jassContext, table, parentKey, childKey, whichUnitpool) {

// }

// // native SaveItemPoolHandle takes hashtable table, integer parentKey, integer childKey, itempool whichItempool returns boolean
// export function SaveItemPoolHandle(jassContext, table, parentKey, childKey, whichItempool) {

// }

// // native SaveQuestHandle takes hashtable table, integer parentKey, integer childKey, quest whichQuest returns boolean
// export function SaveQuestHandle(jassContext, table, parentKey, childKey, whichQuest) {

// }

// // native SaveQuestItemHandle takes hashtable table, integer parentKey, integer childKey, questitem whichQuestitem returns boolean
// export function SaveQuestItemHandle(jassContext, table, parentKey, childKey, whichQuestitem) {

// }

// // native SaveDefeatConditionHandle takes hashtable table, integer parentKey, integer childKey, defeatcondition whichDefeatcondition returns boolean
// export function SaveDefeatConditionHandle(jassContext, table, parentKey, childKey, whichDefeatcondition) {

// }

// // native SaveTimerDialogHandle takes hashtable table, integer parentKey, integer childKey, timerdialog whichTimerdialog returns boolean
// export function SaveTimerDialogHandle(jassContext, table, parentKey, childKey, whichTimerdialog) {

// }

// // native SaveLeaderboardHandle takes hashtable table, integer parentKey, integer childKey, leaderboard whichLeaderboard returns boolean
// export function SaveLeaderboardHandle(jassContext, table, parentKey, childKey, whichLeaderboard) {

// }

// // native SaveMultiboardHandle takes hashtable table, integer parentKey, integer childKey, multiboard whichMultiboard returns boolean
// export function SaveMultiboardHandle(jassContext, table, parentKey, childKey, whichMultiboard) {

// }

// // native SaveMultiboardItemHandle takes hashtable table, integer parentKey, integer childKey, multiboarditem whichMultiboarditem returns boolean
// export function SaveMultiboardItemHandle(jassContext, table, parentKey, childKey, whichMultiboarditem) {

// }

// // native SaveTrackableHandle takes hashtable table, integer parentKey, integer childKey, trackable whichTrackable returns boolean
// export function SaveTrackableHandle(jassContext, table, parentKey, childKey, whichTrackable) {

// }

// // native SaveDialogHandle takes hashtable table, integer parentKey, integer childKey, dialog whichDialog returns boolean
// export function SaveDialogHandle(jassContext, table, parentKey, childKey, whichDialog) {

// }

// // native SaveButtonHandle takes hashtable table, integer parentKey, integer childKey, button whichButton returns boolean
// export function SaveButtonHandle(jassContext, table, parentKey, childKey, whichButton) {

// }

// // native SaveTextTagHandle takes hashtable table, integer parentKey, integer childKey, texttag whichTexttag returns boolean
// export function SaveTextTagHandle(jassContext, table, parentKey, childKey, whichTexttag) {

// }

// // native SaveLightningHandle takes hashtable table, integer parentKey, integer childKey, lightning whichLightning returns boolean
// export function SaveLightningHandle(jassContext, table, parentKey, childKey, whichLightning) {

// }

// // native SaveImageHandle takes hashtable table, integer parentKey, integer childKey, image whichImage returns boolean
// export function SaveImageHandle(jassContext, table, parentKey, childKey, whichImage) {

// }

// // native SaveUbersplatHandle takes hashtable table, integer parentKey, integer childKey, ubersplat whichUbersplat returns boolean
// export function SaveUbersplatHandle(jassContext, table, parentKey, childKey, whichUbersplat) {

// }

// // native SaveRegionHandle takes hashtable table, integer parentKey, integer childKey, region whichRegion returns boolean
// export function SaveRegionHandle(jassContext, table, parentKey, childKey, whichRegion) {

// }

// // native SaveFogStateHandle takes hashtable table, integer parentKey, integer childKey, fogstate whichFogState returns boolean
// export function SaveFogStateHandle(jassContext, table, parentKey, childKey, whichFogState) {

// }

// // native SaveFogModifierHandle takes hashtable table, integer parentKey, integer childKey, fogmodifier whichFogModifier returns boolean
// export function SaveFogModifierHandle(jassContext, table, parentKey, childKey, whichFogModifier) {

// }

// // native SaveAgentHandle takes hashtable table, integer parentKey, integer childKey, agent whichAgent returns boolean
// export function SaveAgentHandle(jassContext, table, parentKey, childKey, whichAgent) {

// }

// // native SaveHashtableHandle takes hashtable table, integer parentKey, integer childKey, hashtable whichHashtable returns boolean
// export function SaveHashtableHandle(jassContext, table, parentKey, childKey, whichHashtable) {

// }

// // native LoadInteger takes hashtable table, integer parentKey, integer childKey returns integer
// export function LoadInteger(jassContext, table, parentKey, childKey) {

// }

// // native LoadReal takes hashtable table, integer parentKey, integer childKey returns real
// export function LoadReal(jassContext, table, parentKey, childKey) {

// }

// // native LoadBoolean takes hashtable table, integer parentKey, integer childKey returns boolean
// export function LoadBoolean(jassContext, table, parentKey, childKey) {

// }

// // native LoadStr takes hashtable table, integer parentKey, integer childKey returns string
// export function LoadStr(jassContext, table, parentKey, childKey) {

// }

// // native LoadPlayerHandle takes hashtable table, integer parentKey, integer childKey returns player
// export function LoadPlayerHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadWidgetHandle takes hashtable table, integer parentKey, integer childKey returns widget
// export function LoadWidgetHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadDestructableHandle takes hashtable table, integer parentKey, integer childKey returns destructable
// export function LoadDestructableHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadItemHandle takes hashtable table, integer parentKey, integer childKey returns item
// export function LoadItemHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadUnitHandle takes hashtable table, integer parentKey, integer childKey returns unit
// export function LoadUnitHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadAbilityHandle takes hashtable table, integer parentKey, integer childKey returns ability
// export function LoadAbilityHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadTimerHandle takes hashtable table, integer parentKey, integer childKey returns timer
// export function LoadTimerHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadTriggerHandle takes hashtable table, integer parentKey, integer childKey returns trigger
// export function LoadTriggerHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadTriggerConditionHandle takes hashtable table, integer parentKey, integer childKey returns triggercondition
// export function LoadTriggerConditionHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadTriggerActionHandle takes hashtable table, integer parentKey, integer childKey returns triggeraction
// export function LoadTriggerActionHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadTriggerEventHandle takes hashtable table, integer parentKey, integer childKey returns event
// export function LoadTriggerEventHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadForceHandle takes hashtable table, integer parentKey, integer childKey returns force
// export function LoadForceHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadGroupHandle takes hashtable table, integer parentKey, integer childKey returns group
// export function LoadGroupHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadLocationHandle takes hashtable table, integer parentKey, integer childKey returns location
// export function LoadLocationHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadRectHandle takes hashtable table, integer parentKey, integer childKey returns rect
// export function LoadRectHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadBooleanExprHandle takes hashtable table, integer parentKey, integer childKey returns boolexpr
// export function LoadBooleanExprHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadSoundHandle takes hashtable table, integer parentKey, integer childKey returns sound
// export function LoadSoundHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadEffectHandle takes hashtable table, integer parentKey, integer childKey returns effect
// export function LoadEffectHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadUnitPoolHandle takes hashtable table, integer parentKey, integer childKey returns unitpool
// export function LoadUnitPoolHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadItemPoolHandle takes hashtable table, integer parentKey, integer childKey returns itempool
// export function LoadItemPoolHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadQuestHandle takes hashtable table, integer parentKey, integer childKey returns quest
// export function LoadQuestHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadQuestItemHandle takes hashtable table, integer parentKey, integer childKey returns questitem
// export function LoadQuestItemHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadDefeatConditionHandle takes hashtable table, integer parentKey, integer childKey returns defeatcondition
// export function LoadDefeatConditionHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadTimerDialogHandle takes hashtable table, integer parentKey, integer childKey returns timerdialog
// export function LoadTimerDialogHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadLeaderboardHandle takes hashtable table, integer parentKey, integer childKey returns leaderboard
// export function LoadLeaderboardHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadMultiboardHandle takes hashtable table, integer parentKey, integer childKey returns multiboard
// export function LoadMultiboardHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadMultiboardItemHandle takes hashtable table, integer parentKey, integer childKey returns multiboarditem
// export function LoadMultiboardItemHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadTrackableHandle takes hashtable table, integer parentKey, integer childKey returns trackable
// export function LoadTrackableHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadDialogHandle takes hashtable table, integer parentKey, integer childKey returns dialog
// export function LoadDialogHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadButtonHandle takes hashtable table, integer parentKey, integer childKey returns button
// export function LoadButtonHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadTextTagHandle takes hashtable table, integer parentKey, integer childKey returns texttag
// export function LoadTextTagHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadLightningHandle takes hashtable table, integer parentKey, integer childKey returns lightning
// export function LoadLightningHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadImageHandle takes hashtable table, integer parentKey, integer childKey returns image
// export function LoadImageHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadUbersplatHandle takes hashtable table, integer parentKey, integer childKey returns ubersplat
// export function LoadUbersplatHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadRegionHandle takes hashtable table, integer parentKey, integer childKey returns region
// export function LoadRegionHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadFogStateHandle takes hashtable table, integer parentKey, integer childKey returns fogstate
// export function LoadFogStateHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadFogModifierHandle takes hashtable table, integer parentKey, integer childKey returns fogmodifier
// export function LoadFogModifierHandle(jassContext, table, parentKey, childKey) {

// }

// // native LoadHashtableHandle takes hashtable table, integer parentKey, integer childKey returns hashtable
// export function LoadHashtableHandle(jassContext, table, parentKey, childKey) {

// }

// // native HaveSavedInteger takes hashtable table, integer parentKey, integer childKey returns boolean
// export function HaveSavedInteger(jassContext, table, parentKey, childKey) {

// }

// // native HaveSavedReal takes hashtable table, integer parentKey, integer childKey returns boolean
// export function HaveSavedReal(jassContext, table, parentKey, childKey) {

// }

// // native HaveSavedBoolean takes hashtable table, integer parentKey, integer childKey returns boolean
// export function HaveSavedBoolean(jassContext, table, parentKey, childKey) {

// }

// // native HaveSavedString takes hashtable table, integer parentKey, integer childKey returns boolean
// export function HaveSavedString(jassContext, table, parentKey, childKey) {

// }

// // native HaveSavedHandle takes hashtable table, integer parentKey, integer childKey returns boolean
// export function HaveSavedHandle(jassContext, table, parentKey, childKey) {

// }

// // native RemoveSavedInteger takes hashtable table, integer parentKey, integer childKey returns nothing
// export function RemoveSavedInteger(jassContext, table, parentKey, childKey) {

// }

// // native RemoveSavedReal takes hashtable table, integer parentKey, integer childKey returns nothing
// export function RemoveSavedReal(jassContext, table, parentKey, childKey) {

// }

// // native RemoveSavedBoolean takes hashtable table, integer parentKey, integer childKey returns nothing
// export function RemoveSavedBoolean(jassContext, table, parentKey, childKey) {

// }

// // native RemoveSavedString takes hashtable table, integer parentKey, integer childKey returns nothing
// export function RemoveSavedString(jassContext, table, parentKey, childKey) {

// }

// // native RemoveSavedHandle takes hashtable table, integer parentKey, integer childKey returns nothing
// export function RemoveSavedHandle(jassContext, table, parentKey, childKey) {

// }

// // native FlushParentHashtable takes hashtable table returns nothing
// export function FlushParentHashtable(jassContext, table) {

// }

// // native FlushChildHashtable takes hashtable table, integer parentKey returns nothing
// export function FlushChildHashtable(jassContext, table, parentKey) {

// }

// native GetRandomInt takes integer lowBound, integer highBound returns integer
export function GetRandomInt(jassContext, lowBound, highBound) {
    return Math.floor(randomInRange(lowBound, highBound));
}

// native GetRandomReal takes real lowBound, real highBound returns real
export function GetRandomReal(jassContext, lowBound, highBound) {
    return randomInRange(lowBound, highBound);
}

// // native CreateUnitPool takes nothing returns unitpool
// export function CreateUnitPool(jassContext) {

// }

// // native DestroyUnitPool takes unitpool whichPool returns nothing
// export function DestroyUnitPool(jassContext, whichPool) {

// }

// // native UnitPoolAddUnitType takes unitpool whichPool, integer unitId, real weight returns nothing
// export function UnitPoolAddUnitType(jassContext, whichPool, unitId, weight) {

// }

// // native UnitPoolRemoveUnitType takes unitpool whichPool, integer unitId returns nothing
// export function UnitPoolRemoveUnitType(jassContext, whichPool, unitId) {

// }

// // native PlaceRandomUnit takes unitpool whichPool, player forWhichPlayer, real x, real y, real facing returns unit
// export function PlaceRandomUnit(jassContext, whichPool, forWhichPlayer, x, y, facing) {

// }

// // native CreateItemPool takes nothing returns itempool
// export function CreateItemPool(jassContext) {

// }

// // native DestroyItemPool takes itempool whichItemPool returns nothing
// export function DestroyItemPool(jassContext, whichItemPool) {

// }

// // native ItemPoolAddItemType takes itempool whichItemPool, integer itemId, real weight returns nothing
// export function ItemPoolAddItemType(jassContext, whichItemPool, itemId, weight) {

// }

// // native ItemPoolRemoveItemType takes itempool whichItemPool, integer itemId returns nothing
// export function ItemPoolRemoveItemType(jassContext, whichItemPool, itemId) {

// }

// // native PlaceRandomItem takes itempool whichItemPool, real x, real y returns item
// export function PlaceRandomItem(jassContext, whichItemPool, x, y) {

// }

// // native ChooseRandomCreep takes integer level returns integer
// export function ChooseRandomCreep(jassContext, level) {

// }

// // native ChooseRandomNPBuilding takes nothing returns integer
// export function ChooseRandomNPBuilding(jassContext) {

// }

// // native ChooseRandomItem takes integer level returns integer
// export function ChooseRandomItem(jassContext, level) {

// }

// // native ChooseRandomItemEx takes itemtype whichType, integer level returns integer
// export function ChooseRandomItemEx(jassContext, whichType, level) {

// }

// // native SetRandomSeed takes integer seed returns nothing
// export function SetRandomSeed(jassContext, seed) {

// }

// // native SetTerrainFog takes real a, real b, real c, real d, real e returns nothing
// export function SetTerrainFog(jassContext, a, b, c, d, e) {

// }

// // native ResetTerrainFog takes nothing returns nothing
// export function ResetTerrainFog(jassContext) {

// }

// // native SetUnitFog takes real a, real b, real c, real d, real e returns nothing
// export function SetUnitFog(jassContext, a, b, c, d, e) {

// }

// // native SetTerrainFogEx takes integer style, real zstart, real zend, real density, real red, real green, real blue returns nothing
// export function SetTerrainFogEx(jassContext, style, zstart, zend, density, red, green, blue) {

// }

// // native DisplayTextToPlayer takes player toPlayer, real x, real y, string message returns nothing
// export function DisplayTextToPlayer(jassContext, toPlayer, x, y, message) {

// }

// // native DisplayTimedTextToPlayer takes player toPlayer, real x, real y, real duration, string message returns nothing
// export function DisplayTimedTextToPlayer(jassContext, toPlayer, x, y, duration, message) {

// }

// // native DisplayTimedTextFromPlayer takes player toPlayer, real x, real y, real duration, string message returns nothing
// export function DisplayTimedTextFromPlayer(jassContext, toPlayer, x, y, duration, message) {

// }

// // native ClearTextMessages takes nothing returns nothing
// export function ClearTextMessages(jassContext) {

// }

// // native SetDayNightModels takes string terrainDNCFile, string unitDNCFile returns nothing
// export function SetDayNightModels(jassContext, terrainDNCFile, unitDNCFile) {

// }

// // native SetSkyModel takes string skyModelFile returns nothing
// export function SetSkyModel(jassContext, skyModelFile) {

// }

// // native EnableUserControl takes boolean b returns nothing
// export function EnableUserControl(jassContext, b) {

// }

// // native EnableUserUI takes boolean b returns nothing
// export function EnableUserUI(jassContext, b) {

// }

// // native SuspendTimeOfDay takes boolean b returns nothing
// export function SuspendTimeOfDay(jassContext, b) {

// }

// // native SetTimeOfDayScale takes real r returns nothing
// export function SetTimeOfDayScale(jassContext, r) {

// }

// // native GetTimeOfDayScale takes nothing returns real
// export function GetTimeOfDayScale(jassContext) {

// }

// // native ShowInterface takes boolean flag, real fadeDuration returns nothing
// export function ShowInterface(jassContext, flag, fadeDuration) {

// }

// // native PauseGame takes boolean flag returns nothing
// export function PauseGame(jassContext, flag) {

// }

// // native UnitAddIndicator takes unit whichUnit, integer red, integer green, integer blue, integer alpha returns nothing
// export function UnitAddIndicator(jassContext, whichUnit, red, green, blue, alpha) {

// }

// // native AddIndicator takes widget whichWidget, integer red, integer green, integer blue, integer alpha returns nothing
// export function AddIndicator(jassContext, whichWidget, red, green, blue, alpha) {

// }

// // native PingMinimap takes real x, real y, real duration returns nothing
// export function PingMinimap(jassContext, x, y, duration) {

// }

// // native PingMinimapEx takes real x, real y, real duration, integer red, integer green, integer blue, boolean extraEffects returns nothing
// export function PingMinimapEx(jassContext, x, y, duration, red, green, blue, extraEffects) {

// }

// // native EnableOcclusion takes boolean flag returns nothing
// export function EnableOcclusion(jassContext, flag) {

// }

// // native SetIntroShotText takes string introText returns nothing
// export function SetIntroShotText(jassContext, introText) {

// }

// // native SetIntroShotModel takes string introModelPath returns nothing
// export function SetIntroShotModel(jassContext, introModelPath) {

// }

// // native EnableWorldFogBoundary takes boolean b returns nothing
// export function EnableWorldFogBoundary(jassContext, b) {

// }

// // native PlayModelCinematic takes string modelName returns nothing
// export function PlayModelCinematic(jassContext, modelName) {

// }

// // native PlayCinematic takes string movieName returns nothing
// export function PlayCinematic(jassContext, movieName) {

// }

// // native ForceUIKey takes string key returns nothing
// export function ForceUIKey(jassContext, key) {

// }

// // native ForceUICancel takes nothing returns nothing
// export function ForceUICancel(jassContext) {

// }

// // native DisplayLoadDialog takes nothing returns nothing
// export function DisplayLoadDialog(jassContext) {

// }

// // native SetAltMinimapIcon takes string iconPath returns nothing
// export function SetAltMinimapIcon(jassContext, iconPath) {

// }

// // native DisableRestartMission takes boolean flag returns nothing
// export function DisableRestartMission(jassContext, flag) {

// }

// // native CreateTextTag takes nothing returns texttag
// export function CreateTextTag(jassContext) {

// }

// // native DestroyTextTag takes texttag t returns nothing
// export function DestroyTextTag(jassContext, t) {

// }

// // native SetTextTagText takes texttag t, string s, real height returns nothing
// export function SetTextTagText(jassContext, t, s, height) {

// }

// // native SetTextTagPos takes texttag t, real x, real y, real heightOffset returns nothing
// export function SetTextTagPos(jassContext, t, x, y, heightOffset) {

// }

// // native SetTextTagPosUnit takes texttag t, unit whichUnit, real heightOffset returns nothing
// export function SetTextTagPosUnit(jassContext, t, whichUnit, heightOffset) {

// }

// // native SetTextTagColor takes texttag t, integer red, integer green, integer blue, integer alpha returns nothing
// export function SetTextTagColor(jassContext, t, red, green, blue, alpha) {

// }

// // native SetTextTagVelocity takes texttag t, real xvel, real yvel returns nothing
// export function SetTextTagVelocity(jassContext, t, xvel, yvel) {

// }

// // native SetTextTagVisibility takes texttag t, boolean flag returns nothing
// export function SetTextTagVisibility(jassContext, t, flag) {

// }

// // native SetTextTagSuspended takes texttag t, boolean flag returns nothing
// export function SetTextTagSuspended(jassContext, t, flag) {

// }

// // native SetTextTagPermanent takes texttag t, boolean flag returns nothing
// export function SetTextTagPermanent(jassContext, t, flag) {

// }

// // native SetTextTagAge takes texttag t, real age returns nothing
// export function SetTextTagAge(jassContext, t, age) {

// }

// // native SetTextTagLifespan takes texttag t, real lifespan returns nothing
// export function SetTextTagLifespan(jassContext, t, lifespan) {

// }

// // native SetTextTagFadepoint takes texttag t, real fadepoint returns nothing
// export function SetTextTagFadepoint(jassContext, t, fadepoint) {

// }

// // native SetReservedLocalHeroButtons takes integer reserved returns nothing
// export function SetReservedLocalHeroButtons(jassContext, reserved) {

// }

// // native GetAllyColorFilterState takes nothing returns integer
// export function GetAllyColorFilterState(jassContext) {

// }

// // native SetAllyColorFilterState takes integer state returns nothing
// export function SetAllyColorFilterState(jassContext, state) {

// }

// // native GetCreepCampFilterState takes nothing returns boolean
// export function GetCreepCampFilterState(jassContext) {

// }

// // native SetCreepCampFilterState takes boolean state returns nothing
// export function SetCreepCampFilterState(jassContext, state) {

// }

// // native EnableMinimapFilterButtons takes boolean enableAlly, boolean enableCreep returns nothing
// export function EnableMinimapFilterButtons(jassContext, enableAlly, enableCreep) {

// }

// // native EnableDragSelect takes boolean state, boolean ui returns nothing
// export function EnableDragSelect(jassContext, state, ui) {

// }

// // native EnablePreSelect takes boolean state, boolean ui returns nothing
// export function EnablePreSelect(jassContext, state, ui) {

// }

// // native EnableSelect takes boolean state, boolean ui returns nothing
// export function EnableSelect(jassContext, state, ui) {

// }

// // native CreateTrackable takes string trackableModelPath, real x, real y, real facing returns trackable
// export function CreateTrackable(jassContext, trackableModelPath, x, y, facing) {

// }

// // native CreateQuest takes nothing returns quest
// export function CreateQuest(jassContext) {

// }

// // native DestroyQuest takes quest whichQuest returns nothing
// export function DestroyQuest(jassContext, whichQuest) {

// }

// // native QuestSetTitle takes quest whichQuest, string title returns nothing
// export function QuestSetTitle(jassContext, whichQuest, title) {

// }

// // native QuestSetDescription takes quest whichQuest, string description returns nothing
// export function QuestSetDescription(jassContext, whichQuest, description) {

// }

// // native QuestSetIconPath takes quest whichQuest, string iconPath returns nothing
// export function QuestSetIconPath(jassContext, whichQuest, iconPath) {

// }

// // native QuestSetRequired takes quest whichQuest, boolean required returns nothing
// export function QuestSetRequired(jassContext, whichQuest, required) {

// }

// // native QuestSetCompleted takes quest whichQuest, boolean completed returns nothing
// export function QuestSetCompleted(jassContext, whichQuest, completed) {

// }

// // native QuestSetDiscovered takes quest whichQuest, boolean discovered returns nothing
// export function QuestSetDiscovered(jassContext, whichQuest, discovered) {

// }

// // native QuestSetFailed takes quest whichQuest, boolean failed returns nothing
// export function QuestSetFailed(jassContext, whichQuest, failed) {

// }

// // native QuestSetEnabled takes quest whichQuest, boolean enabled returns nothing
// export function QuestSetEnabled(jassContext, whichQuest, enabled) {

// }

// // native IsQuestRequired takes quest whichQuest returns boolean
// export function IsQuestRequired(jassContext, whichQuest) {

// }

// // native IsQuestCompleted takes quest whichQuest returns boolean
// export function IsQuestCompleted(jassContext, whichQuest) {

// }

// // native IsQuestDiscovered takes quest whichQuest returns boolean
// export function IsQuestDiscovered(jassContext, whichQuest) {

// }

// // native IsQuestFailed takes quest whichQuest returns boolean
// export function IsQuestFailed(jassContext, whichQuest) {

// }

// // native IsQuestEnabled takes quest whichQuest returns boolean
// export function IsQuestEnabled(jassContext, whichQuest) {

// }

// // native QuestCreateItem takes quest whichQuest returns questitem
// export function QuestCreateItem(jassContext, whichQuest) {

// }

// // native QuestItemSetDescription takes questitem whichQuestItem, string description returns nothing
// export function QuestItemSetDescription(jassContext, whichQuestItem, description) {

// }

// // native QuestItemSetCompleted takes questitem whichQuestItem, boolean completed returns nothing
// export function QuestItemSetCompleted(jassContext, whichQuestItem, completed) {

// }

// // native IsQuestItemCompleted takes questitem whichQuestItem returns boolean
// export function IsQuestItemCompleted(jassContext, whichQuestItem) {

// }

// // native CreateDefeatCondition takes nothing returns defeatcondition
// export function CreateDefeatCondition(jassContext) {

// }

// // native DestroyDefeatCondition takes defeatcondition whichCondition returns nothing
// export function DestroyDefeatCondition(jassContext, whichCondition) {

// }

// // native DefeatConditionSetDescription takes defeatcondition whichCondition, string description returns nothing
// export function DefeatConditionSetDescription(jassContext, whichCondition, description) {

// }

// // native FlashQuestDialogButton takes nothing returns nothing
// export function FlashQuestDialogButton(jassContext) {

// }

// // native ForceQuestDialogUpdate takes nothing returns nothing
// export function ForceQuestDialogUpdate(jassContext) {

// }

// // native CreateTimerDialog takes timer t returns timerdialog
// export function CreateTimerDialog(jassContext, t) {

// }

// // native DestroyTimerDialog takes timerdialog whichDialog returns nothing
// export function DestroyTimerDialog(jassContext, whichDialog) {

// }

// // native TimerDialogSetTitle takes timerdialog whichDialog, string title returns nothing
// export function TimerDialogSetTitle(jassContext, whichDialog, title) {

// }

// // native TimerDialogSetTitleColor takes timerdialog whichDialog, integer red, integer green, integer blue, integer alpha returns nothing
// export function TimerDialogSetTitleColor(jassContext, whichDialog, red, green, blue, alpha) {

// }

// // native TimerDialogSetTimeColor takes timerdialog whichDialog, integer red, integer green, integer blue, integer alpha returns nothing
// export function TimerDialogSetTimeColor(jassContext, whichDialog, red, green, blue, alpha) {

// }

// // native TimerDialogSetSpeed takes timerdialog whichDialog, real speedMultFactor returns nothing
// export function TimerDialogSetSpeed(jassContext, whichDialog, speedMultFactor) {

// }

// // native TimerDialogDisplay takes timerdialog whichDialog, boolean display returns nothing
// export function TimerDialogDisplay(jassContext, whichDialog, display) {

// }

// // native IsTimerDialogDisplayed takes timerdialog whichDialog returns boolean
// export function IsTimerDialogDisplayed(jassContext, whichDialog) {

// }

// // native TimerDialogSetRealTimeRemaining takes timerdialog whichDialog, real timeRemaining returns nothing
// export function TimerDialogSetRealTimeRemaining(jassContext, whichDialog, timeRemaining) {

// }

// // native CreateLeaderboard takes nothing returns leaderboard
// export function CreateLeaderboard(jassContext) {

// }

// // native DestroyLeaderboard takes leaderboard lb returns nothing
// export function DestroyLeaderboard(jassContext, lb) {

// }

// // native LeaderboardDisplay takes leaderboard lb, boolean show returns nothing
// export function LeaderboardDisplay(jassContext, lb, show) {

// }

// // native IsLeaderboardDisplayed takes leaderboard lb returns boolean
// export function IsLeaderboardDisplayed(jassContext, lb) {

// }

// // native LeaderboardGetItemCount takes leaderboard lb returns integer
// export function LeaderboardGetItemCount(jassContext, lb) {

// }

// // native LeaderboardSetSizeByItemCount takes leaderboard lb, integer count returns nothing
// export function LeaderboardSetSizeByItemCount(jassContext, lb, count) {

// }

// // native LeaderboardAddItem takes leaderboard lb, string label, integer value, player p returns nothing
// export function LeaderboardAddItem(jassContext, lb, label, value, p) {

// }

// // native LeaderboardRemoveItem takes leaderboard lb, integer index returns nothing
// export function LeaderboardRemoveItem(jassContext, lb, index) {

// }

// // native LeaderboardRemovePlayerItem takes leaderboard lb, player p returns nothing
// export function LeaderboardRemovePlayerItem(jassContext, lb, p) {

// }

// // native LeaderboardClear takes leaderboard lb returns nothing
// export function LeaderboardClear(jassContext, lb) {

// }

// // native LeaderboardSortItemsByValue takes leaderboard lb, boolean ascending returns nothing
// export function LeaderboardSortItemsByValue(jassContext, lb, ascending) {

// }

// // native LeaderboardSortItemsByPlayer takes leaderboard lb, boolean ascending returns nothing
// export function LeaderboardSortItemsByPlayer(jassContext, lb, ascending) {

// }

// // native LeaderboardSortItemsByLabel takes leaderboard lb, boolean ascending returns nothing
// export function LeaderboardSortItemsByLabel(jassContext, lb, ascending) {

// }

// // native LeaderboardHasPlayerItem takes leaderboard lb, player p returns boolean
// export function LeaderboardHasPlayerItem(jassContext, lb, p) {

// }

// // native LeaderboardGetPlayerIndex takes leaderboard lb, player p returns integer
// export function LeaderboardGetPlayerIndex(jassContext, lb, p) {

// }

// // native LeaderboardSetLabel takes leaderboard lb, string label returns nothing
// export function LeaderboardSetLabel(jassContext, lb, label) {

// }

// // native LeaderboardGetLabelText takes leaderboard lb returns string
// export function LeaderboardGetLabelText(jassContext, lb) {

// }

// // native PlayerSetLeaderboard takes player toPlayer, leaderboard lb returns nothing
// export function PlayerSetLeaderboard(jassContext, toPlayer, lb) {

// }

// // native PlayerGetLeaderboard takes player toPlayer returns leaderboard
// export function PlayerGetLeaderboard(jassContext, toPlayer) {

// }

// // native LeaderboardSetLabelColor takes leaderboard lb, integer red, integer green, integer blue, integer alpha returns nothing
// export function LeaderboardSetLabelColor(jassContext, lb, red, green, blue, alpha) {

// }

// // native LeaderboardSetValueColor takes leaderboard lb, integer red, integer green, integer blue, integer alpha returns nothing
// export function LeaderboardSetValueColor(jassContext, lb, red, green, blue, alpha) {

// }

// // native LeaderboardSetStyle takes leaderboard lb, boolean showLabel, boolean showNames, boolean showValues, boolean showIcons returns nothing
// export function LeaderboardSetStyle(jassContext, lb, showLabel, showNames, showValues, showIcons) {

// }

// // native LeaderboardSetItemValue takes leaderboard lb, integer whichItem, integer val returns nothing
// export function LeaderboardSetItemValue(jassContext, lb, whichItem, val) {

// }

// // native LeaderboardSetItemLabel takes leaderboard lb, integer whichItem, string val returns nothing
// export function LeaderboardSetItemLabel(jassContext, lb, whichItem, val) {

// }

// // native LeaderboardSetItemStyle takes leaderboard lb, integer whichItem, boolean showLabel, boolean showValue, boolean showIcon returns nothing
// export function LeaderboardSetItemStyle(jassContext, lb, whichItem, showLabel, showValue, showIcon) {

// }

// // native LeaderboardSetItemLabelColor takes leaderboard lb, integer whichItem, integer red, integer green, integer blue, integer alpha returns nothing
// export function LeaderboardSetItemLabelColor(jassContext, lb, whichItem, red, green, blue, alpha) {

// }

// // native LeaderboardSetItemValueColor takes leaderboard lb, integer whichItem, integer red, integer green, integer blue, integer alpha returns nothing
// export function LeaderboardSetItemValueColor(jassContext, lb, whichItem, red, green, blue, alpha) {

// }

// // native CreateMultiboard takes nothing returns multiboard
// export function CreateMultiboard(jassContext) {

// }

// // native DestroyMultiboard takes multiboard lb returns nothing
// export function DestroyMultiboard(jassContext, lb) {

// }

// // native MultiboardDisplay takes multiboard lb, boolean show returns nothing
// export function MultiboardDisplay(jassContext, lb, show) {

// }

// // native IsMultiboardDisplayed takes multiboard lb returns boolean
// export function IsMultiboardDisplayed(jassContext, lb) {

// }

// // native MultiboardMinimize takes multiboard lb, boolean minimize returns nothing
// export function MultiboardMinimize(jassContext, lb, minimize) {

// }

// // native IsMultiboardMinimized takes multiboard lb returns boolean
// export function IsMultiboardMinimized(jassContext, lb) {

// }

// // native MultiboardClear takes multiboard lb returns nothing
// export function MultiboardClear(jassContext, lb) {

// }

// // native MultiboardSetTitleText takes multiboard lb, string label returns nothing
// export function MultiboardSetTitleText(jassContext, lb, label) {

// }

// // native MultiboardGetTitleText takes multiboard lb returns string
// export function MultiboardGetTitleText(jassContext, lb) {

// }

// // native MultiboardSetTitleTextColor takes multiboard lb, integer red, integer green, integer blue, integer alpha returns nothing
// export function MultiboardSetTitleTextColor(jassContext, lb, red, green, blue, alpha) {

// }

// // native MultiboardGetRowCount takes multiboard lb returns integer
// export function MultiboardGetRowCount(jassContext, lb) {

// }

// // native MultiboardGetColumnCount takes multiboard lb returns integer
// export function MultiboardGetColumnCount(jassContext, lb) {

// }

// // native MultiboardSetColumnCount takes multiboard lb, integer count returns nothing
// export function MultiboardSetColumnCount(jassContext, lb, count) {

// }

// // native MultiboardSetRowCount takes multiboard lb, integer count returns nothing
// export function MultiboardSetRowCount(jassContext, lb, count) {

// }

// // native MultiboardSetItemsStyle takes multiboard lb, boolean showValues, boolean showIcons returns nothing
// export function MultiboardSetItemsStyle(jassContext, lb, showValues, showIcons) {

// }

// // native MultiboardSetItemsValue takes multiboard lb, string value returns nothing
// export function MultiboardSetItemsValue(jassContext, lb, value) {

// }

// // native MultiboardSetItemsValueColor takes multiboard lb, integer red, integer green, integer blue, integer alpha returns nothing
// export function MultiboardSetItemsValueColor(jassContext, lb, red, green, blue, alpha) {

// }

// // native MultiboardSetItemsWidth takes multiboard lb, real width returns nothing
// export function MultiboardSetItemsWidth(jassContext, lb, width) {

// }

// // native MultiboardSetItemsIcon takes multiboard lb, string iconPath returns nothing
// export function MultiboardSetItemsIcon(jassContext, lb, iconPath) {

// }

// // native MultiboardGetItem takes multiboard lb, integer row, integer column returns multiboarditem
// export function MultiboardGetItem(jassContext, lb, row, column) {

// }

// // native MultiboardReleaseItem takes multiboarditem mbi returns nothing
// export function MultiboardReleaseItem(jassContext, mbi) {

// }

// // native MultiboardSetItemStyle takes multiboarditem mbi, boolean showValue, boolean showIcon returns nothing
// export function MultiboardSetItemStyle(jassContext, mbi, showValue, showIcon) {

// }

// // native MultiboardSetItemValue takes multiboarditem mbi, string val returns nothing
// export function MultiboardSetItemValue(jassContext, mbi, val) {

// }

// // native MultiboardSetItemValueColor takes multiboarditem mbi, integer red, integer green, integer blue, integer alpha returns nothing
// export function MultiboardSetItemValueColor(jassContext, mbi, red, green, blue, alpha) {

// }

// // native MultiboardSetItemWidth takes multiboarditem mbi, real width returns nothing
// export function MultiboardSetItemWidth(jassContext, mbi, width) {

// }

// // native MultiboardSetItemIcon takes multiboarditem mbi, string iconFileName returns nothing
// export function MultiboardSetItemIcon(jassContext, mbi, iconFileName) {

// }

// // native MultiboardSuppressDisplay takes boolean flag returns nothing
// export function MultiboardSuppressDisplay(jassContext, flag) {

// }

// // native SetCameraPosition takes real x, real y returns nothing
// export function SetCameraPosition(jassContext, x, y) {

// }

// // native SetCameraQuickPosition takes real x, real y returns nothing
// export function SetCameraQuickPosition(jassContext, x, y) {

// }

// // native SetCameraBounds takes real x1, real y1, real x2, real y2, real x3, real y3, real x4, real y4 returns nothing
// export function SetCameraBounds(jassContext, x1, y1, x2, y2, x3, y3, x4, y4) {

// }

// // native StopCamera takes nothing returns nothing
// export function StopCamera(jassContext) {

// }

// // native ResetToGameCamera takes real duration returns nothing
// export function ResetToGameCamera(jassContext, duration) {

// }

// // native PanCameraTo takes real x, real y returns nothing
// export function PanCameraTo(jassContext, x, y) {

// }

// // native PanCameraToTimed takes real x, real y, real duration returns nothing
// export function PanCameraToTimed(jassContext, x, y, duration) {

// }

// // native PanCameraToWithZ takes real x, real y, real zOffsetDest returns nothing
// export function PanCameraToWithZ(jassContext, x, y, zOffsetDest) {

// }

// // native PanCameraToTimedWithZ takes real x, real y, real zOffsetDest, real duration returns nothing
// export function PanCameraToTimedWithZ(jassContext, x, y, zOffsetDest, duration) {

// }

// // native SetCinematicCamera takes string cameraModelFile returns nothing
// export function SetCinematicCamera(jassContext, cameraModelFile) {

// }

// // native SetCameraRotateMode takes real x, real y, real radiansToSweep, real duration returns nothing
// export function SetCameraRotateMode(jassContext, x, y, radiansToSweep, duration) {

// }

// // native SetCameraField takes camerafield whichField, real value, real duration returns nothing
// export function SetCameraField(jassContext, whichField, value, duration) {

// }

// // native AdjustCameraField takes camerafield whichField, real offset, real duration returns nothing
// export function AdjustCameraField(jassContext, whichField, offset, duration) {

// }

// // native SetCameraTargetController takes unit whichUnit, real xoffset, real yoffset, boolean inheritOrientation returns nothing
// export function SetCameraTargetController(jassContext, whichUnit, xoffset, yoffset, inheritOrientation) {

// }

// // native SetCameraOrientController takes unit whichUnit, real xoffset, real yoffset returns nothing
// export function SetCameraOrientController(jassContext, whichUnit, xoffset, yoffset) {

// }

// native CreateCameraSetup takes nothing returns camerasetup
export function CreateCameraSetup(jassContext) {
    return jassContext.addHandle(new JassCameraSetup(jassContext));
}

// native CameraSetupSetField takes camerasetup whichSetup, camerafield whichField, real value, real duration returns nothing
export function CameraSetupSetField(jassContext, whichSetup, whichField, value, duration) {
    if (duration > 0) {
        console.warn('CameraSetupSetField: duration not used yet');
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

// native CameraSetupGetField takes camerasetup whichSetup, camerafield whichField returns real
export function CameraSetupGetField(jassContext, whichSetup, whichField) {
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

// native CameraSetupSetDestPosition takes camerasetup whichSetup, real x, real y, real duration returns nothing
export function CameraSetupSetDestPosition(jassContext, whichSetup, x, y, duration) {
    if (duration > 0) {
        console.warn('CameraSetupSetDestPosition: duration not used yet');
    }

    whichSetup.destPosition.x = x;
    whichSetup.destPosition.y = y;
}

// native CameraSetupGetDestPositionLoc takes camerasetup whichSetup returns location
export function CameraSetupGetDestPositionLoc(jassContext, whichSetup) {
    return whichSetup.destPosition;
}

// native CameraSetupGetDestPositionX takes camerasetup whichSetup returns real
export function CameraSetupGetDestPositionX(jassContext, whichSetup) {
    return whichSetup.destPosition.x;
}

// native CameraSetupGetDestPositionY takes camerasetup whichSetup returns real
export function CameraSetupGetDestPositionY(jassContext, whichSetup) {
    return whichSetup.destPosition.y;
}

// // native CameraSetupApply takes camerasetup whichSetup, boolean doPan, boolean panTimed returns nothing
// export function CameraSetupApply(jassContext, whichSetup, doPan, panTimed) {

// }

// // native CameraSetupApplyWithZ takes camerasetup whichSetup, real zDestOffset returns nothing
// export function CameraSetupApplyWithZ(jassContext, whichSetup, zDestOffset) {

// }

// // native CameraSetupApplyForceDuration takes camerasetup whichSetup, boolean doPan, real forceDuration returns nothing
// export function CameraSetupApplyForceDuration(jassContext, whichSetup, doPan, forceDuration) {

// }

// // native CameraSetupApplyForceDurationWithZ takes camerasetup whichSetup, real zDestOffset, real forceDuration returns nothing
// export function CameraSetupApplyForceDurationWithZ(jassContext, whichSetup, zDestOffset, forceDuration) {

// }

// // native CameraSetTargetNoise takes real mag, real velocity returns nothing
// export function CameraSetTargetNoise(jassContext, mag, velocity) {

// }

// // native CameraSetSourceNoise takes real mag, real velocity returns nothing
// export function CameraSetSourceNoise(jassContext, mag, velocity) {

// }

// // native CameraSetTargetNoiseEx takes real mag, real velocity, boolean vertOnly returns nothing
// export function CameraSetTargetNoiseEx(jassContext, mag, velocity, vertOnly) {

// }

// // native CameraSetSourceNoiseEx takes real mag, real velocity, boolean vertOnly returns nothing
// export function CameraSetSourceNoiseEx(jassContext, mag, velocity, vertOnly) {

// }

// // native CameraSetSmoothingFactor takes real factor returns nothing
// export function CameraSetSmoothingFactor(jassContext, factor) {

// }

// // native SetCineFilterTexture takes string filename returns nothing
// export function SetCineFilterTexture(jassContext, filename) {

// }

// // native SetCineFilterBlendMode takes blendmode whichMode returns nothing
// export function SetCineFilterBlendMode(jassContext, whichMode) {

// }

// // native SetCineFilterTexMapFlags takes texmapflags whichFlags returns nothing
// export function SetCineFilterTexMapFlags(jassContext, whichFlags) {

// }

// // native SetCineFilterStartUV takes real minu, real minv, real maxu, real maxv returns nothing
// export function SetCineFilterStartUV(jassContext, minu, minv, maxu, maxv) {

// }

// // native SetCineFilterEndUV takes real minu, real minv, real maxu, real maxv returns nothing
// export function SetCineFilterEndUV(jassContext, minu, minv, maxu, maxv) {

// }

// // native SetCineFilterStartColor takes integer red, integer green, integer blue, integer alpha returns nothing
// export function SetCineFilterStartColor(jassContext, red, green, blue, alpha) {

// }

// // native SetCineFilterEndColor takes integer red, integer green, integer blue, integer alpha returns nothing
// export function SetCineFilterEndColor(jassContext, red, green, blue, alpha) {

// }

// // native SetCineFilterDuration takes real duration returns nothing
// export function SetCineFilterDuration(jassContext, duration) {

// }

// // native DisplayCineFilter takes boolean flag returns nothing
// export function DisplayCineFilter(jassContext, flag) {

// }

// // native IsCineFilterDisplayed takes nothing returns boolean
// export function IsCineFilterDisplayed(jassContext) {

// }

// // native SetCinematicScene takes integer portraitUnitId, playercolor color, string speakerTitle, string text, real sceneDuration, real voiceoverDuration returns nothing
// export function SetCinematicScene(jassContext, portraitUnitId, color, speakerTitle, text, sceneDuration, voiceoverDuration) {

// }

// // native EndCinematicScene takes nothing returns nothing
// export function EndCinematicScene(jassContext) {

// }

// // native ForceCinematicSubtitles takes boolean flag returns nothing
// export function ForceCinematicSubtitles(jassContext, flag) {

// }

// // native GetCameraMargin takes integer whichMargin returns real
// export function GetCameraMargin(jassContext, whichMargin) {

// }

// // constant native GetCameraBoundMinX takes nothing returns real
// export function GetCameraBoundMinX(jassContext) {

// }

// // constant native GetCameraBoundMinY takes nothing returns real
// export function GetCameraBoundMinY(jassContext) {

// }

// // constant native GetCameraBoundMaxX takes nothing returns real
// export function GetCameraBoundMaxX(jassContext) {

// }

// // constant native GetCameraBoundMaxY takes nothing returns real
// export function GetCameraBoundMaxY(jassContext) {

// }

// // constant native GetCameraField takes camerafield whichField returns real
// export function GetCameraField(jassContext, whichField) {

// }

// // constant native GetCameraTargetPositionX takes nothing returns real
// export function GetCameraTargetPositionX(jassContext) {

// }

// // constant native GetCameraTargetPositionY takes nothing returns real
// export function GetCameraTargetPositionY(jassContext) {

// }

// // constant native GetCameraTargetPositionZ takes nothing returns real
// export function GetCameraTargetPositionZ(jassContext) {

// }

// // constant native GetCameraTargetPositionLoc takes nothing returns location
// export function GetCameraTargetPositionLoc(jassContext) {

// }

// // constant native GetCameraEyePositionX takes nothing returns real
// export function GetCameraEyePositionX(jassContext) {

// }

// // constant native GetCameraEyePositionY takes nothing returns real
// export function GetCameraEyePositionY(jassContext) {

// }

// // constant native GetCameraEyePositionZ takes nothing returns real
// export function GetCameraEyePositionZ(jassContext) {

// }

// // constant native GetCameraEyePositionLoc takes nothing returns location
// export function GetCameraEyePositionLoc(jassContext) {

// }

// // native NewSoundEnvironment takes string environmentName returns nothing
// export function NewSoundEnvironment(jassContext, environmentName) {

// }

// // native CreateSound takes string fileName, boolean looping, boolean is3D, boolean stopwhenoutofrange, integer fadeInRate, integer fadeOutRate, string eaxSetting returns sound
// export function CreateSound(jassContext, fileName, looping, is3D, stopwhenoutofrange, fadeInRate, fadeOutRate, eaxSetting) {

// }

// // native CreateSoundFilenameWithLabel takes string fileName, boolean looping, boolean is3D, boolean stopwhenoutofrange, integer fadeInRate, integer fadeOutRate, string SLKEntryName returns sound
// export function CreateSoundFilenameWithLabel(jassContext, fileName, looping, is3D, stopwhenoutofrange, fadeInRate, fadeOutRate, SLKEntryName) {

// }

// // native CreateSoundFromLabel takes string soundLabel, boolean looping, boolean is3D, boolean stopwhenoutofrange, integer fadeInRate, integer fadeOutRate returns sound
// export function CreateSoundFromLabel(jassContext, soundLabel, looping, is3D, stopwhenoutofrange, fadeInRate, fadeOutRate) {

// }

// // native CreateMIDISound takes string soundLabel, integer fadeInRate, integer fadeOutRate returns sound
// export function CreateMIDISound(jassContext, soundLabel, fadeInRate, fadeOutRate) {

// }

// // native SetSoundParamsFromLabel takes sound soundHandle, string soundLabel returns nothing
// export function SetSoundParamsFromLabel(jassContext, soundHandle, soundLabel) {

// }

// // native SetSoundDistanceCutoff takes sound soundHandle, real cutoff returns nothing
// export function SetSoundDistanceCutoff(jassContext, soundHandle, cutoff) {

// }

// // native SetSoundChannel takes sound soundHandle, integer channel returns nothing
// export function SetSoundChannel(jassContext, soundHandle, channel) {

// }

// // native SetSoundVolume takes sound soundHandle, integer volume returns nothing
// export function SetSoundVolume(jassContext, soundHandle, volume) {

// }

// // native SetSoundPitch takes sound soundHandle, real pitch returns nothing
// export function SetSoundPitch(jassContext, soundHandle, pitch) {

// }

// // native SetSoundPlayPosition takes sound soundHandle, integer millisecs returns nothing
// export function SetSoundPlayPosition(jassContext, soundHandle, millisecs) {

// }

// // native SetSoundDistances takes sound soundHandle, real minDist, real maxDist returns nothing
// export function SetSoundDistances(jassContext, soundHandle, minDist, maxDist) {

// }

// // native SetSoundConeAngles takes sound soundHandle, real inside, real outside, integer outsideVolume returns nothing
// export function SetSoundConeAngles(jassContext, soundHandle, inside, outside, outsideVolume) {

// }

// // native SetSoundConeOrientation takes sound soundHandle, real x, real y, real z returns nothing
// export function SetSoundConeOrientation(jassContext, soundHandle, x, y, z) {

// }

// // native SetSoundPosition takes sound soundHandle, real x, real y, real z returns nothing
// export function SetSoundPosition(jassContext, soundHandle, x, y, z) {

// }

// // native SetSoundVelocity takes sound soundHandle, real x, real y, real z returns nothing
// export function SetSoundVelocity(jassContext, soundHandle, x, y, z) {

// }

// // native AttachSoundToUnit takes sound soundHandle, unit whichUnit returns nothing
// export function AttachSoundToUnit(jassContext, soundHandle, whichUnit) {

// }

// // native StartSound takes sound soundHandle returns nothing
// export function StartSound(jassContext, soundHandle) {

// }

// // native StopSound takes sound soundHandle, boolean killWhenDone, boolean fadeOut returns nothing
// export function StopSound(jassContext, soundHandle, killWhenDone, fadeOut) {

// }

// // native KillSoundWhenDone takes sound soundHandle returns nothing
// export function KillSoundWhenDone(jassContext, soundHandle) {

// }

// // native SetMapMusic takes string musicName, boolean random, integer index returns nothing
// export function SetMapMusic(jassContext, musicName, random, index) {

// }

// // native ClearMapMusic takes nothing returns nothing
// export function ClearMapMusic(jassContext) {

// }

// // native PlayMusic takes string musicName returns nothing
// export function PlayMusic(jassContext, musicName) {

// }

// // native PlayMusicEx takes string musicName, integer frommsecs, integer fadeinmsecs returns nothing
// export function PlayMusicEx(jassContext, musicName, frommsecs, fadeinmsecs) {

// }

// // native StopMusic takes boolean fadeOut returns nothing
// export function StopMusic(jassContext, fadeOut) {

// }

// // native ResumeMusic takes nothing returns nothing
// export function ResumeMusic(jassContext) {

// }

// // native PlayThematicMusic takes string musicFileName returns nothing
// export function PlayThematicMusic(jassContext, musicFileName) {

// }

// // native PlayThematicMusicEx takes string musicFileName, integer frommsecs returns nothing
// export function PlayThematicMusicEx(jassContext, musicFileName, frommsecs) {

// }

// // native EndThematicMusic takes nothing returns nothing
// export function EndThematicMusic(jassContext) {

// }

// // native SetMusicVolume takes integer volume returns nothing
// export function SetMusicVolume(jassContext, volume) {

// }

// // native SetMusicPlayPosition takes integer millisecs returns nothing
// export function SetMusicPlayPosition(jassContext, millisecs) {

// }

// // native SetThematicMusicPlayPosition takes integer millisecs returns nothing
// export function SetThematicMusicPlayPosition(jassContext, millisecs) {

// }

// // native SetSoundDuration takes sound soundHandle, integer duration returns nothing
// export function SetSoundDuration(jassContext, soundHandle, duration) {

// }

// // native GetSoundDuration takes sound soundHandle returns integer
// export function GetSoundDuration(jassContext, soundHandle) {

// }

// // native GetSoundFileDuration takes string musicFileName returns integer
// export function GetSoundFileDuration(jassContext, musicFileName) {

// }

// // native VolumeGroupSetVolume takes volumegroup vgroup, real scale returns nothing
// export function VolumeGroupSetVolume(jassContext, vgroup, scale) {

// }

// // native VolumeGroupReset takes nothing returns nothing
// export function VolumeGroupReset(jassContext) {

// }

// // native GetSoundIsPlaying takes sound soundHandle returns boolean
// export function GetSoundIsPlaying(jassContext, soundHandle) {

// }

// // native GetSoundIsLoading takes sound soundHandle returns boolean
// export function GetSoundIsLoading(jassContext, soundHandle) {

// }

// // native RegisterStackedSound takes sound soundHandle, boolean byPosition, real rectwidth, real rectheight returns nothing
// export function RegisterStackedSound(jassContext, soundHandle, byPosition, rectwidth, rectheight) {

// }

// // native UnregisterStackedSound takes sound soundHandle, boolean byPosition, real rectwidth, real rectheight returns nothing
// export function UnregisterStackedSound(jassContext, soundHandle, byPosition, rectwidth, rectheight) {

// }

// native AddWeatherEffect takes rect where, integer effectID returns weathereffect
export function AddWeatherEffect(jassContext, where, effectID) {
    return jassContext.addHandle(new JassWeatherEffect(jassContext, where, uintToTag(effectID)));
}

// native RemoveWeatherEffect takes weathereffect whichEffect returns nothing
export function RemoveWeatherEffect(jassContext, whichEffect) {
    jassContext.removeHandle(whichEffect);
}

// native EnableWeatherEffect takes weathereffect whichEffect, boolean enable returns nothing
export function EnableWeatherEffect(jassContext, whichEffect, enable) {
    whichEffect.enabled = enable;
}

// // native TerrainDeformCrater takes real x, real y, real radius, real depth, integer duration, boolean permanent returns terraindeformation
// export function TerrainDeformCrater(jassContext, x, y, radius, depth, duration, permanent) {

// }

// // native TerrainDeformRipple takes real x, real y, real radius, real depth, integer duration, integer count, real spaceWaves, real timeWaves, real radiusStartPct, boolean limitNeg returns terraindeformation
// export function TerrainDeformRipple(jassContext, x, y, radius, depth, duration, count, spaceWaves, timeWaves, radiusStartPct, limitNeg) {

// }

// // native TerrainDeformWave takes real x, real y, real dirX, real dirY, real distance, real speed, real radius, real depth, integer trailTime, integer count returns terraindeformation
// export function TerrainDeformWave(jassContext, x, y, dirX, dirY, distance, speed, radius, depth, trailTime, count) {

// }

// // native TerrainDeformRandom takes real x, real y, real radius, real minDelta, real maxDelta, integer duration, integer updateInterval returns terraindeformation
// export function TerrainDeformRandom(jassContext, x, y, radius, minDelta, maxDelta, duration, updateInterval) {

// }

// // native TerrainDeformStop takes terraindeformation deformation, integer duration returns nothing
// export function TerrainDeformStop(jassContext, deformation, duration) {

// }

// // native TerrainDeformStopAll takes nothing returns nothing
// export function TerrainDeformStopAll(jassContext) {

// }

// // native AddSpecialEffect takes string modelName, real x, real y returns effect
// export function AddSpecialEffect(jassContext, modelName, x, y) {

// }

// // native AddSpecialEffectLoc takes string modelName, location where returns effect
// export function AddSpecialEffectLoc(jassContext, modelName, where) {

// }

// // native AddSpecialEffectTarget takes string modelName, widget targetWidget, string attachPointName returns effect
// export function AddSpecialEffectTarget(jassContext, modelName, targetWidget, attachPointName) {

// }

// // native DestroyEffect takes effect whichEffect returns nothing
// export function DestroyEffect(jassContext, whichEffect) {

// }

// // native AddSpellEffect takes string abilityString, effecttype t, real x, real y returns effect
// export function AddSpellEffect(jassContext, abilityString, t, x, y) {

// }

// // native AddSpellEffectLoc takes string abilityString, effecttype t, location where returns effect
// export function AddSpellEffectLoc(jassContext, abilityString, t, where) {

// }

// // native AddSpellEffectById takes integer abilityId, effecttype t, real x, real y returns effect
// export function AddSpellEffectById(jassContext, abilityId, t, x, y) {

// }

// // native AddSpellEffectByIdLoc takes integer abilityId, effecttype t, location where returns effect
// export function AddSpellEffectByIdLoc(jassContext, abilityId, t, where) {

// }

// // native AddSpellEffectTarget takes string modelName, effecttype t, widget targetWidget, string attachPoint returns effect
// export function AddSpellEffectTarget(jassContext, modelName, t, targetWidget, attachPoint) {

// }

// // native AddSpellEffectTargetById takes integer abilityId, effecttype t, widget targetWidget, string attachPoint returns effect
// export function AddSpellEffectTargetById(jassContext, abilityId, t, targetWidget, attachPoint) {

// }

// // native AddLightning takes string codeName, boolean checkVisibility, real x1, real y1, real x2, real y2 returns lightning
// export function AddLightning(jassContext, codeName, checkVisibility, x1, y1, x2, y2) {

// }

// // native AddLightningEx takes string codeName, boolean checkVisibility, real x1, real y1, real z1, real x2, real y2, real z2 returns lightning
// export function AddLightningEx(jassContext, codeName, checkVisibility, x1, y1, z1, x2, y2, z2) {

// }

// // native DestroyLightning takes lightning whichBolt returns boolean
// export function DestroyLightning(jassContext, whichBolt) {

// }

// // native MoveLightning takes lightning whichBolt, boolean checkVisibility, real x1, real y1, real x2, real y2 returns boolean
// export function MoveLightning(jassContext, whichBolt, checkVisibility, x1, y1, x2, y2) {

// }

// // native MoveLightningEx takes lightning whichBolt, boolean checkVisibility, real x1, real y1, real z1, real x2, real y2, real z2 returns boolean
// export function MoveLightningEx(jassContext, whichBolt, checkVisibility, x1, y1, z1, x2, y2, z2) {

// }

// // native GetLightningColorA takes lightning whichBolt returns real
// export function GetLightningColorA(jassContext, whichBolt) {

// }

// // native GetLightningColorR takes lightning whichBolt returns real
// export function GetLightningColorR(jassContext, whichBolt) {

// }

// // native GetLightningColorG takes lightning whichBolt returns real
// export function GetLightningColorG(jassContext, whichBolt) {

// }

// // native GetLightningColorB takes lightning whichBolt returns real
// export function GetLightningColorB(jassContext, whichBolt) {

// }

// // native SetLightningColor takes lightning whichBolt, real r, real g, real b, real a returns boolean
// export function SetLightningColor(jassContext, whichBolt, r, g, b, a) {

// }

// // native GetAbilityEffect takes string abilityString, effecttype t, integer index returns string
// export function GetAbilityEffect(jassContext, abilityString, t, index) {

// }

// // native GetAbilityEffectById takes integer abilityId, effecttype t, integer index returns string
// export function GetAbilityEffectById(jassContext, abilityId, t, index) {

// }

// // native GetAbilitySound takes string abilityString, soundtype t returns string
// export function GetAbilitySound(jassContext, abilityString, t) {

// }

// // native GetAbilitySoundById takes integer abilityId, soundtype t returns string
// export function GetAbilitySoundById(jassContext, abilityId, t) {

// }

// // native GetTerrainCliffLevel takes real x, real y returns integer
// export function GetTerrainCliffLevel(jassContext, x, y) {

// }

// // native SetWaterBaseColor takes integer red, integer green, integer blue, integer alpha returns nothing
// export function SetWaterBaseColor(jassContext, red, green, blue, alpha) {

// }

// // native SetWaterDeforms takes boolean val returns nothing
// export function SetWaterDeforms(jassContext, val) {

// }

// // native GetTerrainType takes real x, real y returns integer
// export function GetTerrainType(jassContext, x, y) {

// }

// // native GetTerrainVariance takes real x, real y returns integer
// export function GetTerrainVariance(jassContext, x, y) {

// }

// // native SetTerrainType takes real x, real y, integer terrainType, integer variation, integer area, integer shape returns nothing
// export function SetTerrainType(jassContext, x, y, terrainType, variation, area, shape) {

// }

// // native IsTerrainPathable takes real x, real y, pathingtype t returns boolean
// export function IsTerrainPathable(jassContext, x, y, t) {

// }

// // native SetTerrainPathable takes real x, real y, pathingtype t, boolean flag returns nothing
// export function SetTerrainPathable(jassContext, x, y, t, flag) {

// }

// // native CreateImage takes string file, real sizeX, real sizeY, real sizeZ, real posX, real posY, real posZ, real originX, real originY, real originZ, integer imageType returns image
// export function CreateImage(jassContext, file, sizeX, sizeY, sizeZ, posX, posY, posZ, originX, originY, originZ, imageType) {

// }

// // native DestroyImage takes image whichImage returns nothing
// export function DestroyImage(jassContext, whichImage) {

// }

// // native ShowImage takes image whichImage, boolean flag returns nothing
// export function ShowImage(jassContext, whichImage, flag) {

// }

// // native SetImageConstantHeight takes image whichImage, boolean flag, real height returns nothing
// export function SetImageConstantHeight(jassContext, whichImage, flag, height) {

// }

// // native SetImagePosition takes image whichImage, real x, real y, real z returns nothing
// export function SetImagePosition(jassContext, whichImage, x, y, z) {

// }

// // native SetImageColor takes image whichImage, integer red, integer green, integer blue, integer alpha returns nothing
// export function SetImageColor(jassContext, whichImage, red, green, blue, alpha) {

// }

// // native SetImageRender takes image whichImage, boolean flag returns nothing
// export function SetImageRender(jassContext, whichImage, flag) {

// }

// // native SetImageRenderAlways takes image whichImage, boolean flag returns nothing
// export function SetImageRenderAlways(jassContext, whichImage, flag) {

// }

// // native SetImageAboveWater takes image whichImage, boolean flag, boolean useWaterAlpha returns nothing
// export function SetImageAboveWater(jassContext, whichImage, flag, useWaterAlpha) {

// }

// // native SetImageType takes image whichImage, integer imageType returns nothing
// export function SetImageType(jassContext, whichImage, imageType) {

// }

// // native CreateUbersplat takes real x, real y, string name, integer red, integer green, integer blue, integer alpha, boolean forcePaused, boolean noBirthTime returns ubersplat
// export function CreateUbersplat(jassContext, x, y, name, red, green, blue, alpha, forcePaused, noBirthTime) {

// }

// // native DestroyUbersplat takes ubersplat whichSplat returns nothing
// export function DestroyUbersplat(jassContext, whichSplat) {

// }

// // native ResetUbersplat takes ubersplat whichSplat returns nothing
// export function ResetUbersplat(jassContext, whichSplat) {

// }

// // native FinishUbersplat takes ubersplat whichSplat returns nothing
// export function FinishUbersplat(jassContext, whichSplat) {

// }

// // native ShowUbersplat takes ubersplat whichSplat, boolean flag returns nothing
// export function ShowUbersplat(jassContext, whichSplat, flag) {

// }

// // native SetUbersplatRender takes ubersplat whichSplat, boolean flag returns nothing
// export function SetUbersplatRender(jassContext, whichSplat, flag) {

// }

// // native SetUbersplatRenderAlways takes ubersplat whichSplat, boolean flag returns nothing
// export function SetUbersplatRenderAlways(jassContext, whichSplat, flag) {

// }

// // native SetBlight takes player whichPlayer, real x, real y, real radius, boolean addBlight returns nothing
// export function SetBlight(jassContext, whichPlayer, x, y, radius, addBlight) {

// }

// // native SetBlightRect takes player whichPlayer, rect r, boolean addBlight returns nothing
// export function SetBlightRect(jassContext, whichPlayer, r, addBlight) {

// }

// // native SetBlightPoint takes player whichPlayer, real x, real y, boolean addBlight returns nothing
// export function SetBlightPoint(jassContext, whichPlayer, x, y, addBlight) {

// }

// // native SetBlightLoc takes player whichPlayer, location whichLocation, real radius, boolean addBlight returns nothing
// export function SetBlightLoc(jassContext, whichPlayer, whichLocation, radius, addBlight) {

// }

// // native CreateBlightedGoldmine takes player id, real x, real y, real face returns unit
// export function CreateBlightedGoldmine(jassContext, id, x, y, face) {

// }

// // native IsPointBlighted takes real x, real y returns boolean
// export function IsPointBlighted(jassContext, x, y) {

// }

// // native SetDoodadAnimation takes real x, real y, real radius, integer doodadID, boolean nearestOnly, string animName, boolean animRandom returns nothing
// export function SetDoodadAnimation(jassContext, x, y, radius, doodadID, nearestOnly, animName, animRandom) {

// }

// // native SetDoodadAnimationRect takes rect r, integer doodadID, string animName, boolean animRandom returns nothing
// export function SetDoodadAnimationRect(jassContext, r, doodadID, animName, animRandom) {

// }

// // native StartMeleeAI takes player num, string script returns nothing
// export function StartMeleeAI(jassContext, num, script) {

// }

// // native StartCampaignAI takes player num, string script returns nothing
// export function StartCampaignAI(jassContext, num, script) {

// }

// // native CommandAI takes player num, integer command, integer data returns nothing
// export function CommandAI(jassContext, num, command, data) {

// }

// // native PauseCompAI takes player p, boolean pause returns nothing
// export function PauseCompAI(jassContext, p, pause) {

// }

// // native GetAIDifficulty takes player num returns aidifficulty
// export function GetAIDifficulty(jassContext, num) {

// }

// // native RemoveGuardPosition takes unit hUnit returns nothing
// export function RemoveGuardPosition(jassContext, hUnit) {

// }

// // native RecycleGuardPosition takes unit hUnit returns nothing
// export function RecycleGuardPosition(jassContext, hUnit) {

// }

// // native RemoveAllGuardPositions takes player num returns nothing
// export function RemoveAllGuardPositions(jassContext, num) {

// }

// // native Cheat takes string cheatStr returns nothing
// export function Cheat(jassContext, cheatStr) {

// }

// // native IsNoVictoryCheat takes nothing returns boolean
// export function IsNoVictoryCheat(jassContext) {

// }

// // native IsNoDefeatCheat takes nothing returns boolean
// export function IsNoDefeatCheat(jassContext) {

// }

// // native Preload takes string filename returns nothing
// export function Preload(jassContext, filename) {

// }

// // native PreloadEnd takes real timeout returns nothing
// export function PreloadEnd(jassContext, timeout) {

// }

// // native PreloadStart takes nothing returns nothing
// export function PreloadStart(jassContext) {

// }

// // native PreloadRefresh takes nothing returns nothing
// export function PreloadRefresh(jassContext) {

// }

// // native PreloadEndEx takes nothing returns nothing
// export function PreloadEndEx(jassContext) {

// }

// // native PreloadGenClear takes nothing returns nothing
// export function PreloadGenClear(jassContext) {

// }

// // native PreloadGenStart takes nothing returns nothing
// export function PreloadGenStart(jassContext) {

// }

// // native PreloadGenEnd takes string filename returns nothing
// export function PreloadGenEnd(jassContext, filename) {

// }

// // native Preloader takes string filename returns nothing
// export function Preloader(jassContext, filename) {

// }
