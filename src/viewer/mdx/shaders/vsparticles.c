uniform mat4 u_mvp;
uniform vec2 u_dimensions;

attribute vec3 a_position;
attribute float a_uva;
attribute float a_rgb;

varying vec2 v_uv;
varying vec4 v_color;

void main() {
  vec3 uva = decodeFloat3(a_uva);
  vec3 rgb = decodeFloat3(a_rgb);
  
  v_uv = uva.yx / u_dimensions;
  v_color = vec4(rgb, uva.z) / 256.0;
  
  gl_Position = u_mvp * vec4(a_position, 1);
}
