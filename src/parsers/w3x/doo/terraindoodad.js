/**
 * A terrain doodad.
 *
 * This type of doodad works much like cliffs.
 * It uses the height of the terrain, and gets affected by the ground heightmap.
 * It cannot be manipulated in any way in the World Editor once placed.
 * Indeed, the only way to change it is to remove it by changing cliffs around it.
 */
export default class TerrainDoodad {
  /**
   *
   */
  constructor() {
    /** @member {string} */
    this.id = '\0\0\0\0';
    /** @member {number} */
    this.u1 = 0;
    /** @member {Uint32Array} */
    this.location = new Uint32Array(2);
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} version
   */
  load(stream, version) {
    this.id = stream.read(4);
    this.u1 = stream.readUint32();
    this.location = stream.readUint32Array(2);
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} version
   */
  save(stream, version) {
    stream.write(this.id);
    stream.writeUint32(this.u1);
    stream.writeUint32Array(this.location);
  }
}
