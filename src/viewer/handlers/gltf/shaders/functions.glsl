const float GAMMA = 2.2;
const float INV_GAMMA = 1.0 / GAMMA;

vec3 LINEARtoSRGB(vec3 color) {
  return pow(color, vec3(INV_GAMMA));
}

vec4 SRGBtoLINEAR(vec4 color) {
  return vec4(pow(color.xyz, vec3(GAMMA)), color.w);
}

const float M_PI = 3.141592653589793;
const float c_MinReflectance = 0.04;

varying vec3 v_position;

#ifdef HAS_NORMALS
  #ifdef HAS_TANGENTS
    varying mat3 v_TBN;
  #else
    varying vec3 v_normal;
  #endif
#endif

#if defined(HAS_VERTEX_COLOR_VEC3)
  varying vec3 v_color;
#elif defined(HAS_VERTEX_COLOR_VEC4)
  varying vec4 v_color;
#endif

vec4 getVertexColor() {
  #if defined(HAS_VERTEX_COLOR_VEC3)
    return vec4(v_color, 1.0);
  #elif defined(HAS_VERTEX_COLOR_VEC4)
    return v_color;
  #else
    return vec4(1.0);
  #endif
}

vec3 getNormal() {
  vec2 uv = getNormalUv();

  #ifdef HAS_TANGENTS
    mat3 tbn = v_TBN;
  #else
    vec3 pos_dx = dFdx(v_position);
    vec3 pos_dy = dFdy(v_position);
    vec3 tex_dx = dFdx(vec3(uv, 0.0));
    vec3 tex_dy = dFdy(vec3(uv, 0.0));
    vec3 t = (tex_dy.t * pos_dx - tex_dx.t * pos_dy) / (tex_dx.s * tex_dy.t - tex_dy.s * tex_dx.t);

    #ifdef HAS_NORMALS
      vec3 ng = normalize(v_normal);
    #else
      vec3 ng = cross(pos_dx, pos_dy);
    #endif

    t = normalize(t - ng * dot(ng, t));
    vec3 b = normalize(cross(ng, t));
    mat3 tbn = mat3(t, b, ng);
  #endif

  #ifdef HAS_NORMAL_MAP
    vec3 n = texture2D(u_normalSampler, uv).rgb;

    n = normalize(tbn * ((2.0 * n - 1.0) * vec3(u_normalScale, u_normalScale, 1.0)));
  #else
    vec3 n = normalize(tbn[2].xyz);
  #endif

  return n;
}

float getPerceivedBrightness(vec3 vector) {
  return sqrt(0.299 * vector.r * vector.r + 0.587 * vector.g * vector.g + 0.114 * vector.b * vector.b);
}
