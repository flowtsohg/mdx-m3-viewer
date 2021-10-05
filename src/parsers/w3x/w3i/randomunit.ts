import BinaryStream from '../../../common/binarystream';

/**
 * A random unit.
 */
export default class RandomUnit {
  chance = 0;
  ids: string[] = [];

  load(stream: BinaryStream, positions: number): void {
    this.chance = stream.readInt32();

    for (let i = 0; i < positions; i++) {
      this.ids[i] = stream.readBinary(4);
    }
  }

  save(stream: BinaryStream): void {
    stream.writeInt32(this.chance);

    for (const id of this.ids) {
      stream.writeBinary(id);
    }
  }
}
