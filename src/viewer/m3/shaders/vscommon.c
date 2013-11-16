vec3 TBN(vec3 vector, vec3 tangent, vec3 binormal, vec3 normal) {
  vec3 transformed;
  
  transformed.x = dot(vector, tangent);
  transformed.y = dot(vector, binormal);
  transformed.z = dot(vector, normal);
  
  return transformed;
}