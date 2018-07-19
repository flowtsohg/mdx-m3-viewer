import IniFile from '../../ini/file';

/**
 * Trigger data needed to load a WTG file.
 */
export default class TriggerData {
  /**
   *
   */
  constructor() {
    /** @member {Object<string, string>} */
    this.types = {};
    /** @member {Array<Object>} */
    this.functions = [{}, {}, {}, {}];
    /** @member {Object<string, string>} */
    this.presets = {};
    /** @member {Object<string, string>} */
    this.externalTypes = {};
    /** @member {Array<Object>} */
    this.externalFunctions = [{}, {}, {}, {}];
    /** @member {Object<string, string>} */
    this.externalPresets = {};
  }

  /**
   * @param {string} buffer
   * @param {boolean} isExternal
   */
  addTriggerData(buffer, isExternal) {
    let types = this.types;
    let functions = this.functions;
    let presets = this.presets;

    if (isExternal) {
      types = this.externalTypes;
      functions = this.externalFunctions;
      presets = this.externalPresets;
    }

    let triggerData = new IniFile();

    triggerData.load(buffer);

    this.addTriggerTypes(types, triggerData.getSection('TriggerTypes'));
    this.addTriggerDataFunctions(functions[0], triggerData.getSection('TriggerEvents'), 1);
    this.addTriggerDataFunctions(functions[1], triggerData.getSection('TriggerConditions'), 1);
    this.addTriggerDataFunctions(functions[2], triggerData.getSection('TriggerActions'), 1);
    this.addTriggerDataFunctions(functions[3], triggerData.getSection('TriggerCalls'), 3);
    this.addTriggerDataPresets(presets, triggerData.getSection('TriggerParams'));
  }

  /**
   * @param {Object} types
   * @param {Map<string, string>} section
   */
  addTriggerTypes(types, section) {
    for (let [key, value] of section) {
      let tokens = value.split(',');

      types[key] = tokens[4] || '';
    }
  }

  /**
   * @param {Object} functions
   * @param {Map<string, string>} section
   * @param {number} skipped
   */
  addTriggerDataFunctions(functions, section, skipped) {
    for (let [key, value] of section) {
      // We don't care about metadata lines.
      if (key[0] !== '_') {
        let tokens = value.split(',').slice(skipped);
        let args = [];

        // Can be used by actions to make aliases.
        let scriptName = section.get(`_${key}_scriptname`) || null;

        for (let argument of tokens) {
          // We don't care about constants.
          if (isNaN(argument) && argument !== 'nothing' && argument !== '') {
            args.push(argument);
          }
        }

        functions[key] = {args, scriptName};
      }
    }
  }

  /**
   * @param {Object} presets
   * @param {Map<string, string>} section
   */
  addTriggerDataPresets(presets, section) {
    for (let [key, value] of section) {
      let tokens = value.split(',');

      // Note that the operators are enclosed by "" for some reason.
      // Note that string literals are enclosed by backticks.
      presets[key] = tokens[2].replace(/"/g, '').replace(/`/g, '"');
    }
  }

  /**
   * Given a type, return its base type.
   * Returns the given type if its not a child type.
   *
   * @param {string} type
   * @return {string}
   */
  getBaseType(type) {
    type = type.toLowerCase();

    let base = this.types[type];

    if (base === undefined) {
      base = this.externalTypes[type];
    }

    // Same as !base, but be explicit to be clearer.
    if (base === '' || base === undefined) {
      return type;
    }

    return base;
  }

  /**
   * @param {number} type
   * @param {string} name
   * @return {boolean}
   */
  isBaseFunction(type, name) {
    name = name.toLowerCase();

    if (this.functions[type][name]) {
      return true;
    }

    return false;
  }

  /**
   * Gets the signature of the given function.
   *
   * @param {number} type
   * @param {string} name
   * @return {Array<string>}
   */
  getFunction(type, name) {
    name = name.toLowerCase();

    let args = this.functions[type][name];

    if (!args) {
      args = this.externalFunctions[type][name];

      if (!args) {
        throw new Error(`Tried to get signature for unknown function "${name}"`);
      }
    }

    return args;
  }

  /**
  * Gets a preset value.
  *
  * @param {string} name
  * @return {string}
  */
  getPreset(name) {
    name = name.toLowerCase();

    let preset = this.presets[name];

    if (preset === undefined) {
      preset = this.externalPresets[name];

      if (preset === undefined) {
        throw new Error(`Failed to find a preset: ${name}`);
      }
    }

    return preset;
  }

  /**
   * Is the given preset a custom or standard one?
   *
   * @param {string} name
   * @return {boolean}
   */
  isCustomPreset(name) {
    name = name.toLowerCase();

    if (this.presets[name] !== undefined) {
      return false;
    }

    if (this.externalPresets[name] !== undefined) {
      return true;
    }

    throw new Error(`Failed to find a preset: ${name}`);
  }
}
