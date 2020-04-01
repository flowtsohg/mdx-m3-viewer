import BinaryStream from '../../../common/binarystream';

/**
 * A terrain doodad.
 *
 * This type of doodad works much like cliffs.
 * It uses the height of the terrain, and gets affected by the ground heightmap.
 * It cannot be manipulated in any way in the World Editor once placed.
 * Indeed, the only way to change it is to remove it by changing cliffs around it.
 */
export default class TerrainDoodad {
  id: string = '\0\0\0\0';
  u1: number = 0;
  location: Uint32Array = new Uint32Array(2);

  load(stream: BinaryStream, version: number) {
    this.id = stream.read(4);
    this.u1 = stream.readUint32();
    stream.readUint32Array(this.location);
  }

  save(stream: BinaryStream, version: number) {
    stream.write(this.id);
    stream.writeUint32(this.u1);
    stream.writeUint32Array(this.location);
  }
}
