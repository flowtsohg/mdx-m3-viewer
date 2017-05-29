/**
 * @class
 * @classdesc This class holds all of the model instances.
 *            It is used to possibly give multiple "views" of the same model.
 *            That is, use the same base model, but have some variations on a per-view basis, hence giving multiple versions of the model.
 *            Mostly used for texture overriding, to allow having multiple instances with different textures.
 * @param {Model} model The model that this view belongs to.
 */
function ModelView(model) {
    /** @member {Model} */
    this.model = model;
    /** @member {Scene} */
    this.scene = null;
    /** @member {ModelInstance[]} */
    this.instances = [];
    /** @member {Bucket[]} */
    this.buckets = [];
    /** @member {map.<ModelInstance, Bucket>} */
    this.instanceToBucket = new Map(); // instance->bucket map
}

ModelView.prototype = {
    /** @member {string} */
    get objectType() {
        return "modelview";
    },

    /**
     * @method
     * @desc Add an instance to this model view.
     * @param {Instance} instance The instance to add.
     */
    addInstance(instance) {
        if (instance && instance.objectType === "instance") {
            if (instance.loaded) {
                // If the instance is already in another view, remove it first.
                if (instance.modelView) {
                    instance.modelView.removeInstance(instance);
                }

                this.instances.push(instance);

                instance.modelView = this;
                instance.rendered = true;
            } else {
                // See ModelInstance.modelReady
                instance.modelView = this;
            }
        }
    },

    /**
     * @method
     * @desc Remove an instance from this model view.
     * @param {Instance} instance The instance to remove.
     */
    removeInstance(instance) {
        if (instance && instance.objectType === "instance") {
            instance.rendered = false;
            instance.modelView = null;

            this.instances.splice(this.instances.indexOf(instance), 1);
        }
    },

    /**
     * @method
     * @desc Detach this model view from the scene it's in.
     */
    detach() {
        if (this.scene) {
            this.scene.removeView(this);
        }
    },

    // Find a bucket that isn't full. If no bucket is found, add a new bucket and return it.
    getAvailableBucket() {
        let buckets = this.buckets;

        for (let bucket of buckets) {
            if (!bucket.isFull()) {
                return bucket;
            }
        }

        let bucket = new this.model.Handler.Bucket(this);

        buckets.push(bucket);

        return bucket;
    },

    // Set the visibility of this instance (assuming it's in this view).
    // This is done by adding or removing it from a bucket.
    setVisibility(instance, visibility) {
        if (visibility) {
            let bucket = this.getAvailableBucket();

            this.instanceToBucket.set(instance, bucket);

            instance.bucket = bucket;
            instance.setSharedData(bucket.addInstance(instance));
        } else {
            let bucket = this.instanceToBucket.get(instance);

            this.instanceToBucket.delete(instance);

            bucket.removeInstance(instance);

            // Invalidate whatever shared data this instance used, because it doesn't belong to it anymore.
            instance.bucket = null;
            instance.invalidateSharedData();
        }
    },

    update() {
        let buckets = this.buckets;

        for (let i = 0, l = buckets.length; i < l; i++) {
            buckets[i].update();
        }
    },

    renderOpaque() {
        let buckets = this.buckets;

        for (let i = 0, l = buckets.length; i < l; i++) {
            buckets[i].renderOpaque();
        }
    },

    renderTranslucent() {
        let buckets = this.buckets;

        for (let i = 0, l = buckets.length; i < l; i++) {
            buckets[i].renderTranslucent();
        }
    },

    renderEmitters() {
        let buckets = this.buckets;

        for (let i = 0, l = buckets.length; i < l; i++) {
            buckets[i].renderEmitters();
        }
    }
};
