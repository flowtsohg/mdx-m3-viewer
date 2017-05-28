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
            this.whenLoaded(() => instance.modelReady());
        }

        return instance;
    },

    renderOpaque(bucket, scene) {

    },

    renderTranslucent(bucket, scene) {

    },

    renderEmitters(bucket, scene) {

    }
};

mix(Model.prototype, DownloadableResource.prototype);
