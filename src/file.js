import mix from "./mix";
import DownloadableResource from "./downloadableresource";

/**
 * @constructor
 * @augments DownloadableResource
 * @param {ModelViewer} env
 * @param {function(?)} pathSolver
 * @param {Handler} handler
 * @param {string} extension
 */
function ViewerFile(env, pathSolver, handler, extension) {
    DownloadableResource.call(this, env, pathSolver, handler, extension);
}

ViewerFile.prototype = {
    get objectType() {
        return "file";
    }
};

mix(ViewerFile.prototype, DownloadableResource.prototype);

export default ViewerFile;
