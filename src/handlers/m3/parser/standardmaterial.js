import M3ParserReference from "./reference";
import { M3ParserFloat32AnimationReference, M3ParserUint32AnimationReference } from "./animationreference";

/**
 * @constructor
 * @param {M3ParserBinaryReader} reader
 * @param {number} version
 * @param {Array<M3ParserIndexEntry>} index
 */
function M3ParserStandardMaterial(reader, version, index) {
    /** @member {number} */
    this.version = version;
    /** @member {M3ParserReference} */
    this.name = new M3ParserReference(reader, index);
    /** @member {number} */
    this.additionalFlags = reader.readUint32();
    /** @member {number} */
    this.flags = reader.readUint32();
    /** @member {number} */
    this.blendMode = reader.readUint32();
    /** @member {number} */
    this.priority = reader.readInt32();
    /** @member {number} */
    this.usedRTTChannels = reader.readUint32();
    /** @member {number} */
    this.specularity = reader.readFloat32();
    /** @member {number} */
    this.depthBlendFalloff = reader.readFloat32();
    /** @member {number} */
    this.cutoutThreshold = reader.readUint8();
    /** @member {number} */
    this.unknown1 = reader.readUint8(); // ?
    /** @member {number} */
    this.unknown2 = reader.readUint8(); // ?
    /** @member {number} */
    this.unknown3 = reader.readUint8(); // ?
    /** @member {number} */
    this.specMult = reader.readFloat32();
    /** @member {number} */
    this.emisMult = reader.readFloat32();
    /** @member {M3ParserReference} */
    this.diffuseLayer = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.decalLayer = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.specularLayer = new M3ParserReference(reader, index);

    if (version > 15) {
        /** @member {?M3ParserReference} */
        this.glossLayer = new M3ParserReference(reader, index);
    }

    /** @member {M3ParserReference} */
    this.emissiveLayer = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.emissive2Layer = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.evioLayer = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.evioMaskLayer = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.alphaMaskLayer = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.alphaMask2Layer = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.normalLayer = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.heightLayer = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.lightMapLayer = new M3ParserReference(reader, index);
    /** @member {M3ParserReference} */
    this.ambientOcclusionLayer = new M3ParserReference(reader, index);

    if (version > 18) {
        /** @member {?M3ParserReference} */
        this.unknown4 = new M3ParserReference(reader, index) // Unknown layer
        /** @member {?M3ParserReference} */
        this.unknown5 = new M3ParserReference(reader, index) // Unknown layer
        /** @member {?M3ParserReference} */
        this.unknown6 = new M3ParserReference(reader, index) // Unknown layer
        /** @member {?M3ParserReference} */
        this.unknown7 = new M3ParserReference(reader, index) // Unknown layer
    }

    /** @member {number} */
    this.unknown8 = reader.readUint32(); // ?
    /** @member {number} */
    this.layerBlendType = reader.readUint32();
    /** @member {number} */
    this.emisBlendType = reader.readUint32();
    /** @member {number} */
    this.emisMode = reader.readUint32();
    /** @member {number} */
    this.specType = reader.readUint32();

    /** @member {M3ParserFloat32AnimationReference} */
    this.unknown9 = new M3ParserFloat32AnimationReference(reader); // ?
    /** @member {M3ParserUint32AnimationReference} */
    this.unknown10 = new M3ParserUint32AnimationReference(reader); // ?

    if (version > 18) {
        /** @member {?} */
        this.unknown11 = reader.read(12); // ?
    }
}

export default M3ParserStandardMaterial;
