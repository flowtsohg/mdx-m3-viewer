/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserIndexEntry(reader, index) {
    let tag = reader.read(4).reverse(),
        offset = reader.readUint32(),
        entriesCount = reader.readUint32(),
        version = reader.readUint32();

    this.index = index;
    this.tag = tag;
    this.offset = offset;
    this.version = version;
    this.entries = null;

    let mapping = M3ParserIndexEntry.tagMapping[tag],
        readerOffset = reader.tell();

    reader.seek(offset);

    // This is an object
    if (mapping) {
        let constructor = mapping[0],
            entrySize = mapping[1][version];

        if (!entrySize) {
            // Yey found a new version!
            throw new Error("M3Parser: Unsupported object version - tag " + tag + " and version " + version);
        }

        this.entries = [];

        for (let i = 0, l = entriesCount; i < l; i++) {
            // A sub reader is given for each object constructor.
            // This allows for parsing to work consistently, even if we don't quite know exactly how the structures look.
            // If some bytes aren't read, the error will not carry to the next object.
            // Since new versions of objects usually add data to the end, this allows the parser to work, even if trying to load newer versions.
            // Of course, the new version size needs to be added to M3ParserIndexEntry.tagMapping below, when finding one.
            this.entries[i] = new constructor(reader.subreader(entrySize), version, index);

            reader.skip(entrySize);
        }
    // This is maybe a typed array?
    } else {
        switch (tag) {
            case "CHAR":
            case "SCHR":
                this.entries = reader.readCharArray(entriesCount);
                break;

            case "U8__":
                this.entries = reader.readUint8Array(entriesCount);
                break;

            case "U16_":
                this.entries = reader.readUint16Array(entriesCount);
                break;

            case "U32_":
                this.entries = reader.readUint32Array(entriesCount);
                break;

            case "I32_":
                this.entries = reader.readInt32Array(entriesCount);
                break;

            case "REAL":
                this.entries = reader.readFloat32Array(entriesCount);
                break;

            case "VEC2":
                this.entries = reader.readFloat32Matrix(entriesCount, 2);
                break;

            case "VEC3":
            case "SVC3":
                this.entries = reader.readFloat32Matrix(entriesCount, 3);
                break;

            case "VEC4":
            case "QUAT":
                this.entries = reader.readFloat32Matrix(entriesCount, 4);
                break;

            case "IREF":
                this.entries = reader.readFloat32Matrix(entriesCount, 16);
                break;

            // Yey found a new tag!
            default:
                throw new Error("M3Parser: Unsupported object tag - tag " + tag + " and version " + version);
        }
    }

    reader.seek(readerOffset);
}

