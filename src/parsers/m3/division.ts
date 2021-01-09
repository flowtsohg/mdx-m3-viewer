import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';

/**
 * A division.
 */
export default class Division {
  version: number = -1;
  triangles: Reference = new Reference();
  regions: Reference = new Reference();
  batches: Reference = new Reference();
  MSEC: Reference = new Reference();
  unknown0: number = 0;

  load(stream: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.triangles.load(stream, index);
    this.regions.load(stream, index);
    this.batches.load(stream, index);
    this.MSEC.load(stream, index);
    this.unknown0 = stream.readUint32();
  }
}
