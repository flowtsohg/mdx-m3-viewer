/**
 * @constructor
 * @param {MdxEventObjectEmitter} emitterView
 */
function MdxEventObjectSpl(emitter) {
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

MdxEventObjectSpl.prototype = {
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
            columns = emitter.dimensions[0],
            intervalTimes = emitter.intervalTimes,
            intervals = emitter.intervals,
            first = intervalTimes[0],
            second = intervalTimes[1],
            colors = emitter.colors,
            color = this.color,
            factor,
            interval,
            firstColor,
            index;

        this.health -= emitter.model.env.frameTime * 0.001;

        // Inverse of health
        let time = emitter.lifespan - this.health;
        
        if (time < first) {
            factor = time / first;
            interval = intervals[0];
            firstColor = 0;
        } else {
            factor = (time - first) / second;
            interval = intervals[1];
            firstColor = 1;
        }

        // Interpolated color
        vec4.lerp(color, colors[firstColor], colors[firstColor + 1], factor);
        
        // The texture portion to index
        index = Math.floor(Math.lerp(interval[0], interval[1], factor));

        // Calculate the UV rectangle.
        let left = index % columns,
            top = Math.floor(index / columns),
            right = left + 1,
            bottom = top + 1,
            a = color[3];

        // Encode the UV rectangle and color in floats.
        // This is a shader optimization.
        this.lta = encodeFloat3(right, bottom, a);
        this.lba = encodeFloat3(left, bottom, a);
        this.rta = encodeFloat3(right, top, a);
        this.rba = encodeFloat3(left, top, a);
        this.rgb = encodeFloat3(color[0], color[1], color[2]);
    }
};
