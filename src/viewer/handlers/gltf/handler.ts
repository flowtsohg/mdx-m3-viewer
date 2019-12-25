import ModelViewer from '../../viewer';
import { PathSolver } from '../../handlerresource';
import ShaderProgram from '../../gl/program';
import Texture from '../../texture';
import CubeMap from '../../cubemap';
import Model from './model';
import GltfBatchGroup from './batchgroup';
import { getPrimitiveDefines, getMaterialDefines } from './flags';
import primitiveVert from './shaders/primitive.vert';
import metallicRoughnessFrag from './shaders/metallic-roughness.frag';

let shaders: { [key: string]: { [key: string]: ShaderProgram } } = {};

let env = {
  hasTextures: 0,
  specularTexture: <CubeMap | null>null,
  diffuseTexture: <CubeMap | null>null,
  brdfLUTTexture: <Texture | null>null,
};

export default {
  extensions: [['.gltf', 'text'], ['.glb', 'arrayBuffer']],
  load(viewer: ModelViewer) {
    return true;
  },
  resource: Model,
  async loadEnv(viewer: ModelViewer, specularSolver: PathSolver, diffuseSolver: PathSolver, brdfLUTSolver: PathSolver) {
    env.specularTexture = viewer.loadCubeMap(specularSolver);
    env.diffuseTexture = viewer.loadCubeMap(diffuseSolver);
    env.brdfLUTTexture = viewer.loadImageTexture(brdfLUTSolver);

    await viewer.whenLoaded([env.specularTexture, env.diffuseTexture, env.brdfLUTTexture]);

    if (env.specularTexture.ok && env.diffuseTexture.ok && env.brdfLUTTexture.ok) {
      env.hasTextures = 1;
    }
  },
  getShader(group: GltfBatchGroup) {
    let primitiveFlags = group.primitiveFlags;
    let materialFlags = group.materialFlags;

    if (!shaders[primitiveFlags]) {
      shaders[primitiveFlags] = {};
    }

    if (!shaders[primitiveFlags][materialFlags]) {
      let primitiveDefines = getPrimitiveDefines(primitiveFlags);
      let materialDefines = getMaterialDefines(materialFlags);
      let globalDefines = [
        'USE_ENV',
        'USE_TEX_LOD',
      ];

      let defines = [...primitiveDefines, ...materialDefines, ...globalDefines].map((value) => `#define ${value}`).join('\n') + '\n';

      shaders[primitiveFlags][materialFlags] = group.model.viewer.webgl.createShaderProgram(defines + primitiveVert, defines + metallicRoughnessFrag);
    }

    return shaders[primitiveFlags][materialFlags];
  },
  shaders,
  env,
};
