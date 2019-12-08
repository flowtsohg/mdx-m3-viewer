import BinaryStream from '../../../common/binarystream';
import SubParameters from './subparameters';
import TriggerData from './triggerdata';

/**
 * A function parameter. Can be a function itself, in which case it will have a SubParameters structure.
 */
export default class Parameter {
  type: number;
  value: string;
  subParameters: SubParameters | null;
  u1: number;
  isArray: number;
  arrayIndex: Parameter | null;

  constructor() {
    this.type = 0;
    this.value = '';
    this.subParameters = null;
    this.u1 = 0;
    this.isArray = 0;
    this.arrayIndex = null;
  }

  load(stream: BinaryStream, version: number, triggerData: TriggerData) {
    this.type = stream.readInt32();
    this.value = stream.readUntilNull();

    if (stream.readInt32()) {
      let subParameters = new SubParameters();

      subParameters.load(stream, version, triggerData);

      this.subParameters = subParameters;
    }

    if ((version === 4 && this.type === 2) || (version === 7 && this.subParameters)) {
      this.u1 = stream.readInt32();
    }

    if ((version === 4 && this.type !== 2) || version === 7) {
      this.isArray = stream.readInt32();
    }

    if (this.isArray) {
      let arrayIndex = new Parameter();

      arrayIndex.load(stream, version, triggerData);

      this.arrayIndex = arrayIndex;
    }
  }

  save(stream: BinaryStream, version: number) {
    stream.writeInt32(this.type);
    stream.write(`${this.value}\0`);

    if (this.subParameters) {
      stream.writeInt32(1);
      this.subParameters.save(stream, version);
    } else {
      stream.writeInt32(0);
    }

    if ((version === 4 && this.type === 2) || (version === 7 && this.subParameters)) {
      stream.writeInt32(this.u1);
    }

    if ((version === 4 && this.type !== 2) || version === 7) {
      stream.writeInt32(this.isArray);
    }

    if (this.isArray && this.arrayIndex) {
      this.arrayIndex.save(stream, version);
    }
  }

  getByteLength(version: number) {
    let size = 9 + this.value.length;

    if (this.subParameters) {
      size += this.subParameters.getByteLength(version);
    }

    if ((version === 4 && this.type === 2) || (version === 7 && this.subParameters)) {
      size += 4;
    }

    if ((version === 4 && this.type !== 2) || version === 7) {
      size += 4;
    }

    if (this.isArray && this.arrayIndex) {
      size += this.arrayIndex.getByteLength(version);
    }

    return size;
  }
}
