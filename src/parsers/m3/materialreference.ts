import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';

/**
 * A material reference.
 */
export default class MaterialReference {
  version = -1;
  materialType = 0;
  materialIndex = -1;

  load(stream: BinaryStream, version: number, _index: IndexEntry[]): void {
    this.version = version;
    this.materialType = stream.readUint32();
    this.materialIndex = stream.readUint32();
  }
}
