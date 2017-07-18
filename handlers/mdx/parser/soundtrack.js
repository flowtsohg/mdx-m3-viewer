/**
 * @constructor
 * @see This chunk was reverse engineered from the game executable itself, but was never seen in any resource
 * @param {MdxParserBinaryReader} reader
 * @param {number} index
 */
function MdxParserSoundTrack(reader, index) {
    this.index = index;
    /** @member {string} */
    this.path = reader.read(260);
    /** @member {number} */
    this.volume = reader.readFloat32();
    /** @member {number} */
    this.pitch = reader.readFloat32();
    /** @member {number} */
    this.flags = reader.readUint32();
}

export default MdxParserSoundTrack;
