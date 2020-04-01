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
  isExtended: boolean;
  isHd: boolean;

  constructor(index: number, geoset: Geoset, layerOrMaterial: Layer | Material, isExtended: boolean, isHd: boolean) {
    let material = null;
    let layer = null;

    if (isHd) {
      material = <Material>layerOrMaterial;
      layer = material.layers[0];
    } else {
      layer = <Layer>layerOrMaterial;
    }

    this.index = index;
    this.geoset = geoset;
    this.isExtended = isExtended;
    this.isHd = isHd;
    this.layer = layer;
    this.material = material;
  }
}
