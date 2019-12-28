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
  rect: vec4 = vec4.create();
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
  worldMatrix: mat4 = mat4.create();
  projectionMatrix: mat4 = mat4.create();
  worldProjectionMatrix: mat4 = mat4.create();
  inverseWorldMatrix: mat4 = mat4.create();
  inverseRotationMatrix: mat4 = mat4.create();
  inverseWorldProjectionMatrix: mat4 = mat4.create();
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
   * The first four vectors describe the corners of a 2x2 rectangle.
   * 
   * The last three vectors are unit axes.
   */
  vectors: vec3[] = [vec3.fromValues(-1, -1, 0), vec3.fromValues(-1, 1, 0), vec3.fromValues(1, 1, 0), vec3.fromValues(1, -1, 0), vec3.fromValues(1, 0, 0), vec3.fromValues(0, 1, 0), vec3.fromValues(0, 0, 1)];
  /**
   * Same as vectors, however these are all billboarded to the camera.
   */
  billboardedVectors: vec3[] = [vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create(), vec3.create()];
  /**
   * The camera frustum planes in this order: left, right, top, bottom, near, far.
   */
  planes: vec4[] = [vec4.create(), vec4.create(), vec4.create(), vec4.create(), vec4.create(), vec4.create()];
  lines: vec4[] = [vec4.create(), vec4.create(), vec4.create(), vec4.create(), vec4.create(), vec4.create(), vec4.create(), vec4.create(), vec4.create(), vec4.create(), vec4.create(), vec4.create()];
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
  viewport(viewport: vec4 | number[]) {
    vec4.copy(this.rect, viewport);

    this.aspect = viewport[2] / viewport[3];

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
   * Rotate around the given point.
   * Changes both the camera location and rotation.
   */
  rotateAround(rotation: quat, point: vec3) {
    this.rotate(rotation);

    quat.conjugate(quatHeap, quatHeap);
    vec3.sub(vectorHeap, this.location, point);
    vec3.transformQuat(vectorHeap, vectorHeap, rotation);
    vec3.add(this.location, vectorHeap, point);
  }

  /**
   * Rotate around the given point.
   * Changes both the camera location and rotation.
   */
  setRotationAround(rotation: quat, point: vec3) {
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
   */
  setRotationAroundAngles(horizontalAngle: number, verticalAngle: number, point: vec3) {
    quat.identity(quatHeap);
    quat.rotateX(quatHeap, quatHeap, verticalAngle);
    quat.rotateZ(quatHeap, quatHeap, horizontalAngle);

    this.setRotationAround(quatHeap, point);
  }

  /**
   * Look at `to`.
   */
  face(to: vec3, worldUp: vec3) {
    quatLookAt(quatHeap, to, this.location, worldUp);
    quat.conjugate(quatHeap, quatHeap);

    quat.copy(this.rotation, facingCorrection);
    quat.mul(this.rotation, this.rotation, quatHeap);

    this.dirty = true;
  }

  /**
   * Move to `from` and look at the `to`.
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
      this.dirty = false;

      let location = this.location;
      let rotation = this.rotation;
      let inverseRotation = this.inverseRotation;
      let worldMatrix = this.worldMatrix;
      let projectionMatrix = this.projectionMatrix;
      let worldProjectionMatrix = this.worldProjectionMatrix;
      let vectors = this.vectors;
      let billboardedVectors = this.billboardedVectors;

      // View -> Clip.
      if (this.isPerspective) {
        mat4.perspective(projectionMatrix, this.fov, this.aspect, this.nearClipPlane, this.farClipPlane);
      } else {
        mat4.ortho(projectionMatrix, this.leftClipPlane, this.rightClipPlane, this.bottomClipPlane, this.topClipPlane, this.nearClipPlane, this.farClipPlane);
      }

      // World -> View.
      mat4.fromQuat(worldMatrix, rotation);
      mat4.translate(worldMatrix, worldMatrix, vec3.negate(vectorHeap, location));

      quat.conjugate(inverseRotation, rotation);

      // World -> Clip.
      mat4.mul(worldProjectionMatrix, projectionMatrix, worldMatrix);

      // Recaculate the camera's frusum planes
      unpackPlanes(this.planes, worldProjectionMatrix);

      // View -> World.
      mat4.invert(this.inverseWorldMatrix, worldMatrix);

      // Clip -> World.
      mat4.invert(this.inverseWorldProjectionMatrix, worldProjectionMatrix);

      vec3.transformQuat(this.directionX, VEC3_UNIT_X, inverseRotation);
      vec3.transformQuat(this.directionY, VEC3_UNIT_Y, inverseRotation);
      vec3.transformQuat(this.directionZ, VEC3_UNIT_Z, inverseRotation);

      // Cache the billboarded vectors
      for (let i = 0; i < 7; i++) {
        vec3.transformQuat(billboardedVectors[i], vectors[i], inverseRotation);
      }
    }
  }

  /**
   * Given a vector in camera space, return the vector transformed to world space.
   */
  cameraToWorld(out: vec3, v: vec3) {
    return vec3.transformMat4(out, v, this.inverseWorldMatrix);
  }

  /**
   * Given a vector in world space, return the vector transformed to camera space.
   */
  worldToCamera(out: vec3, v: vec3) {
    // return vec3.transformQuat(out, v, this.inverseWorldRotation);
    return vec3.transformMat4(out, v, this.worldMatrix);
  }

  /**
   * Given a vector in world space, return the vector transformed to screen space.
   */
  worldToScreen(out: Float32Array, v: Float32Array) {
    let viewport = this.rect;

    vec3.transformMat4(vectorHeap, <vec3>v, this.worldProjectionMatrix);

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
