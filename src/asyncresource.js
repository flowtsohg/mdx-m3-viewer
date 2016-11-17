/**
 * @class
 * @classdesc A common base class for almost all of the objects used by the viewer (including the viewer object itself).
 *            This object handles event dispatching when objects are being loaded.
 * @extends EventDispatcher
 * @extends ActionQueue
 * @param {ModelViewer} env The model viewer object this resource belongs to.
 */
function AsyncResource(env) {
    /** @member {ModelViewer} */
    this.env = env;
    /** @member {WebGLRenderingContext} */
    this.gl = env.gl;
    /** @member {boolean} */
    this.loaded = false;
    /** @member {boolean} */
    this.error = false;

    EventDispatcher.call(this);
    ActionQueue.call(this);
}

AsyncResource.prototype = {
    update() {

    },

    loadstart() {
        this.dispatchEvent({ type: "loadstart" });
    },

    load() {
        throw "AsyncResource.load must be overriden!";
    },

    onerror(e) {
        this.dispatchEvent({ type: "error", error: e });
    },

    onprogress(e) {
        if (e.target.status === 200) {
            this.dispatchEvent({ type: "progress", loaded: e.loaded, total: e.total, lengthComputable: e.lengthComputable });
        }
    },

    onload(src) {
        // This check allows an handler to postpone load finalization, either for asynchronious reasons (e.g. PngTexture), or because an internal error occured
        if (this.initialize(src)) {
            this.finalizeLoad();
        }
    },

    finalizeLoad() {
        this.loaded = true;

        this.dispatchEvent({ type: "load" });
        this.onloadend();
    },

    onerror(e) {
        this.error = true;

        this.dispatchEvent({ type: "error", error: e });
        this.onloadend();
    },

    onloadend() {
        this.applyActions();
        this.dispatchEvent({ type: "loadend" });
    },

    /**
     * @method
     * @desc Similar to attaching an event listener to the "loadend" event, but handles the case where the resource already loaded, and the callback should still be called.
     * @param {function} callback The function to call.
     * @returns this
     */
    whenLoaded(callback) {
        if (this.loaded || this.error) {
            // Match the objects given by event dispatching.
            // Otherwise, callbacks might have to handle both cases, which is annoying.
            callback({ target: this });
        } else {
            this.addAction((callback) => this.whenLoaded(callback), [callback]);
        }

        return this;
    }
};

mix(AsyncResource.prototype, EventDispatcher.prototype, ActionQueue.prototype);
