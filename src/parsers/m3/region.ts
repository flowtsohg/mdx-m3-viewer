import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';

/**
 * A region.
 */
export default class Region {
  version: number = -1;
  unknown0: number = 0;
  unknown1: number = 0;
  firstVertexIndex: number = -1;
  verticesCount: number = 0;
  firstTriangleIndex: number = -1;
  triangleIndicesCount: number = 0;
  bonesCount: number = 0;
  firstBoneLookupIndex: number = -1;
  boneLookupIndicesCount: number = 0;
  unknown2: number = 0;
  boneWeightPairsCount: number = 0;
  unknown3: number = 0;
  rootBoneIndex: number = -1;
  unknown4: number = 0;
  unknown5: Uint8Array = new Uint8Array(8);

  load(stream: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.unknown0 = stream.readUint32();
    this.unknown1 = stream.readUint32();
    this.firstVertexIndex = stream.readUint32();
    this.verticesCount = stream.readUint32();
    this.firstTriangleIndex = stream.readUint32();
    this.triangleIndicesCount = stream.readUint32();
    this.bonesCount = stream.readUint16();
    this.firstBoneLookupIndex = stream.readUint16();
    this.boneLookupIndicesCount = stream.readUint16();
    this.unknown2 = stream.readUint16();
    this.boneWeightPairsCount = stream.readUint8();
    this.unknown3 = stream.readUint8();
    this.rootBoneIndex = stream.readUint16();

    if (version > 3) {
      this.unknown4 = stream.readUint32();
    }

    if (version > 4) {
      stream.readUint8Array(this.unknown5);
    }
  }
}
