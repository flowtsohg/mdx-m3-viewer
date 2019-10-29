import {vec3, quat} from 'gl-matrix';
import {VEC3_UNIT_Z} from '../../../common/gl-matrix-addon';
import {degToRad, randomInRange} from '../../../common/math';
import EmittedObject from '../../emittedobject';

// Heap allocations needed for this module.
const rotationHeap = quat.create();
const widthHeap = new Float32Array(1);
const lengthHeap = new Float32Array(1);
const latitudeHeap = new Float32Array(1);
const variationHeap = new Float32Array(1);
const speedHeap = new Float32Array(1);
const gravityHeap = new Float32Array(1);

/**
 * A type 2 particle.
 */
export default class Particle2 extends EmittedObject {
  /**
   * @param {ParticleEmitter2} emitter
   */
  constructor(emitter) {
    super(emitter);

    /** @member {boolean} */
    this.tail = false;
    /** @member {number} */
    this.gravity = 0;
    /** @member {vec3} */
    this.location = vec3.create();
    /** @member {vec3} */
    this.velocity = vec3.create();
    /** @member {vec3} */
    this.scale = vec3.create();
  }

  /**
   * @override
   * @param {number} tail
   */
  bind(tail) {
    let emitter = this.emitter;
    let instance = emitter.instance;
    let emitterObject = emitter.emitterObject;

    emitterObject.getWidth(widthHeap, instance);
    emitterObject.getLength(lengthHeap, instance);
    emitterObject.getLatitude(latitudeHeap, instance);
    emitterObject.getVariation(variationHeap, instance);
    emitterObject.getSpeed(speedHeap, instance);
    emitterObject.getGravity(gravityHeap, instance);

    let node = emitter.node;
    let pivot = node.pivot;
    let scale = node.worldScale;
    let width = widthHeap[0] * 0.5;
    let length = lengthHeap[0] * 0.5;
    let latitude = degToRad(latitudeHeap[0]);
    let variation = variationHeap[0];
    let speed = speedHeap[0];
    let location = this.location;
    let velocity = this.velocity;

    this.health = emitterObject.lifeSpan;
    this.tail = tail;
    this.gravity = gravityHeap[0] * scale[2];

    vec3.copy(this.scale, scale);

    // Local location
    location[0] = pivot[0] + randomInRange(-width, width);
    location[1] = pivot[1] + randomInRange(-length, length);
    location[2] = pivot[2];

    // World location
    if (!emitterObject.modelSpace) {
      vec3.transformMat4(location, location, node.worldMatrix);
    }

    // Local rotation
    quat.identity(rotationHeap);
    quat.rotateZ(rotationHeap, rotationHeap, Math.PI / 2);
    quat.rotateY(rotationHeap, rotationHeap, randomInRange(-latitude, latitude));

    // If this is not a line emitter, emit in a sphere rather than a circle.
    if (!emitterObject.lineEmitter) {
      quat.rotateX(rotationHeap, rotationHeap, randomInRange(-latitude, latitude));
    }

    // World rotation
    if (!emitterObject.modelSpace) {
      quat.mul(rotationHeap, node.worldRotation, rotationHeap);
    }

    // Apply the rotation
    vec3.transformQuat(velocity, VEC3_UNIT_Z, rotationHeap);

    // Apply speed
    vec3.scale(velocity, velocity, speed + randomInRange(-variation, variation));

    // Apply the parent's scale
    if (!emitterObject.modelSpace) {
      vec3.mul(velocity, velocity, scale);
    }
  }

  /**
   * @override
   * @param {number} dt
   */
  update(dt) {
    this.health -= dt;

    if (this.health > 0) {
      let location = this.location;
      let velocity = this.velocity;

      velocity[2] -= this.gravity * dt;

      location[0] += velocity[0] * dt;
      location[1] += velocity[1] * dt;
      location[2] += velocity[2] * dt;
    }
  }
}
