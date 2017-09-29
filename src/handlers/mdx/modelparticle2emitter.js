import MdxSdContainer from "./sd";

/**
 * @constructor
 * @param {MdxModel} model
 * @param {MdxParserParticle2Emitter} emitter
 */
function MdxModelParticle2Emitter(model, emitter) {
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
        let color = colors[i];

        this.colors[i] = new Uint8Array([Math.min(color[0], 1) * 255, Math.min(color[1], 1) * 255, Math.min(color[2], 1) * 255, alpha[i]]);
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

    this.sd = new MdxSdContainer(model, emitter.tracks);

    this.dimensions = [emitter.columns, emitter.rows];

    this.selectFilterMode(emitter.filterMode);
}

MdxModelParticle2Emitter.prototype = {
    selectFilterMode(filterMode) {
        let gl = this.model.env.gl,
            blendSrc,
            blendDst;

        switch (filterMode) {
            // Blend
            case 0:
                blendSrc = gl.SRC_ALPHA;
                blendDst = gl.ONE_MINUS_SRC_ALPHA;
                break;
                // Additive
            case 1:
                blendSrc = gl.SRC_ALPHA;
                blendDst = gl.ONE;
                break;
                // Modulate
            case 2:
                blendSrc = gl.ZERO;
                blendDst = gl.SRC_COLOR;
                break;
                // Modulate 2X
            case 3:
                blendSrc = gl.DEST_COLOR;
                blendDst = gl.SRC_COLOR;
                break;
                // Add Alpha
            case 4:
                blendSrc = gl.SRC_ALPHA;
                blendDst = gl.ONE;
                break;
        }

        this.blendSrc = blendSrc;
        this.blendDst = blendDst;
    }
};

export default MdxModelParticle2Emitter;
