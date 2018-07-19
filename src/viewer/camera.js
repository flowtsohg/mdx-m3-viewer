import {vec3, vec4, quat, mat4} from 'gl-matrix';
import {unproject, distanceToPlane, unpackPlanes, VEC3_UNIT_Y, VEC3_UNIT_X, VEC3_UNIT_Z} from '../common/gl-matrix-addon';

let vectorHeap = vec3.create();
let vectorHeap2 = vec3.create();
let vectorHeap3 = vec3.create();
let quatHeap = quat.create();
let matHeap = mat4.create();

/**
 * A camera.
 */
export default class Camera {
  /**
   *
   */
  constructor() {
    // Rendered viewport.
    this.rect = vec4.create();

    // Perspective values.
    this.isPerspective = true;
    this.fov = 0;
    this.aspect = 0;

    // Orthogonal values.
    this.isOrtho = false;
    this.leftClipPlane = 0;
    this.rightClipPlane = 0;
    this.bottomClipPlane = 0;
    this.topClipPlane = 0;

    // Shared values.
    this.nearClipPlane = 0;
    this.farClipPlane = 0;

    // World values.
    this.location = vec3.create();
    this.rotation = quat.create();

    // Derived values.
    this.inverseRotation = quat.create();
    this.worldMatrix = mat4.create();
    this.projectionMatrix = mat4.create();
    this.worldProjectionMatrix = mat4.create();
    this.inverseWorldMatrix = mat4.create();
    this.inverseRotationMatrix = mat4.create();
    this.inverseWorldProjectionMatrix = mat4.create();
    this.directionX = vec3.create();
    this.directionY = vec3.create();
    this.directionZ = vec3.create();

    // First four vectors are the corners of a 2x2 rectangle, the last three vectors are the unit axes
    this.vectors = [vec3.fromValues(-1, -1, 0), vec3.fromValues(-1, 1, 0), vec3.fromValues(1, 1, 0), vec3.fromValues(1, -1, 0), vec3.fromValues(1, 0, 0), vec3.fromValues(0, 1, 0), vec3.fromValues(0, 0, 1)];

    // First four vectors are the corners of a 2x2 rectangle billboarded to the camera, the last three vectors are the unit axes billboarded
    this.billboardedVectors = [vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create()];

    // Left, right, top, bottom, near, far
    this.planes = [vec4.create(), vec4.create(), vec4.create(), vec4.create(), vec4.create(), vec4.create()];

    this.dirty = true;
  }

