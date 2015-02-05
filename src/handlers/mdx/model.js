function Model(arrayBuffer, textureMap, context, onerror) {
    BaseModel.call(this, textureMap);

    var parser = Parser(new BinaryReader(arrayBuffer));

    if (context.debugMode) {
        console.log(parser);
    }

    if (parser) {
        this.setup(parser, context);
    }
}

Model.prototype = extend(BaseModel.prototype, {
    setup: function (parser, context) {
        var gl = context.gl;
        var objects, i, l, j, k;

        this.parser = parser;
        this.name = parser.modelChunk.name;
        this.sequences = [];
        this.textures = [];
        this.meshes = [];
        this.cameras = [];
        this.particleEmitters = [];
        this.particleEmitters2 = [];
        this.ribbonEmitters = [];
        this.boundingShapes = [];
        this.attachments = [];

        if (parser.textureChunk) {
            objects = parser.textureChunk.objects;

            for (i = 0, l = objects.length; i < l; i++) {
                this.loadTexture(objects[i], this.textureMap, gl);
            }
        }

        if (parser.sequenceChunk) {
            this.sequences = parser.sequenceChunk.objects;
        }

        if (parser.globalSequenceChunk) {
            this.globalSequences = parser.globalSequenceChunk.objects;
        }

        var nodes = parser.nodes;
        var pivots;

        if (parser.pivotPointChunk) {
            pivots = parser.pivotPointChunk.objects;
        } else {
            pivots = [[0, 0, 0]];
        }

        this.nodes = [];

        for (i = 0, l = nodes.length; i < l; i++) {
            this.nodes[i] = new Node(nodes[i], this, pivots);
        }

        if (this.nodes.length === 0) {
            this.nodes[0] = new Node({objectId: 0, parentId: 0xFFFFFFFF}, this, pivots);
        }
        
        // This list is used to access all the nodes in a loop while keeping the hierarchy in mind.
        this.hierarchy = [];
        this.setupHierarchy(-1);

        this.sortedNodes = [];

        for (i = 0, l = nodes.length; i < l; i++) {
            this.sortedNodes[i] = this.nodes[this.hierarchy[i]];
        }

        if (parser.boneChunk) {
            this.bones = parser.boneChunk.objects;
        }

        if (parser.materialChunk) {
            this.materials = parser.materialChunk.objects;
        }

        if (parser.geosetChunk) {
            var geosets = parser.geosetChunk.objects;
            var groups = [[], [], [], []];

            for (i = 0, l = geosets.length; i < l; i++) {
                var g = geosets[i];
                var layers = this.materials[g.materialId].layers;

                this.meshes.push(new Geoset(g, gl.ctx));

                for (j = 0, k = layers.length; j < k; j++) {
                    var layer = new Layer(layers[j], i, this);

                    groups[layer.renderOrder].push(layer);
                }
            }

            this.layers = groups[0].concat(groups[1]).concat(groups[2]).concat(groups[3]);
        }

        if (parser.cameraChunk) {
            objects = parser.cameraChunk.objects;

            this.cameras = [];
            
            for (i = 0, l = objects.length; i < l; i++) {
                this.cameras[i] = new Camera(objects[i], this);
            }
        }

        if (parser.geosetAnimationChunk) {
            objects = parser.geosetAnimationChunk.objects;

            this.geosetAnimations = [];

            for (i = 0, l = objects.length; i < l; i++) {
                this.geosetAnimations[i] = new GeosetAnimation(objects[i], this);
            }
        }

        if (parser.textureAnimationChunk) {
            objects = parser.textureAnimationChunk.objects;

            this.textureAnimations = [];

            for (i = 0, l = objects.length; i < l; i++) {
                this.textureAnimations[i] = new TextureAnimation(objects[i], this);
            }
        }

        if (parser.particleEmitterChunk) {
            this.particleEmitters = parser.particleEmitterChunk.objects;
        }

        if (parser.particleEmitter2Chunk) {
            this.particleEmitters2 = parser.particleEmitter2Chunk.objects;
        }

        if (parser.ribbonEmitterChunk) {
            this.ribbonEmitters = parser.ribbonEmitterChunk.objects;
        }

        if (parser.collisionShapeChunk) {
            objects = parser.collisionShapeChunk.objects;

            for (i = 0, l = objects.length; i < l; i++) {
                this.boundingShapes[i] = new CollisionShape(objects[i], this.nodes, gl);
            }
        }

        if (parser.attachmentChunk) {
            objects = parser.attachmentChunk.objects;

            for (i = 0, l = objects.length; i < l; i++) {
                this.attachments[i] = new Attachment(objects[i], this);
            }
        }
        
        // Avoid heap allocations in render()
        this.modifier = vec4.create();
        this.uvoffset = vec3.create();
        this.defaultUvoffset = vec3.create();
        this.tempVec3 = vec3.create();

        this.ready = true;

        this.setupShaders(parser, gl);
        this.setupTeamColors(gl);
    },

    setupShaders: function (parser, gl) {
        var psmain = SHADERS["wpsmain"];

        if ((parser.geosetChunk || parser.particleEmitterChunk) && !gl.shaderStatus("wstandard")) {
            gl.createShader("wstandard", SHADERS.vsbonetexture + SHADERS.wvsmain, psmain, ["STANDARD_PASS"]);
            gl.createShader("wuvs", SHADERS.vsbonetexture + SHADERS.wvsmain, psmain, ["UVS_PASS"]);
            gl.createShader("wnormals", SHADERS.vsbonetexture + SHADERS.wvsmain, psmain, ["NORMALS_PASS"]);
            gl.createShader("wwhite", SHADERS.vsbonetexture + SHADERS.wvswhite, SHADERS.pswhite);
        }

        // Load the particle emitters type 2 shader if it is needed
        if (parser.particleEmitter2Chunk && !gl.shaderStatus("wparticles")) {
            gl.createShader("wparticles", SHADERS.decodefloat + SHADERS.wvsparticles, SHADERS.wpsparticles);
        }

        // Load the ribbon emitters shader if it is needed
        if (parser.ribbonEmitterChunk && !gl.shaderStatus("wribbons")) {
            gl.createShader("wribbons", SHADERS.wvsribbons, psmain, ["STANDARD_PASS"]);
        }

        // Load the color shader if it is needed
        if (!gl.shaderStatus("wcolor")) {
            gl.createShader("wcolor", SHADERS.vsbonetexture + SHADERS.wvscolor, SHADERS.pscolor);
        }
    },

    setupTeamColors: function (gl) {
        var i,
            number;

        for (i = 0; i < 13; i++) {
            number = ((i < 10) ? "0" + i : i);

            gl.loadTexture(urls.mpqFile("replaceabletextures/teamcolor/teamcolor" + number + ".blp"));
            gl.loadTexture(urls.mpqFile("replaceabletextures/teamglow/teamglow" + number + ".blp"));
        }
    },

    loadTexture: function (texture, textureMap, gl) {
        var source = texture.path;
        var path;
        var replaceableId = texture.replaceableId;

        if (replaceableId !== 0) {
            source = "replaceabletextures/" + replaceableIdToName[replaceableId] + ".blp";
        }

        source = source.replace(/\\/g, "/").toLowerCase();

        this.textures.push(source);

        if (textureMap[source]) {
            path = textureMap[source];
        } else {
            path = urls.mpqFile(source);
        }

        this.textureMap[source] = path;

        gl.loadTexture(path);
    },

    setupHierarchy: function (parent) {
        var nodes = this.nodes,
            node,
            i,
            l;
        
        for (i = 0, l = nodes.length; i < l; i++) {
            node = nodes[i];

            if (node.parentId === parent) {
                this.hierarchy.push(i);

                this.setupHierarchy(node.objectId);
            }
        }
    },

    render: function (instance, context) {
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
        var layers = this.layers;
        var polygonMode = context.polygonMode;
        var renderGeosets = (polygonMode === 1 || polygonMode === 3);
        var renderWireframe = (polygonMode === 2 || polygonMode === 3);
        
        if (layers) {
            var geosets = this.meshes;
            var geoset;
            var layer;
            
            if (renderGeosets && gl.shaderStatus(realShaderName)) {
                var modifier = this.modifier;
                var uvoffset = this.uvoffset;
                var textureId;
                var textures = this.textures;
                var defaultUvoffset = this.defaultUvoffset;
                var tempVec3 = this.tempVec3;

                shader = gl.bindShader(realShaderName);

                ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());
                ctx.uniform1i(shader.variables.u_texture, 0);

                instance.skeleton.bind(shader, ctx);

                for (i = 0, l = layers.length; i < l; i++) {
                    layer = layers[i];

                    if (instance.meshVisibilities[layer.geosetId] && layer.shouldRender(sequence, frame, counter) && this.shouldRenderGeoset(sequence, frame, counter, layer)) {
                        geoset = geosets[layer.geosetId];

                        modifier[0] = 1;
                        modifier[1] = 1;
                        modifier[2] = 1;
                        modifier[3] = 1;

                        uvoffset[0] = 0;
                        uvoffset[1] = 0;
                        uvoffset[2] = 0;

                        layer.setMaterial(shader, ctx);

                        textureId = getSDValue(sequence, frame, counter, layer.sd.textureId, layer.textureId);

                        this.bindTexture(textures[textureId], 0, instance.textureMap, context);

                        if (this.geosetAnimations) {
                            for (var j = this.geosetAnimations.length; j--;) {
                                var geosetAnimation = this.geosetAnimations[j];
                                
                                if (geosetAnimation) {
                                    if (geosetAnimation.geosetId === layer.geosetId) {
                                        tempVec3 = getSDValue(sequence, frame, counter, geosetAnimation.sd.color, geosetAnimation.color, tempVec3);

                                        modifier[0] = tempVec3[0];
                                        modifier[1] = tempVec3[1];
                                        modifier[2] = tempVec3[2];
                                    }
                                }
                            }
                        }

                        modifier[3] = getSDValue(sequence, frame, counter, layer.sd.alpha, layer.alpha);

                        ctx.uniform4fv(shader.variables.u_modifier, modifier);

                        if (layer.textureAnimationId !== -1 && this.textureAnimations) {
                            var textureAnimation = this.textureAnimations[layer.textureAnimationId];
                            
                            if (textureAnimation) {
                                // What is Z used for?
                                uvoffset = getSDValue(sequence, frame, counter, textureAnimation.sd.translation, defaultUvoffset, uvoffset);
                            }

                        }

                        ctx.uniform3fv(shader.variables.u_uv_offset, uvoffset);

                        geoset.render(layer.coordId, shader, context.polygonMode, ctx);
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
    },

    renderEmitters: function (instance, context) {
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

    renderBoundingShapes: function (instance, context) {
        var gl = context.gl;
        var shader;

        if (this.boundingShapes && gl.shaderStatus("white")) {
            shader = gl.bindShader("white");

            for (i = 0, l = this.boundingShapes.length; i < l; i++) {
                this.boundingShapes[i].render(instance.skeleton, shader, gl);
            }
        }
    },

    renderColor: function (instance, color, context) {
        var gl = context.gl;
        var ctx = gl.ctx;
        var i, l;
        var sequence = instance.sequence;
        var frame = instance.frame;
        var counter = instance.counter;
        var layer, geoset, texture;
        var shader;
        var layers = this.layers;

        if (layers && gl.shaderStatus("wcolor")) {
            shader = gl.bindShader("wcolor");

            ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());
            ctx.uniform3fv(shader.variables.u_color, color);

            instance.skeleton.bind(shader, ctx);

            for (i = 0, l = layers.length; i < l; i++) {
                layer = layers[i];

                if (instance.meshVisibilities[layer.geosetId] && layer.shouldRender(sequence, frame, counter) && this.shouldRenderGeoset(sequence, frame, counter, layer)) {
                    geoset = this.meshes[layer.geosetId];
                    
                    // Avoid rendering planes.
                    // Thsy are usually team glows, or other large mostly-transparent things.
                    if (geoset.elements > 6) {
                        geoset.renderColor(shader, ctx);
                    }
                }
            }
        }
    },

    shouldRenderGeoset: function (sequence, frame, counter, layer) {
        var i, l, geosetAnimation, geosetAnimations = this.geosetAnimations;

        if (geosetAnimations) {
            for (i = 0, l = geosetAnimations.length; i < l; i++) {
                geosetAnimation = geosetAnimations[i];

                if (geosetAnimation.geosetId === layer.geosetId && geosetAnimation.sd.alpha) {
                    // This handles issues when there are multiple geoset animations for one geoset.
                    // This is a bug, but the game supports it.
                    if (getSDValue(sequence, frame, counter, geosetAnimation.sd.alpha) < 0.75) {
                        return false;
                    }
                }
            }
        }

        return true;
    },

    bindTexture: function (source, unit, textureMap, context) {
        var texture;

        // Must be checked against undefined, because empty strings evaluate to false
        if (this.textureMap[source] !== undefined) {
            texture = this.textureMap[source];
        }

        // Must be checked against undefined, because empty strings evaluate to false
        if (textureMap[source] !== undefined) {
            texture = textureMap[source];   
        }

        if (!context.teamColorsMode && source.endsWith("00.blp")) {
            texture = null;
        }

        context.gl.bindTexture(texture, unit);
    }
});