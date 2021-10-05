import BinaryStream from '../../../common/binarystream';
import { byteLengthUtf8 } from '../../../common/utf8';

/**
 * A player.
 */
export default class Player {
  id = 0;
  type = 0;
  race = 0;
  isFixedStartPosition = 0;
  name = '';
  startLocation = new Float32Array(2);
  allyLowPriorities = 0;
  allyHighPriorities = 0;
  unknown1 = new Uint8Array(8);

  load(stream: BinaryStream, version: number): void {
    this.id = stream.readInt32();
    this.type = stream.readInt32();
    this.race = stream.readInt32();
    this.isFixedStartPosition = stream.readInt32();
    this.name = stream.readNull();
    stream.readFloat32Array(this.startLocation);
    this.allyLowPriorities = stream.readUint32();
    this.allyHighPriorities = stream.readUint32();
    if (version > 30) {
      stream.readUint8Array(this.unknown1);
    }
  }

  save(stream: BinaryStream, version: number): void {
    stream.writeInt32(this.id);
    stream.writeInt32(this.type);
    stream.writeInt32(this.race);
    stream.writeInt32(this.isFixedStartPosition);
    stream.writeNull(this.name);
    stream.writeFloat32Array(this.startLocation);
    stream.writeUint32(this.allyLowPriorities);
    stream.writeUint32(this.allyHighPriorities);
    if (version > 30) {
      stream.writeUint8Array(this.unknown1);
    }
  }

  getByteLength(version: number): number {
    let size = 33 + byteLengthUtf8(this.name);

    if (version > 30) {
      size += 8;
    }

    return size;
  }
}
