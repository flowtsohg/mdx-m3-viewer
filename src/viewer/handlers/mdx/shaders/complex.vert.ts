import boneTexture from '../../shaders/bonetexture.glsl';

const shader = `
uniform mat4 u_VP;
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
attribute vec4 a_bones;
#ifdef EXTENDED_BONES
attribute vec4 a_extendedBones;
#endif
attribute float a_boneNumber;

varying vec2 v_uv;
varying vec4 v_color;
varying vec4 v_uvTransRot;
varying float v_uvScale;

${boneTexture}

void transform(inout vec3 position, inout vec3 normal) {
  // For the broken models out there, since the game supports this.
  if (a_boneNumber > 0.0) {
    vec4 position4 = vec4(position, 1.0);
    vec4 normal4 = vec4(normal, 0.0);
    mat4 bone;
    vec4 p;
    vec4 n;

    for (int i = 0; i < 4; i++) {
      if (a_bones[i] > 0.0) {
        bone = fetchMatrix(a_bones[i] - 1.0, 0.0);

        p += bone * position4;
        n += bone * normal4;
      }
    }

    #ifdef EXTENDED_BONES
      for (int i = 0; i < 4; i++) {
        if (a_extendedBones[i] > 0.0) {
          bone = fetchMatrix(a_extendedBones[i] - 1.0, 0.0);

          p += bone * position4;
          n += bone * normal4;
        }
      }
    #endif

    position = p.xyz / a_boneNumber;
    normal = normalize(n.xyz);
  }
}

void main() {
  vec3 position = a_position;
  vec3 normal = a_normal;

  if (u_hasBones) {
    transform(position, normal);
  }

  v_uv = a_uv;
  v_color = u_vertexColor * u_geosetColor.bgra * vec4(1.0, 1.0, 1.0, u_layerAlpha);
  v_uvTransRot = vec4(u_uvTrans, u_uvRot);
  v_uvScale = u_uvScale;

  gl_Position = u_VP * vec4(position, 1.0);
}
`;

export default shader;
