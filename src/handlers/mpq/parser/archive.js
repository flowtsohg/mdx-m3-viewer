import { powerOfTwo } from '../../../common/math';
import stringToBuffer from '../../../common/stringtobuffer';
import BinaryReader from '../../../binaryreader';
import BinaryWriter from '../../../binarywriter';
import MpqCrypto from './crypto';
import MpqHashTable from './hashtable';
import MpqBlockTable from './blocktable';
import MpqHash from './hash';
import MpqFile from './file';

/**
 * A MoPaQ archive.
 * Only version 0 is supported.
 * If given a buffer, it will be loaded. Otherwise, call load() whenever you want.
 * If readonly is true...
 *     1) Some operations will not work (resizeHashtable, save, set, delete).
 *     2) File raw buffers (which might be compressed and/or encrypted) will be discarded if the files are decoded.
 * 
 * @constructor
 * @param {?ArrayBuffer} buffer
 * @param {?boolean} readonly
 */
function MpqArchive(buffer, readonly) {
    /** @member {number} */
    this.sectorSize = 4096;
    /** @member {MpqCrypto} */
    this.c = new MpqCrypto();
    /** @member {MpqHashTable} */
    this.hashTable = new MpqHashTable(this.c);
    /** @member {MpqBlockTable} */
    this.blockTable = new MpqBlockTable(this.c);
    /** @member {Array<MpqFile>} */
    this.files = [];
    /** @member {boolean} */
    this.readonly = !!readonly;

    if (buffer instanceof ArrayBuffer) {
        this.load(buffer);
    }
}

