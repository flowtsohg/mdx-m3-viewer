/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 */
function M3ParserPixelAnimationReference(reader) {
    this.interpolationType = reader.readUint16();
    this.animFlags = reader.readUint16();
    this.animId = reader.readUint32();
    this.initValue = reader.readUint8Array(4);
    this.nullValue = reader.readUint8Array(4);
    reader.skip(4); // ?
}

/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 */
function M3ParserUint16AnimationReference(reader) {
    this.interpolationType = reader.readUint16();
    this.animFlags = reader.readUint16();
    this.animId = reader.readUint32();
    this.initValue = reader.readUint16();
    this.nullValue = reader.readUint16();
    reader.skip(4); // ?
}

/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 */
function M3ParserUint32AnimationReference(reader) {
    this.interpolationType = reader.readUint16();
    this.animFlags = reader.readUint16();
    this.animId = reader.readUint32();
    this.initValue = reader.readUint32();
    this.nullValue = reader.readUint32();
    reader.skip(4); // ?
}

/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 */
function M3ParserFloat32AnimationReference(reader) {
    this.interpolationType = reader.readUint16();
    this.animFlags = reader.readUint16();
    this.animId = reader.readUint32();
    this.initValue = reader.readFloat32();
    this.nullValue = reader.readFloat32();
    reader.skip(4); // ?
}

/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 */
function M3ParserVector2AnimationReference(reader) {
    this.interpolationType = reader.readUint16();
    this.animFlags = reader.readUint16();
    this.animId = reader.readUint32();
    this.initValue = reader.readFloat32Array(2);
    this.nullValue = reader.readFloat32Array(2);
    reader.skip(4); // ?
}

/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 */
function M3ParserVector3AnimationReference(reader) {
    this.interpolationType = reader.readUint16();
    this.animFlags = reader.readUint16();
    this.animId = reader.readUint32();
    this.initValue = reader.readFloat32Array(3);
    this.nullValue = reader.readFloat32Array(3);
    reader.skip(4); // ?
}

/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 */
function M3ParserVector4AnimationReference(reader) {
    this.interpolationType = reader.readUint16();
    this.animFlags = reader.readUint16();
    this.animId = reader.readUint32();
    this.initValue = reader.readFloat32Array(4);
    this.nullValue = reader.readFloat32Array(4);
    reader.skip(4); // ?
}
