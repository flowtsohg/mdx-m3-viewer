import TexturedModelView from '../../texturedmodelview';
import ParticleEmitter from './particleemitter';
import ParticleEmitter2 from './particleemitter2';
import RibbonEmitter from './ribbonemitter';
import EventObjectSpnEmitter from './eventobjectspnemitter';
import EventObjectSplEmitter from './eventobjectsplemitter';
import EventObjectUbrEmitter from './eventobjectubremitter';
import EventObjectSndEmitter from './eventobjectsndemitter';

export default class ModelView extends TexturedModelView {
    createSceneData() {
        let model = this.model,
            data = super.createSceneData(),
            particleEmitters = [],
            particleEmitters2 = [],
            ribbonEmitters = [],
            eventObjectEmitters = [];

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
            eventObjectEmitters
        };
    }

    update(scene) {
        let data = super.update(scene);

        if (data) {
            for (let emitter of data.particleEmitters) {
                emitter.update();
            }

            for (let emitter of data.particleEmitters2) {
                emitter.update();
            }

            for (let emitter of data.ribbonEmitters) {
                emitter.update();
            }

            for (let emitter of data.eventObjectEmitters) {
                emitter.update();
            }
        }
    }
};
