
import Parser from '../../../parsers/mdlx/model';
import Sequence from '../../../parsers/mdlx/sequence';
import Model from '../../model';
import Texture from '../../texture';
import TextureAnimation from './textureanimation';
import Layer from './layer';
import Material from './material';
import GeosetAnimation from './geosetanimation';
import replaceableIds from './replaceableids';
import Bone from './bone';
import Light from './light';
import Helper from './helper';
import Attachment from './attachment';
import ParticleEmitterObject from './particleemitterobject';
import ParticleEmitter2Object from './particleemitter2object';
import RibbonEmitterObject from './ribbonemitterobject';
import Camera from './camera';
import EventObjectEmitterObject from './eventobjectemitterobject';
import CollisionShape from './collisionshape';
import setupGeosets from './setupgeosets';
import setupGroups from './setupgroups';
import BatchGroup from './batchgroup';
import EmitterGroup from './emittergroup';
import GenericObject from './genericobject';
import Batch from './batch';
import Geoset from './geoset';
import MdxModelInstance from './modelinstance';

/**
 * An MDX model.
 */
export default class MdxModel extends Model {
  reforged: boolean = false;
  hd: boolean = false;
  solverParams: { reforged?: boolean, hd?: boolean } = {};
  name: string = '';
  sequences: Sequence[] = [];
  globalSequences: number[] = [];
  materials: Material[] = [];
  layers: Layer[] = [];
  replaceables: number[] = [];
  textures: Texture[] = [];
  textureAnimations: TextureAnimation[] = [];
  geosets: Geoset[] = [];
  geosetAnimations: GeosetAnimation[] = [];
  bones: Bone[] = [];
  lights: Light[] = [];
  helpers: Helper[] = [];
  attachments: Attachment[] = [];
  pivotPoints: Float32Array[] = [];
  particleEmitters: ParticleEmitterObject[] = [];
  particleEmitters2: ParticleEmitter2Object[] = [];
  ribbonEmitters: RibbonEmitterObject[] = [];
  cameras: Camera[] = [];
  eventObjects: EventObjectEmitterObject[] = [];
  collisionShapes: CollisionShape[] = [];
  hasLayerAnims: boolean = false;
  hasGeosetAnims: boolean = false;
  batches: Batch[] = [];
  genericObjects: GenericObject[] = [];
  sortedGenericObjects: GenericObject[] = [];
  hierarchy: number[] = [];
  opaqueGroups: BatchGroup[] = [];
  translucentGroups: (BatchGroup | EmitterGroup)[] = [];
  arrayBuffer: WebGLBuffer | null = null;
  elementBuffer: WebGLBuffer | null = null;
  skinDataType: number = 0;
  bytesPerSkinElement: number = 1;

  createInstance(): MdxModelInstance {
    return new MdxModelInstance(this);
  }

