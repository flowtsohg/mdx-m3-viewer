import BinaryStream from '../../common/binarystream';
import { powerOfTwo } from '../../common/math';
import { numberToUint32 } from '../../common/typecast';
import MpqBlockTable from './blocktable';
import { HASH_ENTRY_DELETED, HASH_ENTRY_EMPTY, MAGIC } from './constants';
import MpqCrypto from './crypto';
import MpqFile from './file';
import MpqHashTable from './hashtable';
import { searchHeader } from './isarchive';


/**
 * MoPaQ archive (MPQ) version 0.
 */
export default class MpqArchive {
  headerOffset: number;
  sectorSize: number;
  c: MpqCrypto;
  hashTable: MpqHashTable;
  blockTable: MpqBlockTable;
  files: MpqFile[];
  readonly: boolean;

  constructor(buffer?: ArrayBuffer, readonly?: boolean) {
    this.headerOffset = 0;
    this.sectorSize = 4096;
    this.c = new MpqCrypto();
    this.hashTable = new MpqHashTable(this.c);
    this.blockTable = new MpqBlockTable(this.c);
    this.files = [];
    this.readonly = !!readonly;

    if (buffer) {
      this.load(buffer);
    }
  }

  /**
   * Load an existing archive.
   * 
   * Note that this clears the archive from whatever it had in it before.
   */
  load(buffer: ArrayBuffer) {
    // let fileSize = buffer.byteLength;
    let typedArray = new Uint8Array(buffer);
    let headerOffset = searchHeader(typedArray);

    if (headerOffset === -1) {
      return false;
    }

    // Read the header.
    let uint32array = new Uint32Array(buffer, headerOffset, 8);
    // let headerSize = uint32array[1];
    // let archiveSize = uint32array[2];
    let formatVersionSectorSize = uint32array[3];
    // let formatVersion = formatVersionSectorSize & 0x0000FFFF;
    let hashPos = numberToUint32(uint32array[4] + headerOffset); // Whoever thought of MoonLight, clever!
    let blockPos = numberToUint32(uint32array[5] + headerOffset);
    let hashSize = uint32array[6];
    let blockSize = uint32array[7];

    // There can only be as many or less blocks as there are hashes.
    // Therefore, if the file is reporting too many blocks, cap the actual blocks read to the amount of hashes.
    if (blockSize > hashSize) {
      blockSize = hashSize;
    }

    this.headerOffset = headerOffset;
    this.sectorSize = 512 * (1 << (formatVersionSectorSize >>> 16)); // Generally 4096

    // Read the hash table.
    // Also clears any existing entries.
    // Have to copy the data, because hashPos is not guaranteed to be a multiple of 4.
    this.hashTable.load(typedArray.slice(hashPos, hashPos + hashSize * 16));

    // Read the block table.
    // Also clears any existing entries.
    // Have to copy the data, because blockPos is not guaranteed to be a multiple of 4.
    this.blockTable.load(typedArray.slice(blockPos, blockPos + blockSize * 16));

    // Clear any existing files.
    this.files.length = 0;

    // Read the files.
    for (let hash of this.hashTable.entries) {
      let blockIndex = hash.blockIndex;

      // If the file wasn't deleted, load it.
      if (blockIndex < HASH_ENTRY_DELETED) {
        let file = new MpqFile(this, hash, this.blockTable.entries[blockIndex], buffer, null);

        this.files[blockIndex] = file;
      }
    }

    // Get internal files to fill the file names.
    let listfile = this.get('(listfile)');
    this.get('(attributes)');
    this.get('(signature)');

    // If there is a listfile, use all of the file names in it.
    if (listfile) {
      let list = listfile.text();

      if (list) {
        for (let name of list.split('\r\n')) {
          // get() internally also sets the file's name to the given one.
          this.get(name);
        }
      }
    }

    return true;
  }

