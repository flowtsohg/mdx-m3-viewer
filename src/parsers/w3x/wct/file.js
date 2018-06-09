import BinaryStream from '../../../common/binarystream';
import CustomTextTrigger from './customtexttrigger';

/**
 * war3map.wct - the custom text (jass) trigger file.
 */
export default class War3MapWct {
  /**
   * @param {?ArrayBuffer} buffer
   */
  constructor(buffer) {
    /** @member {number} */
    this.version = 0;
    /** @member {string} */
    this.comment = '';
    /** @member {?CustomTextTrigger} */
    this.trigger = null;
    /** @member {Array<CustomTextTrigger>} */
    this.triggers = [];

    if (buffer) {
      this.load(buffer);
    }
  }

  /**
   * @param {ArrayBuffer} buffer
   */
  load(buffer) {
    let stream = new BinaryStream(buffer);

    this.version = stream.readInt32();

    if (this.version === 1) {
      this.comment = stream.readUntilNull();

      let trigger = new CustomTextTrigger();

      trigger.load(stream);

      this.trigger = trigger;
    }

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let trigger = new CustomTextTrigger();

      trigger.load(stream);

      this.triggers[i] = trigger;
    }
  }

  /**
   * @return {ArrayBuffer}
   */
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

  /**
   * @return {number}
   */
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
