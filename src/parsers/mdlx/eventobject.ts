import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';
import GenericObject from './genericobject';

/**
 * An event object.
 */
export default class EventObject extends GenericObject {
  globalSequenceId: number;
  tracks: Uint32Array;

  constructor() {
    super(0x400);

    this.globalSequenceId = -1;
    this.tracks = new Uint32Array(0);
  }

  readMdx(stream: BinaryStream) {
    super.readMdx(stream);

    stream.skip(4); // KEVT

    let count = stream.readUint32();

    this.globalSequenceId = stream.readInt32();
    this.tracks = stream.readUint32Array(count);
  }

  writeMdx(stream: BinaryStream) {
    super.writeMdx(stream);
    stream.write('KEVT');
    stream.writeUint32(this.tracks.length);
    stream.writeInt32(this.globalSequenceId);
    stream.writeUint32Array(this.tracks);
  }

  readMdl(stream: TokenStream) {
    for (let token of super.readGenericBlock(stream)) {
      if (token === 'EventTrack') {
        this.tracks = new Uint32Array(stream.readInt());

        stream.readIntArray(this.tracks);
      } else {
        throw new Error(`Unknown token in EventObject: "${token}"`);
      }
    }
  }

  writeMdl(stream: TokenStream) {
    stream.startObjectBlock('EventObject', this.name);
    this.writeGenericHeader(stream);

    stream.startBlock('EventTrack', this.tracks.length);

    for (let track of this.tracks) {
      stream.writeFlag(`${track}`);
    }

    stream.endBlock();

    this.writeGenericAnimations(stream);
    stream.endBlock();
  }

  getByteLength() {
    return 12 + this.tracks.byteLength + super.getByteLength();
  }
}
