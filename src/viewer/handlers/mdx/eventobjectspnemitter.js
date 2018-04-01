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
