import BinaryStream from '../../../common/binarystream';

/**
 * A custom text trigger.
 */
export default class CustomTextTrigger {
  text: string = '';

  load(stream: BinaryStream) {
    let textLength = stream.readInt32();

    if (textLength) {
      this.text = stream.read(textLength - 1);
      stream.skip(1);
    }
  }

  save(stream: BinaryStream) {
    let text = this.text;

    if (text.length) {
      stream.writeInt32(this.text.length + 1);
      stream.write(`${this.text}\0`);
    } else {
      stream.writeInt32(0);
    }
  }

  getByteLength() {
    let size = 4;

    if (this.text.length) {
      size += this.text.length + 1;
    }

    return size;
  }
}
