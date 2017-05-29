/**
 * @class
 * @classdesc A base class for all generic files.
 * @extends DownloadableResource
 * @param {ModelViewer} env The model viewer object that this model belongs to.
 * @param {function} pathSolver A function that solves paths. See more {@link PathSolver here}.
 */
function ViewerFile(env, pathSolver) {
    DownloadableResource.call(this, env, pathSolver);
}

ViewerFile.prototype = {
    get objectType() {
        return "file";
    }
};

mix(ViewerFile.prototype, DownloadableResource.prototype);
