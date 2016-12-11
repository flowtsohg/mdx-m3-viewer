/**
 * @class
 * @classdesc A common base class for almost all of the objects used by the viewer.
 *            This class handles the different states of loading, and the events sent as a result.
 *            It also extends action queue, which is the class that gives every object the ability to support asyncronous actions.
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

    load() {
        throw new Error("AsyncResource.load must be overriden!");
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

    onerror(error, extra) {
        this.error = true;

        let e = { type: "error", error: error };

        if (extra) {
            e.extra = extra;
        }

        this.dispatchEvent(e);
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
            callback(this);
        } else {
            // Self removing listener
            let listener = () => { this.removeEventListener(listener); callback(this); };

            this.addEventListener("loadend", listener);
        }

        return this;
    }
};

mix(AsyncResource.prototype, EventDispatcher.prototype, ActionQueue.prototype);
