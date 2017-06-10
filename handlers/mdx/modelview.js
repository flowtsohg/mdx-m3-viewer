/**
 * @class
 * @classdesc An MDX model view.
 * @extends TexturedModelView
 * @memberOf Mdx
 * @param {MdxModel} model The model that this view belongs to.
 */
function MdxModelView(model) {
    TexturedModelView.call(this, model);

    /** @member {MdxParticleEmitter[]} */
    this.particleEmitters = [];

    /** @member {MdxParticleEmitter2[]} */
    this.particleEmitters2 = [];
}

MdxModelView.prototype = {
    modelReady() {
        let model = this.model,
            emitters;

        emitters = model.particleEmitters;
        for (let i = 0, l = emitters.length; i < l; i++) {
            this.particleEmitters[i] = new MdxParticleEmitter(this, emitters[i]);
        }

        emitters = model.particleEmitters2;
        for (let i = 0, l = emitters.length; i < l; i++) {
            this.particleEmitters2[i] = new MdxParticleEmitter2(this, emitters[i]);
        }

        ModelView.prototype.modelReady.call(this);
    },

    update() {
        let emitters;
        
        emitters = this.particleEmitters;
        for (let i = 0, l = emitters.length; i < l; i++) {
            emitters[i].update();
        }

        emitters = this.particleEmitters2;
        for (let i = 0, l = emitters.length; i < l; i++) {
            emitters[i].update();
        }

        ModelView.prototype.update.call(this);
    }
};

mix(MdxModelView.prototype, TexturedModelView.prototype);
