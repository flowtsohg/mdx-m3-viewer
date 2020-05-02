import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';
import Extent from './extent';
import Sequence from './sequence';
import Material from './material';
import Texture from './texture';
import TextureAnimation from './textureanimation';
import Geoset from './geoset';
import GeosetAnimation from './geosetanimation';
import GenericObject from './genericobject';
import Bone from './bone';
import Light from './light';
import Helper from './helper';
import Attachment from './attachment';
import ParticleEmitter from './particleemitter';
import ParticleEmitter2 from './particleemitter2';
import RibbonEmitter from './ribbonemitter';
import Camera from './camera';
import EventObject from './eventobject';
import CollisionShape from './collisionshape';
import Corn from './corn';
import UnknownChunk from './unknownchunk';

/**
 * A Warcraft 3 model.
 * Supports loading from and saving to both the binary MDX and text MDL file formats.
 */
export default class Model {
  /**
   * 800 for Warcraft 3: RoC and TFT.
   * >800 for Warcraft 3: Reforged.
   */
  version: number = 800;
  name: string = '';
  /**
   * To the best of my knowledge, this should always be left empty.
   */
  animationFile: string = '';
  extent: Extent = new Extent();
  /**
   * This is only used by the now-defunct previewer that came with Art Tools.
   */
  blendTime: number = 0;
  sequences: Sequence[] = [];
  globalSequences: number[] = [];
  materials: Material[] = [];
  textures: Texture[] = [];
  textureAnimations: TextureAnimation[] = [];
  geosets: Geoset[] = [];
  geosetAnimations: GeosetAnimation[] = [];
  bones: Bone[] = [];
  lights: Light[] = [];
  helpers: Helper[] = [];
  attachments: Attachment[] = [];
  pivotPoints: Float32Array[] = [];
  particleEmitters: ParticleEmitter[] = [];
  particleEmitters2: ParticleEmitter2[] = [];
  ribbonEmitters: RibbonEmitter[] = [];
  cameras: Camera[] = [];
  eventObjects: EventObject[] = [];
  collisionShapes: CollisionShape[] = [];
  /**
   * @since 900
   */
  bindPose: Float32Array[] = [];
  /**
   * @since 900
   */
  corns: Corn[] = [];
  /**
   * @since 900
   */
  faceEffectTarget: string = '';
  /**
   * A path to a face effect file, which is used by the FaceFX runtime
   * 
   * @since 900
   */
  faceEffect: string = '';
  /**
   * The MDX format is chunk based, and Warcraft 3 does not mind there being unknown chunks in there.
   * Some 3rd party tools use this to attach metadata to models.
   * When an unknown chunk is encountered, it will be added here.
   * These chunks will be saved when saving as MDX.
   */
  unknownChunks: UnknownChunk[] = [];

  constructor(buffer?: ArrayBuffer | string) {
    if (buffer) {
      this.load(buffer);
    }
  }

  /**
   * Load the model from MDX or MDL.
   * The format is detected by the buffer type: ArrayBuffer for MDX, and string for MDL.
   */
  load(buffer: ArrayBuffer | string) {
    if (buffer instanceof ArrayBuffer) {
      this.loadMdx(buffer);
    } else {
      this.loadMdl(buffer);
    }
  }

