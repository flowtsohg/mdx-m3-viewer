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
    this.views = [];

    // Create a default view
    this.addView();
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
    addView(scene) {
        // If no scene is given, use the default scene
        scene = scene || this.env.scenes[0];

        const view = new this.Handler.ModelView(this);

        // Add this view to the model
        this.views.push(view);

        // Add this view to the scene
        view.attach(scene);

        // Call the view's modelReady function when the model is ready
        this.finalizeView(view);

        return view;
    },

    finalizeView(view) {
        if (this.error || this.loaded) {
            view.modelReady();
        } else {
            this.addAction(view => this.finalizeView(view), [view]);
        }
    },

    /**
     * @method
     * @desc Adds a new instance to the first view owned by this model, and returns the instance.
     *       Equivalent to model.views[0].addInstance()
     * @returns {@link ModelInstance}
     */
    addInstance() {
        return this.views[0].addInstance();
    },

    /**
     * @method
     * @desc Deletes an instance from the first view owned by this model, and returns the instance.
     *       Equivalent to model.views[0].deleteInstance(instance)
     * @returns {@link ModelInstance}
     */
    deleteInstance(instance) {
        return this.views[0].deleteInstance(instance);
    },

    update() {
        const views = this.views;

        for (let i = 0, l = views.length; i < l; i++) {
            views[i].update();
        }
    },

    renderOpaque(bucket) {

    },

    renderTranslucent(bucket) {

    },

    renderEmitters(bucket) {

    }
};

mix(Model.prototype, DownloadableResource.prototype);
