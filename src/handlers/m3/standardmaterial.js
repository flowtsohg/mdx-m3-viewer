M3.StandardMaterial = function (material, model, textureMap, gl) {
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
        new M3.Layer(material.diffuseM3.Layer, "diffuse", 2, model, textureMap, gl),
        new M3.Layer(material.decalM3.Layer, "decal", 2, model, textureMap, gl),
        new M3.Layer(material.specularM3.Layer, "specular", 2, model, textureMap, gl),
        new M3.Layer(material.glossM3.Layer, "gloss", 2, model, textureMap, gl),
        new M3.Layer(material.emissiveM3.Layer, "emissive", material.emisBlendType, model, textureMap, gl),
        new M3.Layer(material.emissive2M3.Layer, "emissive2", material.emisMode, model, textureMap, gl),
        new M3.Layer(material.evioM3.Layer, "evio", 2, model, textureMap, gl),
        new M3.Layer(material.evioMaskM3.Layer, "evioMask", 2, model, textureMap, gl),
        new M3.Layer(material.alphaMaskM3.Layer, "alphaMask", 2, model, textureMap, gl),
        new M3.Layer(material.alphaMask2M3.Layer, "alphaMask2", 2, model, textureMap, gl),
        new M3.Layer(material.normalM3.Layer, "normal", 2, model, textureMap, gl),
        new M3.Layer(material.heightM3.Layer, "heightMap", 2, model, textureMap, gl),
        new M3.Layer(material.lightMapM3.Layer, "lightMap", 2, model, textureMap, gl),
        new M3.Layer(material.ambientOcclusionM3.Layer, "ao", 2, model, textureMap, gl)
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
