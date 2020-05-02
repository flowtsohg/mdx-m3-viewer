import BinaryStream from '../../../common/binarystream';
import TriggerCategory from './triggercategory';
import Variable from './variable';
import Trigger from './trigger';
import TriggerData from './triggerdata';

/**
 * war3map.wtg - the trigger file.
 */
export default class War3MapWtg {
  version: number = 0;
  categories: TriggerCategory[] = [];
  u1: number = 0;
  variables: Variable[] = [];
  triggers: Trigger[] = [];

  constructor(buffer?: ArrayBuffer, triggerData?: TriggerData) {
    if (buffer && triggerData) {
      this.load(buffer, triggerData);
    }
  }

  load(buffer: ArrayBuffer, triggerData: TriggerData) {
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

      try {
        trigger.load(stream, this.version, triggerData);
      } catch (e) {
        throw new Error(`Trigger ${i}: ${e}`);
      }

      this.triggers[i] = trigger;
    }
  }

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

  getByteLength() {
    let size = 24;
    let version = this.version;

    for (let category of this.categories) {
      size += category.getByteLength(version);
    }

    for (let variable of this.variables) {
      size += variable.getByteLength(version);
    }

    for (let trigger of this.triggers) {
      size += trigger.getByteLength(version);
    }

    return size;
  }
}
