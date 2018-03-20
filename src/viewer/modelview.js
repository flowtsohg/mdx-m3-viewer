export default class ModelView {
    /**
     * @param {Model} model.
     */
    constructor(model) {
        /** @member {Model} */
        this.model = model;
        /** @member {Array<ModelInstance>} */
        this.instances = [];
        /** @member {Array<Bucket>} */
        this.buckets = [];
        /** @member {Map<Scene, Array<Bucket>>} */
        this.sceneToBucket = new Map();
    }

    /** @member {string} */
    get objectType() {
        return 'modelview';
    }

    // Get a shallow copy of this view
    getShallowCopy() {

    }

    // Given a shallow copy, copy its contents to this view
    applyShallowCopy(view) {

    }

    // Given another view or shallow view, determine whether they have equal values or not
    equals(view) {
        return true;
    }

    addInstance(instance) {
        // If the instance is already in another view, remove it first.
        // This is always true, except when the instance is created and added to its first view.
        let modelView = instance.modelView;
        if (modelView) {
            modelView.removeInstance(instance);
        }

        // Add the instance
        this.instances.push(instance);
        instance.modelView = this;

        // If it should be rendered, add it to a bucket
        if (instance.shouldRender && instance.scene && instance.loaded) {
            this.setVisibility(instance, true);
        }
    }

    removeInstance(instance) {
        // If the instance has a bucket, remove it from it.
        if (instance.bucket) {
            this.setVisibility(instance, false);
        }

        instance.modelView = null;

        let instances = this.instances;

        instances.splice(instances.indexOf(instance), 1);

        // If the view now has no instances, ask the model to remove.
        if (instances.length === 0) {
            this.model.removeView(this);
        }
    }

    clear() {
        let instances = this.instances;

        for (let i = 0, l = instances.length; i < l; i++) {
            this.removeInstance(instances[i]);
        }
    }

    detach() {
        if (this.model) {
            this.model.removeView(this);
            this.model = null;

            return true;
        }

        return false;
    }

    // Find a bucket that isn't full. If no bucket is found, add a new bucket and return it.
    getAvailableBucket(scene) {
        let sceneToBucket = this.sceneToBucket;

        if (!sceneToBucket.has(scene)) {
            sceneToBucket.set(scene, []);
        }

        let buckets = sceneToBucket.get(scene);

        for (let i = 0, l = buckets.length; i < l; i++) {
            let bucket = buckets[i];

            if (!bucket.isFull()) {
                return bucket;
            }
        }

        let bucket = new this.model.handler.bucket(this);

        buckets.push(bucket);

        this.buckets.push(bucket);

        return bucket;
    }

    sceneChanged(instance, scene) {
        if (instance.scene !== scene) {
            let loaded = this.model.loaded;

            // Remove the instance from its current bucket
            if (instance.scene && loaded) {
                this.setVisibility(instance, false);
            }

            // Set the scene
            instance.scene = scene;

            // If the instance should be rendered, add it to a bucket
            if (instance.shouldRender && !instance.culled && scene && loaded) {
                this.setVisibility(instance, true);
            }
        }
    }

    // Note: this should only be called if the instance has a bucket and a scene
    setVisibility(instance, shouldRender) {
        if (shouldRender) {
            let bucket = this.getAvailableBucket(instance.scene);

            instance.bucket = bucket;
            instance.setSharedData(bucket.addInstance(instance));

            // Will add the bucket if it wasn't already added
            instance.scene.addBucket(bucket);

            return true;
        } else {
            let bucket = instance.bucket;

            bucket.removeInstance(instance);

            // Invalidate whatever shared data this instance used, because it doesn't belong to it anymore.
            instance.bucket = null;
            instance.invalidateSharedData();

            // Will remove the bucket if it has 0 instances
            // TODO: This causes weird logic, and can cause to loop over undefined buckets.
            instance.scene.removeBucket(bucket);

            return false;
        } 
    }
};
