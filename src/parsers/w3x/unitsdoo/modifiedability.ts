import BinaryStream from '../../../common/binarystream';

/**
 * A modified ability.
 */
export default class ModifiedAbility {
  id = '\0\0\0\0';
  activeForAutocast = 0;
  heroLevel = 1;

  load(stream: BinaryStream): void {
    this.id = stream.readBinary(4);
    this.activeForAutocast = stream.readInt32();
    this.heroLevel = stream.readInt32();
  }

  save(stream: BinaryStream): void {
    stream.writeBinary(this.id);
    stream.writeInt32(this.activeForAutocast);
    stream.writeInt32(this.heroLevel);
  }
}
