function GeometryModelInstance(env) {
    ModelInstance.call(this, env);
}

GeometryModelInstance.prototype = {
    initialize() {

    },

    setSharedData(sharedData) {
        this.boneArray = sharedData.boneArray;
    },

    update() {
        mat4.copy(this.boneArray, this.worldMatrix);
    }
};

mix(GeometryModelInstance.prototype, ModelInstance.prototype);
