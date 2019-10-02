import ModelViewData from '../../modelviewdata';
import ParticleEmitter from './particleemitter';
import ParticleEmitter2 from './particleemitter2';
import RibbonEmitter from './ribbonemitter';
import EventObjectSpnEmitter from './eventobjectspnemitter';
import EventObjectSplEmitter from './eventobjectsplemitter';
import EventObjectUbrEmitter from './eventobjectubremitter';
import EventObjectSndEmitter from './eventobjectsndemitter';
import Batch from './batch';
import BatchGroup from './batchgroup';
import EmitterGroup from './emittergroup';

function getPrio(object) {
  if (object.layer) {
    return object.layer.priorityPlane;
  } else if (object.modelObject) {
    // Not all emitters have priority planes.
    return object.modelObject.priorityPlane || 0;
  }
}

function matchingGroup(group, object) {
  let a = group instanceof BatchGroup;
  let b = object instanceof Batch;

  return (a && b) || (!a && !b);
}

function createMatchingGroup(object, modelView) {
  if (object instanceof Batch) {
    return new BatchGroup(modelView);
  } else {
    return new EmitterGroup(modelView);
  }
}

/**
 *
 */
export default class MdxModelViewData extends ModelViewData {
  /**
   * @param {ModelView} modelView
   * @param {Scene} scene
   */
  constructor(modelView, scene) {
    super(modelView, scene);

    let model = modelView.model;
    let particleEmitters = [];
    let particleEmitters2 = [];
    let ribbonEmitters = [];
    let eventObjectEmitters = [];

    for (let emitter of model.particleEmitters) {
      particleEmitters.push(new ParticleEmitter(this, emitter));
    }

    for (let emitter of model.particleEmitters2) {
      particleEmitters2.push(new ParticleEmitter2(this, emitter));
    }

    for (let emitter of model.ribbonEmitters) {
      ribbonEmitters.push(new RibbonEmitter(this, emitter));
    }

    for (let emitter of model.eventObjects) {
      let type = emitter.type;

      if (type === 'SPN') {
        eventObjectEmitters.push(new EventObjectSpnEmitter(this, emitter));
      } else if (type === 'SPL') {
        eventObjectEmitters.push(new EventObjectSplEmitter(this, emitter));
      } else if (type === 'UBR') {
        eventObjectEmitters.push(new EventObjectUbrEmitter(this, emitter));
      } else if (type === 'SND') {
        // Sound objects aren't tracked in any way, they are fire-and-forget emitters.
        // Therefore, they have no reason to store a reference back here.
        eventObjectEmitters.push(new EventObjectSndEmitter(emitter));
      }
    }

    let translucentThings = [...model.translucentBatches, ...particleEmitters2, ...eventObjectEmitters, ...ribbonEmitters];

    translucentThings.sort((a, b) => {
      return getPrio(a) - getPrio(b);
    });

    let translucentGroups = [];
    let currentGroup = null;

    for (let object of translucentThings) {
      // Sound emitters aren't rendered.
      if (!(object instanceof EventObjectSndEmitter)) {
        if (!currentGroup || !matchingGroup(currentGroup, object)) {
          currentGroup = createMatchingGroup(object, modelView);

          translucentGroups.push(currentGroup);
        }

        currentGroup.objects.push(object);
      }
    }

    this.particleEmitters = particleEmitters;
    this.particleEmitters2 = particleEmitters2;
    this.ribbonEmitters = ribbonEmitters;
    this.eventObjectEmitters = eventObjectEmitters;
    this.opaqueGroup = new BatchGroup(modelView, model.opaqueBatches);
    this.translucentGroups = translucentGroups;
  }

  /**
   * @param {ModelInstance} instance
   */
  renderEmitters(instance) {
    let particleEmitters = this.particleEmitters;
    let particleEmitters2 = this.particleEmitters2;
    let ribbonEmitters = this.ribbonEmitters;
    let eventObjectEmitters = this.eventObjectEmitters;
    let particleEmitterViews = instance.particleEmitters;
    let particleEmitter2Views = instance.particleEmitters2;
    let ribbonEmitterViews = instance.ribbonEmitters;
    let eventObjectEmitterViews = instance.eventObjectEmitters;

    for (let i = 0, l = particleEmitters.length; i < l; i++) {
      particleEmitters[i].fill(particleEmitterViews[i]);
    }

    for (let i = 0, l = particleEmitters2.length; i < l; i++) {
      particleEmitters2[i].fill(particleEmitter2Views[i]);
    }

    for (let i = 0, l = ribbonEmitters.length; i < l; i++) {
      ribbonEmitters[i].fill(ribbonEmitterViews[i]);
    }

    for (let i = 0, l = eventObjectEmitters.length; i < l; i++) {
      eventObjectEmitters[i].fill(eventObjectEmitterViews[i]);
    }
  }

  /**
   *
   */
  updateEmitters() {
    for (let emitter of this.particleEmitters) {
      emitter.update();

      this.particles += emitter.alive;
    }

    for (let emitter of this.particleEmitters2) {
      emitter.update();

      this.particles += emitter.alive;
    }

    for (let emitter of this.ribbonEmitters) {
      emitter.update();

      this.particles += emitter.alive;
    }

    for (let emitter of this.eventObjectEmitters) {
      emitter.update();

      this.particles += emitter.alive;
    }
  }
}
