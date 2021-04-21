import { extname } from '../../../common/path';
import { FetchDataType } from '../../../common/fetchdatatype';
import { decodeAudioData } from '../../../common/audio';
import MdlxModel from '../../../parsers/mdlx/model';
import { isMdx, isMdl } from '../../../parsers/mdlx/isformat';
import { MappedData, MappedDataRow } from '../../../utils/mappeddata';
import ModelViewer from '../../viewer';
import Shader from '../../gl/shader';
import { PathSolver } from '../../handlerresource';
import { Resource } from '../../resource';
import GenericResource from '../../genericresource';
import Texture from '../../texture';
import Model from './model';
import MdxTexture from './texture';
import standardVert from './shaders/standard.vert';
import standardFrag from './shaders/standard.frag';
import hdVert from './shaders/hd.vert';
import hdFrag from './shaders/hd.frag';
import particlesVert from './shaders/particles.vert';
import particlesFrag from './shaders/particles.frag';

interface MdxHandlerObject {
  pathSolver?: PathSolver;
  reforged: boolean;
  standardShader: Shader;
  extendedShader: Shader;
  hdSkinShader: Shader;
  hdVertexGroupShader: Shader;
  particlesShader: Shader;
  rectBuffer: WebGLBuffer;
  teamColors: MdxTexture[];
  teamGlows: MdxTexture[];
  eventObjectTables: { [key: string]: GenericResource[] };
}

const mappedDataCallback = (data: FetchDataType) => new MappedData(<string>data);
const decodedDataCallback = (data: FetchDataType) => decodeAudioData(<ArrayBuffer>data);

export default {
  load(viewer: ModelViewer, pathSolver?: PathSolver, reforged: boolean = false) {
    let gl = viewer.gl;
    let webgl = viewer.webgl;

    // Bone textures.
    if (!webgl.ensureExtension('OES_texture_float')) {
      throw new Error('MDX: No float texture support!');
    }

    // Geometry emitters.
    if (!webgl.ensureExtension('ANGLE_instanced_arrays')) {
      throw new Error('MDX: No instanced rendering support!');
    }

    let standardShader = webgl.createShader(standardVert, standardFrag);
    let extendedShader = webgl.createShader('#define EXTENDED_BONES\n' + standardVert, standardFrag);
    let hdSkinShader = webgl.createShader('#define SKIN\n' + hdVert, hdFrag);
    let hdVertexGroupShader = webgl.createShader(hdVert, hdFrag);
    let particlesShader = webgl.createShader(particlesVert, particlesFrag);

    let rectBuffer = <WebGLBuffer>gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, rectBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);

    let teamColors: MdxTexture[] = [];
    let teamGlows: MdxTexture[] = [];

    let eventObjectTables: { [key: string]: GenericResource[] } = {};

    let handlerData: MdxHandlerObject = {
      pathSolver,
      reforged,
      // Shaders.
      standardShader,
      extendedShader,
      hdSkinShader,
      hdVertexGroupShader,
      particlesShader,
      // Geometry emitters buffer.
      rectBuffer,
      // Team color/glow textures - loaded when the first model that uses team textures is loaded.
      teamColors,
      teamGlows,
      eventObjectTables,
    };

    viewer.sharedCache.set('mdx', handlerData);
  },
  isValidSource(object: any) {
    if (object instanceof MdlxModel) {
      return true;
    }

    return isMdx(object) || isMdl(object);
  },
  resource: Model,
  loadTeamTextures(viewer: ModelViewer) {
    let { pathSolver, reforged, teamColors, teamGlows } = <MdxHandlerObject>viewer.sharedCache.get('mdx');

    if (teamColors.length === 0) {
      let teams = reforged ? 28 : 16;
      let ext = reforged ? 'dds' : 'blp';
      let params = reforged ? { reforged: true } : undefined;

      for (let i = 0; i < teams; i++) {
        let id = `${i}`.padStart(2, '0');
        let end = `${id}.${ext}`;

        let teamColor = new MdxTexture(1, true, true);
        let teamGlow = new MdxTexture(2, true, true);

        viewer.load(`ReplaceableTextures\\TeamColor\\TeamColor${end}`, pathSolver, params)
          .then((texture) => teamColor.texture = <Texture>texture);

        viewer.load(`ReplaceableTextures\\TeamGlow\\TeamGlow${end}`, pathSolver, params)
          .then((texture) => teamGlow.texture = <Texture>texture);

        teamColors[i] = teamColor;
        teamGlows[i] = teamGlow;
      }
    }
  },
  getEventObjectSoundFile(file: string, reforged: boolean, isHd: boolean, tables: GenericResource[]) {
    if (!reforged || extname(file) === '.flac') {
      return file;
    }

    for (let i = 1, l = tables.length; i < l; i++) {
      let raceRow = (<MappedData>tables[i].data).getRow(file);

      if (raceRow) {
        let flags = <string>raceRow.Flags;
        let filePath = <string>raceRow.Filepath;

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
  },
  async getEventObjectData(viewer: ModelViewer, type: string, id: string, isHd: boolean) {
    // Units\Critters\BlackStagMale\BlackStagMale.mdx has an event object named "Point01".
    if (type !== 'SPN' && type !== 'SPL' && type !== 'UBR' && type !== 'SND') {
      return;
    }

    let { pathSolver, reforged, eventObjectTables } = <MdxHandlerObject>viewer.sharedCache.get('mdx');
    let params = reforged ? { reforged: true } : undefined;
    let safePathSolver = (src: any, params: any) => {
      if (pathSolver) {
        return pathSolver(src, params);
      }

      return src;
    }

    if (!eventObjectTables[type]) {
      let paths = [];

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

      let promises = paths.map((path) => viewer.loadGeneric(safePathSolver(path, params), 'text', mappedDataCallback));
      let resources = await Promise.all(promises);

      for (let resource of resources) {
        if (!resource) {
          return;
        }
      }

      eventObjectTables[type] = <GenericResource[]>resources;
    }

    let tables = eventObjectTables[type];
    let mappedData = <MappedData>tables[0].data;
    let row: MappedDataRow | undefined;
    let promises = [];

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
        let lookupRow = (<MappedData>tables[1].data).getRow(id);

        if (lookupRow) {
          row = mappedData.getRow(<string>lookupRow.SoundLabel);
        }
      }

      if (row) {
        for (let fileName of (<string>row.FileNames).split(',')) {
          let file = this.getEventObjectSoundFile(fileName, reforged, isHd, tables);

          if (file) {
            promises.push(viewer.loadGeneric(safePathSolver(file, params), 'arrayBuffer', decodedDataCallback));
          }
        }
      }
    } else {
      // Model and texture event objects are simpler than sounds - just get the right model or texture file.
      row = mappedData.getRow(id);

      if (row) {
        if (type === 'SPN') {
          promises.push(viewer.load((<string>row.Model).replace('.mdl', '.mdx'), safePathSolver, params));
        } else if (type === 'SPL' || type === 'UBR') {
          promises.push(viewer.load(`ReplaceableTextures\\Splats\\${row.file}${reforged ? '.dds' : '.blp'}`, safePathSolver, params));
        }
      }
    }

    if (row && promises.length) {
      let resources = await Promise.all(promises);

      // Make sure the resources actually loaded properly.
      let filtered = <Resource[]>resources.filter((resource) => resource);

      if (filtered.length) {
        return { row, resources: filtered };
      }
    }
  },
};
