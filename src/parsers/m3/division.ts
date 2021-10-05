import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';

/**
 * A division.
 */
export default class Division {
  version = -1;
  triangles = new Reference();
  regions = new Reference();
  batches = new Reference();
  MSEC = new Reference();
  unknown0 = 0;

  load(stream: BinaryStream, version: number, index: IndexEntry[]): void {
    this.version = version;
    this.triangles.load(stream, index);
    this.regions.load(stream, index);
    this.batches.load(stream, index);
    this.MSEC.load(stream, index);
    this.unknown0 = stream.readUint32();
  }
}
