import Geoset from './geoset';
import Layer from './layer';

/**
 * An MDX batch.
 */
export default class Batch {
  index: number;
  geoset: Geoset;
  layer: Layer;
  isExtended: boolean;

  constructor(index: number, geoset: Geoset, layer: Layer, isExtended: boolean) {
    this.index = index;
    this.geoset = geoset;
    this.layer = layer;
    this.isExtended = isExtended;
  }
}
