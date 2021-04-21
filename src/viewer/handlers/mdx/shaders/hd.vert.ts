
import boneTexture from '../../shaders/bonetexture.glsl';
import transformVertexGroups from './transformvertexgroups.glsl';

const shader = `
uniform mat4 u_VP;
uniform float u_layerAlpha;
uniform bool u_hasBones;

attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_uv;

varying vec3 v_normal;
varying vec2 v_uv;
varying float v_layerAlpha;

${boneTexture}

#ifdef SKIN
attribute vec4 a_bones;
attribute vec4 a_weights;

void transformSkin(inout vec3 position, inout vec3 normal) {
  mat4 bone;

  bone += fetchMatrix(a_bones[0], 0.0) * a_weights[0];
  bone += fetchMatrix(a_bones[1], 0.0) * a_weights[1];
  bone += fetchMatrix(a_bones[2], 0.0) * a_weights[2];
  bone += fetchMatrix(a_bones[3], 0.0) * a_weights[3];

  position = vec3(bone * vec4(position, 1.0));
  normal = mat3(bone) * normal;
}
#else
${transformVertexGroups}
#endif

void main() {
  vec3 position = a_position;
  vec3 normal = a_normal;

  if (u_hasBones) {
    #ifdef SKIN
      transformSkin(position, normal);
    #else
      transformVertexGroups(position, normal);
    #endif
  }

  v_normal = normal;
  v_uv = a_uv;
  v_layerAlpha = u_layerAlpha;

  gl_Position = u_VP * vec4(position, 1.0);
}
`;

export default shader;
