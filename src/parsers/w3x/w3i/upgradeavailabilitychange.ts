import BinaryStream from '../../../common/binarystream';

/**
 * An upgrade availability change.
 */
export default class UpgradeAvailabilityChange {
  playerFlags = 0;
  id = '\0\0\0\0';
  levelAffected = 0;
  availability = 0;

  load(stream: BinaryStream): void {
    this.playerFlags = stream.readUint32();
    this.id = stream.readBinary(4);
    this.levelAffected = stream.readInt32();
    this.availability = stream.readInt32();
  }

  save(stream: BinaryStream): void {
    stream.writeUint32(this.playerFlags);
    stream.writeBinary(this.id);
    stream.writeInt32(this.levelAffected);
    stream.writeInt32(this.availability);
  }
}
