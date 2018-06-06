import M3ParserReference from './reference';
import {M3ParserFloat32AnimationReference} from './animationreference';

/**
 * a camera.
 */
export default class M3ParserCamera {
  /**
   * @param {BinaryReader} reader
   * @param {number} version
   * @param {Array<M3ParserIndexEntry>} index
   */
  constructor(reader, version, index) {
    /** @member {number} */
    this.version = version;
    /** @member {number} */
    this.bone = reader.readUint32();
    /** @member {M3ParserReference} */
    this.name = new M3ParserReference(reader, index);
    /** @member {M3ParserFloat32AnimationReference} */
    this.fieldOfView = new M3ParserFloat32AnimationReference(reader);
    /** @member {number} */
    this.unknown0 = reader.readUint32();
    /** @member {M3ParserFloat32AnimationReference} */
    this.farClip = new M3ParserFloat32AnimationReference(reader);
    /** @member {M3ParserFloat32AnimationReference} */
    this.nearClip = new M3ParserFloat32AnimationReference(reader);
    /** @member {M3ParserFloat32AnimationReference} */
    this.clip2 = new M3ParserFloat32AnimationReference(reader);
    /** @member {M3ParserFloat32AnimationReference} */
    this.focalDepth = new M3ParserFloat32AnimationReference(reader);
    /** @member {M3ParserFloat32AnimationReference} */
    this.falloffStart = new M3ParserFloat32AnimationReference(reader);
    /** @member {M3ParserFloat32AnimationReference} */
    this.falloffEnd = new M3ParserFloat32AnimationReference(reader);
    /** @member {M3ParserFloat32AnimationReference} */
    this.depthOfField = new M3ParserFloat32AnimationReference(reader);
  }
}
