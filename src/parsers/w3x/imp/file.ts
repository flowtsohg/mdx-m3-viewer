import BinaryStream from '../../../common/binarystream';
import Import from './import';

/**
 * war3map.imp - the import file.
 */
export default class War3MapImp {
  version: number = 1;
  entries: Map<string, Import> = new Map();

  constructor(buffer?: ArrayBuffer) {
    if (buffer) {
      this.load(buffer);
    }
  }

  load(buffer: ArrayBuffer) {
    let stream = new BinaryStream(buffer);

    this.version = stream.readUint32();

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let entry = new Import();

      entry.load(stream);

      if (entry.isCustom) {
        this.entries.set(entry.path, entry);
      } else {
        this.entries.set(`war3mapimported\\${entry.path}`, entry);
      }
    }
  }

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

  getByteLength() {
    let size = 8;

    for (let entry of this.entries.values()) {
      size += entry.getByteLength();
    }

    return size;
  }

  set(path: string) {
    if (!this.entries.has(path)) {
      let entry = new Import();

      entry.isCustom = 10;
      entry.path = path;

      this.entries.set(path, entry);

      return true;
    }

    return false;
  }

  has(path: string) {
    return this.entries.has(path);
  }

  delete(path: string) {
    return this.entries.delete(path);
  }

  rename(path: string, newPath: string) {
    let entry = this.entries.get(path);

    if (entry) {
      entry.isCustom = 10;
      entry.path = newPath;

      return true;
    }

    return false;
  }
}
