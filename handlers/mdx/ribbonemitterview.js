/**
 * @constructor
 * @param {MdxInstance} instance
 * @param {MdxRibbonEmitter} emitter
 */
function MdxRibbonEmitterView(instance, emitter) {
    this.instance = instance;
    this.emitter = emitter;
    this.currentEmission = 0;
    this.lastEmit = null;
    this.currentRibbon = -1;
    this.ribbonCount = 0;
}

MdxRibbonEmitterView.prototype = {
    update() {
        if (this.shouldRender()) {
            let emitter = this.emitter;

            this.currentEmission += emitter.emissionRate * this.instance.env.frameTime * 0.001;
            
            if (this.currentEmission >= 1) {
                for (let i = 0, l = Math.floor(this.currentEmission) ; i < l; i++, this.currentEmission--) {
                    this.lastEmit = emitter.emit(this);
                }
            }
        }
    },

    shouldRender() {
        return this.emitter.shouldRender(this.instance);
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
