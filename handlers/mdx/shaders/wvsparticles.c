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
