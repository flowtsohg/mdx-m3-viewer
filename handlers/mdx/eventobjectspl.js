/**
 * @constructor
 * @param {MdxEventObjectEmitter} emitterView
 */
function MdxEventObjectSpl(emitter) {
    this.emitter = emitter;
    this.health = emitter.lifespan;
    this.location = vec3.create();
    this.scale = vec3.create();
    this.color = vec4.create();
    this.index = 0;
}

MdxEventObjectSpl.prototype = {
    reset(emitterView) {
        let emitter = this.emitter,
            node = emitterView.instance.skeleton.nodes[emitter.node.index];

        vec3.copy(this.location, node.worldLocation);
        vec3.copy(this.scale, node.worldScale);
    },

    update() {
        let emitter = this.emitter,
            first = emitter.firstIntervalTime,
            second = emitter.secondIntervalTime,
            colors = emitter.colors,
            color = this.color,
            factor,
            interval,
            index;

        this.health -= emitter.model.env.frameTime * 0.001;

        // Opposite of health
        let time = emitter.lifespan - this.health;
        
        if (time < first) {
            factor = time / first;
            interval = emitter.firstInterval;

            vec4.lerp(color, colors[0], colors[1], factor);
            index = Math.lerp(interval[0], interval[1], factor);
        } else {
            factor = (time - first) / second;
            interval = emitter.secondInterval;

            vec4.lerp(color, colors[1], colors[2], factor);
            index = Math.lerp(interval[0], interval[1], factor);
        }

        this.index = Math.floor(index);
    }
};
