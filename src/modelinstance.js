/**
 * @class
 * @classdesc An instance of a model, and an entity in the world that you can see, and move around.
 * @extends AsyncResource
 * @extends NotifiedNode
 * @param {ModelViewer} env The model viewer object that this instance belongs to.
 */
function ModelInstance(model) {
    AsyncResource.call(this, model.env);

    NotifiedNode.call(this);
    this.dontInheritScaling = true;

    /** @member {ModelView} */
    this.modelView = null;
    /** @member {Bucket} */
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
     * @method
     * @desc Detach this instance from the model view it's in.
     */
    detach() {
        if (this.modelView) {
            this.modelView.removeInstance(this);
        }
    },

    globalUpdate() {

    },

    modelReady() {
        if (this.model.loaded) {
            this.loaded = true;

            this.initialize();

            this.dispatchEvent({ type: "load" });
            this.dispatchEvent({ type: "loadend" });
        } else {
            this.error = true;

            this.dispatchEvent({ type: "error", error: "InvalidModel" });
            this.dispatchEvent({ type: "loadend" });
        }
    },

    /**
     * @member {boolean}
     * @desc Sets whether this instance gets rendered or not.
     */
    set rendered(shouldRender) {
        // ModelView.showInstance/hideInstance shouldn't be called multiple times consecutively, so check if the mode actually changed
        if (this.shouldRender !== shouldRender) {
            this.shouldRender = shouldRender;

            // Only set visibility if the instance is in a model view, and the model loaded.
            if (this.modelView && this.model.loaded) {
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
