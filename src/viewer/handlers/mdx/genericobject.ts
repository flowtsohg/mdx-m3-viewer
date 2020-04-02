import { vec3, quat } from 'gl-matrix';
import { VEC3_ZERO, VEC3_ONE, QUAT_DEFAULT } from '../../../common/gl-matrix-addon';
import MdlxGenericObject from '../../../parsers/mdlx/genericobject';
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
  emitterUsesMdlOrUnshaded: number;
  emitterUsesTgaOrSortPrimitivesFarZ: number;
  lineEmitter: number;
  unfogged: number;
  modelSpace: number;
  xYQuad: number;
  anyBillboarding: boolean;

  constructor(model: MdxModel, object: MdlxGenericObject, index: number) {
    super(model, object);

    this.index = index;
    this.name = object.name;
    this.objectId = object.objectId;
    this.parentId = object.parentId;
    this.pivot = <vec3>model.pivotPoints[object.objectId] || vec3.create();

    let flags = object.flags;

    this.dontInheritTranslation = flags & 0x1;
    this.dontInheritRotation = flags & 0x2;
    this.dontInheritScaling = flags & 0x4;
    this.billboarded = flags & 0x8;
    this.billboardedX = flags & 0x10;
    this.billboardedY = flags & 0x20;
    this.billboardedZ = flags & 0x40;
    this.cameraAnchored = flags & 0x80;
    this.emitterUsesMdlOrUnshaded = flags & 0x8000;
    this.emitterUsesTgaOrSortPrimitivesFarZ = flags & 0x10000;
    this.lineEmitter = flags & 0x20000;
    this.unfogged = flags & 0x40000;
    this.modelSpace = flags & 0x80000;
    this.xYQuad = flags & 0x100000;

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
