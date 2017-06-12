/**
 * @constructor
 * @mixes AsyncResource
 * @param {ModelViewer} env
 * @param {function(?)} pathSolver
 */
function DownloadableResource(env, pathSolver) {
    AsyncResource.call(this, env);

    /** @member {function(?)} */
    this.pathSolver = pathSolver;
}

DownloadableResource.prototype = {
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
