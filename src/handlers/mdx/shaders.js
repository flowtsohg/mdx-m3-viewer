const MdxShaders = {
    "vs_main": `
        uniform mat4 u_mvp;
        uniform vec2 u_uvScale;
        uniform vec3 u_teamColors[14];
        uniform bool u_isTextureAnim;

        attribute vec3 a_position;
        attribute vec3 a_normal;
        attribute vec2 a_uv;
        attribute vec4 a_bones;
        attribute float a_boneNumber;
        attribute float a_teamColor;
        attribute vec4 a_vertexColor;
        attribute float a_batchVisible;
        attribute vec4 a_geosetColor;
        attribute vec4 a_uvOffset;

        varying vec3 v_normal;
        varying vec2 v_uv;
        varying vec3 v_teamColor;
        varying vec4 v_vertexColor;
        varying vec4 v_geosetColor;

        void transform(inout vec3 position, inout vec3 normal, float boneNumber, vec4 bones) {
            mat4 b0 = fetchMatrix(bones[0], a_InstanceID);
            mat4 b1 = fetchMatrix(bones[1], a_InstanceID);
            mat4 b2 = fetchMatrix(bones[2], a_InstanceID);
            mat4 b3 = fetchMatrix(bones[3], a_InstanceID);
            vec4 p = vec4(position, 1);
            vec4 n = vec4(normal, 0);

            position = vec3(b0 * p + b1 * p + b2 * p + b3 * p) / boneNumber;
            normal = normalize(vec3(b0 * n + b1 * n + b2 * n + b3 * n));
        }

        void main() {
            vec2 uv = a_uv;
            vec3 position = a_position,
                 normal = a_normal;
            
            transform(position, normal, a_boneNumber, a_bones);

            if (u_isTextureAnim) {
                v_uv = (fract(a_uv + a_uvOffset.xy) + a_uvOffset.zw) * u_uvScale;
            } else {
                v_uv = a_uv;
            }

            v_normal = normal;
	        v_teamColor = u_teamColors[int(a_teamColor)];
	        v_vertexColor = a_vertexColor;
	        v_geosetColor = a_geosetColor;

	        if (a_batchVisible == 0.0) {
		        gl_Position = vec4(0.0);
            } else {
		        gl_Position = u_mvp * vec4(position, 1);
            }
        }
    `,

    "ps_main": `
        uniform sampler2D u_texture;
        uniform bool u_alphaTest;
        uniform float u_colorMode;

        varying vec3 v_normal;
        varying vec2 v_uv;
        varying vec3 v_teamColor;
        varying vec4 v_vertexColor;
        varying vec4 v_geosetColor;

        void main() {
            #ifdef STANDARD_PASS
	        vec4 texel;

	        if (u_colorMode == 1.0) {
		        texel = vec4(v_teamColor, 1.0);
            } else if (u_colorMode == 2.0) {
		        // Change the coordinate from [0, 1] to [-1, 1]
		        vec2 coord = (v_uv -0.5) * 2.0;

		        // Distance of the coordinate from the center
		        float dist = sqrt(dot(coord, coord));

		        // An estimation of the equation that created the team glow textures used by Warcraft 3
		        float factor = max(0.55 -dist, 0.0);

		        texel = vec4(factor * v_teamColor, 1.0);
            } else {
		        texel = texture2D(u_texture, v_uv).bgra;
            }

            // 1bit Alpha
            if (u_alphaTest && texel.a < 0.75) {
                discard;
            }

	        gl_FragColor = texel * v_geosetColor.bgra * v_vertexColor;
            #endif

            #ifdef UVS_PASS
            gl_FragColor = vec4(v_uv, 0.0, 1.0);
            #endif

            #ifdef NORMALS_PASS
            gl_FragColor = vec4(v_normal, 1.0);
            #endif

            #ifdef WHITE_PASS
            gl_FragColor = vec4(1.0);
            #endif
        }
    `,

    "vs_particles": `
        uniform mat4 u_mvp;
        uniform vec2 u_dimensions;

        attribute vec3 a_position;
        attribute vec2 a_uva_rgb;

        varying vec2 v_uv;
        varying vec4 v_color;

        void main() {
            vec3 uva = decodeFloat3(a_uva_rgb[0]);
            vec3 rgb = decodeFloat3(a_uva_rgb[1]);

            v_uv = uva.xy / u_dimensions;
            v_color = vec4(rgb, uva.z) / 255.0;

            gl_Position = u_mvp * vec4(a_position, 1);
        }
    `,

    "ps_particles": `
        uniform sampler2D u_texture;

        varying vec2 v_uv;
        varying vec4 v_color;

        void main() {
            gl_FragColor = texture2D(u_texture, v_uv).bgra * v_color;
        }
    `,

    "vs_ribbons": `
        uniform mat4 u_mvp;
        uniform vec2 u_dimensions;

        attribute vec3 a_position;
        attribute vec2 a_uva_rgb;

        varying vec2 v_uv;
        varying vec4 v_color;

        void main() {
            vec3 uva = decodeFloat3(a_uva_rgb[0]);
            vec3 rgb = decodeFloat3(a_uva_rgb[1]);

            v_uv = (uva.xy / 255.0) / u_dimensions;
            v_color = vec4(rgb, uva.z) / 255.0;

            gl_Position = u_mvp * vec4(a_position, 1);
    }
    `,

    "ps_ribbons": `
        uniform sampler2D u_texture;

        uniform bool u_alphaTest;

        varying vec2 v_uv;
        varying vec4 v_color;

        void main() {
	        vec4 texel = texture2D(u_texture, v_uv).bgra;

            // 1bit Alpha
            if (u_alphaTest && texel.a < 0.75) {
                discard;
            }

	        gl_FragColor = texel * v_color.rgba;
        }
    `,
};

export default MdxShaders;
