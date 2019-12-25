
import GltfModel from './model';
import GltfBatch from './batch';
import GltfBatchGroup from './batchgroup';

function matchingGroup(group: GltfBatchGroup, batch: GltfBatch) {
  return group.primitiveFlags === batch.primitive.flags && group.materialFlags === batch.material.flags;
}

export function setupGroups(model: GltfModel) {
  let batches = model.batches;
  let groups = model.groups;
  let currentGroup = null;

  for (let i = 0, l = batches.length; i < l; i++) {
    let batch = batches[i];

    if (!currentGroup || !matchingGroup(currentGroup, batch)) {
      currentGroup = new GltfBatchGroup(model, batch.primitive.flags, batch.material.flags);

      groups.push(currentGroup);
    }

    currentGroup.objects.push(i);
  }
}
