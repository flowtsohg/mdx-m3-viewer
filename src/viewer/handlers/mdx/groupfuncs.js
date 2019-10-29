import Batch from './batch';
import BatchGroup from './batchgroup';
import EmitterGroup from './emittergroup';

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
 * @param {BatchGroup|EmitterGroup} group
 * @param {Batch|ParticleEmitter2Object|RibbonEmitterObject|EventObjectEmitterObject} object
 * @return {boolean}
 */
function matchingGroup(group, object) {
  let a = group instanceof BatchGroup;
  let b = object instanceof Batch;

  return (a && b) || (!a && !b);
}

/**
 * @param {Model} model
 * @param {Batch|ParticleEmitter2Object|RibbonEmitterObject|EventObjectEmitterObject} object
 * @return {BatchGroup|EmitterGroup}
 */
function createMatchingGroup(model, object) {
  if (object instanceof Batch) {
    return new BatchGroup(model);
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
    if (batch.layer.filterMode < 2) {
      opaqueBatches.push(batch);
    } else {
      translucentBatches.push(batch);
    }
  }

  let currentGroup = new BatchGroup(model);
  let groups = [currentGroup];

  for (let object of opaqueBatches) {
    currentGroup.objects.push(object.index);
  }

  // Sort between all of the translucent batches and emitters that have priority planes.
  let sorted = [...translucentBatches, ...model.particleEmitters2, ...model.ribbonEmitters].sort((a, b) => getPrio(a) - getPrio(b));

  // Event objects have no priority planes, so they might as well always be last.
  let objects = [...sorted, ...model.eventObjects];

  currentGroup = null;

  for (let object of objects) {
    if (object instanceof Batch || object.geometryEmitterType !== -1) {
      if (!currentGroup || !matchingGroup(currentGroup, object)) {
        currentGroup = createMatchingGroup(model, object);

        groups.push(currentGroup);
      }

      currentGroup.objects.push(object.index);
    }
  }

  model.groups.push(...groups);
}
