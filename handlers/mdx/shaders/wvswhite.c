uniform mat4 u_mvp;

attribute vec3 a_position;
attribute vec4 a_bones;
attribute float a_bone_number;

void transform(vec3 inposition, float bone_number, vec4 bones, out vec3 outposition) {
    vec4 position = vec4(inposition, 1);
    vec4 temp;

    mat4 bone0 = boneAtIndex(bones[0]);
    mat4 bone1 = boneAtIndex(bones[1]);
    mat4 bone2 = boneAtIndex(bones[2]);
    mat4 bone3 = boneAtIndex(bones[3]);

    temp = vec4(0);
    temp += bone0 * position;
    temp += bone1 * position;
    temp += bone2 * position;
    temp += bone3 * position;
    temp /= bone_number;
    outposition = vec3(temp);
}

void main() {
    vec3 position;

    transform(a_position, a_bone_number, a_bones, position);

    gl_Position = u_mvp * vec4(position, 1);
}
