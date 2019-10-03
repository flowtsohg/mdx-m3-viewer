import {vec3, quat} from 'gl-matrix';
import {VEC3_UNIT_Z} from '../../../common/gl-matrix-addon';
import {degToRad, randomInRange} from '../../../common/math';
import {BYTES_PER_OBJECT, FLOATS_PER_OBJECT, FLOAT_OFFSET_P0, FLOAT_OFFSET_HEALTH, BYTE_OFFSET_TAIL, BYTE_OFFSET_TEAM_COLOR, HEAD} from './geometryemitter';

// Heap allocations needed for this module.
const rotationHeap = quat.create();
const widthHeap = new Float32Array(1);
const lengthHeap = new Float32Array(1);
const latitudeHeap = new Float32Array(1);
const variationHeap = new Float32Array(1);
const speedHeap = new Float32Array(1);
const gravityHeap = new Float32Array(1);
const locationHeap = vec3.create();
const startHeap = vec3.create();
const endHeap = vec3.create();

/**
 * A type 2 particle.
 */
export default class Particle2 {
  /**
   * @param {ParticleEmitter2} emitter
   */
  constructor(emitter) {
    this.emitter = emitter;
    this.emitterView = null;
    this.node = null;
    this.tail = false;
    this.health = 0;
    this.gravity = 0;
    this.location = vec3.create();
    this.velocity = vec3.create();
    this.scale = vec3.create();
  }

  /**
   * @param {ParticleEmitter2View} emitterView
   * @param {number} tail
   */
  bind(emitterView, tail) {
    emitterView.getWidth(widthHeap);
    emitterView.getLength(lengthHeap);
    emitterView.getLatitude(latitudeHeap);
    emitterView.getVariation(variationHeap);
    emitterView.getSpeed(speedHeap);
    emitterView.getGravity(gravityHeap);

    let modelObject = this.emitter.modelObject;
    let node = emitterView.instance.nodes[modelObject.index];
    let pivot = node.pivot;
    let scale = node.worldScale;
    let width = widthHeap[0] * 0.5;
    let length = lengthHeap[0] * 0.5;
    let latitude = degToRad(latitudeHeap[0]);
    let variation = variationHeap[0];
    let speed = speedHeap[0];
    let location = this.location;
    let velocity = this.velocity;

    this.emitterView = emitterView;
    this.node = node;
    this.health = modelObject.lifeSpan;
    this.tail = tail;
    this.gravity = gravityHeap[0] * scale[2];

    vec3.copy(this.scale, scale);

    // Local location
    location[0] = pivot[0] + randomInRange(-width, width);
    location[1] = pivot[1] + randomInRange(-length, length);
    location[2] = pivot[2];

    // World location
    if (!modelObject.modelSpace) {
      vec3.transformMat4(location, location, node.worldMatrix);
    }

    // Local rotation
    quat.identity(rotationHeap);
    quat.rotateZ(rotationHeap, rotationHeap, Math.PI / 2);
    quat.rotateY(rotationHeap, rotationHeap, randomInRange(-latitude, latitude));

    // If this is not a line emitter, emit in a sphere rather than a circle.
    if (!modelObject.lineEmitter) {
      quat.rotateX(rotationHeap, rotationHeap, randomInRange(-latitude, latitude));
    }

    // World rotation
    if (!modelObject.modelSpace) {
      quat.mul(rotationHeap, node.worldRotation, rotationHeap);
    }

    // Apply the rotation
    vec3.transformQuat(velocity, VEC3_UNIT_Z, rotationHeap);

    // Apply speed
    vec3.scale(velocity, velocity, speed + randomInRange(-variation, variation));

    // Apply the parent's scale
    if (!modelObject.modelSpace) {
      vec3.mul(velocity, velocity, scale);
    }
  }

  /**
   * @param {number} offset
   * @param {number} dt
   */
  render(offset, dt) {
    this.health -= dt;

    if (this.health > 0) {
      let location = this.location;
      let velocity = this.velocity;
      let scale = this.scale;
      let tail = this.tail;
      let emitter = this.emitter;
      let byteView = emitter.byteView;
      let floatView = emitter.floatView;
      let byteOffset = offset * BYTES_PER_OBJECT;
      let floatOffset = offset * FLOATS_PER_OBJECT;
      let p0Offset = floatOffset + FLOAT_OFFSET_P0;
      let modelObject = emitter.modelObject;

      velocity[2] -= this.gravity * dt;

      location[0] += velocity[0] * dt;
      location[1] += velocity[1] * dt;
      location[2] += velocity[2] * dt;

      if (tail === HEAD) {
        // If this is a model space emitter, the location is in local space, so convert it to world space.
        if (modelObject.modelSpace) {
          location = vec3.transformMat4(locationHeap, location, this.node.worldMatrix);
        }

        floatView[p0Offset + 0] = location[0];
        floatView[p0Offset + 1] = location[1];
        floatView[p0Offset + 2] = location[2];
      } else {
        let velocity = this.velocity;
        let tailLength = modelObject.tailLength;
        let start = startHeap;
        let end = location;

        start[0] = end[0] - tailLength * velocity[0];
        start[1] = end[1] - tailLength * velocity[1];
        start[2] = end[2] - tailLength * velocity[2];

        // If this is a model space emitter, the start and end are in local space, so convert them to world space.
        if (modelObject.modelSpace) {
          start = vec3.transformMat4(start, start, this.node.worldMatrix);
          end = vec3.transformMat4(endHeap, end, this.node.worldMatrix);
        }

        floatView[p0Offset + 0] = start[0];
        floatView[p0Offset + 1] = start[1];
        floatView[p0Offset + 2] = start[2];
        floatView[p0Offset + 3] = end[0];
        floatView[p0Offset + 4] = end[1];
        floatView[p0Offset + 5] = end[2];
      }

      floatView[p0Offset + 6] = scale[0];
      floatView[p0Offset + 7] = scale[0];
      floatView[p0Offset + 8] = scale[0];

      floatView[floatOffset + FLOAT_OFFSET_HEALTH] = this.health;

      byteView[byteOffset + BYTE_OFFSET_TAIL] = tail;
      byteView[byteOffset + BYTE_OFFSET_TEAM_COLOR] = this.emitterView.instance.teamColor;
    }
  }
}
