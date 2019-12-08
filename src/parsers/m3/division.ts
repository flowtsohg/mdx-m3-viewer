import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';

/**
 * A division.
 */
export default class M3ParserDivision {
  version: number;
  triangles: Reference;
  regions: Reference;
  batches: Reference;
  MSEC: Reference;
  unknown0: number;

  constructor(reader: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.triangles = new Reference(reader, index);
    this.regions = new Reference(reader, index);
    this.batches = new Reference(reader, index);
    this.MSEC = new Reference(reader, index);
    this.unknown0 = reader.readUint32();
  }
}
