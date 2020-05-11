import Emitter from '../../emitter';
import ParticleEmitterObject from './particleemitterobject';
import ParticleEmitter2Object from './particleemitter2object';
import RibbonEmitterObject from './ribbonemitterobject';
import EventObjectEmitterObject from './eventobjectemitterobject';
import MdxModelInstance from './modelinstance';

/**
 * The base of all MDX emitters.
 */
export default abstract class MdxEmitter extends Emitter {
  emitterObject: ParticleEmitterObject | ParticleEmitter2Object | RibbonEmitterObject | EventObjectEmitterObject;

  constructor(instance: MdxModelInstance, emitterObject: ParticleEmitterObject | ParticleEmitter2Object | RibbonEmitterObject | EventObjectEmitterObject) {
    super(instance);

    this.emitterObject = emitterObject;
  }

  update(dt: number) {
    if (this.emitterObject.ok) {
      super.update(dt);
    }
  }
}
