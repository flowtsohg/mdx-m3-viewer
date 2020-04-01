import MpqBlock from './block';
import { HASH_FILE_KEY, FILE_OFFSET_ADJUSTED_KEY } from './constants';

// Global variables for this module.
const bytes = new Uint8Array(4);
const long = new Uint32Array(bytes.buffer);

/**
 * MPQ crypto.
 */
export default class MpqCrypto {
  cryptTable: Uint32Array = new Uint32Array(0x500)

  constructor() {
    let seed = 0x00100001;
    let temp1 = 0;
    let temp2 = 0;

    for (let index1 = 0; index1 < 0x100; index1++) {
      for (let index2 = index1, i = 0; i < 5; i += 1, index2 += 0x100) {
        seed = (seed * 125 + 3) % 0x2AAAAB;
        temp1 = (seed & 0xFFFF) << 0x10;

        seed = (seed * 125 + 3) % 0x2AAAAB;
        temp2 = (seed & 0xFFFF);

        this.cryptTable[index2] = temp1 | temp2;
      }
    }
  }

  hash(name: string, key: number) {
    let cryptTable = this.cryptTable;
    let seed1 = 0x7FED7FED;
    let seed2 = 0xEEEEEEEE;

    name = name.toUpperCase();

    for (let i = 0; i < name.length; i++) {
      let ch = name.charCodeAt(i);

      seed1 = cryptTable[(key << 8) + ch] ^ (seed1 + seed2);
      seed2 = ch + seed1 + seed2 + (seed2 << 5) + 3;
    }

    // Convert the seed to an unsigned integer
    return seed1 >>> 0;
  }

  decryptBlock(data: TypedArray, key: number) {
    let cryptTable = this.cryptTable;
    let seed = 0xEEEEEEEE;
    let view;

    if (data instanceof ArrayBuffer) {
      view = new Uint8Array(data);
    } else {
      view = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    }

    for (let i = 0, l = data.byteLength >>> 2; i < l; i++) {
      // Update the seed.
      seed += cryptTable[0x400 + (key & 0xFF)];

      // Get 4 encrypted bytes.
      bytes[0] = view[i * 4];
      bytes[1] = view[i * 4 + 1];
      bytes[2] = view[i * 4 + 2];
      bytes[3] = view[i * 4 + 3];

      // Decrypted 32bit integer.
      long[0] ^= (key + seed);

      // Update the seed.
      key = ((~key << 0x15) + 0x11111111) | (key >>> 0x0B);
      seed = long[0] + seed + (seed << 5) + 3;

      // Set 4 decryped bytes.
      view[i * 4] = bytes[0];
      view[i * 4 + 1] = bytes[1];
      view[i * 4 + 2] = bytes[2];
      view[i * 4 + 3] = bytes[3];
    }

    return data;
  }

  encryptBlock(data: ArrayBuffer | TypedArray, key: number) {
    let cryptTable = this.cryptTable;
    let seed = 0xEEEEEEEE;
    let view;

    if (data instanceof ArrayBuffer) {
      view = new Uint8Array(data);
    } else {
      view = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    }

    for (let i = 0, l = data.byteLength >>> 2; i < l; i++) {
      // Update the seed.
      seed += cryptTable[0x400 + (key & 0xFF)];

      // Get 4 decrypted bytes.
      bytes[0] = view[i * 4];
      bytes[1] = view[i * 4 + 1];
      bytes[2] = view[i * 4 + 2];
      bytes[3] = view[i * 4 + 3];

      // Decrypted 32bit integer.
      let decrypted = long[0];

      // Encrypted 32bit integer.
      long[0] ^= (key + seed);

      // Update the seed.
      key = ((~key << 0x15) + 0x11111111) | (key >>> 0x0B);
      seed = decrypted + seed + (seed << 5) + 3;

      // Set 4 encrypted bytes.
      view[i * 4] = bytes[0];
      view[i * 4 + 1] = bytes[1];
      view[i * 4 + 2] = bytes[2];
      view[i * 4 + 3] = bytes[3];
    }

    return data;
  }

  computeFileKey(name: string, block: MpqBlock) {
    let sepIndex = name.lastIndexOf('\\');
    let pathlessName = name.substring(sepIndex + 1);
    let encryptionKey = this.hash(pathlessName, HASH_FILE_KEY);

    if (block.flags & FILE_OFFSET_ADJUSTED_KEY) {
      encryptionKey = (encryptionKey + block.offset) ^ block.normalSize;
    }

    return encryptionKey;
  }
}
