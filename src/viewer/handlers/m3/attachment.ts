import AttachmentPoint from '../../../parsers/m3/attachmentpoint';

/**
 * An M3 attachment.
 */
export default class M3Attachment {
  name: string;
  bone: number;

  constructor(attachment: AttachmentPoint) {
    this.name = attachment.name.getAll().join('');
    this.bone = attachment.bone;
  }
}
