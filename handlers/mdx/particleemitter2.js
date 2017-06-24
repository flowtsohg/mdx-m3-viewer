/**
 * @constructor
 * @param {MdxModel} model
 * @param {MdxParserParticleEmitter2} emitter
 */
function MdxParticleEmitter2(model, emitter) {
    let gl = model.gl;

    mix(this, emitter);

    this.model = model;

    this.texture = model.textures[this.textureId]

    let headOrTail = this.headOrTail;

    this.head = (headOrTail === 0 || headOrTail === 2);
    this.tail = (headOrTail === 1 || headOrTail === 2);

    this.bytesPerEmit = ((headOrTail === 2) ? 2 : 1) * 4 * 30;

    this.buffer = new ResizeableBuffer(gl);

    this.active = [];
    this.inactive = [];

    this.cellWidth = 1 / this.columns;
    this.cellHeight = 1 / this.rows;
    this.colors = [];

    let colors = this.segmentColors,
        alpha = this.segmentAlpha;

    for (let i = 0; i < 3; i++) {
        let color = colors[i];

        this.colors[i] = new Uint8Array([Math.min(color[0], 1) * 255, Math.min(color[1], 1) * 255, Math.min(color[2], 1) * 255, alpha[i]]);
    }

    let node = this.model.nodes[this.node.index];
    this.xYQuad = node.xYQuad;
    this.modelSpace = node.modelSpace;

    this.sd = new MdxSdContainer(model, emitter.tracks);

    this.dimensions = [this.columns, this.rows];

    let blendSrc,
        blendDst;

    switch (this.filterMode) {
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

MdxParticleEmitter2.prototype = {
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
        var active = this.active;

        var data = this.buffer.float32array;
        var columns = this.columns;
        var particle, position, color;
        var pv1, pv2, pv3, pv4, csx, csy, csz;
        var rect;

        let camera = scene.camera;

        // Choose between a default rectangle or billboarded one
        if (this.xYQuad) {
            rect = camera.vectors;
        } else {
            rect = camera.billboardedVectors;
        }

        pv1 = rect[0];
        pv2 = rect[1];
        pv3 = rect[2];
        pv4 = rect[3];
        csx = rect[4];
        csy = rect[5];
        csz = rect[6];

        var scale, textureIndex, left, top, right, bottom, r, g, b, a, px, py, pz;
        var v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z, v4x, v4y, v4z;
        var lta, lba, rta, rba, rgb;

        for (var i = 0, l = active.length, index = 0; i < l; i++, index += 30) {
            var particle = active[i],
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

            if (particle.head) {
                v1x = px + pv1[0] * scale * nodeScale[0];
                v1y = py + pv1[1] * scale * nodeScale[1];
                v1z = pz + pv1[2] * scale * nodeScale[2];
                v2x = px + pv2[0] * scale * nodeScale[0];
                v2y = py + pv2[1] * scale * nodeScale[1];
                v2z = pz + pv2[2] * scale * nodeScale[2];
                v3x = px + pv3[0] * scale * nodeScale[0];
                v3y = py + pv3[1] * scale * nodeScale[1];
                v3z = pz + pv3[2] * scale * nodeScale[2];
                v4x = px + pv4[0] * scale * nodeScale[0];
                v4y = py + pv4[1] * scale * nodeScale[1];
                v4z = pz + pv4[2] * scale * nodeScale[2];
            } else {
                var tailLength = this.tailLength;
                var v = particle.velocity;
                var offsetx = tailLength * v[0];
                var offsety = tailLength * v[1];
                var offsetz = tailLength * v[2];

                var px2 = px + offsetx;
                var py2 = py + offsety;
                var pz2 = pz + offsetz;

                px -= offsetx;
                py -= offsety;
                pz -= offsetz;

                v1x = px2 - csx[0] * scale * nodeScale[0];
                v1y = py2 - csx[1] * scale * nodeScale[1];
                v1z = pz2 - csx[2] * scale * nodeScale[2];

                v2x = px - csx[0] * scale * nodeScale[0];
                v2y = py - csx[1] * scale * nodeScale[1];
                v2z = pz - csx[2] * scale * nodeScale[2];

                v3x = px + csx[0] * scale * nodeScale[0];
                v3y = py + csx[1] * scale * nodeScale[1];
                v3z = pz + csx[2] * scale * nodeScale[2];

                v4x = px2 + csx[0] * scale * nodeScale[0];
                v4y = py2 + csx[1] * scale * nodeScale[1];
                v4z = pz2 + csx[2] * scale * nodeScale[2];
            }

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

    getVisibility(instance) {
        return this.sd.getValue("KP2V", instance, 1);
    }

    //getVariation(sequence, frame, counter) {
    //    return this.sd.getKP2R(sequence, frame, counter, ?);
    //}
};
