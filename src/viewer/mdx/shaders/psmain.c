uniform sampler2D u_texture;
uniform bvec3 u_type;
uniform vec4 u_modifier;
uniform float u_teamMode;
uniform vec3 u_teamColor;

varying vec3 v_normal;
varying vec2 v_uv;

void main() {
  vec4 color;

  if (u_teamMode == 0.0) {
    color = texture2D(u_texture, v_uv);
  } else if (u_teamMode == 1.0) {
    color = vec4(u_teamColor, 1);
  } else {
    vec4 texel =  texture2D(u_texture, v_uv);
    
    color = vec4(texel.rgb * u_teamColor, texel.a);
  }
  
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
