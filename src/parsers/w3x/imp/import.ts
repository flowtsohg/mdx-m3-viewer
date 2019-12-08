import BinaryStream from '../../../common/binarystream';

/**
 * An import.
 */
export default class Import {
  isCustom: number;
  path: string;

  constructor() {
    this.isCustom = 0;
    this.path = '';
  }

  load(stream: BinaryStream) {
    this.isCustom = stream.readUint8();
    this.path = stream.readUntilNull();
  }

  save(stream: BinaryStream) {
    stream.writeUint8(this.isCustom);
    stream.write(`${this.path}\0`);
  }

  getByteLength() {
    return 2 + this.path.length;
  }
}
