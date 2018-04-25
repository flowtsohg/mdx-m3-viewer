export default class MdxSharedEmitter {
    /**
     * @param {MdxModel} model
     * @param {MdxModelParticleEmitter} modelObject
     */
    constructor(modelObject) {
        this.modelObject = modelObject;
        this.active = [];
        this.inactive = [];
    }

    update(instances, scene) {
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
    }

    updateData() {

    }

    render(bucket, shader) {

    }
};
