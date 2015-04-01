function ParticleEmitter2(emitter, model, instance, ctx) {
    var i, l;
    var keys = Object.keys(emitter);

    for (i = keys.length; i--;) {
        this[keys[i]] = emitter[keys[i]];
    }

    this.model = model;
    this.texture = model.textures[this.textureId];

    var particles;

    // This is the maximum number of particles that are going to exist at the same time
    if (this.tracks.emissionRate) {
        var tracks = this.tracks.emissionRate.tracks;
        var biggest = 0;

        for (i = 0, l = tracks.length; i < l; i++) {
            var track = tracks[i];

            if (track.vector > biggest) {
                biggest = track.vector;
            }
        }
        // For a reason I can't understand, biggest*lifespan isn't enough for emission rate tracks, multiplying by 2 seems to be the lowest reasonable value that works
        particles = Math.ceil(biggest) * Math.ceil(this.lifespan) * 2;
    } else {
        // +3 because for some reason rate*lifespan isn't working properly
        // Do I have a problem with the update loop?
        particles = Math.ceil(this.emissionRate) * Math.ceil(this.lifespan) + 3;
    }

    this.head = (this.headOrTail === 0 || this.headOrTail === 2);
    this.tail = (this.headOrTail === 1 || this.headOrTail === 2);

    if (this.head && this.tail) {
        particles *= 2;
    }
    
    this.particles = [];
    this.reusables = [];
    this.activeParticles = [];

    this.buffer = ctx.createBuffer();
    this.data = new Float32Array(30 * particles);

    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, this.data, ctx.DYNAMIC_DRAW);

    for (i = 0, l = particles; i < l; i++) {
        this.particles[i] = new Particle2();
        this.reusables.push(particles - i - 1);
    }

    this.cellWidth = 1 / this.columns;
    this.cellHeight = 1 / this.rows;
    this.colors = [];

    var colors = this.segmentColor;
    var alpha = this.segmentAlpha;

    for (i = 0; i < 3; i++) {
        this.colors[i] = [Math.floor(colors[i][0] * 255), Math.floor(colors[i][1] * 255), Math.floor(colors[i][2] * 255), alpha[i]];
    }

    this.node = instance.skeleton.nodes[this.node];
    this.sd = parseSDTracks(emitter.tracks, model);

    // Avoid heap alocations in Particle2.reset
    this.particleLocalPosition = vec3.create();
    this.particlePosition = vec3.create();
    this.particleRotation = mat4.create();
    this.particleVelocity = vec3.create();
    this.particleVelocityStart = vec3.create();
    this.particleVelocityEnd = vec3.create();

    this.xYQuad = this.node.nodeImpl.xYQuad;

    this.dimensions = [this.columns, this.rows];
    
    this.modelSpace = this.node.nodeImpl.modelSpace;
    this.currentEmission = 0;
}

