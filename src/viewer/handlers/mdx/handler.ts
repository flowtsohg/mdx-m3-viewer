import { extname } from '../../../common/path';
import { FetchDataType } from '../../../common/fetchdatatype';
import { decodeAudioData } from '../../../common/audio';
import MdlxModel from '../../../parsers/mdlx/model';
import { isMdx, isMdl } from '../../../parsers/mdlx/isformat';
import { MappedData, MappedDataRow } from '../../../utils/mappeddata';
import ModelViewer, { DebugRenderMode } from '../../viewer';
import Shader from '../../gl/shader';
import { PathSolver, SolverParams } from '../../handlerresource';
import { Resource } from '../../resource';
import GenericResource from '../../genericresource';
import Texture from '../../texture';
import Model from './model';
import MdxTexture from './texture';
import sdVert from './shaders/sd.vert';
import sdFrag from './shaders/sd.frag';
import hdVert from './shaders/hd.vert';
import hdFrag from './shaders/hd.frag';
import particlesVert from './shaders/particles.vert';
import particlesFrag from './shaders/particles.frag';
import { SkinningType } from './batch';
import { WrapMode } from '../../../parsers/mdlx/texture';

export interface EventObjectData {
  row: MappedDataRow;
  resources: Resource[];
}

export interface MdxHandlerObject {
  pathSolver?: PathSolver;
  reforged: boolean;
  sdShader: Shader;
  sdExtendedShader: Shader;
  hdShader: Shader;
  hdExtendedShader: Shader;
  hdSkinShader: Shader;
  particlesShader: Shader;
  sdDebugShaders: Shader[][];
  hdDebugShaders: Shader[][];
  rectBuffer: WebGLBuffer;
  teamColors: MdxTexture[];
  teamGlows: MdxTexture[];
  eventObjectTables: {[key: string]: GenericResource[] };

  // lutTexture: MdxTexture | null;
  // envDiffuseTexture: MdxTexture | null;
  // envSpecularTexture: MdxTexture | null;
}

const mappedDataCallback = (data: FetchDataType): MappedData => new MappedData(<string>data);
const decodedDataCallback = (data: FetchDataType): Promise<AudioBuffer | undefined> => decodeAudioData(<ArrayBuffer>data);

