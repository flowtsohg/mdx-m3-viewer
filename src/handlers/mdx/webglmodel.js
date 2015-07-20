Mdx.WebGLModel = function (asyncModel, arrayBuffer, customPaths, context, onerror) {
    this.ctx = context.gl.ctx;
    this.geosets = [];

    this.setupShaders(context.gl);

    this.ready = true;
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

        var message = { id: asyncModel.id, type: "new-model", data: arrayBuffer };
        this.worker.postMessage(message, [message.data]);
    },

    gotMessage: function (type, data) {
        //console.log("[Mdx.WebGLModel::gotMessage]: " + type);
        //console.log(data);

        if (type === "new-geoset") {
            this.geosets.push(new Mdx.WebGLGeoset(data, this.ctx));
            //console.log(this);
        } else {
            console.log(data);
        }
    },

    render: function (instance, context, tint) {
        if (instance.skeleton) {
            var gl = context.gl;
            var ctx = gl.ctx;
            var i, l, v;

            var shader = gl.bindShader("wwhite");
            var polygonMode = context.polygonMode;

            var geosets = this.geosets;

            instance.skeleton.bind(shader);

            ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());

            for (i = 0, l = geosets.length; i < l; i++) {
                
                //ctx.uniform1i(shader.variables.u_texture, 0);

                //ctx.uniform4fv(shader.variables.u_modifier, [0, 0, 0, 0]);
                //ctx.uniform3fv(shader.variables.u_uv_offset, [0, 0, 0]);

                geosets[i].render(0, shader, context.polygonMode);
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
