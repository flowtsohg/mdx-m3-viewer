function M3Model(env, pathSolver) {
    Model.call(this, env, pathSolver);
}

M3Model.prototype = {
    get Handler() {
        return M3;
    },

    initialize(src) {
        var parser = M3Parser(new BinaryReader(src));

        if (!parser) {
            this.onerror("Failed to parse");
            return false;
        }

        var i, l;
        var div = parser.divisions.get();

        this.parser = parser;
        this.name = parser.modelName.getAll();

        this.setupGeometry(parser, div);

        this.batches = [];
        this.materials = [[], []]; // 2D array for the possibility of adding more material types in the future
        this.materialMaps = parser.materialReferences.getAll();

        var materialMaps = this.materialMaps;
        var materials = parser.materials[0].getAll();
        var batches = [];

        // Create concrete material objects for standard materials
        for (i = 0, l = materials.length; i < l; i++) {
            this.materials[1][i] = new M3StandardMaterial(this, materials[i]);
        }

        const divBatches = div.batches.getAll();

        // Create concrete batch objects
        for (i = 0, l = divBatches.length; i < l; i++) {
            var batch = divBatches[i];
            var regionId = batch.regionIndex;
            var materialMap = materialMaps[batch.materialReferenceIndex];

            if (materialMap.materialType === 1) {
                batches.push({regionId: regionId, region: this.meshes[regionId], material: this.materials[1][materialMap.materialIndex]});
            }
        }

        /*
        var batchGroups = [[], [], [], [], [], []];

        for (i = 0, l = batches.length; i < l; i++) {
        var blendMode = batches[i].material.blendMode;

        batchGroups[blendMode].push(batches[i]);
        }

        function sortByPriority(a, b) {
        var a = a.material.priority;
        var b = b.material.priority;

        if (a < b) {
        return 1;
        } else if (a == b) {
        return 0;
        } else {
        return -1;
        }
        }

        for (i = 0; i < 6; i++) {
        batchGroups[i].sort(sortByPriority);
        }
        */
        /*
        // In the EggPortrait model the batches seem to be sorted by blend mode. Is this true for every model?
        this.batches.sort(function (a, b) {
        var ba = a.material.blendMode;
        var bb = b.material.blendMode;

        if (ba < bb) {
        return -1;
        } else if (ba == bb) {
        return 0;
        } else {
        return 1;
        }
        });
        */

        //this.batches = batchGroups[0].concat(batchGroups[1]).concat(batchGroups[2]).concat(batchGroups[3]).concat(batchGroups[4]).concat(batchGroups[5]);
        
        this.batches = batches;

        var sts = parser.sts.getAll();
        var stc = parser.stc.getAll();
        var stg = parser.stg.getAll();

        this.initialReference = parser.absoluteInverseBoneRestPositions.getAll();
        this.bones = parser.bones.getAll();
        this.boneLookup = parser.boneLookup.getAll();
        this.sequences = parser.sequences.getAll();
        this.sts = [];
        this.stc = [];
        this.stg = [];

        for (i = 0, l = sts.length; i < l; i++) {
            this.sts[i] = new M3Sts(sts[i]);
        }

        for (i = 0, l = stc.length; i < l; i++) {
            this.stc[i] = new M3Stc(stc[i]);
        }

        for (i = 0, l = stg.length; i < l; i++) {
            this.stg[i] = new M3Stg(stg[i], this.sts, this.stc);
        }

        this.addGlobalAnims();

        /*
        if (parser.fuzzyHitTestObjects.length > 0) {
            for (i = 0, l = parser.fuzzyHitTestObjects.length; i < l; i++) {
                this.boundingShapes[i] = new M3BoundingShape(parser.fuzzyHitTestObjects[i], parser.bones, gl);
            }
        }
        */
        /*
        if (parser.particleEmitters.length > 0) {
        this.particleEmitters = [];

        for (i = 0, l = parser.particleEmitters.length; i < l; i++) {
        this.particleEmitters[i] = new M3ParticleEmitter(parser.particleEmitters[i], this);
        }
        }
        */

        //this.attachments = parser.attachmentPoints;
        //this.cameras = parser.cameras;

        return true;
    },

    setupGeometry(parser, div) {
        const gl = this.env.gl;

        var i, l;
        var uvSetCount = 1;
        var vertexFlags = parser.vertexFlags;

        if (vertexFlags & 0x40000) {
            uvSetCount = 2;
        } else if (vertexFlags & 0x80000) {
            uvSetCount = 3;
        } else if (vertexFlags & 0x100000) {
            uvSetCount = 4;
        }

        var regions = div.regions.getAll();
        var totalElements = 0;
        var offsets = [];

        for (i = 0, l = regions.length; i < l; i++) {
            offsets[i] = totalElements;
            totalElements += regions[i].triangleIndicesCount;
        }

        var elementArray = new Uint16Array(totalElements);
        var edgeArray = new Uint16Array(totalElements * 2);

        this.meshes = [];

        const triangles = div.triangles.getAll();

        for (i = 0, l = regions.length; i < l; i++) {
            this.meshes.push(new M3Region(regions[i], triangles, elementArray, edgeArray, offsets[i], gl));
        }

        this.elementBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elementArray, gl.STATIC_DRAW);

        this.edgeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgeBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, edgeArray, gl.STATIC_DRAW);

        var arrayBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, parser.vertices.getAll(), gl.STATIC_DRAW);

        this.arrayBuffer = arrayBuffer;
        this.vertexSize = (7 + uvSetCount) * 4;
        this.uvSetCount = uvSetCount;




        const buffer = parser.vertices.getAll().buffer;
        const reader = new BinaryReader(buffer);
        const verticesCount = buffer.byteLength / 32;

        const positions = new Float32Array(verticesCount * 3);
        const boneLookups = new Uint8Array(verticesCount * 4);

        for (let i = 0; i < verticesCount; i++) {
            const position = readVector3(reader);

            positions[i * 3 + 0] = position[0];
            positions[i * 3 + 1] = position[1];
            positions[i * 3 + 2] = position[2];

            const boneWeights = readUint8Array(reader, 4);

            //console.log(boneWeights)

            const boneLookup = readUint8Array(reader, 4);
            //console.log(position, boneLookup)
            boneLookups[i * 4 + 0] = boneLookup[0];
            boneLookups[i * 4 + 1] = boneLookup[1];
            boneLookups[i * 4 + 2] = boneLookup[2];
            boneLookups[i * 4 + 3] = boneLookup[3];

            const normal = readUint8Array(reader, 4);

            const uv0 = readUint16Array(reader, 2);

            const tangent = readUint8Array(reader, 4);
        }

        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        this.positionBuffer = positionBuffer;

        console.log("Test");
    },

    mapMaterial(index) {
        var materialMap = this.materialMaps[index];

        return this.materials[materialMap.materialType][materialMap.materialIndex];
    },

    addGlobalAnims() {
    /*
    var i, l;
    var glbirth, glstand, gldeath;
    var stgs = this.stg;
    var stg, name;

    for (i = 0, l = stgs.length; i < l; i++) {
    stg = stgs[i];
    name = stg.name.toLowerCase(); // Because obviously there will be a wrong case in some model...

    if (name === "glbirth") {
    glbirth = stg;
    } else if (name === "glstand") {
    glstand = stg;
    } else if (name === "gldeath") {
    gldeath = stg;
    }
    }

    for (i = 0, l = stgs.length; i < l; i++) {
    stg = stgs[i];
    name = stg.name.toLowerCase(); // Because obviously there will be a wrong case in some model...

    if (name !== "glbirth" && name !== "glstand" && name !== "gldeath") {
    if (name.indexOf("birth") !== -1 && glbirth) {
    stg.stcIndices = stg.stcIndices.concat(glbirth.stcIndices);
    } else  if (name.indexOf("death") !== -1 && gldeath) {
    stg.stcIndices = stg.stcIndices.concat(gldeath.stcIndices);
    } else if (glstand) {
    stg.stcIndices = stg.stcIndices.concat(glstand.stcIndices);
    }
    }
    }
    */
    },

    getValue(animRef, sequence, frame) {
        if (sequence !== -1) {
            return this.stg[sequence].getValue(animRef, frame)
        } else {
            return animRef.initValue;
        }
    },

    bindShared(bucket) {
        const gl = this.gl,
            shader = this.shader,
            vertexSize = this.vertexSize;

        // Team colors
        //gl.bindBuffer(gl.ARRAY_BUFFER, bucket.teamColorBuffer);
        //gl.vertexAttribPointer(shader.attribs.get("a_teamColor"), 1, gl.UNSIGNED_BYTE, false, 1, 0);
        //webgl.extensions.instancedArrays.vertexAttribDivisorANGLE(shader.attribs.get("a_teamColor"), 1);

        // Tint colors
        //gl.bindBuffer(gl.ARRAY_BUFFER, bucket.tintColorBuffer);
        //gl.vertexAttribPointer(shader.attribs.get("a_tintColor"), 3, gl.UNSIGNED_BYTE, true, 3, 0); // normalize the colors from [0, 255] to [0, 1] here instead of in the pixel shader
        //webgl.extensions.instancedArrays.vertexAttribDivisorANGLE(shader.attribs.get("a_tintColor"), 1);

        gl.activeTexture(gl.TEXTURE15);
        gl.bindTexture(gl.TEXTURE_2D, bucket.boneTexture);
        gl.uniform1i(shader.uniforms.get("u_boneMap"), 15);
        gl.uniform1f(shader.uniforms.get("u_vector_size"), bucket.vectorSize);
        gl.uniform1f(shader.uniforms.get("u_matrix_size"), bucket.matrixSize);
        gl.uniform1f(shader.uniforms.get("u_row_size"), bucket.rowSize);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(shader.attribs.get("a_position"), 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.arrayBuffer);
        gl.vertexAttribPointer(shader.attribs.get("a_weights"), 4, gl.UNSIGNED_BYTE, false, vertexSize, 12);
        gl.vertexAttribPointer(shader.attribs.get("a_bones"), 4, gl.UNSIGNED_BYTE, false, vertexSize, 16);
    },

    bind(bucket) {
        const gl = this.gl,
            webgl = this.env.webgl;

        var vertexSize = this.vertexSize;
        var uvSetCount = this.uvSetCount;

        // HACK UNTIL I IMPLEMENT MULTIPLE SHADERS AGAIN
        var shader = M3.standardShader;
        webgl.useShaderProgram(shader);
        this.shader = shader;

        this.bindShared(bucket);

        gl.vertexAttribPointer(shader.attribs.get("a_normal"), 4, gl.UNSIGNED_BYTE, false, vertexSize, 20);

        for (var i = 0; i < uvSetCount; i++) {
            gl.vertexAttribPointer(shader.attribs.get("a_uv" + i), 2, gl.SHORT, false, vertexSize, 24 + i * 4);
        }

        gl.vertexAttribPointer(shader.attribs.get("a_tangent"), 4, gl.UNSIGNED_BYTE, false, vertexSize, 24 + uvSetCount * 4);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer);

        gl.uniformMatrix4fv(shader.uniforms.get("u_mvp"), false, this.env.camera.worldProjectionMatrix);
        gl.uniformMatrix4fv(shader.uniforms.get("u_mv"), false, this.env.camera.worldMatrix);

        gl.uniform3fv(shader.uniforms.get("u_eyePos"), this.env.camera.worldLocation);
        gl.uniform3fv(shader.uniforms.get("u_lightPos"), M3.lightPosition);
    },
    
    unbind() {

    },

    bindWireframe(shader, ctx) {
        this.bindShared(shader, ctx);
        
        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.edgeBuffer);
    },

    renderBatch(bucket, batch) {
        const shader = this.shader,
            region = batch.region,
            material = batch.material;

        material.bind(shader);

        region.render(shader, bucket.instances.length);

        material.unbind(shader); // This is required to not use by mistake layers from this material that were bound and are not overwritten by the next material
    },

    renderOpaque(bucket) {
        const batches = this.batches;

        if (batches.length) {
            //const updateBatches = bucket.updateBatches;

            this.bind(bucket);

            for (let i = 0, l = batches.length; i < l; i++) {
                const batch = batches[i];

                //if (updateBatches[batch.index]) {
                    this.renderBatch(bucket, batch);
                //}
            }

            this.unbind();
        }
    },

    renderTranslucent(bucket) {

    },

    render(instance) {
        var context = instance.asyncInstance.context;
        var gl = context.gl;
        var ctx = gl.ctx;
        var i, l;
        var sequence = instance.sequence;
        var frame = instance.frame;
        var tc;
        var teamId = instance.teamColor;
        var shaderName = context.shaders[context.shader];
        var uvSetCount = this.uvSetCount;
        var realShaderName = "s" + shaderName + uvSetCount;
        // Instance-based texture overriding
        var textureMap = instance.textureMap;
        var shader;
       

        shader = gl.bindShader(realShaderName);

        instance.skeleton.bind(shader, ctx);

        ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());
        ctx.uniformMatrix4fv(shader.variables.u_mv, false, gl.getViewMatrix());

        ctx.uniform3fv(shader.variables.u_teamColor, context.teamColors[teamId]);
        ctx.uniform3fv(shader.variables.u_eyePos, context.camera.location);
        ctx.uniform3fv(shader.variables.u_lightPos, context.lightPosition);

        // Bind the vertices
        this.bind(shader, ctx);

        for (i = 0, l = this.batches.length; i < l; i++) {
            var batch = this.batches[i];

            if (instance.meshVisibilities[batch.regionId]) {
                var region = batch.region;
                var material = batch.material;

                if (shaderName === "standard" || shaderName === "uvs") {
                    material.bind(sequence, frame, textureMap, shader, context);
                } else if (shaderName === "diffuse") {
                    material.bindDiffuse(sequence, frame, textureMap, shader, context);
                } else if (shaderName === "normalmap" || shaderName === "unshaded_normalmap") {
                    material.bindNormalMap(sequence, frame, textureMap, shader, context);
                } else if (shaderName === "specular") {
                    material.bindSpecular(sequence, frame, textureMap, shader, context);
                } else if (shaderName === "specular_normalmap") {
                    material.bindSpecular(sequence, frame, textureMap, shader, context);
                    material.bindNormalMap(sequence, frame, textureMap, shader, context);
                } else if (shaderName === "emissive") {
                    material.bindEmissive(sequence, frame, textureMap, shader, context);
                } else if (shaderName === "decal") {
                    material.bindDecal(sequence, frame, textureMap, shader, context);
                }

                region.render(shader, ctx, context.polygonMode);

                material.unbind(shader, ctx); // This is required to not use by mistake layers from this material that were bound and are not overwritten by the next material
            }
        }
    },

    renderEmitters(bucket) {
    /*
    if (this.particleEmitters) {
    ctx.disable(ctx.CULL_FACE);

    for (i = 0, l = this.particleEmitters.length; i < l; i++) {
    gl.bindShader("particles");

    gl.bindMVP("u_mvp");

    this.particleEmitters[i].render();
    }

    ctx.enable(ctx.CULL_FACE);
    }
    */
    },

    bindTexture(texture, unit) {
        this.env.webgl.bindTexture(texture, unit);
    }
};

mix(M3Model.prototype, Model.prototype);
