
import boneTexture from '../../shaders/bonetexture.glsl';
import transformVertexGroups from './transformvertexgroups.glsl';

const shader = `
uniform mat4 u_VP;
uniform mat4 u_MV;
uniform vec3 u_eyePos;
uniform vec3 u_lightPos;
uniform float u_layerAlpha;
uniform bool u_hasBones;

attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_uv;
attribute vec4 a_tangent;

varying vec2 v_uv;
varying float v_layerAlpha;
varying vec3 v_lightDir;
varying vec3 v_halfVec;

${boneTexture}

#ifdef SKIN
attribute vec4 a_bones;
attribute vec4 a_weights;

void transformSkin(inout vec3 position, inout vec3 normal, inout vec3 tangent, inout vec3 binormal) {
  mat4 bone;

  bone += fetchMatrix(a_bones[0], 0.0) * a_weights[0];
  bone += fetchMatrix(a_bones[1], 0.0) * a_weights[1];
  bone += fetchMatrix(a_bones[2], 0.0) * a_weights[2];
  bone += fetchMatrix(a_bones[3], 0.0) * a_weights[3];

  mat3 rotation = mat3(bone);

  position = vec3(bone * vec4(position, 1.0));
  normal = rotation * normal;
  tangent = rotation * tangent;
  binormal = rotation * binormal;
}
#else
${transformVertexGroups}
#endif

vec3 TBN(vec3 vector, vec3 tangent, vec3 binormal, vec3 normal) {
  return vec3(dot(vector, tangent), dot(vector, binormal), dot(vector, normal));
}

void main() {
  vec3 position = a_position;
  vec3 normal = a_normal;
  vec3 tangent = a_tangent.xyz;
  vec3 binormal = cross(normal, tangent) * a_tangent.w;

  if (u_hasBones) {
    #ifdef SKIN
      transformSkin(position, normal, tangent, binormal);
    #else
      transformVertexGroups(position, normal);
    #endif
  }

  vec3 position_mv = vec3(u_MV * vec4(position, 1));

  mat3 mv = mat3(u_MV);
  vec3 t = normalize(mv * tangent);
  vec3 b = normalize(mv * binormal);
  vec3 n = normalize(mv * normal);

  vec3 eyeVec = normalize(u_eyePos - position_mv);
  vec3 halfVec = normalize(eyeVec - u_lightPos);

  v_halfVec = TBN(halfVec, t, b, n);

  vec3 lightDir = normalize(u_lightPos - position_mv);
  v_lightDir = normalize(TBN(lightDir, t, b, n));
  
  v_uv = a_uv;
  v_layerAlpha = u_layerAlpha;

  gl_Position = u_VP * vec4(position, 1.0);
}
`;

export default shader;
