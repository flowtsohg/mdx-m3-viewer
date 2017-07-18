/**
 * @constructor
 * @param {MdxEventObjectEmitter} emitter
 */
function MdxEventObjectSpn(emitter) {
    this.emitter = emitter;
    this.health = 0;
    this.internalInstance = emitter.internalModel.addInstance();
}

MdxEventObjectSpn.prototype = {
    reset(emitterView) {
        let instance = this.internalInstance,
            node = emitterView.instance.skeleton.nodes[this.emitter.node.index];

        instance.setSequence(0);
        instance.setTransformation(node.worldLocation, node.worldRotation, node.worldScale);
        instance.show();

        emitterView.instance.scene.addInstance(instance);

        this.health = 1;
    },

    update() {
        let instance = this.internalInstance;

        // Once the sequence finishes, this event object dies
        if (instance.frame >= instance.model.sequences[0].interval[1]) {
            this.health = 0;

            instance.hide();
        }
    }
};
