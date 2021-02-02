import precision from '../../shaders/precision.glsl';

const shader = `
${precision}

uniform sampler2D u_waterTexture;

varying vec2 v_uv;
varying vec4 v_color;

void main() {
  gl_FragColor = texture2D(u_waterTexture, v_uv) * v_color;
}
`;

export default shader;
