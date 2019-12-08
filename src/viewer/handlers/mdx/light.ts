import MdlxLight from '../../../parsers/mdlx/light';
import MdxModel from './model';
import MdxComplexInstance from './complexinstance';
import GenericObject from './genericobject';

/**
 * An MDX light.
 */
export default class Light extends GenericObject {
  type: number;
  attenuation: Float32Array;
  color: Float32Array;
  intensity: number;
  ambientColor: Float32Array;
  ambientIntensity: number;

  constructor(model: MdxModel, light: MdlxLight, index: number) {
    super(model, light, index);

    this.type = light.type;
    this.attenuation = light.attenuation;
    this.color = light.color;
    this.intensity = light.intensity;
    this.ambientColor = light.ambientColor;
    this.ambientIntensity = light.ambientIntensity;
  }

  getAttenuationStart(out: Float32Array, instance: MdxComplexInstance) {
    return this.getScalarValue(out, 'KLAS', instance, this.attenuation[0]);
  }

  getAttenuationEnd(out: Float32Array, instance: MdxComplexInstance) {
    return this.getScalarValue(out, 'KLAE', instance, this.attenuation[1]);
  }

  getIntensity(out: Float32Array, instance: MdxComplexInstance) {
    return this.getScalarValue(out, 'KLAI', instance, this.intensity);
  }

  getColor(out: Float32Array, instance: MdxComplexInstance) {
    return this.getVectorValue(out, 'KLAC', instance, this.color);
  }

  getAmbientIntensity(out: Float32Array, instance: MdxComplexInstance) {
    return this.getScalarValue(out, 'KLBI', instance, this.ambientIntensity);
  }

  getAmbientColor(out: Float32Array, instance: MdxComplexInstance) {
    return this.getVectorValue(out, 'KLBC', instance, this.ambientColor);
  }
}
