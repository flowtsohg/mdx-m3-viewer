Mdx.Attachment = function (attachment, model) {
    this.node = attachment.node;
    this.path = attachment.path;
    this.attachmentId = attachment.attachmentId;
    this.sd = new Mdx.SDContainer(attachment.tracks, model);
}

Mdx.Attachment.prototype = {
    getVisibility: function (sequence, frame, counter) {
        return this.sd.getKATV(sequence, frame, counter, 1);
    }
};
