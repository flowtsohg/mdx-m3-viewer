/**
 * @constructor
 */
function Scene() {
    /** @member {ModelViewer} */
    this.env = null;
    /** @member {Camera} */
    this.camera = new Camera();
    /** @member {Set<Instance>} */
    this.instances = new Set();
    /** @member {Array<Bucket>} */
    this.buckets = [];
    /** @member {Set<Bucket>} */
    this.bucketSet = new Set();
}

Scene.prototype = {
    /** @member {string} */
    get objectType() {
        return "scene";
    },

    /**
     * The amount of WebGL render calls being made each time this scene is rendered.
     */
    renderCalls() {
        let buckets = this.buckets,
            count = 0;

        for (let i = 0, l = buckets.length; i < l; i++) {
            count += buckets[i].renderCalls();
        }

        return count;
    },

    /**
     * The amount of instances being rendered each time this scene is being rendered.
     */
    renderedInstances() {
        let buckets = this.buckets,
            count = 0;

        for (let i = 0, l = buckets.length; i < l; i++) {
            count += buckets[i].instances.length;
        }

        return count;
    },

    /**
     * Add an instance to this scene.
     * 
     * @param {Instance} instance The instance to add.
     */
    addInstance(instance) {
        if (instance && instance.objectType === "instance") {
            let instances = this.instances;

            if (!instances.has(instance)) {
                instances.add(instance);

                instance.modelView.sceneChanged(instance, this);

                return true;
            }
        }

        return false;
    },

    /**
     * Remove an instance from this scene.
     * 
     * @param {Instance} instance The instance to remove.
     */
    removeInstance(instance) {
        if (instance && instance.objectType === "instance") {
            let instances = this.instances;

            if (instances.has(instance)) {
                instances.delete(instance);

                instance.modelView.sceneChanged(instance, null);

                return true;
            }
        }

        return false;
    },

    /**
     * Removes all of the bucket in this scene.
     */
    clear() {
        let buckets = this.buckets;

        for (let i = 0, l = buckets.length; i < l; i++) {
            this.removeBucket(buckets[i]);
        }

        this.instances.clear();
    },

    /**
     * Detach this scene from the viewer.
     */
    detach() {
        this.env.removeScene(this);
    },

    addBucket(bucket) {
        let bucketSet = this.bucketSet;

        if (!bucketSet.has(bucket)) {
            bucketSet.add(bucket);

            this.buckets.push(bucket);
        }
    },

    removeBucket(bucket) {
        let instances = bucket.instances.length;

        if (instances === 0) {
            this.bucketSet.delete(bucket);

            let buckets = this.buckets;

            buckets.splice(buckets.indexOf(bucket), 1);

            return true;
        }

        return false;        
    },

    update() {
        let buckets = this.buckets;

        for (let i = 0, l = buckets.length; i < l; i++) {
            buckets[i].update(this);
        }
    },

    renderOpaque() {
        let buckets = this.buckets;

        this.setViewport();

        for (let i = 0, l = buckets.length; i < l; i++) {
            buckets[i].renderOpaque(this);
        }
    },

    renderTranslucent() {
        let buckets = this.buckets;

        this.setViewport();

        for (let i = 0, l = buckets.length; i < l; i++) {
            buckets[i].renderTranslucent(this);
        }
    },

    renderEmitters() {
        let buckets = this.buckets;
            
        this.setViewport();

        for (let i = 0, l = buckets.length; i < l; i++) {
            buckets[i].renderEmitters(this);
        }
    },

    setViewport() {
        let viewport = this.camera.viewport;

        this.env.gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);
    }
};
