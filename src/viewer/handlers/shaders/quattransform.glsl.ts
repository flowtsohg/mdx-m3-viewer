const shader = `
// A 2D quaternion*vector.
// q is the zw components of the original quaternion.
vec2 quat_transform(vec2 q, vec2 v) {
  vec2 uv = vec2(-q.x * v.y, q.x * v.x);
  vec2 uuv = vec2(-q.x * uv.y, q.x * uv.x);

  return v + 2.0 * (uv * q.y + uuv);
}
`;

export default shader;
