import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';

/**
 * A batch.
 */
export default class Batch {
  version: number = -1;
  unknown0: number = 0;
  regionIndex: number = -1;
  unknown1: number = 0;
  materialReferenceIndex: number = -1;
  unknown2: number = 0;

  load(stream: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.unknown0 = stream.readUint32();
    this.regionIndex = stream.readUint16();
    this.unknown1 = stream.readUint32();
    this.materialReferenceIndex = stream.readUint16();
    this.unknown2 = stream.readUint16();
  }
}
