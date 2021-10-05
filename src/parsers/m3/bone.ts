import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';
import { Uint32AnimationReference, Vector3AnimationReference, Vector4AnimationReference } from './animationreference';

/**
 * A bone.
 */
export default class Bone {
  version = -1;
  unknown0 = 0;
  name = new Reference();
  flags = 0;
  parent = -1;
  unknown1 = 0;
  location = new Vector3AnimationReference();
  rotation = new Vector4AnimationReference();
  scale = new Vector3AnimationReference();
  visibility = new Uint32AnimationReference();

  load(stream: BinaryStream, version: number, index: IndexEntry[]): void {
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
