/**
 * @constructor
 */
function M3ParserLight(reader, index, version) {
    this.version = version;
    this.type = reader.readUint8();
    this.unknown0 = reader.readUint8();
    this.bone = reader.readInt16();
    this.flags = reader.readUint32();
    this.unknown1 = reader.readUint32();
    this.unknown2 = reader.readInt32();
    this.lightColor = new M3ParserVector3AnimationReference(reader);
    this.lightIntensity = new M3ParserFloat32AnimationReference(reader);
    this.specularColor = new M3ParserVector3AnimationReference(reader);
    this.specularIntensity = new M3ParserFloat32AnimationReference(reader);
    this.attenuationFar = new M3ParserFloat32AnimationReference(reader);
    this.unknown3 = reader.readFloat32();
    this.attenuationNear = new M3ParserFloat32AnimationReference(reader);
    this.hotSpot = new M3ParserFloat32AnimationReference(reader);
    this.falloff = new M3ParserFloat32AnimationReference(reader);
}
