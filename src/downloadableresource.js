/**
 * @class
 * @classdesc A base class for resources that are meant to be downloaded (models, textures, and generic files).
 * @extends AsyncResource
 * @param {ModelViewer} env The model viewer object that this model belongs to.
 * @param {function} pathSolver A function that solves paths. See more {@link PathSolver here}.
 */
function DownloadableResource(env, pathSolver) {
    /** @member {function} */
    this.pathSolver = pathSolver;

    AsyncResource.call(this, env);
}

DownloadableResource.prototype = {
    onerrorXHR(xhr) {
        this.onerror("HttpError", xhr);
    },

    load(src, isBinary, serverFetch) {
        if (serverFetch) {
            get(src, isBinary, xhr => this.onprogress(xhr)).then(xhr => this.onload(xhr.response), xhr => this.onerrorXHR(xhr));
        } else {
            this.onload(src);
        }
    }
};

mix(DownloadableResource.prototype, AsyncResource.prototype);
