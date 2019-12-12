import BinaryStream from '../../../common/binarystream';

/**
 * A map title.
 */
export default class MapTitle {
  visible: number = 0;
  chapterTitle: string = '';
  mapTitle: string = '';
  path: string = '';

  load(stream: BinaryStream) {
    this.visible = stream.readInt32();
    this.chapterTitle = stream.readUntilNull();
    this.mapTitle = stream.readUntilNull();
    this.path = stream.readUntilNull();
  }

  save(stream: BinaryStream) {
    stream.writeInt32(this.visible);
    stream.write(`${this.chapterTitle}\0`);
    stream.write(`${this.mapTitle}\0`);
    stream.write(`${this.path}\0`);
  }

  getByteLength() {
    return 7 + this.chapterTitle.length + this.mapTitle.length + this.path.length;
  }
}
