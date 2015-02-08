uniform sampler2D u_texture;
uniform bool u_alphaTest;
uniform vec4 u_modifier;

varying vec3 v_normal;
varying vec2 v_uv;

void main() {
    #ifdef STANDARD_PASS
    vec4 texel = texture2D(u_texture, v_uv).bgra;

    // 1bit Alpha
    if (u_alphaTest && texel.a < 0.75) {
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
