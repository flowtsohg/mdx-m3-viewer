import ParticleEmitter from '../../../parsers/mdlx/particleemitter';
import MdxModel from './model';
import GenericObject from './genericobject';

/**
 * An MDX particle emitter.
 */
export default class ParticleEmitterObject extends GenericObject {
  internalModel: MdxModel;
  speed: number;
  latitude: number;
  longitude: number;
  lifeSpan: number;
  gravity: number;
  emissionRate: number;
  /**
   * No need to create instances of the internal model if it didn't load.
   * 
   * Such instances won't actually render, and who knows if the model will ever load?
   */
  ok: boolean = false;

  constructor(model: MdxModel, emitter: ParticleEmitter, index: number) {
    super(model, emitter, index);

    this.internalModel = <MdxModel>model.viewer.load(emitter.path.replace(/\\/g, '/').toLowerCase().replace('.mdl', '.mdx'), model.pathSolver, model.solverParams);
    this.speed = emitter.speed;
    this.latitude = emitter.latitude;
    this.longitude = emitter.longitude;
    this.lifeSpan = emitter.lifeSpan;
    this.gravity = emitter.gravity;
    this.emissionRate = emitter.emissionRate;

    // Activate emitters based on this emitter object only when and if the internal model loads successfully.
    this.internalModel.whenLoaded(() => {
      this.ok = this.internalModel.ok;
    });
  }

  getSpeed(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KPES', sequence, frame, counter, this.speed);
  }

  getLatitude(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KPLTV', sequence, frame, counter, this.latitude);
  }

  getLongitude(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KPLN', sequence, frame, counter, this.longitude);
  }

  getLifeSpan(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KPEL', sequence, frame, counter, this.lifeSpan);
  }

  getGravity(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KPEG', sequence, frame, counter, this.gravity);
  }

  getEmissionRate(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KPEE', sequence, frame, counter, this.emissionRate);
  }

  getVisibility(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KPEV', sequence, frame, counter, 1);
  }
}
