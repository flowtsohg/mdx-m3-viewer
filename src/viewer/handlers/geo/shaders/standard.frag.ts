const shader = `
precision mediump float;
    
uniform sampler2D u_diffuseMap;
uniform bool u_isEdge;
uniform bool u_hasTexture;
uniform bool u_sizzle;

varying vec2 v_uv;
varying vec3 v_faceColor;
varying vec3 v_edgeColor;

void main() {
  vec3 color;

  if (u_isEdge) {
    color = v_edgeColor;
  } else {
    color = v_faceColor;

    if (u_hasTexture) {
      vec4 texel = texture2D(u_diffuseMap, v_uv);

      if (u_sizzle) {
        texel = texel.bgra;
      }

      color *= texel.rgb;
    }
  }

  gl_FragColor = vec4(color, 1.0);
}
`;

export default shader;
