import Geoset from './geoset';
import Layer from './layer';
import Material from './material';

/**
 * An MDX batch.
 */
export default class Batch {
  index: number;
  geoset: Geoset;
  layer: Layer;
  material: Material | null;
  /**
   * If this is a TFT batch, determines if it's an extended batch.
   * If this is an HD batch, determines if it has skin or vertex groups.
   */
  isExtendedOrUsingSkin: boolean;
  isHd: boolean;

  constructor(index: number, geoset: Geoset, layerOrMaterial: Layer | Material, isExtendedOrUsingSkin: boolean, isHd: boolean) {
    let material;
    let layer;

    if (isHd) {
      material = <Material>layerOrMaterial;
      layer = material.layers[0];
    } else {
      material = null;
      layer = <Layer>layerOrMaterial;
    }

    this.index = index;
    this.geoset = geoset;
    this.isExtendedOrUsingSkin = isExtendedOrUsingSkin;
    this.isHd = isHd;
    this.layer = layer;
    this.material = material;
  }
}
