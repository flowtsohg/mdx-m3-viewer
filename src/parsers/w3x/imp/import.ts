import BinaryStream from '../../../common/binarystream';
import { byteLengthUtf8 } from '../../../common/utf8';

/**
 * An import.
 */
export default class Import {
  isCustom: number = 0;
  path: string = '';

  load(stream: BinaryStream) {
    this.isCustom = stream.readUint8();
    this.path = stream.readNull();
  }

  save(stream: BinaryStream) {
    stream.writeUint8(this.isCustom);
    stream.writeNull(this.path);
  }

  getByteLength() {
    return 2 + byteLengthUtf8(this.path);
  }
}
