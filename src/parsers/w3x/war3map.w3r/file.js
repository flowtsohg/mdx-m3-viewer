import BinaryStream from '../../../common/binarystream';
import Region from './region';

/**
 * war3map.w3r - the region file.
 */
export default class War3MapW3r {
  /**
   * @param {?ArrayBuffer} buffer
   */
  constructor(buffer) {
    /** @member {number} */
    this.version = 0;
    /** @member {Array<Region>} */
    this.regions = [];

    if (buffer) {
      this.load(buffer);
    }
  }

  /**
   * @param {ArrayBuffer} buffer
   */
  load(buffer) {
    let stream = new BinaryStream(buffer);

    this.version = stream.readInt32();

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      this.regions[i] = new Region(stream);
    }
  }

  /**
   * @return {ArrayBuffer}
   */
  save() {
    let buffer = new ArrayBuffer(this.getByteLength());
    let stream = new BinaryStream(buffer);

    stream.writeInt32(this.version);
    stream.writeUint32(this.regions.length);

    for (let region of this.regions) {
      region.save(stream);
    }

    return buffer;
  }

  /**
    * @return {number}
    */
  getByteLength() {
    let size = 8;

    for (let regions of this.regions) {
      size += regions.calcSize();
    }

    return size;
  }
}
