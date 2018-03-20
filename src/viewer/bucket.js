export default class Bucket {
     /**
     * @param {ModelView} modelView
     */
    constructor(modelView) {
        let model = modelView.model,
            gl = model.env.gl;

        /** @member {ModelView} */
        this.modelView = modelView;
        /** @member {Model} */
        this.model = model;
        /** @member {Array<ModelInstance>} */
        this.instances = [];
        /** @member {Map<ModelInstance, number>} */
        this.instanceToIndex = new Map();
        /** @member {number} */
        this.priority = 0;

        // The index buffer is used instead of gl_InstanceID, which isn't defined in WebGL shaders.
        // It's a simple buffer of indices, [0, 1, ..., this.size - 1].
        // While it can be shared between all buckets in the viewer, this makes the code slightly messy and less dynamic.
        // It's 256 bytes per bucket, no big deal. Right?
        this.instanceIdBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceIdBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(this.size).map((currentValue, index, array) => index), gl.STATIC_DRAW);
    }

    get objectType() {
        return 'bucket';
    }

    // The capacity of this bucket, override at will
    // TODO: This should possibly be dynamic, although tests in the past have shown it to be slower for some unknown reason
    //       For example, the bucket size of a simple model can probably be a lot bigger than that of a complex one
    /** @member {number} */
    get size() {
        return 256;
    }

    /**
     * Get the rendering statistics of this bucket.
     * This includes the following:
     *     calls
     *     instances
     *     vertices
     *     polygons
     */
    getRenderStats() {
        throw new Error('Bucket.getRenderStats must be overriden');
    }

    getSharedData(index) {
        
    }

    isFull() {
        return this.instances.length === this.size;
    }

    update(scene) {
        
    }

    renderOpaque(scene) {
        this.model.renderOpaque(this, scene);
    }

    renderTranslucent(scene) {
        this.model.renderTranslucent(this, scene);
    }

    renderEmitters(scene) {
        this.model.renderEmitters(this, scene);
    }

    // Add a new instance to this bucket, and return the shared data object at its index
    addInstance(instance) {
        let index = this.instances.push(instance) - 1;

        this.instanceToIndex.set(instance, index);

        return this.getSharedData(index);
    }

    // This function deletes an instance by moving the last instance into the index of this one
    removeInstance(instance) {
        let index = this.instanceToIndex.get(instance),
            lastIndex = this.instances.length - 1;

        // Remove the reference to this instance from the map
        this.instanceToIndex.delete(instance);

        // If the instance being removed is the last one, there is no need to move anything
        if (index !== lastIndex) {
            // Get the last instance
            let lastInstance = this.instances[lastIndex];

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
