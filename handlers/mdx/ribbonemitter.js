/**
 * @constructor
 * @param {MdxModel} model
 * @param {MdxParserRibbonEmitter} emitter
 */
function MdxRibbonEmitter(model, emitter) {
    this.model = model;

    this.active = [];
    this.inactive = [];

    this.buffer = new ResizeableBuffer(model.gl);

    this.cellWidth = 1 / this.columns;
    this.cellHeight = 1 / this.rows;

    this.layers = model.materials[this.materialId];

    this.sd = new MdxSdContainer(model, emitter.tracks);

    // Avoid heap allocations
    this.colorVec = vec3.create();
    this.modifierVec = vec4.create();
    this.uvoffsetVec = vec3.create();
    this.defaultUvoffsetVec = vec3.fromValues(0, 0, 0);

    this.bytesPerEmit = 4 * 30;
}

MdxRibbonEmitter.prototype = {
    emit(emitterView) {
        this.buffer.grow((this.active.length + 1) + this.bytesPerEmit);

        let inactive = this.inactive,
            object;

        if (inactive.length) {
            object = inactive.pop();
        } else {
            object = new MdxRibbon(emitterView);
        }

        object.reset(emitterView);

        emitterView.emissions += 1;

        // Don't actually add this emit if it's the first one, or the last one is dead
        if (emitterView.lastEmit && emitterView.lastEmit.health > 0) {
            this.active.push(object);
        }
            
        return object;
    },

    update(scene) {
        let active = this.active,
            inactive = this.inactive;

        if (active.length > 0) {
            // First stage: remove dead particles.
            // The used particles array is a queue, dead particles will always come first.
            // As of the time of writing, the easiest and fastest way to implement a queue in Javascript is a normal array.
            // To add items, you push, to remove items, the array is reversed and you pop.
            // So the first stage reverses the array, and then keeps checking the last element for its health.
            // As long as we hit a dead particle, pop, and check the new last element.

            // Ready for pop mode
            active.reverse();

            let object = active[active.length - 1];
            while (object && object.health <= 0) {
                inactive.push(active.pop());

                object.emitterView.emissions -= 1;

                // Need to recalculate the length each time
                object = active[active.length - 1];
            }

            // Ready for push mode
            active.reverse()

            // Second stage: update the living particles.
            // All the dead particles were removed, so a simple loop is all that's required.
            for (let i = 0, l = active.length; i < l; i++) {
                active[i].update();
            }

            this.updateHW(scene);
        }
    },

    updateHW(scene) {
        /*
        let active = this.active;

        var data = this.buffer.float32array;

        var scale, textureIndex, left, top, right, bottom, r, g, b, a, px, py, pz;
        var v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z, v4x, v4y, v4z;
        var lta, lba, rta, rba, rgb;

        for (let i = 0, l = active.length, index = 0; i < l; i++, index += 30) {
            let particle = active[i],
                nodeScale = particle.nodeScale;

            position = particle.worldLocation;
            scale = particle.scale;
            textureIndex = particle.index;
            left = textureIndex % columns;
            top = Math.floor(textureIndex / columns);
            right = left + 1;
            bottom = top + 1;
            color = particle.color;
            r = Math.floor(color[0]);
            g = Math.floor(color[1]);
            b = Math.floor(color[2]);
            a = Math.floor(color[3]);
            px = position[0];
            py = position[1];
            pz = position[2];

            lta = encodeFloat3(left, top, a);
            lba = encodeFloat3(left, bottom, a);
            rta = encodeFloat3(right, top, a);
            rba = encodeFloat3(right, bottom, a);
            rgb = encodeFloat3(r, g, b);

            data[index + 0] = v1x;
            data[index + 1] = v1y;
            data[index + 2] = v1z;
            data[index + 3] = lta;
            data[index + 4] = rgb;

            data[index + 5] = v2x;
            data[index + 6] = v2y;
            data[index + 7] = v2z;
            data[index + 8] = lba;
            data[index + 9] = rgb;

            data[index + 10] = v3x;
            data[index + 11] = v3y;
            data[index + 12] = v3z;
            data[index + 13] = rba;
            data[index + 14] = rgb;

            data[index + 15] = v1x;
            data[index + 16] = v1y;
            data[index + 17] = v1z;
            data[index + 18] = lta;
            data[index + 19] = rgb;

            data[index + 20] = v3x;
            data[index + 21] = v3y;
            data[index + 22] = v3z;
            data[index + 23] = rba;
            data[index + 24] = rgb;

            data[index + 25] = v4x;
            data[index + 26] = v4y;
            data[index + 27] = v4z;
            data[index + 28] = rta;
            data[index + 29] = rgb;
        }
        */
    },

    render(sequence, frame, counter, textureMap, shader, viewer) {
        /*
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
        */
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
