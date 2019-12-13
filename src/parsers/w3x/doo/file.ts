import BinaryStream from '../../../common/binarystream';
import Doodad from './doodad';
import TerrainDoodad from './terraindoodad';

/**
 * war3map.doo - the doodad and destructible file.
 */
export default class War3MapDoo {
  version: number = 0;
  u1: Uint8Array = new Uint8Array(4);
  doodads: Doodad[] = [];
  u2: Uint8Array = new Uint8Array(4);
  terrainDoodads: TerrainDoodad[] = [];

  constructor(buffer?: ArrayBuffer) {
    if (buffer) {
      this.load(buffer);
    }
  }

  load(buffer: ArrayBuffer) {
    let stream = new BinaryStream(buffer);

    if (stream.read(4) !== 'W3do') {
      return false;
    }

    this.version = stream.readInt32();
    stream.readUint8Array(this.u1);

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      let doodad = new Doodad();

      doodad.load(stream, this.version);

      this.doodads.push(doodad);
    }

    stream.readUint8Array(this.u2);

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      let terrainDoodad = new TerrainDoodad();

      terrainDoodad.load(stream, this.version);

      this.terrainDoodads.push(terrainDoodad);
    }

    return true;
  }

  save() {
    let buffer = new ArrayBuffer(this.getByteLength());
    let stream = new BinaryStream(buffer);

    stream.write('W3do');
    stream.writeInt32(this.version);
    stream.writeUint8Array(this.u1);
    stream.writeUint32(this.doodads.length);

    for (let doodad of this.doodads) {
      doodad.save(stream, this.version);
    }

    stream.writeUint8Array(this.u2);
    stream.writeUint32(this.terrainDoodads.length);

    for (let terrainDoodad of this.terrainDoodads) {
      terrainDoodad.save(stream, this.version);
    }

    return buffer;
  }

  getByteLength() {
    let size = 24 + this.terrainDoodads.length * 16;

    for (let doodad of this.doodads) {
      size += doodad.getByteLength(this.version);
    }

    return size;
  }
}
