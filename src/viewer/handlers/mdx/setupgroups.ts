import MdxModel from './model';
import Batch from './batch';
import BatchGroup from './batchgroup';
import EmitterGroup from './emittergroup';
import GenericObject from './genericobject';
import ParticleEmitter2Object from './particleemitter2object';
import RibbonEmitterObject from './ribbonemitterobject';
import EventObjectEmitterObject from './eventobjectemitterobject';

function getPrio(object: Batch | ParticleEmitter2Object | RibbonEmitterObject | EventObjectEmitterObject) {
  if (object instanceof Batch || object instanceof RibbonEmitterObject) {
    return object.layer.priorityPlane;
  } else if (object instanceof ParticleEmitter2Object) {
    return object.priorityPlane;
  } else {
    return 0;
  }
}

function matchingGroup(group: BatchGroup | EmitterGroup, object: Batch | ParticleEmitter2Object | RibbonEmitterObject | EventObjectEmitterObject) {
  if (group instanceof BatchGroup) {
    return (object instanceof Batch) && (object.isExtended === group.isExtended) && (object.isHd === group.isHd);
  } else {
    // All of the emitter objects are generic objects.
    return (object instanceof GenericObject);
  }
}

function createMatchingGroup(model: MdxModel, object: Batch | ParticleEmitter2Object | RibbonEmitterObject | EventObjectEmitterObject) {
  if (object instanceof Batch) {
    return new BatchGroup(model, object.isExtended, object.isHd);
  } else {
    return new EmitterGroup(model);
  }
}

export default function setupGroups(model: MdxModel) {
  let opaqueBatches = [];
  let translucentBatches = [];

  for (let batch of model.batches) {
    if (batch.layer.filterMode < 2) {
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
      currentGroup = <BatchGroup>createMatchingGroup(model, object);

      opaqueGroups.push(currentGroup);
    }

    currentGroup.objects.push(object.index);
  }

  // Sort between all of the translucent batches and emitters based on their priority planes.
  // Event objects have no explicit priority planes, and default to 0.
  let objects = [...translucentBatches, ...model.eventObjects, ...model.particleEmitters2, ...model.ribbonEmitters].sort((a, b) => getPrio(a) - getPrio(b));

  currentGroup = null;

  for (let object of objects) {
    if (object instanceof Batch || object.geometryEmitterType !== -1) {
      if (!currentGroup || !matchingGroup(currentGroup, object)) {
        currentGroup = createMatchingGroup(model, object);

        translucentGroups.push(currentGroup);
      }

      currentGroup.objects.push(object.index);
    }
  }
}
