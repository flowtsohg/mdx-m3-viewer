import precision from '../../shaders/precision.glsl';

const shader = `
${precision}

#define EMITTER_PARTICLE2 0
#define EMITTER_RIBBON 1

uniform sampler2D u_texture;
uniform highp int u_emitter;
uniform float u_filterMode;

varying vec2 v_texcoord;
varying vec4 v_color;

void main() {
  vec4 texel = texture2D(u_texture, v_texcoord);
  vec4 color = texel * v_color;

  // 1bit Alpha, used by ribbon emitters.
  if (u_emitter == EMITTER_RIBBON && u_filterMode == 1.0 && color.a < 0.75) {
    discard;
  }

  // "Close to 0 alpha"
  if (u_emitter == EMITTER_PARTICLE2 && (u_filterMode == 2.0 || u_filterMode == 3.0) && color.a < 0.02) {
    discard;
  }

  // Alpha key.
  if (u_emitter == EMITTER_PARTICLE2 && (u_filterMode == 4.0) && color.a < 0.75) {
    discard;
  }

  gl_FragColor = color;
}
`;

export default shader;
