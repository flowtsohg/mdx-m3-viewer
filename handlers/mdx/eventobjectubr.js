/**
 * @constructor
 * @param {MdxEventObjectEmitter} emitterView
 */
function MdxEventObjectUbr(emitter) {
    this.emitter = emitter;
    this.health = emitter.lifespan;
    this.location = vec3.create();
    this.scale = vec3.create();
    this.color = vec4.create();
    this.index = 0;
}

MdxEventObjectUbr.prototype = {
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
    }
};
