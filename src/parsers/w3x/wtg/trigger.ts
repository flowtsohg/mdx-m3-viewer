import BinaryStream from '../../../common/binarystream';
import ECA from './eca';
import TriggerData from './triggerdata';

/**
 * A GUI Trigger.
 */
export default class Trigger {
  name: string = '';
  description: string = '';
  isComment: number = 0;
  isEnabled: number = 0;
  isCustom: number = 0;
  isInitiallyOff: number = 0;
  runOnInitialization: number = 0;
  category: number = 0;
  ecas: ECA[] = [];

  load(stream: BinaryStream, version: number, triggerData: TriggerData) {
    this.name = stream.readUntilNull();
    this.description = stream.readUntilNull();

    if (version === 7) {
      this.isComment = stream.readInt32();
    }

    this.isEnabled = stream.readInt32();
    this.isCustom = stream.readInt32();
    this.isInitiallyOff = stream.readInt32();
    this.runOnInitialization = stream.readInt32();
    this.category = stream.readInt32();

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let eca = new ECA();

      try {
        eca.load(stream, version, false, triggerData);
      } catch (e) {
        throw new Error(`Trigger "${this.name}": ECA ${i}: ${e}`);
      }

      this.ecas[i] = eca;
    }
  }

  save(stream: BinaryStream, version: number) {
    stream.write(`${this.name}\0`);
    stream.write(`${this.description}\0`);

    if (version === 7) {
      stream.writeInt32(this.isComment);
    }

    stream.writeInt32(this.isEnabled);
    stream.writeInt32(this.isCustom);
    stream.writeInt32(this.isInitiallyOff);
    stream.writeInt32(this.runOnInitialization);
    stream.writeInt32(this.category);
    stream.writeUint32(this.ecas.length);

    for (let eca of this.ecas) {
      eca.save(stream, version);
    }
  }

  getByteLength(version: number) {
    let size = 26 + this.name.length + this.description.length;

    if (version === 7) {
      size += 4;
    }

    for (let eca of this.ecas) {
      size += eca.getByteLength(version);
    }

    return size;
  }
}
