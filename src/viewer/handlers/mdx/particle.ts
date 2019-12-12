import { vec3, quat } from 'gl-matrix';
import { VEC3_UNIT_Z } from '../../../common/gl-matrix-addon';
import { randomInRange } from '../../../common/math';
import EmittedObject from '../../emittedobject';
import ParticleEmitterObject from './particleemitterobject';
import MdxComplexInstance from './complexinstance';
import ParticleEmitter from './particleemitter';

const rotationHeap = quat.create();
const velocityHeap = vec3.create();
const latitudeHeap = new Float32Array(1);
// const longitudeHeap = new Float32Array(1);
const lifeSpanHeap = new Float32Array(1);
const gravityHeap = new Float32Array(1);
const speedHeap = new Float32Array(1);

/**
 * A spawned model particle.
 */
export default class Particle extends EmittedObject {
  internalInstance: MdxComplexInstance;
  velocity: vec3;
  gravity: number;

  constructor(emitter: ParticleEmitter) {
    super(emitter);

    let emitterObject = <ParticleEmitterObject>emitter.emitterObject;

    this.internalInstance = <MdxComplexInstance>emitterObject.internalModel.addInstance();
    this.velocity = vec3.create();
    this.gravity = 0;
  }

  bind() {
    let emitter = <ParticleEmitter>this.emitter;
    let instance = <MdxComplexInstance>emitter.instance;
    let emitterObject = <ParticleEmitterObject>emitter.emitterObject;
    let node = instance.nodes[emitterObject.index];
    let internalInstance = this.internalInstance;
    let scale = node.worldScale;
    let velocity = this.velocity;

    emitterObject.getLatitude(latitudeHeap, instance);
    // emitterObject.getLongitude(longitudeHeap, instance);
    emitterObject.getLifeSpan(lifeSpanHeap, instance);
    emitterObject.getGravity(gravityHeap, instance);
    emitterObject.getSpeed(speedHeap, instance);

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

  update(dt: number) {
    let internalInstance = this.internalInstance;

    internalInstance.paused = false; /// Why is this here?

    this.health -= dt;

    if (this.health > 0) {
      let velocity = this.velocity;

      velocity[2] -= this.gravity * dt;

      internalInstance.move(vec3.scale(velocityHeap, velocity, dt));
    } else {
      internalInstance.hide();
    }
  }
}
