/**
 * @constructor
 */
function MdxParser(src) {
    var reader = new MdxParserBinaryReader(src);

    this.chunks = {};
    this.nodes = [];

    if (reader.read(4) === "MDLX") {
        while (reader.remaining() > 0) {
            var tag = reader.read(4),
                size = reader.readUint32(),
                constructor = MdxParser.tagToFunc[tag];

            if (constructor) {
                this.chunks[tag] = new constructor(reader, tag, size, this.nodes);
            } else {
                console.warn("MdxParser: Unsupported tag - " + tag);
                this.chunks[tag] = new MdxParserUnsupportedChunk(reader.subreader(size));
                reader.skip(size);
            }
        }
    } else {
        throw new Error("WrongMagicNumber");
    }
}

MdxParser.tagToFunc = {
    VERS: MdxParserVersionChunk,
    MODL: MdxParserModelChunk,
    SEQS: MdxParserGenericKnownChunk,
    GLBS: MdxParserGenericKnownChunk,
    TEXS: MdxParserGenericKnownChunk,
    SNDS: MdxParserGenericKnownChunk,
    MTLS: MdxParserGenericUnknownChunk,
    TXAN: MdxParserGenericUnknownChunk,
    GEOS: MdxParserGenericUnknownChunk,
    GEOA: MdxParserGenericUnknownChunk,
    BONE: MdxParserGenericUnknownChunk,
    LITE: MdxParserGenericUnknownChunk,
    HELP: MdxParserGenericUnknownChunk,
    ATCH: MdxParserGenericUnknownChunk,
    PIVT: MdxParserGenericKnownChunk,
    PREM: MdxParserGenericUnknownChunk,
    PRE2: MdxParserGenericUnknownChunk,
    RIBB: MdxParserGenericUnknownChunk,
    EVTS: MdxParserGenericUnknownChunk,
    CAMS: MdxParserGenericUnknownChunk,
    CLID: MdxParserGenericUnknownChunk
};
