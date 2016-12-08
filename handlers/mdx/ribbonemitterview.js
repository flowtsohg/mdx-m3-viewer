function MdxRibbonEmitterView(instance, emitter) {
    this.instance = instance;
    this.emitter = emitter;
    this.currentEmission = 0;
    this.lastRibbon = null;
    this.activeRibbons = 0;
}

MdxRibbonEmitterView.prototype = {
    update(allowCreate) {
        /*
        if (allowCreate && this.shouldRender(instance)) {
            this.lastCreation += 1;

            var amount = this.emissionRate * viewer.frameTime * 0.001 * this.lastCreation;

            if (amount >= 1) {
                this.lastCreation = 0;

                for (i = 0; i < amount; i++) {
                    this.ribbons.push(new MdxRibbon(this, instance));
                }
            }
        }
        */

        if (allowCreate && this.shouldRender()) {
            let emitter = this.emitter;

            this.currentEmission += emitter.emissionRate * this.instance.model.env.frameTime * 0.001;

            if (this.currentEmission >= 1) {
                for (let i = 0, l = Math.floor(this.currentEmission); i < l; i++) {
                    this.lastRibbon = emitter.emit(this);

                    this.currentEmission -= 1;
                }
            }
        }
    },

    shouldRender() {
        return this.getVisibility(this.instance) > 0.75;
    },

    getHeightBelow() {
        return this.emitter.getHeightBelow(this.instance);
    },

    getHeightAbove() {
        return this.emitter.getHeightAbove(this.instance);
    },

    getTextureSlot() {
        return this.emitter.getTextureSlot(this.instance);
    },

    getColor() {
        return this.emitter.getColor(this.instance);
    },

    getAlpha() {
        return this.emitter.getAlpha(this.instance);
    },

    getVisibility() {
        return this.emitter.getVisibility(this.instance);
    }
};
