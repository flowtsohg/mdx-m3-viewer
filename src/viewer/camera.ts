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
  isPerspective = true;
  fov = 0;
  aspect = 0;
  isOrtho = false;
  leftClipPlane = 0;
  rightClipPlane = 0;
  bottomClipPlane = 0;
  topClipPlane = 0;
  nearClipPlane = 0;
  farClipPlane = 0;
  location = vec3.create();
  rotation = quat.create();
  inverseRotation = quat.create();
  /**
   * World -> View.
   */
  viewMatrix = mat4.create();
  /**
   * View -> Clip.
   */
  projectionMatrix = mat4.create();
  /**
   * World -> Clip.
   */
  viewProjectionMatrix = mat4.create();
  /**
   * View -> World.
   */
  inverseViewMatrix = mat4.create();
  /**
   * Clip -> World.
   */
  inverseViewProjectionMatrix = mat4.create();
  /**
   * The X axis in camera space.
   */
  directionX = vec3.create();
  /**
   * The Y axis in camera space.
   */
  directionY = vec3.create();
  /**
   * The Z axis in camera space.
   */
  directionZ = vec3.create();
  /**
   * The four corners of a 2x2 rectangle.
   */
  vectors = [vec3.fromValues(-1, -1, 0), vec3.fromValues(-1, 1, 0), vec3.fromValues(1, 1, 0), vec3.fromValues(1, -1, 0), vec3.fromValues(1, 0, 0), vec3.fromValues(0, 1, 0), vec3.fromValues(0, 0, 1)];
  /**
   * Same as vectors, however these are all billboarded to the camera.
   */
  billboardedVectors = [vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create()];
  /**
   * The camera frustum planes in this order: left, right, top, bottom, near, far.
   */
  planes = [vec4.create(), vec4.create(), vec4.create(), vec4.create(), vec4.create(), vec4.create()];

  /**
   * Set the camera to perspective projection mode.
   */
  perspective(fov: number, aspect: number, near: number, far: number): void {
    this.isPerspective = true;
    this.isOrtho = false;
    this.fov = fov;
    this.aspect = aspect;
    this.nearClipPlane = near;
    this.farClipPlane = far;

    this.update();
  }

  /**
   * Set the camera to orthogonal projection mode.
   */
  ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): void {
    this.isPerspective = false;
    this.isOrtho = true;
    this.leftClipPlane = left;
    this.rightClipPlane = right;
    this.bottomClipPlane = bottom;
    this.topClipPlane = top;
    this.nearClipPlane = near;
    this.farClipPlane = far;

    this.update();
  }

  /**
   * Set the camera location in world coordinates.
   */
  setLocation(location: vec3): void {
    vec3.copy(this.location, location);

    this.update();
  }

  /**
   * Move the camera by the given offset in world coordinates.
   */
  move(offset: vec3): void {
    vec3.add(this.location, this.location, offset);

    this.update();
  }

  /**
   * Set the camera rotation.
   */
  setRotation(rotation: quat): void {
    quat.copy(this.rotation, rotation);

    this.update();
  }

  /**
   * Rotate the camera by the given rotation.
   */
  rotate(rotation: quat): void {
    quat.mul(this.rotation, this.rotation, rotation);

    this.update();
  }

  /**
   * Look at `to`.
   */
  face(to: vec3, worldUp: vec3): void {
    quat.mul(this.rotation, facingCorrection, quatLookAt(quatHeap, to, this.location, worldUp));

    this.update();
  }

  /**
   * Move to `from` and look at `to`.
   */
  moveToAndFace(from: vec3, to: vec3, worldUp: vec3): void {
    vec3.copy(this.location, from);
    this.face(to, worldUp);
  }

  /**
   * Reset the location and angles.
   */
  reset(): void {
    vec3.set(this.location, 0, 0, 0);
    quat.identity(this.rotation);

    this.update();
  }

  /**
   * Recalculate the camera's transformation.
   */
  update(): void {
    const location = this.location;
    const rotation = this.rotation;
    const inverseRotation = this.inverseRotation;
    const viewMatrix = this.viewMatrix;
    const projectionMatrix = this.projectionMatrix;
    const viewProjectionMatrix = this.viewProjectionMatrix;
    const vectors = this.vectors;
    const billboardedVectors = this.billboardedVectors;

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
    for (let i = 0; i < 7; i++) {
      vec3.transformQuat(billboardedVectors[i], vectors[i], inverseRotation);
    }
  }

  /**
   * Given a vector in camera space, return the vector transformed to world space.
   */
  cameraToWorld(out: vec3, v: vec3): vec3 {
    return vec3.transformMat4(out, v, this.inverseViewMatrix);
  }

  /**
   * Given a vector in world space, return the vector transformed to camera space.
   */
  worldToCamera(out: vec3, v: vec3): vec3 {
    return vec3.transformMat4(out, v, this.viewMatrix);
  }

  /**
   * Given a vector in world space, return the vector transformed to screen space.
   */
  worldToScreen(out: Float32Array, v: Float32Array, viewport: vec4): Float32Array {
    vec3.transformMat4(vectorHeap, <vec3>v, this.viewProjectionMatrix);

    out[0] = Math.round(((vectorHeap[0] + 1) / 2) * viewport[2]);
    out[1] = Math.round(((vectorHeap[1] + 1) / 2) * viewport[3]);

    return out;
  }

  /**
   * Given a vector in screen space, return a ray from the near plane to the far plane.
   */
  screenToWorldRay(out: Float32Array, v: Float32Array, viewport: vec4): Float32Array {
    const a = vectorHeap;
    const b = vectorHeap2;
    const c = vectorHeap3;
    const x = v[0];
    const y = v[1];
    const inverseViewProjectionMatrix = this.inverseViewProjectionMatrix;

    // Intersection on the near-plane
    unproject(a, vec3.set(c, x, y, 0), inverseViewProjectionMatrix, viewport);

    // Intersection on the far-plane
    unproject(b, vec3.set(c, x, y, 1), inverseViewProjectionMatrix, viewport);

    out.set(a, 0);
    out.set(b, 3);

    return out;
  }
}
