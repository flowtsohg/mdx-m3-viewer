import TokenStream from '../../../common/tokenstream';
import IniFile from '../../ini/file';

/**
 * Trigger data needed to load a WTG file.
 */
export default class TriggerData {
  /**
   *
   */
  constructor() {
    /** @member {Object<string, Array<string>>} */
    this.functions = {};
    /** @member {Object<string, string>} */
    this.presets = {};
    /** @member {Object<string, Array<string>>} */
    this.externalFunctions = {};
    /** @member {Object<string, string>} */
    this.externalPresets = {};
  }

  /**
   * @param {string} buffer
   * @param {boolean} isExternal
   */
  addTriggerData(buffer, isExternal) {
    let functions = this.functions;
    let presets = this.presets;

    if (isExternal) {
      functions = this.externalFunctions;
      presets = this.externalPresets;
    }

    let triggerData = new IniFile();

    triggerData.load(buffer);

    this.addTriggerDataFunctions(functions, triggerData.getSection('TriggerEvents'), 1);
    this.addTriggerDataFunctions(functions, triggerData.getSection('TriggerConditions'), 1);
    this.addTriggerDataFunctions(functions, triggerData.getSection('TriggerActions'), 1);
    this.addTriggerDataFunctions(functions, triggerData.getSection('TriggerCalls'), 3);
    this.addTriggerDataPresets(presets, triggerData.getSection('TriggerParams'));
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
        let types = [];
        let tokens = value.split(',').slice(skipped);

        for (let argument of tokens) {
          // We don't care about constants.
          if (isNaN(argument) && argument !== 'nothing' && argument !== '') {
            types.push(argument);
          }
        }

        functions[key] = types;
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
   * @param {string} buffer
   */
  addNativeFunctions(buffer) {
    let stream = new TokenStream(buffer);
    let token;

    while ((token = stream.read()) !== undefined) {
      if (token === 'native') {
        let name = stream.read();
        let args = [];

        stream.read(); // takes

        token = stream.read(); // nothing or a type
        while (token !== 'returns' && token !== 'nothing') {
          args.push(token);

          stream.read(); // name

          token = stream.read(); // next type, or returns
        }

        this.externalFunctions[name.toLowerCase()] = args;
      }
    }
  }

  /**
   * Gets the signature of the given function.
   *
   * @param {string} name
   * @return {Array<string>}
   */
  getFunction(name) {
    name = name.toLowerCase();

    let args = this.functions[name];

    if (!args) {
      args = this.externalFunctions[name];

      if (!args) {
        throw new Error('Tried to get signature for unknown function', name);
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
}
