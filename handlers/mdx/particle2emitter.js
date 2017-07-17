/**
 * @constructor
 * @param {MdxModel} model
 * @param {MdxParserParticle2Emitter} emitter
 */
function MdxParticle2Emitter(model, emitter) {
    let gl = model.gl;

    this.width = emitter.width;
    this.length = emitter.length;
    this.speed = emitter.speed;
    this.latitude = emitter.latitude;
    this.gravity = emitter.gravity;
    this.emissionRate = emitter.emissionRate;
    this.squirt = emitter.squirt;

    this.lifespan = emitter.lifespan;
    this.modelSpace = emitter.modelSpace;
    this.variation = emitter.variation;
    this.tailLength = emitter.tailLength;
    this.timeMiddle = emitter.timeMiddle;

    this.model = model;

    this.texture = model.textures[emitter.textureId]

    let headOrTail = emitter.headOrTail;

    this.head = (headOrTail === 0 || headOrTail === 2);
    this.tail = (headOrTail === 1 || headOrTail === 2);

    this.bytesPerEmit = ((headOrTail === 2) ? 2 : 1) * 4 * 30;

    this.buffer = new ResizeableBuffer(gl);

    this.active = [];
    this.inactive = [];

    this.cellWidth = 1 / emitter.columns;
    this.cellHeight = 1 / emitter.rows;
    this.colors = [];

    let colors = emitter.segmentColors,
        alpha = emitter.segmentAlpha;

    for (let i = 0; i < 3; i++) {
        let color = colors[i];

        this.colors[i] = new Uint8Array([Math.min(color[0], 1) * 255, Math.min(color[1], 1) * 255, Math.min(color[2], 1) * 255, alpha[i]]);
    }

    this.scaling = emitter.segmentScaling;

    this.intervals = [
        emitter.headInterval,
        emitter.tailInterval,
        emitter.headDecayInterval,
        emitter.tailDecayInterval
    ];

    let node = this.model.nodes[emitter.node.index];

    this.node = node;

    this.xYQuad = node.xYQuad;
    this.modelSpace = node.modelSpace;

    this.sd = new MdxSdContainer(model, emitter.tracks);

    this.dimensions = [emitter.columns, emitter.rows];

    let blendSrc,
        blendDst;

    switch (emitter.filterMode) {
        // Blend
        case 0:
            blendSrc = gl.SRC_ALPHA;
            blendDst = gl.ONE_MINUS_SRC_ALPHA;
            break;
        // Additive
        case 1:
            blendSrc = gl.SRC_ALPHA;
            blendDst = gl.ONE;
            break;
        // Modulate
        case 2:
            blendSrc = gl.ZERO;
            blendDst = gl.SRC_COLOR;
            break;
        // Modulate 2X
        case 3:
            blendSrc = gl.DEST_COLOR;
            blendDst = gl.SRC_COLOR;
            break;
        // Add Alpha
        case 4:
            blendSrc = gl.SRC_ALPHA;
            blendDst = gl.ONE;
            break;
    }

    this.blendSrc = blendSrc;
    this.blendDst = blendDst;
}

MdxParticle2Emitter.prototype = {
    emitParticle(emitterView, isHead) {
        this.buffer.grow((this.active.length + 1) * this.bytesPerEmit);

        let inactive = this.inactive,
            object;

        if (inactive.length) {
            object = inactive.pop();
        } else {
            object = new MdxParticle2(this);
        }

        object.reset(emitterView, isHead);

        this.active.push(object);
    },

    emit(emitterView) {
        if (this.head) {
            this.emitParticle(emitterView, true);
        }

        if (this.tail) {
            this.emitParticle(emitterView, false);
        }
    },

    update: MdxParticleEmitter.prototype.update,

    updateData() {
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

            gl.blendFunc(this.blendSrc, this.blendDst);

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

    getWidth(instance) {
        return this.sd.getValue("KP2W", instance, this.width);
    },

    getLength(instance) {
        return this.sd.getValue("KP2N", instance, this.length);
    },

    getSpeed(instance) {
        return this.sd.getValue("KP2S", instance, this.speed);
    },

    getLatitude(instance) {
        return this.sd.getValue("KP2L", instance, this.latitude);
    },

    getGravity(instance) {
        return this.sd.getValue("KP2G", instance, this.gravity);
    },

    getEmissionRate(instance) {
        return this.sd.getValue("KP2E", instance, this.emissionRate);
    },

    getEmissionRateKeyframe(instance) {
        return this.sd.getKeyframe("KP2E", instance);
    },

    getVisibility(instance) {
        return this.sd.getValue("KP2V", instance, 1);
    },

    getVariation(instance) {
        return this.sd.getValue("KP2R", instance, this.variation);
    }
};
