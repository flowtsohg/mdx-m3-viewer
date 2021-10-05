import BinaryStream from '../../../common/binarystream';

/**
 * war3map.wpm - the pathing file.
 */
export default class War3MapWpm {
  version = 0;
  size = new Int32Array(2);
  pathing = new Uint8Array(0);

  load(buffer: ArrayBuffer | Uint8Array): void {
    const stream = new BinaryStream(buffer);

    if (stream.readBinary(4) !== 'MP3W') {
      return;
    }

    this.version = stream.readInt32();
    stream.readInt32Array(this.size);
    this.pathing = stream.readUint8Array(this.size[0] * this.size[1]);
  }

  save(): Uint8Array {
    const stream = new BinaryStream(new ArrayBuffer(this.getByteLength()));

    stream.writeBinary('MP3W');
    stream.writeInt32(this.version);
    stream.writeInt32Array(this.size);
    stream.writeUint8Array(this.pathing);

    return stream.uint8array;
  }

  getByteLength(): number {
    return 16 + (this.size[0] * this.size[1]);
  }
}
