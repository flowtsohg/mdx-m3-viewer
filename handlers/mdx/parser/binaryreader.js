/**
 * @constructor
 * @param {ArrayBuffer} buffer
 * @param {number=} byteOffset
 * @param {number=} byteLength
 */
function MdxParserBinaryReader(buffer, byteOffset, byteLength) {
    BinaryReader.call(this, buffer, byteOffset, byteLength);
}

MdxParserBinaryReader.prototype = {
    /**
     * @desc Read an array of elements using the given constructor.
     *       Every element's name isn't known before reading it
     * @param {number} size
     * @param {function(MdxParserBinaryReader, Array<MdxParserNode>, number)} constructor
     * @param {Array<MdxParserNode>} nodes
     * @returns {Array<*>}
     */
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

    /**
     * @desc Read an array of elements using the given constructor
     * @param {number} count
     * @param {function(MdxParserBinaryReader, number)} constructor
     * @returns {Array<*>}
     */
    readKnownElements(count, constructor) {
        var elements = [];

        for (var i = 0; i < count; i++) {
            elements[i] = new constructor(this, i);
        }

        return elements;
    },

    /**
    * @desc Read a node, and also add it to the nodes array
    * @param {Array<MdxParserNode>} nodes
    * @param {*} object
    * @returns {MdxParserNode}
    */
    readNode(nodes, object) {
        var node = new MdxParserNode(this, nodes.length, object);

        nodes.push(node);

        return node;
    }
};

mix(MdxParserBinaryReader.prototype, BinaryReader.prototype);
