import BinaryStream from '../../../common/binarystream';

/**
 * A modified ability.
 */
export default class ModifiedAbility {
  id: string;
  activeForAutocast: number;
  heroLevel: number;

  constructor() {
    this.id = '\0\0\0\0';
    this.activeForAutocast = 0;
    this.heroLevel = 1;
  }

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
