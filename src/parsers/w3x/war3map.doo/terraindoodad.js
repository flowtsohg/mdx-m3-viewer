/**
 * This type of doodad works much like cliffs.
 * It uses the height of the terrain, and gets affected by the ground heightmap.
 * It cannot be manipulated in any way in the World Editor once placed.
 * Indeed, the only way to change it is to remove it by changing cliffs around it.
 * 
 * @constructor
 * @param {BinaryStream} stream 
 * @param {number} version 
 */
function TerrainDoodad(stream, version) {
    this.id = '\0\0\0\0';
    this.u1 = 0; // Unknown
    this.location = new Uint32Array(2);

    if (stream) {
        this.load(stream, version);
    }
}

TerrainDoodad.prototype = {
    load(stream, version) {
        this.id = reader.read(4);
        this.u1 = stream.readUint32();
        this.location = reader.readUint32Array(2);
    },

    save(stream, version) {
        stream.write(this.id);
        stream.writeUint32(this.u1);
        stream.writeUint32Array(this.location);
    }
};

export default TerrainDoodad;