// Mapping from entry tags, to their constructors and known version->size values.
M3ParserIndexEntry.tagMapping = {
    // Objects
    MD34: [M3ParserMd34, { 11: 24 }],
    MODL: [M3ParserModel, { 23: 784, 25: 808, 26: 820, 28: 844, 29: 856 }],
    SEQS: [M3ParserSequence, { 1: 96, 2: 92 }],
    STC_: [M3ParserStc, { 4: 204 }],
    STG_: [M3ParserStg, { 0: 24 }],
    STS_: [M3ParserSts, { 0: 28 }],
    BONE: [M3ParserBone, { 1: 160 }],
    DIV_: [M3ParserDivision, { 2: 52 }],
    REGN: [M3ParserRegion, { 3: 36, 4: 40, 5: 48 }],
    BAT_: [M3ParserBatch, { 1: 14 }],
    MATM: [M3ParserMaterialReference, { 0: 8 }],
    MAT_: [M3ParserStandardMaterial, { 15: 268, 16: 280, 17: 280, 18: 280, 19: 340 }],
    LAYR: [M3ParserLayer, { 22: 356, 24: 436, 25: 468, 26: 464 }],
    EVNT: [M3ParserEvent, { 0: 96, 1: 104, 2: 108 }],
    BNDS: [M3ParserBoundingSphere, { 0: 28 }],
    ATT_: [M3ParserAttachmentPoint, { 1: 20 }],
    CAM_: [M3ParserCamera, { 3: 180, 5: 264 }],
    SDEV: [M3ParserSd, { 0: 32 }],
    SDU6: [M3ParserSd, { 0: 32 }],
    SDFG: [M3ParserSd, { 0: 32 }],
    SDS6: [M3ParserSd, { 0: 32 }],
    SDR3: [M3ParserSd, { 0: 32 }],
    SD2V: [M3ParserSd, { 0: 32 }],
    SD3V: [M3ParserSd, { 0: 32 }],
    SD4Q: [M3ParserSd, { 0: 32 }],
    SDCC: [M3ParserSd, { 0: 32 }],
    SDMB: [M3ParserSd, { 0: 32 }],
    FLAG: [M3ParserSd, { 0: 32 }],
    // Unsupported entries
    MSEC: [M3ParserUnsupportedEntry, { 1: 72 }],
    LITE: [M3ParserUnsupportedEntry, { 7: 212 }],
    ATVL: [M3ParserUnsupportedEntry, { 0: 116 }],
    PATU: [M3ParserUnsupportedEntry, { 4: 152 }],
    TRGD: [M3ParserUnsupportedEntry, { 0: 24 }],
    DIS_: [M3ParserUnsupportedEntry, { 4: 68 }],
    CMS_: [M3ParserUnsupportedEntry, { 0: 24 }],
    CMP_: [M3ParserUnsupportedEntry, { 2: 28 }],
    TER_: [M3ParserUnsupportedEntry, { 0: 24, 1: 28 }],
    VOL_: [M3ParserUnsupportedEntry, { 0: 84 }],
    VON_: [M3ParserUnsupportedEntry, { 0: 268 }],
    CREP: [M3ParserUnsupportedEntry, { 0: 24, 1: 28 }],
    STBM: [M3ParserUnsupportedEntry, { 0: 48 }],
    LFSB: [M3ParserUnsupportedEntry, { 2: 56 }],
    LFLR: [M3ParserUnsupportedEntry, { 2: 80, 3: 152 }],
    PAR_: [M3ParserUnsupportedEntry, { 12: 1316, 17: 1460, 18: 1464, 19: 1464, 21: 1464, 22: 1484, 23: 1492, 24: 1496 }],
    PARC: [M3ParserUnsupportedEntry, { 0: 40 }],
    PROJ: [M3ParserUnsupportedEntry, { 4: 388, 5: 382 }],
    PHYJ: [M3ParserUnsupportedEntry, { 0: 180 }],
    PHCC: [M3ParserUnsupportedEntry, { 0: 76 }],
    PHAC: [M3ParserUnsupportedEntry, { 0: 32 }],
    PHCL: [M3ParserUnsupportedEntry, { 2: 128 }],
    FOR_: [M3ParserUnsupportedEntry, { 1: 104, 2: 104 }],
    DMSE: [M3ParserUnsupportedEntry, { 0: 4 }],
    PHSH: [M3ParserUnsupportedEntry, { 1: 132, 3: 300 }],
    PHRB: [M3ParserUnsupportedEntry, { 2: 104, 4: 80 }],
    SSGS: [M3ParserUnsupportedEntry, { 1: 108 }],
    BBSC: [M3ParserUnsupportedEntry, { 0: 48 }],
    SRIB: [M3ParserUnsupportedEntry, { 0: 272 }],
    RIB_: [M3ParserUnsupportedEntry, { 6: 748, 8: 756, 9: 760 }],
    IKJT: [M3ParserUnsupportedEntry, { 0: 32 }],
    SHBX: [M3ParserUnsupportedEntry, { 0: 64 }],
    WRP_: [M3ParserUnsupportedEntry, { 1: 132 }]
};
