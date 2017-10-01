import BinaryReader from "../../../binaryreader";

let BLOCK_TABLE_KEY = 0xEC83B3A3;

/**
 * @constructor
 * @param {BinaryReader} reader
 */
function MpqParserBlockTableEntry(reader) {
    /** @param {number} */
    this.filePos = reader.readUint32();
    /** @param {number} */
    this.compressedSize = reader.readUint32();
    /** @param {number} */
    this.normalSize = reader.readUint32();
    /** @param {number} */
    this.flags = reader.readUint32();
}

/**
 * @constructor
 * @param {ArrayBuffer} buffer
 * @param {MpqParserCrypto} c
 */
function MpqParserBlockTable(buffer, c) {
    let entries = [],
        reader = new BinaryReader(c.decryptBlock(buffer, BLOCK_TABLE_KEY)),
        hashSize = buffer.byteLength / 16;

    for (let i = 0, l = hashSize; i < l; i++) {
        entries.push(new MpqParserBlockTableEntry(reader));
    }

    /** @param {number} */
    this.hashSize = hashSize;
    /** @param {MpqParserCrypto} */
    this.c = c;
    /** @param {Array<MpqParserBlockTableEntry>} */
    this.entries = entries;
}

export default MpqParserBlockTable;
