import BinaryStream from '../../../common/binarystream';
import { byteLengthUtf8 } from '../../../common/utf8';
import ECA from './eca';
import { TriggerData } from './triggerdata';

/**
 * A GUI Trigger.
 */
export default class Trigger {
  name = '';
  description = '';
  isComment = 0;
  isEnabled = 0;
  isCustom = 0;
  isInitiallyOff = 0;
  runOnInitialization = 0;
  category = 0;
  ecas: ECA[] = [];

  load(stream: BinaryStream, version: number, triggerData: TriggerData): void {
    this.name = stream.readNull();
    this.description = stream.readNull();

    if (version === 7) {
      this.isComment = stream.readInt32();
    }

    this.isEnabled = stream.readInt32();
    this.isCustom = stream.readInt32();
    this.isInitiallyOff = stream.readInt32();
    this.runOnInitialization = stream.readInt32();
    this.category = stream.readInt32();

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      const eca = new ECA();

      try {
        eca.load(stream, version, false, triggerData);
      } catch (e) {
        throw new Error(`Trigger "${this.name}": ECA ${i}: ${e}`);
      }

      this.ecas[i] = eca;
    }
  }

  save(stream: BinaryStream, version: number): void {
    stream.writeNull(this.name);
    stream.writeNull(this.description);

    if (version === 7) {
      stream.writeInt32(this.isComment);
    }

    stream.writeInt32(this.isEnabled);
    stream.writeInt32(this.isCustom);
    stream.writeInt32(this.isInitiallyOff);
    stream.writeInt32(this.runOnInitialization);
    stream.writeInt32(this.category);
    stream.writeUint32(this.ecas.length);

    for (const eca of this.ecas) {
      eca.save(stream, version);
    }
  }

  getByteLength(version: number): number {
    let size = 26 + byteLengthUtf8(this.name) + byteLengthUtf8(this.description);

    if (version === 7) {
      size += 4;
    }

    for (const eca of this.ecas) {
      size += eca.getByteLength(version);
    }

    return size;
  }
}
