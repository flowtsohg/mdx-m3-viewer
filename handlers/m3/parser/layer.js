/**
 * @constructor
 */
function M3ParserLayer(reader, version, index) {
    this.version = version;
    this.unknown0 = reader.readUint32();
    this.imagePath = new M3ParserReference(reader, index);
    this.color = new M3ParserPixelAnimationReference(reader);
    this.flags = reader.readUint32();
    this.uvSource = reader.readUint32();
    this.colorChannelSetting = reader.readUint32();
    this.brightMult = new M3ParserFloat32AnimationReference(reader);
    this.midtoneOffset = new M3ParserFloat32AnimationReference(reader);
    this.unknown1 = reader.readUint32();

    if (version > 23) {
        this.noiseAmp = reader.readFloat32();
        this.noiseFreq = reader.readFloat32();
    }

    this.rttChannel = reader.readInt32();
    this.videoFrameRate = reader.readUint32();
    this.videoStartFrame = reader.readUint32();
    this.videoEndFrame = reader.readInt32();
    this.videoMode = reader.readUint32();
    this.videoSyncTiming = reader.readUint32();
    this.videoPlay = new M3ParserUint32AnimationReference(reader);
    this.videoRestart = new M3ParserUint32AnimationReference(reader);
    this.flipBookRows = reader.readUint32();
    this.flipBookColumns = reader.readUint32();
    this.flipBookFrame = new M3ParserUint16AnimationReference(reader);
    this.uvOffset = new M3ParserVector2AnimationReference(reader);
    this.uvAngle = new M3ParserVector3AnimationReference(reader);
    this.uvTiling = new M3ParserVector2AnimationReference(reader);
    this.unknown2 = new M3ParserUint32AnimationReference(reader);
    this.unknown3 = new M3ParserFloat32AnimationReference(reader);
    this.brightness = new M3ParserFloat32AnimationReference(reader);

    if (version > 23) {
        this.triPlanarOffset = new M3ParserVector3AnimationReference(reader, readVector3);
        this.triPlanarScale = new M3ParserVector3AnimationReference(reader, readVector3);
    }

    this.unknown4 = reader.readInt32();
    this.fresnelType = reader.readUint32();
    this.fresnelExponent = reader.readFloat32();
    this.fresnelMin = reader.readFloat32();
    this.fresnelMaxOffset = reader.readFloat32();
    this.unknown5 = reader.readFloat32();

    if (version > 24) {
        this.unknown6 = reader.read(8);
        this.fresnelInvertedMaskX = reader.readFloat32();
        this.fresnelInvertedMaskY = reader.readFloat32();
        this.fresnelInvertedMaskZ = reader.readFloat32();
        this.fresnelRotationYaw = reader.readFloat32();
        this.fresnelRotationPitch = reader.readFloat32();
        this.unknown7 = reader.readUint32();
    }
}
