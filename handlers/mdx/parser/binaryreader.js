/**
 * @constructor
 */
function MdxParserBinaryReader(buffer, byteOffset, byteLength) {
    BinaryReader.call(this, buffer, byteOffset, byteLength);
}

MdxParserBinaryReader.prototype = {
    // Read elements with unknown sizes
    readUnknownElements(size, constructor, nodes) {
        var totalSize = 0,
            elements = [],
            element;
        
        while (totalSize !== size) {
            element = new constructor(this, nodes, elements.length);

            totalSize += element.size;

            elements.push(element);
        }

        return elements;
    },

    // Read elements with known sizes
    readKnownElements(count, constructor) {
        var elements = [];

        for (var i = 0; i < count; i++) {
            elements[i] = new constructor(this, i);
        }

        return elements;
    },

    // Read a node, and also push it to the nodes array
    readNode(nodes, object) {
        var node = new MdxParserNode(this, nodes.length, object);

        nodes.push(node);

        return node;
    }
};

mix(MdxParserBinaryReader.prototype, BinaryReader.prototype);
