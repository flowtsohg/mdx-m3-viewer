import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';
import { Float32AnimationReference, Uint32AnimationReference } from './animationreference';

/**
 * A standard material.
 */
export default class StandardMaterial {
  version = -1;
  name = new Reference();
  additionalFlags = 0;
  flags = 0;
  blendMode = 0;
  priority = 0;
  usedRTTChannels = 0;
  specularity = 0;
  depthBlendFalloff = 0;
  cutoutThreshold = 0;
  unknown1 = 0;
  unknown2 = 0;
  unknown3 = 0;
  specMult = 0;
  emisMult = 0;
  diffuseLayer = new Reference();
  decalLayer = new Reference();
  specularLayer = new Reference();
  glossLayer = new Reference();
  emissiveLayer = new Reference();
  emissive2Layer = new Reference();
  evioLayer = new Reference();
  evioMaskLayer = new Reference();
  alphaMaskLayer = new Reference();
  alphaMask2Layer = new Reference();
  normalLayer = new Reference();
  heightLayer = new Reference();
  lightMapLayer = new Reference();
  ambientOcclusionLayer = new Reference();
  unknown4 = new Reference();
  unknown5 = new Reference();
  unknown6 = new Reference();
  unknown7 = new Reference();
  unknown8 = 0;
  layerBlendType = 0;
  emisBlendType = 0;
  emisMode = 0;
  specType = 0;
  unknown9 = new Float32AnimationReference();
  unknown10 = new Uint32AnimationReference();
  unknown11 = new Uint8Array(12);

  load(stream: BinaryStream, version: number, index: IndexEntry[]): void {
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
      this.unknown4.load(stream, index); // Unknown layer
      this.unknown5.load(stream, index); // Unknown layer
      this.unknown6.load(stream, index); // Unknown layer
      this.unknown7.load(stream, index); // Unknown layer
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
