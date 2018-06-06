/**
 * A Trigger category.
 * Used to scope triggers together in a Folder-like hierarchy.
 */
export default class TriggerCategory {
  /**
   *
   */
  constructor() {
    this.id = 0;
    this.name = '';
    this.isComment = 0;
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} version
   */
  load(stream, version) {
    this.id = stream.readInt32();
    this.name = stream.readUntilNull();

    if (version === 7) {
      this.isComment = stream.readInt32();
    }
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} version
   */
  save(stream, version) {
    stream.writeInt32(this.id);
    stream.write(`${this.name}\0`);

    if (version === 7) {
      stream.writeInt32(this.isComment);
    }
  }

  /**
   * @param {number} version
   * @return {number}
   */
  getByteLength(version) {
    let size = 5 + this.name.length;

    if (version === 7) {
      size += 4;
    }

    return size;
  }
}
