import BinaryStream from '../../../common/binarystream';

/**
 * A force.
 */
export default class Force {
  flags: number = 0;
  playerMasks: number = 0;
  name: string = '';

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
