import SlkFile from '../../slk/file';
import recompile from './recompile';
import * as natives from './natives';
import JassHandle from './types/handle';
import JassAgent from './types/agent';
import JassReference from './types/reference';
import JassPlayer from './types/player';
import constantHandles from './constanthandles';

/**
 * @param {*} value
 * @return {string}
 */
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

/**
 * @param {Array<*>} args
 * @param {War3MapWts} stringTable
 * @return {Array<*>}
 */
function handleArgs(args, stringTable) {
  return args.map((value) => {
    // If this argument is a string, check if it's a trigger string, and if so replace it accordingly.
    if (typeof value === 'string') {
      let match = value.match(/^TRIGSTR_(\d+)$/);

      if (match) {
        return stringTable.get(parseInt(match[1]));
      }
      // If this argument is a reference, pass in its object instead.
    } else if (value instanceof JassReference) {
      return value.object;
    }

    return value;
  });
}

/**
 * A Jass2 context.
 */
export default class JassContext {
  /**
   * @param {War3Map} map
   * @param {string} commonj
   * @param {string} blizzardj
   * @param {string} unitbalanceslk
   */
  constructor(map, commonj, blizzardj, unitbalanceslk) {
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

    this.references = new Set();

    this.tables = {UnitBalance: new SlkFile(unitbalanceslk)};

    this.constantHandles = constantHandles(this);
    this.mapName = '';
    this.mapDescription = '';
    this.gamePlacement = null;
    this.gameSpeed = null;
    this.gameDifficulty = null;
    this.playerCount = 0;
    this.teamCount = 0;
    this.startLocations = [];
    this.players = [];
    this.teams = [];

    this.timers = new Set();

    for (let i = 0; i < 16; i++) {
      this.players[i] = new JassPlayer(this, i);
    }

    this.stringTable = map.readStringTable();
  }

  /**
   * @param {Iterable<string, function>} iterable
   */
  addNatives(iterable) {
    for (let [name, handlerFunc] of iterable) {
      this.natives.set(name, handlerFunc);
    }
  }

  /**
   * @param {string} name
   */
  onNativeDefinition(name) {
    // console.log('onNativeDefinition', name);
  }

  /**
   * @param {string} name
   * @param {function} handlerFunc
   * @return {function}
   */
  onFunctionDefinition(name, handlerFunc) {
    // console.log('onFunctionDefinition', name, handlerFunc);

    return handlerFunc;
  }

  /**
   * @param {string} name
   * @param {*} value
   * @return {*}
   */
  onLocalDefinition(name, value) {
    // console.log('onLocalDefinition', name, value);

    if (value instanceof JassAgent) {
      return this.addReference(name, value);
    }

    return value;
  }

  /**
   * @param {string} name
   * @param {*} value
   * @return {*}
   */
  onGlobalDefinition(name, value) {
    // console.log('onGlobalDefinition', name, value);

    // Store the names global handles are assigned to.
    // It can be nice to get e.g. enum names of types.
    if (value instanceof JassHandle) {
      value.addName(name);
    }

    // If the value is an agent, return a reference instead.
    if (value instanceof JassAgent) {
      return this.addReference(name, value);
    }

    // If the value is a reference, return a reference to the object it references.
    if (value instanceof JassReference) {
      return this.addReference(name, value.object);
    }

    return value;
  }

  /**
   * @param {string} name
   * @param {*} oldValue
   * @param {*} newValue
   * @return {*}
   */
  onVariableSet(name, oldValue, newValue) {
    // console.log('onVariableSet', name, oldValue, newValue);

    // If the old value was a reference, remove it.
    if (oldValue instanceof JassReference) {
      this.removeReference(oldValue);
    }

    // If the new value is an agent, return a reference instead.
    if (newValue instanceof JassAgent) {
      return this.addReference(name, newValue);
    }

    // If the new value is a reference, return a reference to the object it references.
    if (newValue instanceof JassReference) {
      return this.addReference(name, newValue.object);
    }

    // Or just return the value.
    return newValue;
  }

