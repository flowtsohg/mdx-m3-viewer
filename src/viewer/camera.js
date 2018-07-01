import {vec3, vec4, quat, mat4} from 'gl-matrix';
import {unproject, distanceToPlane, unpackPlanes} from '../common/gl-matrix-addon';
import {SceneNode} from './node';

let vectorHeap = vec3.create();
let vectorHeap2 = vec3.create();
let vectorHeap3 = vec3.create();

/**
 * A camera.
 */
export default class Camera extends SceneNode {
  /**
   *
   */
  constructor() {
    super();
    this.perspective = true;
    this.ortho = false;
    this.fieldOfView = 0;
    this.aspectRatio = 0;
    this.nearClipPlane = 0;
    this.farClipPlane = 0;
    this.leftClipPlane = 0;
    this.rightClipPlane = 0;
    this.bottomClipPlane = 0;
    this.topClipPlane = 0;
    this.viewport = vec4.create();
    this.projectionMatrix = mat4.create();
    this.worldProjectionMatrix = mat4.create();
    this.inverseWorldMatrix = mat4.create();
    this.inverseRotation = quat.create();
    this.inverseRotationMatrix = mat4.create();
    this.inverseWorldProjectionMatrix = mat4.create();

    // First four vectors are the corners of a 2x2 rectangle, the last three vectors are the unit axes
    this.vectors = [vec3.fromValues(-1, -1, 0), vec3.fromValues(-1, 1, 0), vec3.fromValues(1, 1, 0), vec3.fromValues(1, -1, 0), vec3.fromValues(1, 0, 0), vec3.fromValues(0, 1, 0), vec3.fromValues(0, 0, 1)];

    // First four vectors are the corners of a 2x2 rectangle billboarded to the camera, the last three vectors are the unit axes billboarded
    this.billboardedVectors = [vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create()];

    // Left, right, top, bottom, near, far
    this.planes = [vec4.create(), vec4.create(), vec4.create(), vec4.create(), vec4.create(), vec4.create()];
  }

  /**
   * Set the parent of the camera.
   * Note that this does not add the camera as a child to the parent.
   * The camera is updated from the scene, rather than it's parent.
   *
   * @param {SceneNode|SkeletalNode|EventNode} parent
   */
  setParent(parent) {
    this.parent = parent;
  }

  /**
   * Set the camera to perspective projection mode.
   *
   * @param {number} fieldOfView
   * @param {number} aspectRatio
   * @param {number} nearClipPlane
   * @param {number} farClipPlane
   */
  setPerspective(fieldOfView, aspectRatio, nearClipPlane, farClipPlane) {
    this.perspective = true;
    this.ortho = false;
    this.fieldOfView = fieldOfView;
    this.aspectRatio = aspectRatio;
    this.nearClipPlane = nearClipPlane;
    this.farClipPlane = farClipPlane;

    this.dirty = true;
  }

  /**
   * Set the camera to orthogonal projection mode.
   *
   * @param {number} left
   * @param {number} right
   * @param {number} bottom
   * @param {number} top
   * @param {number} near
   * @param {number} far
   */
  setOrtho(left, right, bottom, top, near, far) {
    this.perspective = false;
    this.ortho = true;
    this.leftClipPlane = left;
    this.rightClipPlane = right;
    this.bottomClipPlane = bottom;
    this.topClipPlane = top;
    this.nearClipPlane = near;
    this.farClipPlane = far;

    this.dirty = true;
  }

  /**
   * Set the camera's viewport.
   *
   * @param {vec4} viewport
   */
  setViewport(viewport) {
    vec4.copy(this.viewport, viewport);

    this.aspectRatio = viewport[2] / viewport[3];

    this.dirty = true;
  }

