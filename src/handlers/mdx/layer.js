Mdx.Batch = function (layer, geoset) {
    this.layer = layer;
    this.geoset = geoset;
};

var filterModeToRenderOrder = {
    0: 0, // Opaque
    1: 1, // 1bit Alpha
    2: 2, // 8bit Alpha
    3: 3, // Additive
    4: 3, // Add Alpha (according to Magos)
    5: 3, // Modulate
    6: 3  // Modulate 2X
};

Mdx.Layer = function (layer, model, textureAnimations) {
    var filterMode = Math.min(layer.filterMode, 6);
    
    this.filterMode = filterMode;
    this.twoSided = layer.twoSided;
    this.noDepthTest = layer.noDepthTest;
    this.noDepthSet = layer.noDepthSet;
    this.textureId = layer.textureId;
    this.textureAnimationId = layer.textureAnimationId;
    this.coordId = layer.coordId;
    this.alpha = layer.alpha;
    this.renderOrder = filterModeToRenderOrder[filterMode];
    this.sd = new Mdx.SDContainer(layer.tracks, model);

    if (layer.textureAnimationId !== -1 && textureAnimations[layer.textureAnimationId]) {
        this.textureAnimation = textureAnimations[layer.textureAnimationId];
    }
};

Mdx.Layer.prototype = {
    bind: function (shader, ctx) {
        ctx.uniform1f(shader.variables.u_alphaTest, 0);

        switch (this.filterMode) {
            case 0:
                ctx.depthMask(1);
                ctx.disable(ctx.BLEND);
                break;
            case 1:
                ctx.depthMask(1);
                ctx.disable(ctx.BLEND);
                ctx.uniform1f(shader.variables.u_alphaTest, 1);
                break;
            case 2:
                ctx.depthMask(0);
                ctx.enable(ctx.BLEND);
                ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
                break;
            case 3:
                ctx.depthMask(0);
                ctx.enable(ctx.BLEND);
                ctx.blendFunc(ctx.ONE, ctx.ONE);
                break;
            case 4:
                ctx.depthMask(0);
                ctx.enable(ctx.BLEND);
                ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE);
                break;
            case 5:
                ctx.depthMask(0);
                ctx.enable(ctx.BLEND);
                ctx.blendFunc(ctx.ZERO, ctx.SRC_COLOR);
                break;
            case 6:
                ctx.depthMask(0);
                ctx.enable(ctx.BLEND);
                ctx.blendFunc(ctx.DST_COLOR, ctx.SRC_COLOR);
                break;
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

    unbind: function (shader, ctx) {
        ctx.uniform1f(shader.variables.u_alphaTest, 0);

        ctx.depthMask(1);
        ctx.disable(ctx.BLEND);
        ctx.enable(ctx.CULL_FACE);
        ctx.enable(ctx.DEPTH_TEST);
    },

    getAlpha: function (sequence, frame, counter) {
        return this.sd.getKMTA(sequence, frame, counter, this.alpha);
    },

    getTextureId: function (sequence, frame, counter) {
        return this.sd.getKMTF(sequence, frame, counter, this.textureId);
    }
};
