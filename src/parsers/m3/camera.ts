import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry';
import Reference from './reference';
import { M3ParserFloat32AnimationReference } from './animationreference';

/**
 * A camera.
 */
export default class M3ParserCamera {
  version: number;
  bone: number;
  name: Reference;
  fieldOfView: M3ParserFloat32AnimationReference;
  unknown0: number;
  farClip: M3ParserFloat32AnimationReference;
  nearClip: M3ParserFloat32AnimationReference;
  clip2: M3ParserFloat32AnimationReference;
  focalDepth: M3ParserFloat32AnimationReference;
  falloffStart: M3ParserFloat32AnimationReference;
  falloffEnd: M3ParserFloat32AnimationReference;
  depthOfField: M3ParserFloat32AnimationReference;

  constructor(reader: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.bone = reader.readUint32();
    this.name = new Reference(reader, index);
    this.fieldOfView = new M3ParserFloat32AnimationReference(reader);
    this.unknown0 = reader.readUint32();
    this.farClip = new M3ParserFloat32AnimationReference(reader);
    this.nearClip = new M3ParserFloat32AnimationReference(reader);
    this.clip2 = new M3ParserFloat32AnimationReference(reader);
    this.focalDepth = new M3ParserFloat32AnimationReference(reader);
    this.falloffStart = new M3ParserFloat32AnimationReference(reader);
    this.falloffEnd = new M3ParserFloat32AnimationReference(reader);
    this.depthOfField = new M3ParserFloat32AnimationReference(reader);
  }
}
