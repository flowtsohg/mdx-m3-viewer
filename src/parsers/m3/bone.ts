import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry'
import Reference from './reference';
import { Uint32AnimationReference, Vector3AnimationReference, Vector4AnimationReference } from './animationreference';

/**
 * A bone.
 */
export default class Bone {
  version: number = -1;
  unknown0: number = 0;
  name: Reference = new Reference();
  flags: number = 0;
  parent: number = -1;
  unknown1: number = 0;
  location: Vector3AnimationReference = new Vector3AnimationReference();
  rotation: Vector4AnimationReference = new Vector4AnimationReference();
  scale: Vector3AnimationReference = new Vector3AnimationReference();
  visibility: Uint32AnimationReference = new Uint32AnimationReference();

  load(stream: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.unknown0 = stream.readInt32();
    this.name.load(stream, index);
    this.flags = stream.readUint32();
    this.parent = stream.readInt16();
    this.unknown1 = stream.readUint16();
    this.location.load(stream);
    this.rotation.load(stream);
    this.scale.load(stream);
    this.visibility.load(stream);
  }
}
