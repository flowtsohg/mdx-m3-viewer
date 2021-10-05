import BinaryStream from '../../../common/binarystream';

/**
 * A tech availablity change.
 */
export default class TechAvailabilityChange {
  playerFlags = 0;
  id = '\0\0\0\0';

  load(stream: BinaryStream): void {
    this.playerFlags = stream.readUint32();
    this.id = stream.readBinary(4);
  }

  save(stream: BinaryStream): void {
    stream.writeUint32(this.playerFlags);
    stream.writeBinary(this.id);
  }
}