  /**
   * Set the camera to perspective projection mode.
   *
   * @param {number} fov
   * @param {number} aspect
   * @param {number} near
   * @param {number} far
   */
  perspective(fov, aspect, near, far) {
    this.isPerspective = true;
    this.isOrtho = false;
    this.fov = fov;
    this.aspect = aspect;
    this.nearClipPlane = near;
    this.farClipPlane = far;

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
  ortho(left, right, bottom, top, near, far) {
    this.isPerspective = false;
    this.isOrtho = true;
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
  viewport(viewport) {
    vec4.copy(this.rect, viewport);

    this.aspect = viewport[2] / viewport[3];

    this.dirty = true;
  }

  /**
   * Set the camera location in world coordinates.
   *
   * @param {vec3} location
   */
  setLocation(location) {
    vec3.copy(this.location, location);

    this.dirty = true;
  }

  /**
   * Move the camera by the given offset in world coordinates.
   *
   * @param {vec3} offset
   */
  move(offset) {
    vec3.add(this.location, this.location, offset);

    this.dirty = true;
  }

  /**
   * Set the camera rotation.
   *
   * @param {quat} rotation
   */
  setRotation(rotation) {
    quat.copy(this.rotation, rotation);

    this.dirty = true;
  }

  /**
   * Rotate the camera by the given rotation.
   *
   * @param {quat} rotation
   */
  rotate(rotation) {
    quat.mul(this.rotation, this.rotation, rotation);

    this.dirty = true;
  }

  /**
   * Set the camera rotation to the given horizontal and vertical angles.
   *
   * @param {number} horizontalAngle
   * @param {number} verticalAngle
   */
  setRotationAngles(horizontalAngle, verticalAngle) {
    quat.identity(this.rotation);

    this.rotateAngles(horizontalAngle, verticalAngle);
  }

  /**
   * Rotate around the given point.
   * Changes both the camera location and rotation.
   *
   * @param {quat} rotation
   * @param {vec3} point
   */
  rotateAround(rotation, point) {
    this.rotate(rotation);

    quat.conjugate(quatHeap, quatHeap);
    vec3.sub(vectorHeap, this.location, point);
    vec3.transformQuat(vectorHeap, vectorHeap, rotation);
    vec3.add(this.location, vectorHeap, point);
  }

  /**
   * Rotate around the given point.
   * Changes both the camera location and rotation.
   *
   * @param {quat} rotation
   * @param {vec3} point
   */
  setRotationAround(rotation, point) {
    this.setRotation(rotation);

    let length = vec3.len(vec3.sub(vectorHeap, this.location, point));

    quat.conjugate(quatHeap, quatHeap);
    vec3.copy(vectorHeap, VEC3_UNIT_Z);
    vec3.transformQuat(vectorHeap, vectorHeap, quatHeap);
    vec3.scale(vectorHeap, vectorHeap, length);
    vec3.add(this.location, vectorHeap, point);
  }

  /**
   * Set the rotation around the given point.
   * Changes both the camera location and rotation.
   *
   * @param {number} horizontalAngle
   * @param {number} verticalAngle
   * @param {vec3} point
   */
  setRotationAroundAngles(horizontalAngle, verticalAngle, point) {
    quat.identity(quatHeap);
    quat.rotateX(quatHeap, quatHeap, verticalAngle);
    quat.rotateZ(quatHeap, quatHeap, horizontalAngle);

    this.setRotationAround(quatHeap, point);
  }

  /**
   * Face the given point. Changes only the camera's orientation.
   *
   * @param {vec3} point
   * @param {vec3} worldUp
   */
  face(point, worldUp) {
    mat4.lookAt(matHeap, this.location, point, worldUp);
    mat4.getRotation(this.rotation, matHeap);

    this.dirty = true;
  }

  /**
   * Move to the given location, and look at the given target.
   *
   * @param {vec3} location
   * @param {vec3} target
   * @param {vec3} worldUp
   */
  moveToAndFace(location, target, worldUp) {
    vec3.copy(this.location, location);
    this.face(target, worldUp);
  }

  /**
   * Reset the location and angles.
   */
  reset() {
    vec3.set(this.location, 0, 0, 0);
    quat.identity(this.rotation);

    this.dirty = true;
  }

  /**
   * Recalculate the camera's transformation.
   */
  update() {
    if (this.dirty) {
      this.dirty = false;

      let location = this.location;
      let rotation = this.rotation;
      let inverseRotation = this.inverseRotation;
      let worldMatrix = this.worldMatrix;
      let projectionMatrix = this.projectionMatrix;
      let worldProjectionMatrix = this.worldProjectionMatrix;
      let vectors = this.vectors;
      let billboardedVectors = this.billboardedVectors;

      // Projection matrix
      // Camera space -> NDC space
      if (this.isPerspective) {
        mat4.perspective(projectionMatrix, this.fov, this.aspect, this.nearClipPlane, this.farClipPlane);
      } else {
        mat4.ortho(projectionMatrix, this.leftClipPlane, this.rightClipPlane, this.bottomClipPlane, this.topClipPlane, this.nearClipPlane, this.farClipPlane);
      }

      mat4.fromQuat(worldMatrix, rotation);
      mat4.translate(worldMatrix, worldMatrix, vec3.negate(vectorHeap, location));

      quat.conjugate(inverseRotation, rotation);

      // World projection matrix
      // World space -> NDC space
      mat4.mul(worldProjectionMatrix, projectionMatrix, worldMatrix);

      // Recaculate the camera's frusum planes
      unpackPlanes(this.planes, worldProjectionMatrix);

      // Inverse world matrix
      // Camera space -> World space
      mat4.invert(this.inverseWorldMatrix, worldMatrix);

      vec3.transformQuat(this.directionX, VEC3_UNIT_X, inverseRotation);
      vec3.transformQuat(this.directionY, VEC3_UNIT_Y, inverseRotation);
      vec3.transformQuat(this.directionZ, VEC3_UNIT_Z, inverseRotation);

      // Inverse world projection matrix
      // NDC space -> World space
      mat4.invert(this.inverseWorldProjectionMatrix, worldProjectionMatrix);

      // Cache the billboarded vectors
      for (let i = 0; i < 7; i++) {
        vec3.transformQuat(billboardedVectors[i], vectors[i], inverseRotation);
      }
    }
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
    let viewport = this.rect;

    vec3.transformMat4(vectorHeap, v, this.worldProjectionMatrix);

    out[0] = Math.round(((vectorHeap[0] + 1) / 2) * viewport[2]);
    out[1] = Math.round(((vectorHeap[1] + 1) / 2) * viewport[3]);

    return out;
  }

  /**
   * Given a vector in screen space, return a ray from the near plane to the far plane.
   *
   * @param {Float32Array} out
   * @param {vec2} v
   * @return {Float32Array}
   */
  screenToWorldRay(out, v) {
    let a = vectorHeap;
    let b = vectorHeap2;
    let c = vectorHeap3;
    let x = v[0];
    let y = v[1];
    let inverseWorldProjectionMatrix = this.inverseWorldProjectionMatrix;
    let viewport = this.rect;

    // Intersection on the near-plane
    unproject(a, vec3.set(c, x, y, 0), inverseWorldProjectionMatrix, viewport);

    // Intersection on the far-plane
    unproject(b, vec3.set(c, x, y, 1), inverseWorldProjectionMatrix, viewport);

    out.set(a, 0);
    out.set(b, 3);

    return out;
  }
}
