import { mix } from "./common";
import AsyncResource from "./asyncresource";

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
