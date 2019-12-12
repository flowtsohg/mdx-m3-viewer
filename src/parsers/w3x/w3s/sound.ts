import BinaryStream from '../../../common/binarystream';

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
  u1: number = 0;
  u2: number = 0;
  channel: number = 0;
  minDistance: number = 0;
  maxDistance: number = 0;
  distanceCutoff: number = 0;
  u3: number = 0;
  u4: number = 0;
  u5: number = 0;
  u6: number = 0;
  u7: number = 0;
  u8: number = 0;

  load(stream: BinaryStream) {
    this.name = stream.readUntilNull();
    this.file = stream.readUntilNull();
    this.eaxEffect = stream.readUntilNull();
    this.flags = stream.readUint32();
    this.fadeInRate = stream.readInt32();
    this.fadeOutRate = stream.readInt32();
    this.volume = stream.readInt32();
    this.pitch = stream.readFloat32();
    this.u1 = stream.readFloat32();
    this.u2 = stream.readInt32();
    this.channel = stream.readInt32();
    this.minDistance = stream.readFloat32();
    this.maxDistance = stream.readFloat32();
    this.distanceCutoff = stream.readFloat32();
    this.u3 = stream.readFloat32();
    this.u4 = stream.readFloat32();
    this.u5 = stream.readInt32();
    this.u6 = stream.readFloat32();
    this.u7 = stream.readFloat32();
    this.u8 = stream.readFloat32();
  }

  save(stream: BinaryStream) {
    stream.write(`${this.name}\0`);
    stream.write(`${this.file}\0`);
    stream.write(`${this.eaxEffect}\0`);
    stream.writeUint32(this.flags);
    stream.writeUint32(this.fadeInRate);
    stream.writeUint32(this.fadeOutRate);
    stream.writeUint32(this.volume);
    stream.writeFloat32(this.pitch);
    stream.writeFloat32(this.u1);
    stream.writeInt32(this.u2);
    stream.writeInt32(this.channel);
    stream.writeFloat32(this.minDistance);
    stream.writeFloat32(this.maxDistance);
    stream.writeFloat32(this.distanceCutoff);
    stream.writeFloat32(this.u3);
    stream.writeFloat32(this.u4);
    stream.writeInt32(this.u5);
    stream.writeFloat32(this.u6);
    stream.writeFloat32(this.u7);
    stream.writeFloat32(this.u8);
  }

  getByteLength() {
    return 71 + this.name.length + this.file.length + this.eaxEffect.length;
  }
}
