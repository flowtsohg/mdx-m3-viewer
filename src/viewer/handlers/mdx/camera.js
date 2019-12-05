import GenericObject from './genericobject';

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
   * @param {vec3} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getPositionTranslation(out, instance) {
    return this.getVectorValue(out, 'KCTR', instance, this.position);
  }

  /**
   * @param {vec3} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getTargetTranslation(out, instance) {
    return this.getVectorValue(out, 'KTTR', instance, this.targetPosition);
  }

  /**
   * @param {Uint32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getRotation(out, instance) {
    return this.getScalarValue(out, 'KCRL', instance, 0);
  }
}
