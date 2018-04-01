export default class MdxEventObjectSpn {
    /**
     * @param {MdxEventObjectEmitter} emitter
     */
    constructor(emitter) {
        this.emitter = emitter;
        this.health = 0;
        this.internalResource = emitter.modelObject.internalResource.addInstance();
    }

    reset(emitterView) {
        let instance = this.internalResource,
            node = emitterView.instance.skeleton.nodes[this.emitter.modelObject.index];

        instance.setSequence(0);
        instance.setTransformation(node.worldLocation, node.worldRotation, node.worldScale);
        instance.show();

        emitterView.instance.scene.addInstance(instance);

        this.health = 1;
    }

    update() {
        let instance = this.internalResource;

        // Once the sequence finishes, this event object dies
        if (instance.frame >= instance.model.sequences[0].interval[1]) {
            this.health = 0;

            instance.hide();
        }
    }
};
