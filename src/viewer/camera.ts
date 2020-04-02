import { vec3, vec4, quat, mat4 } from 'gl-matrix';
import { VEC3_UNIT_Y, VEC3_UNIT_X, VEC3_UNIT_Z, unproject, unpackPlanes, quatLookAt } from '../common/gl-matrix-addon';

const vectorHeap = vec3.create();
const vectorHeap2 = vec3.create();
const vectorHeap3 = vec3.create();
const quatHeap = quat.create();
const facingCorrection = quat.setAxisAngle(quat.create(), VEC3_UNIT_X, Math.PI / 2);

/**
 * A camera.
 */
export default class Camera {
  /**
   * The rendered viewport.
   */
  viewport: vec4 = vec4.create();
  isPerspective: boolean = true;
  fov: number = 0;
  aspect: number = 0;
  isOrtho: boolean = false;
  leftClipPlane: number = 0;
  rightClipPlane: number = 0;
  bottomClipPlane: number = 0;
  topClipPlane: number = 0;
  nearClipPlane: number = 0;
  farClipPlane: number = 0;
  location: vec3 = vec3.create();
  rotation: quat = quat.create();
  inverseRotation: quat = quat.create();
  /**
   * World -> View.
   */
  viewMatrix: mat4 = mat4.create();
  /**
   * View -> Clip.
   */
  projectionMatrix: mat4 = mat4.create();
  /**
   * World -> Clip.
   */
  viewProjectionMatrix: mat4 = mat4.create();
  /**
   * View -> World.
   */
  inverseViewMatrix: mat4 = mat4.create();
  /**
   * Clip -> World.
   */
  inverseViewProjectionMatrix: mat4 = mat4.create();
  /**
   * The X axis in camera space.
   */
  directionX: vec3 = vec3.create();
  /**
   * The Y axis in camera space.
   */
  directionY: vec3 = vec3.create();
  /**
   * The Z axis in camera space.
   */
  directionZ: vec3 = vec3.create();
  /**
   * The four corners of a 2x2 rectangle.
   */
  vectors: vec3[] = [vec3.fromValues(-1, -1, 0), vec3.fromValues(-1, 1, 0), vec3.fromValues(1, 1, 0), vec3.fromValues(1, -1, 0)];
  /**
   * Same as vectors, however these are all billboarded to the camera.
   */
  billboardedVectors: vec3[] = [vec3.create(), vec3.create(), vec3.create(), vec3.create()];
  /**
   * The camera frustum planes in this order: left, right, top, bottom, near, far.
   */
  planes: vec4[] = [vec4.create(), vec4.create(), vec4.create(), vec4.create(), vec4.create(), vec4.create()];
  dirty: boolean = true;

