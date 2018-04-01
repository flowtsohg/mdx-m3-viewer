import GenericObject from './genericobject';

export default class RibbonEmitter extends GenericObject {
    /**
     * @param {MdxModel} model
     * @param {MdxParserParticleEmitter} emitter
     */
    constructor(model, emitter, pivotPoints, index) {
        super(model, emitter, pivotPoints, index);

        this.layer = model.materials[emitter.materialId][0];
        this.texture = model.textures[this.layer.textureId];

        this.heightAbove = emitter.heightAbove;
        this.heightBelow = emitter.heightBelow;
        this.alpha = emitter.alpha;
        this.color = emitter.color;
        this.lifeSpan = emitter.lifeSpan;
        this.textureSlot = emitter.textureSlot;
        this.emissionRate = emitter.emissionRate;
        this.gravity = emitter.gravity;

        this.dimensions = [emitter.columns, emitter.rows];
        this.cellWidth = 1 / emitter.columns;
        this.cellHeight = 1 / emitter.rows;
    }
};
