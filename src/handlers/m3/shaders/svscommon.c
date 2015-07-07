vec3 TBN(vec3 vector, vec3 tangent, vec3 binormal, vec3 normal) {
    vec3 transformed;

    transformed.x = dot(vector, tangent);
    transformed.y = dot(vector, binormal);
    transformed.z = dot(vector, normal);

    return transformed;
}

vec4 decodeVector(vec4 v) {
    return ((v / 255.0) * 2.0) - 1.0;
}
