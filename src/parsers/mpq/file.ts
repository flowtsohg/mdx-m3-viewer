import { deflate, inflate } from 'pako';
import { decodeUtf8 } from '../../common/utf8';
import MpqArchive from './archive';
import MpqBlock from './block';
import { COMPRESSION_ADPCM_MONO, COMPRESSION_ADPCM_STEREO, COMPRESSION_BZIP2, COMPRESSION_DEFLATE, COMPRESSION_HUFFMAN, COMPRESSION_IMPLODE, FILE_COMPRESSED, FILE_ENCRYPTED, FILE_EXISTS, FILE_OFFSET_ADJUSTED_KEY, FILE_SINGLE_UNIT, HASH_ENTRY_DELETED } from './constants';
import MpqCrypto from './crypto';
import explode from './explode';
import MpqHash from './hash';
import { isArchive } from './isarchive';

/**
 * A MPQ file.
 */
export default class MpqFile {
  archive: MpqArchive;
  c: MpqCrypto;
  name: string;
  nameResolved: boolean;
  hash: MpqHash;
  block: MpqBlock;
  rawBuffer: Uint8Array | null = null;
  buffer: Uint8Array | null = null;

  constructor(archive: MpqArchive, hash: MpqHash, block: MpqBlock, rawBuffer: Uint8Array | null, buffer: Uint8Array | null) {
    let headerOffset = archive.headerOffset;

    this.archive = archive;
    this.c = archive.c;
    this.name = `File${`${hash.blockIndex}`.padStart(8, '0')}`;
    this.nameResolved = false;
    this.hash = hash;
    this.block = block;

    if (rawBuffer) {
      this.rawBuffer = rawBuffer.slice(headerOffset + block.offset, headerOffset + block.offset + block.compressedSize);
    }

    if (buffer) {
      this.buffer = buffer;
    }
  }

  /**
   * Gets this file's data as a Uint8Array.
   * 
   * An exception will be thrown if the file needs to be decoded, and decoding fails.
   */
  bytes() {
    // Decode if needed
    if (this.buffer === null) {
      this.decode();
    }

    // If decoding failed, an exception would have been thrown, so buffer is known to exist at this point.
    return <Uint8Array>this.buffer;
  }

  /**
   * Gets this file's data as an ArrayBuffer.
   * 
   * An exception will be thrown if the file needs to be decoded, and decoding fails.
   */
  arrayBuffer() {
    return this.bytes().buffer;
  }

  /**
   * Gets this file's data as a UTF8 string.
   * 
   * An exception will be thrown if the file needs to be decoded, and decoding fails.
   */
  text() {
    return decodeUtf8(this.bytes());
  }

  /**
   * Changes the buffer of this file.
   * 
   * Does nothing if the archive is in readonly mode.
   */
  set(buffer: Uint8Array) {
    if (this.archive.readonly) {
      return false;
    }

    let hash = this.hash;
    let block = this.block;

    // Reset the hash.
    hash.locale = 0;
    hash.platform = 0;

    // Reset the block.
    block.compressedSize = 0;
    block.normalSize = buffer.byteLength;
    block.flags = 0;

    this.buffer = buffer;
    this.rawBuffer = null;

    return true;
  }

  /**
   * Deletes this file.
   * 
   * Using the file after it was deleted will result in undefined behavior.
   * 
   * Does nothing if the archive is in readonly mode.
   */
  delete() {
    if (this.archive.readonly) {
      return false;
    }

    let archive = this.archive;
    let hash = this.hash;
    let blockIndex = hash.blockIndex;

    hash.delete();

    for (let hash of archive.hashTable.entries) {
      if (hash.blockIndex < HASH_ENTRY_DELETED && hash.blockIndex > blockIndex) {
        hash.blockIndex -= 1;
      }
    }

    archive.blockTable.entries.splice(blockIndex, 1);
    archive.files.splice(blockIndex, 1);

    return true;
  }

  /**
   * Renames this file.
   * 
   * Note that this sets the current file's hash's status to being deleted, rather than removing it.
   * This is due to the way the search algorithm works.
   * 
   * Does nothing if the archive is in readonly mode.
   */
  rename(newName: string) {
    if (this.archive.readonly) {
      return false;
    }

    let hash = this.hash;
    let locale = hash.locale;
    let platform = hash.platform;
    let blockIndex = hash.blockIndex;

    // First delete the current hash.
    // This will allow its entry to be reused in case it's the only empty/deleted entry in the hashtable.
    hash.delete();

    let newHash = <MpqHash>this.archive.hashTable.add(newName, blockIndex);

    newHash.locale = locale;
    newHash.platform = platform;

    this.name = newName;
    this.nameResolved = true;
    this.hash = newHash;

    return true;
  }

