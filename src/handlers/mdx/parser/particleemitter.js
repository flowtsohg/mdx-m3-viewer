import { readNode } from './common';
import MdxParserSDContainer from './sd';

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {Array<MdxParserNode>} nodes
 * @param {number} index
 */
function MdxParserParticleEmitter(reader, nodes, index) {
    this.index = index;
    /** @member {number} */
    this.size = reader.readUint32();
    /** @member {MdxParserNode} */
    this.node = readNode(reader, nodes, this);
    /** @member {number} */
    this.emissionRate = reader.readFloat32();
    /** @member {number} */
    this.gravity = reader.readFloat32();
    /** @member {number} */
    this.longitude = reader.readFloat32();
    /** @member {number} */
    this.latitude = reader.readFloat32();
    /** @member {string} */
    this.path = reader.read(260);
    /** @member {number} */
    this.lifespan = reader.readFloat32();
    /** @member {number} */
    this.speed = reader.readFloat32();
    /** @member {MdxParserSDContainer} */
    this.tracks = new MdxParserSDContainer(reader, this.size - this.node.size - 288);
}

export default MdxParserParticleEmitter;
