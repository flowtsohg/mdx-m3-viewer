import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';
import GenericObject from './genericobject';

/**
 * An event object.
 */
export default class EventObject extends GenericObject {
  globalSequenceId = -1;
  tracks = new Uint32Array(0);

  constructor() {
    super(0x400);
  }

  override readMdx(stream: BinaryStream): void {
    super.readMdx(stream);

    stream.skip(4); // KEVT

    const count = stream.readUint32();

    this.globalSequenceId = stream.readInt32();
    this.tracks = stream.readUint32Array(count);
  }

  override writeMdx(stream: BinaryStream): void {
    super.writeMdx(stream);
    stream.writeBinary('KEVT');
    stream.writeUint32(this.tracks.length);
    stream.writeInt32(this.globalSequenceId);
    stream.writeUint32Array(this.tracks);
  }

  readMdl(stream: TokenStream): void {
    for (const token of super.readGenericBlock(stream)) {
      if (token === 'EventTrack') {
        const count = stream.readInt();

        this.tracks = new Uint32Array(count);

        stream.read(); // {

        if (stream.peek() === 'GlobalSeqId') {
          stream.read();

          this.globalSequenceId = stream.readInt();
        }

        for (let i = 0; i < count; i++) {
          this.tracks[i] = stream.readInt();
        }

        stream.read(); // }
      } else {
        throw new Error(`Unknown token in EventObject: "${token}"`);
      }
    }
  }

  writeMdl(stream: TokenStream): void {
    stream.startObjectBlock('EventObject', this.name);
    this.writeGenericHeader(stream);

    stream.startBlock('EventTrack', this.tracks.length);

    if (this.globalSequenceId !== -1) {
      stream.writeNumberAttrib('GlobalSeqId', this.globalSequenceId);
    }

    for (const track of this.tracks) {
      stream.writeFlag(`${track}`);
    }

    stream.endBlock();

    this.writeGenericAnimations(stream);
    stream.endBlock();
  }

  override getByteLength(): number {
    return 12 + this.tracks.byteLength + super.getByteLength();
  }
}
