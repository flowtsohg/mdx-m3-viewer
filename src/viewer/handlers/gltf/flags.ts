import GltfPrimitive from './primitive';
import { ALPHA_MODE_OPAQUE, ALPHA_MODE_MASK, GltfMaterial } from './material';

// Primitive flags.
const HAS_NORMALS = 0x1;
const HAS_TANGENTS = 0x2;
const HAS_UV_SET0 = 0x4;
const HAS_UV_SET1 = 0x8;
const USE_SKINNING = 0x10;
const USE_MORPHING = 0x20;
const HAS_JOINT_SET0 = 0x40;
const HAS_JOINT_SET1 = 0x80;
const HAS_WEIGHT_SET0 = 0x100;
const HAS_WEIGHT_SET1 = 0x200;
const HAS_TARGET_POSITION0 = 0x400;
const HAS_TARGET_POSITION1 = 0x800;
const HAS_TARGET_POSITION2 = 0x1000;
const HAS_TARGET_POSITION3 = 0x2000;
const HAS_TARGET_POSITION4 = 0x4000;
const HAS_TARGET_POSITION5 = 0x8000;
const HAS_TARGET_POSITION6 = 0x10000;
const HAS_TARGET_POSITION7 = 0x20000;
const HAS_TARGET_NORMAL0 = 0x40000;
const HAS_TARGET_NORMAL1 = 0x80000;
const HAS_TARGET_NORMAL2 = 0x100000;
const HAS_TARGET_NORMAL3 = 0x200000;
const HAS_TARGET_TANGENT0 = 0x400000;
const HAS_TARGET_TANGENT1 = 0x800000;
const HAS_TARGET_TANGENT2 = 0x1000000;
const HAS_TARGET_TANGENT3 = 0x2000000;
// Material flags.
export const ALPHAMODE_OPAQUE = 0x1;
export const ALPHAMODE_MASK = 0x2;
const MATERIAL_METALLICROUGHNESS = 0x4;
const HAS_BASE_COLOR_MAP = 0x8;
const HAS_METALLIC_ROUGHNESS_MAP = 0x10;
const MATERIAL_SPECULARGLOSSINESS = 0x20;
const HAS_DIFFUSE_MAP = 0x40;
const HAS_SPECULAR_GLOSSINESS_MAP = 0x80;
const HAS_NORMAL_MAP = 0x100;
const HAS_OCCLUSION_MAP = 0x200;
const HAS_EMISSIVE_MAP = 0x400;
const MATERIAL_UNLIT = 0x800;
// Global flags.
const USE_ENV = 0x1;
const USE_PUNCTUAL = 0x2;
const USE_TEX_LOD = 0x4;
const USE_HDR = 0x8;
const TONEMAP_UNCHARTED = 0x10;
const TONEMAP_HEJLRICHARD = 0x20;
const TONEMAP_ACES = 0x40;

export function getPrimitiveFlags(primitive: GltfPrimitive) {
  let flags = 0;

  if (primitive.normals !== -1) {
    flags |= HAS_NORMALS;
  }

  if (primitive.tangents !== -1) {
    flags |= HAS_TANGENTS;
  }

  if (primitive.uvSet0 !== -1) {
    flags |= HAS_UV_SET0;
  }

  if (primitive.uvSet1 !== -1) {
    flags |= HAS_UV_SET1;
  }

  return flags;
}

export function getPrimitiveDefines(flags: number) {
  let defines = [];

  if (flags & HAS_NORMALS) {
    defines.push('HAS_NORMALS');
  }

  if (flags & HAS_TANGENTS) {
    defines.push('HAS_TANGENTS');
  }

  if (flags & HAS_UV_SET0) {
    defines.push('HAS_UV_SET0');
  }

  if (flags & HAS_UV_SET1) {
    defines.push('HAS_UV_SET1');
  }

  return defines;
}

export function getMaterialFlags(material: GltfMaterial) {
  let flags = 0;

  if (material.alphaMode === ALPHA_MODE_OPAQUE) {
    flags |= ALPHAMODE_OPAQUE;
  } else if (material.alphaMode === ALPHA_MODE_MASK) {
    flags |= ALPHAMODE_MASK;
  }

  if (material.metallicRoughness) {
    flags |= MATERIAL_METALLICROUGHNESS;

    if (material.baseColorTexture !== -1) {
      flags |= HAS_BASE_COLOR_MAP;
    }

    if (material.metallicRoughnessTexture !== -1) {
      flags |= HAS_METALLIC_ROUGHNESS_MAP;
    }
  }

  if (material.specularGlossiness) {
    flags |= MATERIAL_SPECULARGLOSSINESS;

    if (material.diffuseTexture !== -1) {
      flags |= HAS_DIFFUSE_MAP;
    }

    if (material.specularGlossinessTexture !== -1) {
      flags |= HAS_SPECULAR_GLOSSINESS_MAP;
    }
  }

  if (material.normalTexture !== -1) {
    flags |= HAS_NORMAL_MAP;
  }

  if (material.occlusionTexture !== -1) {
    flags |= HAS_OCCLUSION_MAP;
  }

  if (material.emissiveTexture !== -1) {
    flags |= HAS_EMISSIVE_MAP;
  }

  return flags;
}

export function getMaterialDefines(flags: number) {
  let defines = [];

  if (flags & ALPHAMODE_OPAQUE) {
    defines.push('ALPHAMODE_OPAQUE');
  } else if (flags & ALPHAMODE_MASK) {
    defines.push('ALPHAMODE_MASK');
  }

  if (flags & MATERIAL_METALLICROUGHNESS) {
    defines.push('MATERIAL_METALLICROUGHNESS');

    if (flags & HAS_BASE_COLOR_MAP) {
      defines.push('HAS_BASE_COLOR_MAP');
    }

    if (flags & HAS_METALLIC_ROUGHNESS_MAP) {
      defines.push('HAS_METALLIC_ROUGHNESS_MAP');
    }
  }

  if (flags & MATERIAL_SPECULARGLOSSINESS) {
    defines.push('MATERIAL_SPECULARGLOSSINESS');

    if (flags & HAS_DIFFUSE_MAP) {
      defines.push('HAS_DIFFUSE_MAP');
    }

    if (flags & HAS_SPECULAR_GLOSSINESS_MAP) {
      defines.push('HAS_SPECULAR_GLOSSINESS_MAP');
    }
  }

  if (flags & HAS_NORMAL_MAP) {
    defines.push('HAS_NORMAL_MAP');
  }

  if (flags & HAS_OCCLUSION_MAP) {
    defines.push('HAS_OCCLUSION_MAP');
  }

  if (flags & HAS_EMISSIVE_MAP) {
    defines.push('HAS_EMISSIVE_MAP');
  }

  return defines;
}
