function GeometryModelInstance(env) {
    ModelInstance.call(this, env);
}

GeometryModelInstance.prototype = {
    initialize() {

    },

    setSharedData(sharedData) {
        this.sharedWorldMatrix = sharedData.boneArray;
        //this.sharedMemory = sharedData.sharedMemory;
    },

    update() {
        //this.move([Atomics.load(this.sharedMemory, 0), 0, 0]);
        mat4.copy(this.sharedWorldMatrix, this.worldMatrix);
    }
};

mix(GeometryModelInstance.prototype, ModelInstance.prototype);
