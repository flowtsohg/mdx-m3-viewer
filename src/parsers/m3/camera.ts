import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';
import { Float32AnimationReference } from './animationreference';

/**
 * A camera.
 */
export default class Camera {
  version = -1;
  bone = -1;
  name = new Reference();
  fieldOfView = new Float32AnimationReference();
  unknown0 = 0;
  farClip = new Float32AnimationReference();
  nearClip = new Float32AnimationReference();
  clip2 = new Float32AnimationReference();
  focalDepth = new Float32AnimationReference();
  falloffStart = new Float32AnimationReference();
  falloffEnd = new Float32AnimationReference();
  depthOfField = new Float32AnimationReference();

  load(stream: BinaryStream, version: number, index: IndexEntry[]): void {
    this.version = version;
    this.bone = stream.readUint32();
    this.name.load(stream, index);
    this.fieldOfView.load(stream);
    this.unknown0 = stream.readUint32();
    this.farClip.load(stream);
    this.nearClip.load(stream);
    this.clip2.load(stream);
    this.focalDepth.load(stream);
    this.falloffStart.load(stream);
    this.falloffEnd.load(stream);
    this.depthOfField.load(stream);
  }
}
