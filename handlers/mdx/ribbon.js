function MdxRibbon() {
    this.location = vec3.create();
    this.health = 0;
    this.p1 = vec3.create();
    this.p2 = vec3.create();
    this.lastRibbon = null;
}

MdxRibbon.prototype = {
    reset(emitter, view, slot) {
        let instance = view.instance,
            node = instance.skeleton.nodes[emitter.node.index],
            location = node.pivot,
            p1 = this.p1,
            p2 = this.p2;

        p1[0] = location[0];
        p1[1] = location[1] - emitter.getHeightBelow(instance);
        p1[2] = location[2];
        vec3.transformMat4(p1, p1, node.worldMatrix);

        p2[0] = location[0];
        p2[1] = location[1] + emitter.getHeightAbove(instance);
        p2[2] = location[2];
        vec3.transformMat4(p2, p2, node.worldMatrix);

        this.view = view;
        this.lastRibbon = view.lastRibbon;
        this.health = emitter.lifespan;
        this.slot = slot;

        view.activeRibbons += 1;
    },

    update(emitter) {
        let dt = emitter.model.env.frameTime * 0.001,
            gravity = emitter.gravity * dt * dt;

        this.health -= dt;
        this.p1[1] -= gravity;
        this.p2[1] -= gravity;
    },

    kill() {
        this.view.activeRibbons -= 1;
    }
};
