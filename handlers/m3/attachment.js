/**
 * @constructor
 * @param {M3ParserAttachmentPoint} attachment
 */
function M3Attachment(attachment) {
    this.name = attachment.name.getAll().join("");
    this.bone = attachment.bone;
}

export default M3Attachment;
