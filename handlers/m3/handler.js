const M3 = {
    initialize(env) {
        env.addHandler(Dds);
        env.addHandler(Tga);

        this.teamColorValues = [[255, 3, 3], [0, 66, 255], [28, 230, 185], [84, 0, 129], [255, 252, 1], [254, 138, 14], [32, 192, 0], [229, 91, 176], [149, 150, 151], [126, 191, 241], [16, 98, 70], [78, 42, 4], [40, 40, 40], [0, 0, 0]];
        this.teamColors = 14;

        this.lightPosition = [0, 0, 10000];

        for (let i = 0; i < 4; i++) {
            let shader = env.webgl.createShaderProgram("#define EXPLICITUV" + i + "\n" + env.sharedShaders.instanceId + env.sharedShaders.boneTexture + M3Shaders.vs_common + M3Shaders.vs_main, "#define STANDARD_PASS\n" + M3Shaders.ps_common + M3Shaders.ps_main);

            // If a shader failed to compile, don't allow the handler to be registered, and send an error instead.
            if (!shader.loaded) {
                return false;
            }

            this.initializeTeamColors(env, shader);

            env.shaderMap.set("M3StandardShader" + i, shader);
        }

        return true;
    },

    initializeTeamColors(env, shader) {
        let webgl = env.webgl,
            gl = env.gl,
            teamColors = this.teamColorValues;

        webgl.useShaderProgram(shader);

        for (let i = 0; i < 14; i++) {
            let color = teamColors[i];

            gl.uniform3fv(shader.uniforms.get("u_teamColors[" + i + "]"), [color[0] / 255, color[1] / 255, color[2] / 255]);
        }
    },

    get extension() {
        return ".m3";
    },

    get Constructor() {
        return M3Model;
    },

    get ModelView() {
        return TexturedModelView;
    },

    get Instance() {
        return M3ModelInstance;
    },

    get Bucket() {
        return M3Bucket;
    },

    get binaryFormat() {
        return true;
    }
};

mix(M3, ModelHandler);
