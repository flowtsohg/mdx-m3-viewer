import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';
import BoundingSphere from './boundingsphere';

/**
 * A sequence.
 */
export default class Sequence {
  version = -1;
  name = new Reference();
  interval = new Uint32Array(2);
  movementSpeed = 0;
  flags = 0;
  frequency = 0;
  boundingSphere = new BoundingSphere();

  load(stream: BinaryStream, version: number, index: IndexEntry[]): void {
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
