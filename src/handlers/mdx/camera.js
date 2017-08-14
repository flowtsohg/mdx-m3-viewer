import { vec3 } from "gl-matrix";
import MdxSdContainer from "./sd";

// Heap allocations needed for this module.
let positionHeap = vec3.create(),
    targetPositionHeap = vec3.create();

/**
 * @constructor
 * @param {MdxModel} model
 * @param {MdxParserCamera} camera
 */
function MdxCamera(model, camera) {
    this.name = camera.name;
    this.position = camera.position;
    this.fieldOfView = camera.fieldOfView;
    this.farClippingPlane = camera.farClippingPlane;
    this.nearClippingPlane = camera.nearClippingPlane;
    this.targetPosition = camera.targetPosition;
    this.sd = new MdxSdContainer(model, camera.tracks);
}

MdxCamera.prototype = {
    getPositionTranslation(instance) {
        return this.sd.getValue3(positionHeap, "KCTR", instance, this.position);
    },

    getTargetTranslation(instance) {
        return this.sd.getValue3(targetPositionHeap, "KTTR", instance, this.targetPosition);
    },

    getRotation(instance) {
        return this.sd.getValue("KCRL", instance, 0);
    }
};

export default MdxCamera;
