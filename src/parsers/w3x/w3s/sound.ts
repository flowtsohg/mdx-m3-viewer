import BinaryStream from '../../../common/binarystream';
import { byteLengthUtf8 } from '../../../common/utf8';

/**
 * A sound.
 */
export default class Sound {
  name: string = '';
  file: string = '';
  eaxEffect: string = '';
  flags: number = 0;
  fadeInRate: number = 0;
  fadeOutRate: number = 0;
  volume: number = 0;
  pitch: number = 0;
  pitchVariance: number = 0;
  priority: number = 0;
  channel: number = 0;
  minDistance: number = 0;
  maxDistance: number = 0;
  distanceCutoff: number = 0;
  coneInside: number = 0;
  coneOutside: number = 0;
  coneOutsideVolume: number = 0;
  coneOrientationX: number = 0;
  coneOrientationY: number = 0;
  coneOrientationZ: number = 0;

  load(stream: BinaryStream) {
    this.name = stream.readNull();
    this.file = stream.readNull();
    this.eaxEffect = stream.readNull();
    this.flags = stream.readUint32();
    this.fadeInRate = stream.readInt32();
    this.fadeOutRate = stream.readInt32();
    this.volume = stream.readInt32();
    this.pitch = stream.readFloat32();
    this.pitchVariance = stream.readFloat32();
    this.priority = stream.readInt32();
    this.channel = stream.readInt32();
    this.minDistance = stream.readFloat32();
    this.maxDistance = stream.readFloat32();
    this.distanceCutoff = stream.readFloat32();
    this.coneInside = stream.readFloat32();
    this.coneOutside = stream.readFloat32();
    this.coneOutsideVolume = stream.readInt32();
    this.coneOrientationX = stream.readFloat32();
    this.coneOrientationY = stream.readFloat32();
    this.coneOrientationZ = stream.readFloat32();
  }

  save(stream: BinaryStream) {
    stream.writeNull(this.name);
    stream.writeNull(this.file);
    stream.writeNull(this.eaxEffect);
    stream.writeUint32(this.flags);
    stream.writeUint32(this.fadeInRate);
    stream.writeUint32(this.fadeOutRate);
    stream.writeUint32(this.volume);
    stream.writeFloat32(this.pitch);
    stream.writeFloat32(this.pitchVariance);
    stream.writeInt32(this.priority);
    stream.writeInt32(this.channel);
    stream.writeFloat32(this.minDistance);
    stream.writeFloat32(this.maxDistance);
    stream.writeFloat32(this.distanceCutoff);
    stream.writeFloat32(this.coneInside);
    stream.writeFloat32(this.coneOutside);
    stream.writeInt32(this.coneOutsideVolume);
    stream.writeFloat32(this.coneOrientationX);
    stream.writeFloat32(this.coneOrientationY);
    stream.writeFloat32(this.coneOrientationZ);
  }

  getByteLength() {
    return 71 + byteLengthUtf8(this.name) + byteLengthUtf8(this.file) + byteLengthUtf8(this.eaxEffect);
  }
}
