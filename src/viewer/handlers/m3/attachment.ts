import AttachmentPoint from '../../../parsers/m3/attachmentpoint';

/**
 * An M3 attachment.
 */
export default class M3Attachment {
  name: string;
  bone: number;

  constructor(attachment: AttachmentPoint) {
    this.name = <string>attachment.name.get();
    this.bone = attachment.bone;
  }
}
