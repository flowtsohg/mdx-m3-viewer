function Model(env, pathSolver) {
    DownloadableResource.call(this, env, pathSolver);

    this.views = [];

    this.addView(); // Default view
}


Model.prototype = {
    get objectType() {
        return "model";
    },

    get Handler() {
        throw "Model.Handler must be overriden!";
    },

    addView() {
        const view = new this.Handler.ModelView(this);

        this.views.push(view);

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

    // A useful shortcut?
    addInstance() {
        return this.views[0].addInstance();
    },

    update() {
        const views = this.views;

        for (let i = 0, l = views.length; i < l; i++) {
            views[i].update();
        }
    },

    renderViewsOpaque() {
        const views = this.views;

        for (let i = 0, l = views.length; i < l; i++) {
            views[i].renderOpaque();
        }
    },

    renderViewsTranslucent() {
        const views = this.views;

        for (let i = 0, l = views.length; i < l; i++) {
            views[i].renderTranslucent();
        }
    },

    renderViewsEmitters() {
        const views = this.views;

        for (let i = 0, l = views.length; i < l; i++) {
            views[i].renderEmitters();
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
