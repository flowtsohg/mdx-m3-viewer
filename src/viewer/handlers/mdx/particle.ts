import { vec3, quat } from 'gl-matrix';
import { VEC3_UNIT_Z } from '../../../common/gl-matrix-addon';
import { randomInRange } from '../../../common/math';
import Scene from '../../scene';
import EmittedObject from '../../emittedobject';
import ParticleEmitterObject from './particleemitterobject';
import MdxModelInstance from './modelinstance';
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
  internalInstance: MdxModelInstance;
  velocity: vec3 = vec3.create();
  gravity: number = 0;

  constructor(emitter: ParticleEmitter) {
    super(emitter);

    let emitterObject = <ParticleEmitterObject>emitter.emitterObject;

    this.internalInstance = <MdxModelInstance>emitterObject.internalModel.addInstance();
  }

  bind() {
    let emitter = <ParticleEmitter>this.emitter;
    let instance = <MdxModelInstance>emitter.instance;
    let sequence = instance.sequence;
    let frame = instance.frame;
    let counter = instance.counter;
    let scene = <Scene>instance.scene;
    let emitterObject = <ParticleEmitterObject>emitter.emitterObject;
    let node = instance.nodes[emitterObject.index];
    let internalInstance = this.internalInstance;
    let scale = node.worldScale;
    let velocity = this.velocity;

    emitterObject.getLatitude(latitudeHeap, sequence, frame, counter);
    // emitterObject.getLongitude(longitudeHeap, sequence, frame, counter);
    emitterObject.getLifeSpan(lifeSpanHeap, sequence, frame, counter);
    emitterObject.getGravity(gravityHeap, sequence, frame, counter);
    emitterObject.getSpeed(speedHeap, sequence, frame, counter);

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

    scene.addInstance(internalInstance);

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