  /**
   * Recalculate the camera's transformation.
   */
  recalculateTransformation() {
    super.recalculateTransformation();

    let worldMatrix = this.worldMatrix;
    let projectionMatrix = this.projectionMatrix;
    let worldProjectionMatrix = this.worldProjectionMatrix;
    let inverseWorldRotation = this.inverseWorldRotation;
    let vectors = this.vectors;
    let billboardedVectors = this.billboardedVectors;

    // Projection matrix
    // Camera space -> NDC space
    if (this.perspective) {
      mat4.perspective(projectionMatrix, this.fieldOfView, this.aspectRatio, this.nearClipPlane, this.farClipPlane);
    } else {
      mat4.ortho(projectionMatrix, this.leftClipPlane, this.rightClipPlane, this.bottomClipPlane, this.topClipPlane, this.nearClipPlane, this.farClipPlane);
    }

    // World projection matrix
    // World space -> NDC space
    mat4.mul(worldProjectionMatrix, projectionMatrix, worldMatrix);

    // Inverse world matrix
    // Camera space -> World space
    mat4.invert(this.inverseWorldMatrix, worldMatrix);

    // Inverse world projection matrix
    // NDC space -> World space
    mat4.invert(this.inverseWorldProjectionMatrix, worldProjectionMatrix);

    // Cache the billboarded vectors
    for (let i = 0; i < 7; i++) {
      vec3.transformQuat(billboardedVectors[i], vectors[i], inverseWorldRotation);
    }

    // Recaculate the camera's frusum planes
    unpackPlanes(this.planes, worldProjectionMatrix);
  }

  /**
   * Test it a sphere with the given center and radius intersects this frustum.
   *
   * @param {vec3} center
   * @param {number} radius
   * @return {boolean}
   */
  testSphere(center, radius) {
    for (let plane of this.planes) {
      if (distanceToPlane(plane, center) <= -radius) {
        return false;
      }
    }

    return true;
  }

  /**
   * Given a vector in camera space, return the vector transformed to world space.
   *
   * @param {vec3} out
   * @param {vec3} v
   * @return {vec3}
   */
  cameraToWorld(out, v) {
    return vec3.transformMat4(out, v, this.inverseWorldMatrix);
  }

  /**
   * Given a vector in world space, return the vector transformed to camera space.
   *
   * @param {vec3} out
   * @param {vec3} v
   * @return {vec3}
   */
  worldToCamera(out, v) {
    // return vec3.transformQuat(out, v, this.inverseWorldRotation);
    return vec3.transformMat4(out, v, this.worldMatrix);
  }

  /**
   * Given a vector in world space, return the vector transformed to screen space.
   *
   * @param {vec2} out
   * @param {vec3} v
   * @return {vec2}
   */
  worldToScreen(out, v) {
    let viewport = this.viewport;

    vec3.transformMat4(vectorHeap, v, this.worldProjectionMatrix);

    out[0] = Math.round(((vectorHeap[0] + 1) / 2) * viewport[2]);
    out[1] = Math.round(((vectorHeap[1] + 1) / 2) * viewport[3]);

    return out;
  }

  /**
   * Given a vector in screen space, return the vector transformed to world space, projected on the X-Z plane.
   *
   * @param {vec3} out
   * @param {vec2} v
   * @return {vec3}
   */
  screenToWorld(out, v) {
    let a = vectorHeap;
    let b = vectorHeap2;
    let c = vectorHeap3;
    let x = v[0];
    let y = v[1];
    let inverseWorldProjectionMatrix = this.inverseWorldProjectionMatrix;
    let viewport = this.viewport;

    // Intersection on the near-plane
    unproject(a, vec3.set(c, x, y, 0), inverseWorldProjectionMatrix, viewport);

    // Intersection on the far-plane
    unproject(b, vec3.set(c, x, y, 1), inverseWorldProjectionMatrix, viewport);

    // Intersection on the X-Y plane
    let zIntersection = -a[2] / (b[2] - a[2]);

    vec3.set(out, a[0] + (b[0] - a[0]) * zIntersection, 0, a[1] + (b[1] - a[1]) * zIntersection);

    // console.log(out, a, b, zIntersection)
    return out;
  }
}
