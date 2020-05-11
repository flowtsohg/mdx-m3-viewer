import { vec3, quat, mat4 } from 'gl-matrix';
import { VEC3_ZERO, VEC3_ONE, QUAT_DEFAULT, quatLookAt } from '../common/gl-matrix-addon';
import Scene from './scene';

const locationHeap = vec3.create();
const rotationHeap = quat.create();
const scalingHeap = vec3.create();
const faceHeap = mat4.create();

/**
 * A node.
 */
export class Node {
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
  parent: Node | SkeletalNode | null;
  children: Node[];
  dontInheritTranslation: boolean;
  dontInheritRotation: boolean;
  dontInheritScaling: boolean;
  visible: boolean;
  wasDirty: boolean;
  dirty: boolean;

  constructor() {
    this.pivot = vec3.create();
    this.localLocation = vec3.create();
    this.localRotation = quat.create();
    this.localScale = vec3.fromValues(1, 1, 1);
    this.worldLocation = vec3.create();
    this.worldRotation = quat.create();
    this.worldScale = vec3.create();
    this.inverseWorldLocation = vec3.create();
    this.inverseWorldRotation = quat.create();
    this.inverseWorldScale = vec3.create();
    this.localMatrix = mat4.create();
    this.worldMatrix = mat4.create();
    this.parent = null;
    this.children = [];
    this.dontInheritTranslation = false;
    this.dontInheritRotation = false;
    this.dontInheritScaling = true;
    this.visible = true;
    this.wasDirty = false;
    this.dirty = true;
  }

  /**
   * Sets the node's pivot.
   */
  setPivot(pivot: vec3) {
    vec3.copy(this.pivot, pivot);

    this.dirty = true;

    return this;
  }

  /**
   * Sets the node's local location.
   */
  setLocation(location: vec3) {
    vec3.copy(this.localLocation, location);

    this.dirty = true;

    return this;
  }

  /**
   * Sets the node's local rotation.
   */
  setRotation(rotation: quat) {
    quat.copy(this.localRotation, rotation);

    this.dirty = true;

    return this;
  }

  /**
   * Sets the node's local scale.
   */
  setScale(varying: vec3) {
    vec3.copy(this.localScale, varying);

    this.dirty = true;

    return this;
  }

  /**
   * Sets the node's local scale uniformly.
   */
  setUniformScale(uniform: number) {
    vec3.set(this.localScale, uniform, uniform, uniform);

    this.dirty = true;

    return this;
  }

  /**
   * Sets the node's local location, rotation, and scale.
   */
  setTransformation(location: vec3, rotation: quat, scale: vec3) {
    let localLocation = this.localLocation;
    let localRotation = this.localRotation;
    let localScale = this.localScale;

    localLocation[0] = location[0];
    localLocation[1] = location[1];
    localLocation[2] = location[2];
    // vec3.copy(this.localLocation, location);

    localRotation[0] = rotation[0];
    localRotation[1] = rotation[1];
    localRotation[2] = rotation[2];
    localRotation[3] = rotation[3];
    // quat.copy(this.localRotation, rotation);

    localScale[0] = scale[0];
    localScale[1] = scale[1];
    localScale[2] = scale[2];
    // vec3.copy(this.localScale, scale);

    this.dirty = true;

    return this;
  }

  /**
   * Resets the node's local location, pivot, rotation, and scale, to the default values.
   */
  resetTransformation() {
    vec3.copy(this.pivot, VEC3_ZERO);
    vec3.copy(this.localLocation, VEC3_ZERO);
    quat.copy(this.localRotation, QUAT_DEFAULT);
    vec3.copy(this.localScale, VEC3_ONE);

    this.dirty = true;

    return this;
  }

  /**
   * Moves the node's pivot.
   */
  movePivot(offset: vec3) {
    vec3.add(this.pivot, this.pivot, offset);

    this.dirty = true;

    return this;
  }

  /**
   * Moves the node's local location.
   */
  move(offset: vec3) {
    vec3.add(this.localLocation, this.localLocation, offset);

    this.dirty = true;

    return this;
  }

  /**
   * Rotates the node's local rotation in world space.
   */
  rotate(rotation: quat) {
    quat.mul(this.localRotation, this.localRotation, rotation);

    this.dirty = true;

    return this;
  }

  /**
   * Rotates the node's local rotation in local space.
   */
  rotateLocal(rotation: quat) {
    quat.mul(this.localRotation, rotation, this.localRotation);

    this.dirty = true;

    return this;
  }

  /**
   * Scales the node.
   */
  scale(scale: vec3) {
    vec3.mul(this.localScale, this.localScale, scale);

    this.dirty = true;

    return this;
  }

  /**
   * Scales the node uniformly.
   */
  uniformScale(scale: number) {
    vec3.scale(this.localScale, this.localScale, scale);

    this.dirty = true;

    return this;
  }

