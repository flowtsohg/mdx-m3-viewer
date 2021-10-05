import BinaryStream from '../../../common/binarystream';
import Doodad from './doodad';
import TerrainDoodad from './terraindoodad';

/**
 * war3map.doo - the doodad and destructible file.
 */
export default class War3MapDoo {
  version = 0;
  u1 = new Uint8Array(4);
  doodads: Doodad[] = [];
  u2 = new Uint8Array(4);
  terrainDoodads: TerrainDoodad[] = [];

  load(buffer: ArrayBuffer | Uint8Array, buildVersion: number): void {
    const stream = new BinaryStream(buffer);

    if (stream.readBinary(4) !== 'W3do') {
      throw new Error('Not a valid war3map.doo buffer');
    }

    this.version = stream.readInt32();
    stream.readUint8Array(this.u1);

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      const doodad = new Doodad();

      doodad.load(stream, this.version, buildVersion);

      this.doodads.push(doodad);
    }

    stream.readUint8Array(this.u2);

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      const terrainDoodad = new TerrainDoodad();

      terrainDoodad.load(stream, this.version);

      this.terrainDoodads.push(terrainDoodad);
    }
  }

  save(buildVersion: number): Uint8Array {
    const stream = new BinaryStream(new ArrayBuffer(this.getByteLength(buildVersion)));

    stream.writeBinary('W3do');
    stream.writeInt32(this.version);
    stream.writeUint8Array(this.u1);
    stream.writeUint32(this.doodads.length);

    for (const doodad of this.doodads) {
      doodad.save(stream, this.version, buildVersion);
    }

    stream.writeUint8Array(this.u2);
    stream.writeUint32(this.terrainDoodads.length);

    for (const terrainDoodad of this.terrainDoodads) {
      terrainDoodad.save(stream, this.version);
    }

    return stream.uint8array;
  }

  getByteLength(buildVersion: number): number {
    let size = 24 + this.terrainDoodads.length * 16;

    for (const doodad of this.doodads) {
      size += doodad.getByteLength(this.version, buildVersion);
    }

    return size;
  }
}
