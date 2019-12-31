import MdxModel from './model';
import Batch from './batch';
import ReforgedBatch from './reforgedbatch';
import BatchGroup from './batchgroup';
import ReforgedBatchGroup from './reforgedbatchgroup';

/// TO BE IMPLEMENTED.
function isBatchSimple(batch: Batch | ReforgedBatch) {
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
