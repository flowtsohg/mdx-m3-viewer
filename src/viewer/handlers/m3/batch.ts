import M3Region from './region';
import M3StandardMaterial from './standardmaterial';

/**
 * An M3 batch.
 */
export default class M3Batch {
  region: M3Region;
  material: M3StandardMaterial;

  constructor(region: M3Region, material: M3StandardMaterial) {
    this.region = region;
    this.material = material;
  }
}