  load(bufferOrParser: ArrayBuffer | string | Parser) {
    let parser;

    if (bufferOrParser instanceof Parser) {
      parser = bufferOrParser;
    } else {
      parser = new Parser(bufferOrParser);
    }

    let viewer = this.viewer;
    let pathSolver = this.pathSolver;
    let solverParams = this.solverParams;
    let reforged = parser.version > 800;
    let texturesExt = reforged ? '.dds' : '.blp';

    this.reforged = reforged;
    this.name = parser.name;

    // Initialize the bounds.
    let extent = parser.extent;
    this.bounds.fromExtents(extent.min, extent.max);

    // Sequences
    for (let sequence of parser.sequences) {
      this.sequences.push(sequence);
    }

    // Global sequences
    for (let globalSequence of parser.globalSequences) {
      this.globalSequences.push(globalSequence);
    }

    // Texture animations
    for (let textureAnimation of parser.textureAnimations) {
      this.textureAnimations.push(new TextureAnimation(this, textureAnimation));
    }

    // Materials
    let layerId = 0;
    for (let material of parser.materials) {
      let layers = [];

      for (let layer of material.layers) {
        let vLayer = new Layer(this, layer, layerId++, material.priorityPlane);

        layers.push(vLayer);

        this.layers.push(vLayer);
      }

      this.materials.push(new Material(this, material.shader, layers));

      if (material.shader !== '') {
        this.hd = true;
      }
    }

    if (reforged) {
      solverParams.reforged = true;
    }

    if (this.hd) {
      solverParams.hd = true;
    }

    let gl = viewer.gl;
    let usingTeamTextures = false;

    // Textures.
    for (let texture of parser.textures) {
      let path = texture.path;
      let replaceableId = texture.replaceableId;
      let flags = texture.flags;

      if (replaceableId !== 0) {
        path = `ReplaceableTextures\\${replaceableIds[replaceableId]}${texturesExt}`;

        if (replaceableId === 1 || replaceableId === 2) {
          usingTeamTextures = true;
        }
      }

      if (reforged && !path.endsWith('.dds')) {
        path = `${path.slice(0, -4)}.dds`;
      }

      let viewerTexture = <Texture>viewer.load(path, pathSolver, solverParams);

      // When the texture will load, it will apply its wrap modes.
      if (!viewerTexture.loaded) {
        if (flags & 0x1) {
          viewerTexture.wrapS = gl.REPEAT;
        }

        if (flags & 0x2) {
          viewerTexture.wrapT = gl.REPEAT;
        }
      }

      this.replaceables.push(replaceableId);
      this.textures.push(viewerTexture);
    }

    // Start loading the team color and glow textures if this model uses them and they weren't loaded previously.
    if (usingTeamTextures) {
      let mdxCache = viewer.sharedCache.get('mdx');
      let teamColors = reforged ? mdxCache.reforgedTeamColors : mdxCache.teamColors;
      let teamGlows = reforged ? mdxCache.reforgedTeamGlows : mdxCache.teamGlows;

      if (!teamColors.length) {
        for (let i = 0; i < 28; i++) {
          let id = ('' + i).padStart(2, '0');

          teamColors[i] = <Texture>viewer.load(`ReplaceableTextures\\TeamColor\\TeamColor${id}${texturesExt}`, pathSolver, solverParams);
          teamGlows[i] = <Texture>viewer.load(`ReplaceableTextures\\TeamGlow\\TeamGlow${id}${texturesExt}`, pathSolver, solverParams);
        }
      }
    }

    // Geoset animations
    for (let geosetAnimation of parser.geosetAnimations) {
      this.geosetAnimations.push(new GeosetAnimation(this, geosetAnimation));
    }

    this.pivotPoints = parser.pivotPoints;

    // Tracks the IDs of all generic objects.
    let objectId = 0;

    // Bones
    for (let bone of parser.bones) {
      this.bones.push(new Bone(this, bone, objectId++));
    }

    // Lights
    for (let light of parser.lights) {
      this.lights.push(new Light(this, light, objectId++));
    }

    // Helpers
    for (let helper of parser.helpers) {
      this.helpers.push(new Helper(this, helper, objectId++));
    }

    // Attachments
    for (let attachment of parser.attachments) {
      this.attachments.push(new Attachment(this, attachment, objectId++));
    }

    // Particle emitters
    for (let particleEmitter of parser.particleEmitters) {
      this.particleEmitters.push(new ParticleEmitterObject(this, particleEmitter, objectId++));
    }

    // Particle emitters 2
    for (let particleEmitter2 of parser.particleEmitters2) {
      this.particleEmitters2.push(new ParticleEmitter2Object(this, particleEmitter2, objectId++));
    }

    // Ribbon emitters
    for (let ribbonEmitter of parser.ribbonEmitters) {
      this.ribbonEmitters.push(new RibbonEmitterObject(this, ribbonEmitter, objectId++));
    }

    // Cameras
    for (let camera of parser.cameras) {
      this.cameras.push(new Camera(this, camera));
    }

    // Event objects
    for (let eventObject of parser.eventObjects) {
      this.eventObjects.push(new EventObjectEmitterObject(this, eventObject, objectId++));
    }

    // Collision shapes
    for (let collisionShape of parser.collisionShapes) {
      this.collisionShapes.push(new CollisionShape(this, collisionShape, objectId++));
    }

    // One array for all generic objects.
    this.genericObjects.push(...this.bones, ...this.lights, ...this.helpers, ...this.attachments, ...this.particleEmitters, ...this.particleEmitters2, ...this.ribbonEmitters, ...this.eventObjects, ...this.collisionShapes);

    // Geosets
    setupGeosets(this, parser.geosets);

    // Render groups.
    setupGroups(this);

    // Creates the sorted indices array of the generic objects.
    this.setupHierarchy(-1);

    // Keep a sorted array.
    for (let i = 0, l = this.genericObjects.length; i < l; i++) {
      this.sortedGenericObjects[i] = this.genericObjects[this.hierarchy[i]];
    }
  }

  setupHierarchy(parent: number) {
    for (let i = 0, l = this.genericObjects.length; i < l; i++) {
      let object = this.genericObjects[i];

      if (object.parentId === parent) {
        this.hierarchy.push(i);

        this.setupHierarchy(object.objectId);
      }
    }
  }
}