  /**
   * Decode this file.
   */
  decode() {
    if (!this.rawBuffer) {
      throw new Error(`File ${this.name}: Nothing to decode`);
    }

    let archive = this.archive;
    let block = this.block;
    let c = archive.c;
    let encryptionKey = c.computeFileKey(this.name, block);
    let data = this.rawBuffer;
    let flags = block.flags;

    // One buffer of raw data.
    // I don't know why having no flags means it's a chunk of memory rather than sectors.
    // After all, there is no flag to say there are indeed sectors.
    if (flags === FILE_EXISTS) {
      this.buffer = data.slice(0, block.normalSize);
    } else if (flags & FILE_SINGLE_UNIT) {
      // One buffer of possibly encrypted and/or compressed data.
      // Read the sector
      let sector;

      // If this block is encrypted, decrypt the sector.
      if (flags & FILE_ENCRYPTED) {
        sector = <Uint8Array>c.decryptBlock(data.slice(0, block.compressedSize), encryptionKey);
      } else {
        sector = data.subarray(0, block.compressedSize);
      }

      // If this block is compressed, decompress the sector.
      // Otherwise, copy the sector as-is.
      if (flags & FILE_COMPRESSED) {
        sector = this.decompressSector(sector, block.normalSize);
      } else {
        sector = sector.slice();
      }

      this.buffer = sector;
    } else {
      // One or more sectors of possibly encrypted and/or compressed data.
      let sectorCount = Math.ceil(block.normalSize / archive.sectorSize);

      // Alocate a buffer for the uncompressed block size
      let buffer = new Uint8Array(block.normalSize);

      // Get the sector offsets
      let sectorOffsets = new Uint32Array(data.buffer, 0, sectorCount + 1);

      // If this file is encrypted, copy the sector offsets and decrypt them.
      if (flags & FILE_ENCRYPTED) {
        sectorOffsets = <Uint32Array>c.decryptBlock(sectorOffsets.slice(), encryptionKey - 1);
      }

      let start = sectorOffsets[0];
      let end = sectorOffsets[1];
      let offset = 0;

      for (let i = 0; i < sectorCount; i++) {
        let sector;

        // If this file is encrypted, copy the sector and decrypt it.
        // Otherwise a view can be used directly.
        if (flags & FILE_ENCRYPTED) {
          sector = <Uint8Array>c.decryptBlock(data.slice(start, end), encryptionKey + i);
        } else {
          sector = data.subarray(start, end);
        }

        // Decompress the sector
        if (flags & FILE_COMPRESSED) {
          let uncompressedSize = archive.sectorSize;

          // If this is the last sector, its uncompressed size might not be the size of a sector.
          if (block.normalSize - offset < uncompressedSize) {
            uncompressedSize = block.normalSize - offset;
          }

          sector = this.decompressSector(sector, uncompressedSize);
        }

        // Add the sector bytes to the buffer
        buffer.set(sector, offset);
        offset += sector.byteLength;

        // Prepare for the next sector
        if (i < sectorCount) {
          start = end;
          end = sectorOffsets[i + 2];
        }
      }

      this.buffer = buffer;
    }

    // If the archive is in read-only mode, the raw buffer isn't needed anymore, so free the memory.
    if (archive.readonly) {
      this.rawBuffer = null;
    }
  }

  decompressSector(bytes: Uint8Array, decompressedSize: number) {
    // If the size of the data is the same as its decompressed size, it's not compressed.
    if (bytes.byteLength === decompressedSize) {
      return bytes;
    } else {
      let compressionMask = bytes[0];

      if (compressionMask & COMPRESSION_BZIP2) {
        throw new Error(`File ${this.name}: compression type 'bzip2' not supported`);
      }

      if (compressionMask & COMPRESSION_IMPLODE) {
        try {
          //console.log(this.name, 'EXPLODE')
          bytes = explode(bytes.subarray(1));
        } catch (e) {
          throw new Error(`File ${this.name}: failed to decompress with 'explode': ${e}`);
        }
      }

      if (compressionMask & COMPRESSION_DEFLATE) {
        try {
          bytes = inflate(bytes.subarray(1));
        } catch (e) {
          throw new Error(`File ${this.name}: failed to decompress with 'zlib': ${e}`);
        }
      }

      if (compressionMask & COMPRESSION_HUFFMAN) {
        throw new Error(`File ${this.name}: compression type 'huffman' not supported`);
      }

      if (compressionMask & COMPRESSION_ADPCM_STEREO) {
        throw new Error(`File ${this.name}: compression type 'adpcm stereo' not supported`);
      }

      if (compressionMask & COMPRESSION_ADPCM_MONO) {
        throw new Error(`File ${this.name}: compression type 'adpcm mono' not supported`);
      }

      return bytes;
    }
  }

