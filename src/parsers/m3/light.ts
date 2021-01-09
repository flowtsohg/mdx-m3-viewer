import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import { Float32AnimationReference, Vector3AnimationReference } from './animationreference';

/**
 * A light.
 */
export default class Light {
  version: number = -1;
  type: number = 0;
  unknown0: number = 0;
  bone: number = -1;
  flags: number = 0;
  unknown1: number = 0;
  unknown2: number = 0;
  lightColor: Vector3AnimationReference = new Vector3AnimationReference();
  lightIntensity: Float32AnimationReference = new Float32AnimationReference();
  specularColor: Vector3AnimationReference = new Vector3AnimationReference();
  specularIntensity: Float32AnimationReference = new Float32AnimationReference();
  attenuationFar: Float32AnimationReference = new Float32AnimationReference();
  unknown3: number = 0;
  attenuationNear: Float32AnimationReference = new Float32AnimationReference();
  hotSpot: Float32AnimationReference = new Float32AnimationReference();
  falloff: Float32AnimationReference = new Float32AnimationReference();

  load(stream: BinaryStream, version: number, index: IndexEntry[]) {
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
