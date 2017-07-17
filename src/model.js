import DownloadableResource from './downloadableresource';
import AsyncResource from './asyncresource';

/**
 * @constructor
 * @augments DownloadableResource
 * @param {ModelViewer} env
 * @param {function(?)} pathSolver
 */
function Model(env, pathSolver) {
    DownloadableResource.call(this, env, pathSolver);

    /** @member {Array<ModelInstance>} */
    this.instances = [];

    /** @member {Array<ModelView>} */
    this.views = [];

    // Add the default view
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
     * Adds a new instance to this model, and returns it.
     * 
     * @returns {ModelInstance}
     */
    addInstance() {
        let instance = new this.Handler.Instance(this);

        this.env.registerEvents(instance);

        instance.load(this);

        this.instances.push(instance);
        this.views[0].addInstance(instance);

        if (this.loaded || this.error) {
            instance.modelReady();
        }

        return instance;
    },

    /**
     * Detach this model from the viewer. This removes references to it from the viewer, and also detaches all of the model views it owns.
     */
    detach() {
        // Detach all of the views
        let views = this.views;

        for (let i = 0, l = views.length; i < l; i++) {
            views[i].clear();
        }

        // Remove references from the viewer
        this.env.removeReference(this);
    },

    renderOpaque(bucket) {

    },

    renderTranslucent(bucket) {

    },

    renderEmitters(bucket) {

    },

    addView() {
        let view = new this.Handler.ModelView(this);

        this.views.push(view);

        return view;
    },

    removeView(modelView) {
        let views = this.views;

        views.splice(views.indexOf(modelView), 1);
    },

    viewChanged(instance, shallowView) {
        // Check if there's another view that matches the instance
        let views = this.views;

        for (let i = 0, l = views.length; i < l; i++) {
            let view = views[i];

            if (view.equals(shallowView)) {
                view.addInstance(instance);
                return;
            }
        }

        // Since no view matched, create a new one
        let view = this.addView();

        view.applyShallowCopy(shallowView);
        view.addInstance(instance);
    },

    // This allows setting up preloaded instances without event listeners.
    finalizeLoad() {
        AsyncResource.prototype.finalizeLoad.call(this);

        let instances = this.instances;

        for (let i = 0, l = instances.length; i < l; i++) {
            instances[i].modelReady();
        }
    }
};

require('./common').mix(Model.prototype, DownloadableResource.prototype);

export default Model;
