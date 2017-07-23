import MdxParticle from "./particle";

/**
 * @constructor
 * @param {MdxModel} model
 * @param {MdxModelParticleEmitter} modelObject
 */
function MdxParticleEmitter(modelObject) {
    this.modelObject = modelObject;

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
        return this.modelObject.sd.getValue("KPES", instance, this.modelObject.speed);
    },

    getLatitude(instance) {
        return this.modelObject.sd.getValue("KPLTV", instance, this.modelObject.latitude);
    },

    getLongitude(instance) {
        return this.modelObject.sd.getValue("KPLN", instance, this.modelObject.longitude);
    },

    getLifespan(instance) {
        return this.modelObject.sd.getValue("KPEL", instance, this.modelObject.lifespan);
    },

    getGravity(instance) {
        return this.modelObject.sd.getValue("KPEG", instance, this.modelObject.gravity);
    },

    getEmissionRate(instance) {
        return this.modelObject.sd.getValue("KPEE", instance, this.modelObject.emissionRate);
    },

    getVisibility(instance) {
        return this.modelObject.sd.getValue("KPEV", instance, 1);
    }
};

export default MdxParticleEmitter;
