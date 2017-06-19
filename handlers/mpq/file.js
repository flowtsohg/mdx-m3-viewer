/**
 * @constructor
 * @memberOf Mpq
 * @param {MpqArchive} archive The archive that owns this file
 * @param {MpqBlockTableEntry} block This file's block
 * @param {string} name This file's name
 */
function MpqFile(archive, block, name) {
    /** @member {MpqArchive} */
    this.archive = archive;
    /** @member {MpqBlockTableEntry} */
    this.block = block;
    /** @member {string} */
    this.name = name;
    /** @member {number} */
    this.sectorCount = Math.ceil(block.normalSize / archive.sectorSize);
    /** @member {MpqCrypto} */
    this.c = archive.c;
    /** @member {number} */
    this.encryptionKey = 0;
    /** @member {?ArrayBuffer} */
    this.buffer = null;
    /** @member {boolean} */
    this.isEncrypted = false;

    if (block.flags & Mpq.FILE_ENCRYPTED) {
        let sepIndex = name.lastIndexOf("\\"),
            pathlessName = name.substring(sepIndex + 1);

        this.isEncrypted = true;
        this.encryptionKey = this.c.hash(pathlessName, Mpq.HASH_FILE_KEY);

        if (block.flags & Mpq.FILE_ADJUSTED_ENCRYPTED) {
            this.encryptionKey = (this.encryptionKey + block.filePos) ^ block.normalSize;
        }
    }

    this.decode();
}

MpqFile.prototype = {
    decode() {
        let archive = this.archive,
            block = this.block,
            flags = block.flags,
            sectorCount = this.sectorCount,
            isEncrypted = this.isEncrypted,
            c = this.c,
            encryptionKey = this.encryptionKey,
            reader = new BinaryReader(archive.buffer);

        // Go to the position of this block
        reader.seek(block.filePos);

        if (flags & Mpq.FILE_SINGLEUNIT) {
            console.warn("[MPQFile::parse] Single unit (add support!)")
            console.log(this);
            /*
            if (flags & Mpq.FILE_COMPRESSED) {

            } else {

            }
            */
        }

        if (flags & Mpq.FILE_COMPRESSED) {
            // Alocate a buffer for the uncompressed block size
            let buffer = new Uint8Array(block.normalSize)

            // Get the sector offsets
            let sectorOffsets = reader.readUint32Array(sectorCount + 1);

            // If this block is encrypted, decrypt the sector offsets
            if (isEncrypted) {
                c.decryptBlock(sectorOffsets.buffer, encryptionKey - 1);
            }

            let start = sectorOffsets[0],
                end = sectorOffsets[1],
                finalSize = 0;

            for (let i = 0; i < sectorCount; i++) {
                // Go to the position of this sector
                reader.seek(block.filePos + start);

                // Read the sector
                let sector = reader.readUint8Array(end - start);

                // If this block is encrypted, decrypt the sector
                if (isEncrypted) {
                    c.decryptBlock(sector.buffer, encryptionKey + i);
                }

                // Decompress the sector
                if (block.normalSize - finalSize <= archive.sectorSize) {
                    sector = this.decompressSector(sector, block.normalSize - finalSize);
                } else {
                    sector = this.decompressSector(sector, archive.sectorSize);
                }

                // If failed to decompress the sector, stop
                if (!sector) {
                    //console.warn("[MPQFile::parseBlock:" + this.name + "]", "Failed to decompress");
                    return;
                }

                // Add the sector bytes to the buffer
                buffer.set(sector, finalSize);
                finalSize += sector.byteLength;

                // Prepare for the next sector
                if (i < sectorCount) {
                    start = end;
                    end = sectorOffsets[i + 2];
                }
            }

            this.buffer = buffer.buffer;
        } else {
            // Read the sector
            let sector = reader.readUint8Array(block.normalSize);

            // If this block is encrypted, decrypt the sector
            if (isEncrypted) {
                c.decryptBlock(sector.buffer, encryptionKey);
            }

            this.buffer = sector.buffer;
        }
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
                    var inflate = new Zlib.Inflate(new Uint8Array(buffer.buffer, 1));

                    return inflate.decompress();

                    // PKWare DCL Explode
                    //case 8:
                    //    return Explode(new Uint8Array(buffer.buffer, 1));

                    // Unsupported
                    //default:
                    //console.warn("[MPQ.File:" + this.name + "] compression type " + buffer[0] + " not supported");
                    //return;
            }
        }
    }
};