  /**
   * Load the model from MDX.
   */
  loadMdx(buffer: ArrayBuffer) {
    let stream = new BinaryStream(buffer);

    if (stream.read(4) !== 'MDLX') {
      throw new Error('WrongMagicNumber');
    }

    while (stream.remaining() > 0) {
      let tag = stream.read(4);
      let size = stream.readUint32();

      if (tag === 'VERS') {
        this.loadVersionChunk(stream);
      } else if (tag === 'MODL') {
        this.loadModelChunk(stream);
      } else if (tag === 'SEQS') {
        this.loadStaticObjects(this.sequences, Sequence, stream, size / 132);
      } else if (tag === 'GLBS') {
        this.loadGlobalSequenceChunk(stream, size);
      } else if (tag === 'MTLS') {
        this.loadDynamicObjects(this.materials, Material, stream, size);
      } else if (tag === 'TEXS') {
        this.loadStaticObjects(this.textures, Texture, stream, size / 268);
      } else if (tag === 'TXAN') {
        this.loadDynamicObjects(this.textureAnimations, TextureAnimation, stream, size);
      } else if (tag === 'GEOS') {
        this.loadDynamicObjects(this.geosets, Geoset, stream, size);
      } else if (tag === 'GEOA') {
        this.loadDynamicObjects(this.geosetAnimations, GeosetAnimation, stream, size);
      } else if (tag === 'BONE') {
        this.loadDynamicObjects(this.bones, Bone, stream, size);
      } else if (tag === 'LITE') {
        this.loadDynamicObjects(this.lights, Light, stream, size);
      } else if (tag === 'HELP') {
        this.loadDynamicObjects(this.helpers, Helper, stream, size);
      } else if (tag === 'ATCH') {
        this.loadDynamicObjects(this.attachments, Attachment, stream, size);
      } else if (tag === 'PIVT') {
        this.loadPivotPointChunk(stream, size);
      } else if (tag === 'PREM') {
        this.loadDynamicObjects(this.particleEmitters, ParticleEmitter, stream, size);
      } else if (tag === 'PRE2') {
        this.loadDynamicObjects(this.particleEmitters2, ParticleEmitter2, stream, size);
      } else if (tag === 'RIBB') {
        this.loadDynamicObjects(this.ribbonEmitters, RibbonEmitter, stream, size);
      } else if (tag === 'CAMS') {
        this.loadDynamicObjects(this.cameras, Camera, stream, size);
      } else if (tag === 'EVTS') {
        this.loadDynamicObjects(this.eventObjects, EventObject, stream, size);
      } else if (tag === 'CLID') {
        this.loadDynamicObjects(this.collisionShapes, CollisionShape, stream, size);
      } else if (tag === 'BPOS') {
        this.loadBindPoseChunk(stream, size);
      } else if (tag === 'CORN') {
        this.loadDynamicObjects(this.corns, Corn, stream, size);
      } else if (tag === 'FAFX') {
        this.loadFaceEffectChunk(stream, size);
      } else {
        this.unknownChunks.push(new UnknownChunk(stream, size, tag));
      }
    }
  }

  loadVersionChunk(stream: BinaryStream) {
    this.version = stream.readUint32();
  }

  loadModelChunk(stream: BinaryStream) {
    this.name = stream.read(80);
    this.animationFile = stream.read(260);
    this.extent.readMdx(stream);
    this.blendTime = stream.readUint32();
  }

  loadStaticObjects(out: any[], constructor: typeof Sequence | typeof Texture, stream: BinaryStream, count: number) {
    for (let i = 0; i < count; i++) {
      let object = new constructor();

      object.readMdx(stream);

      out.push(object);
    }
  }

  loadGlobalSequenceChunk(stream: BinaryStream, size: number) {
    for (let i = 0, l = size / 4; i < l; i++) {
      this.globalSequences.push(stream.readUint32());
    }
  }

  loadDynamicObjects(out: any[], constructor: typeof Material | typeof TextureAnimation | typeof Geoset | typeof GeosetAnimation | typeof Bone | typeof Light | typeof Helper | typeof Attachment | typeof ParticleEmitter | typeof ParticleEmitter2 | typeof RibbonEmitter | typeof Camera | typeof EventObject | typeof CollisionShape | typeof Corn, stream: BinaryStream, size: number) {
    let end = stream.index + size;

    while (stream.index < end) {
      let object = new constructor();

      object.readMdx(stream, this.version);

      out.push(object);
    }
  }

  loadPivotPointChunk(stream: BinaryStream, size: number) {
    for (let i = 0, l = size / 12; i < l; i++) {
      this.pivotPoints.push(stream.readFloat32Array(3));
    }
  }

