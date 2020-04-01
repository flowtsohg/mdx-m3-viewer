import BinaryStream from '../../../common/binarystream';

/**
 * A random item.
 */
export default class RandomItem {
  chance: number = 0;
  id: string = '\0\0\0\0';

  load(stream: BinaryStream) {
    this.chance = stream.readInt32();
    this.id = stream.read(4);
  }

  save(stream: BinaryStream) {
    stream.writeInt32(this.chance);
    stream.write(this.id);
  }
}
