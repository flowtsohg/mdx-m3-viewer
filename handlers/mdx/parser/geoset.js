/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {Array<MdxNode>} nodes
 * @param {number} index
 */
function MdxParserGeoset(reader, nodes, index) {
    this.index = index;
    this.size = reader.readUint32();

    reader.skip(4); // VRTX
    this.vertices = reader.readFloat32Array(reader.readUint32() * 3);

    reader.skip(4); // NRMS
    this.normals = reader.readFloat32Array(reader.readUint32() * 3);

    reader.skip(4); // PTYP
    this.faceTypeGroups = reader.readUint32Array(reader.readUint32());

    reader.skip(4); // PCNT
    this.faceGroups = reader.readUint32Array(reader.readUint32());

    reader.skip(4); // PVTX
    this.faces = reader.readUint16Array(reader.readUint32());

    reader.skip(4); // GNDX
    this.vertexGroups = reader.readUint8Array(reader.readUint32());

    reader.skip(4); // MTGC
    this.matrixGroups = reader.readUint32Array(reader.readUint32());

    reader.skip(4); // MATS
    this.matrixIndices = reader.readUint32Array(reader.readUint32());

    this.materialId = reader.readUint32();
    this.selectionGroup = reader.readUint32();
    this.selectionFlags = reader.readUint32();
    this.extent = new MdxParserExtent(reader);
    this.extents = reader.readKnownElements(reader.readUint32(), MdxParserExtent);

    reader.skip(4); // UVAS

    this.textureCoordinateSets = [];

    for (var i = 0, l = reader.readUint32() ; i < l; i++) {
        reader.skip(4); // UVBS
        this.textureCoordinateSets[i] = reader.readFloat32Array(reader.readUint32() * 2);
    }
}
