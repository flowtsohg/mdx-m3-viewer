function MdxRibbon(emitter, instance) {
    this.instance = instance;

    this.alive = true;
    this.health = emitter.lifespan;

    var position = emitter.node.pivot;
    var heightBelow = emitter.getHeightBelow(instance);
    var heightAbove = emitter.getHeightAbove(instance);

    var p1 = [position[0], position[1] - heightBelow, position[2]];
    var p2 = [position[0], position[1] + heightAbove, position[2]];

    vec3.transformMat4(p1, p1, emitter.node.worldMatrix);
    vec3.transformMat4(p2, p2, emitter.node.worldMatrix);

    this.p1 = p1;
    this.p2 = p2;
}

MdxRibbon.prototype = {
    update(emitter, viewer) {
        this.health -= viewer.frameTimeS;

        var zvelocity = emitter.gravity * viewer.frameTimeS * viewer.frameTimeS;

        this.p1[2] -= zvelocity;
        this.p2[2] -= zvelocity;
    }
};
