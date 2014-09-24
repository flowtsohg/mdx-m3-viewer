uniform mat4 u_mvp;
uniform vec3 u_uv_offset;

attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_uv;
attribute vec4 a_bones;
attribute float a_bone_number;

varying vec3 v_normal;
varying vec2 v_uv;


void main() {
  vec4 v = vec4(a_position, 1);
  vec4 p = (boneAtIndex(a_bones[0]) * v + boneAtIndex(a_bones[1]) * v + boneAtIndex(a_bones[2]) * v + boneAtIndex(a_bones[3]) * v) / a_bone_number;
  
  v_normal = a_normal;
  v_uv = a_uv + u_uv_offset.xy;
  
  gl_Position = u_mvp * p ;
}