import { vec3, quat } from 'gl-matrix';
import { VEC3_UNIT_Z } from '../../../common/gl-matrix-addon';
import { degToRad, randomInRange } from '../../../common/math';
import EmittedObject from '../../emittedobject';
import ParticleEmitter2Object from './particleemitter2object';
import ParticleEmitter2 from './particleemitter2';
import MdxModelInstance from './modelinstance';

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
  tail: number = 0;
  gravity: number = 0;
  location: vec3 = vec3.create();
  velocity: vec3 = vec3.create();
  scale: vec3 = vec3.create();

  bind(tail: number) {
    let emitter = <ParticleEmitter2>this.emitter;
    let instance = <MdxModelInstance>emitter.instance;
    let sequence = instance.sequence;
    let frame = instance.frame;
    let counter = instance.counter;
    let emitterObject = <ParticleEmitter2Object>emitter.emitterObject;

    emitterObject.getWidth(widthHeap, sequence, frame, counter);
    emitterObject.getLength(lengthHeap, sequence, frame, counter);
    emitterObject.getLatitude(latitudeHeap, sequence, frame, counter);
    emitterObject.getVariation(variationHeap, sequence, frame, counter);
    emitterObject.getSpeed(speedHeap, sequence, frame, counter);
    emitterObject.getGravity(gravityHeap, sequence, frame, counter);

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

  update(dt: number) {
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
