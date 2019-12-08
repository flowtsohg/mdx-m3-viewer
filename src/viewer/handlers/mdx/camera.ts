import MdlxCamera from '../../../parsers/mdlx/camera';
import AnimatedObject from './animatedobject';
import MdxModel from './model';
import MdxComplexInstance from './complexinstance';

/**
 * An MDX camera.
 */
export default class Camera extends AnimatedObject {
  name: string;
  position: Float32Array;
  fieldOfView: number;
  farClippingPlane: number;
  nearClippingPlane: number;
  targetPosition: Float32Array;

  constructor(model: MdxModel, camera: MdlxCamera) {
    super(model, camera);

    this.name = camera.name;
    this.position = camera.position;
    this.fieldOfView = camera.fieldOfView;
    this.farClippingPlane = camera.farClippingPlane;
    this.nearClippingPlane = camera.nearClippingPlane;
    this.targetPosition = camera.targetPosition;
  }

  getPositionTranslation(out: Float32Array, instance: MdxComplexInstance) {
    return this.getVectorValue(out, 'KCTR', instance, this.position);
  }

  getTargetTranslation(out: Float32Array, instance: MdxComplexInstance) {
    return this.getVectorValue(out, 'KTTR', instance, this.targetPosition);
  }

  getRotation(out: Uint32Array, instance: MdxComplexInstance) {
    return this.getScalarValue(out, 'KCRL', instance, 0);
  }
}
