/**
 * @constructor
 * @param {MdxModel} model
 * @param {MdxParserParticleEmitter} emitter
 */
function MdxParticleEmitter(model, emitter) {
    this.speed = emitter.speed;
    this.latitude = emitter.latitude;
    this.longitude = emitter.longitude;
    this.lifespan = emitter.lifespan;
    this.gravity = emitter.gravity;
    this.emissionRate = emitter.emissionRate;

    this.model = model;
    this.internalModel = model.env.load(emitter.path.replace(/\\/g, "/").toLowerCase().replace(".mdl", ".mdx"), model.pathSolver);
    this.node = model.nodes[emitter.node.index];
    this.sd = new MdxSdContainer(model, emitter.tracks);

    this.active = [];
    this.inactive = [];
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

    update(scene) {
        let active = this.active,
            inactive = this.inactive;

        if (active.length > 0) {
            // First update all of the active particles
            for (let i = 0, l = active.length; i < l; i++) {
                active[i].update(scene);
            }

            // Reverse the array
            active.reverse();

            // All dead active particles will now be at the end of the array, so pop them
            let object = active[active.length - 1];
            while (object && object.health <= 0) {
                inactive.push(active.pop());

                // Need to recalculate the length each time
                object = active[active.length - 1];
            }

            // Reverse the array again
            active.reverse()

            this.updateData();
        }
    },

    updateData() {

    },

    render(bucket, shader) {
        
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
