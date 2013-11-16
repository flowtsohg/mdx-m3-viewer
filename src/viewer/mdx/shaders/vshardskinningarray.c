uniform mat4 u_mvp;
uniform mat4 u_bones[62];
uniform vec2 u_uv_offset;

attribute vec3 a_position;
attribute vec2 a_uv;
attribute vec4 a_bones;
attribute float a_bone_number;

varying vec2 v_uv;

void main() {
  vec4 p = vec4(0);
  vec4 v = vec4(a_position, 1);
  
  p += u_bones[int(a_bones[0])] * v;
  p += u_bones[int(a_bones[1])] * v;
  p += u_bones[int(a_bones[2])] * v;
  p += u_bones[int(a_bones[3])] * v;
  p /= a_bone_number;
  
  v_uv = a_uv + u_uv_offset;
  
  gl_Position = u_mvp * p;
}
