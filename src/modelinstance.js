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
        /** @member {Model} */
        this.model = model;
        this.shouldRender = false; // This value should not be used directly, instead use ModelInstance.rendered
        this.noCulling = false; // Set to true if the model should always be rendered

        this.dispatchEvent({ type: "loadstart" });
    },

    modelReady() {
        this.loaded = true;

        this.initialize();

        this.dispatchEvent({ type: "load" });
        this.dispatchEvent({ type: "loadend" });
    },

    modelError() {
        this.error = true;

        this.dispatchEvent({ type: "error", error: "InvalidModel" });
        this.dispatchEvent({ type: "loadend" });
    },

    preemptiveUpdate() {

    },

    /**
     * @member {boolean}
     * @desc Sets whether this instance gets rendered or not.
     */
    set rendered(shouldRender) {
        if (this.loaded && this.modelView) {
            // Model.showInstance/hideInstance shouldn't be called multiple times, so check if the mode actually changed
            if (this.shouldRender !== shouldRender) {
                this.shouldRender = shouldRender;

                if (shouldRender) {
                    this.modelView.showInstance(this);
                } else {
                    this.modelView.hideInstance(this);
                }
            }
        } else if (!this.error) {
            this.addAction((shouldRender) => this.rendered = shouldRender, [shouldRender]);
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
