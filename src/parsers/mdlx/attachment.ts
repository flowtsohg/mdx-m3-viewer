import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';
import GenericObject from './genericobject';

/**
 * An attachment.
 */
export default class Attachment extends GenericObject {
  path: string = '';
  attachmentId: number = 0;

  constructor() {
    super(0x800);
  }

  readMdx(stream: BinaryStream) {
    const start = stream.index;
    const size = stream.readUint32();

    super.readMdx(stream);

    this.path = stream.read(260);
    this.attachmentId = stream.readInt32();

    this.readAnimations(stream, size - (stream.index - start));
  }

  writeMdx(stream: BinaryStream) {
    stream.writeUint32(this.getByteLength());

    super.writeMdx(stream);

    stream.write(this.path);
    stream.skip(260 - this.path.length);
    stream.writeInt32(this.attachmentId);

    this.writeNonGenericAnimationChunks(stream);
  }

  readMdl(stream: TokenStream) {
    for (let token of super.readGenericBlock(stream)) {
      if (token === 'AttachmentID') {
        this.attachmentId = stream.readInt();
      } else if (token === 'Path') {
        this.path = stream.read();
      } else if (token === 'Visibility') {
        this.readAnimation(stream, 'KATV');
      } else {
        throw new Error(`Unknown token in Attachment ${this.name}: "${token}"`);
      }
    }
  }

  writeMdl(stream: TokenStream) {
    stream.startObjectBlock('Attachment', this.name);
    this.writeGenericHeader(stream);

    stream.writeNumberAttrib('AttachmentID', this.attachmentId); // Is this needed? MDX supplies it, but MdlxConv does not use it.

    if (this.path.length) {
      stream.writeStringAttrib('Path', this.path);
    }

    this.writeAnimation(stream, 'KATV');

    this.writeGenericAnimations(stream);
    stream.endBlock();
  }

  getByteLength() {
    return 268 + super.getByteLength();
  }
}
