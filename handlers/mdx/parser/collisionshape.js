/**
 * @constructor
 */
function MdxParserCollisionShape(reader, nodes, index) {
    this.index = index;
    this.node = reader.readNode(nodes, this);
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

    this.vertices = vertices;

    if (type === 2 || type === 3) {
        this.radius = reader.readFloat32();
        size += 4;
    }

    this.size = size;
}
