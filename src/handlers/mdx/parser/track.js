/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {number} interpolationType
 */
function MdxParserUintTrack(reader, interpolationType) {
    /** @member {number} */
    this.frame = reader.readInt32();
    /** @member {number} */
    this.value = reader.readUint32();

    if (interpolationType > 1) {
        /** @member {number} */
        this.inTan = reader.readUint32();
        /** @member {number} */
        this.outTan = reader.readUint32();
    }
}

/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {number} interpolationType
 */
function MdxParserFloatTrack(reader, interpolationType) {
    /** @member {number} */
    this.frame = reader.readInt32();
    /** @member {number} */
    this.value = reader.readFloat32();

    if (interpolationType > 1) {
        /** @member {number} */
        this.inTan = reader.readFloat32();
        /** @member {number} */
        this.outTan = reader.readFloat32();
    }
}

/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {number} interpolationType
 */
function MdxParserVector3Track(reader, interpolationType) {
    /** @member {number} */
    this.frame = reader.readInt32();
    /** @member {Float32Array} */
    this.value = reader.readFloat32Array(3);

    if (interpolationType > 1) {
        /** @member {Float32Array} */
        this.inTan = reader.readFloat32Array(3);
        /** @member {Float32Array} */
        this.outTan = reader.readFloat32Array(3);
    }
}

/**
 * @constructor
 * @param {MdxParserBinaryReader} reader
 * @param {number} interpolationType
 */
function MdxParserVector4Track(reader, interpolationType) {
    /** @member {number} */
    this.frame = reader.readInt32();
    /** @member {Float32Array} */
    this.value = reader.readFloat32Array(4);

    if (interpolationType > 1) {
        /** @member {Float32Array} */
        this.inTan = reader.readFloat32Array(4);
        /** @member {Float32Array} */
        this.outTan = reader.readFloat32Array(4);
    }
}

export {
    MdxParserUintTrack,
    MdxParserFloatTrack,
    MdxParserVector3Track,
    MdxParserVector4Track
}
