import BinaryStream from '../../../common/binarystream';
import { byteLengthUtf8 } from '../../../common/utf8';

/**
 * A global variable.
 */
export default class Variable {
  name: string = '';
  type: string = '';
  u1: number = 0;
  isArray: number = 0;
  arraySize: number = 0;
  isInitialized: number = 0;
  initialValue: string = '';

  load(stream: BinaryStream, version: number) {
    this.name = stream.readNull();
    this.type = stream.readNull();
    this.u1 = stream.readInt32();
    this.isArray = stream.readInt32();

    if (version === 7) {
      this.arraySize = stream.readInt32();
    }

    this.isInitialized = stream.readInt32();
    this.initialValue = stream.readNull();
  }

  save(stream: BinaryStream, version: number) {
    stream.writeNull(this.name);
    stream.writeNull(this.type);
    stream.writeInt32(this.u1);
    stream.writeInt32(this.isArray);

    if (version === 7) {
      stream.writeInt32(this.arraySize);
    }

    stream.writeInt32(this.isInitialized);
    stream.writeNull(this.initialValue);
  }

  getByteLength(version: number) {
    let size = 15 + byteLengthUtf8(this.name) + byteLengthUtf8(this.type) + byteLengthUtf8(this.initialValue);

    if (version === 7) {
      size += 4;
    }

    return size;
  }
}
