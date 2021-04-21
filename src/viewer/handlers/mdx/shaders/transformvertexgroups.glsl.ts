const shader = `
attribute vec4 a_bones;
#ifdef EXTENDED_BONES
attribute vec4 a_extendedBones;
#endif
attribute float a_boneNumber;

void transformVertexGroups(inout vec3 position, inout vec3 normal) {
  // For the broken models out there, since the game supports this.
  if (a_boneNumber > 0.0) {
    vec4 position4 = vec4(position, 1.0);
    vec4 normal4 = vec4(normal, 0.0);
    mat4 bone;
    vec4 p;
    vec4 n;

    for (int i = 0; i < 4; i++) {
      if (a_bones[i] > 0.0) {
        bone = fetchMatrix(a_bones[i] - 1.0, 0.0);

        p += bone * position4;
        n += bone * normal4;
      }
    }

    #ifdef EXTENDED_BONES
      for (int i = 0; i < 4; i++) {
        if (a_extendedBones[i] > 0.0) {
          bone = fetchMatrix(a_extendedBones[i] - 1.0, 0.0);

          p += bone * position4;
          n += bone * normal4;
        }
      }
    #endif

    position = p.xyz / a_boneNumber;
    normal = normalize(n.xyz);
  }
}
`;

export default shader;
