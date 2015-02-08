var filterModeToRenderOrder = {
    0: 0, // Opaque
    1: 1, // 1bit Alpha
    2: 2, // 8bit Alpha
    3: 3, // Additive
    4: 3, // Add Alpha (according to Magos)
    5: 3, // Modulate
    6: 3  // Modulate 2X
};

function Layer(layer, geosetId, model) {
    this.filterMode = (layer.filterMode > 6) ? 0 : layer.filterMode;
    this.twoSided = layer.twoSided;
    this.noDepthTest = layer.noDepthTest;
    this.noDepthSet = layer.noDepthSet;
    this.textureId = layer.textureId;
    this.textureAnimationId = layer.textureAnimationId;
    this.coordId = layer.coordId;
    this.alpha = layer.alpha;
    this.renderOrder = filterModeToRenderOrder[layer.filterMode];
    this.geosetId = geosetId;
    this.sd = parseSDTracks(layer.tracks, model);
}

Layer.prototype = {
    setMaterial: function (shader, ctx) {
        var filterMode = this.filterMode;

        ctx.uniform1f(shader.variables.u_alphaTest, 0);

        if (filterMode === 1) {
            ctx.depthMask(1);
            ctx.disable(ctx.BLEND);
            ctx.uniform1f(shader.variables.u_alphaTest, 1);
        } else if (filterMode === 2) {
            ctx.depthMask(0);
            ctx.enable(ctx.BLEND);
            ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
        } else if (filterMode === 3) {
            ctx.enable(ctx.BLEND);
            ctx.depthMask(0);
            ctx.blendFunc(ctx.ONE, ctx.ONE);
        } else if (filterMode === 4) {
            ctx.depthMask(0);
            ctx.enable(ctx.BLEND);
            ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE);
        } else if (filterMode === 5) {
            ctx.depthMask(0);
            ctx.enable(ctx.BLEND);
            ctx.blendFunc(ctx.ZERO, ctx.SRC_COLOR);
        } else if (filterMode === 6) {
            ctx.depthMask(0);
            ctx.enable(ctx.BLEND);
            ctx.blendFunc(ctx.DST_COLOR, ctx.SRC_COLOR);
        } else {
            ctx.depthMask(1);
            ctx.disable(ctx.BLEND);
        }

        if (this.twoSided) {
            ctx.disable(ctx.CULL_FACE);
        } else {
            ctx.enable(ctx.CULL_FACE);
        }
        
        if (this.noDepthTest) {
            ctx.disable(ctx.DEPTH_TEST);
        } else {
            ctx.enable(ctx.DEPTH_TEST);
        }
        
        if (this.noDepthSet) {
            ctx.depthMask(0);
        }
    },

    shouldRender: function (sequence, frame, counter) {
        return getSDValue(sequence, frame, counter, this.sd.alpha, 1) > 0.75;
    }
};