import BinaryReader from "../../../binaryreader";
import MpqParserCrypto from "./crypto";
import MpqParserHashTable from "./hashtable";
import MpqParserBlockTable from "./blocktable";
import MpqParserFile from "./file";

/**
 * @constructor
 * @param {ArrayBuffer} src
 */
function MpqParserArchive(src) {
    let reader = new BinaryReader(src),
        headerOffset = this.searchHeader(reader);

    if (headerOffset === -1) {
        throw new Error("HeaderNotFound");
    }

    /** @member {ArrayBuffer} */
    this.buffer = src.slice(headerOffset);

    if (headerOffset > -1) {
        this.readHeader(reader);

        // Only version 0 is supported, but apparently some maps fake their version, since WC3 ignores it, so ignore it too
        //if (this.formatVersion === 0) {
        /** @member {MpqParserCrypto} */
        this.c = new MpqParserCrypto();

        /** @member {MpqParserHashTable} */
        this.hashTable = new MpqParserHashTable(this.buffer.slice(this.hashPos, this.hashPos + this.hashSize * 16), this.c);

        /** @member {MpqParserBlockTable} */
        this.blockTable = new MpqParserBlockTable(this.buffer.slice(this.blockPos, this.blockPos + this.blockSize * 16), this.c);

        /** @member {Map<string, MpqParserFile>} */
        this.fileCache = new Map();
        //}
    }
}

MpqParserArchive.prototype = {
    searchHeader(reader) {
        for (let i = 0, l = Math.floor(reader.byteLength / 512) ; i < l; i++) {
            reader.seek(i * 512)

            if (reader.peek(4) === "MPQ\x1A") {
                return reader.tell();
            }
        }

        return -1;
    },

    readHeader(reader) {
        reader.skip(4); // MPQ\x1A
        reader.skip(4); // Header size

        this.archiveSize = reader.readUint32();
        this.formatVersion = reader.readUint16();
        this.sectorSize = 512 * (1 << reader.readUint16());
        this.hashPos = reader.readUint32();
        this.blockPos = reader.readUint32();
        this.hashSize = reader.readUint32();
        this.blockSize = reader.readUint32();
    },

    /**
     * Checks if a file exists in this archive.
     * 
     * @param {string} name The file name to check
     * @returns {boolean}
     */
    hasFile(name) {
        return this.hashTable.getBlockIndexOfFile(name) !== -1;
    },

    /**
     * Extract a file from this archive.
     * Note that this is a lazy and cached operation. That is, files are only decoded from the archive on extraction, and the result is then cached.
     * Further requests to get the same file will get the cached result.
     * 
     * @param {string} name The file name to get
     * @returns {MpqFile}
     */
    getFile(name) {
        let fileCache = this.fileCache;

        if (!fileCache.has(name)) {
            let blockIndex = this.hashTable.getBlockIndexOfFile(name);

            if (blockIndex !== -1) {
                let blockEntry = this.blockTable.entries[blockIndex],
                    file = new MpqParserFile(this, blockEntry, name);

                fileCache.set(name, file);
            }
        }
        
        return fileCache.get(name);
    },

    /**
     * Get an array of strings, populated by all of the file names in this archive.
     * This is done by checking the archive's listfile, which does not always exist.
     * If there is no listfile, an empty array will be returned.
     * 
     * @returns {Array<string>}
     */
    getFileList() {
        if (this.hasFile("(listfile)")) {
            let file = this.getFile("(listfile)"),
                reader = new BinaryReader(file.buffer),
                data = reader.read();

            return data.trim().split("\r\n");
        }

        return [];
    }
};

export default MpqParserArchive;
