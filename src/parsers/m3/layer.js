import M3ParserReference from './reference';
import { M3ParserPixelAnimationReference, M3ParserUint16AnimationReference, M3ParserUint32AnimationReference, M3ParserFloat32AnimationReference, M3ParserVector2AnimationReference, M3ParserVector3AnimationReference } from './animationreference';

export default class M3ParserLayer {
    /**
     * @param {BinaryReader} reader
     * @param {number} version
     * @param {Array<M3ParserIndexEntry>} index
     */
    constructor(reader, version, index) {
        /** @member {number} */
        this.version = version;
        /** @member {number} */
        this.unknown0 = reader.readUint32();
        /** @member {M3ParserReference} */
        this.imagePath = new M3ParserReference(reader, index);
        /** @member {M3ParserPixelAnimationReference} */
        this.color = new M3ParserPixelAnimationReference(reader);
        /** @member {number} */
        this.flags = reader.readUint32();
        /** @member {number} */
        this.uvSource = reader.readUint32();
        /** @member {number} */
        this.colorChannelSetting = reader.readUint32();
        /** @member {M3ParserFloat32AnimationReference} */
        this.brightMult = new M3ParserFloat32AnimationReference(reader);
        /** @member {M3ParserFloat32AnimationReference} */
        this.midtoneOffset = new M3ParserFloat32AnimationReference(reader);
        /** @member {number} */
        this.unknown1 = reader.readUint32();

        if (version > 23) {
            /** @member {?number} */
            this.noiseAmp = reader.readFloat32();
            /** @member {?number} */
            this.noiseFreq = reader.readFloat32();
        }

        /** @member {number} */
        this.rttChannel = reader.readInt32();
        /** @member {number} */
        this.videoFrameRate = reader.readUint32();
        /** @member {number} */
        this.videoStartFrame = reader.readUint32();
        /** @member {number} */
        this.videoEndFrame = reader.readInt32();
        /** @member {number} */
        this.videoMode = reader.readUint32();
        /** @member {number} */
        this.videoSyncTiming = reader.readUint32();
        /** @member {M3ParserUint32AnimationReference} */
        this.videoPlay = new M3ParserUint32AnimationReference(reader);
        /** @member {M3ParserUint32AnimationReference} */
        this.videoRestart = new M3ParserUint32AnimationReference(reader);
        /** @member {number} */
        this.flipBookRows = reader.readUint32();
        /** @member {number} */
        this.flipBookColumns = reader.readUint32();
        /** @member {M3ParserUint16AnimationReference} */
        this.flipBookFrame = new M3ParserUint16AnimationReference(reader);
        /** @member {M3ParserVector2AnimationReference} */
        this.uvOffset = new M3ParserVector2AnimationReference(reader);
        /** @member {M3ParserVector3AnimationReference} */
        this.uvAngle = new M3ParserVector3AnimationReference(reader);
        /** @member {M3ParserVector2AnimationReference} */
        this.uvTiling = new M3ParserVector2AnimationReference(reader);
        /** @member {M3ParserUint32AnimationReference} */
        this.unknown2 = new M3ParserUint32AnimationReference(reader);
        /** @member {M3ParserFloat32AnimationReference} */
        this.unknown3 = new M3ParserFloat32AnimationReference(reader);
        /** @member {M3ParserFloat32AnimationReference} */
        this.brightness = new M3ParserFloat32AnimationReference(reader);

        if (version > 23) {
            /** @member {?M3ParserVector3AnimationReference} */
            this.triPlanarOffset = new M3ParserVector3AnimationReference(reader);
            /** @member {?M3ParserVector3AnimationReference} */
            this.triPlanarScale = new M3ParserVector3AnimationReference(reader);
        }

        /** @member {number} */
        this.unknown4 = reader.readInt32();
        /** @member {number} */
        this.fresnelType = reader.readUint32();
        /** @member {number} */
        this.fresnelExponent = reader.readFloat32();
        /** @member {number} */
        this.fresnelMin = reader.readFloat32();
        /** @member {number} */
        this.fresnelMaxOffset = reader.readFloat32();
        /** @member {number} */
        this.unknown5 = reader.readFloat32();

        if (version > 24) {
            /** @member {?} */
            this.unknown6 = reader.read(8);
            /** @member {?number} */
            this.fresnelInvertedMaskX = reader.readFloat32();
            /** @member {?number} */
            this.fresnelInvertedMaskY = reader.readFloat32();
            /** @member {?number} */
            this.fresnelInvertedMaskZ = reader.readFloat32();
            /** @member {?number} */
            this.fresnelRotationYaw = reader.readFloat32();
            /** @member {?number} */
            this.fresnelRotationPitch = reader.readFloat32();
            /** @member {?number} */
            this.unknown7 = reader.readUint32();
        }
    }
};
