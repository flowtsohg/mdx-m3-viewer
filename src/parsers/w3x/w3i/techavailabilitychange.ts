import BinaryStream from '../../../common/binarystream';

/**
 * A tech availablity change.
 */
export default class TechAvailabilityChange {
  playerFlags: number = 0;
  id: string = '\0\0\0\0';

  load(stream: BinaryStream) {
    this.playerFlags = stream.readUint32();
    this.id = stream.read(4);
  }

  save(stream: BinaryStream) {
    stream.writeUint32(this.playerFlags);
    stream.write(this.id);
  }
}
