import BinaryStream from '../../../common/binarystream';
import Doodad from './doodad';
import TerrainDoodad from './terraindoodad';

/**
 * war3map.doo - the doodad and destructible file.
 */
export default class War3MapDoo {
  /**
   * @param {?ArrayBuffer} buffer
   */
  constructor(buffer) {
    /** @member {number} */
    this.version = 0;
    /** @member {Uint8Array} */
    this.u1 = new Uint8Array(4);
    /** @member {Array<Doodad>} */
    this.doodads = [];
    /** @member {Uint8Array} */
    this.u2 = new Uint8Array(4);
    /** @member {Array<TerrainDoodad>} */
    this.terrainDoodads = [];

    if (buffer) {
      this.load(buffer);
    }
  }

  /**
   * @param {ArrayBuffer} buffer
   * @return {boolean}
   */
  load(buffer) {
    let stream = new BinaryStream(buffer);

    if (stream.read(4) !== 'W3do') {
      return false;
    }

    this.version = stream.readInt32();
    this.u1 = stream.readUint8Array(4);

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      let doodad = new Doodad();

      doodad.load(stream, this.version);

      this.doodads.push(doodad);
    }

    this.u2 = stream.readUint8Array(4);

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      let terrainDoodad = new TerrainDoodad();

      terrainDoodad.load(stream, this.version);

      this.terrainDoodads.push(terrainDoodad);
    }

    return true;
  }

  /**
   * @return {ArrayBuffer}
   */
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

  /**
   * @return {number}
   */
  getByteLength() {
    let size = 24 + this.terrainDoodads.length * 16;

    for (let doodad of this.doodads) {
      size += doodad.getByteLength(this.version);
    }

    return size;
  }
}
