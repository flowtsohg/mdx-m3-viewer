import BinaryStream from '../../../common/binarystream';
import { byteLengthUtf8 } from '../../../common/utf8';

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
    this.chapterTitle = stream.readNull();
    this.mapTitle = stream.readNull();
    this.path = stream.readNull();
  }

  save(stream: BinaryStream) {
    stream.writeInt32(this.visible);
    stream.writeNull(this.chapterTitle);
    stream.writeNull(this.mapTitle);
    stream.writeNull(this.path);
  }

  getByteLength() {
    return 7 + byteLengthUtf8(this.chapterTitle) + byteLengthUtf8(this.mapTitle) + byteLengthUtf8(this.path);
  }
}
