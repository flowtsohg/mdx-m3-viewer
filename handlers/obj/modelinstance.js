import ModelInstance from '../../src/modelinstance';

/**
 * @constructor
 * @augments ModelInstance
 * @memberOf Obj
 * @param {ObjModel} model
 */
function ObjModelInstance(model) {
    // Run the base ModelInstance constructor.
    ModelInstance.call(this, model);
}

ObjModelInstance.prototype = {
    // This method will be called when the instance is ready.
    // This is either right after creating it, or, in the case the model is still loading, when it finishes to load.
    initialize() {
        // Let's give every instance its own color!
        this.color = new Float32Array([Math.random(), Math.random(), Math.random()]);
    },

    // This is where you update any instance-related logic (e.g. update skeletons, and whatnot).
    // In this case, there's no real logic to run.
    update() {

    }
};

// Inherit from ModelInstance.
require('../../src/common').mix(ObjModelInstance.prototype, ModelInstance.prototype);

export default ObjModelInstance;