  /**
   * Set the camera to perspective projection mode.
   */
  perspective(fov: number, aspect: number, near: number, far: number) {
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
   */
  ortho(left: number, right: number, bottom: number, top: number, near: number, far: number) {
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
   */
  setViewport(x: number, y: number, width: number, height: number) {
    let viewport = this.viewport;

    viewport[0] = x;
    viewport[1] = y;
    viewport[2] = width;
    viewport[3] = height;

    this.aspect = width / height;

    this.dirty = true;
  }

  /**
   * Set the camera location in world coordinates.
   */
  setLocation(location: vec3) {
    vec3.copy(this.location, location);

    this.dirty = true;
  }

  /**
   * Move the camera by the given offset in world coordinates.
   */
  move(offset: vec3) {
    vec3.add(this.location, this.location, offset);

    this.dirty = true;
  }

  /**
   * Set the camera rotation.
   */
  setRotation(rotation: quat) {
    quat.copy(this.rotation, rotation);

    this.dirty = true;
  }

  /**
   * Rotate the camera by the given rotation.
   */
  rotate(rotation: quat) {
    quat.mul(this.rotation, this.rotation, rotation);

    this.dirty = true;
  }

  /**
   * Look at `to`.
   */
  face(to: vec3, worldUp: vec3) {
    quat.mul(this.rotation, facingCorrection, quatLookAt(quatHeap, to, this.location, worldUp));

    this.dirty = true;
  }

  /**
   * Move to `from` and look at `to`.
   */
  moveToAndFace(from: vec3, to: vec3, worldUp: vec3) {
    vec3.copy(this.location, from);
    this.face(to, worldUp);
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
      let location = this.location;
      let rotation = this.rotation;
      let inverseRotation = this.inverseRotation;
      let viewMatrix = this.viewMatrix;
      let projectionMatrix = this.projectionMatrix;
      let viewProjectionMatrix = this.viewProjectionMatrix;
      let vectors = this.vectors;
      let billboardedVectors = this.billboardedVectors;

      // View -> Clip.
      if (this.isPerspective) {
        mat4.perspective(projectionMatrix, this.fov, this.aspect, this.nearClipPlane, this.farClipPlane);
      } else {
        mat4.ortho(projectionMatrix, this.leftClipPlane, this.rightClipPlane, this.bottomClipPlane, this.topClipPlane, this.nearClipPlane, this.farClipPlane);
      }

      // World -> View.
      mat4.fromQuat(viewMatrix, rotation);
      mat4.translate(viewMatrix, viewMatrix, vec3.negate(vectorHeap, location));

      // World -> Clip.
      mat4.mul(viewProjectionMatrix, projectionMatrix, viewMatrix);

      // View -> World.
      mat4.invert(this.inverseViewMatrix, viewMatrix);

      // Clip -> World.
      mat4.invert(this.inverseViewProjectionMatrix, viewProjectionMatrix);

      // Recaculate the camera's frusum planes
      unpackPlanes(this.planes, viewProjectionMatrix);

      quat.conjugate(inverseRotation, rotation);

      // View-space axes.
      vec3.transformQuat(this.directionX, VEC3_UNIT_X, inverseRotation);
      vec3.transformQuat(this.directionY, VEC3_UNIT_Y, inverseRotation);
      vec3.transformQuat(this.directionZ, VEC3_UNIT_Z, inverseRotation);

      // View-space rectangle, aka billboarded.
      for (let i = 0; i < 4; i++) {
        vec3.transformQuat(billboardedVectors[i], vectors[i], inverseRotation);
      }

      this.dirty = false;
    }
  }

  /**
   * Given a vector in camera space, return the vector transformed to world space.
   */
  cameraToWorld(out: vec3, v: vec3) {
    return vec3.transformMat4(out, v, this.inverseViewMatrix);
  }

  /**
   * Given a vector in world space, return the vector transformed to camera space.
   */
  worldToCamera(out: vec3, v: vec3) {
    return vec3.transformMat4(out, v, this.viewMatrix);
  }

  /**
   * Given a vector in world space, return the vector transformed to screen space.
   */
  worldToScreen(out: Float32Array, v: Float32Array) {
    let viewport = this.viewport;

    vec3.transformMat4(vectorHeap, <vec3>v, this.viewProjectionMatrix);

    out[0] = Math.round(((vectorHeap[0] + 1) / 2) * viewport[2]);
    out[1] = Math.round(((vectorHeap[1] + 1) / 2) * viewport[3]);

    return out;
  }

  /**
   * Given a vector in screen space, return a ray from the near plane to the far plane.
   */
  screenToWorldRay(out: Float32Array, v: Float32Array) {
    let a = vectorHeap;
    let b = vectorHeap2;
    let c = vectorHeap3;
    let x = v[0];
    let y = v[1];
    let inverseViewProjectionMatrix = this.inverseViewProjectionMatrix;
    let viewport = this.viewport;

    // Intersection on the near-plane
    unproject(a, vec3.set(c, x, y, 0), inverseViewProjectionMatrix, viewport);

    // Intersection on the far-plane
    unproject(b, vec3.set(c, x, y, 1), inverseViewProjectionMatrix, viewport);

    out.set(a, 0);
    out.set(b, 3);

    return out;
  }
}
