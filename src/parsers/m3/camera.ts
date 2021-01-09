import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';
import { Float32AnimationReference } from './animationreference';

/**
 * A camera.
 */
export default class Camera {
  version: number = -1;
  bone: number = -1;
  name: Reference = new Reference();
  fieldOfView: Float32AnimationReference = new Float32AnimationReference();
  unknown0: number = 0;
  farClip: Float32AnimationReference = new Float32AnimationReference();
  nearClip: Float32AnimationReference = new Float32AnimationReference();
  clip2: Float32AnimationReference = new Float32AnimationReference();
  focalDepth: Float32AnimationReference = new Float32AnimationReference();
  falloffStart: Float32AnimationReference = new Float32AnimationReference();
  falloffEnd: Float32AnimationReference = new Float32AnimationReference();
  depthOfField: Float32AnimationReference = new Float32AnimationReference();

  load(stream: BinaryStream, version: number, index: IndexEntry[]) {
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
