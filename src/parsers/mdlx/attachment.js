import GenericObject from './genericobject';

/**
 * An attachment.
 */
export default class Attachment extends GenericObject {
  /**
   *
   */
  constructor() {
    super(0x800);

    /** @member {string} */
    this.path = '';
    /** @member {number} */
    this.attachmentId = 0;
  }

  /**
   * @param {BinaryStream} stream
   */
  readMdx(stream) {
    let size = stream.readUint32();

    super.readMdx(stream);

    this.path = stream.read(260);
    this.attachmentId = stream.readInt32();

    this.readAnimations(stream, size - this.getByteLength());
  }

  /**
   * @param {BinaryStream} stream
   */
  writeMdx(stream) {
    stream.writeUint32(this.getByteLength());

    super.writeMdx(stream);

    stream.write(this.path);
    stream.skip(260 - this.path.length);
    stream.writeInt32(this.attachmentId);

    this.writeNonGenericAnimationChunks(stream);
  }

  /**
   * @param {TokenStream} stream
   */
  readMdl(stream) {
    for (let token of super.readMdl(stream)) {
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

  /**
   * @param {TokenStream} stream
   */
  writeMdl(stream) {
    stream.startObjectBlock('Attachment', this.name);
    this.writeGenericHeader(stream);

    stream.writeAttrib('AttachmentID', this.attachmentId); // Is this needed? MDX supplies it, but MdlxConv does not use it.

    if (this.path.length) {
      stream.writeStringAttrib('Path', this.path);
    }

    this.writeAnimation(stream, 'KATV');

    this.writeGenericAnimations(stream);
    stream.endBlock();
  }

  /**
   * @return {number}
   */
  getByteLength() {
    return 268 + super.getByteLength();
  }
}
