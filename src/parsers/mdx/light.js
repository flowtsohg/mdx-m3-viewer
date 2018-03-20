import { readNode } from './common';
import MdxParserSDContainer from './sd';

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {Array<MdxParserNode>} nodes
 */
function MdxParserLight(reader, nodes) {
    /** @member {number} */
    this.size = reader.readUint32();
    /** @member {MdxParserNode} */
    this.node = readNode(reader, nodes, this);
    /** @member {number} */
    this.type = reader.readUint32();
    /** @member {Float32Array} */
    this.attenuation = reader.readFloat32Array(2);
    /** @member {Float32Array} */
    this.color = reader.readFloat32Array(3);
    /** @member {number} */
    this.intensity = reader.readFloat32();
    /** @member {Float32Array} */
    this.ambientColor = reader.readFloat32Array(3);
    /** @member {number} */
    this.ambientIntensity = reader.readFloat32();
    /** @member {MdxParserSDContainer} */
    this.tracks = new MdxParserSDContainer(reader, this.size - this.node.size - 48);
}

export default MdxParserLight;
