import { HASH_ENTRY_DELETED, HASH_ENTRY_EMPTY } from './constants';

/**
 * A MPQ hash.
 */
export default class MpqHash {
  nameA = 0xFFFFFFFF;
  nameB = 0xFFFFFFFF;
  locale = 0xFFFF;
  platform = 0xFFFF;
  blockIndex = HASH_ENTRY_EMPTY;

  load(bytes: Uint32Array): void {
    const localePlatform = bytes[2];

    this.nameA = bytes[0];
    this.nameB = bytes[1];
    this.locale = localePlatform & 0x0000FFFF;
    this.platform = localePlatform >>> 16;
    this.blockIndex = bytes[3];
  }

  copy(hash: MpqHash): void {
    this.nameA = hash.nameA;
    this.nameB = hash.nameB;
    this.locale = hash.locale;
    this.platform = hash.platform;
    this.blockIndex = hash.blockIndex;
  }

  save(bytes: Uint32Array): void {
    bytes[0] = this.nameA;
    bytes[1] = this.nameB;
    bytes[2] = (this.locale << 16) | this.platform;
    bytes[3] = this.blockIndex;
  }

  delete(): void {
    this.nameA = 0xFFFFFFFF;
    this.nameB = 0xFFFFFFFF;
    this.locale = 0xFFFF;
    this.platform = 0xFFFF;
    this.blockIndex = HASH_ENTRY_DELETED;
  }
}
