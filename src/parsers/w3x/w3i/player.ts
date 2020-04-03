import BinaryStream from '../../../common/binarystream';

/**
 * A player.
 */
export default class Player {
  private version: number = 0;

  id: number = 0;
  type: number = 0;
  race: number = 0;
  isFixedStartPosition: number = 0;
  name: string = '';
  startLocation: Float32Array = new Float32Array(2);
  allyLowPriorities: number = 0;
  allyHighPriorities: number = 0;
  unknown1: Uint8Array = new Uint8Array(8);

  constructor(version: number) {
    this.version = version;
  }

  load(stream: BinaryStream) {
    this.id = stream.readInt32();
    this.type = stream.readInt32();
    this.race = stream.readInt32();
    this.isFixedStartPosition = stream.readInt32();;
    this.name = stream.readUntilNull();
    stream.readFloat32Array(this.startLocation);
    this.allyLowPriorities = stream.readUint32();
    this.allyHighPriorities = stream.readUint32();
    if (this.version > 30) {
      stream.readUint8Array(this.unknown1);
    }
  }

  save(stream: BinaryStream) {
    stream.writeInt32(this.id);
    stream.writeInt32(this.type);
    stream.writeInt32(this.race);
    stream.writeInt32(this.isFixedStartPosition);
    stream.write(`${this.name}\0`);
    stream.writeFloat32Array(this.startLocation);
    stream.writeUint32(this.allyLowPriorities);
    stream.writeUint32(this.allyHighPriorities);
  }

  getByteLength() {
    return 41 + this.name.length;
  }
}