function MdxRibbonEmitterView(emitter, model, instance, ctx) {
    var i, l;
    var keys = Object.keys(emitter);

    for (i = keys.length; i--;) {
        this[keys[i]] = emitter[keys[i]];
    }

    var ribbons = Math.ceil(this.emissionRate * this.lifespan);

    this.emitter = emitter;
    this.model = model;
    this.textures = model.textures;

    this.maxRibbons = ribbons;
    this.lastCreation = 0;
    this.ribbons = [];

    if (!emitter.buffer) {
        emitter.data = new Float32Array(ribbons * 10);
        emitter.buffer = ctx.createBuffer();

        ctx.bindBuffer(ctx.ARRAY_BUFFER, emitter.buffer);
        ctx.bufferData(ctx.ARRAY_BUFFER, emitter.data, ctx.DYNAMIC_DRAW);
    }

    this.cellWidth = 1 / this.columns;
    this.cellHeight = 1 / this.rows;

    var groups = [[], [], [], []];
    var layers = model.materials[this.materialId];

    for (i = 0, l = layers.length; i < l; i++) {
        var layer = new MdxLayer(layers[i]);

        groups[layers[i].renderOrder].push(layer);
    }

    this.layers = groups[0].concat(groups[1]).concat(groups[2]).concat(groups[3]);

    this.node = instance.skeleton.nodes[this.node.index];
    this.sd = new MdxSdContainer(emitter.tracks, model);

    // Avoid heap allocations
    this.colorVec = vec3.create();
    this.modifierVec = vec4.create();
    this.uvoffsetVec = vec3.create();
    this.defaultUvoffsetVec = vec3.fromValues(0, 0, 0);
}

MdxRibbonEmitterView.prototype = {
    update(allowCreate, instance, viewer) {
        var i, l;

        for (i = 0, l = this.ribbons.length; i < l; i++) {
            this.ribbons[i].update(this, viewer);
        }

        while (this.ribbons.length > 0 && this.ribbons[0].health <= 0) {
            this.ribbons.shift();
        }

        if (allowCreate && this.shouldRender(instance)) {
            this.lastCreation += 1;

            var amount = this.emissionRate * viewer.frameTimeS * this.lastCreation;

            if (amount >= 1) {
                this.lastCreation = 0;

                for (i = 0; i < amount; i++) {
                    this.ribbons.push(new MdxRibbon(this, instance));
                }
            }
        }
    },

    render(instance, textureMap, shader, viewer) {
        var ctx = viewer.gl.ctx;
        var ribbons = this.ribbons.length;

        if (ribbons > 2) {
            ctx.bindBuffer(ctx.ARRAY_BUFFER, this.emitter.buffer);
            ctx.bufferSubData(ctx.ARRAY_BUFFER, 0, this.emitter.data);

            ctx.vertexAttribPointer(shader.variables.a_position, 3, ctx.FLOAT, false, 20, 0);
            ctx.vertexAttribPointer(shader.variables.a_uv, 2, ctx.FLOAT, false, 20, 12);

            var textureId, color, uvoffset, modifier = this.modifierVec;
            var layer, layers = this.layers;
            
            for (let i = 0, l = layers.length; i < l; i++) {
                layer = layers[i].layer;

                layer.bind(shader, ctx);

                textureId = layer.getTextureId(instance);

                this.model.bindTexture(this.textures[textureId], textureMap[this.model.texturePaths[textureId]], viewer);

                color = this.getColor(instance);
                uvoffset = this.defaultUvoffsetVec;

                modifier[0] = color[0];
                modifier[1] = color[1];
                modifier[2] = color[2];
                modifier[3] = this.getAlpha(instance);

                ctx.uniform4fv(shader.variables.u_modifier, modifier);

                if (layer.textureAnimationId !== -1 && this.model.textureAnimations) {
                    var textureAnimation = this.model.textureAnimations[layer.textureAnimationId];
                    // What is Z used for?
                    uvoffset = textureAnimation.getTranslation(instance);
                }

                ctx.uniform3fv(shader.variables.u_uv_offset, uvoffset);

                ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, ribbons * 2);

                layer.unbind(shader, ctx);
            }
        }
    },

    shouldRender(instance) {
        return this.getVisibility(instance) > 0.75;
    },

    getHeightBelow(instance) {
        return this.sd.getKRHBValue(instance, this.heightBelow);
    },

    getHeightAbove(instance) {
        return this.sd.getKRHAValue(instance, this.heightAbove);
    },

    getTextureSlot(instance) {
        return this.sd.getKRTXValue(instance, 0);
    },

    getColor(instance) {
        return this.sd.getKRCOValue(instance, this.color);
    },

    getAlpha(instance) {
        return this.sd.getKRALValue(instance, this.alpha);
    },

    getVisibility(instance) {
        return this.sd.getKRVSValue(instance, 1);
    }
};
