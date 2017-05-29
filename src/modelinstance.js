/**
 * @class
 * @classdesc An instance of a model, and an entity in the world that you can see, and move around.
 * @extends AsyncResource
 * @extends NotifiedNode
 * @param {ModelViewer} env The model viewer object that this instance belongs to.
 */
function ModelInstance(env) {
    AsyncResource.call(this, env);

    NotifiedNode.call(this);
    this.dontInheritScaling = true;
}

ModelInstance.prototype = {
    get objectType() {
        return "instance";
    },

    load(model) {
        /** @member {ModelView} */
        this.modelView = null;
        /** @member {Bucket} */
        this.bucket = null;
        /** @member {Model} */
        this.model = model;
        this.shouldRender = false; // This value should not be used directly, instead use ModelInstance.rendered
        this.noCulling = false; // Set to true if the model should always be rendered

        this.dispatchEvent({ type: "loadstart" });
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

            // Instances can't be added to model views before the model is loaded.
            // Therefore, if an instance is added to a view before, it only sets the model view of the instance, but doesn't add it.
            // This check allows to, now that the model loaded, actually add the instance and allocate space in a bucket.
            let modelView = this.modelView;
            if (modelView) {
                // To not confuse the view
                this.modelView = null;

                modelView.addInstance(this);
            }
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

            if (this.modelView) {
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
