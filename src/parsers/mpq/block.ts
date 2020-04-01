/**
 * A block.
 */
export default class Block {
  offset: number = 0;
  compressedSize: number = 0;
  normalSize: number = 0;
  flags: number = 0;

  load(typedArray: Uint32Array) {
    this.offset = typedArray[0];
    this.compressedSize = typedArray[1];
    this.normalSize = typedArray[2];
    this.flags = typedArray[3];
  }

  save(typedArray: Uint32Array) {
    typedArray[0] = this.offset;
    typedArray[1] = this.compressedSize;
    typedArray[2] = this.normalSize;
    typedArray[3] = this.flags;
  }
}
