import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';

/**
 * An attachment point.
 */
export default class AttachmentPoint {
  version = -1;
  unknown = 0;
  name = new Reference();
  bone = -1;

  load(stream: BinaryStream, version: number, index: IndexEntry[]): void {
    this.version = version;
    this.unknown = stream.readInt32();
    this.name.load(stream, index);
    this.bone = stream.readUint32();
  }
}
