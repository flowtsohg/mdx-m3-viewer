import BinaryStream from '../../../common/binarystream';
import CustomTextTrigger from './customtexttrigger';

/**
 * war3map.wct - the custom text (jass) trigger file.
 */
export default class War3MapWct {
  version: number = 0;
  comment: string = '';
  trigger: CustomTextTrigger = new CustomTextTrigger();
  triggers: CustomTextTrigger[] = [];

  constructor(buffer?: ArrayBuffer) {
    if (buffer) {
      this.load(buffer);
    }
  }

  load(buffer: ArrayBuffer) {
    let stream = new BinaryStream(buffer);

    this.version = stream.readInt32();

    if (this.version === 1) {
      this.comment = stream.readUntilNull();

      this.trigger.load(stream);
    }

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let trigger = new CustomTextTrigger();

      trigger.load(stream);

      this.triggers[i] = trigger;
    }
  }

  save() {
    let buffer = new ArrayBuffer(this.getByteLength());
    let stream = new BinaryStream(buffer);

    stream.writeInt32(this.version);

    if (this.version === 1) {
      stream.write(`${this.comment}\0`);

      this.trigger.save(stream);
    }

    stream.writeUint32(this.triggers.length);

    for (let trigger of this.triggers) {
      trigger.save(stream);
    }

    return buffer;
  }

  getByteLength() {
    let size = 8;

    if (this.version === 1) {
      size += this.comment.length + 1 + this.trigger.getByteLength();
    }

    for (let trigger of this.triggers) {
      size += trigger.getByteLength();
    }

    return size;
  }
}
