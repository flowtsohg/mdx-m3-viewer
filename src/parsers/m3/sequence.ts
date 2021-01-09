import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';
import BoundingSphere from './boundingsphere';

/**
 * A sequence.
 */
export default class Sequence {
  version: number = -1;
  name: Reference = new Reference();
  interval: Uint32Array = new Uint32Array(2);
  movementSpeed: number = 0;
  flags: number = 0;
  frequency: number = 0;
  boundingSphere: BoundingSphere = new BoundingSphere();

  load(stream: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;

    stream.skip(8); // ?

    this.name.load(stream, index);
    stream.readUint32Array(this.interval);
    this.movementSpeed = stream.readFloat32();
    this.flags = stream.readUint32();
    this.frequency = stream.readUint32();

    stream.skip(12); // ?

    if (version < 2) {
      stream.skip(4); // ?
    }

    this.boundingSphere.load(stream);

    stream.skip(12); // ?
  }
}
