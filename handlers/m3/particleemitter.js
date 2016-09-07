M3ParticleEmitter = function (particleEmitter, model) {
    var i, l;
    var keys = Object.keys(particleEmitter);

    for (i = keys.length; i--;) {
        this[keys[i]] = particleEmitter[keys[i]];
    }

    this.model = model;

    this.lastCreation = 0;
    this.material = model.mapMaterial(this.materialReferenceIndex);

    this.particles = [];
    this.reusables = [];

    this.buffer = ctx.createBuffer();
    this.data = new Float32Array(48 * this.maxParticles);

    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, this.data, ctx.DYNAMIC_DRAW);

    for (i = 0, l = this.maxParticles; i < l; i++) {
        this.particles[i] = new M3Particle();
        this.reusables.push(i);
    }
};

M3ParticleEmitter.prototype = {
    update: function (allowCreate, sequenceId, frame) {
        var i, l;

        for (i = 0, l = this.particles.length; i < l; i++) {
            var particle = this.particles[i];

            if (particle.alive) {
                if (particle.health <= 0) {
                    particle.alive = false;

                    this.reusables.push(i);
                } else {
                    particle.update(this);
                }
            }
        }

        if (allowCreate) {
            this.lastCreation += 1 * ANIMATION_SCALE;

            var amount = (this.model.getValue(this.partEmit, sequenceId, frame) * FRAME_TIME) / (1 / this.lastCreation);

            if (amount >= 1) {
                this.lastCreation = 0;

                for (i = 0; i < amount; i++) {
                    if (this.reusables.length > 0) {
                        this.particles[this.reusables.pop()].reset(this, this.model);
                    }
                }
            }
        }
    },

    render: function () {
        var data = this.data;

        var pv1 = [-1, -1, 0];
        var pv2 = [-1, 1, 0];
        var pv3 = [1, 1, 0];
        var pv4 = [1, -1, 0];

        var orientation = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

        mat4.rotate(orientation, -Math.toRad(camera.r[1]), 0, 0, 1);
        mat4.rotate(orientation, -Math.toRad(camera.r[0]), 1, 0, 0);

        mat4.multVec3(orientation, pv1, pv1);
        mat4.multVec3(orientation, pv2, pv2);
        mat4.multVec3(orientation, pv3, pv3);
        mat4.multVec3(orientation, pv4, pv4);

        for (var i = 0, l = this.particles.length; i < l; i++) {
            var particle = this.particles[i];
            var index = i * 48;

            if (particle.health > 0) {
                var position = particle.position;
                var scale = particle.size[0];
                var left = 0;
                var top = 1;
                var right = 1;
                var bottom = 0;
                var px = position[0];
                var py = position[1];
                var pz = position[2];
                var v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z, v4x, v4y, v4z;

                v1x = px + pv1[0] * scale;
                v1y = py + pv1[1] * scale;
                v1z = pz + pv1[2] * scale;
                v2x = px + pv2[0] * scale;
                v2y = py + pv2[1] * scale;
                v2z = pz + pv2[2] * scale;
                v3x = px + pv3[0] * scale;
                v3y = py + pv3[1] * scale;
                v3z = pz + pv3[2] * scale;
                v4x = px + pv4[0] * scale;
                v4y = py + pv4[1] * scale;
                v4z = pz + pv4[2] * scale;

                data[index + 0] = v1x;
                data[index + 1] = v1y;
                data[index + 2] = v1z;
                data[index + 3] = 0;
                data[index + 4] = 0;
                data[index + 5] = 1;
                data[index + 6] = left;
                data[index + 7] = top;

                data[index + 8] = v2x;
                data[index + 9] = v2y;
                data[index + 10] = v2z;
                data[index + 11] = 0;
                data[index + 12] = 0;
                data[index + 13] = 1;
                data[index + 14] = left;
                data[index + 15] = bottom;

                data[index + 16] = v3x;
                data[index + 17] = v3y;
                data[index + 18] = v3z;
                data[index + 19] = 0;
                data[index + 20] = 0;
                data[index + 21] = 1;
                data[index + 22] = right;
                data[index + 23] = bottom;

                data[index + 24] = v1x;
                data[index + 25] = v1y;
                data[index + 26] = v1z;
                data[index + 27] = 0;
                data[index + 28] = 0;
                data[index + 29] = 1;
                data[index + 30] = left;
                data[index + 31] = top;

                data[index + 32] = v3x;
                data[index + 33] = v3y;
                data[index + 34] = v3z;
                data[index + 35] = 0;
                data[index + 36] = 0;
                data[index + 37] = 1;
                data[index + 38] = right;
                data[index + 39] = bottom;

                data[index + 40] = v4x;
                data[index + 41] = v4y;
                data[index + 42] = v4z;
                data[index + 43] = 0;
                data[index + 44] = 0;
                data[index + 45] = 1;
                data[index + 46] = right;
                data[index + 47] = top;
            } else {
                for (var j = 0; j < 6; j++) {
                    var offset = index + j * 8;

                    data[offset + 0] = 0;
                    data[offset + 1] = 0;
                    data[offset + 2] = 0;
                }
            }
        }
        /*
        var material = this.material;

        if (shaderToUse === "standard") {
        material.bind();
        } else if (shaderToUse === "diffuse") {
        material.bindDiffuse();
        } else if (shaderToUse === "normalmap" || shaderToUse === "unshaded_normalmap") {
        material.bindNormalMap();
        } else if (shaderToUse === "specular") {
        material.bindSpecular();
        } else if (shaderToUse === "specular_normalmap") {
        material.bindSpecular();
        material.bindNormalMap();
        } else if (shaderToUse === "emissive") {
        material.bindEmissive();
        } else if (shaderToUse === "decal") {
        material.bindDecal();
        }
        */
        ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer);
        ctx.bufferSubData(ctx.ARRAY_BUFFER, 0, this.data);

        gl.vertexAttribPointer("a_position", 3, ctx.FLOAT, false, 32, 0);
        //gl.vertexAttribPointer("a_normal", 3, ctx.FLOAT, false, 32, 12);
        //gl.vertexAttribPointer("a_uv[0]", 2, ctx.FLOAT, false, 32, 24);

        ctx.drawArrays(ctx.TRIANGLES, 0, this.particles.length * 6);

        //material.unbind(); // This is required to not use by mistake layers from this material that were bound and are not overwritten by the next material

    }
};
