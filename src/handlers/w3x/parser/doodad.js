/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {number} version
 */
function W3xDoodad(reader, version) {
    this.id = reader.read(4);
    this.variation = reader.readInt32();
    this.location = reader.readFloat32Array(3);
    this.angle = reader.readFloat32();
    this.scale = reader.readFloat32Array(3);
    this.flags = reader.readUint8();
    this.life = reader.readUint8();
    this.editorId = reader.readInt32();

    if (version > 7) {
        reader.read(8); // ?
    }

}

export default W3xDoodad;
