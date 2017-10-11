import { inflate, deflate } from 'pako';
import { FILE_COMPRESSED, FILE_ENCRYPTED, FILE_FIX_KEY, FILE_SINGLE_UNIT, FILE_EXISTS, COMPRESSION_HUFFMAN, COMPRESSION_DEFLATE, COMPRESSION_IMPLODE, COMPRESSION_BZIP2, COMPRESSION_ADPCM_MONO, COMPRESSION_ADPCM_STEREO } from './constants';

/**
 * @constructor
 * @param {MpqArchive} archive The archive that owns this file
 */
function MpqFile(archive) {
    /** @member {MpqArchive} */
    this.archive = archive;
    /** @member {MpqCrypto} */
    this.c = archive.c;
    /** @member {string} */
    this.name = '';
    /** @member {boolean} */
    this.nameResolved = false;
    /** @member {MpqHash|null} */
    this.hash = null;
    /** @member {MpqBlock|null} */
    this.block = null;
    /** @member {ArrayBuffer|null} */
    this.rawBuffer = null;
    /** @member {ArrayBuffer|null} */
    this.buffer = null;
}

MpqFile.prototype = {
    /**
     * Gets the file data as an ArrayBuffer.
     * Decodes the file if needed.
     * If the file could not be decoded, null is returned.
     * 
     * @returns {ArrayBuffer|null}
     */
    arrayBuffer() {
        // Decode if needed
        if (this.buffer === null) {
            this.decode();
        }

        return this.buffer;
    },

    /**
     * Gets the file data as a string.
     * Decodes the file if needed.
     * If the file could not be decoded, null is returned.
     * 
     * @returns {string|null}
     */
    text() {
        let buffer = this.arrayBuffer();
        
        if (buffer) {
            let data = new Uint8Array(buffer),
                text = '';

            for (let i = 0, l = data.length; i < l; i++) {
                text += String.fromCharCode(data[i]);
            }
            
            return text;
        }

        return null;
    },

    load(hash, block, typedArray) {
        this.name = `File${`${hash.blockIndex}`.padStart(8, '0')}`;
        this.hash = hash;
        this.block = block;
        this.rawBuffer = typedArray.slice(block.offset, block.offset + block.compressedSize).buffer;
    },

    /**
     * @param {Uint8Array} typedArray 
     */
    save(typedArray) {
        typedArray.set(new Uint8Array(this.rawBuffer));
    },

    set(buffer) {
        // Reset the hash.
        let hash = this.hash;

        hash.locale = 0;
        hash.platform = 0;

        // Reset the block.
        let block = this.block;
        block.compressedSize = 0;
        block.normalSize = buffer.byteLength;
        block.flags = 0;
        
        this.buffer = buffer;
        this.rawBuffer = null;
    },

    /**
     * Decode the file.
     * 
     * @returns {boolean}
     */
    decode() {
        let archive = this.archive,
            block = this.block,
            c = archive.c,
            encryptionKey = c.computeFileKey(this.name, block),
            data = new Uint8Array(this.rawBuffer),
            flags = block.flags;

        // One buffer of raw data.
        // I don't know why having no flags means it's a chunk of memory rather than sectors.
        // After all, there is no flag to say there are indeed sectors.
        if (flags === FILE_EXISTS) {
            this.buffer = data.slice(0, block.normalSize).buffer;
        // One buffer of possibly encrypted and/or compressed data.
        } else if (flags & FILE_SINGLE_UNIT) {
            // Read the sector
            let sector = data.slice(0, block.compressedSize);

            // If this block is encrypted, decrypt the sector.
            if (flags & FILE_ENCRYPTED) {
                c.decryptBlock(sector, encryptionKey);
            }

            // If this block is compressed, decompress the sector.
            if (flags & FILE_COMPRESSED) {
                sector = this.decompressSector(sector, block.normalSize);
            }

            this.buffer = sector.buffer;
        // One or more sectors of possibly encrypted and/or compressed data.
        } else {
            let sectorCount = Math.ceil(block.normalSize / archive.sectorSize);

            // Alocate a buffer for the uncompressed block size
            let buffer = new Uint8Array(block.normalSize)
            
            // Get the sector offsets
            let sectorOffsets = new Uint32Array(data.buffer, 0, sectorCount + 1);

            // If this block is encrypted, decrypt the sector offsets
            if (flags & FILE_ENCRYPTED) {
                c.decryptBlock(sectorOffsets, encryptionKey - 1);
            }

            let start = sectorOffsets[0],
                end = sectorOffsets[1],
                offset = 0;

            for (let i = 0; i < sectorCount; i++) {
                // Read the sector
                let sector = data.slice(start, end);

                // If this block is encrypted, decrypt the sector
                if (flags & FILE_ENCRYPTED) {
                    c.decryptBlock(sector, encryptionKey + i);
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

                // If failed to decompress the sector, stop.
                if (!sector) {
                    return false;
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

            this.buffer = buffer.buffer;
        }

        // If the archive is in read-only mode, the raw buffer isn't needed anymore, so free the memory.
        if (archive.readonly) {
            this.rawBuffer = null;
        }

        return true;
    },

    decompressSector(typedArray, decompressedSize) {
        // If the size of the data is the same as its decompressed size, it's not compressed.
        if (typedArray.byteLength === decompressedSize) {
            return typedArray;
        } else {
            let compressionMask = typedArray[0];

            if (compressionMask & COMPRESSION_BZIP2) {
                console.warn(`File ${this.name}, compression type 'bzip2' not supported`);
                return null;
            }

            if (compressionMask & COMPRESSION_IMPLODE) {
                console.warn(`File ${this.name}, compression type 'implode' not supported`);
                return null;
            }

            if (compressionMask & COMPRESSION_DEFLATE) {
                typedArray = inflate(new Uint8Array(typedArray.buffer, 1));
            }
            
            if (compressionMask & COMPRESSION_HUFFMAN) {
                console.warn(`File ${this.name}, compression type 'huffman' not supported`);
                return null;
            }

            if (compressionMask & COMPRESSION_ADPCM_STEREO) {
                console.warn(`File ${this.name}, compression type 'adpcm stereo' not supported`);
                return null;
            }

            if (compressionMask & COMPRESSION_ADPCM_MONO) {
                console.warn(`File ${this.name}, compression type 'adpcm mono' not supported`);
                return null;
            }

            return typedArray;
        }
    },

    /**
     * Encode the file.
     * For now it is hardcoded to zlib compression.
     * 
     * @returns {boolean}
     */
    encode() {
        if (this.buffer !== null && this.rawBuffer === null) {
            let sectorSize = this.archive.sectorSize;

            let data = new Uint8Array(this.buffer),
                sectorCount = Math.ceil(data.byteLength / sectorSize),
                offsets = new Uint32Array(sectorCount + 1),
                offset = offsets.byteLength,
                chunks = [];

            // First offset is right after the offsets list.
            offsets[0] = offsets.byteLength;

            for (let i = 0; i < sectorCount; i++) {
                let sectorOffset = i * sectorSize,
                    uncompressed = data.subarray(sectorOffset, sectorOffset + sectorSize),
                    chunk = deflate(uncompressed),
                    compressedSectorSize = chunk.byteLength + 1;

                // If the sector is going to take more than the archive's sector size, don't compress it.
                if (compressedSectorSize > sectorSize) {
                    chunk = uncompressed;
                }

                offset += compressedSectorSize;

                offsets[i + 1] = offset;

                chunks[i] = chunk;
            }

            let compressedSize = offsets[offsets.length - 1],
                rawBuffer = new Uint8Array(new ArrayBuffer(compressedSize));

            // Write the offsets list.
            rawBuffer.set(new Uint8Array(offsets.buffer));

            offset = offsets.byteLength;

            for (let chunk of chunks) {
                // If the chunk size is smaller than the archive's sector size, it means it was compressed.
                if (chunk.byteLength < sectorSize) {
                    rawBuffer[offset] = 2; // zlib
                    offset += 1;
                }

                // Write the chunk.
                rawBuffer.set(chunk, offset);
                offset += chunk.byteLength;
            }

            // Only use the compressed data if it's actually smaller than the normal data.
            if (rawBuffer.byteLength < data.byteLength) {
                this.rawBuffer = rawBuffer.buffer;
                this.block.compressedSize = rawBuffer.byteLength;
                this.block.flags = (FILE_EXISTS | FILE_COMPRESSED) >>> 0;
                
            } else {
                this.rawBuffer = this.buffer;
                this.block.compressedSize = this.buffer.byteLength;
                this.block.flags = FILE_EXISTS;
            }
        }
    },

    // Decrypt this file and encrypt it back, with a new offset in the archive.
    // This is used for files that use FILE_FIX_KEY, which are encrypted with a key that depends on their offset.
    reEncrypt(offset) {
        let archive = this.archive,
            block = this.block,
            c = archive.c,
            typedArray = new Uint8Array(this.rawBuffer),
            flags = block.flags,
            encryptionKey = c.computeFileKey(this.name, block);

        block.offset = offset;

        let newEncryptionKey = c.computeFileKey(this.name, block);
        
        // One chunk.
        if (flags & FILE_SINGLE_UNIT) {
            // Decrypt the chunk with the old key.
            c.decryptBlock(typedArray, encryptionKey);

            // Encrypt the chunk with the new key.
            c.encryptBlock(typedArray, newEncryptionKey);
        // One or more sectors.
        } else {
            let sectorCount = Math.ceil(block.normalSize / archive.sectorSize);

            // Get the sector offsets
            let sectorOffsets = new Uint32Array(typedArray.buffer, 0, sectorCount + 1);

            // Decrypt the sector offsets with the old key.
            c.decryptBlock(sectorOffsets, encryptionKey - 1);

            let start = sectorOffsets[0],
                end = sectorOffsets[1];

            for (let i = 0; i < sectorCount; i++) {
                let sector = typedArray.subarray(start, end);

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
    },

    // The offset of the file this block points to has been recalculated
    // If the offset is different, and this file uses FILE_FIX_KEY encryption, it must be re-encrypted with the new offset.
    offsetChanged(offset) {
        let block = this.block;
        
        if (block.offset !== offset && block.flags & FILE_FIX_KEY) {
            if (this.nameResolved) {
                this.reEncrypt(offset);

                return true;
            }
            
            return false;
        }

        block.offset = offset;

        return true;
    }
};

export default MpqFile;
