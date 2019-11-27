import Batch from './batch';
import BatchGroup from './batchgroup';
import ReforgedBatch from './reforgedbatch';
import ReforgedBatchGroup from './reforgedbatchgroup';
import EmitterGroup from './emittergroup';
import GenericObject from './genericobject';

/**
 * @param {Batch|ParticleEmitter2Object|RibbonEmitterObject} object
 * @return {number}
 */
function getPrio(object) {
  if (object.layer) {
    return object.layer.priorityPlane;
  } else {
    return object.priorityPlane;
  }
}

/**
 * @param {BatchGroup|ReforgedBatchGroup|EmitterGroup} group
 * @param {Batch|ReforgedBatch|ParticleEmitter2Object|RibbonEmitterObject|EventObjectEmitterObject} object
 * @return {boolean}
 */
function matchingGroup(group, object) {
  if (group instanceof BatchGroup) {
    return (object instanceof Batch) && (object.isExtended === group.isExtended);
  } else if (group instanceof ReforgedBatchGroup) {
    return (object instanceof ReforgedBatch) && (object.material.shader === group.shader);
  } else {
    // All of the emitter objects are generic objects.
    return (object instanceof GenericObject);
  }
}

/**
 * @param {Model} model
 * @param {Batch|ReforgedBatch|ParticleEmitter2Object|RibbonEmitterObject|EventObjectEmitterObject} object
 * @return {BatchGroup|ReforgedBatchGroup|EmitterGroup}
 */
function createMatchingGroup(model, object) {
  if (object instanceof Batch) {
    return new BatchGroup(model, object.isExtended);
  } else if (object instanceof ReforgedBatch) {
    return new ReforgedBatchGroup(model, object.material.shader);
  } else {
    return new EmitterGroup(model);
  }
}

/**
 * @param {Model} model
 */
export default function setupGroups(model) {
  let opaqueBatches = [];
  let translucentBatches = [];

  for (let batch of model.batches) {
    if (batch instanceof ReforgedBatch || batch.layer.filterMode < 2) {
      opaqueBatches.push(batch);
    } else {
      translucentBatches.push(batch);
    }
  }

  let opaqueGroups = model.opaqueGroups;
  let translucentGroups = model.translucentGroups;
  let currentGroup = null;

  for (let object of opaqueBatches) {
    if (!currentGroup || !matchingGroup(currentGroup, object)) {
      currentGroup = createMatchingGroup(model, object);

      opaqueGroups.push(currentGroup);
    }

    currentGroup.objects.push(object.index);
  }

  // Sort between all of the translucent batches and emitters that have priority planes.
  let sorted = [...translucentBatches, ...model.particleEmitters2, ...model.ribbonEmitters].sort((a, b) => getPrio(a) - getPrio(b));

  // Event objects have no priority planes, so they might as well always be last.
  let objects = [...sorted, ...model.eventObjects];

  currentGroup = null;

  for (let object of objects) {
    if (object instanceof Batch || object instanceof ReforgedBatch || object.geometryEmitterType !== -1) {
      if (!currentGroup || !matchingGroup(currentGroup, object)) {
        currentGroup = createMatchingGroup(model, object);

        translucentGroups.push(currentGroup);
      }

      currentGroup.objects.push(object.index);
    }
  }
}
