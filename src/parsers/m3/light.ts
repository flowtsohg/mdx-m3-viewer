import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import { M3ParserFloat32AnimationReference, M3ParserVector3AnimationReference } from './animationreference';

/**
 * A light.
 */
export default class M3ParserLight {
  version: number;
  type: number;
  unknown0: number;
  bone: number;
  flags: number;
  unknown1: number;
  unknown2: number;
  lightColor: M3ParserVector3AnimationReference;
  lightIntensity: M3ParserFloat32AnimationReference;
  specularColor: M3ParserVector3AnimationReference;
  specularIntensity: M3ParserFloat32AnimationReference;
  attenuationFar: M3ParserFloat32AnimationReference;
  unknown3: number;
  attenuationNear: M3ParserFloat32AnimationReference;
  hotSpot: M3ParserFloat32AnimationReference;
  falloff: M3ParserFloat32AnimationReference;

  constructor(reader: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.type = reader.readUint8();
    this.unknown0 = reader.readUint8();
    this.bone = reader.readInt16();
    this.flags = reader.readUint32();
    this.unknown1 = reader.readUint32();
    this.unknown2 = reader.readInt32();
    this.lightColor = new M3ParserVector3AnimationReference(reader);
    this.lightIntensity = new M3ParserFloat32AnimationReference(reader);
    this.specularColor = new M3ParserVector3AnimationReference(reader);
    this.specularIntensity = new M3ParserFloat32AnimationReference(reader);
    this.attenuationFar = new M3ParserFloat32AnimationReference(reader);
    this.unknown3 = reader.readFloat32();
    this.attenuationNear = new M3ParserFloat32AnimationReference(reader);
    this.hotSpot = new M3ParserFloat32AnimationReference(reader);
    this.falloff = new M3ParserFloat32AnimationReference(reader);
  }
}
