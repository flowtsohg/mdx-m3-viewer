/**
 * @constructor
 * @see This chunk was reverse engineered from the game executable itself, but was never seen in any resource
 * @param {MdxParserBinaryReader} reader
 * @param {number} index
 */
function MdxParserSoundTrack(reader, index) {
    this.index = index;
    this.path = reader.read(260);
    this.volume = reader.readFloat32();
    this.pitch = reader.readFloat32();
    this.flags = reader.readUint32();
}
