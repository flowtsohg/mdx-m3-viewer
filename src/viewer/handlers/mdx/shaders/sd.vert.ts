import boneTexture from '../../shaders/bonetexture.glsl';
import transforms from './transforms.glsl';

const shader = `
uniform mat4 u_VP;
uniform vec3 u_lightPos;
uniform vec4 u_vertexColor;
uniform vec4 u_geosetColor;
uniform float u_layerAlpha;
uniform vec2 u_uvTrans;
uniform vec2 u_uvRot;
uniform float u_uvScale;
uniform bool u_hasBones;

attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_uv;

varying vec2 v_uv;
varying vec3 v_normal;
varying vec4 v_color;
varying vec4 v_uvTransRot;
varying float v_uvScale;
varying vec3 v_lightDir;

${boneTexture}
${transforms}

void main() {
  vec3 position = a_position;
  vec3 normal = a_normal;

  if (u_hasBones) {
    transformVertexGroups(position, normal);
  }

  v_uv = a_uv;
  v_normal = normal;
  v_color = u_vertexColor * u_geosetColor.bgra * vec4(1.0, 1.0, 1.0, u_layerAlpha);
  v_uvTransRot = vec4(u_uvTrans, u_uvRot);
  v_uvScale = u_uvScale;
  v_lightDir = normalize(u_lightPos - position);

  gl_Position = u_VP * vec4(position, 1.0);
}
`;

export default shader;
