function MpqArchive(env, pathSolver) {
    File.call(this, env, pathSolver);
}

MpqArchive.prototype = {
    get handler() {
        return Mpq;
    },

    initialize(src) {
        let reader = new BinaryReader(src);

        this.headerOffset = this.searchHeader(reader);

        this.buffer = src.slice(this.headerOffset);

        if (this.headerOffset > -1) {
            this.readHeader(reader);

            // Only version 0 is supported, but apparently some maps fake their version, since WC3 ignores it, so ignore it too
            //if (this.formatVersion === 0) {
            this.c = new MpqCrypto();

            this.hashTable = new MpqHashTable(this.buffer.slice(this.hashPos, this.hashPos + this.hashSize * 16), this.c);

            this.blockTable = new MpqBlockTable(this.buffer.slice(this.blockPos, this.blockPos + this.blockSize * 16), this.c);
            //}
        }

        return true;
    },

    searchHeader(reader) {
        for (let i = 0, l = Math.floor(reader.byteLength / 512) ; i < l; i++) {
            seek(reader, i * 512)

            if (peek(reader, 4) === "MPQ\x1A") {
                return tell(reader);
            }
        }

        return -1;
    },

    readHeader(reader) {
        skip(reader, 4); // MPQ\x1A
        skip(reader, 4); // Header size

        this.archiveSize = readUint32(reader);
        this.formatVersion = readUint16(reader);
        this.sectorSize = 512 * (1 << readUint16(reader));
        this.hashPos = readUint32(reader);
        this.blockPos = readUint32(reader);
        this.hashSize = readUint32(reader);
        this.blockSize = readUint32(reader);
    },

    hasFile(name) {
        return this.hashTable.getBlockIndexOfFile(name) !== -1;
    },

    getFile(name) {
        let blockIndex = this.hashTable.getBlockIndexOfFile(name);

        if (blockIndex !== -1) {
            let blockEntry = this.blockTable.entries[blockIndex];

            return new MpqFile(this, blockEntry, name);
        }
    },

    getFileList() {
        if (this.hasFile("(listfile)")) {
            let file = this.getFile("(listfile)");
                reader = new BinaryReader(file.buffer),
                data = read(reader, reader.byteLength);

            return data.trim().split("\r\n");
        }

        return [];
    }
};

mix(MpqArchive.prototype, File.prototype);
