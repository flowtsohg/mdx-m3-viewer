Mdx.Model = function () {

};

Mdx.Model.prototype = extend(BaseModel.prototype, {
    loadstart: function (asyncModel, src, reportError, reportLoad) {
        BaseModel.call(this, {});

        this.asyncModel = asyncModel;

        var parser = Mdx.Parser(new BinaryReader(src));

        if (parser) {
            this.setup(parser, this.asyncModel.pathSolver, this.asyncModel.context);

            reportLoad();
        }
    },

    setup: function (parser, pathSolver, context) {
        var gl = context.gl;
        var objects, i, l, j, k;
        var chunks = parser.chunks;

        this.parser = parser;
        this.name = chunks.MODL.name;
        this.sequences = [];
        this.textures = [];
        this.meshes = [];
        this.cameras = [];
        this.particleEmitters = [];
        this.particleEmitters2 = [];
        this.ribbonEmitters = [];
        this.boundingShapes = [];
        this.attachments = [];

        this.texturePaths = [];

        if (chunks.TEXS) {
            objects = chunks.TEXS.elements;

            for (i = 0, l = objects.length; i < l; i++) {
                this.loadTexture(objects[i], gl, pathSolver);
            }
        }

        if (chunks.SEQS) {
            this.sequences = chunks.SEQS.elements;
        }

        if (chunks.GLBS) {
            this.globalSequences = chunks.GLBS.elements;
        }

        var nodes = parser.nodes;
        var pivots;

        if (chunks.PIVT) {
            pivots = chunks.PIVT.elements;
        } else {
            pivots = [[0, 0, 0]];
        }

        this.nodes = [];

        for (i = 0, l = nodes.length; i < l; i++) {
            this.nodes[i] = new Mdx.Node(nodes[i], this, pivots);
        }

        if (this.nodes.length === 0) {
            this.nodes[0] = new Mdx.Node({ objectId: 0, parentId: 0xFFFFFFFF }, this, pivots);
        }

        // This list is used to access all the nodes in a loop while keeping the hierarchy in mind.
        this.hierarchy = this.setupHierarchy([], this.nodes, -1);

        if (chunks.BONE) {
            this.bones = chunks.BONE.elements;
        } else {
            // If there are no bones, reference the injected root node, since the shader requires at least one bone
            this.bones = [{ node: { objectId: 0, index: 0 } }];
        }

        var materials;
        var fakeMaterials;
        var layers;
        var layer;
        var geosets;
        var geoset;
        var groups;
        var mesh;

        this.textureAnimations = this.transformElements(chunks.TXAN, Mdx.TextureAnimation);

        if (chunks.MTLS) {
            objects = chunks.MTLS.elements;
            materials = [];

            this.layers = [];

            for (i = 0, l = objects.length; i < l; i++) {
                layers = objects[i].layers;

                materials[i] = [];

                for (j = 0, k = layers.length; j < k; j++) {
                    layer = new Mdx.Layer(layers[j], this, this.textureAnimations);

                    materials[i][j] = layer;
                    this.layers.push(layer);
                }
            }

            this.materials = materials;
        }

        this.geosetAnimations = this.transformElements(chunks.GEOA, Mdx.GeosetAnimation);

        if (chunks.GEOS) {
            geosets = chunks.GEOS.elements;
            groups = [[], [], [], []];

            for (i = 0, l = geosets.length; i < l; i++) {
                geoset = geosets[i];
                layers = materials[geoset.materialId];

                mesh = new Mdx.Geoset(geoset, i, gl.ctx, this.geosetAnimations);

                this.meshes.push(mesh);

                for (j = 0, k = layers.length; j < k; j++) {
                    layer = layers[j];

                    groups[layer.renderOrder].push(new Mdx.Batch(layer, mesh));
                }
            }

            // This is an array of geoset + shallow layer batches
            this.batches = groups[0].concat(groups[1]).concat(groups[2]).concat(groups[3]);

            this.calculateExtent();
        }

        this.cameras = this.transformElements(chunks.CAMS, Mdx.Camera);

        if (chunks.PREM) {
            this.particleEmitters = chunks.PREM.elements;
        }

        if (chunks.PRE2) {
            this.particleEmitters2 = chunks.PRE2.elements;
        }

        if (chunks.RIBB) {
            this.ribbonEmitters = chunks.RIBB.elements;
        }

        this.boundingShapes = this.transformElements(chunks.CLID, Mdx.CollisionShape, gl);
        this.attachments = this.transformElements(chunks.ATCH, Mdx.Attachment);

        if (chunks.EVTS) {
            this.eventObjects = chunks.EVTS.elements;
        }

        // Avoid heap allocations in render()
        this.modifier = vec4.create();
        this.uvoffset = vec3.create();

        this.setupShaders(chunks, gl);
        this.setupTeamColors(gl, pathSolver);
    },

    setupHierarchy: function (hierarchy, nodes, parent) {
        var node;

        for (var i = 0, l = nodes.length; i < l; i++) {
            node = nodes[i];

            if (node.parentId === parent) {
                hierarchy.push(i);

                this.setupHierarchy(hierarchy, nodes, node.objectId);
            }
        }

        return hierarchy;
    },

    transformElements: function (chunk, Func, gl) {
        var output = [];

        if (chunk) {
            var elements = chunk.elements;
            

            for (var i = 0, l = elements.length; i < l; i++) {
                output[i] = new Func(elements[i], this, gl);
            }
        }

        return output;
    },

    setupShaders: function (chunks, gl) {
        var psmain = SHADERS["wpsmain"];

        if ((chunks.GEOS || chunks.PREM) && !gl.shaderStatus("wstandard")) {
            gl.createShader("wstandard", SHADERS.vsbonetexture + SHADERS.wvsmain, psmain, ["STANDARD_PASS"]);
            gl.createShader("wuvs", SHADERS.vsbonetexture + SHADERS.wvsmain, psmain, ["UVS_PASS"]);
            gl.createShader("wnormals", SHADERS.vsbonetexture + SHADERS.wvsmain, psmain, ["NORMALS_PASS"]);
            gl.createShader("wwhite", SHADERS.vsbonetexture + SHADERS.wvswhite, SHADERS.pswhite);
        }

        // Load the particle emitters type 2 shader if it is needed
        if (chunks.PRE2 && !gl.shaderStatus("wparticles")) {
            gl.createShader("wparticles", SHADERS.decodefloat + SHADERS.wvsparticles, SHADERS.wpsparticles);
        }

        // Load the ribbon emitters shader if it is needed
        if (chunks.RIBB && !gl.shaderStatus("wribbons")) {
            gl.createShader("wribbons", SHADERS.wvsribbons, psmain, ["STANDARD_PASS"]);
        }

        // Load the color shader if it is needed
        if (!gl.shaderStatus("wcolor")) {
            gl.createShader("wcolor", SHADERS.vsbonetexture + SHADERS.wvscolor, SHADERS.pscolor);
        }
    },

    setupTeamColors: function (gl, pathSolver) {
        var context = this.asyncModel.context;

        for (var i = 0; i < 13; i++) {
            var number = ((i < 10) ? "0" + i : i);

            context.loadTexture(pathSolver("replaceabletextures/teamcolor/teamcolor" + number + ".blp"), ".blp");
            context.loadTexture(pathSolver("replaceabletextures/teamglow/teamglow" + number + ".blp"), ".blp");
        }
    },

    loadTexture: function (texture, gl, pathSolver) {
        var context = this.asyncModel.context;

        var path = texture.path;
        var replaceableId = texture.replaceableId;

        if (replaceableId !== 0) {
            path = "replaceabletextures/" + Mdx.replaceableIdToName[replaceableId] + ".blp";
        }

        var realPath = pathSolver(path);

        //this.textures.push(path);
        this.textureMap[path] = realPath;

        var fileType = fileTypeFromPath(path);

        this.textures.push(context.loadTexture(realPath, fileType));

        this.texturePaths.push(path);
    },

    calculateExtent: function () {
        var meshes = this.meshes;
        var mesh;
        var min, max;
        var x, y, z;
        var minX = 1E9, minY = 1E9, minZ = 1E9;
        var maxX = -1E9, maxY = -1E9, maxZ = -1E9;
        var dX, dY, dZ;
        var i, l;

        for (i = 0, l = meshes.length; i < l; i++) {
            mesh = meshes[i];
            min = mesh.min;
            max = mesh.max;
            x = min[0];
            y = min[1];
            z = min[2];

            if (x < minX) {
                minX = x;
            }

            if (y < minY) {
                minY = y;
            }

            if (z < minZ) {
                minZ = z;
            }

            x = max[0];
            y = max[1];
            z = max[2];

            if (x > maxX) {
                maxX = x;
            }

            if (y > maxY) {
                maxY = y;
            }

            if (z > maxZ) {
                maxZ = z;
            }
        }

        dX = maxX - minX;
        dY = maxY - minY;
        dZ = maxZ - minZ;

        this.extent = {radius: Math.sqrt(dX * dX + dY * dY + dZ * dZ) / 2, min: [minX, minY, minZ], max: [maxX, maxY, maxZ] };
    },

    render: function (instance) {
        var context = instance.asyncInstance.context;
        var tint = instance.asyncInstance.tint;
        var gl = context.gl;
        var ctx = gl.ctx;
        var i, l, v;
        var sequence = instance.sequence;
        var frame = instance.frame;
        var counter = instance.counter;
        var shaderName = context.shaders[context.shader];

        if (shaderName !== "uvs" && shaderName !== "normals" && shaderName !== "white") {
            shaderName = "standard";
        }

        var realShaderName = "w" + shaderName
        var shader;
        var batches = this.batches;
        var polygonMode = context.polygonMode;
        var renderGeosets = (polygonMode === 1 || polygonMode === 3);
        var renderWireframe = (polygonMode === 2 || polygonMode === 3);

        if (batches) {
            var geoset;
            var batch;
            var layer;

            if (renderGeosets && gl.shaderStatus(realShaderName)) {
                var modifier = this.modifier;
                var uvoffset = this.uvoffset;
                var textureId;
                var textures = this.textures;

                shader = gl.bindShader(realShaderName);

                if (shaderName === "standard") {
                    ctx.uniform4fv(shader.variables.u_tint, tint);
                }

                ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());
                ctx.uniform1i(shader.variables.u_texture, 0);

                instance.skeleton.bind(shader, ctx);

                for (i = 0, l = batches.length; i < l; i++) {
                    batch = batches[i];
                    geoset = batch.geoset;
                    layer = batch.layer;

                    if (instance.meshVisibilities[geoset.index] && this.shouldRender(sequence, frame, counter, geoset, layer)) {
                        modifier[0] = 1;
                        modifier[1] = 1;
                        modifier[2] = 1;
                        modifier[3] = 1;

                        uvoffset[0] = 0;
                        uvoffset[1] = 0;
                        uvoffset[2] = 0;

                        layer.bind(shader, ctx);

                        textureId = layer.getTextureId(sequence, frame, counter);
                        this.bindTexture(this.textures[textureId], instance.textureMap[this.texturePaths[textureId]], context);

                        if (geoset.geosetAnimation) {
                            var tempVec3 = geoset.geosetAnimation.getColor(sequence, frame, counter);

                            modifier[0] = tempVec3[2];
                            modifier[1] = tempVec3[1];
                            modifier[2] = tempVec3[0];
                        }

                        modifier[3] = layer.getAlpha(sequence, frame, counter);

                        ctx.uniform4fv(shader.variables.u_modifier, modifier);

                        if (layer.textureAnimation) {
                            // What is Z used for?
                            uvoffset = layer.textureAnimation.getTranslation(sequence, frame, counter);
                        }

                        ctx.uniform3fv(shader.variables.u_uv_offset, uvoffset);

                        geoset.render(layer.coordId, shader, context.polygonMode, ctx);

                        layer.unbind(shader, ctx);
                    }
                }
            }

            if (renderWireframe && gl.shaderStatus("wwhite")) {
                shader = gl.bindShader("wwhite");

                ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());
                ctx.uniform1i(shader.variables.u_texture, 0);

                instance.skeleton.bind(shader, ctx);

                ctx.depthMask(1);
                ctx.disable(ctx.BLEND);
                ctx.enable(ctx.CULL_FACE);

                for (i = 0, l = layers.length; i < l; i++) {
                    layer = layers[i];

                    if (instance.meshVisibilities[layer.geosetId] && layer.shouldRender(sequence, frame, counter) && this.shouldRenderGeoset(sequence, frame, counter, layer)) {
                        geoset = geosets[layer.geosetId];

                        geoset.renderWireframe(shader, ctx);
                    }
                }
            }
        }

        if (context.emittersMode && instance.particleEmitters && gl.shaderStatus(realShaderName)) {
            for (i = 0, l = instance.particleEmitters.length; i < l; i++) {
                instance.particleEmitters[i].render(context);
            }
        }

        ctx.depthMask(1);
        ctx.disable(ctx.BLEND);
        ctx.enable(ctx.CULL_FACE);
        ctx.enable(ctx.DEPTH_TEST);
    },

    renderEmitters: function (instance) {
        var context = instance.asyncInstance.context;
        var gl = context.gl;
        var ctx = gl.ctx;
        var i, l;
        var sequence = instance.sequence;
        var frame = instance.frame;
        var counter = instance.counter;
        var shader;

        if (instance.ribbonEmitters && gl.shaderStatus("wribbons")) {
            ctx.depthMask(1);
            ctx.disable(ctx.CULL_FACE);

            shader = gl.bindShader("wribbons");
            ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());
            ctx.uniform1i(shader.variables.u_texture, 0);

            for (i = 0, l = instance.ribbonEmitters.length; i < l; i++) {
                instance.ribbonEmitters[i].render(sequence, frame, counter, instance.textureMap, shader, context);
            }
        }

        if (instance.particleEmitters2 && gl.shaderStatus("wparticles")) {
            ctx.depthMask(0);
            ctx.enable(ctx.BLEND);
            ctx.disable(ctx.CULL_FACE);

            shader = gl.bindShader("wparticles");

            ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());
            ctx.uniform1i(shader.variables.u_texture, 0);

            for (i = 0, l = instance.particleEmitters2.length; i < l; i++) {
                instance.particleEmitters2[i].render(instance.textureMap, shader, context);
            }

            ctx.depthMask(1);
        }

        ctx.depthMask(1);
        ctx.disable(ctx.BLEND);
        ctx.enable(ctx.CULL_FACE);
    },

    renderBoundingShapes: function (instance) {
        var context = instance.asyncInstance.context;
        var gl = context.gl;
        var shader;

        if (this.boundingShapes && gl.shaderStatus("white")) {
            shader = gl.bindShader("white");

            for (i = 0, l = this.boundingShapes.length; i < l; i++) {
                this.boundingShapes[i].render(instance.skeleton, shader, gl);
            }
        }
    },

    renderColor: function (instance) {
        var context = instance.asyncInstance.context;
        var color = instance.asyncInstance.color;
        var gl = context.gl;
        var ctx = gl.ctx;
        var i, l;
        var sequence = instance.sequence;
        var frame = instance.frame;
        var counter = instance.counter;
        var layer, geoset, texture;
        var shader;
        var batch;
        var batches = this.batches;
        var textures = this.textures;

        if (batches && gl.shaderStatus("wcolor")) {
            shader = gl.bindShader("wcolor");

            ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());
            ctx.uniform3fv(shader.variables.u_color, color);

            instance.skeleton.bind(shader, ctx);

            for (i = 0, l = batches.length; i < l; i++) {
                batch = batches[i];
                geoset = batch.geoset;
                layer = batch.layer;

                if (instance.meshVisibilities[geoset.index] && this.shouldRender(sequence, frame, counter, geoset, layer)) {
                    texture = textures[layer.textureId];

                    // Layers with team glows tend to be big planes that aren't parts of the actual geometry, so avoid selecting them
                    if (!texture.source.match("teamglow")) {
                        geoset.renderColor(shader, ctx);
                    }
                }
            }
        }
    },

    shouldRender: function (sequence, frame, counter, geoset, layer) {
        var i, l, geosetAnimation, geosetAnimations = this.geosetAnimations;

        if (layer.getAlpha(sequence, frame, counter) < 0.75) {
            return false;
        }

        if (geoset.geosetAnimation && geoset.geosetAnimation.getAlpha(sequence, frame, counter) < 0.75) {
            return false;
        }

        return true;
    },

    bindTexture: function (modelTexture, instanceTexture, context) {
        var texture = instanceTexture || modelTexture;

        if (!context.teamColorsMode && asyncTexture.source.endsWith("00.blp")) {
            texture = null;
        }

        context.gl.bindTexture(texture, 0);
    }
});
