import BinaryStream from '../../../common/binarystream';

/**
 * war3map.wpm - the pathing file.
 */
export default class War3MapWpm {
  version: number;
  size: Int32Array;
  pathing: Uint8Array;

  constructor(buffer?: ArrayBuffer) {
    this.version = 0;
    this.size = new Int32Array(2);
    this.pathing = new Uint8Array(0);

    if (buffer) {
      this.load(buffer);
    }
  }

  load(buffer: ArrayBuffer) {
    let stream = new BinaryStream(buffer);

    if (stream.read(4) !== 'MP3W') {
      return false;
    }

    this.version = stream.readInt32();
    this.size = stream.readInt32Array(2);
    this.pathing = stream.readUint8Array(this.size[0] * this.size[1]);

    return true;
  }

  save() {
    let buffer = new ArrayBuffer(this.getByteLength());
    let stream = new BinaryStream(buffer);

    stream.write('MP3W');
    stream.writeInt32(this.version);
    stream.writeInt32Array(this.size);
    stream.writeUint8Array(this.pathing);

    return buffer;
  }

  getByteLength() {
    return 16 + (this.size[0] * this.size[1]);
  }
}
