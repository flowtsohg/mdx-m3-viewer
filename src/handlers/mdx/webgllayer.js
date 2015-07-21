Mdx.WebGLLayer = function (data, ctx) {
    this.ctx = ctx;

    this.filterMode = data[0];
    this.twoSided = data[1];
    this.noDepthTest = data[2];
    this.noDepthSet = data[3];
    this.textureId = data[4];
    this.coordId = data[5];
};

Mdx.WebGLLayer.prototype = {
    bind: function (shader) {
        var ctx = this.ctx;

        ctx.uniform1f(shader.variables.u_alphaTest, 0);

        switch (this.filterMode) {
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
            default:
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

    unbind: function (shader) {
        var ctx = this.ctx;

        ctx.uniform1f(shader.variables.u_alphaTest, 0);

        ctx.depthMask(1);
        ctx.disable(ctx.BLEND);
        ctx.enable(ctx.CULL_FACE);
        ctx.enable(ctx.DEPTH_TEST);
    }
};
