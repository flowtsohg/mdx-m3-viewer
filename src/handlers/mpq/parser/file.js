import { inflate, deflate } from 'pako';
import BinaryReader from '../../../binaryreader';
import BinaryWriter from '../../../binarywriter';
import { FILE_COMPRESSED, FILE_ENCRYPTED, FILE_FIX_KEY, FILE_SINGLE_UNIT, FILE_EXISTS } from './constants';

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
    arrayBuffer() {
        // Decode if needed
        if (this.buffer === null) {
            this.decode();
        }

        return this.buffer;
    },

    text() {
        let buffer = this.arrayBuffer();
        
        if (buffer) {
            return (new BinaryReader(this.buffer)).read();
        }

        return null;
    },

    load(hash, block, buffer) {
        this.name = `File${`${hash.blockIndex}`.padStart(8, '0')}`;
        this.hash = hash;
        this.block = block;
        this.rawBuffer = buffer.slice(block.offset, block.offset + block.compressedSize);
    },

    save(writer) {
        writer.writeUint8Array(new Uint8Array(this.rawBuffer));
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

    decode() {
        let archive = this.archive,
            block = this.block,
            c = archive.c,
            encryptionKey = c.computeFileKey(this.name, block),
            reader = new BinaryReader(this.rawBuffer),
            flags = block.flags;

        // One buffer of raw data.
        // I don't know why having no flags means it's a chunk of memory rather than sectors.
        // After all, there is no flag to say there are indeed sectors.
        if (flags === FILE_EXISTS) {
            let sector = reader.readUint8Array(block.normalSize);

            this.buffer = sector.buffer;
        // One buffer of possibly encrypted and/or compressed data.
        } else if (flags & FILE_SINGLE_UNIT) {
            // Read the sector
            let sector = reader.readUint8Array(block.compressedSize);

            // If this block is encrypted, decrypt the sector
            if (flags & FILE_ENCRYPTED) {
                c.decryptBlock(sector, encryptionKey);
            }

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
            let sectorOffsets = reader.readUint32Array(sectorCount + 1);

            // If this block is encrypted, decrypt the sector offsets
            if (flags & FILE_ENCRYPTED) {
                c.decryptBlock(sectorOffsets, encryptionKey - 1);
            }

            let start = sectorOffsets[0],
                end = sectorOffsets[1],
                offset = 0;

            for (let i = 0; i < sectorCount; i++) {
                // Go to the position of this sector
                reader.seek(start);

                // Read the sector
                let sector = reader.readUint8Array(end - start);

                // If this block is encrypted, decrypt the sector
                if (flags & FILE_ENCRYPTED) {
                    c.decryptBlock(sector, encryptionKey + i);
                }

                // Decompress the sector
                if (flags & FILE_COMPRESSED) {
                    let uncompressedSize;

                    // If this is the last sector, its uncompressed size might not be the size of a sector.
                    if (this.normalSize - offset <= archive.sectorSize) {
                        uncompressedSize = this.normalSize - offset;
                    } else {
                        uncompressedSize = archive.sectorSize;
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

    decompressSector(buffer, uncompressedSize) {
        if (buffer.byteLength === uncompressedSize) {
            return buffer;
        } else {
            // The first byte is the compression type
            switch (buffer[0]) {
                // Huffman
                //case 1:
                //var huffman = new Huffman(new Uint8Array(buffer.buffer, 1));

                //return huffman.decompress();

                // ZLib
                case 2:
                    return inflate(new Uint8Array(buffer.buffer, 1));

                // PKWare DCL Explode
                //case 8:
                //    return Explode(new Uint8Array(buffer.buffer, 1));

                // Unsupported
                default:
                    console.warn(`File ${this.name}, compression type ${buffer[0]} not supported`);
                    return;
            }
        }
    },

    // For now hardcoded to zlib single unit.
    encode() {
        if (this.buffer !== null && this.rawBuffer === null) {
            let sectorSize = this.archive.sectorSize;

            let buffer = new Uint8Array(this.buffer),
                sectorCount = Math.ceil(buffer.byteLength / sectorSize),
                offsets = new Uint32Array(sectorCount + 1),
                offset = offsets.byteLength,
                chunks = [];

            // First offset is right after the offsets list.
            offsets[0] = offsets.byteLength;

            for (let i = 0; i < sectorCount; i++) {
                let sectorOffset = i * sectorSize,
                    uncompressed = buffer.subarray(sectorOffset, sectorOffset + sectorSize),
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
                rawBuffer = new ArrayBuffer(compressedSize),
                writer = new BinaryWriter(rawBuffer);

            // Write the offsets list.
            writer.writeUint32Array(offsets);

            for (let chunk of chunks) {
                // If the chunk size is smaller than the archive's sector size, it means it was compressed.
                if (chunk.byteLength < sectorSize) {
                    writer.writeUint8(2); // zlib
                }

                // Write the chunk.
                writer.writeUint8Array(chunk);
            }

            this.rawBuffer = rawBuffer;
            this.block.compressedSize = rawBuffer.byteLength;
            this.block.flags = (FILE_EXISTS | FILE_COMPRESSED) >>> 0;
        }
    },

    reEncrypt(offset) {
        let archive = this.archive,
            block = this.block,
            c = archive.c,
            data = new Uint8Array(this.rawBuffer),
            flags = block.flags,
            encryptionKey = c.computeFileKey(this.name, block);

        block.offset = offset;

        let newEncryptionKey = c.computeFileKey(this.name, block);

        // One chunk.
        if (flags & FILE_SINGLE_UNIT) {
            // Decrypt the chunk with the old key.
            c.decryptBlock(data, encryptionKey);

            // Encrypt the chunk with the new key.
            c.encryptBlock(data, newEncryptionKey);
        // One or more sectors.
        } else {
            let sectorCount = Math.ceil(block.normalSize / archive.sectorSize);

            // Get the sector offsets
            let sectorOffsets = new Uint32Array(data.buffer, 0, sectorCount + 1);

            // Decrypt the sector offsets with the old key.
            c.decryptBlock(sectorOffsets, encryptionKey - 1);

            let start = sectorOffsets[0],
                end = sectorOffsets[1];

            for (let i = 0; i < sectorCount; i++) {
                let sector = data.subarray(start, end);

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
