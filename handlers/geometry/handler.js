const Geometry = {
    initialize(env) {
        this.shader = env.webgl.createShaderProgram(
            env.sharedShaders.boneTexture + env.sharedShaders.instanceId + `
                uniform mat4 u_mvp;
                uniform vec2 u_uvScale;

                attribute vec3 a_position;
                attribute vec2 a_uv;

                varying vec2 v_uv;

                void main() {
                    v_uv = a_uv * u_uvScale;
                    gl_Position = u_mvp * boneAtIndex(0.0, a_InstanceID) * vec4(a_position, 1.0);
                }
            `,
            `
                uniform sampler2D u_diffuseMap;

                uniform vec3 u_color;
                uniform float u_isBGR;

                varying vec2 v_uv;

                void main() {
                    vec4 texel = texture2D(u_diffuseMap, v_uv);
                    vec4 color = vec4(u_color, 0.0);

                    if (u_isBGR > 0.0) {
                        texel = texel.bgra;
                    }

                    gl_FragColor = color + texel;
                }
            `
        );
    },

    get extension() {
        return ".geo";
    },

    get Model() {
        return GeometryModel;
    },

    get Instance() {
        return GeometryModelInstance;
    },

    get Bucket() {
        return GeometryBucket;
    },
};

mix(Geometry, ModelHandler);
