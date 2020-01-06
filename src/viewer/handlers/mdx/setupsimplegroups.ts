import MdxModel from './model';
import Batch from './batch';
import ReforgedBatch from './reforgedbatch';
import BatchGroup from './batchgroup';
import ReforgedBatchGroup from './reforgedbatchgroup';

const alphaHeap = new Float32Array(1);

function isBatchSimple(batch: Batch | ReforgedBatch) {
  let geosetAnimation = batch.geoset.geosetAnimation;

  if (geosetAnimation) {
    geosetAnimation.getAlpha(alphaHeap, 0, 0, 0);

    if (alphaHeap[0] < 0.01) {
      return false;
    }
  }

  let layer;

  if (batch instanceof Batch) {
    layer = batch.layer;
  } else {
    layer = batch.material.layers[0];
  }

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
    let simpleGroup;

    if (group instanceof BatchGroup) {
      simpleGroup = new BatchGroup(model, group.isExtended);
    } else {
      simpleGroup = new ReforgedBatchGroup(model, group.shader);
    }

    for (let object of group.objects) {
      if (isBatchSimple(batches[object])) {
        simpleGroup.objects.push(object);
      }
    }

    simpleGroups.push(simpleGroup);
  }
}
