import MdxModel from './model';
import Batch from './batch';
import BatchGroup from './batchgroup';

const alphaHeap = new Float32Array(1);

function isBatchSimple(batch: Batch) {
  let geosetAnimation = batch.geoset.geosetAnimation;

  if (geosetAnimation) {
    geosetAnimation.getAlpha(alphaHeap, 0, 0, 0);

    if (alphaHeap[0] < 0.01) {
      return false;
    }
  }

  let layer = batch.layer;

  layer.getAlpha(alphaHeap, 0, 0, 0);

  if (alphaHeap[0] < 0.01) {
    return false;
  }

  return true;
}

export default function setupSimpleGroups(model: MdxModel) {
  let batches = model.batches;
  let simpleGroups = model.simpleGroups;

  for (let group of model.opaqueGroups) {
    let simpleGroup = new BatchGroup(model, group.isExtended, group.isHd);

    for (let object of group.objects) {
      if (isBatchSimple(batches[object])) {
        simpleGroup.objects.push(object);
      }
    }

    simpleGroups.push(simpleGroup);
  }
}
