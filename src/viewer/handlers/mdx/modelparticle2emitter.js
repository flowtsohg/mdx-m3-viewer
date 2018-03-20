import MdxSdContainer from './sd';
import emitterFilterMode from './emitterfiltermode';

export default class MdxModelParticle2Emitter {
    /**
     * @param {MdxModel} model
     * @param {MdxParserParticle2Emitter} emitter
     */
    constructor(model, emitter) {
        this.model = model;

        this.width = emitter.width;
        this.length = emitter.length;
        this.speed = emitter.speed;
        this.latitude = emitter.latitude;
        this.gravity = emitter.gravity;
        this.emissionRate = emitter.emissionRate;
        this.squirt = emitter.squirt;

        this.lifespan = emitter.lifespan;
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
            alpha = emitter.segmentAlpha;

        for (let i = 0; i < 3; i++) {
            this.colors[i] = new Uint8Array([Math.min(colors[i * 3], 1) * 255, Math.min(colors[i * 3 + 1], 1) * 255, Math.min(colors[i * 3 + 2], 1) * 255, alpha[i]]);
        }

        this.scaling = emitter.segmentScaling;

        this.intervals = [
            emitter.headInterval,
            emitter.tailInterval,
            emitter.headDecayInterval,
            emitter.tailDecayInterval
        ];

        let node = model.nodes[emitter.node.index];

        this.node = node;

        this.xYQuad = node.xYQuad;
        this.modelSpace = node.modelSpace;
        this.lineEmitter = node.lineEmitter;
        
        this.sd = new MdxSdContainer(model, emitter.tracks);

        this.dimensions = [emitter.columns, emitter.rows];

        [this.blendSrc, this.blendDst] = emitterFilterMode(emitter.filterMode, this.model.env.gl);
    }
};
