import TexturedModelView from '../../texturedmodelview';
import ParticleEmitter from './particleemitter';
import ParticleEmitter2 from './particleemitter2';
import RibbonEmitter from './ribbonemitter';
import EventObjectSpnEmitter from './eventobjectspnemitter';
import EventObjectSplEmitter from './eventobjectsplemitter';
import EventObjectUbrEmitter from './eventobjectubremitter';
import EventObjectSndEmitter from './eventobjectsndemitter';

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

    return {
      ...data,
      particleEmitters,
      particleEmitters2,
      ribbonEmitters,
      eventObjectEmitters,
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
