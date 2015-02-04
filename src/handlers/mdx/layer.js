var filterModeToRenderOrder = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 3,
    5: 3,
    6: 3
};

var layerFilterTypes = [
    [0, 0, 0],
    [1, 0, 0],
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
    [0, 0, 1],
    [0, 0, 1]
];

function Layer(layer, geosetId, model) {
    this.filterMode = (layer.filterMode > 6) ? 0 : layer.filterMode;
    this.twoSided = layer.twoSided;
    this.textureId = layer.textureId;
    this.textureAnimationId = layer.textureAnimationId;
    this.coordId = layer.coordId;
    this.alpha = layer.alpha;
    this.renderOrder = filterModeToRenderOrder[layer.filterMode] || 0;
    this.geosetId = geosetId;
    this.sd = parseSDTracks(layer.tracks, model);
}

Layer.prototype = {
    setMaterial: function (shader, ctx) {
        var filterMode = this.filterMode;

        ctx.uniform3fv(shader.variables.u_type, layerFilterTypes[filterMode]);

        if (filterMode === 1) {
            ctx.depthMask(1);
            ctx.disable(ctx.BLEND);
        } else if (filterMode === 2) {
            ctx.depthMask(0);
            ctx.enable(ctx.BLEND);
            ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
        } else if (filterMode === 3) {
            ctx.enable(ctx.BLEND);
            ctx.depthMask(0);
            ctx.blendFunc(ctx.SRC_COLOR, ctx.ONE);
        } else if (filterMode === 4) {
            ctx.depthMask(0);
            ctx.enable(ctx.BLEND);
            ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE);
        } else if (filterMode === 5 || filterMode === 6) {
            ctx.depthMask(0);
            ctx.enable(ctx.BLEND);
            ctx.blendFunc(ctx.SRC_ZERO, ctx.SRC_COLOR);
        } else {
            ctx.depthMask(1);
            ctx.disable(ctx.BLEND);
        }

        if (this.twoSided) {
            ctx.disable(ctx.CULL_FACE);
        } else {
            ctx.enable(ctx.CULL_FACE);
        }
    },

    shouldRender: function (sequence, frame, counter) {
        return getSDValue(sequence, frame, counter, this.sd.alpha, 1) > 0.75;
    }
};