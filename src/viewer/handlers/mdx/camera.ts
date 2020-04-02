import MdlxCamera from '../../../parsers/mdlx/camera';
import AnimatedObject from './animatedobject';
import MdxModel from './model';

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

  getPositionTranslation(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getVectorValue(out, 'KCTR', sequence, frame, counter, this.position);
  }

  getTargetTranslation(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getVectorValue(out, 'KTTR', sequence, frame, counter, this.targetPosition);
  }

  getRotation(out: Uint32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KCRL', sequence, frame, counter, 0);
  }
}
