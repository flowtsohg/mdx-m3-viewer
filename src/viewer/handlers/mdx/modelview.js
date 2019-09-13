import TexturedModelView from '../../texturedmodelview';
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
 * An MDX model view.
 */
export default class ModelView extends TexturedModelView {
  /**
   * @param {Scene} scene
   * @return {Object}
   */
  createSceneData(scene) {
    let model = this.model;
    let data = super.createSceneData(scene);
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
        return new BatchGroup(this);
      } else if (isNormalEmitter(object)) {
        return new EmitterGroup(this, false);
      } else if (isRibbonEmitter(object)) {
        return new EmitterGroup(this, true);
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

    return {
      ...data,
      particleEmitters,
      particleEmitters2,
      ribbonEmitters,
      eventObjectEmitters,
      groups,
    };
  }

  /**
   * @param {Scene} scene
   */
  update(scene) {
    let data = super.update(scene);

    if (data) {
      let batchCount = this.model.batches.length;
      let buckets = data.buckets;
      let renderedInstances = 0;
      let renderedParticles = 0;
      let renderedBuckets = 0;
      let renderCalls = 0;

      for (let i = 0, l = data.usedBuckets; i < l; i++) {
        renderedInstances += buckets[i].count;
        renderedBuckets += 1;
        renderCalls += batchCount;
      }

      for (let emitter of data.particleEmitters) {
        emitter.update();

        let particles = emitter.alive;

        if (particles) {
          renderedParticles += particles;
          renderCalls += 1;
        }
      }

      for (let emitter of data.particleEmitters2) {
        emitter.update();

        let particles = emitter.alive;

        if (particles) {
          renderedParticles += particles;
          renderCalls += 1;
        }
      }

      for (let emitter of data.ribbonEmitters) {
        emitter.update();

        let particles = emitter.alive;

        if (particles) {
          renderedParticles += particles;
          renderCalls += 1;
        }
      }

      for (let emitter of data.eventObjectEmitters) {
        emitter.update();

        // Sounds are not particles.
        if (emitter.type !== 'SND') {
          let particles = emitter.alive;

          if (particles) {
            renderedParticles += particles;
            renderCalls += 1;
          }
        }
      }

      this.renderedInstances = renderedInstances;
      this.renderedParticles = renderedParticles;
      this.renderedBuckets = renderedBuckets;
      this.renderCalls = renderCalls;
    }
  }
}
