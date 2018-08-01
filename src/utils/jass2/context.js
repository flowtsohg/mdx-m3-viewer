
import EventEmitter from 'events';
import MappedData from '../mappeddata';
import recompile from './recompile';
import * as natives from './natives';
import JassHandle from './types/handle';
import JassAgent from './types/agent';
import JassReference from './types/reference';
import JassPlayer from './types/player';
import constantHandles from './constanthandles';

/**
 * A Jass2 context.
 */
export default class JassContext extends EventEmitter {
  /**
   * @param {War3Map} map
   */
  constructor(map) {
    super();

    this.debugMode = false;

    this.map = map;

    this.globals = {};
    this.data = {};

    this.natives = new Map();
    this.addNatives(Object.entries(natives));

    this.currentHandle = 0;
    this.freeHandles = [];
    this.handles = new Set();

    this.references = new Set();

    this.mappedData = new MappedData();

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

    //For now hardcoded to 1.29+
    for (let i = 0; i < 28; i++) {
      this.players[i] = new JassPlayer(this, i, 28);
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
  onNativeDef(name) {
    if (this.debugMode) {
      this.emit('nativedef', name);
    }
  }

  /**
   * @param {string} name
   * @param {function} handlerFunc
   * @return {function}
   */
  onFunctionDef(name, handlerFunc) {
    if (this.debugMode) {
      this.emit('functiondef', name, handlerFunc);
    }

    return handlerFunc;
  }

  /**
   * @param {string} name
   * @param {*} value
   * @return {*}
   */
  onLocalVarDef(name, value) {
    if (this.debugMode) {
      this.emit('localvardef', name, value);
    }

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
  onGlobalVarDef(name, value) {
    if (this.debugMode) {
      this.emit('globalvardef', name, value);
    }

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
  onVarSet(name, oldValue, newValue) {
    if (this.debugMode) {
      this.emit('varset', name, oldValue, newValue);
    }

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
  onArrayVarSet(name, array, index, newValue) {
    let oldValue = array[index];

    if (this.debugMode) {
      this.emit('arrayvarset', name, index, oldValue, newValue);
    }

    // If the old value was a reference, remove it.
    if (oldValue instanceof JassReference) {
      this.removeReference(oldValue);
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
  onVarGet(name, value) {
    if (this.debugMode) {
      this.emit('varget', name, value);
    }

    return value;
  }

  /**
   * @param {string} name
   * @param {Array<*>} array
   * @param {number} index
   * @return {*}
   */
  onArrayVarGet(name, array, index) {
    let value = array[index];

    if (this.debugMode) {
      this.emit('arrayvarget', name, index, value);
    }

    return value;
  }

  /**
   * @param {JassHandle} handle
   */
  onHandleCreation(handle) {
    if (this.debugMode) {
      this.emit('handlecreated', handle);
    }
  }

  /**
   * @param {JassHandle} handle
   */
  onHandleDestruction(handle) {
    if (this.debugMode) {
      this.emit('handledestroyed', handle);
    }
  }

  /**
   * @param {JassReference} reference
   */
  onReferenceCreation(reference) {
    if (this.debugMode) {
      this.emit('refcreated', reference);
    }
  }

  /**
   * @param {JassReference} reference
   */
  onReferenceDestruction(reference) {
    if (this.debugMode) {
      this.emit('refdestroyed', reference);
    }
  }

  /**
   * @param {string} name
   * @param {Array<*>} args
   * @return {*}
   */
  call(name, ...args) {
    let handlerFunc = this.globals[name];

    if (!handlerFunc) {
      handlerFunc = this.natives.get(name);
    }

    if (this.debugMode) {
      this.emit('call', name, args, handlerFunc);
    }

    if (handlerFunc) {
      return handlerFunc(this, ...args.map((value) => {
        // If this argument is a string, check if it's a trigger string, and if so replace it accordingly.
        if (typeof value === 'string') {
          let match = value.match(/^TRIGSTR_(\d+)$/);

          if (match) {
            return this.stringTable.stringMap.get(parseInt(match[1]));
          }
          // If this argument is a reference, pass in its object instead.
        } else if (value instanceof JassReference) {
          return value.object;
        }

        // Otherwise return the value directly.
        return value;
      }));
    }
  }

  /**
   * @param {string} js
   */
  run(js) {
    eval(`(function (jass, globals) {\n${js}\n})`)(this, this.globals);
  }

  /**
   * @param {string} jass
   * @return {string}
   */
  recompile(jass) {
    return recompile(jass, this.data);
  }

  /**
   *
   */
  start() {
    this.run(this.recompile(this.commonj));
    this.run(this.recompile(this.blizzardj));
    this.run(this.recompile(this.map.getScript()));
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
