import RandomItemSet from './randomitemset';

/**
 * A random item table.
 */
export default class RandomItemTable {
  /**
   *
   */
  constructor() {
    /** @member {number} */
    this.id = 0;
    /** @member {string} */
    this.name = '';
    /** @member {Array<RandomItemSet>} */
    this.sets = [];
  }

  /**
   * @param {BinaryStream} stream
   */
  load(stream) {
    this.id = stream.readInt32();
    this.name = stream.readUntilNull();

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let set = new RandomItemSet();

      set.load(stream);

      this.sets[i] = set;
    }
  }

  /**
   * @param {BinaryStream} stream
   */
  save(stream) {
    stream.writeInt32(this.id);
    stream.write(`${this.name}\0`);
    stream.writeUint32(this.sets.length);

    for (let set of this.sets) {
      set.save(stream);
    }
  }

  /**
   * @return {number}
   */
  getByteLength() {
    let size = 9 + this.name.length;

    for (let set of this.sets) {
      size += set.getByteLength();
    }

    return size;
  }
}
