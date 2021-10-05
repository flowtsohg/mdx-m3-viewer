import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';

/**
 * A region.
 */
export default class Region {
  version = -1;
  unknown0 = 0;
  unknown1 = 0;
  firstVertexIndex = -1;
  verticesCount = 0;
  firstTriangleIndex = -1;
  triangleIndicesCount = 0;
  bonesCount = 0;
  firstBoneLookupIndex = -1;
  boneLookupIndicesCount = 0;
  unknown2 = 0;
  boneWeightPairsCount = 0;
  unknown3 = 0;
  rootBoneIndex = -1;
  unknown4 = 0;
  unknown5 = new Uint8Array(8);

  load(stream: BinaryStream, version: number, _index: IndexEntry[]): void {
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
