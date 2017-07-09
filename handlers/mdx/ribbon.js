/**
 * @constructor
 * @param {MdxRibbonEmitter} emitter
 */
function MdxRibbon(emitter) {
    this.emitter = emitter;
    this.health = 0;
    this.emitterView = null;

    this.vertices = new Float32Array(12);
    this.lta = 0;
    this.lba = 0;
    this.rta = 0;
    this.rba = 0;
    this.rgb = 0;
}

MdxRibbon.prototype = {
    reset(emitterView) {
        let instance = emitterView.instance,
            emitter = this.emitter,
            vertices = this.vertices,
            node = instance.skeleton.nodes[emitter.node.index],
            pivot = node.pivot,
            below = vec3.heap,
            above = vec3.heap2,
            animatedColor = emitterView.getColor(),
            animatedAlpha = emitterView.getAlpha(),
            animatedSlot = emitterView.getTextureSlot();

        this.emitterView = emitterView;

        vec3.set(below, pivot[0], pivot[1] - emitterView.getHeightBelow(), pivot[2])
        vec3.transformMat4(below, below, node.worldMatrix);

        vec3.set(above, pivot[0], pivot[1] + emitterView.getHeightAbove(), pivot[2])
        vec3.transformMat4(above, above, node.worldMatrix);

        let lastEmit = emitterView.lastEmit;

        // If this isn't the first ribbon, construct a quad.
        // Otherwise, the vertices will be filled with zeroes, and the ribbon will not render.
        // This allows the emitter to always work with quads, and therefore it can work with many views, because the ribbon chains are implicit.
        if (lastEmit && lastEmit.health > 0) {
            let lastVertices = lastEmit.vertices;

            // Order: above below below above, counter clockwise

            vertices[0] = lastVertices[9];
            vertices[1] = lastVertices[10];
            vertices[2] = lastVertices[11];
            vertices[3] = lastVertices[6];
            vertices[4] = lastVertices[7];
            vertices[5] = lastVertices[8];

            vertices[6] = below[0];
            vertices[7] = below[1];
            vertices[8] = below[2];
            vertices[9] = above[0];
            vertices[10] = above[1];
            vertices[11] = above[2];

            // Since ribbons are formally lines and not quads, once the previous ribbon dies, this quad is no longer supposed to be a quad.
            // Therefore, the health of this quad is the health of the previous ribbon.
            this.health = emitter.lifespan;
        } else {
            vertices[0] = 0;
            vertices[1] = 0;
            vertices[2] = 0;
            vertices[3] = 0;
            vertices[4] = 0;
            vertices[5] = 0;
            vertices[6] = 0;
            vertices[7] = 0;
            vertices[8] = 0;
            vertices[9] = 0;
            vertices[10] = 0;
            vertices[11] = 0;

            this.health = emitter.lifespan;
        }

        let columns = emitter.dimensions[0],
            left = animatedSlot % columns,
            top = Math.floor(animatedSlot / columns),
            right = left + 1,
            bottom = top + 1;

        this.lta = encodeFloat3(right, bottom, animatedAlpha);
        this.lba = encodeFloat3(left, bottom, animatedAlpha);
        this.rta = encodeFloat3(right, top, animatedAlpha);
        this.rba = encodeFloat3(left, top, animatedAlpha);
        this.rgb = encodeFloat3(animatedColor[0], animatedColor[1], animatedColor[2]);
    },

    update() {
        let emitter = this.emitter,
            dt = emitter.model.env.frameTime * 0.001,
            gravity = emitter.gravity * dt * dt,
            vertices = this.vertices;

        this.health -= dt;

        vertices[1] -= gravity;
        vertices[4] -= gravity;
        vertices[7] -= gravity;
        vertices[10] -= gravity;
    }
};
