import { vec3 } from 'gl-matrix';
import MdlxGeosetAnimation from '../../../parsers/mdlx/geosetanimation';
import AnimatedObject from './animatedobject';
import MdxModel from './model';
import MdxComplexInstance from './complexinstance';

/**
 * A geoset animation.
 */
export default class GeosetAnimation extends AnimatedObject {
  alpha: number;
  color: vec3;
  geosetId: number;

  constructor(model: MdxModel, geosetAnimation: MdlxGeosetAnimation) {
    super(model, geosetAnimation);

    let color = geosetAnimation.color;

    this.alpha = geosetAnimation.alpha;
    this.color = vec3.fromValues(color[2], color[1], color[0]); // Stored as RGB, but animated colors are stored as BGR, so sizzle.
    this.geosetId = geosetAnimation.geosetId;

    this.addVariants('KGAO', 'alpha');
    this.addVariants('KGAC', 'color');
  }

  getAlpha(out: Float32Array, instance: MdxComplexInstance) {
    return this.getScalarValue(out, 'KGAO', instance, this.alpha);
  }

  getColor(out: Float32Array, instance: MdxComplexInstance) {
    return this.getVectorValue(out, 'KGAC', instance, this.color);
  }
}
