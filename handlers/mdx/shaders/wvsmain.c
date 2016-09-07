uniform mat4 u_mvp;

uniform vec2 u_uvScale;

attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_uv;
attribute vec4 a_bones;
attribute float a_bone_number;

attribute vec3 a_teamColor;
attribute vec3 a_tintColor;

attribute float a_InstanceID;

attribute float a_instanceVisible;
attribute float a_batchVisible;
attribute vec4 a_geosetColor;
attribute vec4 a_uvOffset;

varying vec3 v_normal;
varying vec2 v_uv;
varying vec3 v_teamColor;
varying vec3 v_tintColor;
varying vec4 v_geosetColor;

uniform float u_row;

void transform(vec3 inposition, vec3 innormal, float bone_number, vec4 bones, out vec3 outposition, out vec3 outnormal) {
    vec4 position = vec4(inposition, 1);
    vec4 normal = vec4(innormal, 0);
    vec4 temp;

	mat4 bone0 = boneAtIndex(bones[0], a_InstanceID);
	mat4 bone1 = boneAtIndex(bones[1], a_InstanceID);
	mat4 bone2 = boneAtIndex(bones[2], a_InstanceID);
	mat4 bone3 = boneAtIndex(bones[3], a_InstanceID);

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

	// fract(abs(uv + offset)) / [columns, rows] + textureOffset

	v_uv = (fract(a_uv + a_uvOffset.xy) + a_uvOffset.zw) * u_uvScale;

	v_uv = (fract(a_uv + a_uvOffset.xy) + a_uvOffset.zw) * u_uvScale;// +a_uvOffset.xy;

	v_teamColor = a_teamColor;
	v_tintColor = a_tintColor;

	v_geosetColor = a_geosetColor;

	if (a_instanceVisible == 0.0 || a_batchVisible == 0.0) {
		gl_Position = vec4(0.0);
	}
	else {
		gl_Position = u_mvp * vec4(position, 1);
	}
}
