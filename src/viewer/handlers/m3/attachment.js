export default class M3Attachment {
    /**
     * @param {M3ParserAttachmentPoint} attachment
     */
    constructor(attachment) {
        this.name = attachment.name.getAll().join('');
        this.bone = attachment.bone;
    }
};
