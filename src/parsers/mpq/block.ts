/**
 * A block.
 */
export default class Block {
  offset: number;
  compressedSize: number;
  normalSize: number;
  flags: number;

  constructor() {
    this.offset = 0;
    this.compressedSize = 0;
    this.normalSize = 0;
    this.flags = 0;
  }

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
