import shaders from '../../shaders';

export default {
  vsSimple: `
    uniform mat4 u_mvp;

    //attribute mat4 a_transform;
    attribute vec4 a_m0;
    attribute vec4 a_m1;
    attribute vec4 a_m2;
    attribute vec4 a_m3;
    attribute vec3 a_position;
    attribute vec2 a_uv;

    varying vec2 v_uv;

    void main() {
      v_uv = a_uv;

      gl_Position = u_mvp * mat4(a_m0, a_m1, a_m2, a_m3) * vec4(a_position, 1.0);
    }
  `,
  fsSimple: `
    uniform sampler2D u_texture;
    uniform float u_filterMode;

    varying vec2 v_uv;

    void main() {
      vec4 color = texture2D(u_texture, v_uv);

      // 1bit Alpha
      if (u_filterMode == 1.0 && color.a < 0.75) {
        discard;
      }

      gl_FragColor = color;
    }
  `,
  vsComplex: `
    ${shaders.boneTexture}

    void transform(inout vec3 position, inout vec3 normal, float boneNumber, vec4 bones, float instance) {
      // For the broken models out there, since the game supports this.
      if (boneNumber > 0.0) {
        mat4 b0 = fetchMatrix(bones[0], instance);
        mat4 b1 = fetchMatrix(bones[1], instance);
        mat4 b2 = fetchMatrix(bones[2], instance);
        mat4 b3 = fetchMatrix(bones[3], instance);
        vec4 p = vec4(position, 1.0);
        vec4 n = vec4(normal, 0.0);

        position = vec3(b0 * p + b1 * p + b2 * p + b3 * p) / boneNumber;
        normal = normalize(vec3(b0 * n + b1 * n + b2 * n + b3 * n));
      }
    }

    uniform mat4 u_mvp;
    uniform vec4 u_vertexColor;
    uniform vec4 u_geosetColor;
    uniform float u_layerAlpha;
    uniform vec2 u_uvTrans;
    uniform vec2 u_uvRot;
    uniform float u_uvScale;

    attribute vec3 a_position;
    attribute vec3 a_normal;
    attribute vec2 a_uv;
    attribute vec4 a_bones;
    attribute float a_boneNumber;

    varying vec2 v_uv;
    varying vec4 v_color;
    varying vec4 v_uvTransRot;
    varying float v_uvScale;

    void main() {
      vec3 position = a_position;
      vec3 normal = a_normal;

      transform(position, normal, a_boneNumber, a_bones, 0.0);

      v_uv = a_uv;
      v_color = (u_vertexColor / 255.0) * (u_geosetColor.bgra / 255.0) * vec4(1.0, 1.0, 1.0, u_layerAlpha / 255.0);
      v_uvTransRot = vec4(u_uvTrans, u_uvRot);
      v_uvScale = u_uvScale;

      gl_Position = u_mvp * vec4(position, 1.0);
    }
  `,
  fsComplex: `
    ${shaders.quat_transform}

    uniform sampler2D u_texture;
    uniform float u_filterMode;

    varying vec2 v_uv;
    varying vec4 v_color;
    varying vec4 v_uvTransRot;
    varying float v_uvScale;

    void main() {
      vec2 uv = v_uv;

      // Translation animation
      uv += v_uvTransRot.xy;

      // Rotation animation
      uv = quat_transform(v_uvTransRot.zw, uv - 0.5) + 0.5;

      // Scale animation
      uv = v_uvScale * (uv - 0.5) + 0.5;

      vec4 texel = texture2D(u_texture, uv);
      vec4 color = texel * v_color;

      // 1bit Alpha
      if (u_filterMode == 1.0 && color.a < 0.75) {
        discard;
      }

      // "Close to 0 alpha"
      if (u_filterMode >= 5.0 && color.a < 0.02) {
        discard;
      }

      // if (!u_unshaded) {
      //   color *= clamp(dot(v_normal, lightDirection) + 0.45, 0.0, 1.0);
      // }

      gl_FragColor = color;
    }
  `,
  vs: `
    ${shaders.instanceId}
    ${shaders.boneTexture}

    uniform mat4 u_mvp;

    attribute vec3 a_position;
    attribute vec3 a_normal;
    attribute vec2 a_uv;
    attribute vec4 a_bones;
    attribute float a_boneNumber;
    attribute float a_teamColor;
    attribute vec4 a_vertexColor;
    attribute vec4 a_geosetColor;
    attribute float a_layerAlpha;
    attribute vec4 a_uvTransRot;
    attribute vec3 a_uvScaleSprite;

    varying vec3 v_normal;
    varying vec2 v_uv;
    varying float v_teamColor;
    varying vec4 v_color;
    varying vec4 v_uvTransRot;
    varying vec3 v_uvScaleSprite;

    void transform(inout vec3 position, inout vec3 normal, float boneNumber, vec4 bones, float instance) {
      // For the broken models out there, since the game supports this.
      if (boneNumber > 0.0) {
        mat4 b0 = fetchMatrix(bones[0], instance);
        mat4 b1 = fetchMatrix(bones[1], instance);
        mat4 b2 = fetchMatrix(bones[2], instance);
        mat4 b3 = fetchMatrix(bones[3], instance);
        vec4 p = vec4(position, 1.0);
        vec4 n = vec4(normal, 0.0);

        position = vec3(b0 * p + b1 * p + b2 * p + b3 * p) / boneNumber;
        normal = normalize(vec3(b0 * n + b1 * n + b2 * n + b3 * n));
      }
    }

    void main() {
      vec3 position = a_position;
      vec3 normal = a_normal;

      transform(position, normal, a_boneNumber, a_bones, a_InstanceID);

      v_uv = a_uv;
      v_uvTransRot = a_uvTransRot;
      v_uvScaleSprite = a_uvScaleSprite;
      v_normal = normal;
      v_teamColor = a_teamColor;
      v_color = a_vertexColor * a_geosetColor.bgra;
      v_color.a *= a_layerAlpha;

      if (a_geosetColor.a > 0.0 && a_layerAlpha > 0.0) {
        gl_Position = u_mvp * vec4(position, 1.0);
      } else {
        gl_Position = vec4(0.0);
      }
    }
  `,
  fs: `
    ${shaders.quat_transform}

    uniform sampler2D u_texture;
    uniform float u_filterMode;
    // uniform bool u_unshaded;
    uniform bool u_isTeamColor;
    uniform vec2 u_uvScale;
    uniform bool u_hasSlotAnim;
    uniform bool u_hasTranslationAnim;
    uniform bool u_hasRotationAnim;
    uniform bool u_hasScaleAnim;

    varying vec3 v_normal;
    varying vec2 v_uv;
    varying float v_teamColor;
    varying vec4 v_color;
    varying vec4 v_uvTransRot;
    varying vec3 v_uvScaleSprite;

    // const vec3 lightDirection = normalize(vec3(-0.3, -0.3, 0.25));

    void main() {
      vec2 uv;

      if (u_isTeamColor) {
        uv = vec2(v_teamColor / 14.0, 0.0) + vec2(v_uv.x / 14.0, v_uv.y);
      } else {
        uv = v_uv;

        // Translation animation
        if (u_hasTranslationAnim) {
          uv += v_uvTransRot.xy;
        }

        // Rotation animation
        if (u_hasRotationAnim) {
          uv = quat_transform(v_uvTransRot.zw, uv - 0.5) + 0.5;
        }

        // Scale animation
        if (u_hasScaleAnim) {
          uv = v_uvScaleSprite.x * (uv - 0.5) + 0.5;
        }

        // Sprite animation
        if (u_hasSlotAnim) {
          uv = (v_uvScaleSprite.yz + fract(uv)) * u_uvScale;
        }
      }

      vec4 texel = texture2D(u_texture, uv);
      vec4 color = texel * v_color;

      // 1bit Alpha
      if (u_filterMode == 1.0 && color.a < 0.75) {
        discard;
      }

      // "Close to 0 alpha"
      if (u_filterMode >= 5.0 && color.a < 0.02) {
        discard;
      }

      // if (!u_unshaded) {
      //   color *= clamp(dot(v_normal, lightDirection) + 0.45, 0.0, 1.0);
      // }

      gl_FragColor = color;
    }
  `,
  vsParticles: `
    #define EMITTER_PARTICLE2 0.0
    #define EMITTER_RIBBON 1.0
    #define EMITTER_SPLAT 2.0
    #define EMITTER_UBERSPLAT 3.0
    #define HEAD 0.0

    uniform mat4 u_mvp;

    uniform mediump float u_emitter;

    // Shared
    uniform vec4 u_colors[3];
    uniform vec3 u_vertices[4];
    uniform vec3 u_intervals[4];
    uniform float u_lifeSpan;
    uniform float u_columns;
    uniform float u_rows;

    // Particle2
    uniform vec3 u_scaling;
    uniform vec3 u_cameraZ;
    uniform float u_timeMiddle;
    uniform bool u_teamColored;

    // Splat and Uber.
    uniform vec3 u_intervalTimes;

    // Vertices
    attribute float a_position;

    // Instances
    attribute vec3 a_p0;
    attribute vec3 a_p1;
    attribute vec3 a_p2;
    attribute vec3 a_p3;
    attribute float a_health;
    attribute vec4 a_color;
    attribute float a_tail;
    attribute vec3 a_leftRightTop;

    varying vec2 v_texcoord;
    varying vec4 v_color;

    float getCell(vec3 interval, float factor) {
      float start = interval[0];
      float end = interval[1];
      float repeat = interval[2];
      float spriteCount = end - start;

      if (spriteCount > 0.0) {
        // Repeating speeds up the sprite animation, which makes it effectively run N times in its interval.
        // E.g. if repeat is 4, the sprite animation will be seen 4 times, and thus also run 4 times as fast.
        // The sprite index is limited to the number of actual sprites.
        return min(start + mod(floor(spriteCount * repeat * factor), spriteCount), u_columns * u_rows - 1.0);
      }

      return 0.0;
    }

    void particle2() {
      float factor = (u_lifeSpan - a_health) / u_lifeSpan;
      int index = 0;

      if (factor < u_timeMiddle) {
        factor = factor / u_timeMiddle;
        index = 0;
      } else {
        factor = (factor - u_timeMiddle) / (1.0 - u_timeMiddle);
        index = 1;
      }

      factor = min(factor, 1.0);

      float scale = mix(u_scaling[index], u_scaling[index + 1], factor);
      vec4 color = mix(u_colors[index], u_colors[index + 1], factor);

      float cell = 0.0;

      if (u_teamColored) {
        cell = a_leftRightTop[0];
      } else {
        vec3 interval;

        if (a_tail == HEAD) {
          interval = u_intervals[index];
        } else {
          interval = u_intervals[index + 2];
        }

        cell = getCell(interval, factor);
      }

      float left = floor(mod(cell, u_columns));
      float top = floor(cell / u_columns);
      float right = left + 1.0;
      float bottom = top + 1.0;

      left /= u_columns;
      right /= u_columns;
      top /= u_rows;
      bottom /= u_rows;

      if (a_position == 0.0) {
        v_texcoord = vec2(right, top);
      } else if (a_position == 1.0) {
        v_texcoord = vec2(left, top);
      } else if (a_position == 2.0) {
        v_texcoord = vec2(left, bottom);
      } else if (a_position == 3.0) {
        v_texcoord = vec2(right, bottom);
      }

      v_color = color;
      
      if (a_tail == HEAD) {
        gl_Position = u_mvp * vec4(a_p0 + (u_vertices[int(a_position)] * scale), 1.0);
      } else {
        // Get the normal to the tail in camera space.
        // This allows to build a 2D rectangle around the 3D tail.
        vec3 normal = cross(u_cameraZ, normalize(a_p1 - a_p0));
        vec3 boundary = normal * scale * a_p2[0];
        vec3 position;

        if (a_position == 0.0) {
          position = a_p0 - boundary;
        } else if (a_position == 1.0) {
          position = a_p1 - boundary;
        } else if (a_position == 2.0) {
          position = a_p1 + boundary;
        } else if (a_position == 3.0) {
          position = a_p0 + boundary;
        }

        gl_Position = u_mvp * vec4(position, 1.0);
      }
    }

    void ribbon() {
      vec3 position;
      float left = a_leftRightTop[0] / 255.0;
      float right = a_leftRightTop[1] / 255.0;
      float top = a_leftRightTop[2] / 255.0;
      float bottom = top + 1.0;

      if (a_position == 0.0) {
        v_texcoord = vec2(left, top);
        position = a_p0;
      } else if (a_position == 1.0) {
        v_texcoord = vec2(left, bottom);
        position = a_p1;
      } else if (a_position == 2.0) {
        v_texcoord = vec2(right, bottom);
        position = a_p2;
      } else if (a_position == 3.0) {
        v_texcoord = vec2(right, top);
        position = a_p3;
      }

      v_texcoord[0] /= u_columns;
      v_texcoord[1] /= u_rows;

      v_color = a_color;

      gl_Position = u_mvp * vec4(position, 1.0);
    }

    void splat() {
      float factor = u_lifeSpan - a_health;
      int index;

      if (factor < u_intervalTimes[0]) {
        factor = factor / u_intervalTimes[0];
        index = 0;
      } else {
        factor = (factor - u_intervalTimes[0]) / u_intervalTimes[1];
        index = 1;
      }

      float cell = getCell(u_intervals[index], factor);
      float left = floor(mod(cell, u_columns));
      float top = floor(cell / u_columns);
      float right = left + 1.0;
      float bottom = top + 1.0;
      vec3 position;

      if (a_position == 0.0) {
        v_texcoord = vec2(left, top);
        position = a_p0;
      } else if (a_position == 1.0) {
        v_texcoord = vec2(left, bottom);
        position = a_p1;
      } else if (a_position == 2.0) {
        v_texcoord = vec2(right, bottom);
        position = a_p2;
      } else if (a_position == 3.0) {
        v_texcoord = vec2(right, top);
        position = a_p3;
      }

      v_texcoord[0] /= u_columns;
      v_texcoord[1] /= u_rows;

      v_color = mix(u_colors[index], u_colors[index + 1], factor) / 255.0;

      gl_Position = u_mvp * vec4(position, 1.0);
    }

    void ubersplat() {
      float factor = u_lifeSpan - a_health;
      vec4 color;

      if (factor < u_intervalTimes[0]) {
        color = mix(u_colors[0], u_colors[1], factor / u_intervalTimes[0]);
      } else if (factor < u_intervalTimes[0] + u_intervalTimes[1]) {
        color = u_colors[1];
      } else {
        color = mix(u_colors[1], u_colors[2], (factor - u_intervalTimes[0] - u_intervalTimes[1]) / u_intervalTimes[2]);
      }

      vec3 position;

      if (a_position == 0.0) {
        v_texcoord = vec2(0.0, 0.0);
        position = a_p0;
      } else if (a_position == 1.0) {
        v_texcoord = vec2(0.0, 1.0);
        position = a_p1;
      } else if (a_position == 2.0) {
        v_texcoord = vec2(1.0, 1.0);
        position = a_p2;
      } else if (a_position == 3.0) {
        v_texcoord = vec2(1.0, 0.0);
        position = a_p3;
      }

      v_color = color / 255.0;

      gl_Position = u_mvp * vec4(position, 1.0);
    }

    void main() {
      if (u_emitter == EMITTER_PARTICLE2) {
        particle2();
      } else if (u_emitter == EMITTER_RIBBON) {
        ribbon();
      } else if (u_emitter == EMITTER_SPLAT) {
        splat();
      } else if (u_emitter == EMITTER_UBERSPLAT) {
        ubersplat();
      }
    }
  `,
  fsParticles: `
    #define EMITTER_RIBBON 1.0

    uniform sampler2D u_texture;

    uniform mediump float u_emitter;

    uniform float u_filterMode;

    varying vec2 v_texcoord;
    varying vec4 v_color;

    void main() {
      vec4 texel = texture2D(u_texture, v_texcoord);
      vec4 color = texel * v_color;

      // 1bit Alpha, used by ribbon emitters.
      if (u_emitter == EMITTER_RIBBON && u_filterMode == 1.0 && color.a < 0.75) {
        discard;
      }

      gl_FragColor = color;
    }
  `,
};
