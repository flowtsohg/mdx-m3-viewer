/**
 * @class
 * @classdesc A scene.
 *            Scenes allow to render different model views with different cameras.
 */
function Scene() {
    /** @member {ModelViewer} */
    this.env = null;
    /** @member {Set.<Instance>} */
    this.instances = new Set();
    /** @member {Camera} */
    this.camera = new Camera();

    this.buckets = [];
    this.bucketSet = new Set();
}

Scene.prototype = {
    /** @member {string} */
    get objectType() {
        return "scene";
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

    /**
     * @method
     * @desc Add an instance to this scene.
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
     * @method
     * @desc Remove an instance from this scene.
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
     * @method
     * @desc Detaches all of the views in this scene.
     */
    clear() {
        let buckets = this.buckets;

        for (let i = 0, l = views.length; i < l; i++) {
            this.removeBucket(buckets[i]);
        }

        this.instances.clear();
    },

    /**
     * @method
     * @desc Detach this scene from the viewer.
     */
    detach() {
        this.env.removeScene(this);
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
