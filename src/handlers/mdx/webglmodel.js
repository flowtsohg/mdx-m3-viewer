Mdx.WebGLModel = function (asyncModel, arrayBuffer, customPaths, context, onerror) {
    this.ctx = context.gl.ctx;
    this.geosets = [];
    this.layers = [];
    this.batches = [];
    this.textures = [];

    this.setupShaders(context.gl);

    this.ready = true;

    this.heap3 = vec3.create();
    this.heap4 = vec4.create();
};

Mdx.WebGLModel.prototype = extend(BaseModel.prototype, {
    setupShaders: function (gl) {
        var psmain = SHADERS["wpsmain"];

        if (!gl.shaderStatus("wstandard")) {
            gl.createShader("wstandard", SHADERS.vsbonetexture + SHADERS.wvsmain, psmain, ["STANDARD_PASS"]);
            //gl.createShader("wuvs", SHADERS.vsbonetexture + SHADERS.wvsmain, psmain, ["UVS_PASS"]);
            //gl.createShader("wnormals", SHADERS.vsbonetexture + SHADERS.wvsmain, psmain, ["NORMALS_PASS"]);
            gl.createShader("wwhite", SHADERS.vsbonetexture + SHADERS.wvswhite, SHADERS.pswhite);
        }

        //// Load the particle emitters type 2 shader if it is needed
        //if (!gl.shaderStatus("wparticles")) {
        //    gl.createShader("wparticles", SHADERS.decodefloat + SHADERS.wvsparticles, SHADERS.wpsparticles);
        //}

        //// Load the ribbon emitters shader if it is needed
        //if (!gl.shaderStatus("wribbons")) {
        //    gl.createShader("wribbons", SHADERS.wvsribbons, psmain, ["STANDARD_PASS"]);
        //}

        //// Load the color shader if it is needed
        //if (!gl.shaderStatus("wcolor")) {
        //    gl.createShader("wcolor", SHADERS.vsbonetexture + SHADERS.wvscolor, SHADERS.pscolor);
        //}
    },

    initWorker: function (asyncModel, arrayBuffer, customPaths, context) {
        this.worker = context.getWorker();
        this.asyncModel = asyncModel;

        var message = { id: asyncModel.id, type: WORKER_NEW_MODEL, data: arrayBuffer };
        this.worker.postMessage(message, [message.data]);
    },

    gotMessage: function (type, data) {
        //console.log("[Mdx.WebGLModel::gotMessage]: " + type);
        //console.log(data);

        if (type === WORKER_NEW_GEOSET) {
            this.geosets.push(new Mdx.WebGLGeoset(data, this.ctx));
        } else if (type === WORKER_NEW_LAYER) {
            this.layers.push(new Mdx.WebGLLayer(data, this.ctx));
        } else if (type === WORKER_NEW_BATCHES) {
            this.batches = data;
        } else if (type === WORKER_NEW_TEXTURES) {
            var asyncModel = this.asyncModel;
            var customPaths = asyncModel.customPaths;
            var gl = asyncModel.context.gl;

            for (var i = 0, l = data.length; i < l; i++) {
                var path = customPaths(data[i]);
                var fileType = fileTypeFromPath(path);

                this.textures[i] = gl.loadTexture(path, fileType);
            }
        } else if (type === WORKER_NEW_SEQUENCES) {
            this.sequences = data;
        } else {
            console.log(this.asyncModel.id, data);
        }
    },

    render: function (instance, context, tint) {
        if (instance.batchVisibilities) {
            var gl = context.gl;
            var ctx = gl.ctx;
            var i, l;

            var shader = gl.bindShader("wstandard");

            var geosets = this.geosets;
            var layers = this.layers;
            var batches = this.batches;
            var geoset, layer, batch;

            var textures = this.textures;

            var heap3 = this.heap3;
            var heap4 = this.heap4;

            var batchVisibilities = instance.batchVisibilities;

            instance.skeleton.bind(shader);

            ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());

            for (i = 0, l = batches.length; i < l; i++) {
                if (batchVisibilities[i]) {
                    batch = batches[i];
                    layer = layers[batch[0]];
                    geoset = geosets[batch[1]];

                    ctx.uniform1i(shader.variables.u_texture, 0);
                    gl.bindTexture(textures[layer.textureId], 0);

                    heap3[0] = 0;
                    heap3[1] = 0;
                    heap3[2] = 0;

                    heap4[0] = 1;
                    heap4[1] = 1;
                    heap4[2] = 1;
                    heap4[3] = 1;

                    ctx.uniform3fv(shader.variables.u_uv_offset, heap3);
                    ctx.uniform4fv(shader.variables.u_modifier, heap4);

                    ctx.uniform4fv(shader.variables.u_tint, tint);

                    layer.bind(shader);

                    geoset.render(shader, layer.coordId);

                    layer.unbind(shader);
                }
            }
        }
    },

    renderEmitters: function (instance, context) {
       
    },

    renderBoundingShapes: function (instance, context) {
       
    },

    renderColor: function (instance, color, context) {
      
    }
});
