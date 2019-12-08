import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';

/**
 * An animation timeline.
 */
export default class M3ParserStc {
  version: number;
  name: Reference;
  runsConcurrent: number;
  priority: number;
  stsIndex: number;
  stsIndexCopy: number;
  animIds: Reference;
  animRefs: Reference;
  sd: Reference[];

  constructor(reader: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.name = new Reference(reader, index);
    this.runsConcurrent = reader.readUint16();
    this.priority = reader.readUint16();
    this.stsIndex = reader.readUint16();
    this.stsIndexCopy = reader.readUint16(); // ?
    this.animIds = new Reference(reader, index);
    this.animRefs = new Reference(reader, index);

    reader.skip(4); // ?

    this.sd = [
      new Reference(reader, index),
      new Reference(reader, index),
      new Reference(reader, index),
      new Reference(reader, index),
      new Reference(reader, index),
      new Reference(reader, index),
      new Reference(reader, index),
      new Reference(reader, index),
      new Reference(reader, index),
      new Reference(reader, index),
      new Reference(reader, index),
      new Reference(reader, index),
      new Reference(reader, index),
    ];
  }
}
