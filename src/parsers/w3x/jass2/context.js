import SlkFile from '../../slk/file';
import War3MapUnitsDoo from '../war3mapUnits.doo/file';
import War3MapW3r from '../war3map.w3r/file';
import recompile from './recompile';
import * as natives from './natives';
import JassHandle from './types/handle';
import JassAgent from './types/agent';
import JassPlayer from './types/player';

function valueToString(value) {
    if (value === undefined) {
        return 'undefined';
    } else if (value === null) {
        return 'null';
    } else if (typeof value === 'string') {
        return `"${value}"`;
    } else {
        return value;
    }
}

function replaceTriggerString(args, stringTable) {
    return args.map((value) => {
        if (typeof value === 'string') {
            let match = value.match(/^TRIGSTR_(\d+)$/);

            if (match) {
                return stringTable.get(parseInt(match[1]));
            }
        }

        return value;
    });
}

function Context(map, commonj, blizzardj, unitbalanceslk) {
    this.debugMode = false;

    this.commonj = commonj;
    this.blizzardj = blizzardj;
    this.map = map;

    this.globals = {};
    this.data = {};

    this.natives = new Map();
    this.addNatives(Object.entries(natives));

    this.currentHandle = 0;
    this.freeHandles = [];
    this.handles = new Set();

    this.tables = { UnitBalance: new SlkFile(unitbalanceslk) };

    this.mapName = '';
    this.mapDescription = '';
    this.mapPlacement = null;
    this.mapSpeed = null;
    this.mapDifficulty = null;
    this.playerCount = 0;
    this.teamCount = 0;
    this.startLocations = [];
    this.players = [];
    this.teams = [];

    this.timers = new Set();

    this.collectMode = false;
    this.collected = null;

    for (let i = 0; i < 16; i++) {
        this.players[i] = this.addHandle(new JassPlayer(this, i));
    }

    this.stringTable = map.readStringTable();
}

Context.prototype = {
    addNatives(map) {
        for (let [name, handlerFunc] of map) {
            this.natives.set(name, handlerFunc);
        }
    },

    onNativeDefinition(name) {
        //console.log('onNativeDefinition', name);
    },

    onFunctionDefinition(name, handlerFunc) {
        //console.log('onFunctionDefinition', name, handlerFunc);

        return handlerFunc;
    },

    onLocalDefinition(name, value) {
        //console.log('onLocalDefinition', name, value);

        if (value instanceof JassHandle) {
            value.addReference(name);
        }

        return value;
    },

    onGlobalDefinition(name, value) {
        //console.log('onGlobalDefinition', name, value);

        if (value instanceof JassHandle) {
            value.addName(name);
        }

        if (value instanceof JassAgent) {
            value.addReference();
        }

        return value;
    },

    onVariableSet(name, oldValue, newValue) {
        //console.log('onVariableSet', name, oldValue, newValue);

        if (oldValue instanceof JassAgent) {
            oldValue.removeReference();
        }

        if (newValue instanceof JassHandle) {
            newValue.addName(name);
        }

        if (newValue instanceof JassAgent) {
            newValue.addReference();
        }

        return newValue;
    },

    onVariableArraySet(name, array, index, newValue) {
        //console.log('onVariableArraySet', name, index, newValue);

        array[index] = newValue;
    },

    onVariableGet(name, value) {
        //console.log('onVariableGet', name, value);

        return value;
    },

    onVariableArrayGet(name, array, index) {
        //console.log('onVariableArrayGet', name, index, array, array[index]);

        return array[index];
    },

    onHandleCreation(handle) {
        //console.log('onHandleCreation', handle);
    },

    onHandleDestruction(handle) {
        //console.log('onHandleDestruction', handle);
    },

    call(name, ...args) {
        let isNative = false,
            handlerFunc = this.globals[name];

        if (!handlerFunc) {
            isNative = true;
            handlerFunc = this.natives.get(name);

            // Handle references to the string table.
            // E.g. if a string is equal to "TRIGSTR_002", replace it with the matching entry in the table.
            args = replaceTriggerString(args, this.stringTable);
        }

        if (this.debugMode) {
            let message = `[${isNative ? 'Native' : 'User'}] ${name}(${args.map(valueToString).join(', ')})`;

            if (handlerFunc) {
                console.warn(message);
            } else {
                console.error(message);
            }
        }

        if (handlerFunc) {
            return handlerFunc(this, ...args);
        }
    },

    run(jass) {
        eval(`(function (jassContext, globals) {\n${recompile(jass, this.data)}\n})`)(this, this.globals);
    },

    start() {
        this.run(this.commonj);
        this.run(this.blizzardj);
        this.run(this.map.getScript());
    },

    addHandle(handle) {
        this.handles.add(handle);

        this.onHandleCreation(handle);

        return handle;
    },

    removeHandle(handle) {
        if (!this.handles.delete(handle)) {
            throw new Error(`Trying to free handle ${handle} which does not refer to any data`);
        }

        handle.kill();

        this.freeHandles.push(handle);

        this.onHandleDestruction(handle);

        return handle;
    },

    getAvailableHandle() {
        return this.currentHandle++;
    }
};

export default Context;
