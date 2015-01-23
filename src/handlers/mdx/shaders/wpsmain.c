uniform sampler2D u_texture;
uniform bvec3 u_type;
uniform vec4 u_modifier;

varying vec3 v_normal;
varying vec2 v_uv;

void main() {
    #ifdef STANDARD_PASS
    vec4 texel = texture2D(u_texture, v_uv);

    if (u_type[0] && texel.a < 0.7) {
        discard;
    }

    if (u_type[1] && texel.r < 0.2 && texel.g < 0.2 && texel.b < 0.2) {
        discard;
    }

    if (u_type[2] && texel.r > .9 && texel.g > 0.9 && texel.b > 0.9) {
        discard;
    }

    gl_FragColor = texel * u_modifier;
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