export default {
  load(viewer: ModelViewer, pathSolver?: PathSolver, reforged = false): void {
    const gl = viewer.gl;
    const webgl = viewer.webgl;

    // Bone textures.
    if (!webgl.ensureExtension('OES_texture_float')) {
      throw new Error('MDX: No float texture support!');
    }

    // Geometry emitters.
    if (!webgl.ensureExtension('ANGLE_instanced_arrays')) {
      throw new Error('MDX: No instanced rendering support!');
    }

    // Shaders. Lots of them.
    const sdExtendedVert = '#define EXTENDED_BONES\n' + sdVert;
    const sdDiffuse = '#define ONLY_DIFFUSE\n' + sdFrag;
    const sdTexcoords = '#define ONLY_TEXCOORDS\n' + sdFrag;
    const sdNormals = '#define ONLY_NORMALS\n' + sdFrag;
    const hdExtendedVert = '#define EXTENDED_BONES\n' + hdVert;
    const hdSkinVert = '#define SKIN\n' + hdVert;
    const hdDiffuse = '#define ONLY_DIFFUSE\n' + hdFrag;
    const hdNormalMap = '#define ONLY_NORMAL_MAP\n' + hdFrag;
    const hdOcclusion = '#define ONLY_OCCLUSION\n' + hdFrag;
    const hdRoughness = '#define ONLY_ROUGHNESS\n' + hdFrag;
    const hdMetallic = '#define ONLY_METALLIC\n' + hdFrag;
    const hdTCFactor = '#define ONLY_TC_FACTOR\n' + hdFrag;
    const hdEmissive = '#define ONLY_EMISSIVE\n' + hdFrag;
    const hdTexCoords = '#define ONLY_TEXCOORDS\n' + hdFrag;
    const hdNormals = '#define ONLY_NORMALS\n' + hdFrag;
    const hdTangents = '#define ONLY_TANGENTS\n' + hdFrag;
    
    const sdShader = webgl.createShader(sdVert, sdFrag);
    const sdExtendedShader = webgl.createShader(sdExtendedVert, sdFrag);
    const hdShader = webgl.createShader(hdVert, hdFrag);
    const hdExtendedShader = webgl.createShader(hdExtendedVert, hdFrag);
    const hdSkinShader = webgl.createShader(hdSkinVert, hdFrag);
    const particlesShader = webgl.createShader(particlesVert, particlesFrag);

    const sdDebugShaders: Shader[][] = [];
    const hdDebugShaders: Shader[][] = [];

    let shaders: Shader[] = [];
    shaders[DebugRenderMode.Diffuse] = webgl.createShader(sdVert, sdDiffuse);
    shaders[DebugRenderMode.TexCoords] = webgl.createShader(sdVert, sdTexcoords);
    shaders[DebugRenderMode.Normals] = webgl.createShader(sdVert, sdNormals);
    sdDebugShaders[SkinningType.VertexGroups] = shaders;

    shaders = [];
    shaders[DebugRenderMode.Diffuse] = webgl.createShader(sdExtendedVert, sdDiffuse);
    shaders[DebugRenderMode.TexCoords] = webgl.createShader(sdExtendedVert, sdTexcoords);
    shaders[DebugRenderMode.Normals] = webgl.createShader(sdExtendedVert, sdNormals);
    sdDebugShaders[SkinningType.ExtendedVertexGroups] = shaders;

    shaders = [];
    shaders[DebugRenderMode.Diffuse] = webgl.createShader(hdVert, hdDiffuse);
    shaders[DebugRenderMode.NormalMap] = webgl.createShader(hdVert, hdNormalMap);
    shaders[DebugRenderMode.Occlusion] = webgl.createShader(hdVert, hdOcclusion);
    shaders[DebugRenderMode.Roughness] = webgl.createShader(hdVert, hdRoughness);
    shaders[DebugRenderMode.Metallic] = webgl.createShader(hdVert, hdMetallic);
    shaders[DebugRenderMode.TCFactor] = webgl.createShader(hdVert, hdTCFactor);
    shaders[DebugRenderMode.Emissive] = webgl.createShader(hdVert, hdEmissive);
    shaders[DebugRenderMode.TexCoords] = webgl.createShader(hdVert, hdTexCoords);
    shaders[DebugRenderMode.Normals] = webgl.createShader(hdVert, hdNormals);
    shaders[DebugRenderMode.Tangents] = webgl.createShader('#define ONLY_TANGENTS\n' + hdVert, hdTangents);
    hdDebugShaders[SkinningType.VertexGroups] = shaders;

    shaders = [];
    shaders[DebugRenderMode.Diffuse] = webgl.createShader(hdExtendedVert, hdDiffuse);
    shaders[DebugRenderMode.NormalMap] = webgl.createShader(hdExtendedVert, hdNormalMap);
    shaders[DebugRenderMode.Occlusion] = webgl.createShader(hdExtendedVert, hdOcclusion);
    shaders[DebugRenderMode.Roughness] = webgl.createShader(hdExtendedVert, hdRoughness);
    shaders[DebugRenderMode.Metallic] = webgl.createShader(hdExtendedVert, hdMetallic);
    shaders[DebugRenderMode.TCFactor] = webgl.createShader(hdExtendedVert, hdTCFactor);
    shaders[DebugRenderMode.Emissive] = webgl.createShader(hdExtendedVert, hdEmissive);
    shaders[DebugRenderMode.TexCoords] = webgl.createShader(hdExtendedVert, hdTexCoords);
    shaders[DebugRenderMode.Normals] = webgl.createShader(hdExtendedVert, hdNormals);
    shaders[DebugRenderMode.Tangents] = webgl.createShader('#define ONLY_TANGENTS\n' + hdExtendedVert, hdTangents);
    hdDebugShaders[SkinningType.ExtendedVertexGroups] = shaders;

    shaders = [];
    shaders[DebugRenderMode.Diffuse] = webgl.createShader(hdSkinVert, hdDiffuse);
    shaders[DebugRenderMode.NormalMap] = webgl.createShader(hdSkinVert, hdNormalMap);
    shaders[DebugRenderMode.Occlusion] = webgl.createShader(hdSkinVert, hdOcclusion);
    shaders[DebugRenderMode.Roughness] = webgl.createShader(hdSkinVert, hdRoughness);
    shaders[DebugRenderMode.Metallic] = webgl.createShader(hdSkinVert, hdMetallic);
    shaders[DebugRenderMode.TCFactor] = webgl.createShader(hdSkinVert, hdTCFactor);
    shaders[DebugRenderMode.Emissive] = webgl.createShader(hdSkinVert, hdEmissive);
    shaders[DebugRenderMode.TexCoords] = webgl.createShader(hdSkinVert, hdTexCoords);
    shaders[DebugRenderMode.Normals] = webgl.createShader(hdSkinVert, hdNormals);
    shaders[DebugRenderMode.Tangents] = webgl.createShader('#define ONLY_TANGENTS\n' + hdSkinVert, hdTangents);
    hdDebugShaders[SkinningType.Skin] = shaders;

    const rectBuffer = <WebGLBuffer>gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, rectBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);

    const handlerData: MdxHandlerObject = {
      pathSolver,
      reforged,
      // Shaders.
      sdShader,
      sdExtendedShader,
      hdShader,
      hdExtendedShader,
      hdSkinShader,
      particlesShader,
      sdDebugShaders,
      hdDebugShaders,
      // Geometry emitters buffer.
      rectBuffer,
      // Team color/glow textures - loaded when the first model that uses team textures is loaded.
      teamColors: [],
      teamGlows: [],
      eventObjectTables: {},

      // lutTexture: null,
      // envDiffuseTexture: null,
      // envSpecularTexture: null,
    };

    viewer.sharedCache.set('mdx', handlerData);
  },
  isValidSource(object: unknown): boolean {
    if (object instanceof MdlxModel) {
      return true;
    }

    return isMdx(object) || isMdl(object);
  },
  resource: Model,
  // async loadEnv(viewer: ModelViewer) {
  //   const mdxHandler = <MdxHandlerObject>viewer.sharedCache.get('mdx');

  //   if (!mdxHandler.lutTexture) {
  //     mdxHandler.lutTexture = new MdxTexture(0, WrapMode.WrapBoth);
  //     mdxHandler.envDiffuseTexture = new MdxTexture(0, WrapMode.WrapBoth);
  //     mdxHandler.envSpecularTexture = new MdxTexture(0, WrapMode.WrapBoth);

  //     const [lutTexture, diffuseTexture, specularTexture] = await Promise.all([
  //       viewer.load('env/lut.png'),
  //       viewer.load('env/diffuse-sRGB.png'),
  //       viewer.load('env/specular-sRGB.png'),
  //     ]);

  //     mdxHandler.lutTexture.texture = <Texture>lutTexture;
  //     mdxHandler.envDiffuseTexture.texture = <Texture>diffuseTexture;
  //     mdxHandler.envSpecularTexture.texture = <Texture>specularTexture;
  //   }

  // },
  loadTeamTextures(viewer: ModelViewer): void {
    const { pathSolver, reforged, teamColors, teamGlows } = <MdxHandlerObject>viewer.sharedCache.get('mdx');

    if (teamColors.length === 0) {
      const teams = reforged ? 28 : 16;
      const ext = reforged ? 'dds' : 'blp';
      const params = reforged ? { reforged: true } : undefined;

      for (let i = 0; i < teams; i++) {
        const id = `${i}`.padStart(2, '0');
        const end = `${id}.${ext}`;

        const teamColor = new MdxTexture(1, WrapMode.WrapBoth);
        const teamGlow = new MdxTexture(2, WrapMode.WrapBoth);

        viewer.load(`ReplaceableTextures\\TeamColor\\TeamColor${end}`, pathSolver, params)
          .then((texture) => teamColor.texture = <Texture>texture);

        viewer.load(`ReplaceableTextures\\TeamGlow\\TeamGlow${end}`, pathSolver, params)
          .then((texture) => teamGlow.texture = <Texture>texture);

        teamColors[i] = teamColor;
        teamGlows[i] = teamGlow;
      }
    }
  },
  getEventObjectSoundFile(file: string, reforged: boolean, isHd: boolean, tables: GenericResource[]): string | undefined {
    if (!reforged || extname(file) === '.flac') {
      return file;
    }

    for (let i = 1, l = tables.length; i < l; i++) {
      const raceRow = (<MappedData>tables[i].data).getRow(file);

      if (raceRow) {
        const flags = raceRow.string('Flags');
        const filePath = raceRow.string('Filepath');

        if (flags === 'SD_ONLY') {
          if (!isHd) {
            return filePath;
          }
        } else if (flags === 'HD_ONLY') {
          if (isHd) {
            return filePath;
          }
        } else {
          return filePath;
        }
      }
    }

    return;
  },
  async getEventObjectData(viewer: ModelViewer, type: string, id: string, isHd: boolean): Promise<EventObjectData | undefined> {
    // Units\Critters\BlackStagMale\BlackStagMale.mdx has an event object named "Point01".
    if (type !== 'SPN' && type !== 'SPL' && type !== 'UBR' && type !== 'SND') {
      return;
    }

    const { pathSolver, reforged, eventObjectTables } = <MdxHandlerObject>viewer.sharedCache.get('mdx');
    const params: SolverParams = reforged ? { reforged: true } : {};
    const safePathSolver: PathSolver = (src: unknown, params?: SolverParams): unknown => {
      if (pathSolver) {
        return pathSolver(src, params);
      }

      return src;
    };

    if (!eventObjectTables[type]) {
      const paths = [];

      if (type === 'SPN') {
        paths.push('Splats\\SpawnData.slk');
      } else if (type === 'SPL') {
        paths.push('Splats\\SplatData.slk');
      } else if (type === 'UBR') {
        paths.push('Splats\\UberSplatData.slk');
      } else if (type === 'SND') {
        paths.push('UI\\SoundInfo\\AnimSounds.slk');

        // Reforged changed the data layout.
        if (reforged) {
          paths.push(
            'UI\\SoundInfo\\DialogueHumanBase.slk',
            'UI\\SoundInfo\\DialogueOrcBase.slk',
            'UI\\SoundInfo\\DialogueUndeadBase.slk',
            'UI\\SoundInfo\\DialogueNightElfBase.slk',
            'UI\\SoundInfo\\DialogueNagaBase.slk',
            'UI\\SoundInfo\\DialogueDemonBase.slk',
            'UI\\SoundInfo\\DialogueCreepsBase.slk');
        } else {
          paths.push('UI\\SoundInfo\\AnimLookups.slk');
        }
      }

      const promises = paths.map((path) => viewer.loadGeneric(<string>safePathSolver(path, params), 'text', mappedDataCallback));
      const resources = await Promise.all(promises);

      for (const resource of resources) {
        if (!resource) {
          return;
        }
      }

      eventObjectTables[type] = <GenericResource[]>resources;
    }

    const tables = eventObjectTables[type];
    const mappedData = <MappedData>tables[0].data;
    let row: MappedDataRow | undefined;
    const promises = [];

    if (type === 'SND') {
      // How to get the sound row?
      // TFT has AnimLookups.slk, which stores a ID->Label. Give it the event object ID, get back the label to look for in AnimSounds.slk.
      // Reforged removed AnimLookups.slk, and instead has the ID under a new column in AnimSounds.slk called AnimationEventCode.
      // In addition, Reforged can have SD/HD flags per sound, to determine whether it should load in SD or HD modes.
      // When a sound has both modes, the path to it in AnimSounds.slk won't be an actual file path (ending with .flac) but rather a label.
      // This label can be queried in other sound SLKs such as DialogueHumanBase.slk, which contains the full path and the mentioned flags.
      if (reforged) {
        row = mappedData.findRow('AnimationEventCode', id);
      } else {
        const lookupRow = (<MappedData>tables[1].data).getRow(id);

        if (lookupRow) {
          row = mappedData.getRow(<string>lookupRow.string('SoundLabel'));
        }
      }

      if (row) {
        for (const fileName of (<string>row.string('FileNames')).split(',')) {
          const file = this.getEventObjectSoundFile(fileName, reforged, isHd, tables);

          if (file) {
            promises.push(viewer.loadGeneric(<string>safePathSolver(file, params), 'arrayBuffer', decodedDataCallback));
          }
        }
      }
    } else {
      // Model and texture event objects are simpler than sounds - just get the right model or texture file.
      row = mappedData.getRow(id);

      if (row) {
        if (type === 'SPN') {
          promises.push(viewer.load((<string>row.string('Model')).replace('.mdl', '.mdx'), safePathSolver, params));
        } else if (type === 'SPL' || type === 'UBR') {
          promises.push(viewer.load(`ReplaceableTextures\\Splats\\${row.string('file')}${reforged ? '.dds' : '.blp'}`, safePathSolver, params));
        }
      }
    }

    if (row && promises.length) {
      const resources = await Promise.all(promises);

      // Make sure the resources actually loaded properly.
      const filtered = <Resource[]>resources.filter((resource) => resource);

      if (filtered.length) {
        return { row, resources: filtered };
      }
    }

    return;
  },
  getBatchShader(viewer: ModelViewer, skinningType: SkinningType, isHd: boolean): Shader {
    const mdxCache = <MdxHandlerObject>viewer.sharedCache.get('mdx');
    const debugRenderMode = viewer.debugRenderMode;

    if (isHd) {
      if (debugRenderMode !== DebugRenderMode.None) {
        const shaders = mdxCache.hdDebugShaders[skinningType];
        if (shaders) {
          const shader = shaders[debugRenderMode];
          if (shader) {
            return shader;
          }
        }
      }
      
      if (skinningType === SkinningType.Skin) {
        return mdxCache.hdSkinShader;
      } else if (skinningType === SkinningType.VertexGroups) {
        return mdxCache.hdShader;
      } else {
        return mdxCache.hdExtendedShader;
      }
    } else {
      if (debugRenderMode !== DebugRenderMode.None) {
        const shaders = mdxCache.sdDebugShaders[skinningType];
        if (shaders) {
          const shader = shaders[debugRenderMode];
          if (shader) {
            return shader;
          }
        }
      }

      if (skinningType === SkinningType.VertexGroups) {
        return mdxCache.sdShader;
      } else {
        return mdxCache.sdExtendedShader;
      }
    }
  }
};
