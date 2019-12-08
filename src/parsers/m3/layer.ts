import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';
import { M3ParserPixelAnimationReference, M3ParserUint16AnimationReference, M3ParserUint32AnimationReference, M3ParserFloat32AnimationReference, M3ParserVector2AnimationReference, M3ParserVector3AnimationReference } from './animationreference';

/**
 * A layer.
 */
export default class M3ParserLayer {
  version: number;
  unknown0: number;
  imagePath: Reference;
  color: M3ParserPixelAnimationReference;
  flags: number;
  uvSource: number;
  colorChannelSetting: number;
  brightMult: M3ParserFloat32AnimationReference;
  midtoneOffset: M3ParserFloat32AnimationReference;
  unknown1: number;
  noiseAmp: number = 0;
  noiseFreq: number = 0
  rttChannel: number;
  videoFrameRate: number;
  videoStartFrame: number;
  videoEndFrame: number;
  videoMode: number;
  videoSyncTiming: number;
  videoPlay: M3ParserUint32AnimationReference;
  videoRestart: M3ParserUint32AnimationReference;
  flipBookRows: number;
  flipBookColumns: number;
  flipBookFrame: M3ParserUint16AnimationReference;
  uvOffset: M3ParserVector2AnimationReference;
  uvAngle: M3ParserVector3AnimationReference;
  uvTiling: M3ParserVector2AnimationReference;
  unknown2: M3ParserUint32AnimationReference;
  unknown3: M3ParserFloat32AnimationReference;
  brightness: M3ParserFloat32AnimationReference;
  triPlanarOffset: M3ParserVector3AnimationReference | null = null;
  triPlanarScale: M3ParserVector3AnimationReference | null = null;
  unknown4: number;
  fresnelType: number;
  fresnelExponent: number;
  fresnelMin: number;
  fresnelMaxOffset: number;
  unknown5: number;
  unknown6: Uint8Array | null = null;
  fresnelInvertedMaskX: number = 0;
  fresnelInvertedMaskY: number = 0;
  fresnelInvertedMaskZ: number = 0;
  fresnelRotationYaw: number = 0;
  fresnelRotationPitch: number = 0;
  unknown7: number = 0;

  constructor(reader: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.unknown0 = reader.readUint32();
    this.imagePath = new Reference(reader, index);
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
      this.triPlanarOffset = new M3ParserVector3AnimationReference(reader);
      this.triPlanarScale = new M3ParserVector3AnimationReference(reader);
    }

    this.unknown4 = reader.readInt32();
    this.fresnelType = reader.readUint32();
    this.fresnelExponent = reader.readFloat32();
    this.fresnelMin = reader.readFloat32();
    this.fresnelMaxOffset = reader.readFloat32();
    this.unknown5 = reader.readFloat32();

    if (version > 24) {
      this.unknown6 = reader.readUint8Array(8);
      this.fresnelInvertedMaskX = reader.readFloat32();
      this.fresnelInvertedMaskY = reader.readFloat32();
      this.fresnelInvertedMaskZ = reader.readFloat32();
      this.fresnelRotationYaw = reader.readFloat32();
      this.fresnelRotationPitch = reader.readFloat32();
      this.unknown7 = reader.readUint32();
    }
  }
}
