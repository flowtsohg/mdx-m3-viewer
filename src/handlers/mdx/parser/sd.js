import { readUnknownElements } from "./common";
import { MdxParserUintTrack, MdxParserFloatTrack, MdxParserVector3Track, MdxParserVector4Track } from "./track";

// Mapping from track tags to their type and default value
let tagToTrack = {
    // LAYS
    KMTF: [MdxParserUintTrack, 0],
    KMTA: [MdxParserFloatTrack, 1],
    // TXAN
    KTAT: [MdxParserVector3Track, new Float32Array([0, 0, 0])],
    KTAR: [MdxParserVector4Track, new Float32Array([0, 0, 0, 1])],
    KTAS: [MdxParserVector3Track, new Float32Array([1, 1, 1])],
    // GEOA
    KGAO: [MdxParserFloatTrack, 1],
    KGAC: [MdxParserVector3Track, new Float32Array([0, 0, 0])],
    // LITE
    KLAS: [MdxParserFloatTrack, 0],
    KLAE: [MdxParserFloatTrack, 0],
    KLAC: [MdxParserVector3Track, new Float32Array([0, 0, 0])],
    KLAI: [MdxParserFloatTrack, 0],
    KLBI: [MdxParserFloatTrack, 0],
    KLBC: [MdxParserVector3Track, new Float32Array([0, 0, 0])],
    KLAV: [MdxParserFloatTrack, 1],
    // ATCH
    KATV: [MdxParserFloatTrack, 1],
    // PREM
    KPEE: [MdxParserFloatTrack, 0],
    KPEG: [MdxParserFloatTrack, 0],
    KPLN: [MdxParserFloatTrack, 0],
    KPLT: [MdxParserFloatTrack, 0],
    KPEL: [MdxParserFloatTrack, 0],
    KPES: [MdxParserFloatTrack, 0],
    KPEV: [MdxParserFloatTrack, 1],
    // PRE2
    KP2S: [MdxParserFloatTrack, 0],
    KP2R: [MdxParserFloatTrack, 0],
    KP2L: [MdxParserFloatTrack, 0],
    KP2G: [MdxParserFloatTrack, 0],
    KP2E: [MdxParserFloatTrack, 0],
    KP2N: [MdxParserFloatTrack, 0],
    KP2W: [MdxParserFloatTrack, 0],
    KP2V: [MdxParserFloatTrack, 1],
    // RIBB
    KRHA: [MdxParserFloatTrack, 0],
    KRHB: [MdxParserFloatTrack, 0],
    KRAL: [MdxParserFloatTrack, 1],
    KRCO: [MdxParserVector3Track, new Float32Array([0, 0, 0])],
    KRTX: [MdxParserUintTrack, 0],
    KRVS: [MdxParserFloatTrack, 1],
    // CAMS
    KCTR: [MdxParserVector3Track, new Float32Array([0, 0, 0])],
    KTTR: [MdxParserVector3Track, new Float32Array([0, 0, 0])],
    KCRL: [MdxParserUintTrack, 0],
    // NODE
    KGTR: [MdxParserVector3Track, new Float32Array([0, 0, 0])],
    KGRT: [MdxParserVector4Track, new Float32Array([0, 0, 0, 1])],
    KGSC: [MdxParserVector3Track, new Float32Array([1, 1, 1])]
};

/**
 * @constructor
 * @param {BinaryReader} reader
 */
function MdxParserSD(reader) {
    var tag = reader.read(4),
        tracksCount = reader.readUint32(),
        interpolationType = reader.readUint32(),
        globalSequenceId = reader.readInt32(),
        sdTrackInfo = tagToTrack[tag],
        constructor = sdTrackInfo[0],
        defval = sdTrackInfo[1],
        elementsPerTrack = 1 + (defval.length ? defval.length : 1) * (interpolationType > 1 ? 3 : 1),
        tracks = [];

    for (var i = 0; i < tracksCount; i++) {
        tracks[i] = new constructor(reader, interpolationType)
    }

    /** @member {string} */
    this.tag = tag;
    /** @member {number} */
    this.interpolationType = interpolationType;
    /** @member {number} */
    this.globalSequenceId = globalSequenceId;
    /** @member {Array<?>} */
    this.tracks = tracks;
    /** @member {number|Float32Array} */
    this.defval = defval;
    /** @member {number} */
    this.size = 16 + tracksCount * elementsPerTrack * 4;
}

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {number} size
 */
function MdxParserSDContainer(reader, size) {
    /** @member {Array<MdxParserSD>} */
    this.elements = readUnknownElements(reader, size, MdxParserSD);
}

export default MdxParserSDContainer;
