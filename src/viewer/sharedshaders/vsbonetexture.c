uniform sampler2D u_boneMap;
uniform float u_matrix_size;
uniform float u_texel_size;

mat4 boneAtIndex(float index) {
  float offset = index * u_matrix_size;
  return mat4(texture2D(u_boneMap, vec2(offset, 0)), texture2D(u_boneMap, vec2(offset + u_texel_size, 0)), texture2D(u_boneMap, vec2(offset + u_texel_size * 2.0, 0)), texture2D(u_boneMap, vec2(offset + u_texel_size * 3.0, 0)));
}