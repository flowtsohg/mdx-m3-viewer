import mix from '../common/mix';
import EventDispatcher from './eventdispatcher';

/**
 * @constructor
 * @augments EventDispatcher
 * @param {ModelViewer} env
 */
function AsyncResource(env) {
    EventDispatcher.call(this);

    /** @member {ModelViewer} */
    this.env = env;
    /** @member {boolean} */
    this.loaded = false;
    /** @member {boolean} */
    this.error = false;
}

AsyncResource.prototype = {
    /**
     * Similar to attaching an event listener to the 'loadend' event, but handles the case where the resource already loaded, and the callback should still be called.
     * 
     * @param {function(AsyncResource)} callback The function to call.
     * @returns this
     */
    whenLoaded(callback) {
        if (this.loaded || this.error) {
            callback(this);
        } else {
            this.once('loadend', () => callback(this));
        }

        return this;
    },

    initialize(src) {
        throw new Error('AsyncResource.initialize must be overriden!');
    },

    detach() {

    },

    update() {

    },

    load() {
        this.dispatchEvent({ type: 'loadstart' });
    },

    onload(src) {
        // This check allows an handler to postpone load finalization, either for asynchronious reasons (e.g. PngTexture), or because an internal error occured
        if (this.initialize(src)) {
            this.finalizeLoad();
        }
    },

    finalizeLoad() {
        this.loaded = true;

        this.dispatchEvent({ type: 'load' });
        this.dispatchEvent({ type: 'loadend' });
    },

    onerror(error, reason) {
        this.error = true;

        this.dispatchEvent({ type: 'error', error, reason });
        this.dispatchEvent({ type: 'loadend' });
    }
};

mix(AsyncResource.prototype, EventDispatcher.prototype);

export default AsyncResource;
