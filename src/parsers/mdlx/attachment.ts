import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';
import GenericObject from './genericobject';

/**
 * An attachment.
 */
export default class Attachment extends GenericObject {
  path = '';
  attachmentId = 0;

  constructor() {
    super(0x800);
  }

  override readMdx(stream: BinaryStream): void {
    const start = stream.index;
    const size = stream.readUint32();

    super.readMdx(stream);

    this.path = stream.read(260);
    this.attachmentId = stream.readInt32();

    this.readAnimations(stream, size - (stream.index - start));
  }

  override writeMdx(stream: BinaryStream): void {
    stream.writeUint32(this.getByteLength());

    super.writeMdx(stream);

    stream.skip(260 - stream.write(this.path));
    stream.writeInt32(this.attachmentId);

    this.writeNonGenericAnimationChunks(stream);
  }

  readMdl(stream: TokenStream): void {
    for (const token of super.readGenericBlock(stream)) {
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

  writeMdl(stream: TokenStream): void {
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

  override getByteLength(): number {
    return 268 + super.getByteLength();
  }
}
