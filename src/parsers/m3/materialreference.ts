import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';

/**
 * A material reference.
 */
export default class MaterialReference {
  version: number = -1;
  materialType: number = 0;
  materialIndex: number = -1;

  load(stream: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.materialType = stream.readUint32();
    this.materialIndex = stream.readUint32();
  }
}
