import M3ParserReference from './reference';

/**
 * An animation validator.
 */
export default class M3ParserSts {
  /**
   * @param {BinaryReader} reader
   * @param {number} version
   * @param {Array<M3ParserIndexEntry>} index
   */
  constructor(reader, version, index) {
    /** @member {number} */
    this.version = version;
    /** @member {M3ParserReference} */
    this.animIds = new M3ParserReference(reader, index);

    reader.skip(16); // ?
  }
}
