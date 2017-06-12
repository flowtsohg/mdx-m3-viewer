/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {number} interpolationType
 */
function MdxParserUintTrack(reader, interpolationType) {
    this.frame = reader.readInt32();
    this.value = reader.readUint32();

    if (interpolationType > 1) {
        this.inTan = reader.readUint32();
        this.outTan = reader.readUint32();
    }
}

/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {number} interpolationType
 */
function MdxParserFloatTrack(reader, interpolationType) {
    this.frame = reader.readInt32();
    this.value = reader.readFloat32();

    if (interpolationType > 1) {
        this.inTan = reader.readFloat32();
        this.outTan = reader.readFloat32();
    }
}

/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {number} interpolationType
 */
function MdxParserVector3Track(reader, interpolationType) {
    this.frame = reader.readInt32();
    this.value = reader.readFloat32Array(3);

    if (interpolationType > 1) {
        this.inTan = reader.readFloat32Array(3);
        this.outTan = reader.readFloat32Array(3);
    }
}

/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {number} interpolationType
 */
function MdxParserVector4Track(reader, interpolationType) {
    this.frame = reader.readInt32();
    this.value = reader.readFloat32Array(4);

    if (interpolationType > 1) {
        this.inTan = reader.readFloat32Array(4);
        this.outTan = reader.readFloat32Array(4);
    }
}
