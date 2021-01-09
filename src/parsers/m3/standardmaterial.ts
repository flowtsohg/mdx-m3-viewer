import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';
import { Float32AnimationReference, Uint32AnimationReference } from './animationreference';

/**
 * A standard material.
 */
export default class StandardMaterial {
  version: number = -1;
  name: Reference = new Reference();
  additionalFlags: number = 0;
  flags: number = 0;
  blendMode: number = 0;
  priority: number = 0;
  usedRTTChannels: number = 0;
  specularity: number = 0;
  depthBlendFalloff: number = 0;
  cutoutThreshold: number = 0;
  unknown1: number = 0;
  unknown2: number = 0;
  unknown3: number = 0;
  specMult: number = 0;
  emisMult: number = 0;
  diffuseLayer: Reference = new Reference();
  decalLayer: Reference = new Reference();
  specularLayer: Reference = new Reference();
  glossLayer: Reference = new Reference();
  emissiveLayer: Reference = new Reference();
  emissive2Layer: Reference = new Reference();
  evioLayer: Reference = new Reference();
  evioMaskLayer: Reference = new Reference();
  alphaMaskLayer: Reference = new Reference();
  alphaMask2Layer: Reference = new Reference();
  normalLayer: Reference = new Reference();
  heightLayer: Reference = new Reference();
  lightMapLayer: Reference = new Reference();
  ambientOcclusionLayer: Reference = new Reference();
  unknown4: Reference = new Reference();
  unknown5: Reference = new Reference();
  unknown6: Reference = new Reference();
  unknown7: Reference = new Reference();
  unknown8: number = 0;
  layerBlendType: number = 0;
  emisBlendType: number = 0;
  emisMode: number = 0;
  specType: number = 0;
  unknown9: Float32AnimationReference = new Float32AnimationReference();
  unknown10: Uint32AnimationReference = new Uint32AnimationReference();
  unknown11: Uint8Array = new Uint8Array(12);

  load(stream: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.name.load(stream, index);
    this.additionalFlags = stream.readUint32();
    this.flags = stream.readUint32();
    this.blendMode = stream.readUint32();
    this.priority = stream.readInt32();
    this.usedRTTChannels = stream.readUint32();
    this.specularity = stream.readFloat32();
    this.depthBlendFalloff = stream.readFloat32();
    this.cutoutThreshold = stream.readUint8();
    this.unknown1 = stream.readUint8(); // ?
    this.unknown2 = stream.readUint8(); // ?
    this.unknown3 = stream.readUint8(); // ?
    this.specMult = stream.readFloat32();
    this.emisMult = stream.readFloat32();
    this.diffuseLayer.load(stream, index);
    this.decalLayer.load(stream, index);
    this.specularLayer.load(stream, index);

    if (version > 15) {
      this.glossLayer.load(stream, index);
    }

    this.emissiveLayer.load(stream, index);
    this.emissive2Layer.load(stream, index);
    this.evioLayer.load(stream, index);
    this.evioMaskLayer.load(stream, index);
    this.alphaMaskLayer.load(stream, index);
    this.alphaMask2Layer.load(stream, index);
    this.normalLayer.load(stream, index);
    this.heightLayer.load(stream, index);
    this.lightMapLayer.load(stream, index);
    this.ambientOcclusionLayer.load(stream, index);

    if (version > 18) {
      this.unknown4.load; // Unknown layer
      this.unknown5.load; // Unknown layer
      this.unknown6.load; // Unknown layer
      this.unknown7.load; // Unknown layer
    }

    this.unknown8 = stream.readUint32(); // ?
    this.layerBlendType = stream.readUint32();
    this.emisBlendType = stream.readUint32();
    this.emisMode = stream.readUint32();
    this.specType = stream.readUint32();

    this.unknown9.load(stream); // ?
    this.unknown10.load(stream); // ?

    if (version > 18) {
      this.unknown11 = stream.readUint8Array(this.unknown11); // ?
    }
  }
}
