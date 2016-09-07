function ModelInstance(env) {
    AsyncResource.call(this, env);
    Node.call(this, true);
}

ModelInstance.prototype = {
    load(modelView) {
        this.modelView = modelView;
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

        this.dispatchEvent({ type: "error" });
        this.dispatchEvent({ type: "loadend" });
    },

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

    setSharedData(sharedData) {
        //throw "ModelInstance.setSharedData must be overriden!";
    }
};

mix(ModelInstance.prototype, AsyncResource.prototype, Node.prototype);
