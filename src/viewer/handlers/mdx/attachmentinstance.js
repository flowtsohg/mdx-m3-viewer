
// Heap allocations needed for this module.
let visibilityHeap = new Float32Array(1);

/**
 * An attachment instance.
 */
export default class AttachmentInstance {
  /**
   * @param {ModelInstance} instance
   * @param {Attachment} attachment
   */
  constructor(instance, attachment) {
    let internalModel = attachment.internalModel;
    let internalInstance = internalModel.addInstance();

    internalInstance.setSequenceLoopMode(2);
    internalInstance.dontInheritScale = false;
    internalInstance.hide();
    internalInstance.setParent(instance.nodes[attachment.objectId]);

    this.instance = instance;
    this.attachment = attachment;
    this.internalInstance = internalInstance;
  }

  /**
   *
   */
  update() {
    let internalInstance = this.internalInstance;

    if (internalInstance.model.ok) {
      this.attachment.getVisibility(visibilityHeap, this.instance);

      if (visibilityHeap[0] > 0.1) {
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
}
