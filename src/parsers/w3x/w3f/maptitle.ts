import BinaryStream from '../../../common/binarystream';
import { byteLengthUtf8 } from '../../../common/utf8';

/**
 * A map title.
 */
export default class MapTitle {
  visible = 0;
  chapterTitle = '';
  mapTitle = '';
  path = '';

  load(stream: BinaryStream): void {
    this.visible = stream.readInt32();
    this.chapterTitle = stream.readNull();
    this.mapTitle = stream.readNull();
    this.path = stream.readNull();
  }

  save(stream: BinaryStream): void {
    stream.writeInt32(this.visible);
    stream.writeNull(this.chapterTitle);
    stream.writeNull(this.mapTitle);
    stream.writeNull(this.path);
  }

  getByteLength(): number {
    return 7 + byteLengthUtf8(this.chapterTitle) + byteLengthUtf8(this.mapTitle) + byteLengthUtf8(this.path);
  }
}