  face(to: vec3, worldUp: vec3) {
    quat.conjugate(this.localRotation, quatLookAt(this.localRotation, this.localLocation, to, worldUp));

    this.dirty = true;
  }

  /**
   * Sets the node's parent.
   */
  setParent(parent?: Node | SkeletalNode) {
    // If the node already had a parent, detach from it first.
    if (this.parent) {
      let children = this.parent.children;
      let index = children.indexOf(this);

      if (index !== -1) {
        children.splice(index, 1);
      }
    }

    this.parent = parent || null;

    // If the new parent is an actual thing, add this node as a child.
    if (parent) {
      parent.children.push(this);
    }

    // this.recalculateTransformation();
    this.dirty = true;

    return this;
  }

  /**
   * Recalculate this node's transformation data.
   */
  recalculateTransformation() {
    let dirty = this.dirty;
    let parent = this.parent;

    // Need to update if this node is dirty, or if its parent was dirty.
    this.wasDirty = this.dirty;

    if (parent) {
      dirty = dirty || parent.wasDirty;
    }

    this.wasDirty = dirty;

    if (dirty) {
      this.dirty = false;

      let localMatrix = this.localMatrix;
      let localLocation = this.localLocation;
      let localRotation = this.localRotation;
      let localScale = this.localScale;
      let worldMatrix = this.worldMatrix;
      let worldLocation = this.worldLocation;
      let worldRotation = this.worldRotation;
      let worldScale = this.worldScale;
      let inverseWorldLocation = this.inverseWorldLocation;
      let inverseWorldRotation = this.inverseWorldRotation;
      let inverseWorldScale = this.inverseWorldScale;

      if (parent) {
        let computedLocation;
        let computedRotation;
        let computedScaling;

        let parentPivot = parent.pivot;

        computedLocation = locationHeap;

        computedLocation[0] = localLocation[0] + parentPivot[0];
        computedLocation[1] = localLocation[1] + parentPivot[1];
        computedLocation[2] = localLocation[2] + parentPivot[2];
        // vec3.add(computedLocation, localLocation, parentPivot);

        // If this node shouldn't inherit the parent's rotation, rotate it by the inverse.
        if (this.dontInheritRotation) {
          computedRotation = rotationHeap;

          quat.mul(computedRotation, localRotation, parent.inverseWorldRotation);
        } else {
          computedRotation = localRotation;
        }

        // If this node shouldn't inherit the parent's translation, translate it by the inverse.
        // if (this.dontInheritTranslation) {
        // mat4.translate(worldMatrix, worldMatrix, parent.inverseWorldLocation);
        // }

        if (this.dontInheritScaling) {
          computedScaling = scalingHeap;

          let parentInverseScale = parent.inverseWorldScale;
          computedScaling[0] = parentInverseScale[0] * localScale[0];
          computedScaling[1] = parentInverseScale[1] * localScale[1];
          computedScaling[2] = parentInverseScale[2] * localScale[2];
          // vec3.mul(computedScaling, parent.inverseWorldScale, localScale);

          worldScale[0] = localScale[0];
          worldScale[1] = localScale[1];
          worldScale[2] = localScale[2];
          // vec3.copy(worldScale, localScale);
        } else {
          computedScaling = localScale;

          let parentScale = parent.worldScale;
          worldScale[0] = parentScale[0] * localScale[0];
          worldScale[1] = parentScale[1] * localScale[1];
          worldScale[2] = parentScale[2] * localScale[2];
          // vec3.mul(worldScale, parentScale, localScale);
        }

        mat4.fromRotationTranslationScale(localMatrix, computedRotation, computedLocation, computedScaling);

        mat4.mul(worldMatrix, parent.worldMatrix, localMatrix);

        quat.mul(worldRotation, parent.worldRotation, computedRotation);
      } else {
        // Local matrix
        mat4.fromRotationTranslationScale(localMatrix, localRotation, localLocation, localScale);

        // World matrix
        worldMatrix[0] = localMatrix[0];
        worldMatrix[1] = localMatrix[1];
        worldMatrix[2] = localMatrix[2];
        worldMatrix[3] = localMatrix[3];
        worldMatrix[4] = localMatrix[4];
        worldMatrix[5] = localMatrix[5];
        worldMatrix[6] = localMatrix[6];
        worldMatrix[7] = localMatrix[7];
        worldMatrix[8] = localMatrix[8];
        worldMatrix[9] = localMatrix[9];
        worldMatrix[10] = localMatrix[10];
        worldMatrix[11] = localMatrix[11];
        worldMatrix[12] = localMatrix[12];
        worldMatrix[13] = localMatrix[13];
        worldMatrix[14] = localMatrix[14];
        worldMatrix[15] = localMatrix[15];
        // mat4.copy(worldMatrix, localMatrix);

        // World rotation
        worldRotation[0] = localRotation[0];
        worldRotation[1] = localRotation[1];
        worldRotation[2] = localRotation[2];
        worldRotation[3] = localRotation[3];
        // quat.copy(worldRotation, localRotation);

        // World scale
        worldScale[0] = localScale[0];
        worldScale[1] = localScale[1];
        worldScale[2] = localScale[2];
        // vec3.copy(worldScale, localScale);
      }

      // Inverse world rotation
      inverseWorldRotation[0] = -worldRotation[0];
      inverseWorldRotation[1] = -worldRotation[1];
      inverseWorldRotation[2] = -worldRotation[2];
      inverseWorldRotation[3] = worldRotation[3];
      // quat.conjugate(inverseWorldRotation, worldRotation);

      // Inverse world scale
      inverseWorldScale[0] = 1 / worldScale[0];
      inverseWorldScale[1] = 1 / worldScale[1];
      inverseWorldScale[2] = 1 / worldScale[2];
      // vec3.inverse(this.inverseWorldScale, worldScale);

      // World location
      worldLocation[0] = worldMatrix[12];
      worldLocation[1] = worldMatrix[13];
      worldLocation[2] = worldMatrix[14];

      // Inverse world location
      inverseWorldLocation[0] = -worldLocation[0];
      inverseWorldLocation[1] = -worldLocation[1];
      inverseWorldLocation[2] = -worldLocation[2];
      // vec3.negate(this.inverseWorldLocation, worldLocation);
    }
  }

