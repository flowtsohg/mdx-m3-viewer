
/**
 * A map title.
 */
export default class MapTitle {
  /**
   *
   */
  constructor() {
    /** @member {number} */
    this.visible = 0;
    /** @member {string} */
    this.chapterTitle = '';
    /** @member {string} */
    this.mapTitle = '';
    /** @member {string} */
    this.path = '';
  }

  /**
   * @param {BinaryStream} stream
   */
  load(stream) {
    this.visible = stream.readInt32();
    this.chapterTitle = stream.readUntilNull();
    this.mapTitle = stream.readUntilNull();
    this.path = stream.readUntilNull();
  }

  /**
   * @param {BinaryStream} stream
   */
  save(stream) {
    stream.writeInt32(this.visible);
    stream.write(`${this.chapterTitle}\0`);
    stream.write(`${this.mapTitle}\0`);
    stream.write(`${this.path}\0`);
  }

  /**
   * @return {number}
   */
  getByteLength() {
    return 7 + this.chapterTitle.length + this.mapTitle.length + this.path.length;
  }
}
