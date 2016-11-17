/**
 * @class
 * @classdesc A bucket of instances. Used for batch rendering of many instances at the same time, using instanced rendering.
 * @param {ModelView} modelView The view this bucket belongs to.
 */
function Bucket(modelView) {
    /** @member {ModelView} */
    this.modelView = modelView;
    /** @member {Model} */
    this.model = modelView.model;
    /** @member {ModelInstance[]} */
    this.instances = [];
    /** @member {map.<ModelInstance, number>} */
    this.instanceToIndex = new Map();

    // The index buffer is used instead of gl_InstanceID, which isn't defined in WebGL shaders
    // It's a simple buffer of indices, [0, 1, ..., this.size - 1]
    const gl = this.model.env.gl;
    this.instanceIdBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceIdBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(this.size).map((currentValue, index, array) => index), gl.STATIC_DRAW);
}

Bucket.prototype = {
    get objectType() {
        return "bucket";
    },

    // The capacity of this bucket, override at will
    // TODO: This should possibly be dynamic, although tests in the past have shown it to be slower for some unknown reason
    //       For example, the bucket size of a simple model can probably be a lot bigger than that of a complex one
    /** @member {number} */
    get size() {
        return 256;
    },

    update() {
        //throw "Bucket.update must be overriden!";
    },

    getSharedData(index) {
        //throw "Bucket.getSharedData must be overriden!";
    },

    isFull() {
        return this.instances.length === this.size;
    },

    update() {
        const instances = this.instances;

        for (let i = 0, l = instances.length; i < l; i++) {
            const instance = instances[i];

            instance.preemptiveUpdate();

            if (instance.noCulling || this.isVisible(instance)) {
                instance.update();
            }
        }
    },

    isVisible(instance) {
        //*
        const ndc = vec3.heap,
            worldProjectionMatrix = this.model.env.camera.worldProjectionMatrix;

        // This test checks whether the instance's position is visible in NDC space. In other words, that it lies in [-1, 1] on all axes
        vec3.transformMat4(ndc, instance.worldLocation, worldProjectionMatrix);
        if (ndc[0] >= -1 && ndc[0] <= 1 && ndc[1] >= -1 && ndc[1] <= 1 && ndc[2] >= -1 && ndc[2] <= 1) {
            return true;
        }

        return false;
        //*/

        //return this.model.env.camera.testIntersectionAABB(instance.boundingShape) > 0;
    },

    // Add a new instance to this bucket, and return the shared data object at its index
    add(instance) {
        const index = this.instances.push(instance) - 1;

        this.instanceToIndex.set(instance, index);

        return this.getSharedData(index);
    },

    // This function deletes an instance by moving the last instance into the index of this one
    delete(instance) {
        const index = this.instanceToIndex.get(instance),
              lastIndex = this.instances.length - 1;

        // Remove the reference to this instance from the map
        this.instanceToIndex.delete(instance);

        // If the instance being removed is the last one, there is no need to move anything
        if (index !== lastIndex) {
            // Get the last instance
            const lastInstance = this.instances[lastIndex];

            // Move the last instance to the index of the one being deleted
            this.instances[index] = lastInstance;
            this.instanceToIndex.set(lastInstance, index);

            // Set the shared data of the previously last instance
            lastInstance.setSharedData(this.getSharedData(index));
        }

        // Finally remove the last instance from the last index
        this.instances.pop();
    }
};
