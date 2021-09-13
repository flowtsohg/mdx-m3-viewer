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
  dontInheritTranslation: number;
  dontInheritRotation: number;
  dontInheritScaling: number;
  billboarded: number;
  billboardedX: number;
  billboardedY: number;
  billboardedZ: number;
  cameraAnchored: number;
  anyBillboarding: boolean;

  constructor(model: MdxModel, object: MdlxGenericObject, index: number) {
    super(model, object);

    this.index = index;
    this.name = object.name;
    this.objectId = object.objectId;
    this.parentId = object.parentId;
    this.pivot = <vec3>model.pivotPoints[object.objectId] || vec3.create();

    const flags = object.flags;
    this.dontInheritTranslation = flags & Flags.DontInheritTranslation;
    this.dontInheritRotation = flags & Flags.DontInheritRotation;
    this.dontInheritScaling = flags & Flags.DontInheritScaling;
    this.billboarded = flags & Flags.Billboarded;
    this.billboardedX = flags & Flags.BillboardedLockX;
    this.billboardedY = flags & Flags.BillboardedLockY;
    this.billboardedZ = flags & Flags.BillboardedLockZ;
    this.cameraAnchored = flags & Flags.CameraAnchored;

    this.anyBillboarding = (this.billboarded || this.billboardedX || this.billboardedY || this.billboardedZ) !== 0;

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
  getVisibility(out: Float32Array, sequence: number, frame: number, counter: number) {
    out[0] = 1;

    return -1;
  }

  getTranslation(out: vec3, sequence: number, frame: number, counter: number) {
    return this.getVectorValue(<Float32Array>out, 'KGTR', sequence, frame, counter, <Float32Array>VEC3_ZERO);
  }

  getRotation(out: quat, sequence: number, frame: number, counter: number) {
    return this.getQuatValue(<Float32Array>out, 'KGRT', sequence, frame, counter, <Float32Array>QUAT_DEFAULT);
  }

  getScale(out: vec3, sequence: number, frame: number, counter: number) {
    return this.getVectorValue(<Float32Array>out, 'KGSC', sequence, frame, counter, <Float32Array>VEC3_ONE);
  }
}
