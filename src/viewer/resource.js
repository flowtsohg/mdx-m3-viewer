import EventDispatcher from './eventdispatcher';

export default class Resource extends EventDispatcher {
    /**
     * @param {Object} resourceData
     */
    constructor({ viewer, handler, extension, pathSolver, fetchUrl }) {
        super();

        /** @member {ModelViewer.viewer.ModelViewer} */
        this.viewer = viewer;
        /** @member {Handler} */
        this.handler = handler;
        /** @member {string} */
        this.extension = extension;
        /** @member {boolean} */
        /** @member {function(?)} */
        this.pathSolver = pathSolver;
        /** @member {string} */
        this.fetchUrl = fetchUrl;
        this.loaded = false;
        /** @member {boolean} */
        this.errored = false;
    }

    loadData(src) {
        this.load(src);

        this.loaded = true;

        this.lateLoad();

        this.dispatchEvent({ type: 'load' });
        this.dispatchEvent({ type: 'loadend' });
    }

    error(error, reason) {
        this.errored = true;

        this.dispatchEvent({ type: 'error', error, reason });
        this.dispatchEvent({ type: 'loadend' });
    }

    /**
     * Similar to attaching an event listener to the 'loadend' event, but handles the case where the resource already loaded, and the callback should still be called.
     * 
     * @returns {Promise}
     */
    whenLoaded() {
        return new Promise((resolve, reject) => {
            if (this.loaded || this.errored) {
                resolve(this);
            } else {
                this.once('loadend', () => resolve(this));
            }
        });
    }

    lateLoad() {
        
    }
};
