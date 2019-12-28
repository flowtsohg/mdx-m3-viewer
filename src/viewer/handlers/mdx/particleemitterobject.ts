import ParticleEmitter from '../../../parsers/mdlx/particleemitter';
import MdxModel from './model';
import GenericObject from './genericobject';
import MdxComplexInstance from './complexinstance';

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

  getSpeed(out: Float32Array, instance: MdxComplexInstance) {
    return this.getScalarValue(out, 'KPES', instance, this.speed);
  }

  getLatitude(out: Float32Array, instance: MdxComplexInstance) {
    return this.getScalarValue(out, 'KPLTV', instance, this.latitude);
  }

  getLongitude(out: Float32Array, instance: MdxComplexInstance) {
    return this.getScalarValue(out, 'KPLN', instance, this.longitude);
  }

  getLifeSpan(out: Float32Array, instance: MdxComplexInstance) {
    return this.getScalarValue(out, 'KPEL', instance, this.lifeSpan);
  }

  getGravity(out: Float32Array, instance: MdxComplexInstance) {
    return this.getScalarValue(out, 'KPEG', instance, this.gravity);
  }

  getEmissionRate(out: Float32Array, instance: MdxComplexInstance) {
    return this.getScalarValue(out, 'KPEE', instance, this.emissionRate);
  }

  getVisibility(out: Float32Array, instance: MdxComplexInstance) {
    return this.getScalarValue(out, 'KPEV', instance, 1);
  }
}
