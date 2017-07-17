/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {string} tag
 * @param {number} size
 * @param {Array<MdxParserNode>} nodes
 */
function MdxParserGenericUnknownChunk(reader, tag, size, nodes) {
    /** @member {Array<?>} */
    this.elements = reader.readUnknownElements(size, MdxParserGenericUnknownChunk.tagToChunk[tag], nodes);
}

MdxParserGenericUnknownChunk.tagToChunk = {
    MTLS: MdxParserMaterial,
    TXAN: MdxParserTextureAnimation,
    GEOS: MdxParserGeoset,
    GEOA: MdxParserGeosetAnimation,
    BONE: MdxParserBone,
    LITE: MdxParserLight,
    HELP: MdxParserHelper,
    ATCH: MdxParserAttachment,
    PREM: MdxParserParticleEmitter,
    PRE2: MdxParserParticle2Emitter,
    RIBB: MdxParserRibbonEmitter,
    EVTS: MdxParserEventObject,
    CAMS: MdxParserCamera,
    CLID: MdxParserCollisionShape
};
