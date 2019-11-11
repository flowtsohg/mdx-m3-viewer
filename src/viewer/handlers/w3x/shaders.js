import shaders from '../../shaders';

export default {
  vsGround: `
    uniform mat4 u_mvp;
    uniform sampler2D u_heightMap;
    uniform vec2 u_size;
    uniform vec2 u_offset;
    uniform bool u_extended[14];
    uniform float u_baseTileset;

    attribute vec2 a_position;
    ${shaders.instanceId}
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

      return (cell + uv) * cellSize;
    }

    void main() {
      vec4 textures = a_textures - u_baseTileset;
      
      if (textures[0] > 0.0 || textures[1] > 0.0 || textures[2] > 0.0 || textures[3] > 0.0) {
        v_tilesets = a_textures - u_baseTileset;

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

        gl_Position = u_mvp * vec4(base * 128.0 + u_offset, height * 128.0, 1.0);
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
  `,
  fsGround: `
    uniform sampler2D u_tilesets[15];

    varying vec4 v_tilesets;
    varying vec2 v_uv[4];
    varying vec3 v_normal;

    const vec3 lightDirection = normalize(vec3(-0.3, -0.3, 0.25));

    vec4 sample(float tileset, vec2 uv) {
      if (tileset == 0.0) {
        return texture2D(u_tilesets[0], uv);
      } else if (tileset == 1.0) {
        return texture2D(u_tilesets[1], uv);
      } else if (tileset == 2.0) {
        return texture2D(u_tilesets[2], uv);
      } else if (tileset == 3.0) {
        return texture2D(u_tilesets[3], uv);
      } else if (tileset == 4.0) {
        return texture2D(u_tilesets[4], uv);
      } else if (tileset == 5.0) {
        return texture2D(u_tilesets[5], uv);
      } else if (tileset == 6.0) {
        return texture2D(u_tilesets[6], uv);
      } else if (tileset == 7.0) {
        return texture2D(u_tilesets[7], uv);
      } else if (tileset == 8.0) {
        return texture2D(u_tilesets[8], uv);
      } else if (tileset == 9.0) {
        return texture2D(u_tilesets[9], uv);
      } else if (tileset == 10.0) {
        return texture2D(u_tilesets[10], uv);
      } else if (tileset == 11.0) {
        return texture2D(u_tilesets[11], uv);
      } else if (tileset == 12.0) {
        return texture2D(u_tilesets[12], uv);
      } else if (tileset == 13.0) {
        return texture2D(u_tilesets[13], uv);
      } else if (tileset == 14.0) {
        return texture2D(u_tilesets[14], uv);
      }
    }

    vec4 blend(vec4 color, float tileset, vec2 uv) {
      vec4 texel = sample(tileset, uv);

      return mix(color, texel, texel.a);
    }

    void main() {
      vec4 color = sample(v_tilesets[0] - 1.0, v_uv[0]);

      if (v_tilesets[1] > 0.5) {
        color = blend(color, v_tilesets[1] - 1.0, v_uv[1]);
      }

      if (v_tilesets[2] > 0.5) {
        color = blend(color, v_tilesets[2] - 1.0, v_uv[2]);
      }

      if (v_tilesets[3] > 0.5) {
        color = blend(color, v_tilesets[3] - 1.0, v_uv[3]);
      }

      // color *= clamp(dot(v_normal, lightDirection) + 0.45, 0.0, 1.0);

      gl_FragColor = color;
    }
  `,
  vsWater: `
    uniform mat4 u_mvp;
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
    ${shaders.instanceId}
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

        gl_Position = u_mvp * vec4(base * 128.0 + u_offset, waterHeight * 128.0, 1.0);
      } else {
        v_uv = vec2(0.0);
        v_color = vec4(0.0);

        gl_Position = vec4(0.0);
      }
    }
  `,
  fsWater: `
    uniform sampler2D u_waterTexture;

    varying vec2 v_uv;
    varying vec4 v_color;

    void main() {
      gl_FragColor = texture2D(u_waterTexture, v_uv) * v_color;
    }
  `,
  vsCliffs: `
    uniform mat4 u_mvp;
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

      gl_Position = u_mvp * vec4(v_position, 1.0);
    }
  `,
  fsCliffs: `
    #extension GL_OES_standard_derivatives : enable
    uniform sampler2D u_texture1;
    uniform sampler2D u_texture2;

    varying vec3 v_normal;
    varying vec2 v_uv;
    varying float v_texture;
    varying vec3 v_position;

    const vec3 lightDirection = normalize(vec3(-0.3, -0.3, 0.25));

    vec4 sample(int texture, vec2 uv) {
      if (texture == 0) {
        return texture2D(u_texture1, uv);
      } else {
        return texture2D(u_texture2, uv);
      }
    }

    void main() {
      vec4 color = sample(int(v_texture), v_uv);

      vec3 faceNormal = cross(dFdx(v_position), dFdy(v_position));
      vec3 normal = normalize((faceNormal + v_normal) * 0.5);

      color *= clamp(dot(normal, lightDirection) + 0.45, 0.1, 1.0);

      gl_FragColor = color;
    }
  `,
  vsSimpleModel: `
    uniform mat4 u_mvp;

    attribute vec3 a_position;
    attribute vec3 a_normal;
    attribute vec2 a_uv;
    attribute vec3 a_instancePosition;
    attribute vec2 a_instanceRotation;
    attribute float a_instanceScale;

    varying vec3 v_normal;
    varying vec2 v_uv;

    ${shaders.quat_transform}

    void main() {
      v_normal = quat_transform(a_instanceRotation, a_normal);
      v_uv = a_uv;

      gl_Position = u_mvp * vec4(quat_transform(a_instanceRotation, a_position) * a_instanceScale + a_instancePosition, 1.0);
    }
  `,
  fsSimpleModel: `
    uniform sampler2D u_texture;
    uniform bool u_alphaTest;
    uniform bool u_unshaded;

    varying vec3 v_normal;
    varying vec2 v_uv;

    const vec3 lightDirection = normalize(vec3(-0.3, -0.3, 0.25));

    void main() {
      vec4 color = texture2D(u_texture, v_uv);

      // 1bit Alpha
      if (u_alphaTest && color.a < 0.75) {
        discard;
      }

      if (!u_unshaded) {
        color *= clamp(dot(v_normal, lightDirection) + 0.45, 0.1, 1.0);
      }

      gl_FragColor = color;
    }
  `,
};
