/**
 * A material reference.
 */
export default class M3ParserMaterialReference {
  /**
   * @param {BinaryReader} reader
   * @param {number} version
   * @param {Array<M3ParserIndexEntry>} index
   */
  constructor(reader, version, index) {
    /** @member {number} */
    this.version = version;
    /** @member {number} */
    this.materialType = reader.readUint32();
    /** @member {number} */
    this.materialIndex = reader.readUint32();
  }
}
