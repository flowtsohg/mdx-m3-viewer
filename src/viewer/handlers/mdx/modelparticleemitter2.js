import GenericObject from './genericobject';
import emitterFilterMode from './emitterfiltermode';

export default class ParticleEmitter2 extends GenericObject {
    /**
     * @param {MdxModel} model
     * @param {MdxParserParticleEmitter2} emitter
     */
    constructor(model, emitter, pivotPoints, index) {
        super(model, emitter, pivotPoints, index);

        this.width = emitter.width;
        this.length = emitter.length;
        this.speed = emitter.speed;
        this.latitude = emitter.latitude;
        this.gravity = emitter.gravity;
        this.emissionRate = emitter.emissionRate;
        this.squirt = emitter.squirt;

        this.lifeSpan = emitter.lifeSpan;
        this.modelSpace = emitter.modelSpace;
        this.variation = emitter.variation;
        this.tailLength = emitter.tailLength;
        this.timeMiddle = emitter.timeMiddle;

        this.internalResource = model.textures[emitter.textureId]

        let headOrTail = emitter.headOrTail;

        this.head = (headOrTail === 0 || headOrTail === 2);
        this.tail = (headOrTail === 1 || headOrTail === 2);

        this.cellWidth = 1 / emitter.columns;
        this.cellHeight = 1 / emitter.rows;
        this.colors = [];

        let colors = emitter.segmentColors,
            alpha = emitter.segmentAlphas;
            
        for (let i = 0; i < 3; i++) {
            this.colors[i] = new Uint8Array([Math.min(colors[i][0], 1) * 255, Math.min(colors[i][1], 1) * 255, Math.min(colors[i][2], 1) * 255, alpha[i]]);
        }

        this.scaling = emitter.segmentScaling;

        this.intervals = [...emitter.headIntervals, ...emitter.tailIntervals];

        this.lineEmitter = emitter.flags & 0x20000;
        this.modelSpace = emitter.flags & 0x80000;
        this.xYQuad = emitter.flags & 0x100000;

        this.dimensions = [emitter.columns, emitter.rows];

        [this.blendSrc, this.blendDst] = emitterFilterMode(emitter.filterMode, this.model.env.gl);
    }
};
