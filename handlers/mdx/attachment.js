function MdxAttachment(attachment, model) {
    this.node = attachment.node;
    this.path = attachment.path;
    this.attachmentId = attachment.attachmentId;
    this.sd = new MdxSdContainer(attachment.tracks, model);
}

MdxAttachment.prototype = {
    getVisibility(instance) {
        return this.sd.getKATVValue(instance, 1);
    }
};
