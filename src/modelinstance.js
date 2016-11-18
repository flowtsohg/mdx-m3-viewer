/**
 * @class
 * @classdesc An instance of a model, and an entity in the world that you can see, and move around.
 * @extends AsyncResource
 * @extends Node
 * @param {ModelViewer} env The model viewer object that this instance belongs to.
 */
function ModelInstance(env) {
    AsyncResource.call(this, env);
    Node.call(this, true);
}

ModelInstance.prototype = {
    load(modelView) {
        /** @member {ModelView} */
        this.modelView = modelView;
        /** @member {Model} */
        this.model = modelView.model;
        this.shouldRender = false; // This value should not be used directly, instead use ModelInstance.rendered
        this.noCulling = false; // Set to true if the model should always be rendered

        modelView.add(this);
    },

    get objectType() {
        return "instance";
    },

    modelReady() {
        this.loaded = true;

        this.initialize();
        this.dispatchEvent({ type: "load" });
        this.rendered = true;
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
        if (this.loaded) {
            // Model.showInstance/hideInstance shouldn't be called multiple times, so check if the mode actually changed
            if (this.shouldRender !== shouldRender) {
                this.shouldRender = shouldRender;

                if (shouldRender) {
                    this.modelView.showInstance(this);
                    this.applyActions(); // This allows to call setters such as setTeamColor also when the instance has no valid arrays, by delaying the actual calls
                    // When the instance is inserted into a bucket again, the calls will be used with the new valid arrays
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

    /// TODO: duplicated with BoundingShape, can I do something nice about this? (e.g. parent class)
    // This will be called if this instance is parented to some node, and the node changed
    notify() {
        this.recalculateTransformation();
    },

    setSharedData(sharedData) {

    }
};

mix(ModelInstance.prototype, AsyncResource.prototype, Node.prototype);
