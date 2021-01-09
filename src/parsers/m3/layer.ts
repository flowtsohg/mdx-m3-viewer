import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';
import { PixelAnimationReference, Uint16AnimationReference, Uint32AnimationReference, Float32AnimationReference, Vector2AnimationReference, Vector3AnimationReference } from './animationreference';

/**
 * A layer.
 */
export default class Layer {
  version: number = -1;
  unknown0: number = 0;
  imagePath: Reference = new Reference();
  color: PixelAnimationReference = new PixelAnimationReference();
  flags: number = 0;
  uvSource: number = -1;
  colorChannelSetting: number = 0;
  brightMult: Float32AnimationReference = new Float32AnimationReference();
  midtoneOffset: Float32AnimationReference = new Float32AnimationReference();
  unknown1: number = 0;
  noiseAmp: number = 0;
  noiseFreq: number = 0
  rttChannel: number = 0;
  videoFrameRate: number = 0;
  videoStartFrame: number = 0;
  videoEndFrame: number = 0;
  videoMode: number = 0;
  videoSyncTiming: number = 0;
  videoPlay: Uint32AnimationReference = new Uint32AnimationReference();
  videoRestart: Uint32AnimationReference = new Uint32AnimationReference();
  flipBookRows: number = 0;
  flipBookColumns: number = 0;
  flipBookFrame: Uint16AnimationReference = new Uint16AnimationReference();
  uvOffset: Vector2AnimationReference = new Vector2AnimationReference();
  uvAngle: Vector3AnimationReference = new Vector3AnimationReference();
  uvTiling: Vector2AnimationReference = new Vector2AnimationReference();
  unknown2: Uint32AnimationReference = new Uint32AnimationReference();
  unknown3: Float32AnimationReference = new Float32AnimationReference();
  brightness: Float32AnimationReference = new Float32AnimationReference();
  triPlanarOffset: Vector3AnimationReference = new Vector3AnimationReference();
  triPlanarScale: Vector3AnimationReference = new Vector3AnimationReference();
  unknown4: number = 0;
  fresnelType: number = 0;
  fresnelExponent: number = 0;
  fresnelMin: number = 0;
  fresnelMaxOffset: number = 0;
  unknown5: number = 0;
  unknown6: Uint8Array = new Uint8Array(8);
  fresnelInvertedMaskX: number = 0;
  fresnelInvertedMaskY: number = 0;
  fresnelInvertedMaskZ: number = 0;
  fresnelRotationYaw: number = 0;
  fresnelRotationPitch: number = 0;
  unknown7: number = 0;

  load(stream: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.unknown0 = stream.readUint32();
    this.imagePath.load(stream, index);
    this.color.load(stream);
    this.flags = stream.readUint32();
    this.uvSource = stream.readUint32();
    this.colorChannelSetting = stream.readUint32();
    this.brightMult.load(stream);
    this.midtoneOffset.load(stream);
    this.unknown1 = stream.readUint32();

    if (version > 23) {
      this.noiseAmp = stream.readFloat32();
      this.noiseFreq = stream.readFloat32();
    }

    this.rttChannel = stream.readInt32();
    this.videoFrameRate = stream.readUint32();
    this.videoStartFrame = stream.readUint32();
    this.videoEndFrame = stream.readInt32();
    this.videoMode = stream.readUint32();
    this.videoSyncTiming = stream.readUint32();
    this.videoPlay.load(stream);
    this.videoRestart.load(stream);
    this.flipBookRows = stream.readUint32();
    this.flipBookColumns = stream.readUint32();
    this.flipBookFrame.load(stream);
    this.uvOffset.load(stream);
    this.uvAngle.load(stream);
    this.uvTiling.load(stream);
    this.unknown2.load(stream);
    this.unknown3.load(stream);
    this.brightness.load(stream);

    if (version > 23) {
      this.triPlanarOffset.load(stream);
      this.triPlanarScale.load(stream);
    }

    this.unknown4 = stream.readInt32();
    this.fresnelType = stream.readUint32();
    this.fresnelExponent = stream.readFloat32();
    this.fresnelMin = stream.readFloat32();
    this.fresnelMaxOffset = stream.readFloat32();
    this.unknown5 = stream.readFloat32();

    if (version > 24) {
      this.unknown6 = stream.readUint8Array(8);
      this.fresnelInvertedMaskX = stream.readFloat32();
      this.fresnelInvertedMaskY = stream.readFloat32();
      this.fresnelInvertedMaskZ = stream.readFloat32();
      this.fresnelRotationYaw = stream.readFloat32();
      this.fresnelRotationPitch = stream.readFloat32();
      this.unknown7 = stream.readUint32();
    }
  }
}
