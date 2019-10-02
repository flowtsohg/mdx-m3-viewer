import {vec3, quat} from 'gl-matrix';
import {VEC3_UNIT_Z} from '../../../common/gl-matrix-addon';
import {randomInRange} from '../../../common/math';

// Heap allocations needed for this module.
let rotationHeap = quat.create();
let velocityHeap = vec3.create();
let latitudeHeap = new Float32Array(1);
// let longitudeHeap = new Float32Array(1);
let lifeSpanHeap = new Float32Array(1);
let gravityHeap = new Float32Array(1);
let speedHeap = new Float32Array(1);

/**
 * A spawned model particle.
 */
export default class Particle {
  /**
   * @param {MdxParticleEmitter} emitter
   */
  constructor(emitter) {
    this.emitter = emitter;
    this.emitterView = null;
    this.internalInstance = emitter.modelObject.internalResource.addInstance();
    this.velocity = vec3.create();
    this.gravity = 0;
  }

  /**
   * @param {ParticleEmitterView} emitterView
   */
  bind(emitterView) {
    let instance = emitterView.instance;
    let node = instance.nodes[this.emitter.modelObject.index];
    let internalInstance = this.internalInstance;
    let scale = node.worldScale;
    let velocity = this.velocity;

    emitterView.getLatitude(latitudeHeap);
    // emitterView.getLongitude(longitudeHeap);
    emitterView.getLifeSpan(lifeSpanHeap);
    emitterView.getGravity(gravityHeap);
    emitterView.getSpeed(speedHeap);

    this.emitterView = emitterView;
    this.node = node;
    this.health = lifeSpanHeap[0];
    this.gravity = gravityHeap[0] * scale[2];

    // Local rotation
    quat.identity(rotationHeap);
    quat.rotateZ(rotationHeap, rotationHeap, randomInRange(-Math.PI, Math.PI));
    quat.rotateY(rotationHeap, rotationHeap, randomInRange(-latitudeHeap[0], latitudeHeap[0]));
    vec3.transformQuat(velocity, VEC3_UNIT_Z, rotationHeap);

    // World rotation
    vec3.transformQuat(velocity, velocity, node.worldRotation);

    // Apply speed
    vec3.scale(velocity, velocity, speedHeap[0]);

    // Apply the parent's scale
    vec3.mul(velocity, velocity, scale);

    instance.scene.addInstance(internalInstance);

    internalInstance.setTransformation(node.worldLocation, quat.setAxisAngle(rotationHeap, VEC3_UNIT_Z, randomInRange(0, Math.PI * 2)), node.worldScale);
    internalInstance.setSequence(0);
    internalInstance.show();
  }

  /**
   * @param {number} offset
   * @param {number} dt
   */
  render(offset, dt) {
    let internalInstance = this.internalInstance;

    internalInstance.paused = false; /// Why is this here?

    this.health -= dt;

    if (this.health > 0) {
      let velocity = this.velocity;

      velocity[2] -= this.gravity * dt;

      internalInstance.move(vec3.scale(velocityHeap, velocity, dt));
    } else {
      this.internalInstance.hide();
    }
  }
}
