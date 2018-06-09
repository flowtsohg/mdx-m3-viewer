import AnimatedObject from './animatedobject';

/**
 * A geoset animation.
 */
export default class GeosetAnimation extends AnimatedObject {
  /**
   * @param {MdxModel} model
   * @param {MdxParserGeosetAnimation} geosetAnimation
   */
  constructor(model, geosetAnimation) {
    super(model, geosetAnimation);

    this.alpha = geosetAnimation.alpha;
    this.color = [...geosetAnimation.color].reverse(); // Stored as RGB, but animated colors are stored as BGR, so sizzle.
    this.geosetId = geosetAnimation.geosetId;
  }

  /**
   * @param {Float32Array} out
   * @param {ModelInstance} instance
   * @return {number}
   */
  getAlpha(out, instance) {
    // I don't quite understand how the static alpha is used. Weird rules.
    // For now hardcode it to 1 if there is no animation.
    return this.getFloatValue(out, 'KGAO', instance, 1);
  }

  /**
   * @param {vec3} out
   * @param {ModelInstance} instance
   * @return {vec3}
   */
  getColor(out, instance) {
    return this.getVector3Value(out, 'KGAC', instance, this.color);
  }

  /**
   * @param {number} sequence
   * @return {boolean}
   */
  isAlphaVariant(sequence) {
    return this.isVariant('KGAO', sequence);
  }

  /**
   * @param {number} sequence
   * @return {boolean}
   */
  isColorVariant(sequence) {
    return this.isVariant('KGAC', sequence);
  }
}
