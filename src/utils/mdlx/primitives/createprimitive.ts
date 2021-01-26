import MdlxModel from '../../../parsers/mdlx/model';
import MdlxTexture from '../../../parsers/mdlx/texture';
import MdlxMaterial from '../../../parsers/mdlx/material';
import MdlxLayer from '../../../parsers/mdlx/layer';
import MdlxGeoset from '../../../parsers/mdlx/geoset';
import MdlxGeosetAnimation from '../../../parsers/mdlx/geosetanimation';
import MdlxBone from '../../../parsers/mdlx/bone';
import ModelViewer from '../../../viewer/viewer';
import { PathSolver } from '../../../viewer/handlerresource';
import Texture from '../../../viewer/texture';

interface Primitive {
  vertices: Float32Array;
  uvs: Float32Array;
  faces: Uint16Array;
  edges: Uint16Array;
  boundingRadius: number;
}

interface Material {
  lines?: boolean;
  color?: Float32Array;
  texture?: Texture | Promise<Texture>;
  twoSided?: boolean;
}

export default function createPrimitive(viewer: ModelViewer, primitive: Primitive, material: Material) {
  let lines: boolean | undefined;
  let color: Float32Array | undefined;
  let texture: Texture | Promise<Texture> | undefined;
  let pathSolver: PathSolver | undefined;
  let layerFlags = 0;

  if (material) {
    lines = material.lines;
    color = material.color;
    texture = material.texture;

    if (material.twoSided) {
      layerFlags |= 0x10;
    }
  }

  let model = new MdlxModel();

  // Extent
  let extent = model.extent;
  let r = primitive.boundingRadius;

  extent.min.fill(-r);
  extent.max.fill(r);
  extent.boundsRadius = r;

  // Texture
  let tex = new MdlxTexture();

  tex.path = 'PLACEHOLDER';

  model.textures[0] = tex;

  pathSolver = (src) => {
    if (src === model) {
      return model;
    }

    return texture;
  }

  // Material
  let mat = new MdlxMaterial();

  let layer = new MdlxLayer();

  layer.textureId = 0;
  layer.flags = layerFlags;

  mat.layers[0] = layer;

  model.materials[0] = mat;

  // Geoset
  let geoset = new MdlxGeoset();

  geoset.vertices = primitive.vertices;
  geoset.uvSets[0] = primitive.uvs;
  geoset.matrixGroups = new Uint32Array([1]);
  geoset.matrixIndices = new Uint32Array([0]);
  geoset.vertexGroups = new Uint8Array(primitive.vertices.length / 3);

  let faceTypeGroup = 4;
  let indices = primitive.faces;

  if (lines) {
    faceTypeGroup = 1;
    indices = primitive.edges;
  }

  geoset.faceTypeGroups = new Uint32Array([faceTypeGroup]);
  geoset.faceGroups = new Uint32Array([indices.length]);
  geoset.faces = indices;

  model.geosets[0] = geoset;

  // Color via a geoset animation.
  if (color) {
    let geosetAnimation = new MdlxGeosetAnimation();

    geosetAnimation.geosetId = 0;
    geosetAnimation.color = color;

    model.geosetAnimations[0] = geosetAnimation;
  }

  // Bone - otherwise can't transform the instance.
  let bone = new MdlxBone();

  bone.objectId = 0;

  model.bones[0] = bone;

  // Load and return the promise.
  return viewer.load(model, pathSolver);
}
