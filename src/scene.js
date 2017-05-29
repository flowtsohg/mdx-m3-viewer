/**
 * @class
 * @classdesc A scene.
 *            Scenes allow to render different model views with different cameras.
 */
function Scene() {
    /** @member {ModelViewer} */
    this.env = null;
    /** @member {ModelView[]} */
    this.modelViews = [];
    /** @member {Camera} */
    this.camera = new Camera();
}

Scene.prototype = {
    /** @member {string} */
    get objectType() {
        return "scene";
    },

    /**
     * @method
     * @desc Adds a new view to this scene, while setting the view's scene to this scene.
     * @param {ModelView} modelView The model view to add.
     * @returns {boolean}.
     */
    addView(modelView) {
        if (modelView && modelView.objectType === "modelview") {
            let views = this.modelViews,
                index = views.indexOf(modelView);

            if (index === -1) {
                // If the view is already in another scene, remove it first.
                if (modelView.scene) {
                    modelView.scene.removeView(modelView);
                }

                views.push(modelView);

                modelView.scene = this;

                return true;
            }
        }

        return false;
    },

    /**
     * @method
     * @desc Removes the given view from this scene, if it was in it.
     * @param {ModelView} modelView The model view to remove.
     * @returns {boolean}.
     */
    removeView(modelView) {
        if (modelView && modelView.objectType === "modelview") {
            let views = this.modelViews,
                index = views.indexOf(modelView);

            if (index !== -1) {
                views.splice(index, 1);

                modelView.scene = null;

                return true;
            }
        }

        return false;
    },

    /**
     * @method
     * @desc Detaches all of the views in this scene.
     */
    clear() {
        let views = this.modelViews;

        for (let i = 0, l = views.length; i < l; i++) {
            this.removeView(views[i]);
        }
    },

    /**
     * @method
     * @desc Detach this scene from the viewer.
     */
    detach() {
        this.env.removeScene(this);
    },

    update() {
        let views = this.modelViews;

        for (let i = 0, l = views.length; i < l; i++) {
            views[i].update();
        }
    },

    renderOpaque() {
        let views = this.modelViews;

        this.setViewport();

        for (let i = 0, l = views.length; i < l; i++) {
            views[i].renderOpaque();
        }
    },

    renderTranslucent() {
        let views = this.modelViews;

        this.setViewport();

        for (let i = 0, l = views.length; i < l; i++) {
            views[i].renderTranslucent();
        }
    },

    renderEmitters() {
        let views = this.modelViews;
            
        this.setViewport();

        for (let i = 0, l = views.length; i < l; i++) {
            views[i].renderEmitters();
        }
    },

    setViewport() {
        let viewport = this.camera.viewport;

        this.env.gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);
    }
};
