/**
 * A modified ability.
 */
export default class ModifiedAbility {
  /**
   *
   */
  constructor() {
    /** @member {string} */
    this.id = '\0\0\0\0';
    /** @member {number} */
    this.activeForAutocast = 0;
    /** @member {number} */
    this.heroLevel = 1;
  }

  /**
   * @param {BinaryStream} stream
   */
  load(stream) {
    this.id = stream.read(4);
    this.activeForAutocast = stream.readInt32();
    this.heroLevel = stream.readInt32();
  }

  /**
   * @param {BinaryStream} stream
   */
  save(stream) {
    stream.write(this.id);
    stream.writeInt32(this.activeForAutocast);
    stream.writeInt32(this.heroLevel);
  }
}
