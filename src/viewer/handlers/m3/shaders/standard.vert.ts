import boneTexture from '../../shaders/bonetexture.glsl';

const shader = `
uniform mat4 u_VP;
uniform mat4 u_MV;
uniform vec3 u_eyePos;
uniform vec3 u_lightPos;
uniform float u_firstBoneLookupIndex;
uniform float u_boneWeightPairsCount;
uniform vec3 u_teamColors[14];
uniform float u_teamColor;
uniform vec4 u_vertexColor;

attribute vec3 a_position;
attribute vec4 a_normal;
attribute vec2 a_uv0;

#ifdef EXPLICITUV1
attribute vec2 a_uv1;
#endif
#ifdef EXPLICITUV2
attribute vec2 a_uv1, a_uv2;
#endif
#ifdef EXPLICITUV3
attribute vec2 a_uv1, a_uv2, a_uv3;
#endif

attribute vec4 a_tangent;
attribute vec4 a_bones;
attribute vec4 a_weights;

varying vec3 v_normal;
varying vec4 v_uv[2]; // Pack 4 vec2 in 2 vec4, to reduce the varyings count
varying vec3 v_lightDir;
// varying vec3 v_eyeVec;
varying vec3 v_halfVec;
varying vec3 v_teamColor;
varying vec4 v_vertexColor;

${boneTexture}

vec3 TBN(vec3 vector, vec3 tangent, vec3 binormal, vec3 normal) {
  return vec3(dot(vector, tangent), dot(vector, binormal), dot(vector, normal));
}

vec4 decodeVector(vec4 v) {
  return ((v / 255.0) * 2.0) - 1.0;
}

void transform(inout vec3 position, inout vec3 normal, inout vec3 tangent, inout vec3 binormal, vec4 bones, vec4 weights) {
  if (u_boneWeightPairsCount > 0.0) {
    mat4 bone;

    if (u_boneWeightPairsCount == 1.0) {
      bone = fetchMatrix(bones[0], 0.0);
    } else {
      bone += fetchMatrix(bones[0], 0.0) * weights[0];
      bone += fetchMatrix(bones[1], 0.0) * weights[1];
      bone += fetchMatrix(bones[2], 0.0) * weights[2];
      bone += fetchMatrix(bones[3], 0.0) * weights[3];
    }

    position = vec3(bone * vec4(position, 1.0));
    normal = mat3(bone) * normal;
    tangent = vec3(bone * vec4(tangent, 0.0));
    binormal = vec3(bone * vec4(binormal, 0.0));
  }
}

void main() {
  vec4 decodedNormal = decodeVector(a_normal);

  vec3 position = a_position;
  vec3 normal = decodedNormal.xyz;
  vec3 tangent = vec3(decodeVector(a_tangent));
  vec3 binormal = cross(normal, tangent) * decodedNormal.w;

  transform(position, normal, tangent, binormal, a_bones + u_firstBoneLookupIndex, a_weights / 255.0);

  vec3 position_mv = vec3(u_MV * vec4(position, 1));

  mat3 mv = mat3(u_MV);
  vec3 t = normalize(mv * tangent);
  vec3 b = normalize(mv * binormal);
  vec3 n = normalize(mv * normal);

  vec3 lightDir = normalize(u_lightPos - position_mv);

  v_lightDir = normalize(TBN(lightDir, t, b, n));

  vec3 eyeVec = normalize(u_eyePos - position_mv);
  vec3 halfVec = normalize(eyeVec - u_lightPos);

  // v_eyeVec = TBN(eyeVec, t, b, n);
  v_halfVec = TBN(halfVec, t, b, n);

  v_normal = n;

  vec4 uv0, uv1;

  uv0.xy = a_uv0 / 2048.0;

  #ifdef EXPLICITUV1
  uv0.zw = a_uv1 / 2048.0;
  #endif

  #ifdef EXPLICITUV2
  uv0.zw = a_uv1 / 2048.0;
  uv1.xy = a_uv2 / 2048.0;
  #endif

  #ifdef EXPLICITUV3
  uv0.zw = a_uv1 / 2048.0;
  uv1.xy = a_uv2 / 2048.0;
  uv1.zw = a_uv3 / 2048.0;
  #endif

  v_uv[0] = uv0;
  v_uv[1] = uv1;

  v_teamColor = u_teamColors[int(u_teamColor)];
  v_vertexColor = u_vertexColor;

  gl_Position = u_VP * vec4(position, 1.0);
}
`;

export default shader;
