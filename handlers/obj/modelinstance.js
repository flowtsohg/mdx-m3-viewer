function ObjModelInstance(env) {
    // Run the base ModelInstance constructor.
    ModelInstance.call(this, env);
}

ObjModelInstance.prototype = {
    // This method will be called when the instance is ready.
    // This is either right after creating it, or, in the case the model is still loading, when it finishes to load.
    initialize() {
        // Let's give every instance its own color!
        this.color = [Math.random(), Math.random(), Math.random()];
    },

    // This is where you update any instance-related logic (e.g. update skeletons, and whatnot).
    // In this case, there's no real logic to run.
    update() {

    }
};

// Inherit from ModelInstance.
mix(ObjModelInstance.prototype, ModelInstance.prototype);
