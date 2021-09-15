
import boneTexture from '../../shaders/bonetexture.glsl';
import transforms from './transforms.glsl';

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
varying vec3 v_eyeVec;
varying vec3 v_normal;
// varying vec3 v_lightDirWorld;

#if defined(ONLY_TANGENTS)
varying vec3 v_tangent;
#endif

${boneTexture}
${transforms}

vec3 TBN(vec3 vector, vec3 tangent, vec3 binormal, vec3 normal) {
  return vec3(dot(vector, tangent), dot(vector, binormal), dot(vector, normal));
}

void main() {
  vec3 position = a_position;
  vec3 normal = a_normal;
  vec3 tangent = a_tangent.xyz;

  // Re-orthogonalize the tangent in case it wasnt normalized.
  // See "One last thing" at https://learnopengl.com/Advanced-Lighting/Normal-Mapping
  tangent = normalize(tangent - dot(tangent, normal) * normal);

  vec3 binormal = cross(normal, tangent) * a_tangent.w;

  if (u_hasBones) {
    #ifdef SKIN
      transformSkin(position, normal, tangent, binormal);
    #else
      transformVertexGroupsHD(position, normal, tangent, binormal);
    #endif
  }

  vec3 position_mv = vec3(u_MV * vec4(position, 1));

  mat3 mv = mat3(u_MV);
  vec3 t = normalize(mv * tangent);
  vec3 b = normalize(mv * binormal);
  vec3 n = normalize(mv * normal);

  v_eyeVec = normalize(u_eyePos - position_mv);

  vec3 lightDir = normalize(u_lightPos - position_mv);
  v_lightDir = normalize(TBN(lightDir, t, b, n));
  
  v_uv = a_uv;
  v_layerAlpha = u_layerAlpha;

  v_normal = normal;
  // v_lightDirWorld = normalize(lightDir);

  #if defined(ONLY_TANGENTS)
  v_tangent = tangent;
  #endif

  gl_Position = u_VP * vec4(position, 1.0);
}
`;

export default shader;
