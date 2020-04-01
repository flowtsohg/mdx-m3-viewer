import BinaryStream from '../../../common/binarystream';

/**
 * A modified ability.
 */
export default class ModifiedAbility {
  id: string = '\0\0\0\0';
  activeForAutocast: number = 0;
  heroLevel: number = 1;

  load(stream: BinaryStream) {
    this.id = stream.read(4);
    this.activeForAutocast = stream.readInt32();
    this.heroLevel = stream.readInt32();
  }

  save(stream: BinaryStream) {
    stream.write(this.id);
    stream.writeInt32(this.activeForAutocast);
    stream.writeInt32(this.heroLevel);
  }
}
