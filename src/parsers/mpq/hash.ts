import { HASH_ENTRY_DELETED, HASH_ENTRY_EMPTY } from './constants';

/**
 * A MPQ hash.
 */
export default class MpqHash {
  nameA: number = 0xFFFFFFFF;
  nameB: number = 0xFFFFFFFF;
  locale: number = 0xFFFF;
  platform: number = 0xFFFF;
  blockIndex: number = HASH_ENTRY_EMPTY;

  load(typedArray: Uint32Array) {
    let localePlatform = typedArray[2];

    this.nameA = typedArray[0];
    this.nameB = typedArray[1];
    this.locale = localePlatform & 0x0000FFFF;
    this.platform = localePlatform >>> 16;
    this.blockIndex = typedArray[3];
  }

  copy(hash: MpqHash) {
    this.nameA = hash.nameA;
    this.nameB = hash.nameB;
    this.locale = hash.locale;
    this.platform = hash.platform;
    this.blockIndex = hash.blockIndex;
  }

  save(typedArray: Uint32Array) {
    typedArray[0] = this.nameA;
    typedArray[1] = this.nameB;
    typedArray[2] = (this.locale << 16) | this.platform;
    typedArray[3] = this.blockIndex;
  }

  delete() {
    this.nameA = 0xFFFFFFFF;
    this.nameB = 0xFFFFFFFF;
    this.locale = 0xFFFF;
    this.platform = 0xFFFF;
    this.blockIndex = HASH_ENTRY_DELETED;
  }
}
