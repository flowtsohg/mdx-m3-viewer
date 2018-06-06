import {vec3, quat} from 'gl-matrix';
import {VEC3_UNIT_Z} from '../../../common/gl-matrix-addon';
import {randomInRange} from '../../../common/math';

// Heap allocations needed for this module.
let rotationHeap = quat.create();
let velocityHeap = vec3.create();

/**
 * A spawned model particle.
 */
export default class Particle {
  /**
   * @param {MdxParticleEmitter} emitter
   */
  constructor(emitter) {
    this.emitter = emitter;
    this.instance = null;

    this.internalInstance = emitter.modelObject.internalResource.addInstance();
    this.velocity = vec3.create();
    this.gravity = 0;
  }

  /**
   * @param {ParticleEmitterView} emitterView
   */
  reset(emitterView) {
    let instance = emitterView.instance;
    let node = instance.nodes[this.emitter.modelObject.index];
    let internalInstance = this.internalInstance;
    let scale = node.worldScale;
    let latitude = emitterView.getLatitude();
    // let longitude = emitterView.getLongitude();
    let velocity = this.velocity;

    this.instance = instance;
    this.node = node;
    this.health = emitterView.getLifeSpan();
    this.gravity = emitterView.getGravity() * scale[2];

    // Local rotation
    quat.identity(rotationHeap);
    quat.rotateZ(rotationHeap, rotationHeap, randomInRange(-Math.PI, Math.PI));
    quat.rotateY(rotationHeap, rotationHeap, randomInRange(-latitude, latitude));
    vec3.transformQuat(velocity, VEC3_UNIT_Z, rotationHeap);

    // World rotation
    vec3.transformQuat(velocity, velocity, node.worldRotation);

    // Apply speed
    vec3.scale(velocity, velocity, emitterView.getSpeed());

    // Apply the parent's scale
    vec3.mul(velocity, velocity, scale);

    instance.scene.addInstance(internalInstance);

    internalInstance.setTransformation(node.worldLocation, quat.setAxisAngle(rotationHeap, VEC3_UNIT_Z, randomInRange(0, Math.PI * 2)), node.worldScale);
    internalInstance.setSequence(0);
    internalInstance.show();
  }

  /**
   *
   */
  update() {
    let internalInstance = this.internalInstance;
    let velocity = this.velocity;
    let frameTimeS = internalInstance.model.viewer.frameTime * 0.001;

    internalInstance.paused = false;

    this.health -= frameTimeS;

    velocity[2] -= this.gravity * frameTimeS;

    internalInstance.move(vec3.scale(velocityHeap, velocity, frameTimeS));

    if (this.health <= 0) {
      this.internalInstance.hide();
    }
  }
}
