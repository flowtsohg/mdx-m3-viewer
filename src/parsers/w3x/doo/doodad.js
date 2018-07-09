import RandomItemSet from './randomitemset';

/**
 * A doodad.
 */
export default class Doodad {
  /**
   *
   */
  constructor() {
    /** @member {string} */
    this.id = '\0\0\0\0';
    /** @member {number} */
    this.variation = 0;
    /** @member {Float32Array} */
    this.location = new Float32Array(3);
    /** @member {number} */
    this.angle = 0;
    /** @member {Float32Array} */
    this.scale = new Float32Array([1, 1, 1]);
    /** @member {number} */
    this.flags = 0;
    /** @member {number} */
    this.life = 0;
    /** @member {number} */
    this.itemTable = -1;
    /** @member {Array<RandomItemSet>} */
    this.itemSets = [];
    /** @member {number} */
    this.editorId = 0;
    /** @member {Uint8Array} */
    this.u1 = new Uint8Array(8);
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} version
   */
  load(stream, version) {
    this.id = stream.read(4);
    this.variation = stream.readInt32();
    this.location = stream.readFloat32Array(3);
    this.angle = stream.readFloat32();
    this.scale = stream.readFloat32Array(3);
    this.flags = stream.readUint8();
    this.life = stream.readUint8();

    if (version > 7) {
      this.itemTable = stream.readUint32();

      for (let i = 0, l = stream.readUint32(); i < l; i++) {
        let itemSet = new RandomItemSet();

        itemSet.load(stream);

        this.itemSets.push(itemSet);
      }
    }

    this.editorId = stream.readInt32();
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} version
   */
  save(stream, version) {
    stream.write(this.id);
    stream.writeInt32(this.variation);
    stream.writeFloat32Array(this.location);
    stream.writeFloat32(this.angle);
    stream.writeFloat32Array(this.scale);
    stream.writeUint8(this.flags);
    stream.writeUint8(this.life);

    if (version > 7) {
      stream.writeUint32(this.itemTable);
      stream.writeUint32(this.itemSets.length);

      for (let itemSet of this.itemSets) {
        itemSet.save(stream);
      }
    }

    stream.writeInt32(this.editorId);
  }

  /**
   * @param {number} version
   * @return {number}
   */
  getByteLength(version) {
    let size = 42;

    if (version > 7) {
      size += 8;

      for (let itemSet of this.itemSets) {
        size += itemSet.getByteLength();
      }
    }

    return size;
  }
}
