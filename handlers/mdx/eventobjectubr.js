/**
 * @constructor
 * @param {MdxEventObjectEmitter} emitterView
 */
function MdxEventObjectUbr(emitter) {
    this.emitter = emitter;
    this.health = emitter.lifespan;
    this.color = new Uint8Array(4);
    this.vertices = new Float32Array(12);
    this.lta = 0;
    this.lba = 0;
    this.rta = 0;
    this.rba = 0;
    this.rgb = 0;
}

MdxEventObjectUbr.prototype = {
    reset(emitterView) {
        let emitter = this.emitter,
            vertices = this.vertices,
            emitterScale = emitter.scale,
            node = emitterView.instance.skeleton.nodes[emitter.node.index],
            location = node.worldLocation,
            scale = node.worldScale,
            px = location[0],
            py = location[1],
            pz = location[2];

        vertices[0] = px - emitterScale * scale[0];
        vertices[1] = py - emitterScale * scale[1];
        vertices[2] = pz;
        vertices[3] = px - emitterScale * scale[0];
        vertices[4] = py + emitterScale * scale[1];
        vertices[5] = pz;
        vertices[6] = px + emitterScale * scale[0];
        vertices[7] = py + emitterScale * scale[1];
        vertices[8] = pz;
        vertices[9] = px + emitterScale * scale[0];
        vertices[10] = py - emitterScale * scale[1];
        vertices[11] = pz;
    },

    update() {
        let emitter = this.emitter,
            first = emitter.firstIntervalTime,
            second = emitter.secondIntervalTime,
            third = emitter.thirdIntervalTime,
            colors = emitter.colors,
            color = this.color;

        this.health -= emitter.model.env.frameTime * 0.001;

        // Opposite of health
        let time = emitter.lifespan - this.health;
        
        if (time < first) {
            vec4.lerp(color, colors[0], colors[1], time / first);
        } else if (time < first + second) {
            vec4.copy(color, emitter.colors[1]);
        } else {
            vec4.lerp(color, colors[1], colors[2], (time - first - second) / third);
        }

        // Calculate the UV rectangle.
        let a = color[3];

        // Encode the UV rectangle and color in floats.
        // This is a shader optimization.
        this.lta = encodeFloat3(0, 0, a);
        this.lba = encodeFloat3(0, 1, a);
        this.rta = encodeFloat3(1, 0, a);
        this.rba = encodeFloat3(1, 1, a);
        this.rgb = encodeFloat3(color[0], color[1], color[2]);
    }
};
