import BinaryStream from '../../../common/binarystream';

/**
 * A Trigger category.
 * 
 * Used to scope triggers together in a Folder-like hierarchy.
 */
export default class TriggerCategory {
  id: number = 0;
  name: string = '';
  isComment: number = 0;

  load(stream: BinaryStream, version: number) {
    this.id = stream.readInt32();
    this.name = stream.readUntilNull();

    if (version === 7) {
      this.isComment = stream.readInt32();
    }
  }

  save(stream: BinaryStream, version: number) {
    stream.writeInt32(this.id);
    stream.write(`${this.name}\0`);

    if (version === 7) {
      stream.writeInt32(this.isComment);
    }
  }

  getByteLength(version: number) {
    let size = 5 + this.name.length;

    if (version === 7) {
      size += 4;
    }

    return size;
  }
}
