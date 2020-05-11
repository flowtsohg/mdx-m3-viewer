const shader = `
precision mediump float;

uniform sampler2D u_tilesets[15];

varying vec4 v_tilesets;
varying vec2 v_uv[4];
varying vec3 v_normal;

const vec3 lightDirection = normalize(vec3(-0.3, -0.3, 0.25));

vec4 sample(float tileset, vec2 uv) {
  // 1.0 - 1.0 == 0.0 is not always true.
  int i = int(tileset - 0.6);

  if (i == 0) {
    return texture2D(u_tilesets[0], uv);
  } else if (i == 1) {
    return texture2D(u_tilesets[1], uv);
  } else if (i == 2) {
    return texture2D(u_tilesets[2], uv);
  } else if (i == 3) {
    return texture2D(u_tilesets[3], uv);
  } else if (i == 4) {
    return texture2D(u_tilesets[4], uv);
  } else if (i == 5) {
    return texture2D(u_tilesets[5], uv);
  } else if (i == 6) {
    return texture2D(u_tilesets[6], uv);
  } else if (i == 7) {
    return texture2D(u_tilesets[7], uv);
  } else if (i == 8) {
    return texture2D(u_tilesets[8], uv);
  } else if (i == 9) {
    return texture2D(u_tilesets[9], uv);
  } else if (i == 10) {
    return texture2D(u_tilesets[10], uv);
  } else if (i == 11) {
    return texture2D(u_tilesets[11], uv);
  } else if (i == 12) {
    return texture2D(u_tilesets[12], uv);
  } else if (i == 13) {
    return texture2D(u_tilesets[13], uv);
  } else if (i == 14) {
    return texture2D(u_tilesets[14], uv);
  }
}

vec4 blend(vec4 color, float tileset, vec2 uv) {
  vec4 texel = sample(tileset, uv);

  return mix(color, texel, texel.a);
}

void main() {
  vec4 color = sample(v_tilesets[0], v_uv[0]);

  if (v_tilesets[1] > 0.5) {
    color = blend(color, v_tilesets[1], v_uv[1]);
  }

  if (v_tilesets[2] > 0.5) {
    color = blend(color, v_tilesets[2], v_uv[2]);
  }

  if (v_tilesets[3] > 0.5) {
    color = blend(color, v_tilesets[3], v_uv[3]);
  }

  //color *= clamp(dot(v_normal, lightDirection) + 0.45, 0.0, 1.0);

  gl_FragColor = vec4(color.rgb, 1.0);
}
`;

export default shader;
