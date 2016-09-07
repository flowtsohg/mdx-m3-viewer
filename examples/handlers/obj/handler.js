const Obj = {
    // One-time initialization, called when adding the handler.
    // This is the place to run things that this handler needs, whether it's creating shaders, adding other handles, etc.
    initialize(env) {
        this.shader = env.webgl.createShaderProgram(
            "uniform mat4 u_mvp; uniform mat4 u_transform; attribute vec3 a_position; void main() { gl_Position = u_mvp * u_transform * vec4(a_position, 1.0); }",
            "uniform vec3 u_color; void main() { gl_FragColor = vec4(u_color, 1.0); }");
    },

    get extension() {
        return ".obj";
    },

    get Model() {
        return ObjModel;
    },

    get Instance() {
        return ObjModelInstance;
    }
};

mix(Obj, ModelHandler);
