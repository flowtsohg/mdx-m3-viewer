import M3ParserReference from './reference';

/**
 * An attachment point.
 */
export default class M3ParserAttachmentPoint {
  /**
   * @constructor
   * @param {BinaryReader} reader
   * @param {number} version
   * @param {Array<M3ParserIndexEntry>} index
   */
  constructor(reader, version, index) {
    /** @member {number} */
    this.version = version;
    /** @member {number} */
    this.unknown = reader.readInt32();
    /** @member {M3ParserReference} */
    this.name = new M3ParserReference(reader, index);
    /** @member {number} */
    this.bone = reader.readUint32();
  }
}
