/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {Array<MdxParserNode>} nodes
 * @param {number} index
 */
function MdxParserCollisionShape(reader, nodes, index) {
    this.index = index;
    /** @member {MdxParserNode} */
    this.node = reader.readNode(nodes, this);
    /** @member {number} */
    this.type = reader.readUint32();

    var type = this.type,
        size = this.node.size + 4,
        vertices;

    if (type === 0 || type === 1 || type === 3) {
        vertices = reader.readFloat32Array(6);
        size += 24;
    } else if (type === 2) {
        vertices = reader.readFloat32Array(3);
        size += 12;
    }

    /** @member {Float32Array} */
    this.vertices = vertices;

    if (type === 2 || type === 3) {
        /** @member {number} */
        this.radius = reader.readFloat32();
        size += 4;
    }

    /** @member {number} */
    this.size = size;
}

export default MdxParserCollisionShape;
