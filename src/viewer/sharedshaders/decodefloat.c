vec2 decodeFloat2(float f) {
  vec2 v;
  
  v[1] = floor(f / 256.0);
  v[0] = floor(f - v[1] * 256.0);
  
  return v;
}

vec3 decodeFloat3(float f) {
  vec3 v;
  
  v[2] = floor(f / 65536.0);
  v[1] = floor((f - v[2] * 65536.0) / 256.0);
  v[0] = floor(f - v[2] * 65536.0 - v[1] * 256.0);
  
  return v;
}