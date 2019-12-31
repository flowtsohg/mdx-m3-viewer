const shader = `
uniform mat4 u_VP;
uniform sampler2D u_heightMap;
uniform vec2 u_size;
uniform vec2 u_offset;
uniform bool u_extended[14];
uniform float u_baseTileset;

attribute vec2 a_position;
attribute float a_InstanceID;
attribute vec4 a_textures;
attribute vec4 a_variations;

varying vec4 v_tilesets;
varying vec2 v_uv[4];
varying vec3 v_normal;

vec2 getCell(float variation) {
  if (variation < 16.0) {
    return vec2(mod(variation, 4.0), floor(variation / 4.0));
  } else {
    variation -= 16.0;

    return vec2(4.0 + mod(variation, 4.0), floor(variation / 4.0));
  }
}

vec2 getUV(vec2 position, bool extended, float variation) {
  vec2 cell = getCell(variation);
  vec2 cellSize = vec2(extended ? 0.125 : 0.25, 0.25);
  vec2 uv = vec2(position.x, 1.0 - position.y);
  vec2 pixelSize = vec2(1.0 / 512.0, 1.0 / 256.0); /// Note: hardcoded to 512x256 for now.

  return clamp((cell + uv) * cellSize, cell * cellSize + pixelSize, (cell + 1.0) * cellSize - pixelSize); 
}

void main() {
  vec4 textures = a_textures - u_baseTileset;
  
  if (textures[0] > 0.0 || textures[1] > 0.0 || textures[2] > 0.0 || textures[3] > 0.0) {
    v_tilesets = textures;

    v_uv[0] = getUV(a_position, u_extended[int(textures[0]) - 1], a_variations[0]);
    v_uv[1] = getUV(a_position, u_extended[int(textures[1]) - 1], a_variations[1]);
    v_uv[2] = getUV(a_position, u_extended[int(textures[2]) - 1], a_variations[2]);
    v_uv[3] = getUV(a_position, u_extended[int(textures[3]) - 1], a_variations[3]);

    vec2 corner = vec2(mod(a_InstanceID, u_size.x), floor(a_InstanceID / u_size.x));
    vec2 base = corner + a_position;
    float height = texture2D(u_heightMap, base / u_size).a;

    float hL = texture2D(u_heightMap, vec2(base - vec2(1.0, 0.0)) / (u_size)).a;
    float hR = texture2D(u_heightMap, vec2(base + vec2(1.0, 0.0)) / (u_size)).a;
    float hD = texture2D(u_heightMap, vec2(base - vec2(0.0, 1.0)) / (u_size)).a;
    float hU = texture2D(u_heightMap, vec2(base + vec2(0.0, 1.0)) / (u_size)).a;

    v_normal = normalize(vec3(hL - hR, hD - hU, 2.0));

    gl_Position = u_VP * vec4(base * 128.0 + u_offset, height * 128.0, 1.0);
  } else {
    v_tilesets = vec4(0.0);

    v_uv[0] = vec2(0.0);
    v_uv[1] = vec2(0.0);
    v_uv[2] = vec2(0.0);
    v_uv[3] = vec2(0.0);

    v_normal = vec3(0.0);

    gl_Position = vec4(0.0);
  }
}
`;

export default shader;
