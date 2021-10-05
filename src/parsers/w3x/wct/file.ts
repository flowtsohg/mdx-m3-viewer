import BinaryStream from '../../../common/binarystream';
import { byteLengthUtf8 } from '../../../common/utf8';
import CustomTextTrigger from './customtexttrigger';

/**
 * war3map.wct - the custom text (jass) trigger file.
 */
export default class War3MapWct {
  version = 0;
  comment = '';
  trigger = new CustomTextTrigger();
  triggers: CustomTextTrigger[] = [];

  load(buffer: ArrayBuffer | Uint8Array): void {
    const stream = new BinaryStream(buffer);

    this.version = stream.readInt32();

    if (this.version === 1) {
      this.comment = stream.readNull();

      this.trigger.load(stream);
    }

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      const trigger = new CustomTextTrigger();

      trigger.load(stream);

      this.triggers[i] = trigger;
    }
  }

  save(): Uint8Array {
    const stream = new BinaryStream(new ArrayBuffer(this.getByteLength()));

    stream.writeInt32(this.version);

    if (this.version === 1) {
      stream.writeNull(this.comment);

      this.trigger.save(stream);
    }

    stream.writeUint32(this.triggers.length);

    for (const trigger of this.triggers) {
      trigger.save(stream);
    }

    return stream.uint8array;
  }

  getByteLength(): number {
    let size = 8;

    if (this.version === 1) {
      size += byteLengthUtf8(this.comment) + 1 + this.trigger.getByteLength();
    }

    for (const trigger of this.triggers) {
      size += trigger.getByteLength();
    }

    return size;
  }
}
