import BinaryStream from '../../../common/binarystream';

/**
 * A random unit.
 */
export default class RandomUnit {
  chance: number = 0;
  ids: string[] = [];

  load(stream: BinaryStream, positions: number) {
    this.chance = stream.readInt32();

    for (let i = 0; i < positions; i++) {
      this.ids[i] = stream.read(4, true);
    }
  }

  save(stream: BinaryStream) {
    stream.writeInt32(this.chance);

    for (let id of this.ids) {
      stream.write(id);
    }
  }
}
