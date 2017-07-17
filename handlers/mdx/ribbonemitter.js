/**
 * @constructor
 * @param {MdxModel} model
 * @param {MdxParserRibbonEmitter} emitter
 */
function MdxRibbonEmitter(model, emitter) {
    let gl = model.gl,
        layer = model.materials[emitter.materialId][0];

    this.model = model;

    this.active = [];
    this.inactive = [];

    this.buffer = new ResizeableBuffer(gl);
    this.bytesPerEmit = 4 * 30;

    this.heightAbove = emitter.heightAbove;
    this.heightBelow = emitter.heightBelow;
    this.alpha = emitter.alpha;
    this.color = emitter.color;
    this.lifespan = emitter.lifespan;
    this.textureSlot = emitter.textureSlot;
    this.emissionRate = emitter.emissionRate;
    this.gravity = emitter.gravity;

    this.dimensions = [emitter.columns, emitter.rows];
    this.cellWidth = 1 / emitter.columns;
    this.cellHeight = 1 / emitter.rows;

    this.node = model.nodes[emitter.node.index];

    this.layer = layer;
    this.texture = model.textures[layer.textureId];

    this.sd = new MdxSdContainer(model, emitter.tracks);
}

MdxRibbonEmitter.prototype = {
    emit(emitterView) {
        this.buffer.grow((this.active.length + 1) * this.bytesPerEmit);

        let inactive = this.inactive,
            object;

        if (inactive.length) {
            object = inactive.pop();
        } else {
            object = new MdxRibbon(this);
        }

        object.reset(emitterView);

        this.active.push(object);
            
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

            // Second stage: update the living particles.
            // All the dead particles were removed, so a simple loop is all that's required.
            for (let i = 0, l = active.length; i < l; i++) {
                active[i].update();
            }

            // Ready for pop mode
            active.reverse();

            let object = active[active.length - 1];
            while (object && object.health <= 0) {
                inactive.push(active.pop());

                // Need to recalculate the length each time
                object = active[active.length - 1];
            }

            // Ready for push mode
            active.reverse()

            this.updateHW(scene);
        }
    },

    updateHW(scene) {
        let active = this.active,
            data = this.buffer.float32array;

        for (let i = 0, l = active.length, offset = 0; i < l; i++, offset += 30) {
            let object = active[i],
                vertices = object.vertices,
                lta = object.lta,
                lba = object.lba,
                rta = object.rta,
                rba = object.rba,
                rgb = object.rgb;

            data[offset + 0] = vertices[0];
            data[offset + 1] = vertices[1];
            data[offset + 2] = vertices[2];
            data[offset + 3] = lta;
            data[offset + 4] = rgb;

            data[offset + 5] = vertices[3];
            data[offset + 6] = vertices[4];
            data[offset + 7] = vertices[5];
            data[offset + 8] = lba;
            data[offset + 9] = rgb;

            data[offset + 10] = vertices[6];
            data[offset + 11] = vertices[7];
            data[offset + 12] = vertices[8];
            data[offset + 13] = rba;
            data[offset + 14] = rgb;

            data[offset + 15] = vertices[0];
            data[offset + 16] = vertices[1];
            data[offset + 17] = vertices[2];
            data[offset + 18] = lta;
            data[offset + 19] = rgb;

            data[offset + 20] = vertices[6];
            data[offset + 21] = vertices[7];
            data[offset + 22] = vertices[8];
            data[offset + 23] = rba;
            data[offset + 24] = rgb;

            data[offset + 25] = vertices[9];
            data[offset + 26] = vertices[10];
            data[offset + 27] = vertices[11];
            data[offset + 28] = rta;
            data[offset + 29] = rgb;
        }
    },

    render(bucket, shader) {
        let active = this.active.length;

        if (active > 0) {
            let model = this.model,
                gl = model.gl;

            this.layer.bind(shader);

            gl.uniform2fv(shader.uniforms.get("u_dimensions"), this.dimensions);

            model.bindTexture(this.texture, 0, bucket.modelView);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.buffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.buffer.float32array.subarray(0, active * 30));

            gl.vertexAttribPointer(shader.attribs.get("a_position"), 3, gl.FLOAT, false, 20, 0);
            gl.vertexAttribPointer(shader.attribs.get("a_uva_rgb"), 2, gl.FLOAT, false, 20, 12);

            gl.drawArrays(gl.TRIANGLES, 0, active * 6);
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
