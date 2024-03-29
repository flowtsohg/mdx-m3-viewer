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
  tail = 0;
  gravity = 0;
  location = vec3.create();
  velocity = vec3.create();
  scale = vec3.create();
  facing = 0; // XYQuad

  bind(tail: number): void {
    const emitter = <ParticleEmitter2>this.emitter;
    const instance = <MdxModelInstance>emitter.instance;
    const sequence = instance.sequence;
    const frame = instance.frame;
    const counter = instance.counter;
    const emitterObject = <ParticleEmitter2Object>emitter.emitterObject;

    emitterObject.getWidth(widthHeap, sequence, frame, counter);
    emitterObject.getLength(lengthHeap, sequence, frame, counter);
    emitterObject.getLatitude(latitudeHeap, sequence, frame, counter);
    emitterObject.getVariation(variationHeap, sequence, frame, counter);
    emitterObject.getSpeed(speedHeap, sequence, frame, counter);
    emitterObject.getGravity(gravityHeap, sequence, frame, counter);

    const node = emitter.node;
    const pivot = node.pivot;
    const scale = node.worldScale;
    const width = widthHeap[0] * 0.5;
    const length = lengthHeap[0] * 0.5;
    const latitude = degToRad(latitudeHeap[0]);
    const variation = variationHeap[0];
    const speed = speedHeap[0];
    const location = this.location;
    const velocity = this.velocity;

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
    vec3.scale(velocity, velocity, speed * (1 + randomInRange(-variation, variation)));

    // Apply the parent's scale
    if (!emitterObject.modelSpace) {
      vec3.mul(velocity, velocity, scale);
    }

    // XY particles are rotated to face their velocity on the XY plane.
    if (emitterObject.xYQuad) {
      this.facing = Math.atan2(velocity[1], velocity[0]) - Math.PI + Math.PI / 8;
    }
  }

  update(dt: number): void {
    this.health -= dt;

    if (this.health > 0) {
      const location = this.location;
      const velocity = this.velocity;

      velocity[2] -= this.gravity * dt;

      location[0] += velocity[0] * dt;
      location[1] += velocity[1] * dt;
      location[2] += velocity[2] * dt;
    }
  }
}
