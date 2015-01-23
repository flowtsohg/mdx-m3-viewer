uniform mat4 u_mvp;
uniform float u_firstBoneLookupIndex;

attribute vec3 a_position;
attribute vec4 a_bones;
attribute vec4 a_weights;

void transform(vec3 inposition, vec4 bones, vec4 weights, out vec3 outposition) {
    vec4 position = vec4(inposition, 1);
    vec4 temp;

    mat4 weightedBone0 = boneAtIndex(bones[0]) * weights[0];
    mat4 weightedBone1 = boneAtIndex(bones[1]) * weights[1];
    mat4 weightedBone2 = boneAtIndex(bones[2]) * weights[2];
    mat4 weightedBone3 = boneAtIndex(bones[3]) * weights[3];

    temp = vec4(0);
    temp += weightedBone0 * position;
    temp += weightedBone1 * position;
    temp += weightedBone2 * position;
    temp += weightedBone3 * position;
    outposition = vec3(temp);
}

void main() {
    vec3 position;

    transform(a_position, a_bones + u_firstBoneLookupIndex, a_weights / 255.0, position);

    gl_Position = u_mvp * vec4(position, 1);
}
