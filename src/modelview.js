/**
 * @class
 * @classdesc This class holds all of the model instances.
 *            It is used to possibly give multiple "views" of the same model.
 *            That is, use the same base model, but have some variations on a per-view basis, hence giving multiple versions of the model.
 *            Mostly used for texture overriding, to allow having multiple instances with different textures.
 * @extends ActionQueue
 * @param {Model} model The model that this view belongs to.
 */
function ModelView(model) {
    /** @member {Model} */
    this.model = model;
    /** @member {ModelInstance[]} */
    this.instances = [];
    /** @member {Bucket[]} */
    this.buckets = [];
    /** @member {map.<ModelInstance, Bucket>} */
    this.instanceToBucket = new Map(); // instance->bucket map
    /** @member {boolean} */
    this.rendered = true;

    ActionQueue.call(this);
}

ModelView.prototype = {
    /** @member {string} */
    get objectType() {
        return "modelview";
    },

    /**
     * @method
     * @desc Adds a new instance  to this view, and returns the instance.
     * @returns {@link ModelInstance}
     */
    addInstance() {
        const model = this.model;

        const resource = new model.Handler.Instance(model.env);

        model.env.registerEvents(resource);

        resource.load(this);

        return resource;
    },

    /**
     * @method
     * @desc Deletes the given instance from this view, and returns it.
     * @returns {@link ModelInstance}
     */
    deleteInstance(instance) {
        const instances = this.instances;

        this.hideInstance(instance);

        instances.splice(instances.indexOf(instance), 1);

        this.instanceToBucket.delete(instance);

        return instance;
    },

    // Find a bucket that isn't full. If no bucket is found, add a new bucket and return it.
    getAvailableBucket() {
        const model = this.model,
            buckets = this.buckets;

        for (let bucket of buckets) {
            if (!bucket.isFull()) {
                return bucket;
            }
        }

        const bucket = new model.Handler.Bucket(this);

        buckets.push(bucket);

        return bucket;
    },

    // The model is ready, and so the view can update.
    // This doesn't mean the model is actually valid, just that it finished loading (regardless of the reason).
    modelReady() {
        this.applyActions();
    },

    // Add the given instance to this model
    // This is called by the instance itself when it finishes loading (either instantly, or after a while if the model was still loading)
    add(instance) {
        if (this.model.error) {
            instance.modelError();
        } else if (this.model.loaded) {
            this.instances.push(instance);

            instance.modelReady();
        } else {
            this.addAction(instance => this.add(instance), [instance]);
        }
    },

    // Show the given instance
    // This is done by adding it to a bucket, and calling its setSharedData function
    showInstance(instance) {
        const bucket = this.getAvailableBucket();

        this.instanceToBucket.set(instance, bucket);

        instance.setSharedData(bucket.add(instance));
    },

    // Hide the given instance
    // This is done by deleting it from its bucket
    hideInstance(instance) {
        const bucket = this.instanceToBucket.get(instance);

        this.instanceToBucket.delete(instance);

        bucket.delete(instance);
    },

    update() {
        if (this.rendered) {
            const buckets = this.buckets;

            for (let i = 0, l = buckets.length; i < l; i++) {
                buckets[i].update();
            }
        }
    },

    renderOpaque() {
        if (this.rendered) {
            const model = this.model,
                buckets = this.buckets;

            for (let i = 0, l = buckets.length; i < l; i++) {
                model.renderOpaque(buckets[i]);
            }
        }
    },

    renderTranslucent() {
        if (this.rendered) {
            const model = this.model,
                buckets = this.buckets;

            for (let i = 0, l = buckets.length; i < l; i++) {
                model.renderTranslucent(buckets[i]);
            }
        }
    },

    renderEmitters() {
        if (this.rendered) {
            const model = this.model,
                buckets = this.buckets;

            for (let i = 0, l = buckets.length; i < l; i++) {
                model.renderEmitters(buckets[i]);
            }
        }
    }
};

mix(ModelView.prototype, ActionQueue.prototype);
