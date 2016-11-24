/**
 * @class
 * @classdesc A MPQ archive, used by Warcraft 3.
 * @extends GenericFile
 * @memberOf Mpq
 * @param {ModelViewer} env The model viewer object that this texture belongs to.
 * @param {function} pathSolver A function that solves paths. See more {@link PathSolver here}.
 */
function MpqArchive(env, pathSolver) {
    GenericFile.call(this, env, pathSolver);
}

MpqArchive.prototype = {
    get handler() {
        return Mpq;
    },

    initialize(src) {
        let reader = new BinaryReader(src);

        this.headerOffset = this.searchHeader(reader);

        if (this.headerOffset === -1) {
            this.onerror("InvalidSource", "HeaderNotFound");
            return false;
        }

        this.buffer = src.slice(this.headerOffset);

        if (this.headerOffset > -1) {
            this.readHeader(reader);

            // Only version 0 is supported, but apparently some maps fake their version, since WC3 ignores it, so ignore it too
            //if (this.formatVersion === 0) {
            this.c = new MpqCrypto();

            this.hashTable = new MpqHashTable(this.buffer.slice(this.hashPos, this.hashPos + this.hashSize * 16), this.c);

            this.blockTable = new MpqBlockTable(this.buffer.slice(this.blockPos, this.blockPos + this.blockSize * 16), this.c);

            this.files = {};
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

    /**
     * @method
     * @desc Checks if a file exists in this archive.
     * @param {string} name The file name.
     * @returns {boolean}
     */
    hasFile(name) {
        return this.hashTable.getBlockIndexOfFile(name) !== -1;
    },

    /**
     * @method
     * @desc Extract a file from this archive. Note that this is a lazy and cached operation. That is, files are only decoded from the archive on extraction, and the result is then cached. Further requests to get the same file will get the cached result.
     * @param {string} name The file name.
     * @returns {MpqFile}
     */
    getFile(name) {
        let files = this.files;

        name = normalizePath(name);

        if (!files[name]) {
            let blockIndex = this.hashTable.getBlockIndexOfFile(name);

            if (blockIndex !== -1) {
                let blockEntry = this.blockTable.entries[blockIndex],
                    file = new MpqFile(this, blockEntry, name);

                this.files[name] = file;
            }
        }
        
        return files[name];
    },

    /**
     * @method
     * @desc Get an array of strings, populated by all of the file names in this archive.
     *       Note that this assumes this archive has a listfile, which is not always true.
     *       If there is no listfile, an empty array will be returned.
     * @returns {string[]}
     */
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

mix(MpqArchive.prototype, GenericFile.prototype);
