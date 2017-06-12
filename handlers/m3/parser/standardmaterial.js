/**
 * @constructor
 */
function M3ParserStandardMaterial(reader, version, index) {
    this.version = version;
    this.name = new M3ParserReference(reader, index);
    this.additionalFlags = reader.readUint32();
    this.flags = reader.readUint32();
    this.blendMode = reader.readUint32();
    this.priority = reader.readInt32();
    this.usedRTTChannels = reader.readUint32();
    this.specularity = reader.readFloat32();
    this.depthBlendFalloff = reader.readFloat32();
    this.cutoutThreshold = reader.readUint8();
    this.unknown1 = reader.readUint8(); // ?
    this.unknown2 = reader.readUint8(); // ?
    this.unknown3 = reader.readUint8(); // ?
    this.specMult = reader.readFloat32();
    this.emisMult = reader.readFloat32();
    this.diffuseLayer = new M3ParserReference(reader, index);
    this.decalLayer = new M3ParserReference(reader, index);
    this.specularLayer = new M3ParserReference(reader, index);

    if (version > 15) {
        this.glossLayer = new M3ParserReference(reader, index);
    }

    this.emissiveLayer = new M3ParserReference(reader, index);
    this.emissive2Layer = new M3ParserReference(reader, index);
    this.evioLayer = new M3ParserReference(reader, index);
    this.evioMaskLayer = new M3ParserReference(reader, index);
    this.alphaMaskLayer = new M3ParserReference(reader, index);
    this.alphaMask2Layer = new M3ParserReference(reader, index);
    this.normalLayer = new M3ParserReference(reader, index);
    this.heightLayer = new M3ParserReference(reader, index);
    this.lightMapLayer = new M3ParserReference(reader, index);
    this.ambientOcclusionLayer = new M3ParserReference(reader, index);

    if (version > 18) {
        this.unknown4 = new M3ParserReference(reader, index) // Unknown layer
        this.unknown5 = new M3ParserReference(reader, index) // Unknown layer
        this.unknown6 = new M3ParserReference(reader, index) // Unknown layer
        this.unknown7 = new M3ParserReference(reader, index) // Unknown layer
    }

    this.unknown8 = reader.readUint32(); // ?
    this.layerBlendType = reader.readUint32();
    this.emisBlendType = reader.readUint32();
    this.emisMode = reader.readUint32();
    this.specType = reader.readUint32();

    this.unknown9 = new M3ParserFloat32AnimationReference(reader); // ?
    this.unknown10 = new M3ParserUint32AnimationReference(reader); // ?

    if (version > 18) {
        this.unknown11 = reader.read(12); // ?
    }
}
