import BinaryStream from '../../../common/binarystream';
import ModificationTable from './modificationtable';

/**
 * war3map.w3u - the unit modification file.
 *
 * Also used for war3map.w3t (items), war3map.w3b (destructibles), and war3map.w3h (buffs).
 */
export default class War3MapW3u {
  /**
   * @param {?ArrayBuffer} buffer
   */
  constructor(buffer) {
    /** @member {number} */
    this.version = 0;
    /** @member {ModificationTable} */
    this.originalTable = new ModificationTable();
    /** @member {ModificationTable} */
    this.customTable = new ModificationTable();

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
    this.originalTable.load(stream, false);
    this.customTable.load(stream, false);
  }

  /**
   * @return {ArrayBuffer}
   */
  save() {
    let buffer = new ArrayBuffer(this.getByteLength());
    let stream = new BinaryStream(buffer);

    stream.writeInt32(this.version);
    this.originalTable.save(stream, false);
    this.customTable.save(stream, false);

    return buffer;
  }

  /**
   * @return {number}
   */
  getByteLength() {
    return 4 + this.originalTable.getByteLength(false) + this.customTable.getByteLength(false);
  }
}
