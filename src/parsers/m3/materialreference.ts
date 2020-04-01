import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';

/**
 * A material reference.
 */
export default class M3ParserMaterialReference {
  version: number;
  materialType: number;
  materialIndex: number;

  constructor(reader: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.materialType = reader.readUint32();
    this.materialIndex = reader.readUint32();
  }
}
