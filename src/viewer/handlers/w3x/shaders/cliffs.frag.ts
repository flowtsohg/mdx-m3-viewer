const shader = `
// #extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform sampler2D u_texture1;
uniform sampler2D u_texture2;

varying vec3 v_normal;
varying vec2 v_uv;
varying float v_texture;
varying vec3 v_position;

// const vec3 lightDirection = normalize(vec3(-0.3, -0.3, 0.25));

vec4 sample(int texture, vec2 uv) {
  if (texture == 0) {
    return texture2D(u_texture1, uv);
  } else {
    return texture2D(u_texture2, uv);
  }
}

void main() {
  vec4 color = sample(int(v_texture), v_uv);

  // vec3 faceNormal = cross(dFdx(v_position), dFdy(v_position));
  // vec3 normal = normalize((faceNormal + v_normal) * 0.5);

  // color *= clamp(dot(normal, lightDirection) + 0.45, 0.1, 1.0);

  gl_FragColor = color;
}
`;

export default shader;
