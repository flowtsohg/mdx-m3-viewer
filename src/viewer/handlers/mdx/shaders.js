export default {
  'vs_main': `
        uniform mat4 u_mvp;

        attribute vec3 a_position;
        attribute vec3 a_normal;
        attribute vec2 a_uv;
        attribute vec4 a_bones;
        attribute float a_boneNumber;
        attribute float a_teamColor;
        attribute vec4 a_vertexColor;
        attribute vec4 a_geosetColor;
        attribute float a_layerAlpha;
        attribute vec4 a_uvOffset;
        attribute float a_uvScale;
        attribute vec2 a_uvRot;

        varying vec3 v_normal;
        varying vec2 v_uv;
        varying float v_teamColor;
        varying vec4 v_vertexColor;
        varying vec4 v_geosetColor;
        varying vec4 v_uvOffset;
        varying float v_uvScale;
        varying vec2 v_uvRot;

        void transform(inout vec3 position, inout vec3 normal, float boneNumber, vec4 bones) {
            // For the broken models out there, since the game supports this.
            if (boneNumber > 0.0) {
                mat4 b0 = fetchMatrix(bones[0], a_InstanceID);
                mat4 b1 = fetchMatrix(bones[1], a_InstanceID);
                mat4 b2 = fetchMatrix(bones[2], a_InstanceID);
                mat4 b3 = fetchMatrix(bones[3], a_InstanceID);
                vec4 p = vec4(position, 1);
                vec4 n = vec4(normal, 0);

                position = vec3(b0 * p + b1 * p + b2 * p + b3 * p) / boneNumber;
                normal = normalize(vec3(b0 * n + b1 * n + b2 * n + b3 * n));
            }
        }

        void main() {
            vec2 uv = a_uv;
            vec3 position = a_position;
            vec3 normal = a_normal;
            
            transform(position, normal, a_boneNumber, a_bones);

            v_uv = a_uv;
            v_uvOffset = a_uvOffset;
            v_uvScale = a_uvScale;
            v_uvRot = a_uvRot;

            v_normal = normal;
            v_teamColor = a_teamColor;
            v_vertexColor = a_vertexColor;
            
            /// Is the alpha here even correct?
            v_geosetColor = vec4(a_geosetColor.rgb, a_layerAlpha);

            // Definitely not correct, but the best I could figure so far.
         if (a_geosetColor.a < 0.75 || a_layerAlpha < 0.1) {
              gl_Position = vec4(0.0);
            } else {
              gl_Position = u_mvp * vec4(position, 1);
            }
        }
    `,

  'ps_main': `
        uniform sampler2D u_texture;
        uniform bool u_alphaTest;
        uniform bool u_isTeamColor;
        uniform vec2 u_uvScale;
        uniform bool u_hasSlotAnim;
        uniform bool u_hasTranslationAnim;
        uniform bool u_hasRotationAnim;
        uniform bool u_hasScaleAnim;

        varying vec3 v_normal;
        varying vec2 v_uv;
        varying float v_teamColor;
        varying vec4 v_vertexColor;
        varying vec4 v_geosetColor;
        varying vec4 v_uvOffset;
        varying float v_uvScale;
        varying vec2 v_uvRot;

        // A 2D quaternion*vector.
        // q is the zw components of the original quaternion.
        vec2 transformQuat(vec2 v, vec2 q) {
            float ix = q.y * v.x - q.x * v.y,
                  iy = q.y * v.y + q.x * v.x;
                  
            return vec2(ix * q.y + iy * -q.x, iy * q.y - ix * - q.x);
        }

        void main() {
            #ifdef STANDARD_PASS
            vec2 uv;

         if (u_isTeamColor) {
                // 4 is the amount of columns and rows in the team colors/glows texture.
                uv = (vec2(mod(v_teamColor, 4.0), floor(v_teamColor / 4.0)) + v_uv) / 4.0;
            } else {
                uv = v_uv;

                // Translation animation
                if (u_hasTranslationAnim) {
                    uv += v_uvOffset.xy;
                }

                // Rotation animation
                if (u_hasRotationAnim) {
                    uv = transformQuat(uv - 0.5, v_uvRot) + 0.5;
                }

                // Scale animation
                if (u_hasScaleAnim) {
                    uv = v_uvScale * (uv - 0.5) + 0.5;
                }

                // Sprite animation
                if (u_hasSlotAnim) {
                    uv = (v_uvOffset.zw + fract(uv)) * u_uvScale;
                }
            }

            vec4 texel = texture2D(u_texture, uv).bgra;

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
    `,
};
