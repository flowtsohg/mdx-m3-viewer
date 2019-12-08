import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';
import BoundingSphere from './boundingsphere';

/**
 * A sequence.
 */
export default class M3ParserSequence {
  version: number;
  name: Reference;
  interval: Uint32Array;
  movementSpeed: number;
  flags: number;
  frequency: number;
  boundingSphere: BoundingSphere;

  constructor(reader: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;

    reader.skip(8); // ?

    this.name = new Reference(reader, index);
    this.interval = reader.readUint32Array(2);
    this.movementSpeed = reader.readFloat32();
    this.flags = reader.readUint32();
    this.frequency = reader.readUint32();

    reader.skip(12); // ?

    if (version < 2) {
      reader.skip(4); // ?
    }

    this.boundingSphere = new BoundingSphere(reader);

    reader.skip(12); // ?
  }
}
