uniform mat4 u_mvp;
uniform vec3 u_uv_offset;

attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_uv;
attribute vec4 a_bones;
attribute float a_bone_number;

varying vec3 v_normal;
varying vec2 v_uv;

void transform(vec3 inposition, vec3 innormal, float bone_number, vec4 bones, out vec3 outposition, out vec3 outnormal) {
    vec4 position = vec4(inposition, 1);
    vec4 normal = vec4(innormal, 0);
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

    temp = vec4(0);
    temp += bone0 * normal;
    temp += bone1 * normal;
    temp += bone2 * normal;
    temp += bone3 * normal;
    outnormal = normalize(vec3(temp));
}

void main() {
    vec3 position, normal;

    transform(a_position, a_normal, a_bone_number, a_bones, position, normal);

    v_normal = normal;
    v_uv = a_uv + u_uv_offset.xy;

    gl_Position = u_mvp * vec4(position, 1);
}