uniform mat4 u_mvp;
uniform mat4 u_orientation;
uniform vec2 u_dimensions;

attribute vec3 a_position;
attribute vec2 a_uv;
attribute vec3 a_instancePosition;
attribute vec3 a_instanceData;

varying vec2 v_uv;
varying vec4 v_color;

void main() {
    float size = a_instanceData[0];
    vec2 ia = decodeFloat2(a_instanceData[1]);
    vec3 rgb = decodeFloat3(a_instanceData[2]);
    vec2 uvCellSize = vec2(1) / u_dimensions;
    vec2 uvCell = vec2(mod(ia[0], u_dimensions[0]), floor(ia[0] / u_dimensions[1]));

    v_uv = (a_uv + uvCell) * uvCellSize;
    v_color = vec4(rgb, ia[1]) / 256.0;

    vec3 position = a_instancePosition + (u_orientation * vec4(a_position * size, 1)).rgb;

    gl_Position = u_mvp * vec4(position, 1);
}