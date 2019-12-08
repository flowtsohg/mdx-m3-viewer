import BinaryStream from '../../../common/binarystream';

/**
 * A global variable.
 */
export default class Variable {
  name: string;
  type: string;
  u1: number;
  isArray: number;
  arraySize: number;
  isInitialized: number;
  initialValue: string;

  constructor() {
    this.name = '';
    this.type = '';
    this.u1 = 0;
    this.isArray = 0;
    this.arraySize = 0;
    this.isInitialized = 0;
    this.initialValue = '';
  }

  load(stream: BinaryStream, version: number) {
    this.name = stream.readUntilNull();
    this.type = stream.readUntilNull();
    this.u1 = stream.readInt32();
    this.isArray = stream.readInt32();

    if (version === 7) {
      this.arraySize = stream.readInt32();
    }

    this.isInitialized = stream.readInt32();
    this.initialValue = stream.readUntilNull();
  }

  save(stream: BinaryStream, version: number) {
    stream.write(`${this.name}\0`);
    stream.write(`${this.type}\0`);
    stream.writeInt32(this.u1);
    stream.writeInt32(this.isArray);

    if (version === 7) {
      stream.writeInt32(this.arraySize);
    }

    stream.writeInt32(this.isInitialized);
    stream.write(`${this.initialValue}\0`);
  }

  getByteLength(version: number) {
    let size = 15 + this.name.length + this.type.length + this.initialValue.length;

    if (version === 7) {
      size += 4;
    }

    return size;
  }
}
