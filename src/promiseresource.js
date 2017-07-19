import AsyncResource from "./asyncresource";
import { mix } from "./common";

/**
 * @constructor
 * @augments AsyncResource
 * @param {ModelViewer} env
 */
function PromiseResource(env) {
    AsyncResource.call(this, env);
}

PromiseResource.prototype = {
    resolve() {
        this.finalizeLoad();
    }
};

mix(PromiseResource.prototype, AsyncResource.prototype);

export default PromiseResource;