MpqArchive.prototype = {
    /**
     * Resizes the hashtable to the nearest power of two equal or bigger than the given size.
     * Generally speaking, the bigger the hashtable is, the quicker insertions/searches are, at the cost of added memory.
     * Will not work in case...
     *     1) The archive is in readonly mode.
     *     2) The calculated size is smaller than the amount of files in the archive.
     *     3) Not all of  the file names in the archive are known.
     * 
     * @param {number} size
     * @returns {boolean}
     */
    resizeHashtable(size) {
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

        let hashTable = this.hashTable,
            entries = hashTable.entries,
            oldEntries = entries.slice();

        // Clear the entries.
        hashTable.clear();

        // Add empty entries.
        hashTable.addEmpties(size);

        // Go over all of the old entries, and copy them into the new entries.
        for (let hash of oldEntries) {
            if (hash.blockIndex !== 0xFFFFFFFF) {
                let file = files[hash.blockIndex],
                    insertionIndex = hashTable.getInsertionIndex(file.name);

                entries[insertionIndex].copy(hash);
            }
        }

        return true;
    },

    /**
     * Load an existing archive.
     * Note that this clears the archive from whatever it had in it before.
     * 
     * @param {ArrayBuffer} buffer
     * @returns {boolean}
     */
    load(buffer) {
        let reader = new BinaryReader(buffer),
            headerOffset = this.searchHeader(reader);
        
        if (headerOffset === -1) {
            return false;
        }

        buffer = buffer.slice(headerOffset);

        reader.skip(4); // MPQ\x1A

        // Read the header.
        let headerSize = reader.readUint32(),
            archiveSize = reader.readUint32(),
            formatVersion = reader.readUint16(),
            sectorSize = 512 * (1 << reader.readUint16()), // Always 4096?
            hashPos = reader.readUint32(),
            blockPos = reader.readUint32(),
            hashSize = reader.readUint32(),
            blockSize = reader.readUint32();

        // Technically only version 0 is supported.
        // Some people used the fact that Warcraft 3 doesn't actually check the version (there was only one version back then), to trick MPQ loaders.
        // Therefore, assume that a valid Warcraft 3 MPQ was loaded.
        //if (formatVersion !== 0) {
        //    return false;
        //}

        // Read the hash table.
        // Also clears any existing entries.
        this.hashTable.load(buffer.slice(hashPos, hashPos + hashSize * 16));

        // Read the block table.
        // Also clears any existing entries.
        this.blockTable.load(buffer.slice(blockPos, blockPos + blockSize * 16));

        // Clear any existing files.
        this.files.length = 0;

        // Read the files.
        for (let hash of this.hashTable.entries) {
            let blockIndex = hash.blockIndex;

            // If the file wasn't deleted, load it.
            if (blockIndex < 0xFFFFFFFE) {
                let file = new MpqFile(this);

                file.load(hash, this.blockTable.entries[blockIndex], buffer);

                this.files[blockIndex] = file;
            }
        }

        // Get both internal files to fill the file names.
        let listfile = this.get('(listfile)'),
            attributes = this.get('(attributes)');

        // If there is a listfile, use all of the file names in it.
        if (listfile) {
            let s = listfile.text();

            if (s !== null) {
                for (let name of s.split('\r\n')) {
                    // get() internally also sets the file's name to the given one.
                    this.get(name);
                }
            }
        }

        return true;
    },

    /**
     * Save this archive.
     * Returns null when...
     *     1) The archive is in readonly mode.
     *     2) A the offset of a file encrypted with FILE_FIX_KEY changed, and the file name is unknown.
     * 
     * @returns {?ArrayBuffer}
     */
    save() {
        if (this.readonly) {
            return null;
        }

        let headerSize = 32;

        // Set the listfile.
        this.setListfile();

        // Reset the file positions.
        let offset = headerSize;
        
        for (let file of this.files) {
            // If the file's position changed, and it is encrypted with a key that depends on its position,
            // it needs to be decryped with it's current encryption key, and encryped with the new key.
            if (!file.offsetChanged(offset)) {
                return null;
            }
            
            // If the file needs to be encoded, do it.
            file.encode();

            offset += file.block.compressedSize;
        }

        let hashTable = this.hashTable,
            blockTable = this.blockTable,
            hashes = hashTable.entries.length,
            blocks = blockTable.entries.length,
            filesSize = offset - headerSize;
        
        let archiveSize = headerSize + filesSize + hashes * 16 + blocks * 16,
            hashPos = headerSize + filesSize,
            blockPos = hashPos + hashes * 16,
            buffer = new ArrayBuffer(archiveSize),
            writer = new BinaryWriter(buffer);
        
        // Write the header.
        writer.write('MPQ\x1A'); // Magic
        writer.writeUint32(headerSize);
        writer.writeUint32(archiveSize);
        writer.writeUint16(0); // Version
        writer.writeUint16(Math.log2(this.sectorSize / 512));
        writer.writeUint32(hashPos);
        writer.writeUint32(blockPos);
        writer.writeUint32(hashes); // Hash size
        writer.writeUint32(blocks); // Block size

        // Write the files.
        for (let file of this.files) {
            file.save(writer);
        }
        
        // Write the hash table.
        hashTable.save(writer);

        // Write the block table.
        blockTable.save(writer);

        return buffer;
    },

    /**
     * Gets a list of the file names in the archive.
     * Note that files loaded from an existing archive, without known names, will be named FileXXXXXXXX.
     * 
     * @returns {Array<string>}
     */
    getFileNames() {
        let list = [];
        
        for (let file of this.files) {
            if (file.name !== '') {
                list.push(file.name);
            }
        }

        return list;
    },

    /**
     * Sets the list file with all of the known file names.
     * Does nothing if the archive is in readonly mode.
     * 
     * @returns {boolean}
     */
    setListfile() {
        if (this.readonly) {
            return false;
        }

        // Add the listfile, possibly overriding an existing one.
        return this.set('(listfile)', stringToBuffer(this.getFileNames().join('\r\n')), true);
    },

    /**
     * Adds a file to this archive.
     * If the file already exists, it will only be overwritten if overwriteIfExists is true.
     * 
     * @param {string} name
     * @param {ArrayBuffer} buffer
     * @param {boolean} overwriteIfExists
     * @returns {boolean}
     */
    set(name, buffer, overwriteIfExists) {
        if (this.readonly) {
            return false;
        }

        let file = this.get(name);

        if (!file) {
            let blockIndex = this.blockTable.entries.length;
            
            file = new MpqFile(this);

            file.name = name;
            file.nameResolved = true;
            file.hash = this.hashTable.add(name, blockIndex);
            file.block = this.blockTable.add(buffer);
            file.buffer = buffer;
            
            this.files[blockIndex] = file;

            return true;
        } else if (overwriteIfExists) {
            file.set(buffer);

            return true;
        }

        return false;
    },

    /**
     * Gets a file from this archive.
     * If the file doesn't exist, null is returned.
     * 
     * @param {string} name
     * @returns {?MpqFile}
     */
    get(name) {
        let hash = this.hashTable.get(name);

        if (hash) {
            let file = this.files[hash.blockIndex];

            // Save the name in case it wasn't saved previously.
            file.name = name.toLowerCase();
            file.nameResolved = true;

            return file;
        }

        return null;
    },

    /**
     * Checks if a file exists.
     * Prefer to use get().
     * 
     * @param {string} name
     * @returns {boolean}
     */
    has(name) {
        return !!this.get(name);
    },

    /**
     * Deletes a file from this archive.
     * Does nothing if the archive is in readonly mode.
     * 
     * @param {string} name
     * @returns {boolean}
     */
    delete(name) {
        if (this.readonly) {
            return false;
        }

        let file = this.get(name);

        if (file) {
            let hash = file.hash,
                blockIndex = hash.blockIndex;

            hash.nameA = 0xFFFFFFFF;
            hash.nameB = 0xFFFFFFFF;
            hash.locale = 0XFFFF;
            hash.platform = 0xFFFF;
            hash.blockIndex = 0xFFFFFFFE; // Deleted

            for (let hash of this.hashTable.entries) {
                if (hash.blockIndex < 0xFFFFFFFE && hash.blockIndex > blockIndex) {
                    hash.blockIndex -= 1;
                }
            }

            this.blockTable.entries.splice(blockIndex, 1);
            this.files.splice(blockIndex, 1);

            return true;
        }

        return false;
    },

    searchHeader(reader) {
        for (let i = 0, l = Math.ceil(reader.byteLength / 512) ; i < l; i++) {
            reader.seek(i * 512)

            if (reader.peek(4) === 'MPQ\x1A') {
                return reader.tell();
            }
        }

        return -1;
    }
};

export default MpqArchive;
