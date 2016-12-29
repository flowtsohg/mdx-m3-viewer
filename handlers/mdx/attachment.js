function MdxAttachment(attachment, model) {
    const path = attachment.path.replace(/\\/g, "/").toLowerCase().replace(".mdl", ".mdx");

    this.node = attachment.node;
    this.path = path;
    this.attachmentId = attachment.attachmentId;
    this.sd = new MdxSdContainer(attachment.tracks, model);

    // Second condition is against custom resources using arbitrary paths...
    if (path !== "" && path.indexOf(".mdx") != -1) {
        this.attachedModel = model.env.load(path, model.pathSolver);
    }
}

MdxAttachment.prototype = {
    getVisibility(instance) {
        return this.sd.getValue("KATV", instance, 1);
    }
};
