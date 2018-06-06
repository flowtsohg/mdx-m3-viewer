import {HASH_ENTRY_DELETED, HASH_ENTRY_EMPTY} from './constants';

/**
 * A MPQ hash.
 */
export default class MpqHash {
  /**
   *
   */
  constructor() {
    /** @param {number} */
    this.nameA = 0xFFFFFFFF;
    /** @param {number} */
    this.nameB = 0xFFFFFFFF;
    /** @param {number} */
    this.locale = 0xFFFF;
    /** @param {number} */
    this.platform = 0xFFFF;
    /** @param {number} */
    this.blockIndex = HASH_ENTRY_EMPTY;
  }

  /**
   * @param {Uint32Array} typedArray
   */
  load(typedArray) {
    let localePlatform = typedArray[2];

    this.nameA = typedArray[0];
    this.nameB = typedArray[1];
    this.locale = localePlatform & 0x0000FFFF;
    this.platform = localePlatform >>> 16;
    this.blockIndex = typedArray[3];
  }

  /**
   * @param {MpqHash} hash
   */
  copy(hash) {
    this.nameA = hash.nameA;
    this.nameB = hash.nameB;
    this.locale = hash.locale;
    this.platform = hash.platform;
    this.blockIndex = hash.blockIndex;
  }

  /**
   * @param {Uint32Array} typedArray
   */
  save(typedArray) {
    typedArray[0] = this.nameA;
    typedArray[1] = this.nameB;
    typedArray[2] = (this.locale << 16) | this.platform;
    typedArray[3] = this.blockIndex;
  }

  /**
   *
   */
  delete() {
    this.nameA = 0xFFFFFFFF;
    this.nameB = 0xFFFFFFFF;
    this.locale = 0xFFFF;
    this.platform = 0xFFFF;
    this.blockIndex = HASH_ENTRY_DELETED;
  }
}
