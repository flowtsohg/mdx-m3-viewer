import MdxParserExtent from "./extent";

/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {Array<MdxParserNode>} nodes
 * @param {number} index
 */
function MdxParserGeoset(reader, nodes, index) {
    this.index = index;
    /** @member {number} */
    this.size = reader.readUint32();

    reader.skip(4); // VRTX

    /** @member {Float32Array} */
    this.vertices = reader.readFloat32Array(reader.readUint32() * 3);

    reader.skip(4); // NRMS

    /** @member {Float32Array} */
    this.normals = reader.readFloat32Array(reader.readUint32() * 3);

    reader.skip(4); // PTYP

    /** @member {Uint32Array} */
    this.faceTypeGroups = reader.readUint32Array(reader.readUint32());

    reader.skip(4); // PCNT

    /** @member {Uint32Array} */
    this.faceGroups = reader.readUint32Array(reader.readUint32());

    reader.skip(4); // PVTX

    /** @member {Uint16Array} */
    this.faces = reader.readUint16Array(reader.readUint32());

    reader.skip(4); // GNDX

    /** @member {Uint8Array} */
    this.vertexGroups = reader.readUint8Array(reader.readUint32());

    reader.skip(4); // MTGC

    /** @member {Uint32Array} */
    this.matrixGroups = reader.readUint32Array(reader.readUint32());

    reader.skip(4); // MATS

    /** @member {Uint32Array} */
    this.matrixIndices = reader.readUint32Array(reader.readUint32());

    /** @member {number} */
    this.materialId = reader.readUint32();
    /** @member {number} */
    this.selectionGroup = reader.readUint32();
    /** @member {number} */
    this.selectionFlags = reader.readUint32();
    /** @member {MdxParserExtent} */
    this.extent = new MdxParserExtent(reader);
    /** @member {Array<MdxParserExtent>} */
    this.extents = reader.readKnownElements(reader.readUint32(), MdxParserExtent);

    reader.skip(4); // UVAS

    /** @member {Array<Float32Array>} */
    this.textureCoordinateSets = [];

    for (var i = 0, l = reader.readUint32() ; i < l; i++) {
        reader.skip(4); // UVBS
        this.textureCoordinateSets[i] = reader.readFloat32Array(reader.readUint32() * 2);
    }
}

export default MdxParserGeoset;
