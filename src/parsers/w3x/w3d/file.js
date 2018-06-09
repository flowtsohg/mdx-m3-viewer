import BinaryStream from '../../../common/binarystream';
import ModificationTable from '../w3u/modificationtable';

/**
 * war3map.w3d - the doodad modification file.
 *
 * Also used for war3map.w3a (abilities), and war3map.w3q (upgrades).
 */
export default class War3MapW3d {
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
    this.originalTable.load(stream, true);
    this.customTable.load(stream, true);
  }

  /**
   * @return {ArrayBuffer}
   */
  save() {
    let buffer = new ArrayBuffer(this.getByteLength());
    let stream = new BinaryStream(buffer);

    stream.writeInt32(this.version);
    this.originalTable.save(stream, true);
    this.customTable.save(stream, true);

    return buffer;
  }

  /**
   * @return {number}
   */
  getByteLength() {
    return 4 + this.originalTable.getByteLength(true) + this.customTable.getByteLength(true);
  }
}
