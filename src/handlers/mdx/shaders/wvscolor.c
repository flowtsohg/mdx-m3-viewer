uniform mat4 u_mvp;

attribute vec3 a_position;
attribute vec4 a_bones;
attribute float a_bone_number;

void main() {
    vec4 v = vec4(a_position, 1);
    vec4 p = (boneAtIndex(a_bones[0]) * v + boneAtIndex(a_bones[1]) * v + boneAtIndex(a_bones[2]) * v + boneAtIndex(a_bones[3]) * v) / a_bone_number;

    gl_Position = u_mvp * p ;
}
