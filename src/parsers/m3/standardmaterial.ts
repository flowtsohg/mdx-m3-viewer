import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';
import { M3ParserFloat32AnimationReference, M3ParserUint32AnimationReference } from './animationreference';

/**
 * A standard material.
 */
export default class M3ParserStandardMaterial {
  version: number;
  name: Reference;
  additionalFlags: number;
  flags: number;
  blendMode: number;
  priority: number;
  usedRTTChannels: number;
  specularity: number;
  depthBlendFalloff: number;
  cutoutThreshold: number;
  unknown1: number;
  unknown2: number;
  unknown3: number;
  specMult: number;
  emisMult: number;
  diffuseLayer: Reference;
  decalLayer: Reference;
  specularLayer: Reference;
  glossLayer: Reference | null = null;
  emissiveLayer: Reference;
  emissive2Layer: Reference;
  evioLayer: Reference;
  evioMaskLayer: Reference;
  alphaMaskLayer: Reference;
  alphaMask2Layer: Reference;
  normalLayer: Reference;
  heightLayer: Reference;
  lightMapLayer: Reference;
  ambientOcclusionLayer: Reference;
  unknown4: Reference | null = null;
  unknown5: Reference | null = null;
  unknown6: Reference | null = null;
  unknown7: Reference | null = null;
  unknown8: number;
  layerBlendType: number;
  emisBlendType: number;
  emisMode: number;
  specType: number;
  unknown9: M3ParserFloat32AnimationReference;
  unknown10: M3ParserUint32AnimationReference;
  unknown11: Uint8Array | null = null;

  constructor(reader: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.name = new Reference(reader, index);
    this.additionalFlags = reader.readUint32();
    this.flags = reader.readUint32();
    this.blendMode = reader.readUint32();
    this.priority = reader.readInt32();
    this.usedRTTChannels = reader.readUint32();
    this.specularity = reader.readFloat32();
    this.depthBlendFalloff = reader.readFloat32();
    this.cutoutThreshold = reader.readUint8();
    this.unknown1 = reader.readUint8(); // ?
    this.unknown2 = reader.readUint8(); // ?
    this.unknown3 = reader.readUint8(); // ?
    this.specMult = reader.readFloat32();
    this.emisMult = reader.readFloat32();
    this.diffuseLayer = new Reference(reader, index);
    this.decalLayer = new Reference(reader, index);
    this.specularLayer = new Reference(reader, index);

    if (version > 15) {
      this.glossLayer = new Reference(reader, index);
    }

    this.emissiveLayer = new Reference(reader, index);
    this.emissive2Layer = new Reference(reader, index);
    this.evioLayer = new Reference(reader, index);
    this.evioMaskLayer = new Reference(reader, index);
    this.alphaMaskLayer = new Reference(reader, index);
    this.alphaMask2Layer = new Reference(reader, index);
    this.normalLayer = new Reference(reader, index);
    this.heightLayer = new Reference(reader, index);
    this.lightMapLayer = new Reference(reader, index);
    this.ambientOcclusionLayer = new Reference(reader, index);

    if (version > 18) {
      this.unknown4 = new Reference(reader, index); // Unknown layer
      this.unknown5 = new Reference(reader, index); // Unknown layer
      this.unknown6 = new Reference(reader, index); // Unknown layer
      this.unknown7 = new Reference(reader, index); // Unknown layer
    }

    this.unknown8 = reader.readUint32(); // ?
    this.layerBlendType = reader.readUint32();
    this.emisBlendType = reader.readUint32();
    this.emisMode = reader.readUint32();
    this.specType = reader.readUint32();

    this.unknown9 = new M3ParserFloat32AnimationReference(reader); // ?
    this.unknown10 = new M3ParserUint32AnimationReference(reader); // ?

    if (version > 18) {
      this.unknown11 = reader.readUint8Array(12); // ?
    }
  }
}
