/**
 * @constructor
 * @param {MdxModelEventObject} modelObject
 */
function MdxEventObjectSpnEmitter(modelObject) {
    this.type = "SPN";
    this.modelObject = modelObject;

    this.active = [];
    this.inactive = [];
}

MdxEventObjectSpnEmitter.prototype = {
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
    },

    update: MdxParticleEmitter.prototype.update,
    updateData: MdxParticleEmitter.prototype.updateData,
    render: MdxParticleEmitter.prototype.render
};
