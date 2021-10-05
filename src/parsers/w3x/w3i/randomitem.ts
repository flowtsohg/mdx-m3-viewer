import BinaryStream from '../../../common/binarystream';

/**
 * A random item.
 */
export default class RandomItem {
  chance = 0;
  id = '\0\0\0\0';

  load(stream: BinaryStream): void {
    this.chance = stream.readInt32();
    this.id = stream.readBinary(4);
  }

  save(stream: BinaryStream): void {
    stream.writeInt32(this.chance);
    stream.writeBinary(this.id);
  }
}
