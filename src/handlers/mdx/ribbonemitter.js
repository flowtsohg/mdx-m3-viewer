Mdx.RibbonEmitter = function (emitter, model, instance, ctx) {
    var i, l;
    var keys = Object.keys(emitter);

    for (i = keys.length; i--;) {
        this[keys[i]] = emitter[keys[i]];
    }

    var ribbons = Math.ceil(this.emissionRate * this.lifespan);

    this.model = model;
    this.textures = model.textures;

    this.maxRibbons = ribbons;
    this.lastCreation = 0;
    this.ribbons = [];
    this.data = new Float32Array(ribbons  * 10);
    this.buffer = ctx.createBuffer();

    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, this.data, ctx.DYNAMIC_DRAW);

    this.cellWidth = 1 / this.columns;
    this.cellHeight = 1 / this.rows;

    var groups = [[], [], [], []];
    var layers = model.fakeMaterials[this.materialId];

    for (i = 0, l = layers.length; i < l; i++) {
        var layer = new Mdx.ShallowLayer(layers[i]);

        groups[layers[i].renderOrder].push(layer);
    }

    this.layers = groups[0].concat(groups[1]).concat(groups[2]).concat(groups[3]);

    this.node = instance.skeleton.nodes[this.node];
    this.sd = Mdx.parseSDTracks(emitter.tracks, model);

    // Avoid heap allocations
    this.colorVec = vec3.create();
    this.modifierVec = vec4.create();
    this.uvoffsetVec = vec3.create();
    this.defaultUvoffsetVec = vec3.fromValues(0, 0, 0);
};

Mdx.RibbonEmitter.prototype = {
    update: function (allowCreate, sequence, frame, counter, context) {
        var i, l;

        for (i = 0, l = this.ribbons.length; i < l; i++) {
            this.ribbons[i].update(this, context);
        }

        while (this.ribbons.length > 0 && this.ribbons[0].health <= 0) {
            this.ribbons.shift();
        }

        if (allowCreate && this.shouldRender(sequence, frame, counter)) {
            this.lastCreation += 1;

            var amount = this.emissionRate * (context.frameTime / 1000) * this.lastCreation;

            if (amount >= 1) {
                this.lastCreation = 0;

                for (i = 0; i < amount; i++) {
                    this.ribbons.push(new Mdx.Ribbon(this, sequence, frame, counter));
                }
            }
        }
    },

    render: function (sequence, frame, counter, textureMap, shader, context) {
        var ctx = context.gl.ctx;
        var i, l;
        var ribbons = Math.min(this.ribbons.length, this.maxRibbons);

        if (ribbons > 2) {
            var textureSlot = this.getTextureSlot(sequence, frame, counter);
            //var uvOffsetX = (textureSlot % this.columns) / this.columns;
            var uvOffsetY = Math.floor(textureSlot / this.rows) / this.rows;
            var uvFactor = 1 / ribbons * this.cellWidth;
            var top = uvOffsetY;
            var bottom = uvOffsetY + this.cellHeight;
            var data = this.data;
            var index, ribbon, left, right, v1, v2;

            for (i = 0, l = ribbons; i < l; i++) {
                index = i * 10;
                ribbon = this.ribbons[i];
                left = (ribbons - i) * uvFactor;
                right = left - uvFactor;
                v1 = ribbon.p2;
                v2 = ribbon.p1;

                data[index + 0] = v1[0];
                data[index + 1] = v1[1];
                data[index + 2] = v1[2];
                data[index + 3] = left;
                data[index + 4] = top;

                data[index + 5] = v2[0];
                data[index + 6] = v2[1];
                data[index + 7] = v2[2];
                data[index + 8] = right;
                data[index + 9] = bottom;
            }

            ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer);
            ctx.bufferSubData(ctx.ARRAY_BUFFER, 0, this.data);

            ctx.vertexAttribPointer(shader.variables.a_position, 3, ctx.FLOAT, false, 20, 0);
            ctx.vertexAttribPointer(shader.variables.a_uv, 2, ctx.FLOAT, false, 20, 12);

            var textureId, color, uvoffset, modifier = this.modifierVec;
            var layer, layers = this.layers;
            
            for (i = 0, l = layers.length; i < l; i++) {
                layer = layers[i].layer;

                layer.bind(shader, ctx);

                textureId = layer.getTextureId(sequence, frame, counter);

                this.model.bindTexture(this.textures[textureId], 0, textureMap, context);

                color = this.getColor(sequence, frame, counter);
                uvoffset = this.defaultUvoffsetVec;

                modifier[0] = color[0];
                modifier[1] = color[1];
                modifier[2] = color[2];
                modifier[3] = this.getAlpha(sequence, frame, counter);

                ctx.uniform4fv(shader.variables.u_modifier, modifier);

                if (layer.textureAnimationId !== -1 && this.model.textureAnimations) {
                    var textureAnimation = this.model.textureAnimations[layer.textureAnimationId];
                    // What is Z used for?
                    uvoffset = textureAnimation.getTranslation(sequence, frame, counter);
                }

                ctx.uniform3fv(shader.variables.u_uv_offset, uvoffset);

                ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, ribbons * 2);
                
                layer.unbind(shader, ctx);
            }
        }
    },

    shouldRender: function (sequence, frame, counter) {
        return this.getVisibility(sequence, frame, counter) > 0.75;
    },

    getHeightBelow: function (sequence, frame, counter) {
        if (this.sd.heightBelow) {
            return this.sd.heightBelow.getValue(sequence, frame, counter);
        } else {
            return this.heightBelow;
        }
    },

    getHeightAbove: function (sequence, frame, counter) {
        if (this.sd.heightAbove) {
            return this.sd.heightAbove.getValue(sequence, frame, counter);
        } else {
            return this.heightAbove;
        }
    },

    getTextureSlot: function (sequence, frame, counter) {
        if (this.sd.lifespan) {
            return this.sd.textureSlot.getValue(sequence, frame, counter);
        } else {
            return 0;
        }
    },

    getColor: function (sequence, frame, counter) {
        if (this.sd.color) {
            return this.sd.color.getValue(sequence, frame, counter);
        } else {
            return this.color;
        }
    },

    getAlpha: function (sequence, frame, counter) {
        if (this.sd.alpha) {
            return this.sd.alpha.getValue(sequence, frame, counter);
        } else {
            return this.alpha;
        }
    },

    getVisibility: function (sequence, frame, counter) {
        if (this.sd.visibility) {
            return this.sd.visibility.getValue(sequence, frame, counter);
        } else {
            return 1;
        }
    }
};
