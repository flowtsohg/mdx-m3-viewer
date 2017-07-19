import MdxParserSequence from "./sequence";
import MdxParserGlobalSequence from "./globalsequence";
import MdxParserTexture from "./texture";
import MdxParserSoundTrack from "./soundtrack";
import MdxParserPivotPoint from "./pivotpoint";


let tagToChunk = {
    SEQS: [MdxParserSequence, 132],
    GLBS: [MdxParserGlobalSequence, 4],
    TEXS: [MdxParserTexture, 268],
    SNDS: [MdxParserSoundTrack, 272],
    PIVT: [MdxParserPivotPoint, 12]
};

/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {string} tag
 * @param {number} size
 * @param {Array<MdxParserNode>} nodes
 */
function MdxParserGenericKnownChunk(reader, tag, size, nodes) {
    var tagInfo = tagToChunk[tag];

    /** @member {Array<?>} */
    this.elements = reader.readKnownElements(size / tagInfo[1], tagInfo[0]);

}

export default MdxParserGenericKnownChunk;
