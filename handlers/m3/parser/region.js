/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserRegion(reader, version, index) {
    /** @member {number} */
    this.version = version;
    /** @member {number} */
    this.unknown0 = reader.readUint32();
    /** @member {number} */
    this.unknown1 = reader.readUint32();
    /** @member {number} */
    this.firstVertexIndex = reader.readUint32();
    /** @member {number} */
    this.verticesCount = reader.readUint32();
    /** @member {number} */
    this.firstTriangleIndex = reader.readUint32();
    /** @member {number} */
    this.triangleIndicesCount = reader.readUint32();
    /** @member {number} */
    this.bonesCount = reader.readUint16();
    /** @member {number} */
    this.firstBoneLookupIndex = reader.readUint16();
    /** @member {number} */
    this.boneLookupIndicesCount = reader.readUint16();
    /** @member {number} */
    this.unknown2 = reader.readUint16();
    /** @member {number} */
    this.boneWeightPairsCount = reader.readUint8();
    /** @member {number} */
    this.unknown3 = reader.readUint8();
    /** @member {number} */
    this.rootBoneIndex = reader.readUint16();

    if (version > 3) {
        /** @member {?} */
        this.unknown4 = reader.readUint32();
    }

    if (version > 4) {
        /** @member {?} */
        this.unknown5 = reader.read(8);
    }
}
