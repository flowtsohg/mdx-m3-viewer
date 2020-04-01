const shader = `
uniform mat4 u_VP;
uniform sampler2D u_heightMap;
uniform vec2 u_pixel;
uniform vec2 u_centerOffset;

attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec2 a_uv;
attribute vec3 a_instancePosition;
attribute float a_instanceTexture;

varying vec3 v_normal;
varying vec2 v_uv;
varying float v_texture;
varying vec3 v_position;

void main() {
  // Half of a pixel in the cliff height map.
  vec2 halfPixel = u_pixel * 0.5;

  // The bottom left corner of the map tile this vertex is on.
  vec2 corner = floor((a_instancePosition.xy - vec2(1.0, 0.0) - u_centerOffset.xy) / 128.0);

  // Get the 4 closest heights in the height map.
  float bottomLeft = texture2D(u_heightMap, corner * u_pixel + halfPixel).a;
  float bottomRight = texture2D(u_heightMap, (corner + vec2(1.0, 0.0)) * u_pixel + halfPixel).a;
  float topLeft = texture2D(u_heightMap, (corner + vec2(0.0, 1.0)) * u_pixel + halfPixel).a;
  float topRight = texture2D(u_heightMap, (corner + vec2(1.0, 1.0)) * u_pixel + halfPixel).a;
  
  // Do a bilinear interpolation between the heights to get the final value.
  float bottom = mix(bottomRight, bottomLeft, -a_position.x / 128.0);
  float top = mix(topRight, topLeft, -a_position.x / 128.0);
  float height = mix(bottom, top, a_position.y / 128.0);

  v_normal = a_normal;
  v_uv = a_uv;
  v_texture = a_instanceTexture;
  v_position = a_position + vec3(a_instancePosition.xy, a_instancePosition.z + height * 128.0);

  gl_Position = u_VP * vec4(v_position, 1.0);
}
`;

export default shader;