  loadBindPoseChunk(stream: BinaryStream, size: number) {
    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      this.bindPose[i] = stream.readFloat32Array(12);
    }
  }

  loadFaceEffectChunk(stream: BinaryStream, size: number) {
    this.faceEffectTarget = stream.read(80);
    this.faceEffect = stream.read(260);
  }

  /**
   * Save the model as MDX.
   */
  saveMdx() {
    let buffer = new ArrayBuffer(this.getByteLength());
    let stream = new BinaryStream(buffer);

    stream.write('MDLX');
    this.saveVersionChunk(stream);
    this.saveModelChunk(stream);
    this.saveStaticObjectChunk(stream, 'SEQS', this.sequences, 132);
    this.saveGlobalSequenceChunk(stream);
    this.saveDynamicObjectChunk(stream, 'MTLS', this.materials);
    this.saveStaticObjectChunk(stream, 'TEXS', this.textures, 268);
    this.saveDynamicObjectChunk(stream, 'TXAN', this.textureAnimations);
    this.saveDynamicObjectChunk(stream, 'GEOS', this.geosets);
    this.saveDynamicObjectChunk(stream, 'GEOA', this.geosetAnimations);
    this.saveDynamicObjectChunk(stream, 'BONE', this.bones);
    this.saveDynamicObjectChunk(stream, 'LITE', this.lights);
    this.saveDynamicObjectChunk(stream, 'HELP', this.helpers);
    this.saveDynamicObjectChunk(stream, 'ATCH', this.attachments);
    this.savePivotPointChunk(stream);
    this.saveDynamicObjectChunk(stream, 'PREM', this.particleEmitters);
    this.saveDynamicObjectChunk(stream, 'PRE2', this.particleEmitters2);
    this.saveDynamicObjectChunk(stream, 'RIBB', this.ribbonEmitters);
    this.saveDynamicObjectChunk(stream, 'CAMS', this.cameras);
    this.saveDynamicObjectChunk(stream, 'EVTS', this.eventObjects);
    this.saveDynamicObjectChunk(stream, 'CLID', this.collisionShapes);

    if (this.version > 800) {
      this.saveBindPoseChunk(stream);
      this.saveDynamicObjectChunk(stream, 'CORN', this.corns);
      this.saveFaceEffectChunk(stream);
    }

    for (let chunk of this.unknownChunks) {
      chunk.writeMdx(stream);
    }

    return buffer;
  }

  /**
   *
   */
  saveVersionChunk(stream: BinaryStream) {
    stream.write('VERS');
    stream.writeUint32(4);
    stream.writeUint32(this.version);
  }

  saveModelChunk(stream: BinaryStream) {
    stream.write('MODL');
    stream.writeUint32(372);
    stream.write(this.name);
    stream.skip(80 - this.name.length);
    stream.write(this.animationFile);
    stream.skip(260 - this.animationFile.length);
    this.extent.writeMdx(stream);
    stream.writeUint32(this.blendTime);
  }

  saveStaticObjectChunk(stream: BinaryStream, name: string, objects: (Sequence | Texture)[], size: number) {
    if (objects.length) {
      stream.write(name);
      stream.writeUint32(objects.length * size);

      for (let object of objects) {
        object.writeMdx(stream);
      }
    }
  }

  saveGlobalSequenceChunk(stream: BinaryStream) {
    if (this.globalSequences.length) {
      stream.write('GLBS');
      stream.writeUint32(this.globalSequences.length * 4);

      for (let globalSequence of this.globalSequences) {
        stream.writeUint32(globalSequence);
      }
    }
  }

  saveDynamicObjectChunk(stream: BinaryStream, name: string, objects: (Material | TextureAnimation | Geoset | GeosetAnimation | GenericObject | Camera)[]) {
    if (objects.length) {
      stream.write(name);
      stream.writeUint32(this.getObjectsByteLength(objects));

      for (let object of objects) {
        object.writeMdx(stream, this.version);
      }
    }
  }

  savePivotPointChunk(stream: BinaryStream) {
    if (this.pivotPoints.length) {
      stream.write('PIVT');
      stream.writeUint32(this.pivotPoints.length * 12);

      for (let pivotPoint of this.pivotPoints) {
        stream.writeFloat32Array(pivotPoint);
      }
    }
  }

  saveBindPoseChunk(stream: BinaryStream) {
    if (this.bindPose.length) {
      stream.write('BPOS');
      stream.writeUint32(4 + this.bindPose.length * 48);
      stream.writeUint32(this.bindPose.length);

      for (let matrix of this.bindPose) {
        stream.writeFloat32Array(matrix);
      }
    }
  }

  saveFaceEffectChunk(stream: BinaryStream) {
    if (this.faceEffectTarget !== '' && this.faceEffect !== '') {
      stream.write('FAFX');
      stream.writeUint32(340);
      stream.write(this.faceEffectTarget);
      stream.skip(80 - this.faceEffectTarget.length);
      stream.write(this.faceEffect);
      stream.skip(260 - this.faceEffect.length);
    }
  }

  /**
   * Load the model from MDL.
   */
  loadMdl(buffer: string) {
    let token: string;
    let stream = new TokenStream(buffer);

    while (token = <string>stream.read()) {
      if (token === 'Version') {
        this.loadVersionBlock(stream);
      } else if (token === 'Model') {
        this.loadModelBlock(stream);
      } else if (token === 'Sequences') {
        this.loadNumberedObjectBlock(this.sequences, Sequence, 'Anim', stream);
      } else if (token === 'GlobalSequences') {
        this.loadGlobalSequenceBlock(stream);
      } else if (token === 'Textures') {
        this.loadNumberedObjectBlock(this.textures, Texture, 'Bitmap', stream);
      } else if (token === 'Materials') {
        this.loadNumberedObjectBlock(this.materials, Material, 'Material', stream);
      } else if (token === 'TextureAnims') {
        this.loadNumberedObjectBlock(this.textureAnimations, TextureAnimation, 'TVertexAnim', stream);
      } else if (token === 'Geoset') {
        this.loadObject(this.geosets, Geoset, stream);
      } else if (token === 'GeosetAnim') {
        this.loadObject(this.geosetAnimations, GeosetAnimation, stream);
      } else if (token === 'Bone') {
        this.loadObject(this.bones, Bone, stream);
      } else if (token === 'Light') {
        this.loadObject(this.lights, Light, stream);
      } else if (token === 'Helper') {
        this.loadObject(this.helpers, Helper, stream);
      } else if (token === 'Attachment') {
        this.loadObject(this.attachments, Attachment, stream);
      } else if (token === 'PivotPoints') {
        this.loadPivotPointBlock(stream);
      } else if (token === 'ParticleEmitter') {
        this.loadObject(this.particleEmitters, ParticleEmitter, stream);
      } else if (token === 'ParticleEmitter2') {
        this.loadObject(this.particleEmitters2, ParticleEmitter2, stream);
      } else if (token === 'RibbonEmitter') {
        this.loadObject(this.ribbonEmitters, RibbonEmitter, stream);
      } else if (token === 'Camera') {
        this.loadObject(this.cameras, Camera, stream);
      } else if (token === 'EventObject') {
        this.loadObject(this.eventObjects, EventObject, stream);
      } else if (token === 'CollisionShape') {
        this.loadObject(this.collisionShapes, CollisionShape, stream);
      } else {
        throw new Error(`Unsupported block: ${token}`);
      }
    }
  }

  loadVersionBlock(stream: TokenStream) {
    for (let token of stream.readBlock()) {
      if (token === 'FormatVersion') {
        this.version = stream.readInt();
      } else {
        throw new Error(`Unknown token in Version: "${token}"`);
      }
    }
  }

  loadModelBlock(stream: TokenStream) {
    this.name = stream.readSafe();

    for (let token of stream.readBlockSafe()) {
      if (token.startsWith('Num')) {
        // Don't care about the number of things, the arrays will grow as they wish.
        // This includes:
        //      NumGeosets
        //      NumGeosetAnims
        //      NumHelpers
        //      NumLights
        //      NumBones
        //      NumAttachments
        //      NumParticleEmitters
        //      NumParticleEmitters2
        //      NumRibbonEmitters
        //      NumEvents
        stream.read();
      } else if (token === 'BlendTime') {
        this.blendTime = stream.readInt();
      } else if (token === 'AnimationFile') {
        this.animationFile = stream.readSafe();
      } else if (token === 'MinimumExtent') {
        stream.readFloatArray(this.extent.min);
      } else if (token === 'MaximumExtent') {
        stream.readFloatArray(this.extent.max);
      } else if (token === 'BoundsRadius') {
        this.extent.boundsRadius = stream.readFloat();
      } else {
        throw new Error(`Unknown token in Model: "${token}"`);
      }
    }
  }

  loadNumberedObjectBlock(out: any[], constructor: typeof Sequence | typeof Texture | typeof Material | typeof TextureAnimation, name: string, stream: TokenStream) {
    stream.read(); // Don't care about the number, the array will grow.

    for (let token of stream.readBlock()) {
      if (token === name) {
        let object = new constructor();

        object.readMdl(stream);

        out.push(object);
      } else {
        throw new Error(`Unknown token in ${name}: "${token}"`);
      }
    }
  }

  loadGlobalSequenceBlock(stream: TokenStream) {
    stream.read(); // Don't care about the number, the array will grow.

    for (let token of stream.readBlock()) {
      if (token === 'Duration') {
        this.globalSequences.push(stream.readInt());
      } else {
        throw new Error(`Unknown token in GlobalSequences: "${token}"`);
      }
    }
  }

  loadObject(out: any[], constructor: typeof Geoset | typeof GeosetAnimation | typeof Bone | typeof Light | typeof Helper | typeof Attachment | typeof ParticleEmitter | typeof ParticleEmitter2 | typeof RibbonEmitter | typeof Camera | typeof EventObject | typeof CollisionShape, stream: TokenStream) {
    let object = new constructor();

    object.readMdl(stream);

    out.push(object);
  }

  loadPivotPointBlock(stream: TokenStream) {
    let count = stream.readInt();

    stream.read(); // {

    for (let i = 0; i < count; i++) {
      this.pivotPoints.push(stream.readFloatArray(new Float32Array(3)));
    }

    stream.read(); // }
  }

  /**
   * Save the model as MDL.
   */
  saveMdl() {
    let stream = new TokenStream();

    this.saveVersionBlock(stream);
    this.saveModelBlock(stream);
    this.saveStaticObjectsBlock(stream, 'Sequences', this.sequences);
    this.saveGlobalSequenceBlock(stream);
    this.saveStaticObjectsBlock(stream, 'Textures', this.textures);
    this.saveStaticObjectsBlock(stream, 'Materials', this.materials);
    this.saveStaticObjectsBlock(stream, 'TextureAnims', this.textureAnimations);
    this.saveObjects(stream, this.geosets);
    this.saveObjects(stream, this.geosetAnimations);
    this.saveObjects(stream, this.bones);
    this.saveObjects(stream, this.lights);
    this.saveObjects(stream, this.helpers);
    this.saveObjects(stream, this.attachments);
    this.savePivotPointBlock(stream);
    this.saveObjects(stream, this.particleEmitters);
    this.saveObjects(stream, this.particleEmitters2);
    this.saveObjects(stream, this.ribbonEmitters);
    this.saveObjects(stream, this.cameras);
    this.saveObjects(stream, this.eventObjects);
    this.saveObjects(stream, this.collisionShapes);

    return stream.buffer;
  }

  saveVersionBlock(stream: TokenStream) {
    stream.startBlock('Version');
    stream.writeAttrib('FormatVersion', this.version);
    stream.endBlock();
  }

  saveModelBlock(stream: TokenStream) {
    stream.startObjectBlock('Model', this.name);
    stream.writeAttrib('BlendTime', this.blendTime);

    if (this.animationFile.length) {
      stream.writeStringAttrib('AnimationFile', this.animationFile);
    }

    this.extent.writeMdl(stream);
    stream.endBlock();
  }

  saveStaticObjectsBlock(stream: TokenStream, name: string, objects: (Sequence | Texture | Material | TextureAnimation)[]) {
    if (objects.length) {
      stream.startBlock(name, objects.length);

      for (let object of objects) {
        object.writeMdl(stream);
      }

      stream.endBlock();
    }
  }

  saveGlobalSequenceBlock(stream: TokenStream) {
    if (this.globalSequences.length) {
      stream.startBlock('GlobalSequences', this.globalSequences.length);

      for (let globalSequence of this.globalSequences) {
        stream.writeAttrib('Duration', globalSequence);
      }

      stream.endBlock();
    }
  }

  saveObjects(stream: TokenStream, objects: (Geoset | GeosetAnimation | Bone | Light | Helper | Attachment | ParticleEmitter | ParticleEmitter2 | RibbonEmitter | Camera | EventObject | CollisionShape)[]) {
    for (let object of objects) {
      object.writeMdl(stream);
    }
  }

  savePivotPointBlock(stream: TokenStream) {
    if (this.pivotPoints.length) {
      stream.startBlock('PivotPoints', this.pivotPoints.length);

      for (let pivotPoint of this.pivotPoints) {
        stream.writeFloatArray(pivotPoint);
      }

      stream.endBlock();
    }
  }

  /**
   * Calculate the size of the model as MDX.
   */
  getByteLength() {
    let size = 396;

    size += this.getStaticObjectsChunkByteLength(this.sequences, 132);
    size += this.getStaticObjectsChunkByteLength(this.globalSequences, 4);
    size += this.getDynamicObjectsChunkByteLength(this.materials);
    size += this.getStaticObjectsChunkByteLength(this.textures, 268);
    size += this.getDynamicObjectsChunkByteLength(this.textureAnimations);
    size += this.getDynamicObjectsChunkByteLength(this.geosets);
    size += this.getDynamicObjectsChunkByteLength(this.geosetAnimations);
    size += this.getDynamicObjectsChunkByteLength(this.bones);
    size += this.getDynamicObjectsChunkByteLength(this.lights);
    size += this.getDynamicObjectsChunkByteLength(this.helpers);
    size += this.getDynamicObjectsChunkByteLength(this.attachments);
    size += this.getStaticObjectsChunkByteLength(this.pivotPoints, 12);
    size += this.getDynamicObjectsChunkByteLength(this.particleEmitters);
    size += this.getDynamicObjectsChunkByteLength(this.particleEmitters2);
    size += this.getDynamicObjectsChunkByteLength(this.ribbonEmitters);
    size += this.getDynamicObjectsChunkByteLength(this.cameras);
    size += this.getDynamicObjectsChunkByteLength(this.eventObjects);
    size += this.getDynamicObjectsChunkByteLength(this.collisionShapes);

    if (this.version > 800) {
      size += this.getBindPoseChunkByteLength();
      size += this.getDynamicObjectsChunkByteLength(this.corns);
      size += this.getFaceEffectChunkByteLength();
    }

    size += this.getObjectsByteLength(this.unknownChunks);

    return size;
  }

  getObjectsByteLength(objects: (Material | TextureAnimation | Geoset | GeosetAnimation | GenericObject | Camera | UnknownChunk)[]) {
    let size = 0;

    for (let object of objects) {
      size += object.getByteLength(this.version);
    }

    return size;
  }

  getDynamicObjectsChunkByteLength(objects: (Material | TextureAnimation | Geoset | GeosetAnimation | GenericObject | Camera | UnknownChunk)[]) {
    if (objects.length) {
      return 8 + this.getObjectsByteLength(objects);
    }

    return 0;
  }

  getStaticObjectsChunkByteLength(objects: (Sequence | number | Texture | Float32Array)[], size: number) {
    if (objects.length) {
      return 8 + objects.length * size;
    }

    return 0;
  }

  getBindPoseChunkByteLength() {
    if (this.bindPose.length) {
      return 12 + this.bindPose.length * 48;
    }

    return 0;
  }

  getFaceEffectChunkByteLength() {
    if (this.faceEffectTarget !== '' && this.faceEffect !== '') {
      return 348;
    }

    return 0;
  }
}
