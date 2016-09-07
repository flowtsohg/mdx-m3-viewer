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
        attribute float a_bone_number;

        attribute float a_teamColor;
        attribute vec3 a_tintColor;

        attribute float a_InstanceID;

        attribute float a_batchVisible;
        attribute vec4 a_geosetColor;
        attribute vec4 a_uvOffset;

        varying vec3 v_normal;
        varying vec2 v_uv;
        varying vec3 v_teamColor;
        varying vec3 v_tintColor;
        varying vec4 v_geosetColor;

        void transform(vec3 inposition, vec3 innormal, float bone_number, vec4 bones, out vec3 outposition, out vec3 outnormal) {
            vec4 position = vec4(inposition, 1);
            vec4 normal = vec4(innormal, 0);
            vec4 temp;

	        mat4 bone0 = boneAtIndex(bones[0], a_InstanceID);
	        mat4 bone1 = boneAtIndex(bones[1], a_InstanceID);
	        mat4 bone2 = boneAtIndex(bones[2], a_InstanceID);
	        mat4 bone3 = boneAtIndex(bones[3], a_InstanceID);

            temp = vec4(0);
            temp += bone0 * position;
            temp += bone1 * position;
            temp += bone2 * position;
            temp += bone3 * position;
            temp /= bone_number;
            outposition = vec3(temp);

            temp = vec4(0);
            temp += bone0 * normal;
            temp += bone1 * normal;
            temp += bone2 * normal;
            temp += bone3 * normal;
            outnormal = normalize(vec3(temp));
        }

        void main() {
            vec3 position, normal;

            transform(a_position, a_normal, a_bone_number, a_bones, position, normal);

	        v_normal = normal;

            vec2 uv = a_uv;

            if (u_isTextureAnim) {
                v_uv = (fract(a_uv +a_uvOffset.xy) +a_uvOffset.zw) * u_uvScale;
            } else {
                v_uv = a_uv;
            }

	        v_teamColor = u_teamColors[int(a_teamColor)];
	        v_tintColor = a_tintColor;

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
        uniform vec4 u_modifier;

        varying vec3 v_normal;
        varying vec2 v_uv;

        uniform bool u_isTeamColor;
        uniform bool u_isTeamGlow;
        varying vec3 v_teamColor;

        varying vec3 v_tintColor;

        varying vec4 v_geosetColor;

        void main() {
            #ifdef STANDARD_PASS
	        vec4 texel;

	        if (u_isTeamColor) {
		        texel = vec4(v_teamColor, 1.0);
            } else if (u_isTeamGlow) {
		        // Change the coordinate from [0, 1] to [-1, 1]
		        vec2 coord = (v_uv -0.5) * 2.0;

		        // Distance of the coordinate from the center
		        float dist = sqrt(coord.x * coord.x +coord.y * coord.y);

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

	        gl_FragColor = texel * v_geosetColor * vec4(v_tintColor, 1.0);
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
        uniform vec3 u_uv_offset;

        attribute vec3 a_position;
        attribute vec2 a_uv;

        varying vec2 v_uv;

        void main() {
            v_uv = a_uv + u_uv_offset.xy;

            gl_Position = u_mvp * vec4(a_position, 1.0);
        }
    `
};
