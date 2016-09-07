const MPQ_HASH_FILE_KEY = 3,
    MPQ_FILE_COMPRESSED = 0x00000200,
    MPQ_FILE_ENCRYPTED = 0x00010000,
    MPQ_FILE_SINGLEUNIT = 0x0100000,
    MPQ_FILE_ADJUSTED_ENCRYPTED = 0x00020000,
    MPQ_FILE_EXISTS = 0x80000000,
    MPQ_FILE_DELETED = 0x02000000;

function MpqFile(archive, block, name) {
    this.archive = archive;
    this.block = block;
    this.name = name;
    this.sectorCount = Math.ceil(block.normalSize / archive.sectorSize);
    this.encryptionKey = 0;

    if (block.flags & MPQ_FILE_ENCRYPTED) {
        let sepIndex = name.lastIndexOf("\\"),
            pathlessName = name.substring(sepIndex + 1);

        this.c = archive.c;
        this.encryptionKey = this.c.hash(pathlessName, MPQ_HASH_FILE_KEY);

        if (block.flags & MPQ_FILE_ADJUSTED_ENCRYPTED) {
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
            c = this.c,
            encryptionKey = this.encryptionKey,
            reader = new BinaryReader(archive.buffer);

        // Go to the position of this block
        seek(reader, block.filePos);

        if (flags & MPQ_FILE_SINGLEUNIT) {
            console.warn("[MPQFile::parse] Single unit (add support!)")
            console.log(this);

            if (flags & MPQ_FILE_COMPRESSED) {

            } else {

            }
        }

        if (flags & MPQ_FILE_COMPRESSED) {
            // Alocate a buffer for the uncompressed block size
            let buffer = new Uint8Array(block.normalSize)

            // Get the sector offsets
            let sectorOffsets = readUint32Array(reader, sectorCount + 1);

            // If this block is encrypted, decrypt the sector offsets
            if (c) {
                c.decryptBlock(sectorOffsets.buffer, encryptionKey - 1);
            }

            let start = sectorOffsets[0],
                end = sectorOffsets[1],
                finalSize = 0;

            for (let i = 0; i < sectorCount; i++) {
                // Go to the position of this sector
                seek(reader, block.filePos + start);

                // Read the sector
                let sector = readUint8Array(reader, end - start);

                // If this block is encrypted, decrypt the sector
                if (c) {
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
            let sector = readUint8Array(reader, block.normalSize);

            // If this block is encrypted, decrypt the sector
            if (c) {
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
