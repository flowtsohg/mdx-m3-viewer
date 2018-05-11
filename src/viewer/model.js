import Resource from './resource';

export default class Model extends Resource {
    /**
     * @param {Object} resourceData
     */
    constructor(resourceData) {
        super(resourceData);

        /** @member {number} */
        this.batchSize = resourceData.viewer.batchSize;

        /** @member {Array<ModelInstance>} */
        this.instances = [];

        /** @member {Array<ModelView>} */
        this.views = [];
    }

    /**
     * Adds a new instance to this model, and returns it.
     * 
     * @returns {ModelInstance}
     */
    addInstance() {
        let views = this.views,
            instance = new this.handler.instance(this);

        this.instances.push(instance);

        if (views.length === 0) {
            this.addView();
        }

        views[0].addInstance(instance);

        if (this.loaded) {
            instance.load();
        }

        return instance;
    }

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
        this.viewer.removeReference(this);
    }

    renderOpaque(data, scene, modelView) {

    }

    renderTranslucent(data, scene, modelView) {

    }

    addView() {
        let view = new this.handler.view(this);

        this.views.push(view);

        return view;
    }

    removeView(modelView) {
        let views = this.views;

        views.splice(views.indexOf(modelView), 1);
    }

    viewChanged(instance, shallowView) {
        // Check if there's another view that matches the instance
        for (let view of this.views) {
            if (view.equals(shallowView)) {
                view.addInstance(instance);
                return;
            }
        }

        // Since no view matched, create a new one
        let view = this.addView();

        view.applyShallowCopy(shallowView);
        view.addInstance(instance);

        // If the instance is already in a scene, and this is a new view, it will not be in the scene, so add it.
        if (instance.scene) {
            instance.scene.addView(view);
        }
    }

    // This allows setting up preloaded instances without event listeners.
    lateLoad() {
        for (let instance of this.instances) {
            instance.load();
        }

        for (let view of this.views) {
            view.lateLoad();
        }
    }
};
