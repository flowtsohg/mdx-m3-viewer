import BinaryStream from '../../../common/binarystream';

/**
 * war3map.shd - the shadow file.
 */
export default class War3MapShd {
  /**
   * @param {?ArrayBuffer} buffer
   * @param {?Int32Array} mapSize
   */
  constructor(buffer, mapSize) {
    /** @member {Array<Uint8Array>} */
    this.shadows = [];

    if (buffer) {
      this.load(buffer, mapSize);
    }
  }

  /**
   * @param {ArrayBuffer} buffer
   * @param {Int32Array} mapSize
   */
  load(buffer, mapSize) {
    let stream = new BinaryStream(buffer);
    let columns = mapSize[0] * 4;
    let rows = mapSize[1] * 4;

    for (let i = 0; i < rows; i++) {
      this.shadows[row] = stream.readUint8Array(columns);
    }
  }

  /**
   * @return {ArrayBuffer}
   */
  save() {
    let buffer = new ArrayBuffer(this.getByteLength());
    let stream = new BinaryStream(buffer);

    for (let row of this.shadows) {
      stream.writeUint8Array(row);
    }

    return buffer;
  }

  /**
   * @return {number}
   */
  getByteLength() {
    return this.shadows.length * this.shadows[0].byteLength;
  }
}
