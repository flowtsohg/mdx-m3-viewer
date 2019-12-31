const shader = `
uniform mat4 u_VP;
uniform sampler2D u_heightMap;
uniform sampler2D u_waterHeightMap;
uniform vec2 u_size;
uniform vec2 u_offset;
uniform float u_offsetHeight;
uniform vec4 u_minDeepColor;
uniform vec4 u_maxDeepColor;
uniform vec4 u_minShallowColor;
uniform vec4 u_maxShallowColor;

attribute vec2 a_position;
attribute float a_InstanceID;
attribute float a_isWater;

varying vec2 v_uv;
varying vec4 v_color;

const float minDepth = 10.0 / 128.0;
const float deepLevel = 64.0 / 128.0;
const float maxDepth = 72.0 / 128.0;

void main() {
  if (a_isWater > 0.5) {
    v_uv = a_position;

    vec2 corner = vec2(mod(a_InstanceID, u_size.x), floor(a_InstanceID / u_size.x));
    vec2 base = corner + a_position;
    float height = texture2D(u_heightMap, base / u_size).a;
    float waterHeight = texture2D(u_waterHeightMap, base / u_size).a + u_offsetHeight;
    float value = clamp(waterHeight - height, 0.0, 1.0);

    if (value <= deepLevel) {
      value = max(0.0, value - minDepth) / (deepLevel - minDepth);
      v_color = mix(u_minShallowColor, u_maxShallowColor, value) / 255.0;
    } else {
      value = clamp(value - deepLevel, 0.0, maxDepth - deepLevel) / (maxDepth - deepLevel);
      v_color = mix(u_minDeepColor, u_maxDeepColor, value) / 255.0;
    }

    gl_Position = u_VP * vec4(base * 128.0 + u_offset, waterHeight * 128.0, 1.0);
  } else {
    v_uv = vec2(0.0);
    v_color = vec4(0.0);

    gl_Position = vec4(0.0);
  }
}
`;

export default shader;
