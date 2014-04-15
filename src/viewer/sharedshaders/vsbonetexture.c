uniform sampler2D u_bones;
uniform float u_bone_size;
uniform float u_pixel_size;

mat4 boneAtIndex(float index) {
  float offset = index * u_bone_size;
  return mat4(texture2D(u_bones, vec2(offset, 0)), texture2D(u_bones, vec2(offset + u_pixel_size, 0)), texture2D(u_bones, vec2(offset + u_pixel_size * 2.0, 0)), texture2D(u_bones, vec2(offset + u_pixel_size * 3.0, 0)));
}