  /**
   * Save this archive.
   * 
   * Returns null when...
   * 
   *     1) The archive is in readonly mode.
   *     2) The offset of a file encrypted with FILE_OFFSET_ADJUSTED_KEY changed, and the file name is unknown.
   */
  save() {
    if (this.readonly) {
      return null;
    }

    let headerSize = 32;

    // Delete the internal attributes file.
    // The attributes might (and do in the case of World Editor generated maps) contain CRC checksums for the internal files.
    // If any of these files is edited in any way, the map will be considered corrupted.
    // Therefore, delete the file, and nothing will be corrupted.
    // As far as I can tell, there is no real reason to keep (and update) any of the file attributes.
    // It's not like Warcraft 3 has some database of checksums that it checks against.
    // I assume it does have a database for the Battle.net ladder maps.
    // If at any point it becomes known to me that it is indeed needed, I will add support for (attributes).
    this.delete('(attributes)');

    // Some archives have empty blocks in them.
    // That is, blocks that take up memory, but have no actual valid data in them (as far as the archive is concerned).
    // I am not sure why they exist - maybe someone deleted a file's entry and was too lazy to rebuild the archive.
    // This removes such blocks of memory from the archive.
    this.saveMemory();

    // Set the listfile.
    this.setListFile();

    // Reset the file offsets.
    let offset = headerSize;

    for (let file of this.files) {
      // If the file's offset changed, and it is encrypted with a key that depends on its offset,
      // it needs to be decryped with it's current key, and encryped with the new key.
      if (!file.offsetChanged(offset)) {
        return null;
      }

      // If the file needs to be encoded, do it.
      file.encode();

      offset += file.block.compressedSize;
    }

    let hashTable = this.hashTable;
    let blockTable = this.blockTable;
    let hashes = hashTable.entries.length;
    let blocks = blockTable.entries.length;
    let filesSize = offset - headerSize;
    let archiveSize = headerSize + filesSize + hashes * 16 + blocks * 16;
    let hashPos = headerSize + filesSize;
    let blockPos = hashPos + hashes * 16;
    let typedArray = new Uint8Array(archiveSize);
    let uint32array = new Uint32Array(typedArray.buffer, 0, 8);

    // Write the header.
    uint32array[0] = MAGIC;
    uint32array[1] = headerSize;
    uint32array[2] = archiveSize;
    uint32array[3] = Math.log2(this.sectorSize / 512) << 16; // The version is always 0, so ignore it.
    uint32array[4] = hashPos;
    uint32array[5] = blockPos;
    uint32array[6] = hashes;
    uint32array[7] = blocks;

    offset = headerSize;

    // Write the files.
    for (let file of this.files) {
      file.save(typedArray.subarray(offset, offset + file.block.compressedSize));

      offset += file.block.compressedSize;
    }

    // Write the hash table.
    hashTable.save(typedArray.subarray(offset, offset + hashTable.entries.length * 16));

    offset += hashTable.entries.length * 16;

    // Write the block table.
    blockTable.save(typedArray.subarray(offset, offset + blockTable.entries.length * 16));

    return typedArray.buffer;
  }

  /**
   * Some MPQs have empty memory chunks in them, left over from files that were deleted.
   * This function searches for such chunks, and removes them.
   * 
   * Note that it is called automatically by save().
   * 
   * Does nothing if the archive is in readonly mode.
   */
  saveMemory() {
    if (this.readonly) {
      return 0;
    }

    let blocks = this.blockTable.entries;
    let hashes = this.hashTable.entries;
    let i = blocks.length;
    let saved = 0;

    while (i--) {
      let block = blocks[i];

      // Remove blocks with no data.
      if (block.normalSize === 0) {
        this.removeBlock(i);

        saved += block.compressedSize;
      } else {
        let used = false;

        for (let hash of hashes) {
          if (hash.blockIndex === i) {
            used = true;
          }
        }

        // Remove blocks that are not used.
        if (!used) {
          this.removeBlock(i);

          saved += block.compressedSize;
        }
      }
    }

    return saved;
  }

  removeBlock(blockIndex: number) {
    for (let hash of this.hashTable.entries) {
      if (hash.blockIndex < HASH_ENTRY_DELETED && hash.blockIndex > blockIndex) {
        hash.blockIndex -= 1;
      }
    }

    this.blockTable.entries.splice(blockIndex, 1);
  }

  /**
   * Gets a list of the file names in the archive.
   * 
   * Note that files loaded from an existing archive, without resolved names, will be named FileXXXXXXXX.
   */
  getFileNames() {
    let names = [];

    for (let file of this.files) {
      if (file && file.name !== '') {
        names.push(file.name);
      }
    }

    return names;
  }

