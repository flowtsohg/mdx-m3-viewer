import BinaryStream from '../../common/binarystream';
import UnsupportedChunk from './unsupportedchunk';
import VersionChunk from './versionchunk';
import ModelChunk from './modelchunk';
import GenericKnownChunk from './genericknownchunk';
import GenericUnknownChunk from './genericunknownchunk';

let tagToFunc = {
    VERS: VersionChunk,
    MODL: ModelChunk,
    SEQS: GenericKnownChunk,
    GLBS: GenericKnownChunk,
    TEXS: GenericKnownChunk,
    SNDS: GenericKnownChunk,
    MTLS: GenericUnknownChunk,
    TXAN: GenericUnknownChunk,
    GEOS: GenericUnknownChunk,
    GEOA: GenericUnknownChunk,
    BONE: GenericUnknownChunk,
    LITE: GenericUnknownChunk,
    HELP: GenericUnknownChunk,
    ATCH: GenericUnknownChunk,
    PIVT: GenericKnownChunk,
    PREM: GenericUnknownChunk,
    PRE2: GenericUnknownChunk,
    RIBB: GenericUnknownChunk,
    EVTS: GenericUnknownChunk,
    CAMS: GenericUnknownChunk,
    CLID: GenericUnknownChunk
};

/**
 * @constructor
 * @param {ArrayBuffer} src
 */
function Model(src) {
    let reader = new BinaryStream(src);

    /** @member {Map<string, ?>} */
    this.chunks = new Map();
    /** @member {Array<Node>} */
    this.nodes = [];

    if (reader.read(4) === 'MDLX') {
        while (reader.remaining() > 0) {
            let tag = reader.read(4),
                size = reader.readUint32(),
                constructor = tagToFunc[tag];

            if (constructor) {
                this.chunks.set(tag, new constructor(reader, tag, size, this.nodes));
            } else {
                console.warn('MdxModel: Unsupported tag - ' + tag);
                this.chunks.set(tag, new UnsupportedChunk(reader.substream(size), tag, size, this.nodes));
                reader.skip(size);
            }
        }
    } else {
        throw new Error('WrongMagicNumber');
    }
}

export default Model;
