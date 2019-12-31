const shader = `
#ifdef HAS_TARGET_POSITION0
  attribute vec3 a_targetPosition0;
#endif

#ifdef HAS_TARGET_POSITION1
  attribute vec3 a_targetPosition1;
#endif

#ifdef HAS_TARGET_POSITION2
  attribute vec3 a_targetPosition2;
#endif

#ifdef HAS_TARGET_POSITION3
  attribute vec3 a_targetPosition3;
#endif

#ifdef HAS_TARGET_POSITION4
  attribute vec3 a_targetPosition4;
#endif

#ifdef HAS_TARGET_POSITION5
  attribute vec3 a_targetPosition5;
#endif

#ifdef HAS_TARGET_POSITION6
  attribute vec3 a_targetPosition6;
#endif

#ifdef HAS_TARGET_POSITION7
  attribute vec3 a_targetPosition7;
#endif

#ifdef HAS_TARGET_NORMAL0
  attribute vec3 a_targetNormal0;
#endif

#ifdef HAS_TARGET_NORMAL1
  attribute vec3 a_targetNormal1;
#endif

#ifdef HAS_TARGET_NORMAL2
  attribute vec3 a_targetNormal2;
#endif

#ifdef HAS_TARGET_NORMAL3
  attribute vec3 a_targetNormal3;
#endif

#ifdef HAS_TARGET_TANGENT0
  attribute vec3 a_targetTangent0;
#endif

#ifdef HAS_TARGET_TANGENT1
  attribute vec3 a_targetTangent1;
#endif

#ifdef HAS_TARGET_TANGENT2
  attribute vec3 a_targetTangent2;
#endif

#ifdef HAS_TARGET_TANGENT3
  attribute vec3 a_targetTangent3;
#endif

#ifdef USE_MORPHING
  uniform float u_morphWeights[WEIGHT_COUNT];
#endif

#ifdef HAS_JOINT_SET0
  attribute vec4 a_joint0;
#endif

#ifdef HAS_JOINT_SET1
  attribute vec4 a_joint1;
#endif

#ifdef HAS_WEIGHT_SET0
  attribute vec4 a_weight0;
#endif

#ifdef HAS_WEIGHT_SET1
  attribute vec4 a_weight1;
#endif

#ifdef USE_SKINNING
  uniform mat4 u_jointMatrix[JOINT_COUNT];
  uniform mat4 u_jointNormalMatrix[JOINT_COUNT];
#endif

#ifdef USE_SKINNING
  mat4 getSkinningMatrix() {
    mat4 skin = mat4(0);

    #if defined(HAS_WEIGHT_SET0) && defined(HAS_JOINT_SET0)
      skin +=
        a_weight0.x * u_jointMatrix[int(a_joint0.x)] +
        a_weight0.y * u_jointMatrix[int(a_joint0.y)] +
        a_weight0.z * u_jointMatrix[int(a_joint0.z)] +
        a_weight0.w * u_jointMatrix[int(a_joint0.w)];
    #endif

    #if defined(HAS_WEIGHT_SET1) && defined(HAS_JOINT_SET1)
      skin +=
        a_weight1.x * u_jointMatrix[int(a_joint1.x)] +
        a_weight1.y * u_jointMatrix[int(a_joint1.y)] +
        a_weight1.z * u_jointMatrix[int(a_joint1.z)] +
        a_weight1.w * u_jointMatrix[int(a_joint1.w)];
    #endif

    return skin;
  }

  mat4 getSkinningNormalMatrix() {
    mat4 skin = mat4(0);

    #if defined(HAS_WEIGHT_SET0) && defined(HAS_JOINT_SET0)
      skin +=
        a_weight0.x * u_jointNormalMatrix[int(a_joint0.x)] +
        a_weight0.y * u_jointNormalMatrix[int(a_joint0.y)] +
        a_weight0.z * u_jointNormalMatrix[int(a_joint0.z)] +
        a_weight0.w * u_jointNormalMatrix[int(a_joint0.w)];
    #endif

    #if defined(HAS_WEIGHT_SET1) && defined(HAS_JOINT_SET1)
      skin +=
        a_weight1.x * u_jointNormalMatrix[int(a_joint1.x)] +
        a_weight1.y * u_jointNormalMatrix[int(a_joint1.y)] +
        a_weight1.z * u_jointNormalMatrix[int(a_joint1.z)] +
        a_weight1.w * u_jointNormalMatrix[int(a_joint1.w)];
    #endif

    return skin;
  }
#endif

#ifdef USE_MORPHING
  vec4 getTargetPosition() {
    vec4 pos = vec4(0);

    #ifdef HAS_TARGET_POSITION0
      pos.xyz += u_morphWeights[0] * a_targetPosition0;
    #endif

    #ifdef HAS_TARGET_POSITION1
      pos.xyz += u_morphWeights[1] * a_targetPosition1;
    #endif

    #ifdef HAS_TARGET_POSITION2
      pos.xyz += u_morphWeights[2] * a_targetPosition2;
    #endif

    #ifdef HAS_TARGET_POSITION3
      pos.xyz += u_morphWeights[3] * a_targetPosition3;
    #endif

    #ifdef HAS_TARGET_POSITION4
      pos.xyz += u_morphWeights[4] * a_targetPosition4;
    #endif

    return pos;
  }

  vec4 getTargetNormal() {
    vec4 normal = vec4(0);

    #ifdef HAS_TARGET_NORMAL0
      normal.xyz += u_morphWeights[0] * a_targetNormal0;
    #endif

    #ifdef HAS_TARGET_NORMAL1
      normal.xyz += u_morphWeights[1] * a_targetNormal1;
    #endif

    #ifdef HAS_TARGET_NORMAL2
      normal.xyz += u_morphWeights[2] * a_targetNormal2;
    #endif

    #ifdef HAS_TARGET_NORMAL3
      normal.xyz += u_morphWeights[3] * a_targetNormal3;
    #endif

    #ifdef HAS_TARGET_NORMAL4
      normal.xyz += u_morphWeights[4] * a_targetNormal4;
    #endif

    return normal;
  }

  vec4 getTargetTangent() {
    vec4 tangent = vec4(0);

    #ifdef HAS_TARGET_TANGENT0
      tangent.xyz += u_morphWeights[0] * a_targetTangent0;
    #endif

    #ifdef HAS_TARGET_TANGENT1
      tangent.xyz += u_morphWeights[1] * a_targetTangent1;
    #endif

    #ifdef HAS_TARGET_TANGENT2
      tangent.xyz += u_morphWeights[2] * a_targetTangent2;
    #endif

    #ifdef HAS_TARGET_TANGENT3
      tangent.xyz += u_morphWeights[3] * a_targetTangent3;
    #endif

    #ifdef HAS_TARGET_TANGENT4
      tangent.xyz += u_morphWeights[4] * a_targetTangent4;
    #endif

    return tangent;
  }
#endif
`;

export default shader;
