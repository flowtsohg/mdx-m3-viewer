
#pragma glslify: import(./animations.glsl)

attribute vec4 a_position;
varying vec3 v_position;

#ifdef HAS_NORMALS
attribute vec4 a_normal;

  #ifdef HAS_TANGENTS
    varying mat3 v_TBN;
  #else
    varying vec3 v_normal;
  #endif
#endif

#ifdef HAS_TANGENTS
attribute vec4 a_tangent;
#endif

#ifdef HAS_UV_SET0
  attribute vec2 a_uv0;
#endif

#ifdef HAS_UV_SET1
  attribute vec2 a_uv1;
#endif

varying vec2 v_uvCoord0;
varying vec2 v_uvCoord1;

#if defined(HAS_VERTEX_COLOR_VEC3)
  attribute vec3 a_color;
  varying vec3 v_color;
#elif defined(HAS_VERTEX_COLOR_VEC4)
  attribute vec4 a_color;
  varying vec4 v_color;
#endif

uniform mat4 u_viewProjectionMatrix;
uniform mat4 u_modelMatrix;
uniform mat4 u_normalMatrix;

vec4 getPosition() {
  vec4 pos = a_position;

  #ifdef USE_MORPHING
    pos += getTargetPosition();
  #endif

  #ifdef USE_SKINNING
    pos = getSkinningMatrix() * pos;
  #endif

  return pos;
}

#ifdef HAS_NORMALS
  vec4 getNormal() {
    vec4 normal = a_normal;

    #ifdef USE_MORPHING
      normal += getTargetNormal();
    #endif

    #ifdef USE_SKINNING
      normal = getSkinningNormalMatrix() * normal;
    #endif

    return normalize(normal);
  }
#endif

#ifdef HAS_TANGENTS
  vec4 getTangent() {
    vec4 tangent = a_tangent;

    #ifdef USE_MORPHING
      tangent += getTargetTangent();
    #endif

    #ifdef USE_SKINNING
      tangent = getSkinningMatrix() * tangent;
    #endif

    return normalize(tangent);
  }
#endif

void main() {
  vec4 pos = u_modelMatrix * getPosition();
  
  v_position = vec3(pos.xyz) / pos.w;

  #ifdef HAS_NORMALS
    #ifdef HAS_TANGENTS
      vec4 tangent = getTangent();
      vec3 normalW = normalize(vec3(u_normalMatrix * vec4(getNormal().xyz, 0.0)));
      vec3 tangentW = normalize(vec3(u_modelMatrix * vec4(tangent.xyz, 0.0)));
      vec3 bitangentW = cross(normalW, tangentW) * tangent.w;

      v_TBN = mat3(tangentW, bitangentW, normalW);
    #else
      v_normal = normalize(vec3(u_normalMatrix * vec4(getNormal().xyz, 0.0)));
    #endif
  #endif

  #ifdef HAS_UV_SET0
    v_uvCoord0 = a_uv0;
  #else
    v_uvCoord0 = vec2(0.0, 0.0);
  #endif

  #ifdef HAS_UV_SET1
    v_uvCoord1 = a_uv1;
  #else
    v_uvCoord1 = vec2(0.0, 0.0);
  #endif

  #if defined(HAS_VERTEX_COLOR_VEC3) || defined(HAS_VERTEX_COLOR_VEC4)
    v_color = a_color;
  #endif

  gl_Position = u_viewProjectionMatrix * pos;
}
