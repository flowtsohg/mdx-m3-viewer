import SharedGeometryEmitter from './sharedgeometryemitter';
import Particle2 from './particle2';

/**
 * An MDX particle emitter type 2.
 */
export default class ParticleEmitter2 extends SharedGeometryEmitter {
  /**
   * @param {ParticleEmitter2} modelObject
   */
  constructor(modelObject) {
    super(modelObject);

    this.elementsPerEmit = ((modelObject.headOrTail === 2) ? 2 : 1) * 30;
  }

  /**
   * @param {ParticleEmitter2View} emitterView
   */
  emit(emitterView) {
    if (this.modelObject.head) {
      this.emitObject(emitterView, true);
    }

    if (this.modelObject.tail) {
      this.emitObject(emitterView, false);
    }
  }

  /**
   * @return {Particle2}
   */
  createObject() {
    return new Particle2(this);
  }
}
