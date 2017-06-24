/**
 * @constructor
 * @param {MdxEventObjectEmitter} emitterView
 */
function MdxEventObjectSpl(emitter) {
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

MdxEventObjectSpl.prototype = {
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
            columns = emitter.columns,
            first = emitter.firstIntervalTime,
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
            interval = emitter.firstInterval;
            firstColor = 0;
        } else {
            factor = (time - first) / emitter.secondIntervalTime;
            interval = emitter.secondInterval;
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
        this.lta = encodeFloat3(left, top, a);
        this.lba = encodeFloat3(left, bottom, a);
        this.rta = encodeFloat3(right, top, a);
        this.rba = encodeFloat3(right, bottom, a);
        this.rgb = encodeFloat3(color[0], color[1], color[2]);
    }
};
