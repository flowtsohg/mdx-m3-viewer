import BinaryStream from '../../../common/binarystream';
import { byteLengthUtf8 } from '../../../common/utf8';

/**
 * A map order.
 */
export default class MapOrder {
  u1: number = 0;
  path: string = '';

  load(stream: BinaryStream) {
    this.u1 = stream.readInt8();
    this.path = stream.readNull();
  }

  save(stream: BinaryStream) {
    stream.writeInt8(this.u1);
    stream.writeNull(this.path);
  }

  getByteLength() {
    return 2 + byteLengthUtf8(this.path);
  }
}
