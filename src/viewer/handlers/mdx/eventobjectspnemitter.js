import MdxSharedEmitter from './sharedemitter';
import MdxEventObjectSpn from './eventobjectspn';

export default class MdxEventObjectSpnEmitter extends MdxSharedEmitter {
    /**
     * @param {MdxModelEventObject} modelObject
     */
    constructor(modelObject) {
        super(modelObject);

        this.type = 'SPN';
    }

    fill(emitterView, scene) {
        let emission = emitterView.currentEmission;
        
        if (emission >= 1) {
            for (let i = 0, l = Math.floor(emission); i < l; i++ , emitterView.currentEmission--) {
                this.emit(emitterView);
            }
        }
    }

    emit(emitterView) {
        if (this.modelObject.ready) {
            let inactive = this.inactive,
                object;

            if (inactive.length) {
                object = inactive.pop();
            } else {
                object = new MdxEventObjectSpn(this);
            }

            object.reset(emitterView);

            this.active.push(object);
        }
    }
};
