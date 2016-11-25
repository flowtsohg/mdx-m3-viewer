const M3 = {
    initialize(env) {
        env.addHandler(Dds);
        env.addHandler(Tga);

        this.standardShader = env.webgl.createShaderProgram(env.sharedShaders.instanceId + env.sharedShaders.boneTexture + M3Shaders.vs_common + M3Shaders.vs_main, "#define STANDARD_PASS\n" + M3Shaders.ps_common + M3Shaders.ps_main);

        // If a shader failed to compile, don't allow the handler to be registered, and send an error instead.
        if (!this.standardShader.loaded) {
            return false;
        }

        const teamColors = [[255, 3, 3], [0, 66, 255], [28, 230, 185], [84, 0, 129], [255, 252, 1], [254, 138, 14], [32, 192, 0], [229, 91, 176], [149, 150, 151], [126, 191, 241], [16, 98, 70], [78, 42, 4], [40, 40, 40], [0, 0, 0]];

        this.lightPosition = [0, 0, 10000];

        this.teamColors = 14;

        const webgl = env.webgl,
            gl = env.gl;

        webgl.useShaderProgram(this.standardShader);

        for (let i = 0; i < 14; i++) {
            const color = teamColors[i];

            gl.uniform3fv(this.standardShader.uniforms.get("u_teamColors[" + i + "]"), [color[0] / 255, color[1] / 255, color[2] / 255]);
        }

        return true;
    },

    get extension() {
        return ".m3";
    },

    get Model() {
        return M3Model;
    },

    get ModelView() {
        return M3ModelView;
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
