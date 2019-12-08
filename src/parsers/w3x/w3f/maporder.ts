import BinaryStream from '../../../common/binarystream';

/**
 * A map order.
 */
export default class MapOrder {
  u1: number;
  path: string;

  constructor() {
    this.u1 = 0;
    this.path = '';
  }

  load(stream: BinaryStream) {
    this.u1 = stream.readInt8();
    this.path = stream.readUntilNull();
  }

  save(stream: BinaryStream) {
    stream.writeInt8(this.u1);
    stream.write(`${this.path}\0`);
  }

  getByteLength() {
    return 2 + this.path.length;
  }
}
