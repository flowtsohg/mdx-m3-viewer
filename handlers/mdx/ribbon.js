/**
 * @constructor
 * @param {MdxRibbonEmitter} emitter
 */
function MdxRibbon(emitter) {
    this.emitter = emitter;
    this.location = vec3.create();
    this.below = vec3.create();
    this.above = vec3.create();
    this.health = 0;
    this.emitterView = null;
    this.lastEmit = null;
}

MdxRibbon.prototype = {
    reset(emitterView) {
        let instance = emitterView.instance,
            emitter = this.emitter,
            node = instance.skeleton.nodes[emitter.node.index],
            pivot = node.pivot,
            below = this.below,
            above = this.above;

        below[0] = pivot[0];
        below[1] = pivot[1] - emitter.getHeightBelow(instance);
        below[2] = pivot[2];
        vec3.transformMat4(below, below, node.worldMatrix);

        above[0] = pivot[0];
        above[1] = pivot[1] + emitter.getHeightAbove(instance);
        above[2] = pivot[2];
        vec3.transformMat4(above, above, node.worldMatrix);

        this.health = emitter.lifespan;
        this.emitterView = emitterView;
        this.lastEmit = emitterView.lastEmit;
    },

    update() {
        let emitter = this.emitter,
            dt = emitter.model.env.frameTime * 0.001,
            gravity = emitter.gravity * dt * dt;

        this.health -= dt;
        this.below[1] -= gravity;
        this.above[1] -= gravity;
    }
};
