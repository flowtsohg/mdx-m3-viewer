/**
 * @constructor
 * @augments AsyncResource
 * @augments NotifiedNode
 * @param {Model} model
 */
function ModelInstance(model) {
    AsyncResource.call(this, model.env);

    NotifiedNode.call(this);
    this.dontInheritScaling = true;

    /** @member {?ModelView} */
    this.modelView = null;
    /** @member {?Bucket} */
    this.bucket = null;
    /** @member {Model} */
    this.model = model;

    this.shouldRender = true; // This value should not be used directly, instead use ModelInstance.rendered
    this.noCulling = false; // Set to true if the model should always be rendered
}

ModelInstance.prototype = {
    get objectType() {
        return "instance";
    },

    /**
     * Detach this instance from the scene it's in.
     * 
     * @returns {boolean}
     */
    detach() {
        if (this.scene) {
            return this.scene.removeInstance(this);
        }

        return false;
    },

    globalUpdate() {

    },

    modelReady() {
        if (this.model.loaded) {
            this.loaded = true;

            this.initialize();

            if (this.rendered && this.scene) {
                this.modelView.setVisibility(this, true);
            }

            this.dispatchEvent({ type: "load" });
            this.dispatchEvent({ type: "loadend" });
        } else {
            this.error = true;

            this.dispatchEvent({ type: "error", error: "InvalidModel" });
            this.dispatchEvent({ type: "loadend" });
        }
    },

    /**
     * Sets whether this instance gets rendered or not.
     * 
     * @member {boolean}
     */
    set rendered(shouldRender) {
        // ModelView.showInstance/hideInstance shouldn't be called multiple times consecutively, so check if the mode actually changed
        if (this.shouldRender !== shouldRender) {
            this.shouldRender = shouldRender;

            // Only set visibility if the model loaded.
            if (this.loaded && this.scene) {
                this.modelView.setVisibility(this, shouldRender);
            }
        }
    },

    get rendered() {
        return this.shouldRender;
    },

    setSharedData(sharedData) {

    },

    invalidateSharedData() {

    }
};

mix(ModelInstance.prototype, AsyncResource.prototype, NotifiedNode.prototype);
