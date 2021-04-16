import { vec3, quat, mat4 } from 'gl-matrix';
import Scene from './scene';
import { Node } from './node';

const rotationHeap = quat.create();
const scalingHeap = vec3.create();

/**
 * A skeletal node used for skeletons.
 * 
 * Expected to be created with createSkeletalNodes() below.
 */
export class SkeletalNode {
  pivot: vec3;
  localLocation: vec3;
  localRotation: quat;
  localScale: vec3;
  worldLocation: vec3;
  worldRotation: quat;
  worldScale: vec3;
  inverseWorldLocation: vec3;
  inverseWorldRotation: quat;
  inverseWorldScale: vec3;
  localMatrix: mat4;
  worldMatrix: mat4;
  dontInheritTranslation: boolean = false;
  dontInheritRotation: boolean = false;
  dontInheritScaling: boolean = false;
  billboarded: boolean = false;
  billboardedX: boolean = false;
  billboardedY: boolean = false;
  billboardedZ: boolean = false;
  dirty: boolean = true;
  wasDirty: boolean = false;
  parent: SkeletalNode | Node | null = null;
  children: Node[] = [];
  /**
   * The object associated with this node, if there is any.
   */
  object: any = null;

  constructor(pivot: vec3,
    localLocation: vec3, localRotation: quat, localScale: vec3,
    worldLocation: vec3, worldRotation: quat, worldScale: vec3,
    inverseWorldLocation: vec3, inverseWorldRotation: quat, inverseWorldScale: vec3,
    localMatrix: mat4, worldMatrix: mat4) {
    this.pivot = pivot;
    this.localLocation = localLocation;
    this.localRotation = localRotation;
    this.localScale = localScale;
    this.worldLocation = worldLocation;
    this.worldRotation = worldRotation;
    this.worldScale = worldScale;
    this.inverseWorldLocation = inverseWorldLocation;
    this.inverseWorldRotation = inverseWorldRotation;
    this.inverseWorldScale = inverseWorldScale;
    this.localMatrix = localMatrix;
    this.worldMatrix = worldMatrix;

    this.localRotation[3] = 1;

    this.localScale.fill(1);

    this.localMatrix[0] = 1;
    this.localMatrix[5] = 1;
    this.localMatrix[10] = 1;
    this.localMatrix[15] = 1;
  }

  /**
   * Recalculate this skeletal node.
   */
  recalculateTransformation(scene: Scene) {
    let localMatrix = this.localMatrix;
    let localRotation = this.localRotation;
    let localScale = this.localScale;
    let worldMatrix = this.worldMatrix;
    let worldLocation = this.worldLocation;
    let worldRotation = this.worldRotation;
    let worldScale = this.worldScale;
    let pivot = this.pivot;
    let inverseWorldLocation = this.inverseWorldLocation;
    let inverseWorldRotation = this.inverseWorldRotation;
    let inverseWorldScale = this.inverseWorldScale;
    let parent = <SkeletalNode | Node>this.parent;
    let computedRotation;
    let computedScaling;

    if (this.dontInheritScaling) {
      computedScaling = scalingHeap;

      let parentInverseScale = parent.inverseWorldScale;
      computedScaling[0] = parentInverseScale[0] * localScale[0];
      computedScaling[1] = parentInverseScale[1] * localScale[1];
      computedScaling[2] = parentInverseScale[2] * localScale[2];

      worldScale[0] = localScale[0];
      worldScale[1] = localScale[1];
      worldScale[2] = localScale[2];
    } else {
      computedScaling = localScale;

      let parentScale = parent.worldScale;
      worldScale[0] = parentScale[0] * localScale[0];
      worldScale[1] = parentScale[1] * localScale[1];
      worldScale[2] = parentScale[2] * localScale[2];
    }

    if (this.billboarded) {
      computedRotation = rotationHeap;

      quat.copy(computedRotation, parent.inverseWorldRotation);
      quat.mul(computedRotation, computedRotation, scene.camera.inverseRotation);

      this.convertBasis(computedRotation);

      quat.mul(computedRotation, computedRotation, localRotation);
    } else {
      computedRotation = localRotation;
    }

    mat4.fromRotationTranslationScaleOrigin(localMatrix, computedRotation, this.localLocation, computedScaling, pivot);

    mat4.mul(worldMatrix, parent.worldMatrix, localMatrix);

    quat.mul(worldRotation, parent.worldRotation, computedRotation);

    // Inverse world rotation
    inverseWorldRotation[0] = -worldRotation[0];
    inverseWorldRotation[1] = -worldRotation[1];
    inverseWorldRotation[2] = -worldRotation[2];
    inverseWorldRotation[3] = worldRotation[3];

    // Inverse world scale
    inverseWorldScale[0] = 1 / worldScale[0];
    inverseWorldScale[1] = 1 / worldScale[1];
    inverseWorldScale[2] = 1 / worldScale[2];

    // World location
    // vec3.transformMat4(worldLocation, pivot, worldMatrix);
    let x = pivot[0];
    let y = pivot[1];
    let z = pivot[2];
    worldLocation[0] = worldMatrix[0] * x + worldMatrix[4] * y + worldMatrix[8] * z + worldMatrix[12];
    worldLocation[1] = worldMatrix[1] * x + worldMatrix[5] * y + worldMatrix[9] * z + worldMatrix[13];
    worldLocation[2] = worldMatrix[2] * x + worldMatrix[6] * y + worldMatrix[10] * z + worldMatrix[14];

    // Inverse world location
    inverseWorldLocation[0] = -worldLocation[0];
    inverseWorldLocation[1] = -worldLocation[1];
    inverseWorldLocation[2] = -worldLocation[2];
  }

