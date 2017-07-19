import AsyncResource from "./asyncresource";
import { get, mix } from "./common";

/**
 * @constructor
 * @augments AsyncResource
 * @param {ModelViewer} env
 * @param {function(?)} pathSolver
 */
function DownloadableResource(env, pathSolver) {
    AsyncResource.call(this, env);

    /** @member {function(?)} */
    this.pathSolver = pathSolver;

    /** @member {string} */
    this.fetchUrl = "";

    /** 
     * Note: this is set by the viewer right after the object is constructed.
     * 
     * @member {Handler}
     */
    this.Handler = null;
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
            get(src, isBinary, (xhr) => this.onprogress(xhr)).then((xhr) => this.onload(xhr.response), (xhr) => this.onerror("HttpError", xhr));
        } else {
            this.onload(src);
        }
    }
};

mix(DownloadableResource.prototype, AsyncResource.prototype);

export default DownloadableResource;
