import { M3ParserFloat32AnimationReference, M3ParserVector3AnimationReference } from "./animationreference";

/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserLight(reader, version, index) {
    /** @member {number} */
    this.version = version;
    /** @member {number} */
    this.type = reader.readUint8();
    /** @member {number} */
    this.unknown0 = reader.readUint8();
    /** @member {number} */
    this.bone = reader.readInt16();
    /** @member {number} */
    this.flags = reader.readUint32();
    /** @member {number} */
    this.unknown1 = reader.readUint32();
    /** @member {number} */
    this.unknown2 = reader.readInt32();
    /** @member {M3ParserVector3AnimationReference} */
    this.lightColor = new M3ParserVector3AnimationReference(reader);
    /** @member {M3ParserFloat32AnimationReference} */
    this.lightIntensity = new M3ParserFloat32AnimationReference(reader);
    /** @member {M3ParserVector3AnimationReference} */
    this.specularColor = new M3ParserVector3AnimationReference(reader);
    /** @member {M3ParserFloat32AnimationReference} */
    this.specularIntensity = new M3ParserFloat32AnimationReference(reader);
    /** @member {M3ParserFloat32AnimationReference} */
    this.attenuationFar = new M3ParserFloat32AnimationReference(reader);
    /** @member {number} */
    this.unknown3 = reader.readFloat32();
    /** @member {M3ParserFloat32AnimationReference} */
    this.attenuationNear = new M3ParserFloat32AnimationReference(reader);
    /** @member {M3ParserFloat32AnimationReference} */
    this.hotSpot = new M3ParserFloat32AnimationReference(reader);
    /** @member {M3ParserFloat32AnimationReference} */
    this.falloff = new M3ParserFloat32AnimationReference(reader);
}

export default M3ParserLight;
