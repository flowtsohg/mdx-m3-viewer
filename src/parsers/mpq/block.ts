/**
 * A block.
 */
export default class Block {
  offset: number = 0;
  compressedSize: number = 0;
  normalSize: number = 0;
  flags: number = 0;

  load(bytes: Uint32Array) {
    this.offset = bytes[0];
    this.compressedSize = bytes[1];
    this.normalSize = bytes[2];
    this.flags = bytes[3];
  }

  save(bytes: Uint32Array) {
    bytes[0] = this.offset;
    bytes[1] = this.compressedSize;
    bytes[2] = this.normalSize;
    bytes[3] = this.flags;
  }
}
