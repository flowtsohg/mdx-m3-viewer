import BinaryStream from '../../../common/binarystream';
import TriggerCategory from './triggercategory';
import Variable from './variable';
import Trigger from './trigger';

/**
 * war3map.wtg - the trigger file.
 */
export default class War3MapWtg {
  /**
   * @param {?ArrayBuffer} buffer
   * @param {?TriggerData} triggerData
   */
  constructor(buffer, triggerData) {
    this.version = 0;
    this.categories = [];
    this.u1 = 0;
    this.variables = [];
    this.triggers = [];

    if (buffer) {
      this.load(buffer, triggerData);
    }
  }

  /**
   * @param {ArrayBuffer} buffer
   * @param {TriggerData} triggerData
   */
  load(buffer, triggerData) {
    let stream = new BinaryStream(buffer);

    if (stream.read(4) !== 'WTG!') {
      throw new Error('Not a WTG file');
    }

    this.version = stream.readInt32();

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let category = new TriggerCategory();

      category.load(stream, this.version);

      this.categories[i] = category;
    }

    this.u1 = stream.readInt32();

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let variable = new Variable();

      variable.load(stream, this.version);

      this.variables[i] = variable;
    }

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let trigger = new Trigger();

      trigger.load(stream, this.version, triggerData);

      this.triggers[i] = trigger;
    }
  }

  /**
   * @return {ArrayBuffer}
   */
  save() {
    let buffer = new ArrayBuffer(this.getByteLength());
    let stream = new BinaryStream(buffer);

    stream.write('WTG!');
    stream.writeInt32(this.version);
    stream.writeUint32(this.categories.length);

    for (let category of this.categories) {
      category.save(stream, this.version);
    }

    stream.writeInt32(this.u1);
    stream.writeUint32(this.variables.length);

    for (let variable of this.variables) {
      variable.save(stream, this.version);
    }

    stream.writeUint32(this.triggers.length);

    for (let trigger of this.triggers) {
      trigger.save(stream, this.version);
    }

    return buffer;
  }

  /**
   * @return {number}
   */
  getByteLength() {
    let size = 24;

    for (let category of this.categories) {
      size += category.getByteLength(this.version);
    }

    for (let variable of this.variables) {
      size += variable.getByteLength(this.version);
    }

    for (let trigger of this.triggers) {
      size += trigger.getByteLength(this.version);
    }

    return size;
  }
}
