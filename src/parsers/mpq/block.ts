/**
 * A block.
 */
export default class Block {
  offset = 0;
  compressedSize = 0;
  normalSize = 0;
  flags = 0;

  load(bytes: Uint32Array): void {
    this.offset = bytes[0];
    this.compressedSize = bytes[1];
    this.normalSize = bytes[2];
    this.flags = bytes[3];
  }

  save(bytes: Uint32Array): void {
    bytes[0] = this.offset;
    bytes[1] = this.compressedSize;
    bytes[2] = this.normalSize;
    bytes[3] = this.flags;
  }
}
