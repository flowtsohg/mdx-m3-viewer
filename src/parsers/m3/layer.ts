import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';
import { PixelAnimationReference, Uint16AnimationReference, Uint32AnimationReference, Float32AnimationReference, Vector2AnimationReference, Vector3AnimationReference } from './animationreference';

/**
 * A layer.
 */
export default class Layer {
  version = -1;
  unknown0 = 0;
  imagePath = new Reference();
  color = new PixelAnimationReference();
  flags = 0;
  uvSource = -1;
  colorChannelSetting = 0;
  brightMult = new Float32AnimationReference();
  midtoneOffset = new Float32AnimationReference();
  unknown1 = 0;
  noiseAmp = 0;
  noiseFreq = 0;
  rttChannel = 0;
  videoFrameRate = 0;
  videoStartFrame = 0;
  videoEndFrame = 0;
  videoMode = 0;
  videoSyncTiming = 0;
  videoPlay = new Uint32AnimationReference();
  videoRestart = new Uint32AnimationReference();
  flipBookRows = 0;
  flipBookColumns = 0;
  flipBookFrame = new Uint16AnimationReference();
  uvOffset = new Vector2AnimationReference();
  uvAngle = new Vector3AnimationReference();
  uvTiling = new Vector2AnimationReference();
  unknown2 = new Uint32AnimationReference();
  unknown3 = new Float32AnimationReference();
  brightness = new Float32AnimationReference();
  triPlanarOffset = new Vector3AnimationReference();
  triPlanarScale = new Vector3AnimationReference();
  unknown4 = 0;
  fresnelType = 0;
  fresnelExponent = 0;
  fresnelMin = 0;
  fresnelMaxOffset = 0;
  unknown5 = 0;
  unknown6 = new Uint8Array(8);
  fresnelInvertedMaskX = 0;
  fresnelInvertedMaskY = 0;
  fresnelInvertedMaskZ = 0;
  fresnelRotationYaw = 0;
  fresnelRotationPitch = 0;
  unknown7 = 0;

  load(stream: BinaryStream, version: number, index: IndexEntry[]): void {
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
