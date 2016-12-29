function MdxRibbonEmitter(emitter, model) {
    let gl = model.env.gl;

    mix(this, emitter);

    this.model = model;

    this.lastCreation = 0;
    this.ribbons = [];
    this.openSlots = [];
    this.activeSlots = [];
    this.currentSlot = 0;

    this.buffer = new ResizeableBuffer(gl);

    this.cellWidth = 1 / this.columns;
    this.cellHeight = 1 / this.rows;

    this.layers = model.materials[this.materialId];

    this.sd = new MdxSdContainer(emitter.tracks, model);

    // Avoid heap allocations
    this.colorVec = vec3.create();
    this.modifierVec = vec4.create();
    this.uvoffsetVec = vec3.create();
    this.defaultUvoffsetVec = vec3.fromValues(0, 0, 0);
}

MdxRibbonEmitter.prototype = {
    emit(view) {
        let ribbons = this.ribbons,
            openSlots = this.openSlots,
            activeSlots = this.activeSlots;

        if (this.buffer.float32array.length < (activeSlots.length + this.particlesPerEmit) * 30) {
            this.buffer.resize((activeSlots.length + this.particlesPerEmit) * this.bytesPerParticle);
        }

        if (openSlots.length) {
            const slot = openSlots.pop();

            ribbons[slot].reset(this, view, slot);
            activeSlots.push(slot);

            return ribbons[slot];
        } else {
            const ribbon = new MdxRibbon();

            ribbon.reset(this, view, this.currentSlot);
            activeSlots.push(this.currentSlot);

            ribbons[this.currentSlot] = ribbon;
            this.currentSlot += 1;

            return ribbon;
        }
    },

    update() {
        var ribbons = this.ribbons;
        var openSlots = this.openSlots;
        var activeSlots = this.activeSlots;
        var activeParticlesCount = activeSlots.length;
        var i, l;
        var ribbon;

        if (activeSlots.length > 0) {
            // First stage: remove dead particles.
            // The used particles array is a queue, dead particles will always come first.
            // As of the time of writing, the easiest and fastest way to implement a queue in Javascript is a normal array.
            // To add items, you push, to remove items, the array is reversed and you pop.
            // So the first stage reverses the array, and then keeps checking the last element for its health.
            // As long as we hit a dead particle, pop, and check the new last element.

            // Ready for pop mode
            activeSlots.reverse();

            ribbon = ribbons[activeSlots[activeSlots.length - 1]];
            while (ribbon && ribbon.health <= 0) {
                activeSlots.pop();
                this.openSlots.push(ribbon.slot);

                ribbon.kill();

                // Need to recalculate the length each time
                ribbon = ribbons[activeSlots[activeSlots.length - 1]];
            }

            // Ready for push mode
            activeSlots.reverse()

            // Second stage: update the living ribbons.
            // All the dead ribbons were removed, so a simple loop is all that's required.
            for (i = 0, l = activeSlots.length; i < l; i++) {
                ribbons[activeSlots[i]].update(this);
            }

            //this.updateHW();
        }
    },

    render(sequence, frame, counter, textureMap, shader, viewer) {
        var ctx = viewer.gl.ctx;
        var i, l;
        var ribbonCount = Math.min(this.ribbons.length, this.maxRibbons);

        if (ribbonCount > 2) {
            var textureSlot = this.getTextureSlot(sequence, frame, counter);
            //var uvOffsetX = (textureSlot % this.columns) / this.columns;
            var uvOffsetY = Math.floor(textureSlot / this.rows) / this.rows;
            var uvFactor = 1 / ribbonCount * this.cellWidth;
            var top = uvOffsetY;
            var bottom = uvOffsetY + this.cellHeight;
            var data = this.emitter.data;
            var index, ribbon, left, right, v1, v2;
            var quads = 0;

            let ribbons = this.ribbons;

            for (i = 0; i < ribbonCount; i++) {
                let ribbon = ribbons[i],
                    lastRibbon = ribbon.lastRibbon;

                // Only add a quad if this isn't the first ribbon of a chain
                if (lastRibbon) {
                    let index = quads * 20,
                        left = (ribbonCount - i) * uvFactor,
                        right = left - uvFactor,
                        v1 = ribbon.p2,
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
            }

            ctx.bindBuffer(ctx.ARRAY_BUFFER, this.emitter.buffer);
            ctx.bufferSubData(ctx.ARRAY_BUFFER, 0, this.emitter.data);

            ctx.vertexAttribPointer(shader.variables.a_position, 3, ctx.FLOAT, false, 20, 0);
            ctx.vertexAttribPointer(shader.variables.a_uv, 2, ctx.FLOAT, false, 20, 12);

            var textureId, color, uvoffset, modifier = this.modifierVec;
            var layer, layers = this.layers;
            
            for (i = 0, l = layers.length; i < l; i++) {
                layer = layers[i].layer;

                layer.bind(shader, ctx);

                textureId = layer.getTextureId(sequence, frame, counter);

                this.model.bindTexture(this.textures[textureId], textureMap[this.model.texturePaths[textureId]], viewer);

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

                ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, ribbonCount * 2);

                layer.unbind(shader, ctx);
            }
        }
    },

    shouldRender(instance) {
        return this.getVisibility(instance) > 0.75;
    },

    getHeightBelow(instance) {
        return this.sd.getValue("KRHB", instance, this.heightBelow);
    },

    getHeightAbove(instance) {
        return this.sd.getValue("KRHA", instance, this.heightAbove);
    },

    getTextureSlot(instance) {
        return this.sd.getValue("KRTX", instance, 0);
    },

    getColor(instance) {
        return this.sd.getValue("KRCO", instance, this.color);
    },

    getAlpha(instance) {
        return this.sd.getValue("KRAL", instance, this.alpha);
    },

    getVisibility(instance) {
        return this.sd.getValue("KRVS", instance, 1);
    }
};
