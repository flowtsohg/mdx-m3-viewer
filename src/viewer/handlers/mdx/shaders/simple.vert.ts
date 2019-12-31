const shader = `
uniform mat4 u_VP;

attribute vec3 a_m0;
attribute vec3 a_m1;
attribute vec3 a_m2;
attribute vec3 a_m3;
attribute vec3 a_position;
attribute vec2 a_uv;

varying vec2 v_uv;

void main() {
  v_uv = a_uv;

  gl_Position = u_VP * mat4(a_m0, 0.0, a_m1, 0.0, a_m2, 0.0, a_m3, 1.0) * vec4(a_position, 1.0);
}
`;

export default shader;
