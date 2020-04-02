import MdlxLight from '../../../parsers/mdlx/light';
import MdxModel from './model';
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

  getAttenuationStart(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KLAS', sequence, frame, counter, this.attenuation[0]);
  }

  getAttenuationEnd(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KLAE', sequence, frame, counter, this.attenuation[1]);
  }

  getIntensity(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KLAI', sequence, frame, counter, this.intensity);
  }

  getColor(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getVectorValue(out, 'KLAC', sequence, frame, counter, this.color);
  }

  getAmbientIntensity(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getScalarValue(out, 'KLBI', sequence, frame, counter, this.ambientIntensity);
  }

  getAmbientColor(out: Float32Array, sequence: number, frame: number, counter: number) {
    return this.getVectorValue(out, 'KLBC', sequence, frame, counter, this.ambientColor);
  }
}
