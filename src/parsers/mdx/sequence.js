import MdxParserExtent from './extent';

/**
 * @constructor
 * @param {BinaryReader} reader
 */
function MdxParserSequence(reader) {
    /** @member {string} */
    this.name = reader.read(80);
    /** @member {Uint32Array} */
    this.interval = reader.readUint32Array(2);
    /** @member {number} */
    this.moveSpeed = reader.readFloat32();
    /** @member {number} */
    this.flags = reader.readUint32();
    /** @member {number} */
    this.rarity = reader.readFloat32();
    /** @member {number} */
    this.syncPoint = reader.readUint32();
    /** @member {MdxParserExtent} */
    this.extent = new MdxParserExtent(reader);
}

export default MdxParserSequence;
