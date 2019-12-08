
export default {
  // Shared shader code to mimic gl_InstanceID
  instanceId: `
    attribute float a_InstanceID;
  `,
  // Shared shader code to handle bone textures
  boneTexture: `
    uniform sampler2D u_boneMap;
    uniform float u_vectorSize;
    uniform float u_rowSize;

    mat4 fetchMatrix(float column, float row) {
      column *= u_vectorSize * 4.0;
      row *= u_rowSize;
      // Add in half texel to sample in the middle of the texel.
      // Otherwise, since the sample is directly on the boundry, small floating point errors can cause the sample to get the wrong pixel.
      // This is mostly noticable with NPOT textures, which the bone maps are.
      column += 0.5 * u_vectorSize;
      row += 0.5 * u_rowSize;

      return mat4(texture2D(u_boneMap, vec2(column, row)),
                  texture2D(u_boneMap, vec2(column + u_vectorSize, row)),
                  texture2D(u_boneMap, vec2(column + u_vectorSize * 2.0, row)),
                  texture2D(u_boneMap, vec2(column + u_vectorSize * 3.0, row)));
    }
  `,
  // Shared shader code to handle decoding multiple bytes stored in floats
  decodeFloat: `
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

    vec4 decodeFloat4(float v) {
      vec4 enc = vec4(1.0, 255.0, 65025.0, 16581375.0) * v;
      enc = fract(enc);
      enc -= enc.yzww * vec4(1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0, 0.0);
      return enc;
    }
  `,
  quat_transform: `
    // A 2D quaternion*vector.
    // q is the zw components of the original quaternion.
    vec2 quat_transform(vec2 q, vec2 v) {
      vec2 uv = vec2(-q.x * v.y, q.x * v.x);
      vec2 uuv = vec2(-q.x * uv.y, q.x * uv.x);

      return v + 2.0 * (uv * q.y + uuv);
    }

    // A 2D quaternion*vector.
    // q is the zw components of the original quaternion.
    vec3 quat_transform(vec2 q, vec3 v) {
      return vec3(quat_transform(q, v.xy), v.z);
    }
  `,
};
