export default class AttachmentInstance {
    constructor(instance, attachment) {
        let internalModel = attachment.internalModel,
            internalInstance = internalModel.addInstance();

        internalInstance.setSequenceLoopMode(2);
        internalInstance.dontInheritScale = false;
        internalInstance.hide();
        internalInstance.setParent(instance.nodes[attachment.objectId]) 

        this.instance = instance;
        this.attachment = attachment;
        this.internalInstance = internalInstance;
    }

    update() {
        let internalInstance = this.internalInstance;

        if (internalInstance.model.loaded) {
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
    }
};
