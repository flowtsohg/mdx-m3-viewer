import RandomUnit from './randomunit';

/**
 * A random unit table.
 */
export default class RandomUnitTable {
  /**
   *
   */
  constructor() {
    /** @member {number} */
    this.id = 0;
    /** @member {string} */
    this.name = '';
    /** @member {number} */
    this.positions = 0;
    /** @member {Int32Array} */
    this.columnTypes = new Int32Array(1);
    /** @member {Array<RandomUnit>} */
    this.units = [];
  }

  /**
   * @param {BinaryStream} stream
   */
  load(stream) {
    this.id = stream.readInt32();
    this.name = stream.readUntilNull();
    this.positions = stream.readInt32();
    this.columnTypes = stream.readInt32Array(this.positions);

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let unit = new RandomUnit();

      unit.load(stream, this.positions);

      this.units[i] = unit;
    }
  }

  /**
   * @param {BinaryStream} stream
   */
  save(stream) {
    stream.writeInt32(this.id);
    stream.write(`${this.name}\0`);
    stream.writeInt32(this.positions);
    stream.writeInt32Array(this.columnTypes);
    stream.writeUint32(this.units.length);

    for (let unit of this.units) {
      unit.save(stream);
    }
  }

  /**
   * @return {number}
   */
  getByteLength() {
    return 13 + this.name.length + this.columnTypes.byteLength + (this.units.length * (4 + 4 * this.positions));
  }
}