  /**
   * Sets the list file with all of the resolved file names.
   * 
   * Does nothing if the archive is in readonly mode.
   */
  setListFile() {
    if (this.readonly) {
      return false;
    }

    // Add the listfile, possibly overriding an existing one.
    return this.set('(listfile)', this.getFileNames().join('\r\n'));
  }

  /**
   * Adds a file to this archive.
   * If the file already exists, its buffer will be set.
   * 
   * Does nothing if the archive is in readonly mode.
   */
  set(name: string, buffer: ArrayBuffer | string) {
    if (this.readonly) {
      return false;
    }

    let arrayBuffer;

    if (buffer instanceof ArrayBuffer) {
      arrayBuffer = buffer;
    } else {
      let stream = new BinaryStream(new Uint8Array(buffer.length));

      stream.write(buffer);

      arrayBuffer = stream.buffer;
    }

    let file = this.get(name);

    // If the file already exists, change the data.
    if (file) {
      file.set(arrayBuffer);
    } else {
      let blockIndex = this.blockTable.entries.length;
      let hash = this.hashTable.add(name, blockIndex);

      if (!hash) {
        return false;
      }

      let block = this.blockTable.add(arrayBuffer);

      file = new MpqFile(this, hash, block, null, arrayBuffer);
      file.name = name;
      file.nameResolved = true;

      this.files[blockIndex] = file;
    }

    return true;
  }

  /**
   * Gets a file from this archive.
   * If the file doesn't exist, null is returned.
   */
  get(name: string) {
    let hash = this.hashTable.get(name);

    if (hash) {
      let blockIndex = hash.blockIndex;

      // Check if the block exists.
      if (blockIndex < HASH_ENTRY_DELETED) {
        let file = this.files[blockIndex];

        if (file) {
          // Save the name in case it wasn't already resolved.
          file.name = name;
          file.nameResolved = true;

          return file;
        }
      }
    }

    return null;
  }

  /**
   * Checks if a file exists.
   * 
   * Prefer to use get() if you are going to use get() afterwards anyway.
   */
  has(name: string) {
    return !!this.get(name);
  }

  /**
   * Deletes a file from this archive.
   * 
   * Does nothing if...
   * 
   *     1) The archive is in readonly mode.
   *     2) The file does not exist.
   */
  delete(name: string): boolean {
    if (this.readonly) {
      return false;
    }

    let file = this.get(name);

    if (!file) {
      return false;
    }

    file.delete();

    return true;
  }

  /**
   * Renames a file.
   * 
   * Does nothing if...
   * 
   *     1) The archive is in readonly mode.
   *     2) The file does not exist.
   * 
   * Note that this sets the current file's hash's status to being deleted, rather than removing it.
   * This is due to the way the search algorithm works.
   */
  rename(name: string, newName: string): boolean {
    if (this.readonly) {
      return false;
    }

    let file = this.get(name);

    if (!file) {
      return false;
    }

    file.rename(newName);

    return true;
  }

  /**
   * Resizes the hashtable to the nearest power of two equal to or bigger than the given size.
   * 
   * Generally speaking, the bigger the hashtable is, the quicker insertions/searches are, at the cost of added memory.
   * 
   * Does nothing if...
   * 
   *     1) The archive is in readonly mode.
   *     2) The calculated size is smaller than the amount of files in the archive.
   *     3) Not all of the file names in the archive are resolved.
   */
  resizeHashtable(size: number): boolean {
    if (this.readonly) {
      return false;
    }

    size = Math.max(4, powerOfTwo(size));

    let files = this.files;

    // Can't resize to a size smaller than the existing files.
    if (files.length > size) {
      return false;
    }

    // If not all file names are known, don't resize.
    // The insertion algorithm depends on the names.
    for (let file of files) {
      if (!file.nameResolved) {
        return false;
      }
    }

    let hashTable = this.hashTable;
    let entries = hashTable.entries;
    let oldEntries = entries.slice();

    // Clear the entries.
    hashTable.clear();

    // Add empty entries.
    hashTable.addEmpties(size);

    // Go over all of the old entries, and copy them into the new entries.
    for (let hash of oldEntries) {
      if (hash.blockIndex !== HASH_ENTRY_EMPTY) {
        let file = files[hash.blockIndex];
        let insertionIndex = hashTable.getInsertionIndex(file.name);

        entries[insertionIndex].copy(hash);
      }
    }

    return true;
  }
}
