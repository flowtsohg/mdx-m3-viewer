import BinaryStream from '../../../common/binarystream';
import { byteLengthUtf8 } from '../../../common/utf8';

/**
 * A map order.
 */
export default class MapOrder {
  u1 = 0;
  path = '';

  load(stream: BinaryStream): void {
    this.u1 = stream.readInt8();
    this.path = stream.readNull();
  }

  save(stream: BinaryStream): void {
    stream.writeInt8(this.u1);
    stream.writeNull(this.path);
  }

  getByteLength(): number {
    return 2 + byteLengthUtf8(this.path);
  }
}
