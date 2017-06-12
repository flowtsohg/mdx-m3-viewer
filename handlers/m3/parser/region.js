/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserRegion(reader, version, index) {
    this.unknown0 = reader.readUint32();
    this.unknown1 = reader.readUint32();
    this.firstVertexIndex = reader.readUint32();
    this.verticesCount = reader.readUint32();
    this.firstTriangleIndex = reader.readUint32();
    this.triangleIndicesCount = reader.readUint32();
    this.bonesCount = reader.readUint16();
    this.firstBoneLookupIndex = reader.readUint16();
    this.boneLookupIndicesCount = reader.readUint16();
    this.unknown2 = reader.readUint16();
    this.boneWeightPairsCount = reader.readUint8();
    this.unknown3 = reader.readUint8();
    this.rootBoneIndex = reader.readUint16();

    if (version > 3) {
        this.unknown4 = reader.readUint32();
    }

    if (version > 4) {
        this.unknown5 = reader.read(8);
    }
}
