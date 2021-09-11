import Geoset from './geoset';
import Layer from './layer';
import Material from './material';

/**
 * The type of skinning a batch uses.
 * 
 * Vertex groups are used for SD batches with a range of 0-4 bones per vertex.
 * 
 * Extended vertex groups are used for SD batches with a range of 0-8 bones per vertex.
 * 
 * Skin is used for HD batches with a range of 0-4 bones per vertex.
 */
export enum SkinningType  {
  VertexGroups,
  ExtendedVertexGroups,
  Skin,
}

/**
 * An MDX batch.
 */
export class Batch {
  index: number;
  geoset: Geoset;
  layer: Layer;
  material: Material | null;
  skinningType: SkinningType;
  isHd: boolean;

  constructor(index: number, geoset: Geoset, layerOrMaterial: Layer | Material, skinningType: SkinningType, isHd: boolean) {
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
    this.skinningType = skinningType;
    this.isHd = isHd;
    this.layer = layer;
    this.material = material;
  }
}
