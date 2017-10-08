import mix from './mix';
import { get } from './common';
import AsyncResource from './asyncresource';

/**
 * @constructor
 * @augments AsyncResource
 * @param {ModelViewer} env
 * @param {function(?)} pathSolver
 * @param {Handler} handler
 * @param {string} extension
 */
function DownloadableResource(env, pathSolver, handler, extension) {
    AsyncResource.call(this, env);

    /** @member {function(?)} */
    this.pathSolver = pathSolver;
    /** @member {Handler} */
    this.handler = handler;
    /** @member {string} */
    this.extension = extension;
    /** @member {string} */
    this.fetchUrl = '';
}

DownloadableResource.prototype = {
    /**
     * Load this resource.
     * If this is a server fetch, handles the fetching, and will call the onload method afterwards.
     * If this isn't a server fetch, immediately calls onload.
     */
    load(src, isBinary, serverFetch) {
        if (serverFetch) {
            this.fetchUrl = src;
        }

        AsyncResource.prototype.load.call(this);

        if (serverFetch) {
            get(src, isBinary, (xhr) => this.onprogress(xhr)).then((xhr) => this.onload(xhr.response), (xhr) => this.onerror('HttpError', xhr));
        } else {
            this.onload(src);
        }
    },

    // Propagate native progress events.
    onprogress(e) {
        if (e.target.status === 200) {
            this.dispatchEvent({ type: 'progress', loaded: e.loaded, total: e.total, lengthComputable: e.lengthComputable });
        }
    },
};

mix(DownloadableResource.prototype, AsyncResource.prototype);

export default DownloadableResource;
