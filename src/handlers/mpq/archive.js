import mix from "../../mix";
import ViewerFile from "../../file";
import BinaryReader from "../../binaryreader";
import MpqCrypto from "./crypto";
import MpqHashTable from "./hashtable";
import MpqBlockTable from "./blocktable";
import MpqFile from "./file";

/**
 * @constructor
 * @augments ViewerFile
 * @memberOf Mpq
 * @param {ModelViewer} env
 * @param {function(?)} pathSolver
 * @param {Handler} handler
 * @param {string} extension
 */
function MpqArchive(env, pathSolver, handler, extension) {
    ViewerFile.call(this, env, pathSolver, handler, extension);

    /** @member {?ArrayBuffer} */
    this.buffer = null;
    /** @member {?MpqCrypto} */
    this.c = null;
    /** @member {?MpqHashTable} */
    this.hashTable = null;
    /** @member {?MpqBlockTable} */
    this.blockTable = null;
}

MpqArchive.prototype = {
    initialize(src) {
        let reader = new BinaryReader(src);

        let headerOffset = this.searchHeader(reader);

        if (headerOffset === -1) {
            this.onerror("InvalidSource", "HeaderNotFound");
            return false;
        }

        this.buffer = src.slice(headerOffset);

        if (headerOffset > -1) {
            this.readHeader(reader);

            // Only version 0 is supported, but apparently some maps fake their version, since WC3 ignores it, so ignore it too
            //if (this.formatVersion === 0) {
            this.c = new MpqCrypto();

            this.hashTable = new MpqHashTable(this.buffer.slice(this.hashPos, this.hashPos + this.hashSize * 16), this.c);

            this.blockTable = new MpqBlockTable(this.buffer.slice(this.blockPos, this.blockPos + this.blockSize * 16), this.c);

            this.files = new Map();
            //}
        }

        return true;
    },

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
        let files = this.files;

        if (!files.has(name)) {
            let blockIndex = this.hashTable.getBlockIndexOfFile(name);

            if (blockIndex !== -1) {
                let blockEntry = this.blockTable.entries[blockIndex],
                    file = new MpqFile(this, blockEntry, name);

                files.set(name, file);
            }
        }
        
        return files.get(name);
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

mix(MpqArchive.prototype, ViewerFile.prototype);

export default MpqArchive;
