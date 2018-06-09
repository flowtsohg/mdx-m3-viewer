import {vec3} from 'gl-matrix';
import {VEC3_ZERO, VEC3_ONE, QUAT_DEFAULT} from '../../../common/gl-matrix-addon';
import AnimatedObject from './animatedobject';

/**
 * An MDX generic object.
 */
export default class GenericObject extends AnimatedObject {
  /**
   * @param {handlers.mdl.Model} model
   * @param {parsers.mdlx.GenericObject} object
   * @param {number} index
   */
  constructor(model, object, index) {
    super(model, object);

    this.index = index;
    this.name = object.name;
    this.objectId = object.objectId;
    this.parentId = object.parentId;
    this.pivot = model.pivotPoints[object.objectId] || vec3.create();

    let flags = object.flags;

    this.dontInheritTranslation = flags & 0x1;
    this.dontInheritRotation = flags & 0x2;
    this.dontInheritScaling = flags & 0x4;
    this.billboarded = flags & 0x8;
    this.billboardedX = flags & 0x10;
    this.billboardedY = flags & 0x20;
    this.billboardedZ = flags & 0x40;
    this.cameraAnchored = flags & 0x80;
    this.bone = flags & 0x100;
    this.light = flags & 0x200;
    this.eventObject = flags & 0x400;
    this.attachment = flags & 0x800;
    this.particleEmitter = flags & 0x1000;
    this.collisionShape = flags & 0x2000;
    this.ribbonEmitter = flags & 0x4000;
    this.emitterUsesMdlOrUnshaded = flags & 0x8000;
    this.emitterUsesTgaOrSortPrimitivesFarZ = flags & 0x10000;
    this.lineEmitter = flags & 0x20000;
    this.unfogged = flags & 0x40000;
    this.modelSpace = flags & 0x80000;
    this.xYQuad = flags & 0x100000;

    this.anyBillboarding = this.billboarded || this.billboardedX || this.billboardedY || this.billboardedZ;

    if (object.objectId === object.parentId) {
      this.parentId = -1;
    }

    let variants = {
      translation: [],
      rotation: [],
      scale: [],
      generic: [],
    };

    for (let i = 0, l = model.sequences.length; i < l; i++) {
      let translation = this.isTranslationVariant(i);
      let rotation = this.isRotationVariant(i);
      let scale = this.isScaleVariant(i);

      variants.translation[i] = translation;
      variants.rotation[i] = rotation;
      variants.scale[i] = scale;
      variants.generic[i] = translation || rotation || scale;
    }

    this.variants = variants;
  }

  /**
   * Many of the generic objects have animated visibilities.
   * This is a generic getter to allow the code to be consistent.
   *
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getVisibility(out, instance) {
    out[0] = 1;
    return -1;
  }

  /**
   * @param {vec3} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getTranslation(out, instance) {
    return this.getVector3Value(out, 'KGTR', instance, VEC3_ZERO);
  }

  /**
   * @param {quat} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getRotation(out, instance) {
    return this.getVector4Value(out, 'KGRT', instance, QUAT_DEFAULT);
  }

  /**
   * @param {vec3} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getScale(out, instance) {
    return this.getVector3Value(out, 'KGSC', instance, VEC3_ONE);
  }

  /**
   * @param {number} sequence
   * @return {boolean}
   */
  isTranslationVariant(sequence) {
    return this.isVariant('KGTR', sequence);
  }

  /**
   * @param {number} sequence
   * @return {boolean}
   */
  isRotationVariant(sequence) {
    return this.isVariant('KGRT', sequence);
  }

  /**
   * @param {number} sequence
   * @return {boolean}
   */
  isScaleVariant(sequence) {
    return this.isVariant('KGSC', sequence);
  }
}
