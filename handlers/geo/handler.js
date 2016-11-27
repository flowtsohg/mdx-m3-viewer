const Geo = {
    initialize(env) {
        this.shader = env.webgl.createShaderProgram(
            env.sharedShaders.boneTexture + env.sharedShaders.instanceId + `
                uniform mat4 u_mvp;
                uniform vec2 u_uvOffset;
                uniform vec2 u_uvScale;

                attribute vec3 a_position;
                attribute vec2 a_uv;
                attribute vec2 a_uvScale;
                attribute vec3 a_color;

                varying vec2 v_uv;
                varying vec3 v_color;

                void main() {
                    v_uv = a_uv * u_uvScale + u_uvOffset;
                    v_color = a_color;

                    gl_Position = u_mvp * boneAtIndex(0.0, a_InstanceID) * vec4(a_position, 1.0);
                }
            `,
            `
                uniform sampler2D u_diffuseMap;
                uniform bool u_isBGR;
                uniform bool u_isEdge;
                uniform float u_alphaMod;

                varying vec2 v_uv;
                varying vec3 v_color;

                void main() {
                    vec4 color = vec4(v_color, 1.0);

                    if (u_isEdge) {
                        gl_FragColor = color;
                    } else {
                        vec4 texel = texture2D(u_diffuseMap, v_uv);

                        if (u_isBGR) {
                            texel = texel.bgra;
                        }

                        //gl_FragColor = color * texel;

                        //gl_FragColor.a *= u_alphaMod;

                        gl_FragColor = color + texel;
                    }
                }
            `
        );

        // If a shader failed to compile, don't allow the handler to be registered, and send an error instead.
        if (!this.shader.loaded) {
            return false;
        }

        return true;
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

    pathSolver(src) {
        return [src, ".geo", false];
    }
};

mix(Geo, ModelHandler);
