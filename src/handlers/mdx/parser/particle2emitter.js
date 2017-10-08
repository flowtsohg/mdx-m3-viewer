import { readNode } from './common';
import MdxParserSDContainer from './sd';

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {Array<MdxParserNode>} nodes
 * @param {number} index
 */
function MdxParserParticle2Emitter(reader, nodes, index) {
    this.index = index;
    /** @member {number} */
    this.size = reader.readUint32();
    /** @member {MdxParserNode} */
    this.node = readNode(reader, nodes, this);
    /** @member {number} */
    this.speed = reader.readFloat32();
    /** @member {number} */
    this.variation = reader.readFloat32();
    /** @member {number} */
    this.latitude = reader.readFloat32();
    /** @member {number} */
    this.gravity = reader.readFloat32();
    /** @member {number} */
    this.lifespan = reader.readFloat32();
    /** @member {number} */
    this.emissionRate = reader.readFloat32();
    /** @member {number} */
    this.width = reader.readFloat32();
    /** @member {number} */
    this.length = reader.readFloat32();
    /** @member {number} */
    this.filterMode = reader.readUint32();
    /** @member {number} */
    this.rows = reader.readUint32();
    /** @member {number} */
    this.columns = reader.readUint32();
    /** @member {number} */
    this.headOrTail = reader.readUint32();
    /** @member {number} */
    this.tailLength = reader.readFloat32();
    /** @member {number} */
    this.timeMiddle = reader.readFloat32();
    /** @member {Array<Float32Array>} */
    this.segmentColors = reader.readFloat32Matrix(3, 3);
    /** @member {Uint8Array} */
    this.segmentAlpha = reader.readUint8Array(3);
    /** @member {Float32Array} */
    this.segmentScaling = reader.readFloat32Array(3);
    /** @member {Uint32Array} */
    this.headInterval = reader.readUint32Array(3);
    /** @member {Uint32Array} */
    this.headDecayInterval = reader.readUint32Array(3);
    /** @member {Uint32Array} */
    this.tailInterval = reader.readUint32Array(3);
    /** @member {Uint32Array} */
    this.tailDecayInterval = reader.readUint32Array(3);
    /** @member {number} */
    this.textureId = reader.readUint32();
    /** @member {number} */
    this.squirt = reader.readUint32();
    /** @member {number} */
    this.priorityPlane = reader.readUint32();
    /** @member {number} */
    this.replaceableId = reader.readUint32();
    /** @member {MdxParserSDContainer} */
    this.tracks = new MdxParserSDContainer(reader, this.size - this.node.size - 175);
}

export default MdxParserParticle2Emitter;
