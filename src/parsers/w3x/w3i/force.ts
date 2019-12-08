import BinaryStream from '../../../common/binarystream';

/**
 * A force.
 */
export default class Force {
  flags: number;
  playerMasks: number;
  name: string;

  constructor() {
    this.flags = 0;
    this.playerMasks = 0;
    this.name = '';
  }

  load(stream: BinaryStream) {
    this.flags = stream.readUint32();
    this.playerMasks = stream.readUint32();
    this.name = stream.readUntilNull();
  }

  save(stream: BinaryStream) {
    stream.writeUint32(this.flags);
    stream.writeUint32(this.playerMasks);
    stream.write(`${this.name}\0`);
  }

  getByteLength() {
    return 9 + this.name.length;
  }
}
