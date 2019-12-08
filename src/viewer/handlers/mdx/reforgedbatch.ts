import Geoset from './geoset';
import Material from './material';

/**
 * An MDX Reforged batch.
 */
export default class ReforgedBatch {
  index: number;
  geoset: Geoset;
  material: Material;

  constructor(index: number, geoset: Geoset, material: Material) {
    this.index = index;
    this.geoset = geoset;
    this.material = material;
  }
}
