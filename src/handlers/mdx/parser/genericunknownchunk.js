import { readUnknownElements } from './common';
import MdxParserMaterial from './material';
import MdxParserTextureAnimation from './textureanimation';
import MdxParserGeoset from './geoset';
import MdxParserGeosetAnimation from './geosetanimation';
import MdxParserBone from './bone';
import MdxParserLight from './light';
import MdxParserHelper from './helper';
import MdxParserAttachment from './attachment';
import MdxParserParticleEmitter from './particleemitter';
import MdxParserParticle2Emitter from './particle2emitter';
import MdxParserRibbonEmitter from './ribbonemitter';
import MdxParserEventObject from './eventobject';
import MdxParserCamera from './camera';
import MdxParserCollisionShape from './collisionshape';

let tagToChunk = {
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

/**
 * @constructor
 * @param BinaryReader} reader
 * @param {string} tag
 * @param {number} size
 * @param {Array<MdxParserNode>} nodes
 */
function MdxParserGenericUnknownChunk(reader, tag, size, nodes) {
    /** @member {Array<?>} */
    this.elements = readUnknownElements(reader, size, tagToChunk[tag], nodes);
}

export default MdxParserGenericUnknownChunk;
