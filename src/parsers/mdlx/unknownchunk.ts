import BinaryStream from '../../common/binarystream';

/**
 * An unknown chunk.
 */
export default class UnknownChunk {
  tag: string;
  chunk: Uint8Array;

  constructor(stream: BinaryStream, size: number, tag: string) {
    this.tag = tag;
    this.chunk = stream.readUint8Array(new Uint8Array(size));
  }

  writeMdx(stream: BinaryStream) {
    stream.write(this.tag);
    stream.writeUint32(this.chunk.byteLength);
    stream.writeUint8Array(this.chunk);
  }

  getByteLength() {
    return 8 + this.chunk.byteLength;
  }
}
