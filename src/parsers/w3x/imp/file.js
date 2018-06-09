import BinaryStream from '../../../common/binarystream';
import Import from './import';

/**
 * war3map.imp - the import file.
 */
export default class War3MapImp {
  /**
   *
   */
  constructor() {
    /** @member {number} */
    this.version = 1;
    /** @member {Map<string, Import>} */
    this.entries = new Map();
  }

  /**
   * @param {ArrayBuffer} buffer
   */
  load(buffer) {
    let stream = new BinaryStream(buffer);

    this.version = stream.readUint32();

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let entry = new Import();

      entry.load(stream);

      if (entry.isCustom) {
        this.entries.set(entry.name, entry);
      } else {
        this.entries.set(`war3mapimported\\${entry.name}`, entry);
      }
    }
  }

  /**
   * @return {ArrayBuffer}
   */
  save() {
    let buffer = new ArrayBuffer(this.getByteLength());
    let stream = new BinaryStream(buffer);

    stream.writeUint32(this.version);
    stream.writeUint32(this.entries.size);

    for (let entry of this.entries.values()) {
      entry.save(stream);
    }

    return buffer;
  }

  /**
   * @return {number}
   */
  getByteLength() {
    let size = 8;

    for (let entry of this.entries.values()) {
      size += entry.getByteLength();
    }

    return size;
  }

  /**
   * @param {string} name
   * @return {boolean}
   */
  set(name) {
    if (!this.entries.has(name)) {
      let entry = new Import();

      entry.isCustom = 10;
      entry.path = name;

      this.entries.set(name, entry);

      return true;
    }

    return false;
  }

  /**
   * @param {string} name
   * @return {boolean}
   */
  has(name) {
    return this.entries.has(name);
  }

  /**
   * @param {string} name
   * @return {boolean}
   */
  delete(name) {
    return this.entries.delete(name);
  }

  /**
   * @param {string} name
   * @param {string} newName
   * @return {boolean}
   */
  rename(name, newName) {
    let entry = this.entries.get(name);

    if (entry) {
      entry.isCustom = 10;
      entry.path = newName;

      return true;
    }

    return false;
  }
}
