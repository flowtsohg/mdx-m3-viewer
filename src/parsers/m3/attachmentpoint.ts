import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';

/**
 * An attachment point.
 */
export default class AttachmentPoint {
  version: number = -1;
  unknown: number = 0;
  name: Reference = new Reference();
  bone: number = -1;

  load(stream: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.unknown = stream.readInt32();
    this.name.load(stream, index);
    this.bone = stream.readUint32();
  }
}
