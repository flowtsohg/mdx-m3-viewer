import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';

/**
 * A batch.
 */
export default class Batch {
  version = -1;
  unknown0 = 0;
  regionIndex = -1;
  unknown1 = 0;
  materialReferenceIndex = -1;
  unknown2 = 0;

  load(stream: BinaryStream, version: number, _index: IndexEntry[]): void {
    this.version = version;
    this.unknown0 = stream.readUint32();
    this.regionIndex = stream.readUint16();
    this.unknown1 = stream.readUint32();
    this.materialReferenceIndex = stream.readUint16();
    this.unknown2 = stream.readUint16();
  }
}
