import MdxSharedEmitter from './sharedemitter';
import MdxParticle from './particle';

export default class MdxParticleEmitter extends MdxSharedEmitter {
    fill(emitterView, scene) {
        let emission = emitterView.currentEmission;

        if (emission >= 1) {
            for (let i = 0, l = Math.floor(emission); i < l; i++ , emitterView.currentEmission--) {
                this.emit(emitterView);
            }
        }
    }

    emit(emitterView) {
        let inactive = this.inactive,
            object;

        if (inactive.length) {
            object = inactive.pop();
        } else {
            object = new MdxParticle(this);
        }

        object.reset(emitterView);

        this.active.push(object);
    }
};
