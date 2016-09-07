function AsyncResource(env) {
    this.env = env;
    this.gl = env.gl;
    this.loaded = false;
    this.error = false;

    EventDispatcher.call(this);
    ActionQueue.call(this);
}

AsyncResource.prototype = {
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

    // Similar to attaching an event listener to the "loadend" event, but handles the case where the resource already loaded, and the callback should still be called
    whenLoaded(callback) {
        if (this.loaded || this.error) {
            callback(this);
        } else {
            this.addEventListener("loadend", callback);
        }

        return this;
    }
};

mix(AsyncResource.prototype, EventDispatcher.prototype, ActionQueue.prototype);
