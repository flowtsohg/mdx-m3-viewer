/**
 * @class
 * @classdesc A model. The point of this viewer.
 * @extends DownloadableResource
 * @param {ModelViewer} env The model viewer object that this model belongs to.
 * @param {function} pathSolver A function that solves paths. See more {@link LoadPathSolver here}.
 */
function Model(env, pathSolver) {
    DownloadableResource.call(this, env, pathSolver);

    /** @member {ModelView[]} */
    this.modelViews = [];

    this.preloadedInstances = [];
}


Model.prototype = {
    get objectType() {
        return "model";
    },

    get Handler() {
        throw new Error("Model.Handler must be overriden!");
    },

    /**
     * @method
     * @desc Adds a new view to this model, and returns the view.
     * @returns {@link ModelView}
     */
    addView() {
        let view = new this.Handler.ModelView(this);

        this.modelViews.push(view);

        return view;
    },

    /**
     * @method
     * @desc Adds a new instance to the first view owned by this model, and returns the instance.
     *       Equivalent to model.views[0].addInstance()
     * @returns {@link ModelInstance}
     */
    addInstance() {
        let instance = new this.Handler.Instance(this.env);

        this.env.registerEvents(instance);

        instance.load(this);

        if (this.loaded || this.error) {
            instance.modelReady();
        } else {
            this.preloadedInstances.push(instance);
        }

        return instance;
    },

    // This allows setting up preloaded instances without event listeners.
    finalizeLoad() {
        AsyncResource.prototype.finalizeLoad.call(this);

        let instances = this.preloadedInstances;

        for (let i = 0, l = instances.length; i < l; i++) {
            instances[i].modelReady();
        }
    },

    /**
     * @method
     * @desc Detach this model from the viewer. This removes references to it from the viewer, and also detaches all of the model views it owns.
     */
    detach() {
        // Detach all of the views
        let views = this.modelViews;

        for (let i = 0, l = views.length; i < l; i++) {
            views[i].detach();
        }

        // Remove references from the viewer
        this.env.removeReference(this);
    },

    renderOpaque(bucket, scene) {

    },

    renderTranslucent(bucket, scene) {

    },

    renderEmitters(bucket, scene) {

    }
};

mix(Model.prototype, DownloadableResource.prototype);
