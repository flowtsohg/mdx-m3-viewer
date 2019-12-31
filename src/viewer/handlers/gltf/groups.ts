import GltfModel from './model';
import { ALPHA_MODE_BLEND } from './material';
import GltfBatch from './batch';
import GltfBatchGroup from './batchgroup';
import { ALPHAMODE_OPAQUE, ALPHAMODE_MASK } from './flags';

function alphaModesCompatible(group: GltfBatchGroup, batch: GltfBatch) {
  let isGroupOpaque = !!(group.materialFlags & ALPHAMODE_OPAQUE || group.materialFlags & ALPHAMODE_MASK);
  let isBatchOpaque = !!(batch.material.flags & ALPHAMODE_OPAQUE || batch.material.flags & ALPHAMODE_MASK);

  return (isGroupOpaque && isBatchOpaque) || (!isGroupOpaque && !isBatchOpaque);
}

function matchingGroup(group: GltfBatchGroup, batch: GltfBatch) {
  return group.primitiveFlags === batch.primitive.flags && group.materialFlags === batch.material.flags && alphaModesCompatible(group, batch);
}

function getGroup(model: GltfModel, batch: GltfBatch) {
  let groups;

  if (batch.material.alphaMode === ALPHA_MODE_BLEND) {
    groups = model.translucentGroups;
  } else {
    groups = model.opaqueGroups;
  }

  for (let group of groups) {
    if (matchingGroup(group, batch)) {
      return group;
    }
  }

  let group = new GltfBatchGroup(model, batch);

  groups.push(group);

  return group;
}

export function setupGroups(model: GltfModel) {
  let batches = model.batches;

  for (let i = 0, l = batches.length; i < l; i++) {
    let group = getGroup(model, batches[i]);

    group.objects.push(i);
  }
}
