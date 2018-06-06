import {vec3} from 'gl-matrix';
import GenericObject from './genericobject';

// Heap allocations needed for this module.
let positionHeap = vec3.create();
let targetPositionHeap = vec3.create();

/**
 * An MDX camera.
 */
export default class Camera extends GenericObject {
  /**
   * @param {ModelViewer.viewer.handlers.mdx.Model} model
   * @param {ModelViewer.parsers.mdlx.Camera} camera
   * @param {number} index
   */
  constructor(model, camera, index) {
    super(model, camera, index);

    this.name = camera.name;
    this.position = camera.position;
    this.fieldOfView = camera.fieldOfView;
    this.farClippingPlane = camera.farClippingPlane;
    this.nearClippingPlane = camera.nearClippingPlane;
    this.targetPosition = camera.targetPosition;
  }

  /**
   * @param {ModelInstance} instance
   * @return {vec3}
   */
  getPositionTranslation(instance) {
    return this.getValue3(positionHeap, 'KCTR', instance, this.position);
  }

  /**
   * @param {ModelInstance} instance
   * @return {vec3}
   */
  getTargetTranslation(instance) {
    return this.getValue3(targetPositionHeap, 'KTTR', instance, this.targetPosition);
  }

  /**
   * @param {ModelInstance} instance
   * @return {quat}
   */
  getRotation(instance) {
    return this.getValue('KCRL', instance, 0);
  }
}
