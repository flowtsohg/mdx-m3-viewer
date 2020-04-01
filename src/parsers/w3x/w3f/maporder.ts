import BinaryStream from '../../../common/binarystream';

/**
 * A map order.
 */
export default class MapOrder {
  u1: number = 0;
  path: string = '';

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
