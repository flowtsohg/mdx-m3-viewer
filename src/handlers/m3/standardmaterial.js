M3.StandardMaterial = function (model, material) {
    this.model = model;

    this.name = material.name;
    this.specialFlags = material.specialFlags;
    this.flags = material.flags;
    this.blendMode = material.blendMode;
    this.priority = material.priority;
    this.specularity = material.specularity;
    this.specMult = material.specMult;
    this.emisMult = material.emisMult;
    this.layerBlendType = material.layerBlendType;
    this.emisBlendType = material.emisBlendType;
    this.emisMode = material.emisMode;

    this.layers = [
        new M3.Layer(this, material.diffuseLayer, "diffuse", 2),
        new M3.Layer(this, material.decalLayer, "decal", 2),
        new M3.Layer(this, material.specularLayer, "specular", 2),
        new M3.Layer(this, material.glossLayer, "gloss", 2),
        new M3.Layer(this, material.emissiveLayer, "emissive", material.emisBlendType),
        new M3.Layer(this, material.emissive2Layer, "emissive2", material.emisMode),
        new M3.Layer(this, material.evioLayer, "evio", 2),
        new M3.Layer(this, material.evioMaskLayer, "evioMask", 2),
        new M3.Layer(this, material.alphaMaskLayer, "alphaMask", 2),
        new M3.Layer(this, material.alphaMask2Layer, "alphaMask2", 2),
        new M3.Layer(this, material.normalLayer, "normal", 2),
        new M3.Layer(this, material.heightLayer, "heightMap", 2),
        new M3.Layer(this, material.lightMapLayer, "lightMap", 2),
        new M3.Layer(this, material.ambientOcclusionLayer, "ao", 2)
    ];
};

M3.StandardMaterial.prototype = {
    bindCommon: function (ctx) {
        if (this.blendMode === 1) {
            ctx.enable(ctx.BLEND);
            ctx.blendFunc(ctx.ONE, ctx.ONE);
        } else if (this.blendMode === 2) {
            ctx.enable(ctx.BLEND);
            ctx.blendFunc(ctx.ONE, ctx.ONE);
        } else {
            ctx.disable(ctx.BLEND);
        }

        if (this.flags & 0x8) {
            ctx.disable(ctx.CULL_FACE);
        } else {
            ctx.enable(ctx.CULL_FACE);
        }
    },

    bind: function (sequence, frame, textureMap, shader, context) {
        var ctx = context.gl.ctx;

        this.bindCommon(ctx);

        ctx.uniform1f(shader.variables.u_specularity, this.specularity);
        ctx.uniform1f(shader.variables.u_specMult, this.specMult);
        ctx.uniform1f(shader.variables.u_emisMult, this.emisMult);
        ctx.uniform4fv(shader.variables.u_lightAmbient, [0.02, 0.02, 0.02, 0]);

        var layers = this.layers;

        layers[0].bind(1, sequence, frame, textureMap, shader, context);
        layers[1].bind(2, sequence, frame, textureMap, shader, context);
        layers[2].bind(3, sequence, frame, textureMap, shader, context);
        layers[4].bind(5, sequence, frame, textureMap, shader, context);
        layers[5].bind(6, sequence, frame, textureMap, shader, context);
        layers[10].bind(11, sequence, frame, textureMap, shader, context);
        layers[12].bind(13, sequence, frame, textureMap, shader, context);
    },

    unbind: function (shader, ctx) {
        ctx.disable(ctx.BLEND);
        ctx.enable(ctx.CULL_FACE);

        var layers = this.layers;

        layers[0].unbind(shader, ctx);
        layers[1].unbind(shader, ctx);
        layers[2].unbind(shader, ctx);
        layers[4].unbind(shader, ctx);
        layers[5].unbind(shader, ctx);
        layers[10].unbind(shader, ctx);
        layers[12].unbind(shader, ctx);
    },

    bindDiffuse: function (sequence, frame, textureMap, shader, context) {
        var ctx = context.gl.ctx;

        this.bindCommon(ctx);

        this.layers[0].bind(1, sequence, frame, textureMap, shader, context);
    },

    bindSpecular: function (sequence, frame, textureMap, shader, context) {
        var ctx = context.gl.ctx;

        this.bindCommon(ctx);

        ctx.uniform1f(shader.variables.u_specularity, this.specularity, context);
        ctx.uniform1f(shader.variables.u_specMult, this.specMult, context);

        this.layers[2].bind(3, sequence, frame, textureMap, shader, context);
    },

    bindNormalMap: function (sequence, frame, textureMap, shader, context) {
        var ctx = context.gl.ctx;

        this.bindCommon(ctx);

        this.layers[10].bind(11, sequence, frame, textureMap, shader, context);
    },

    bindEmissive: function (sequence, frame, textureMap, shader, context) {
        var ctx = context.gl.ctx;

        this.bindCommon(ctx);

        ctx.uniform1f(shader.variables.u_emisMult, this.emisMult);

        this.layers[4].bind(5, sequence, frame, textureMap, shader, context);
        this.layers[5].bind(6, sequence, frame, textureMap, shader, context);
    },

    bindDecal: function (sequence, frame, textureMap, shader, context) {
        var ctx = context.gl.ctx;

        this.bindCommon(ctx);

        this.layers[1].bind(2, sequence, frame, textureMap, shader, context);
    }
};