  /**
   * Update this node, and continue down the node hierarchy.
   * 
   * Also updates the object part of this node, if there is any (e.g. model instances).
   */
  update(dt: number, scene: Scene) {
    if (this.dirty || (this.parent && this.parent.wasDirty)) {
      this.dirty = true; // In case this node isn't dirty, but the parent was.
      this.wasDirty = true;
      this.recalculateTransformation();
    } else {
      this.wasDirty = false;
    }

    this.updateObject(dt, scene);
    this.updateChildren(dt, scene);
  }

  /**
   * Update the object part of this node.
   * 
   * Used by model instances.
   */
  updateObject(dt: number, scene: Scene) {

  }

  /**
   * Update this node's children and continue the update hierarchy.
   */
  updateChildren(dt: number, scene: Scene) {
    let children = this.children;

    for (let i = 0, l = children.length; i < l; i++) {
      children[i].update(dt, scene);
    }
  }
}

/**
 * A skeletal node used for skeletons.
 * 
 * Expected to be created with createSharedNodes() below.
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
  dontInheritTranslation: boolean;
  dontInheritRotation: boolean;
  dontInheritScaling: boolean;
  parent: SkeletalNode | Node | null;
  children: Node[];
  wasDirty: boolean;
  /**
   * The object associated with this node, if there is any.
   */
  object: any;
  dirty: boolean;
  billboarded: boolean;
  billboardedX: boolean;
  billboardedY: boolean;
  billboardedZ: boolean;

  /**
   *
   */
  constructor(shared: Float32Array[]) {
    this.pivot = <vec3>shared[0];
    this.localLocation = <vec3>shared[1];
    this.localRotation = <quat>shared[2];
    this.localScale = <vec3>shared[3];
    this.worldLocation = <vec3>shared[4];
    this.worldRotation = <quat>shared[5];
    this.worldScale = <vec3>shared[6];
    this.inverseWorldLocation = <vec3>shared[7];
    this.inverseWorldRotation = <quat>shared[8];
    this.inverseWorldScale = <vec3>shared[9];
    this.localMatrix = <mat4>shared[10];
    this.worldMatrix = <mat4>shared[11];
    this.dontInheritTranslation = false;
    this.dontInheritRotation = false;
    this.dontInheritScaling = false;
    this.parent = null;
    this.children = [];
    this.wasDirty = false;
    this.object = null;

    this.localRotation[3] = 1;

    this.localScale.fill(1);

    this.localMatrix[0] = 1;
    this.localMatrix[5] = 1;
    this.localMatrix[10] = 1;
    this.localMatrix[15] = 1;

    this.dirty = true;

    this.billboarded = false;
    this.billboardedX = false;
    this.billboardedY = false;
    this.billboardedZ = false;
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
   * Update this skeletal node's children.
   * 
   * Note that this does not update other skeletal nodes!
   */
  updateChildren(dt: number, scene: Scene) {
    let children = this.children;

    for (let i = 0, l = children.length; i < l; i++) {
      children[i].update(dt, scene);
    }
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

  // Allow to also create inherited nodes.
  Node = Node || SkeletalNode;

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

    nodes[i] = new Node([
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
    ]);
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
