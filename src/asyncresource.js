/**
 * @constructor
 * @extends EventDispatcher
 * @param {ModelViewer} env
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
}

AsyncResource.prototype = {
    /**
     * @method
     * @desc Similar to attaching an event listener to the "loadend" event, but handles the case where the resource already loaded, and the callback should still be called.
     * @param {function(AsyncResource)} callback The function to call.
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
    },

    detach() {

    },

    update() {

    },

    load() {
        this.dispatchEvent({ type: "loadstart" });
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
        this.dispatchEvent({ type: "loadend" });
    },

    onerror(error, extra) {
        this.error = true;

        this.dispatchEvent({ type: "error", error: error, extra: extra });
        this.dispatchEvent({ type: "loadend" });
    }
};

mix(AsyncResource.prototype, EventDispatcher.prototype);
