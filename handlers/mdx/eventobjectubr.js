/**
 * @constructor
 * @param {MdxEventObjectEmitter} emitter
 */
function MdxEventObjectUbr(emitter) {
    this.emitter = emitter;
    this.health = 0;
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
            vertex;

        vertex = new Float32Array(vertices.buffer, 0, 3);
        vec3.transformMat4(vertex, [-emitterScale, -emitterScale, 0], node.worldMatrix);
        vec3.add(vertex, vertex, location);

        vertex = new Float32Array(vertices.buffer, 12, 3);
        vec3.transformMat4(vertex, [-emitterScale, emitterScale, 0], node.worldMatrix);
        vec3.add(vertex, vertex, location);

        vertex = new Float32Array(vertices.buffer, 24, 3);
        vec3.transformMat4(vertex, [emitterScale, emitterScale, 0], node.worldMatrix);
        vec3.add(vertex, vertex, location);

        vertex = new Float32Array(vertices.buffer, 36, 3);
        vec3.transformMat4(vertex, [emitterScale, -emitterScale, 0], node.worldMatrix);
        vec3.add(vertex, vertex, location);

        this.health = emitter.lifespan;
    },

    update() {
        let emitter = this.emitter,
            intervalTimes = emitter.intervalTimes,
            first = intervalTimes[0],
            second = intervalTimes[1],
            third = intervalTimes[2],
            colors = emitter.colors,
            color = this.color;

        this.health -= emitter.model.env.frameTime * 0.001;

        // Inverse of health
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
        this.lta = encodeFloat3(1, 0, a);
        this.lba = encodeFloat3(0, 0, a);
        this.rta = encodeFloat3(1, 1, a);
        this.rba = encodeFloat3(0, 1, a);
        this.rgb = encodeFloat3(color[0], color[1], color[2]);
    }
};
