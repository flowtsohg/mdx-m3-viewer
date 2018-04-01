export default class AttachmentInstance {
    /**
     * @param {MdxInstance} instance
     * @param {MdxAttachment} attachment
     */
    constructor(instance, attachment) {
        let internalInstance = attachment.internalModel.addInstance();

        internalInstance.setSequenceLoopMode(2);
        internalInstance.dontInheritScale = false;
        internalInstance.hide();

        instance.whenLoaded(() => internalInstance.setParent(instance.skeleton.nodes[attachment.objectId]));

        this.instance = instance;
        this.attachment = attachment;
        this.internalInstance = internalInstance;
    }

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
