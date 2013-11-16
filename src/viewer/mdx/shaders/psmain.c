uniform sampler2D u_texture;
uniform bvec3 u_type;
uniform vec4 u_modifier;

varying vec3 v_normal;
varying vec2 v_uv;

void main() {
  vec4 color = texture2D(u_texture, v_uv);
  
  if (u_type[0] && color.a < 0.7) {
    discard;
  }
  
  if (u_type[1] && color.r < 0.2 && color.g < 0.2 && color.b < 0.2) {
    discard;
  }
  
  if (u_type[2] && color.r > .9 && color.g > 0.9 && color.b > 0.9) {
    discard;
  }
  
  gl_FragColor = color * u_modifier;
}
