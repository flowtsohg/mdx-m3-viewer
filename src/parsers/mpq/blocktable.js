import Block from './block';
import {BLOCK_TABLE_KEY} from './constants';

/**
 * A block table.
 */
export default class BlockTable {
  /**
   * @param {Crypto} c
   */
  constructor(c) {
    /** @param {Crypto} */
    this.c = c;
    /** @param {Array<Block>} */
    this.entries = [];
  }

  /**
   * @param {ArrayBuffer} buffer
   * @return {Block}
   */
  add(buffer) {
    let block = new Block();

    block.normalSize = buffer.byteLength;

    this.entries.push(block);

    return block;
  }

  /**
   *
   */
  clear() {
    this.entries.length = 0;
  }

  /**
   * @param {number} howMany
   */
  addEmpties(howMany) {
    for (let i = 0; i < howMany; i++) {
      this.entries.push(new Block());
    }
  }

  /**
   * @param {Uint8Array} typedArray
   */
  load(typedArray) {
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

  /**
   * @param {Uint8Array} typedArray
   */
  save(typedArray) {
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