ParticleEmitter2.prototype = {
    update: function (allowCreate, sequence, frame, counter, context) {
        var particles = this.particles;
        var reusables = this.reusables;
        var activeParticles = this.activeParticles;
        var activeParticlesCount = activeParticles.length;
        var i, l;
        var particle;

        if (activeParticles.length > 0) {
            // First stage: remove dead particles.
            // The used particles array is a queue, dead particles will always come first.
            // As of the time of writing, the easiest and fastest way to implement a queue in Javascript is a normal array.
            // To add items, you push, to remove items, the array is reversed and you pop.
            // So the first stage reverses the array, and then keeps checking the last element for its health.
            // As long as we hit a dead particle, pop, and check the new last element.

            // Ready for pop mode
            activeParticles.reverse();

            particle = particles[activeParticles[activeParticles.length - 1]];

            while (particle && particle.health <= 0) {
                activeParticles.pop();
                this.reusables.push(particle.id);

                // Need to recalculate the length each time
                particle = particles[activeParticles[activeParticles.length - 1]];
            }

            // Ready for push mode
            activeParticles.reverse()

            // Second stage: update the living particles.
            // All the dead particles were removed, so a simple loop is all that's required.
            for (i = 0, l = activeParticles.length; i < l; i++) {
                particle = particles[activeParticles[i]];

                particle.update(this, sequence, frame, counter, context);
            }
        }
        
        // Third stage: create new particles if needed.
        if (allowCreate && this.shouldRender(sequence, frame, counter)) {
            this.currentEmission += getSDValue(sequence, frame, counter, this.sd.emissionRate, this.emissionRate) * (context.frameTime / 1000);

            if (this.currentEmission >= 1) {
                var amount = Math.floor(this.currentEmission);
                var index;

                for (i = 0; i < amount; i++) {
                    if (this.head && reusables.length > 0) {
                        index = reusables.pop();

                        particles[index].reset(this, true, index, sequence, frame, counter);
                        activeParticles.push(index);
                    }

                    if (this.tail && reusables.length > 0) {
                        index = reusables.pop();

                        particles[index].reset(this, false, index, sequence, frame, counter);
                        activeParticles.push(index);
                    }
                    
                    this.currentEmission -= 1;
                }
            }
        }  

        this.updateHW(context.camera.rect, context.camera.billboardedRect);
    },

    updateHW: function (baseParticle, billboardedParticle) {
        var activeParticles = this.activeParticles;
        var data = this.data;
        var particles = this.particles;
        var columns = this.columns;
        var particle, index, position, color;
        var pv1, pv2, pv3, pv4, csx, csy, csz;
        var rect;

        // Choose between a default rectangle or billboarded one
        if (this.xYQuad) {
            rect = baseParticle;
        } else {
            rect = billboardedParticle;
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
        var nodeScale = this.node.scale;

        for (var i = 0, l = activeParticles.length; i < l; i++) {
            particle = particles[activeParticles[i]];
            index = i * 30;
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
                /*
                v1x = px2 - csx[0] * scale + csz[0] * scale;
                v1y = py2 - csx[1] * scale + csz[1] * scale;
                v1z = pz2 - csx[2] * scale + csz[2] * scale;

                v2x = px - csx[0] * scale - csz[0] * scale;
                v2y = py - csx[1] * scale - csz[1] * scale;
                v2z = pz - csx[2] * scale - csz[2] * scale;
                v3x = px + csx[0] * scale - csz[0] * scale;
                v3y = py + csx[1] * scale - csz[1] * scale;
                v3z = pz + csx[2] * scale - csz[2] * scale;
                v4x = px2 + csx[0] * scale + csz[0] * scale;
                v4y = py2 + csx[1] * scale + csz[1] * scale;
                v4z = pz2 + csx[2] * scale + csz[2] * scale;
                */
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

    render: function (textureMap, shader, context) {
        var ctx = context.gl.ctx;
        var particles = this.activeParticles.length;

        if (particles > 0) {
            ctx.disable(ctx.CULL_FACE);
            ctx.enable(ctx.DEPTH_TEST);
            ctx.depthMask(0);
            ctx.enable(ctx.BLEND);
            
            switch (this.filterMode) {
                // Blend
                case 0:
                    ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA);
                    break;
                // Additive
                case 1:
                    ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE);
                    break;
                // Modulate
                case 2:
                    ctx.blendFunc(ctx.ZERO, ctx.SRC_COLOR);
                    break;
                // Modulate 2X
                case 3:
                    ctx.blendFunc(ctx.DEST_COLOR, ctx.SRC_COLOR);
                    break;
                // Add Alpha
                case 4:
                    ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE);
                    break;
            }
            
            this.model.bindTexture(this.texture, 0, textureMap, context);

            ctx.uniform2fv(shader.variables.u_dimensions, this.dimensions);

            ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer);
            ctx.bufferSubData(ctx.ARRAY_BUFFER, 0, this.data.subarray(0, particles * 30 + 1));

            ctx.vertexAttribPointer(shader.variables.a_position, 3, ctx.FLOAT, false, 20, 0);
            ctx.vertexAttribPointer(shader.variables.a_uva_rgb, 2, ctx.FLOAT, false, 20, 12);

            ctx.drawArrays(ctx.TRIANGLES, 0, particles * 6);
        }
    },

    shouldRender: function (sequence, frame, counter) {
        return getSDValue(sequence, frame, counter, this.sd.visibility, 1) > 0.75;
    }
};