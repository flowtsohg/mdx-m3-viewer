import MpqCrypto from './crypto';
import MpqBlock from './block';
import { BLOCK_TABLE_KEY } from './constants';

/**
 * A block table.
 */
export default class BlockTable {
  c: MpqCrypto;
  entries: MpqBlock[];

  constructor(c: MpqCrypto) {
    this.c = c;
    this.entries = [];
  }

  add(buffer: ArrayBuffer) {
    let block = new MpqBlock();

    block.normalSize = buffer.byteLength;

    this.entries.push(block);

    return block;
  }

  clear() {
    this.entries.length = 0;
  }

  addEmpties(howMany: number) {
    for (let i = 0; i < howMany; i++) {
      this.entries.push(new MpqBlock());
    }
  }

  load(typedArray: Uint8Array) {
    let entriesCount = typedArray.byteLength / 16;
    let uint32array = new Uint32Array(this.c.decryptBlock(typedArray, BLOCK_TABLE_KEY).buffer);
    let offset = 0;

    // Clear the table and add the needed empties.
    this.clear();
    this.addEmpties(entriesCount);

    for (let block of this.entries) {
      block.load(uint32array.subarray(offset, offset + 4));

      offset += 4;
    }
  }

  save(typedArray: Uint8Array) {
    let uint32array = new Uint32Array(this.entries.length * 4);
    let offset = 0;

    for (let block of this.entries) {
      block.save(uint32array.subarray(offset, offset + 4));

      offset += 4;
    }

    let uint8array = new Uint8Array(uint32array.buffer);

    this.c.encryptBlock(uint8array, BLOCK_TABLE_KEY);

    typedArray.set(uint8array);
  }
}
