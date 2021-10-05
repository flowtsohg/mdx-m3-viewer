import MpqCrypto from './crypto';
import MpqHash from './hash';
import { HASH_TABLE_KEY, HASH_TABLE_INDEX, HASH_NAME_A, HASH_NAME_B } from './constants';

/**
 * A MPQ hash table.
 */
export default class MpqHashTable {
  c: MpqCrypto;
  entries: MpqHash[];

  constructor(c: MpqCrypto) {
    this.c = c;
    this.entries = [];

    // Minimum size
    this.addEmpties(4);
  }

  clear(): void {
    this.entries.length = 0;
  }

  addEmpties(howMany: number): void {
    for (let i = 0; i < howMany; i++) {
      this.entries.push(new MpqHash());
    }
  }

  getInsertionIndex(name: string): number {
    const entries = this.entries;
    const offset = this.c.hash(name, HASH_TABLE_INDEX) & (entries.length - 1);

    for (let i = 0, l = entries.length; i < l; i++) {
      const index = (i + offset) % l;
      const hash = entries[index];

      if (hash.platform === 0xFFFF) {
        return index;
      }
    }

    return -1;
  }

  add(name: string, blockIndex: number): MpqHash | undefined {
    const insertionIndex = this.getInsertionIndex(name);

    if (insertionIndex !== -1) {
      const hash = this.entries[insertionIndex];

      hash.nameA = this.c.hash(name, HASH_NAME_A);
      hash.nameB = this.c.hash(name, HASH_NAME_B);
      hash.locale = 0;
      hash.platform = 0;
      hash.blockIndex = blockIndex;

      return hash;
    }

    return;
  }

  load(bytes: Uint8Array): void {
    const entriesCount = bytes.byteLength / 16;
    const uint32array = new Uint32Array(this.c.decryptBlock(bytes, HASH_TABLE_KEY).buffer);
    let offset = 0;

    // Clear the table and add the needed empties.
    this.clear();
    this.addEmpties(entriesCount);

    for (const hash of this.entries) {
      hash.load(uint32array.subarray(offset, offset + 4));

      offset += 4;
    }
  }

  save(bytes: Uint8Array): void {
    const uint32array = new Uint32Array(this.entries.length * 4);
    let offset = 0;

    for (const hash of this.entries) {
      hash.save(uint32array.subarray(offset, offset + 4));

      offset += 4;
    }

    const uint8array = new Uint8Array(uint32array.buffer);

    this.c.encryptBlock(uint8array, HASH_TABLE_KEY);

    bytes.set(uint8array);
  }

  get(name: string): MpqHash | null {
    const c = this.c;
    const entries = this.entries;
    const offset = c.hash(name, HASH_TABLE_INDEX) & (entries.length - 1);
    const nameA = c.hash(name, HASH_NAME_A);
    const nameB = c.hash(name, HASH_NAME_B);

    for (let i = 0, l = entries.length; i < l; i++) {
      const hash = entries[(i + offset) % l];

      if (nameA === hash.nameA && nameB === hash.nameB) {
        return hash;
      } else if (hash.blockIndex === 0xFFFFFFFF) {
        return null;
      }
    }

    return null;
  }
}
