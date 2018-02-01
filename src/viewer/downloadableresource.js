import mix from '../common/mix';
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

mix(DownloadableResource.prototype, AsyncResource.prototype);

export default DownloadableResource;