  /**
   * Encode this file.
   * Archives (maps or generic MPQs) are stored uncompressed in one chunk.
   * Other files are always stored in sectors, except when a file is smaller than a sector.
   * Sectors themselves are always compressed, except when the result is smaller than the uncompressed data.
   */
  encode() {
    if (this.buffer !== null && this.rawBuffer === null) {
      let data = this.buffer;

      if (isArchive(data)) {
        this.rawBuffer = this.buffer;
        this.block.compressedSize = this.buffer.byteLength;
        this.block.flags = FILE_EXISTS;
      } else {
        let sectorSize = this.archive.sectorSize;
        let sectorCount = Math.ceil(data.byteLength / sectorSize);
        let offsets = new Uint32Array(sectorCount + 1);
        let offset = offsets.byteLength;
        let sectors = [];
        let compression = [];

        // First offset is right after the offsets list.
        offsets[0] = offset;

        for (let i = 0; i < sectorCount; i++) {
          let sectorOffset = i * sectorSize;
          let sector = data.subarray(sectorOffset, sectorOffset + sectorSize);
          let size = sector.byteLength;
          let compressed = deflate(sector);
          let isCompressed = false;

          // If the compressed size of the sector is smaller than the uncompressed, use the compressed data.
          // +1 because of the compression mask byte.
          if (compressed.byteLength + 1 < size) {
            sector = compressed;
            size = compressed.byteLength + 1;
            isCompressed = true;
          }

          offset += size;
          offsets[i + 1] = offset;
          sectors[i] = sector;
          compression[i] = isCompressed;
        }

        // Only use the compressed data if it's actually smaller than the uncompressed data.
        if (offset < data.byteLength) {
          let rawBuffer = new Uint8Array(offset);

          // Write the offsets list.
          rawBuffer.set(new Uint8Array(offsets.buffer));

          offset = offsets.byteLength;

          for (let i = 0; i < sectorCount; i++) {
            // If this sector is compressed, set it to zlib.
            if (compression[i]) {
              rawBuffer[offset] = 2;
              offset += 1;
            }

            // Write the sector.
            let sector = sectors[i];

            rawBuffer.set(sector, offset);
            offset += sector.byteLength;
          }

          this.rawBuffer = rawBuffer;
          this.block.compressedSize = rawBuffer.byteLength;
          this.block.flags = (FILE_EXISTS | FILE_COMPRESSED) >>> 0;
        } else {
          this.rawBuffer = this.buffer;
          this.block.compressedSize = this.buffer.byteLength;
          this.block.flags = FILE_EXISTS;
        }
      }
    }
  }

  /**
   * Decrypt this file and encrypt it back, with a new offset in the archive.
   * This is used for files that use FILE_OFFSET_ADJUSTED_KEY, which are encrypted with a key that depends on their offset.
   */
  reEncrypt(offset: number) {
    if (!this.rawBuffer) {
      return false;
    }

    let archive = this.archive;
    let block = this.block;
    let c = archive.c;
    let bytes = this.rawBuffer;
    let flags = block.flags;
    let encryptionKey = c.computeFileKey(this.name, block);

    block.offset = offset;

    let newEncryptionKey = c.computeFileKey(this.name, block);

    if (flags & FILE_SINGLE_UNIT) {
      // Decrypt the chunk with the old key.
      c.decryptBlock(bytes, encryptionKey);

      // Encrypt the chunk with the new key.
      c.encryptBlock(bytes, newEncryptionKey);
    } else {
      let sectorCount = Math.ceil(block.normalSize / archive.sectorSize);

      // Get the sector offsets
      let sectorOffsets = new Uint32Array(bytes.buffer, 0, sectorCount + 1);

      // Decrypt the sector offsets with the old key.
      c.decryptBlock(sectorOffsets, encryptionKey - 1);

      let start = sectorOffsets[0];
      let end = sectorOffsets[1];

      for (let i = 0; i < sectorCount; i++) {
        let sector = bytes.subarray(start, end);

        // Decrypt the chunk with the old key.
        c.decryptBlock(sector, encryptionKey + i);

        // Encrypt the chunk with the new key.
        c.encryptBlock(sector, newEncryptionKey + i);

        // Prepare for the next sector
        if (i < sectorCount) {
          start = end;
          end = sectorOffsets[i + 2];
        }
      }

      // Encrypt the sector offsets with the new key.
      c.encryptBlock(sectorOffsets, newEncryptionKey - 1);
    }

    return true;
  }

  /**
   * The offset of the file has been recalculated.
   * If the offset is different, and this file uses FILE_OFFSET_ADJUSTED_KEY encryption, it must be re-encrypted with the new offset.
   */
  offsetChanged(offset: number) {
    let block = this.block;

    if (block.offset !== offset && block.flags & FILE_OFFSET_ADJUSTED_KEY) {
      if (this.nameResolved) {
        return this.reEncrypt(offset);
      }

      return false;
    }

    block.offset = offset;

    return true;
  }
}
