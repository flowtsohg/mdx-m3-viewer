import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import { Float32AnimationReference, Vector3AnimationReference } from './animationreference';

/**
 * A light.
 */
export default class Light {
  version = -1;
  type = 0;
  unknown0 = 0;
  bone = -1;
  flags = 0;
  unknown1 = 0;
  unknown2 = 0;
  lightColor = new Vector3AnimationReference();
  lightIntensity = new Float32AnimationReference();
  specularColor = new Vector3AnimationReference();
  specularIntensity = new Float32AnimationReference();
  attenuationFar = new Float32AnimationReference();
  unknown3 = 0;
  attenuationNear = new Float32AnimationReference();
  hotSpot = new Float32AnimationReference();
  falloff = new Float32AnimationReference();

  load(stream: BinaryStream, version: number, _index: IndexEntry[]): void {
    this.version = version;
    this.type = stream.readUint8();
    this.unknown0 = stream.readUint8();
    this.bone = stream.readInt16();
    this.flags = stream.readUint32();
    this.unknown1 = stream.readUint32();
    this.unknown2 = stream.readInt32();
    this.lightColor.load(stream);
    this.lightIntensity.load(stream);
    this.specularColor.load(stream);
    this.specularIntensity.load(stream);
    this.attenuationFar.load(stream);
    this.unknown3 = stream.readFloat32();
    this.attenuationNear.load(stream);
    this.hotSpot.load(stream);
    this.falloff.load(stream);
  }
}
