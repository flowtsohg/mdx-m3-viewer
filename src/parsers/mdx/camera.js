import MdxParserSDContainer from './sd';

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {Array<MdxParserNode>} nodes
 * @param {number} index
 */
function MdxParserCamera(reader, nodes, index) {
    this.index = index;
    /** @member {number} */
    this.size = reader.readUint32();
    /** @member {string} */
    this.name = reader.read(80);
    /** @member {Float32Array} */
    this.position = reader.readFloat32Array(3);
    /** @member {number} */
    this.fieldOfView = reader.readFloat32();
    /** @member {number} */
    this.farClippingPlane = reader.readFloat32();
    /** @member {number} */
    this.nearClippingPlane = reader.readFloat32();
    /** @member {Float32Array} */
    this.targetPosition = reader.readFloat32Array(3);
    /** @member {MdxParserSDContainer} */
    this.tracks = new MdxParserSDContainer(reader, this.size - 120);
}

export default MdxParserCamera;
