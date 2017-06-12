/**
 * @constructor
 */
function MdxParserGenericUnknownChunk(reader, tag, size, nodes) {
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
    PRE2: MdxParserParticleEmitter2,
    RIBB: MdxParserRibbonEmitter,
    EVTS: MdxParserEventObject,
    CAMS: MdxParserCamera,
    CLID: MdxParserCollisionShape
};
