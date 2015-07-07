uniform mat4 u_mvp;
uniform vec3 u_uv_offset;

attribute vec3 a_position;
attribute vec2 a_uv;

varying vec2 v_uv;

void main() {
    v_uv = a_uv + u_uv_offset.xy;

    gl_Position = u_mvp * vec4(a_position, 1);
}
