/**
 * @constructor
 * @param {TexruredModelView} modelView
 * @param {MdxParserParticleEmitter} emitter
 */
function MdxParticleEmitter(model, emitter) {
    mix(this, emitter);

    this.model = model;
    this.internalModel = model.env.load(emitter.path.replace(/\\/g, "/").toLowerCase().replace(".mdl", ".mdx"), model.pathSolver);
    this.particles = [];
    this.inactive = [];
    this.sd = new MdxSdContainer(model, emitter.tracks);
}

MdxParticleEmitter.prototype = {
    emit(instance) {
        let inactive = this.inactive,
            particle;

        if (inactive.length) {
            particle = inactive.pop();
        } else {
            particle = new MdxParticle(this);
        }

        particle.reset(instance);

        this.particles.push(particle);
    },

    update() {
        let particles = this.particles,
            inactive = this.inactive;

        if (particles.length > 0) {
            // First stage: remove dead particles.
            // The used particles array is a queue, dead particles will always come first.
            // As of the time of writing, the easiest and fastest way to implement a queue in Javascript is a normal array.
            // To add items, you push, to remove items, the array is reversed and you pop.
            // So the first stage reverses the array, and then keeps checking the last element for its health.
            // As long as we hit a dead particle, pop, and check the new last element.

            // Ready for pop mode
            particles.reverse();

            let particle = particles[particles.length - 1];
            while (particle && particle.health <= 0) {
                inactive.push(particles.pop());

                // Need to recalculate the length each time
                particle = particles[particles.length - 1];
            }

            // Ready for push mode
            particles.reverse()

            // Second stage: update the living particles.
            // All the dead particles were removed, so a simple loop is all that's required.
            for (let i = 0, l = particles.length; i < l; i++) {
                particles[i].update();
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
