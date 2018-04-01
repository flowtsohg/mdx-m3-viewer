import { vec3 } from 'gl-matrix';
import GenericObject from './genericobject';

// Heap allocations needed for this module.
let positionHeap = vec3.create(),
    targetPositionHeap = vec3.create();

export default class Camera extends GenericObject {
    /**
     * @param {MdxModel} model
     * @param {MdxParserCamera} camera
     */
    constructor(model, camera, pivotPoints, index) {
        super(model, camera, pivotPoints, index);

        this.name = camera.name;
        this.position = camera.position;
        this.fieldOfView = camera.fieldOfView;
        this.farClippingPlane = camera.farClippingPlane;
        this.nearClippingPlane = camera.nearClippingPlane;
        this.targetPosition = camera.targetPosition;
    }

    getPositionTranslation(instance) {
        return this.getValue3(positionHeap, 'KCTR', instance, this.position);
    }

    getTargetTranslation(instance) {
        return this.getValue3(targetPositionHeap, 'KTTR', instance, this.targetPosition);
    }

    getRotation(instance) {
        return this.getValue('KCRL', instance, 0);
    }
};
