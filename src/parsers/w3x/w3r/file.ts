import BinaryStream from '../../../common/binarystream';
import Region from './region';

/**
 * war3map.w3r - the region file.
 */
export default class War3MapW3r {
  version = 0;
  regions: Region[] = [];

  load(buffer: ArrayBuffer | Uint8Array): void {
    const stream = new BinaryStream(buffer);

    this.version = stream.readInt32();

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      const region = new Region();

      region.load(stream);

      this.regions[i] = region;
    }
  }

  save(): Uint8Array {
    const stream = new BinaryStream(new ArrayBuffer(this.getByteLength()));

    stream.writeInt32(this.version);
    stream.writeUint32(this.regions.length);

    for (const region of this.regions) {
      region.save(stream);
    }

    return stream.uint8array;
  }

  getByteLength(): number {
    let size = 8;

    for (const region of this.regions) {
      size += region.getByteLength();
    }

    return size;
  }
}
