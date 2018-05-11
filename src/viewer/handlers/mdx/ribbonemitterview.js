export default class RibbonEmitterView {
    /**
     * @param {MdxInstance} instance
     * @param {MdxRibbonEmitter} emitter
     */
    constructor(instance, emitter) {
        this.instance = instance;
        this.emitter = emitter;
        this.currentEmission = 0;
        this.lastEmit = null;
        this.currentRibbon = -1;
        this.ribbonCount = 0;
    }

    update() {
        if (this.instance.allowParticleSpawn) {
            this.currentEmission += this.emitter.emissionRate * this.instance.model.viewer.frameTime * 0.001;
        }
    }

    getHeightBelow() {
        return this.emitter.getHeightBelow(this.instance);
    }

    getHeightAbove() {
        return this.emitter.getHeightAbove(this.instance);
    }

    getTextureSlot() {
        return this.emitter.getTextureSlot(this.instance);
    }

    getColor() {
        return this.emitter.getColor(this.instance);
    }

    getAlpha() {
        return this.emitter.getAlpha(this.instance);
    }

    getVisibility() {
        return this.emitter.getVisibility(this.instance);
    }
};
