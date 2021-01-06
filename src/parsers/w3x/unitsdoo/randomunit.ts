import BinaryStream from '../../../common/binarystream';

/**
 * A random unit.
 */
export default class RandomUnit {
  id: string = '\0\0\0\0';
  chance: number = 0;

  load(stream: BinaryStream) {
    this.id = stream.readBinary(4);
    this.chance = stream.readInt32();
  }

  save(stream: BinaryStream) {
    stream.writeBinary(this.id);
    stream.writeInt32(this.chance);
  }
}
