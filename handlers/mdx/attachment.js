/**
 * @constructor
 * @param {MdxInstance} instance
 * @param {MdxAttachment} attachment
 */
function MdxAttachment(instance, attachment) {
    let internalInstance = attachment.internalModel.addInstance();

    internalInstance.setSequenceLoopMode(2);
    internalInstance.dontInheritScale = false;
    internalInstance.hide();

    instance.whenLoaded(() => internalInstance.setParent(instance.skeleton.nodes[attachment.node.objectId]));

    this.instance = instance;
    this.attachment = attachment;
    this.internalInstance = internalInstance;
}

MdxAttachment.prototype = {
    update() {
        let internalInstance = this.internalInstance;

        if (this.attachment.getVisibility(this.instance) > 0.1) {
            // The parent instance might not actually be in a scene.
            // This happens if loading a local model, where loading is instant and adding to a scene always comes afterwards.
            // Therefore, do it here dynamically.
            this.instance.scene.addInstance(internalInstance);

            if (internalInstance.hidden()) {
                internalInstance.show();

                // Every time the attachment becomes visible again, restart its first sequence.
                internalInstance.setSequence(0);
            }
        } else {
            internalInstance.hide();
        }
    }
};

/**
 * @constructor
 * @param {MdxModel} model
 * @param {MdxParserAttachment} attachment
 */
function MdxModelAttachment(model, attachment) {
    let path = attachment.path.replace(/\\/g, "/").toLowerCase().replace(".mdl", ".mdx");

    this.node = model.nodes[attachment.node.index];
    this.path = path;
    this.attachmentId = attachment.attachmentId;
    this.sd = new MdxSdContainer(model, attachment.tracks);

    // Second condition is against custom resources using arbitrary paths...
    if (path !== "" && path.indexOf(".mdx") != -1) {
        this.internalModel = model.env.load(path, model.pathSolver);
    }
}

MdxModelAttachment.prototype = {
    getVisibility(instance) {
        return this.sd.getValue("KATV", instance, 1);
    }
};
