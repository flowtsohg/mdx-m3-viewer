uniform sampler2D u_texture;
uniform float u_a;

varying vec2 v_uv;

void main() {
    gl_FragColor = vec4(texture2D(u_texture, v_uv).rgb, u_a);
}
