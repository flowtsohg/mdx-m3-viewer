import { inflate, deflate } from 'pako';
import BinaryReader from '../../../binaryreader';
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
                c.decryptBlock(sector.buffer, encryptionKey);
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
                c.decryptBlock(sectorOffsets.buffer, encryptionKey - 1);
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
                    c.decryptBlock(sector.buffer, encryptionKey + i);
                }

                // Decompress the sector
                if (flags & FILE_COMPRESSED) {
                    if (this.normalSize - offset <= archive.sectorSize) {
                        sector = this.decompressSector(sector, this.normalSize - offset);
                    } else {
                        sector = this.decompressSector(sector, archive.sectorSize);
                    }
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
            let compressedBuffer = deflate(new Uint8Array(this.buffer));

            // Compression can only occur if the compressed data is smaller than the uncompressed data.
            // Doing otherwise is an error and will result in a broken file.
            if (compressedBuffer.byteLength + 1 < this.buffer.byteLength) {
                let rawBuffer = new Uint8Array(compressedBuffer.byteLength + 1);
                
                rawBuffer[0] = 2; // zlib
                rawBuffer.set(compressedBuffer, 1);

                this.rawBuffer = rawBuffer.buffer;
                this.block.compressedSize = rawBuffer.byteLength;
                this.block.flags = (FILE_COMPRESSED | FILE_SINGLE_UNIT | FILE_EXISTS) >>> 0; // Cast to an unsigned int
            } else {
                this.rawBuffer = this.buffer;
                this.block.compressedSize = this.buffer.byteLength;
                this.block.flags = (FILE_EXISTS) >>> 0;
            }

                    /*
            let sectorSize = this.sectorSize - 1, // -1 for the first compression mask byte
                sectorCount = Math.ceil(buffer.byteLength / sectorSize);

            console.log('Setting file', name);
            console.log('Size', buffer.byteLength)
            console.log('Sectors', sectorCount);

            let sectors = [];

            let view = new Uint8Array(buffer);

            for (let i = 0; i < sectorCount; i++) {
                let data = view.slice(sectorSize * i, sectorSize * (i + 1));

                //let compressedData = deflate(data);

                let sector = new Uint8Array(1 + data.byteLength);

                sector[0] = 2; // zlib
                sector.set(data, 1);

                sectors[i] = sector;
            }

            console.log(sectors)
            */
        }
    },

    offsetChanged(offset) {
        let block = this.block;
        
        if (block.offset !== offset && block.flags & FILE_FIX_KEY) {
            throw new Error(`File ${this.name} will get corrupted due to the encryption key changing`);
        }

        block.offset = offset;
    }
};

export default MpqFile;
