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
      particleEmitters.push(new ParticleEmitter(emitter));
    }

    for (let emitter of model.particleEmitters2) {
      particleEmitters2.push(new ParticleEmitter2(emitter));
    }

    for (let emitter of model.ribbonEmitters) {
      ribbonEmitters.push(new RibbonEmitter(emitter));
    }

    for (let emitter of model.eventObjects) {
      let type = emitter.type;

      if (type === 'SPN') {
        eventObjectEmitters.push(new EventObjectSpnEmitter(emitter));
      } else if (type === 'SPL') {
        eventObjectEmitters.push(new EventObjectSplEmitter(emitter));
      } else if (type === 'UBR') {
        eventObjectEmitters.push(new EventObjectUbrEmitter(emitter));
      } else if (type === 'SND') {
        eventObjectEmitters.push(new EventObjectSndEmitter(emitter));
      }
    }

    let translucentThings = [...model.translucentBatches, ...particleEmitters2, ...eventObjectEmitters, ...ribbonEmitters];

    let getPrio = (object) => {
      if (object.layer) {
        return object.layer.priorityPlane;
      } else if (object.modelObject) {
        return object.modelObject.priorityPlane;
      } else {
        console.log(object);
        throw 'asdasdsadsadsadsadsaad';
      }
    };

    translucentThings.sort((a, b) => {
      return getPrio(a) - getPrio(b);
    });

    let isNormalEmitter = (object) => {
      return object instanceof ParticleEmitter2 || object instanceof EventObjectSpnEmitter || object instanceof EventObjectSplEmitter || object instanceof EventObjectUbrEmitter;
    };

    let isRibbonEmitter = (object) => {
      return object instanceof RibbonEmitter;
    };

    let matchingGroup = (group, object) => {
      return (group instanceof BatchGroup && object instanceof Batch) ||
        (group instanceof EmitterGroup && group.isRibbons === false && isNormalEmitter(object)) ||
        (group instanceof EmitterGroup && group.isRibbons === true && isRibbonEmitter(object));
    };

    let createMatchingGroup = (object) => {
      if (object instanceof Batch) {
        return new BatchGroup(modelView);
      } else if (isNormalEmitter(object)) {
        return new EmitterGroup(modelView, false);
      } else if (isRibbonEmitter(object)) {
        return new EmitterGroup(modelView, true);
      }
    };

    let groups = [];
    let currentGroup = null;

    for (let object of translucentThings) {
      // Sound emitters aren't rendered.
      if (!(object instanceof EventObjectSndEmitter)) {
        if (!currentGroup || !matchingGroup(currentGroup, object)) {
          currentGroup = createMatchingGroup(object);

          groups.push(currentGroup);
        }

        currentGroup.objects.push(object);
      }
    }

    this.particleEmitters = particleEmitters;
    this.particleEmitters2 = particleEmitters2;
    this.ribbonEmitters = ribbonEmitters;
    this.eventObjectEmitters = eventObjectEmitters;
    this.groups = groups;
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

      // Sounds are not particles.
      if (emitter.type !== 'SND') {
        this.particles += emitter.alive;
      }
    }
  }
}
