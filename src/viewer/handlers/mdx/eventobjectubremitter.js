import ResizeableBuffer from '../../gl/resizeablebuffer';
import MdxSharedGeometryEmitter from './sharedgeometryemitter';
import MdxEventObjectUbr from './eventobjectubr';

export default class MdxEventObjectUbrEmitter extends MdxSharedGeometryEmitter {
    /**
     * @param {MdxModelEventObject} modelObject
     */
    constructor(modelObject) {
        super(modelObject);
        
        this.type = 'UBR';
        this.buffer = new ResizeableBuffer(modelObject.model.env.gl);
        this.bytesPerEmit = 4 * 30;
    }

    emit(emitterView) {
        if (this.modelObject.ready) {
            let inactive = this.inactive,
                object;

            if (inactive.length) {
                object = inactive.pop();
            } else {
                this.buffer.grow((this.active.length + 1) * this.bytesPerEmit);
                object = new MdxEventObjectUbr(this);
            }

            object.reset(emitterView);

            this.active.push(object);
        }
    }
};
