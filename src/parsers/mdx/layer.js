import MdxParserSDContainer from './sd';

/**
 * @constructor
 * @param {BinaryReader} reader
 */
function MdxParserLayer(reader) {
    /** @member {number} */
    this.size = reader.readUint32();
    /** @member {number} */
    this.filterMode = reader.readUint32();
    /** @member {number} */
    this.flags = reader.readUint32();
    /** @member {number} */
    this.textureId = reader.readUint32();
    /** @member {number} */
    this.textureAnimationId = reader.readInt32();
    /** @member {number} */
    this.coordId = reader.readUint32();
    /** @member {number} */
    this.alpha = reader.readFloat32();
    /** @member {MdxParserSDContainer} */
    this.tracks = new MdxParserSDContainer(reader, this.size - 28);
}

export default MdxParserLayer;
