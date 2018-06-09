export default {
  vs: `
    uniform mat4 u_mvp;
    uniform mat4 u_transform;

    attribute vec3 a_position;

    void main() {
      gl_Position = u_mvp * u_transform * vec4(a_position, 1.0);
    }
  `,
  ps: `
    uniform vec3 u_color;

    void main() {
      gl_FragColor = vec4(u_color, 1.0);
    }
  `,
};