  /**
   * @param {string} name
   * @param {Array<*>} array
   * @param {number} index
   * @param {*} newValue
   */
  onVariableArraySet(name, array, index, newValue) {
    // console.log('onVariableArraySet', name, index, newValue);

    // If the old value was a reference, remove it.
    if (array[index] instanceof JassReference) {
      this.removeReference(array[index]);
    }

    // If the new value is an agent, set a reference instead.
    if (newValue instanceof JassAgent) {
      array[index] = this.addReference(`${name}[${index}]`, newValue);
      return;
    }

    // If the new value is a reference, set a reference to the object it references.
    if (newValue instanceof JassReference) {
      array[index] = this.addReference(`${name}[${index}]`, newValue.object);
      return;
    }

    // Or just return the value.
    array[index] = newValue;
  }

  /**
   * @param {string} name
   * @param {*} value
   * @return {*}
   */
  onVariableGet(name, value) {
    // console.log('onVariableGet', name, value);

    return value;
  }

  /**
   * @param {string} name
   * @param {Array<*>} array
   * @param {number} index
   * @return {*}
   */
  onVariableArrayGet(name, array, index) {
    // console.log('onVariableArrayGet', name, index, array, array[index]);

    return array[index];
  }

  /**
   * @param {JassHandle} handle
   */
  onHandleCreation(handle) {
    // console.log('onHandleCreation', handle);
  }

  /**
   * @param {JassHandle} handle
   */
  onHandleDestruction(handle) {
    // console.log('onHandleDestruction', handle);
  }

  /**
   * @param {JassReference} reference
   */
  onReferenceCreation(reference) {
    console.log('onReferenceCreation', reference);
  }

  /**
   * @param {JassReference} reference
   */
  onReferenceDestruction(reference) {
    console.log('onReferenceDestruction', reference);
  }

  /**
   * @param {string} name
   * @param {Array<*>} args
   * @return {*}
   */
  call(name, ...args) {
    let isNative = false;
    let handlerFunc = this.globals[name];

    if (!handlerFunc) {
      isNative = true;
      handlerFunc = this.natives.get(name);
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
      // Handle references to the string table.
      // E.g. if a string is equal to "TRIGSTR_002", replace it with the matching entry in the table.
      return handlerFunc(this, ...handleArgs(args, this.stringTable));
    }
  }

  /**
   * @param {string} jass
   */
  run(jass) {
    eval(`(function (jassContext, globals) {\n${recompile(jass, this.data)}\n})`)(this, this.globals);
  }

  /**
   *
   */
  start() {
    this.run(this.commonj);
    this.run(this.blizzardj);
    this.run(this.map.getScript());
  }

  /**
   * @param {JassHandle} handle
   * @return {handle}
   */
  addHandle(handle) {
    this.handles.add(handle);

    this.onHandleCreation(handle);

    return handle;
  }

  /**
   * @param {Jasshandle} handle
   * @return {handle}
   */
  removeHandle(handle) {
    if (!this.handles.delete(handle)) {
      throw new Error(`Trying to free handle ${handle} which does not refer to any data`);
    }

    handle.kill();

    this.freeHandles.push(handle);

    this.onHandleDestruction(handle);

    return handle;
  }

  /**
   * @param {string} name
   * @param {JassAgent} value
   * @return {JassReference}
   */
  addReference(name, value) {
    let reference = new JassReference(name, value);

    value.addReference(reference);

    this.references.add(reference);

    this.onReferenceCreation(reference);

    return reference;
  }

  /**
   * @param {JassReference} reference
   */
  removeReference(reference) {
    reference.object.removeReference(reference);

    this.references.delete(reference);

    this.onReferenceDestruction(reference);
  }

  /**
   * @return {number}
   */
  getAvailableHandle() {
    return this.currentHandle++;
  }
}
