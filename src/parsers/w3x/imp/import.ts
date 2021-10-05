import BinaryStream from '../../../common/binarystream';
import { byteLengthUtf8 } from '../../../common/utf8';

/**
 * An import.
 */
export default class Import {
  isCustom = 0;
  path = '';

  load(stream: BinaryStream): void {
    this.isCustom = stream.readUint8();
    this.path = stream.readNull();
  }

  save(stream: BinaryStream): void {
    stream.writeUint8(this.isCustom);
    stream.writeNull(this.path);
  }

  getByteLength(): number {
    return 2 + byteLengthUtf8(this.path);
  }
}
