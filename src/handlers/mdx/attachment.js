Mdx.Attachment = function (attachment, model) {
    this.node = attachment.node;
    this.path = attachment.path;
    this.attachmentId = attachment.attachmentId;
    this.name = model.nodes[this.node].name;
    this.sd = Mdx.parseSDTracks(attachment.tracks, model);
}
