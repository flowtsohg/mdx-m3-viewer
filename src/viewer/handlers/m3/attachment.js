/**
 * An M3 attachment.
 */
export default class M3Attachment {
  /**
   * @param {Attachment} attachment
   */
  constructor(attachment) {
    /** @member {string} */
    this.name = attachment.name.getAll().join('');
    /** @member {number} */
    this.bone = attachment.bone;
  }
}
