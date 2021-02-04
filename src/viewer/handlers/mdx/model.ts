
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
import MdxTexture from './texture';
import { HandlerResourceData } from '../../handlerresource';

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
  textures: MdxTexture[] = [];
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

  constructor(bufferOrParser: ArrayBuffer | string | Parser, resourceData: HandlerResourceData) {
    super(resourceData);

    let parser;

    if (bufferOrParser instanceof Parser) {
      parser = bufferOrParser;
    } else {
      parser = new Parser();

      try {
        parser.load(bufferOrParser);
      } catch (e) {
        // If we get here, the parser failed to load.
        // It still may have loaded enough data to support rendering though!
        // I have encountered a model that is missing data, but still works in-game.
        // So just let the code continue.
        // If the handler manages to load the model, nothing happened.
        // If critical data is missing, it will fail and throw its own exception.
      }
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

    // Textures.
    let textures = parser.textures;
    for (let i = 0, l = textures.length; i < l; i++) {
      let texture = textures[i];
      let path = texture.path;
      let replaceableId = texture.replaceableId;
      let flags = texture.flags;

      if (replaceableId !== 0) {
        path = `ReplaceableTextures\\${replaceableIds[replaceableId]}${texturesExt}`;
      }

      let mdxTexture = new MdxTexture(replaceableId, !!(flags & 0x1), !!(flags & 0x2));

      viewer.load(path, pathSolver, solverParams)
        .then((texture) => {
          if (texture) {
            mdxTexture.texture = <Texture>texture;
          }
        });

      this.textures[i] = mdxTexture;
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

  addInstance(): MdxModelInstance {
    return new MdxModelInstance(this);
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
