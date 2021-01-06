import BinaryStream from '../../../common/binarystream';
import { byteLengthUtf8 } from '../../../common/utf8';

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
    if (this.text.length) {
      stream.writeInt32(byteLengthUtf8(this.text) + 1);
      stream.write(this.text);
      stream.skip(1);
    } else {
      stream.writeInt32(0);
    }
  }

  getByteLength() {
    let size = 4;

    if (this.text.length) {
      size += byteLengthUtf8(this.text) + 1;
    }

    return size;
  }
}
