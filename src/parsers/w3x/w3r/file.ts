import BinaryStream from '../../../common/binarystream';
import Region from './region';

/**
 * war3map.w3r - the region file.
 */
export default class War3MapW3r {
  version: number = 0;
  regions: Region[] = [];

  constructor(buffer?: ArrayBuffer) {
    if (buffer) {
      this.load(buffer);
    }
  }

  load(buffer: ArrayBuffer) {
    let stream = new BinaryStream(buffer);

    this.version = stream.readInt32();

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let region = new Region();

      region.load(stream);

      this.regions[i] = region;
    }
  }

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

  getByteLength() {
    let size = 8;

    for (let region of this.regions) {
      size += region.getByteLength();
    }

    return size;
  }
}
