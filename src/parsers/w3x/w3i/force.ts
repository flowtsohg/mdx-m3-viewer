import BinaryStream from '../../../common/binarystream';
import { byteLengthUtf8 } from '../../../common/utf8';

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
    this.name = stream.readNull();
  }

  save(stream: BinaryStream) {
    stream.writeUint32(this.flags);
    stream.writeUint32(this.playerMasks);
    stream.writeNull(this.name);
  }

  getByteLength() {
    return 9 + byteLengthUtf8(this.name);
  }
}
