import EventEmitter from 'events';
import {vec3, quat, mat4} from 'gl-matrix';
import {VEC3_ZERO, VEC3_ONE, QUAT_DEFAULT} from '../common/gl-matrix-addon';

// Heap allocations needed for this module.
let locationHeap = vec3.create();
let rotationHeap = quat.create();
let scalingHeap = vec3.create();

/**
 * A node mixin.
 * Used by SceneNode and EventNode.
 *
 * @param {class} superclass
 * @return {class}
 */
let nodeMixin = (superclass) => class extends superclass {
  /**
   *
   */
  constructor() {
    super();

    /** @member {vec3} */
    this.pivot = vec3.create();
    /** @member {vec3} */
    this.localLocation = vec3.create();
    /** @member {quat} */
    this.localRotation = quat.create();
    /** @member {vec3} */
    this.localScale = vec3.fromValues(1, 1, 1);
    /** @member {vec3} */
    this.worldLocation = vec3.create();
    /** @member {quat} */
    this.worldRotation = quat.create();
    /** @member {vec3} */
    this.worldScale = vec3.create();
    /** @member {vec3} */
    this.inverseWorldLocation = vec3.create();
    /** @member {vec4} */
    this.inverseWorldRotation = quat.create();
    /** @member {vec3} */
    this.inverseWorldScale = vec3.create();
    /** @member {mat4} */
    this.localMatrix = mat4.create();
    /** @member {mat4} */
    this.worldMatrix = mat4.create();
    /** @member {?SceneNode} */
    this.parent = null;
    /** @member {Array<SceneNode>} */
    this.children = [];
    /** @member {boolean} */
    this.dontInheritTranslation = false;
    /** @member {boolean} */
    this.dontInheritRotation = false;
    /** @member {boolean} */
    this.dontInheritScaling = true;

    this.visible = true;
    this.wasDirty = false;
    this.dirty = true;
  }

  /**
   * Sets the node's pivot.
   *
   * @param {vec3} pivot The new pivot.
   * @return {this}
   */
  setPivot(pivot) {
    vec3.copy(this.pivot, pivot);

    this.dirty = true;

    return this;
  }

  /**
   * Sets the node's local location.
   *
   * @param {vec3} location The new location.
   * @return {this}
   */
  setLocation(location) {
    vec3.copy(this.localLocation, location);

    this.dirty = true;

    return this;
  }

  /**
   * Sets the node's local rotation.
   *
   * @param {quat} rotation The new rotation.
   * @return {this}
   */
  setRotation(rotation) {
    quat.copy(this.localRotation, rotation);

    this.dirty = true;

    return this;
  }

  /**
   * Sets the node's local scale.
   *
   * @param {vec3} varying The new scale.
   * @return {this}
   */
  setScale(varying) {
    vec3.copy(this.localScale, varying);

    this.dirty = true;

    return this;
  }

  /**
   * Sets the node's local scale uniformly.
   *
   * @param {number} uniform The new scale.
   * @return {this}
   */
  setUniformScale(uniform) {
    vec3.set(this.localScale, uniform, uniform, uniform);

    this.dirty = true;

    return this;
  }

  /**
   * Sets the node's local location, rotation, and scale.
   *
   * @param {vec3} location The new location.
   * @param {quat} rotation The new rotation.
   * @param {vec3} scale The new scale.
   * @return {this}
   */
  setTransformation(location, rotation, scale) {
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
   *
   * @return {this}
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
   *
   * @param {vec3} offset The offset.
   * @return {this}
   */
  movePivot(offset) {
    vec3.add(this.pivot, this.pivot, offset);

    this.dirty = true;

    return this;
  }

  /**
   * Moves the node's local location.
   *
   * @param {vec3} offset The offset.
   * @return {this}
   */
  move(offset) {
    vec3.add(this.localLocation, this.localLocation, offset);

    this.dirty = true;

    return this;
  }

  /**
   * Rotates the node's local rotation in world space.
   *
   * @param {vec3} rotation The rotation.
   * @return {this}
   */
  rotate(rotation) {
    quat.mul(this.localRotation, this.localRotation, rotation);

    this.dirty = true;

    return this;
  }

  /**
   * Rotates the node's local rotation in local space.
   *
   * @param {vec3} rotation The rotation.
   * @return {this}
   */
  rotateLocal(rotation) {
    quat.mul(this.localRotation, rotation, this.localRotation);

    this.dirty = true;

    return this;
  }

  /**
   * Scales the node.
   *
   * @param {vec3} scale The scale.
   * @return {this}
   */
  scale(scale) {
    vec3.mul(this.localScale, this.localScale, scale);

    this.dirty = true;

    return this;
  }

  /**
   * Scales the node uniformly.
   *
   * @param {number} scale The scale.
   * @return {this}
   */
  uniformScale(scale) {
    vec3.scale(this.localScale, this.localScale, scale);

    this.dirty = true;

    return this;
  }
  /*
  orthoNormalize(vectors) {
      for (let i = 0; i < vectors.length; i++) {
          let accum = vec3.create(),
              p = vec3.create();

          for (let j = 0; j < i; j++) {
              vec3.add(accum, accum, this.project(p, vectors[i], vectors[j]));
          }

          vec3.sub(vectors[i], vectors[i], accum);
          vec3.normalize(vectors[i], vectors[i]);
      }
  }

  project(out, u, v) {
      let d = vec3.dot(u, v),
          d_div = d / vec3.sqrLen(u);

      return vec3.scale(out, v, d_div);
  }

  lookAt(target, upDirection) {
      let lookAt = vec3.create();

      vec3.sub(lookAt, target, this.worldLocation);

      let forward = vec3.clone(lookAt);
      let up = vec3.clone(upDirection);

      this.orthoNormalize([forward, up]);

      let right = vec3.create();
      vec3.cross(right, forward, up);

      // vec3.normalize(forward, forward);
      // vec3.normalize(up, up);
      // vec3.normalize(right, right);

      quat.setAxes(this.localRotation, forward, right, up);
      quat.conjugate(this.localRotation, this.localRotation);

      this.recalculateTransformation();

      return this;
  }
  //* /
  /*
  lookAt(target) {
      let v1 = target,
          v2 = this.worldLocation;

      let angle = Math.atan2(v2[2], v2[0]) - Math.atan2(v1[2], v1[0]);

      //console.log(Math.toDeg(angle))
  },
  */

  /**
   * Sets the node's parent.
   *
   * @param {Node=} parent The parent. NOTE: don't set parent to null manually, instead use setParent().
   * @return {this}
   */
  setParent(parent) {
    // If the node already had a parent, detach from it first.
    if (this.parent) {
      let children = this.parent.children;
      let index = children.indexOf(this);

      if (index !== -1) {
        children.splice(index, 1);
      }
    }

    this.parent = parent;

    // If the new parent is na actual thing, add this node as a child.
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
        let computedScaling;

        let parentPivot = parent.pivot;

        computedLocation = locationHeap;

        computedLocation[0] = localLocation[0] + parentPivot[0];
        computedLocation[1] = localLocation[1] + parentPivot[1];
        computedLocation[2] = localLocation[2] + parentPivot[2];
        // vec3.add(computedLocation, localLocation, parentPivot);

        // If this node shouldn't inherit the parent's rotation, rotate it by the inverse.
        // if (this.dontInheritRotation) {
        // mat4.rotateQ(worldMatrix, worldMatrix, parent.inverseWorldRotation);
        // }

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

        mat4.fromRotationTranslationScale(localMatrix, localRotation, computedLocation, computedScaling);

        mat4.mul(worldMatrix, parent.worldMatrix, localMatrix);

        quat.mul(worldRotation, parent.worldRotation, localRotation);
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
   * Update this node.
   * Also updates the object part of this node, if there is any (e.g. model instances).
   * Continues the update hierarchy.
   *
   * @param {Scene} scene
   */
  update(scene) {
    if (this.dirty || (this.parent && this.parent.wasDirty)) {
      this.dirty = true; // In case this node isn't dirty, but the parent was.
      this.wasDirty = true;
      this.recalculateTransformation();
    } else {
      this.wasDirty = false;
    }

    this.updateObject(scene);

    this.updateChildren(scene);
  }

  /**
   * Update the object part of this node.
   * Used by model instances.
   *
   * @param {Scene} scene
   */
  updateObject(scene) {

  }

  /**
   * Update this node's children and continue the update hierarchy.
   *
   * @param {Scene} scene
   */
  updateChildren(scene) {
    let children = this.children;

    for (let i = 0, l = children.length; i < l; i++) {
      children[i].update(scene);
    }
  }
};

/**
 * A scene node that can be moved, rotated, scaled, parented, etc.
 */
export class SceneNode extends nodeMixin(Object) {}

/**
 * A scene node that is also an event dispatcher.
 */
export class EventNode extends nodeMixin(EventEmitter) {}

/**
 * A skeletal node used for skeletons.
 * Expected to be created with createSharedNodes() below.
 */
export class SkeletalNode {
  /**
   * @param {Array<Float32Array>} shared
   */
  constructor(shared) {
    /** @member {vec3} */
    this.pivot = shared[0];
    /** @member {vec3} */
    this.localLocation = shared[1];
    /** @member {quat} */
    this.localRotation = shared[2];
    /** @member {vec3} */
    this.localScale = shared[3];
    /** @member {vec3} */
    this.worldLocation = shared[4];
    /** @member {quat} */
    this.worldRotation = shared[5];
    /** @member {vec3} */
    this.worldScale = shared[6];
    /** @member {vec3} */
    this.inverseWorldLocation = shared[7];
    /** @member {vec4} */
    this.inverseWorldRotation = shared[8];
    /** @member {vec3} */
    this.inverseWorldScale = shared[9];
    /** @member {mat4} */
    this.localMatrix = shared[10];
    /** @member {mat4} */
    this.worldMatrix = shared[11];
    /** @member {boolean} */
    this.dontInheritTranslation = false;
    /** @member {boolean} */
    this.dontInheritRotation = false;
    /** @member {boolean} */
    this.dontInheritScaling = false;
    /** @member {Array<SceneNode>} */
    this.children = [];

    this.visible = true;
    this.wasDirty = false;

    /**
     * The object associated with this node, if there is any.
     *
     * @member {?}
     */
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
   *
   * @param {Scene} scene
   */
  recalculateTransformation(scene) {
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
    let parent = this.parent;
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
   * Note that this does not update other skeletal nodes!
   * It may be called by skeletal nodes to continue the update hierarchy.
   *
   * @param {Scene} scene
   */
  updateChildren(scene) {
    let children = this.children;

    for (let i = 0, l = children.length; i < l; i++) {
      children[i].update(scene);
    }
  }

  /**
   * Allows inherited node classes to run extra transformations when billboarding.
   * This is needed because the different model formats are in different vector spaces.
   *
   * @param {quat} rotation
   */
  convertBasis(rotation) {

  }
}

const NODE_SHARED_SIZE = 65;

/**
 * Creates an array of skeletal nodes with shared memory.
 * The returned object contains the node array itself, the backing buffer, and all of the different shared arrays.
 *
 * @param {number} count
 * @param {function(new:SkeletalNode)=} Node
 * @return {Object}
 */
export function createSkeletalNodes(count, Node) {
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
