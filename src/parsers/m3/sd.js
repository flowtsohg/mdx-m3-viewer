import M3ParserReference from './reference';

/**
 * Sequence data.
 */
export default class M3ParserSd {
  /**
   * @param {BinaryReader} reader
   * @param {number} version
   * @param {Array<M3ParserIndexEntry>} index
   */
  constructor(reader, version, index) {
    /** @member {number} */
    this.version = version;
    /** @member {M3ParserReference} */
    this.keys = new M3ParserReference(reader, index);
    /** @member {number} */
    this.flags = reader.readUint32();
    /** @member {number} */
    this.biggestKey = reader.readUint32();
    /** @member {M3ParserReference} */
    this.values = new M3ParserReference(reader, index);
  }
}
