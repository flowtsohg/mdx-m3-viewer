import BinaryStream from '../../../common/binarystream';

/**
 * A region.
 */
export default class Region {
  left: number = 0;
  right: number = 0;
  bottom: number = 0;
  top: number = 0;
  name: string = '';
  creationNumber: number = 0;
  weatherEffectId: string = '\0\0\0\0';
  ambientSound: string = '';
  color: Uint8Array = new Uint8Array(4);

  load(stream: BinaryStream) {
    this.left = stream.readFloat32();
    this.right = stream.readFloat32();
    this.bottom = stream.readFloat32();
    this.top = stream.readFloat32();
    this.name = stream.readUntilNull();
    this.creationNumber = stream.readUint32();
    this.weatherEffectId = stream.read(4);
    this.ambientSound = stream.readUntilNull();
    stream.readUint8Array(this.color);
  }

  save(stream: BinaryStream) {
    stream.writeFloat32(this.left);
    stream.writeFloat32(this.right);
    stream.writeFloat32(this.bottom);
    stream.writeFloat32(this.top);
    stream.write(`${this.name}\0`);
    stream.writeUint32(this.creationNumber);

    if (this.weatherEffectId) {
      stream.write(this.weatherEffectId);
    } else {
      stream.writeUint32(0);
    }

    stream.write(`${this.ambientSound}\0`);
    stream.writeUint8Array(this.color);
  }

  getByteLength() {
    return 30 + this.name.length + this.ambientSound.length;
  }
}