  /**
   * Allows inherited node classes to run extra transformations when billboarding.
   * 
   * This is needed because the different model formats are in different vector spaces.
   */
  convertBasis(rotation: quat) {

  }
}

const NODE_SHARED_SIZE = 65;

/**
 * Creates an array of skeletal nodes with shared memory.
 * 
 * The returned object contains the node array itself, the backing buffer, and all of the different shared arrays.
 */
export function createSkeletalNodes(count: number, Node: typeof SkeletalNode = SkeletalNode) {
  let data = new Float32Array(count * NODE_SHARED_SIZE);
  let nodes = [];
  let offset = 0;
  let count3 = count * 3;
  let count4 = count * 4;
  let count16 = count * 16;

  let pivots = data.subarray(offset, offset + count3);
  offset += count3;

  let localLocations = data.subarray(offset, offset + count3);
  offset += count3;

  let localRotations = data.subarray(offset, offset + count4);
  offset += count4;

  let localScales = data.subarray(offset, offset + count3);
  offset += count3;

  let worldLocations = data.subarray(offset, offset + count3);
  offset += count3;

  let worldRotations = data.subarray(offset, offset + count4);
  offset += count4;

  let worldScales = data.subarray(offset, offset + count3);
  offset += count3;

  let inverseWorldLocations = data.subarray(offset, offset + count3);
  offset += count3;

  let invereseWorldRotations = data.subarray(offset, offset + count4);
  offset += count4;

  let inverseWorldScales = data.subarray(offset, offset + count3);
  offset += count3;

  let localMatrices = data.subarray(offset, offset + count16);
  offset += count16;

  let worldMatrices = data.subarray(offset, offset + count16);

  for (let i = 0; i < count; i++) {
    let i3 = i * 3;
    let i33 = i3 + 3;
    let i4 = i * 4;
    let i44 = i4 + 4;
    let i16 = i * 16;
    let i1616 = i16 + 16;

    nodes[i] = new Node(
      pivots.subarray(i3, i33),
      localLocations.subarray(i3, i33),
      localRotations.subarray(i4, i44),
      localScales.subarray(i3, i33),
      worldLocations.subarray(i3, i33),
      worldRotations.subarray(i4, i44),
      worldScales.subarray(i3, i33),
      inverseWorldLocations.subarray(i3, i33),
      invereseWorldRotations.subarray(i4, i44),
      inverseWorldScales.subarray(i3, i33),
      localMatrices.subarray(i16, i1616),
      worldMatrices.subarray(i16, i1616),
    );
  }

  return {
    data,
    nodes,
    pivots,
    localLocations,
    localRotations,
    localScales,
    worldLocations,
    worldRotations,
    worldScales,
    inverseWorldLocations,
    invereseWorldRotations,
    inverseWorldScales,
    localMatrices,
    worldMatrices,
  };
}
