import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';

/**
 * A region.
 */
export default class M3ParserRegion {
  version: number;
  unknown0: number;
  unknown1: number;
  firstVertexIndex: number;
  verticesCount: number;
  firstTriangleIndex: number;
  triangleIndicesCount: number;
  bonesCount: number;
  firstBoneLookupIndex: number;
  boneLookupIndicesCount: number;
  unknown2: number;
  boneWeightPairsCount: number;
  unknown3: number;
  rootBoneIndex: number;
  unknown4: number = 0;
  unknown5: Uint8Array | null = null;

  constructor(reader: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.unknown0 = reader.readUint32();
    this.unknown1 = reader.readUint32();
    this.firstVertexIndex = reader.readUint32();
    this.verticesCount = reader.readUint32();
    this.firstTriangleIndex = reader.readUint32();
    this.triangleIndicesCount = reader.readUint32();
    this.bonesCount = reader.readUint16();
    this.firstBoneLookupIndex = reader.readUint16();
    this.boneLookupIndicesCount = reader.readUint16();
    this.unknown2 = reader.readUint16();
    this.boneWeightPairsCount = reader.readUint8();
    this.unknown3 = reader.readUint8();
    this.rootBoneIndex = reader.readUint16();

    if (version > 3) {
      this.unknown4 = reader.readUint32();
    }

    if (version > 4) {
      this.unknown5 = reader.readUint8Array(8);
    }
  }
}
