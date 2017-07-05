/**
 * @constructor
 * @param {MdxInstance} instance
 * @param {MdxAttachment} attachment
 */
function MdxShallowAttachment(instance, attachment) {
    let internalInstance = attachment.internalModel.addInstance();

    instance.scene.addInstance(internalInstance);

    internalInstance.setSequenceLoopMode(2);
    internalInstance.dontInheritScale = false;
    internalInstance.hide();

    instance.whenLoaded(() => internalInstance.setParent(instance.skeleton.nodes[attachment.node.objectId]));

    this.instance = instance;
    this.attachment = attachment;
    this.internalInstance = internalInstance;
}

MdxShallowAttachment.prototype = {
    update() {
        let internalInstance = this.internalInstance;

        if (this.attachment.getVisibility(this.instance) > 0.1) {
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
function MdxAttachment(model, attachment) {
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

MdxAttachment.prototype = {
    getVisibility(instance) {
        return this.sd.getValue("KATV", instance, 1);
    }
};
