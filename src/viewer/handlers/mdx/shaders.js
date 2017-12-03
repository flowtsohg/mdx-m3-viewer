const MdxShaders = {
    'vs_main': `
        uniform mat4 u_mvp;
        uniform vec2 u_uvScale;
        uniform vec3 u_teamColors[14];
        uniform bool u_hasLayerAnim;

        attribute vec3 a_position;
        attribute vec3 a_normal;
        attribute vec2 a_uv;
        attribute vec4 a_bones;
        attribute float a_boneNumber;
        attribute float a_teamColor;
        attribute vec4 a_vertexColor;
        attribute float a_geosetAlpha;
        attribute vec3 a_geosetColor;
        attribute float a_layerAlpha;
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

            if (u_hasLayerAnim) {
                /// TODO: This handles both texture animations (animated texture coordinates), and sprite animations.
                ///       It is kinda bugged.
                ///       In addition to being bugged, it should either be calculated in the fragment shader, or be used with texture arrays (WebGL2).
                v_uv = (a_uv + a_uvOffset.xy + a_uvOffset.zw) * u_uvScale;
            } else {
                v_uv = a_uv;
            }

            v_normal = normal;
	        v_teamColor = u_teamColors[int(a_teamColor)];
            v_vertexColor = a_vertexColor;
            
            /// Is the alpha here even correct?
            v_geosetColor = vec4(a_geosetColor, a_layerAlpha);
            
	        if (a_geosetAlpha < 0.75 || a_layerAlpha < 0.1) {
		        gl_Position = vec4(0.0);
            } else {
		        gl_Position = u_mvp * vec4(position, 1);
            }
        }
    `,

    'ps_main': `
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

    'vs_particles': `
        uniform mat4 u_mvp;
        uniform vec2 u_dimensions;
        uniform bool u_isRibbonEmitter;

        attribute vec3 a_position;
        attribute vec2 a_uva_rgb;

        varying vec2 v_uv;
        varying vec4 v_color;

        void main() {
            vec3 uva = decodeFloat3(a_uva_rgb[0]);
            vec3 rgb = decodeFloat3(a_uva_rgb[1]);
            vec2 uv = uva.xy;

            if (u_isRibbonEmitter) {
                uv /= 255.0;
            }

            v_uv = uv / u_dimensions;
            v_color = vec4(rgb, uva.z) / 255.0;

            gl_Position = u_mvp * vec4(a_position, 1);
        }
    `,

    'ps_particles': `
        uniform sampler2D u_texture;
        uniform bool u_alphaTest;
        uniform bool u_isRibbonEmitter;

        varying vec2 v_uv;
        varying vec4 v_color;

        void main() {
            vec4 texel = texture2D(u_texture, v_uv).bgra;

            // 1bit Alpha, used by ribbon emitters
            if (u_isRibbonEmitter && u_alphaTest && texel.a < 0.75) {
                discard;
            }

            gl_FragColor = texel * v_color;
        }
    `
};

export default MdxShaders;
