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
            above = vec3.heap2;

        this.emitterView = emitterView;

        vec3.set(below, pivot[0], pivot[1] - emitterView.getHeightBelow(), pivot[2])
        vec3.transformMat4(below, below, node.worldMatrix);

        vec3.set(above, pivot[0], pivot[1] + emitterView.getHeightAbove(), pivot[2])
        vec3.transformMat4(above, above, node.worldMatrix);

        this.index = emitterView.currentRibbon++;

        emitterView.ribbonCount++;

        this.health = emitter.lifespan;

        let lastEmit = emitterView.lastEmit;
        
        // If this isn't the first ribbon, construct a quad.
        // Otherwise, the vertices will be filled with zeroes, and the ribbon will not render.
        // This allows the emitter to always work with quads, and therefore it can work with many views, because the ribbon chains are implicit.
        if (lastEmit && lastEmit.health > 0) {
            let lastVertices = lastEmit.vertices;

            // Left top
            vertices[0] = above[0];
            vertices[1] = above[1];
            vertices[2] = above[2];

            // Left bottom
            vertices[3] = below[0];
            vertices[4] = below[1];
            vertices[5] = below[2];

            // Right bottom
            vertices[6] = lastVertices[3];
            vertices[7] = lastVertices[4];
            vertices[8] = lastVertices[5];

            // Right top
            vertices[9] = lastVertices[0];
            vertices[10] = lastVertices[1];
            vertices[11] = lastVertices[2];
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
        }
    },

    update() {
        let emitter = this.emitter,
            emitterView = this.emitterView,
            dt = emitter.model.env.frameTime * 0.001,
            gravity = emitter.gravity * dt * dt,
            vertices = this.vertices,
            animatedColor = emitterView.getColor(),
            animatedAlpha = emitterView.getAlpha(),
            animatedSlot = emitterView.getTextureSlot(),
            chainLengthFactor = 1 / emitterView.ribbonCount,
            locationInChain = (emitterView.currentRibbon - this.index - 1);

        this.health -= dt;

        vertices[1] -= gravity;
        vertices[4] -= gravity;
        vertices[7] -= gravity;
        vertices[10] -= gravity;

        if (this.health <= 0) {
            emitterView.ribbonCount--;
        }

        let columns = emitter.dimensions[0],
            left = (animatedSlot % columns) + (locationInChain * chainLengthFactor),
            top = Math.floor(animatedSlot / columns),
            right = left + chainLengthFactor,
            bottom = top + 1;

        left = Math.floor(left * 255);
        top = Math.floor(top * 255);
        right = Math.floor(right * 253); // Paladin - when the UV rectangle reaches 254-255, it has a row or two of white pixels in the end for some reason.
        bottom = Math.floor(bottom * 255);
        animatedAlpha = Math.floor(animatedAlpha * 255);

        this.lta = encodeFloat3(left, top, animatedAlpha);
        this.lba = encodeFloat3(left, bottom, animatedAlpha);
        this.rta = encodeFloat3(right, top, animatedAlpha);
        this.rba = encodeFloat3(right, bottom, animatedAlpha);
        this.rgb = encodeFloat3(Math.floor(animatedColor[0] * 255), Math.floor(animatedColor[1] * 255), Math.floor(animatedColor[2] * 255)); // Color even used???
    }
};
