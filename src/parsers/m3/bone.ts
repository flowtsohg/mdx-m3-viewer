import BinaryStream from '../../common/binarystream';
import IndexEntry from './indexentry'
import Reference from './reference';
import { M3ParserUint32AnimationReference, M3ParserVector3AnimationReference, M3ParserVector4AnimationReference } from './animationreference';

/**
 * A bone.
 */
export default class M3ParserBone {
  version: number;
  unknown0: number;
  name: Reference;
  flags: number;
  parent: number;
  unknown1: number;
  location: M3ParserVector3AnimationReference;
  rotation: M3ParserVector4AnimationReference;
  scale: M3ParserVector3AnimationReference;
  visibility: M3ParserUint32AnimationReference;

  constructor(reader: BinaryStream, version: number, index: IndexEntry[]) {
    this.version = version;
    this.unknown0 = reader.readInt32();
    this.name = new Reference(reader, index);
    this.flags = reader.readUint32();
    this.parent = reader.readInt16();
    this.unknown1 = reader.readUint16();
    this.location = new M3ParserVector3AnimationReference(reader);
    this.rotation = new M3ParserVector4AnimationReference(reader);
    this.scale = new M3ParserVector3AnimationReference(reader);
    this.visibility = new M3ParserUint32AnimationReference(reader);
  }
}
