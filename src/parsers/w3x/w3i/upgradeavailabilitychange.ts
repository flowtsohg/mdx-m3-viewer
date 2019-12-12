import BinaryStream from '../../../common/binarystream';

/**
 * An upgrade availability change.
 */
export default class UpgradeAvailabilityChange {
  playerFlags: number = 0;
  id: string = '\0\0\0\0';
  levelAffected: number = 0;
  availability: number = 0;

  load(stream: BinaryStream) {
    this.playerFlags = stream.readUint32();
    this.id = stream.read(4);
    this.levelAffected = stream.readInt32();
    this.availability = stream.readInt32();
  }

  save(stream: BinaryStream) {
    stream.writeUint32(this.playerFlags);
    stream.write(this.id);
    stream.writeInt32(this.levelAffected);
    stream.writeInt32(this.availability);
  }
}
