/**
 * @constructor
 * @param {MdxModel} model
 * @param {MdxParserParticleEmitter} emitter
 */
function MdxParticleEmitter(model, emitter) {
    mix(this, emitter);

    this.model = model;
    this.internalModel = model.env.load(emitter.path.replace(/\\/g, "/").toLowerCase().replace(".mdl", ".mdx"), model.pathSolver);
    this.active = [];
    this.inactive = [];
    this.sd = new MdxSdContainer(model, emitter.tracks);
}

MdxParticleEmitter.prototype = {
    emit(emitterView) {
        let inactive = this.inactive,
            object;

        if (inactive.length) {
            object = inactive.pop();
        } else {
            object = new MdxParticle(this);
        }

        object.reset(emitterView);

        this.active.push(object);
    },

    update() {
        let active = this.active,
            inactive = this.inactive;

        if (active.length > 0) {
            // First stage: remove dead particles.
            // The used particles array is a queue, dead particles will always come first.
            // As of the time of writing, the easiest and fastest way to implement a queue in Javascript is a normal array.
            // To add items, you push, to remove items, the array is reversed and you pop.
            // So the first stage reverses the array, and then keeps checking the last element for its health.
            // As long as we hit a dead particle, pop, and check the new last element.

            // Ready for pop mode
            active.reverse();

            let object = active[active.length - 1];
            while (object && object.health <= 0) {
                inactive.push(active.pop());

                object.kill();

                // Need to recalculate the length each time
                object = active[active.length - 1];
            }

            // Ready for push mode
            active.reverse()

            // Second stage: update the living particles.
            // All the dead particles were removed, so a simple loop is all that's required.
            for (let i = 0, l = active.length; i < l; i++) {
                active[i].update();
            }
        }
    },

    render() {
        
    },

    shouldRender(instance) {
        return this.getVisibility(instance) > 0.75;
    },

    getSpeed(instance) {
        return this.sd.getValue("KPES", instance, this.speed);
    },

    getLatitude(instance) {
        return this.sd.getValue("KPLTV", instance, this.latitude);
    },

    getLongitude(instance) {
        return this.sd.getValue("KPLN", instance, this.longitude);
    },

    getLifespan(instance) {
        return this.sd.getValue("KPEL", instance, this.lifespan);
    },

    getGravity(instance) {
        return this.sd.getValue("KPEG", instance, this.gravity);
    },

    getEmissionRate(instance) {
        return this.sd.getValue("KPEE", instance, this.emissionRate);
    },

    getVisibility(instance) {
        return this.sd.getValue("KPEV", instance, 1);
    }
};
