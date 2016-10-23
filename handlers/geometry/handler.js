const Geometry = {
    initialize(env) {
        this.shader = env.webgl.createShaderProgram(
            env.sharedShaders.boneTexture + env.sharedShaders.instanceId + `
                uniform mat4 u_mvp;
                uniform vec2 u_uvScale;

                attribute vec3 a_position;
                attribute vec2 a_uv;
                attribute vec3 a_color;

                varying vec2 v_uv;
                varying vec3 v_color;

                void main() {
                    v_uv = a_uv * u_uvScale;
                    v_color = a_color;

                    gl_Position = u_mvp * boneAtIndex(0.0, a_InstanceID) * vec4(a_position, 1.0);
                }
            `,
            `
                uniform sampler2D u_diffuseMap;
                uniform bool u_isBGR;
                uniform bool u_isEdge;

                varying vec2 v_uv;
                varying vec3 v_color;

                void main() {
                    if (u_isEdge) {
                        gl_FragColor = vec4(1.0);
                    } else {
                        vec4 texel = texture2D(u_diffuseMap, v_uv);
                        vec4 color = vec4(v_color, 0.0);

                        if (u_isBGR) {
                            texel = texel.bgra;
                        }

                        gl_FragColor = color + texel;
                    }
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
