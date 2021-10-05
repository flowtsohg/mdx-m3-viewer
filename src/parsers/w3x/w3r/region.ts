import BinaryStream from '../../../common/binarystream';
import { byteLengthUtf8 } from '../../../common/utf8';

/**
 * A region.
 */
export default class Region {
  left = 0;
  right = 0;
  bottom = 0;
  top = 0;
  name = '';
  creationNumber = 0;
  weatherEffectId = '\0\0\0\0';
  ambientSound = '';
  color = new Uint8Array(4);

  load(stream: BinaryStream): void {
    this.left = stream.readFloat32();
    this.right = stream.readFloat32();
    this.bottom = stream.readFloat32();
    this.top = stream.readFloat32();
    this.name = stream.readNull();
    this.creationNumber = stream.readUint32();
    this.weatherEffectId = stream.readBinary(4);
    this.ambientSound = stream.readNull();
    stream.readUint8Array(this.color);
  }

  save(stream: BinaryStream): void {
    stream.writeFloat32(this.left);
    stream.writeFloat32(this.right);
    stream.writeFloat32(this.bottom);
    stream.writeFloat32(this.top);
    stream.writeNull(this.name);
    stream.writeUint32(this.creationNumber);

    if (this.weatherEffectId) {
      stream.writeBinary(this.weatherEffectId);
    } else {
      stream.writeUint32(0);
    }

    stream.writeNull(this.ambientSound);
    stream.writeUint8Array(this.color);
  }

  getByteLength(): number {
    return 30 + byteLengthUtf8(this.name) + byteLengthUtf8(this.ambientSound);
  }
}
