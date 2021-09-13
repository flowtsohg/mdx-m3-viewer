const shader = `
#ifdef SKIN
attribute vec4 a_bones;
attribute vec4 a_weights;

void transformSkin(inout vec3 position, inout vec3 normal, inout vec3 tangent, inout vec3 binormal) {
  mat4 bone;

  bone += fetchMatrix(a_bones[0], 0.0) * a_weights[0];
  bone += fetchMatrix(a_bones[1], 0.0) * a_weights[1];
  bone += fetchMatrix(a_bones[2], 0.0) * a_weights[2];
  bone += fetchMatrix(a_bones[3], 0.0) * a_weights[3];

  mat3 rotation = mat3(bone);

  position = vec3(bone * vec4(position, 1.0));
  normal = rotation * normal;
  tangent = rotation * tangent;
  binormal = rotation * binormal;
}
#else
attribute vec4 a_bones;
#ifdef EXTENDED_BONES
attribute vec4 a_extendedBones;
#endif
attribute float a_boneNumber;

mat4 getVertexGroupMatrix() {
  mat4 bone;

  // For the broken models out there, since the game supports this.
  if (a_boneNumber > 0.0) {
    for (int i = 0; i < 4; i++) {
      if (a_bones[i] > 0.0) {
        bone += fetchMatrix(a_bones[i] - 1.0, 0.0);
      }
    }

    #ifdef EXTENDED_BONES
      for (int i = 0; i < 4; i++) {
        if (a_extendedBones[i] > 0.0) {
          bone += fetchMatrix(a_extendedBones[i] - 1.0, 0.0);
        }
      }
    #endif
  }

  return bone / a_boneNumber;
}

void transformVertexGroups(inout vec3 position, inout vec3 normal) {
  mat4 bone = getVertexGroupMatrix();
  mat3 rotation = mat3(bone);

  position = vec3(bone * vec4(position, 1.0));
  normal = normalize(rotation * normal);
}

void transformVertexGroupsHD(inout vec3 position, inout vec3 normal, inout vec3 tangent, inout vec3 binormal) {
  mat4 bone = getVertexGroupMatrix();
  mat3 rotation = mat3(bone);

  position = vec3(bone * vec4(position, 1.0));
  normal = normalize(rotation * normal);
  tangent = normalize(rotation * tangent);
  binormal = normalize(rotation * binormal);
}
#endif
`;

export default shader;
