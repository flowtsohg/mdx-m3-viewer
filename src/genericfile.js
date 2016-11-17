/**
 * @class
 * @classdesc A base class for all generic files.
 * @extends DownloadableResource
 * @param {ModelViewer} env The model viewer object that this model belongs to.
 * @param {function} pathSolver A function that solves paths. See more {@link PathSolver here}.
 */
function GenericFile(env, pathSolver) {
    DownloadableResource.call(this, env, pathSolver);
}

GenericFile.prototype = {
    get objectType() {
        return "file";
    }
};

mix(GenericFile.prototype, DownloadableResource.prototype);
