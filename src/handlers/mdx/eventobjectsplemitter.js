import ResizeableBuffer from "../../gl/resizeablebuffer";
import MdxEventObjectSpl from "./eventobjectspl";
import MdxParticleEmitter from "./particleemitter";
import MdxParticle2Emitter from "./particle2emitter";

/**
 * @constructor
 * @param {MdxModelEventObject} modelObject
 */
function MdxEventObjectSplEmitter(modelObject) {
    this.type = "SPL";
    this.modelObject = modelObject;

    this.active = [];
    this.inactive = [];

    this.buffer = new ResizeableBuffer(modelObject.model.gl);
    this.bytesPerEmit = 4 * 30;
}

MdxEventObjectSplEmitter.prototype = {
    emit(emitterView) {
        if (this.modelObject.ready) {
            let inactive = this.inactive,
                object;

            if (inactive.length) {
                object = inactive.pop();
            } else {
                this.buffer.grow((this.active.length + 1) * this.bytesPerEmit);
                object = new MdxEventObjectSpl(this);
            }

            object.reset(emitterView);

            this.active.push(object);
        }
    },
    
    update: MdxParticleEmitter.prototype.update,
    updateData: MdxParticle2Emitter.prototype.updateData,
    render: MdxParticle2Emitter.prototype.render
};

export default MdxEventObjectSplEmitter;
