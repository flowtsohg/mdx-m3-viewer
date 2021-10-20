import { vec3, quat } from 'gl-matrix';
import { VEC3_ZERO, VEC3_ONE, QUAT_DEFAULT } from '../../../common/gl-matrix-addon';
import MdlxGenericObject, { Flags } from '../../../parsers/mdlx/genericobject';
import AnimatedObject from './animatedobject';
import MdxModel from './model';

/**
 * An MDX generic object.
 */
export default class GenericObject extends AnimatedObject {
  index: number;
  name: string;
  objectId: number;
  parentId: number;
  pivot: vec3;
  dontInheritTranslation: boolean;
  dontInheritRotation: boolean;
  dontInheritScaling: boolean;
  billboarded: boolean;
  billboardedX: boolean;
  billboardedY: boolean;
  billboardedZ: boolean;
  cameraAnchored: boolean;
  anyBillboarding: boolean;

  constructor(model: MdxModel, object: MdlxGenericObject, index: number) {
    super(model, object);

    this.index = index;
    this.name = object.name;
    this.objectId = object.objectId;
    this.parentId = object.parentId;
    this.pivot = <vec3>model.pivotPoints[object.objectId] || vec3.create();

    const flags = object.flags;
    this.dontInheritTranslation = (flags & Flags.DontInheritTranslation) > 0;
    this.dontInheritRotation = (flags & Flags.DontInheritRotation) > 0;
    this.dontInheritScaling = (flags & Flags.DontInheritScaling) > 0;
    this.billboarded = (flags & Flags.Billboarded) > 0;
    this.billboardedX = (flags & Flags.BillboardedLockX) > 0;
    this.billboardedY = (flags & Flags.BillboardedLockY) > 0;
    this.billboardedZ = (flags & Flags.BillboardedLockZ) > 0;
    this.cameraAnchored = (flags & Flags.CameraAnchored) > 0;
    this.anyBillboarding = this.billboarded || this.billboardedX || this.billboardedY || this.billboardedZ;

    if (object.objectId === object.parentId) {
      this.parentId = -1;
    }

    this.addVariants('KGTR', 'translation');
    this.addVariants('KGRT', 'rotation');
    this.addVariants('KGSC', 'scale');
    this.addVariantIntersection(['translation', 'rotation', 'scale'], 'generic');
  }

  /**
   * Give a consistent visibility getter for all generic objects.
   * 
   * Many of the generic objects have animated visibilities, and will override this.
   */
  getVisibility(out: Float32Array, _sequence: number, _frame: number, _counter: number): number {
    out[0] = 1;

    return -1;
  }

  getTranslation(out: vec3, sequence: number, frame: number, counter: number): number {
    return this.getVectorValue(<Float32Array>out, 'KGTR', sequence, frame, counter, <Float32Array>VEC3_ZERO);
  }

  getRotation(out: quat, sequence: number, frame: number, counter: number): number {
    return this.getQuatValue(<Float32Array>out, 'KGRT', sequence, frame, counter, <Float32Array>QUAT_DEFAULT);
  }

  getScale(out: vec3, sequence: number, frame: number, counter: number): number {
    return this.getVectorValue(<Float32Array>out, 'KGSC', sequence, frame, counter, <Float32Array>VEC3_ONE);
  }
}
