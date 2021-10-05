import BinaryStream from '../../../common/binarystream';
import { byteLengthUtf8 } from '../../../common/utf8';

/**
 * A sound.
 */
export default class Sound {
  name = '';
  file = '';
  eaxEffect = '';
  flags = 0;
  fadeInRate = 0;
  fadeOutRate = 0;
  volume = 0;
  pitch = 0;
  pitchVariance = 0;
  priority = 0;
  channel = 0;
  minDistance = 0;
  maxDistance = 0;
  distanceCutoff = 0;
  coneInside = 0;
  coneOutside = 0;
  coneOutsideVolume = 0;
  coneOrientationX = 0;
  coneOrientationY = 0;
  coneOrientationZ = 0;

  load(stream: BinaryStream, version: number): void {
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

    if (version > 1) {

      if (version > 2) {

      }
    }
  }

  save(stream: BinaryStream, version: number): void {
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

    if (version > 1) {

      if (version > 2) {
        
      }
    }
  }

  getByteLength(version: number): number {
    const size = 71 + byteLengthUtf8(this.name) + byteLengthUtf8(this.file) + byteLengthUtf8(this.eaxEffect);

    if (version > 1) {

      if (version > 2) {
        
      }
    }

    return size;
  }
}
