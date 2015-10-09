M3.Layer = function (material, layer, type, op) {
    var model = material.model;
    var pathSolver = model.asyncModel.pathSolver;
    var context = model.asyncModel.context;
    var gl = context.gl;

    this.active = false;

    // Since Gloss doesn't exist in all versions
    if (layer) {
        var uvSource = layer.uvSource;
        var flags = layer.flags;

        this.flags = flags;
        this.colorChannels = layer.colorChannels;

        this.model = model;
        this.type = type;
        this.op = op;

        var uvCoordinate = 0;

        if (uvSource === 1) {
            uvCoordinate = 1;
        } else if (uvSource === 9) {
            uvCoordinate = 2;
        } else if (uvSource === 10) {
            uvCoordinate = 3;
        }

        this.uvCoordinate = uvCoordinate;

        var uniform = "u_" + type;

        var settings = uniform + "LayerSettings.";

        this.uniforms = {
            map: uniform + "Map",
            enabled: settings + "enabled",
            op: settings + "op",
            channels: settings + "channels",
            teamColorMode: settings + "teamColorMode",
            invert: settings + "invert",
            clampResult: settings + "clampResult",
            uvCoordinate: settings + "uvCoordinate"
        };

        this.invert = flags & 0x10;
        this.clampResult = flags & 0x20;

        // I am not sure if the emissive team color mode is even used, since so far combineColors takes care of it.
        this.teamColorMode = (type === "diffuse") & 1;

        // The path is overrided with the lower case because some models have the same texture multiple times but with different letter cases, which causes multiple fetches = wasted bandwidth, memory and time.
        var source = layer.imagePath.toLowerCase();

        if (source !== "") {
            var realPath = pathSolver(source);

            this.source = source;

            model.textureMap[source] = realPath;

            var fileType = fileTypeFromPath(source);

            this.texture = context.loadTexture(realPath, fileType, false, { clampS: !(flags & 0x4), clampT: !(flags & 0x8) });

            this.active = true;
        }
    }
};

M3.Layer.prototype = {
    bind: function (unit, sequence, frame, textureMap, shader, context) {
        var ctx = context.gl.ctx;
        var variables = shader.variables;
        var uniforms = this.uniforms;

        if (this.active) {
            ctx.uniform1i(variables[uniforms.map], unit);

            this.model.bindTexture(this.texture, unit);

            ctx.uniform1f(variables[uniforms.enabled], 1);
            ctx.uniform1f(variables[uniforms.op], this.op);
            ctx.uniform1f(variables[uniforms.channels], this.colorChannels);
            ctx.uniform1f(variables[uniforms.teamColorMode], this.teamColorMode);

            // Alpha is probably unknown12. Can this be confirmed?
            // Many of these flags seem to be incorrect
            //gl.setParameter(uniform + "multAddAlpha", [this.model.getValue(this.rgbMultiply, sequence, frame), this.model.getValue(this.rgbAdd, sequence, frame), 0]);
            //gl.setParameter(uniform + "useAlphaFactor", 0);

            ctx.uniform1f(variables[uniforms.invert], this.invert);

            //gl.setParameter(uniform + "multColor", 0);
            //gl.setParameter(uniform + "addColor", 0);

            ctx.uniform1f(variables[uniforms.clampResult], this.clampResult);

            //gl.setParameter(uniform + "useConstantColor", this.flags && 0x400);
            //gl.setParameter(uniform + "constantColor", this.model.getValue(this.color, sequence, frame));
            //gl.setParameter(settings + "uvSource", this.uvSource);

            ctx.uniform1f(variables[uniforms.uvCoordinate], this.uvCoordinate);
        } else {
            ctx.uniform1f(variables[uniforms.enabled], 0);
        }
    },

    unbind: function (shader, ctx) {
        if (this.active) {
            ctx.uniform1f(shader.variables[this.uniforms.enabled], 0);
        }
    }
};
