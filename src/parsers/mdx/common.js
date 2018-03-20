import MdxParserNode from './node';

/**
 * Read an array of elements using the given constructor.
 * Every element's size isn't known before reading it.
 * 
 * @param {BinaryReader} reader
 * @param {number} size
 * @param {function(BinaryReader, Array<MdxParserNode>, number)} constructor
 * @param {Array<MdxParserNode>} nodes
 * @returns {Array<?>}
 */
function readUnknownElements(reader, size, constructor, nodes) {
    var totalSize = 0,
        elements = [],
        element;
    
    while (totalSize !== size) {
        element = new constructor(reader, nodes);

        totalSize += element.size;

        elements.push(element);
    }

    return elements;
}

/**
 * Read an array of elements using the given constructor.
 * 
 * @param {BinaryReader} reader
 * @param {number} count
 * @param {function(BinaryReader, number)} constructor
 * @returns {Array<?>}
 */
function readKnownElements(reader, count, constructor) {
    var elements = [];

    for (var i = 0; i < count; i++) {
        elements[i] = new constructor(reader);
    }

    return elements;
}

/**
* Read a node, and also add it to the nodes array.
* 
* @param {BinaryReader} reader
* @param {Array<MdxParserNode>} nodes
* @param {?} object
* @returns {MdxParserNode}
*/
function readNode(reader, nodes, object) {
    var node = new MdxParserNode(reader, nodes.length, object);

    nodes.push(node);

    return node;
}

export {
    readUnknownElements,
    readKnownElements,
    readNode
};
