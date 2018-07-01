import BinaryStream from '../../common/binarystream';
import TokenStream from '../../common/tokenstream';
import Extent from './extent';
import Sequence from './sequence';
import Material from './material';
import Texture from './texture';
import TextureAnimation from './textureanimation';
import Geoset from './geoset';
import GeosetAnimation from './geosetanimation';
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
import UnknownChunk from './unknownchunk';

/**
 * A Warcraft 3 model.
 * Supports loading from and saving to both the binary MDX and text MDL file formats.
 */
export default class Model {
  /**
   * @param {?ArrayBuffer|string} buffer
   */
  constructor(buffer) {
    /**
     * Always 800 since Warcraft 3 released.
     *
     * @member {number}
     */
    this.version = 800;
    /** @member {string} */
    this.name = '';
    /**
     * To the best of my knowledge, this should always be left empty.
     * This is probably a leftover from the Warcraft 3 beta.
     *
     * @member {string}
     */
    this.animationFile = '';
    /** @member {Extent} */
    this.extent = new Extent();
    /** @member {number} */
    this.blendTime = 0;
    /** @member {Array<Sequence>} */
    this.sequences = [];
    /** @member {Array<number>} */
    this.globalSequences = [];
    /** @member {Array<Material>} */
    this.materials = [];
    /** @member {Array<Texture>} */
    this.textures = [];
    /** @member {Array<TextureAnimation>} */
    this.textureAnimations = [];
    /** @member {Array<Geoset>} */
    this.geosets = [];
    /** @member {Array<GeosetAnimation>} */
    this.geosetAnimations = [];
    /** @member {Array<Bone>} */
    this.bones = [];
    /** @member {Array<Light>} */
    this.lights = [];
    /** @member {Array<Helper>} */
    this.helpers = [];
    /** @member {Array<Attachment>} */
    this.attachments = [];
    /** @member {Array<Float32Array>} */
    this.pivotPoints = [];
    /** @member {Array<ParticleEmitter>} */
    this.particleEmitters = [];
    /** @member {Array<ParticleEmitter2>} */
    this.particleEmitters2 = [];
    /** @member {Array<RibbonEmitter>} */
    this.ribbonEmitters = [];
    /** @member {Array<Camera>} */
    this.cameras = [];
    /** @member {Array<EventObject>} */
    this.eventObjects = [];
    /** @member {Array<CollisionShape>} */
    this.collisionShapes = [];
    /**
     * The MDX format is chunk based, and Warcraft 3 does not mind there being unknown chunks in there.
     * Some 3rd party tools use this to attach metadata to models.
     * When an unknown chunk is encountered, it will be added here.
     * These chunks will be saved when saving as MDX.
     *
     * @member {Array<UnknownChunk}
     */
    this.unknownChunks = [];

    if (buffer) {
      this.load(buffer);
    }
  }

  /**
   * Load the model from MDX or MDL.
   * The format is detected by the buffer type: ArrayBuffer for MDX, and string for MDL.
   *
   * @param {ArrayBuffer|string} buffer
   */
  load(buffer) {
    if (buffer instanceof ArrayBuffer) {
      this.loadMdx(buffer);
    } else {
      this.loadMdl(buffer);
    }
  }

  /**
   * Load the model from MDX.
   *
   * @param {ArrayBuffer} buffer
   */
  loadMdx(buffer) {
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
      } else {
        this.unknownChunks.push(new UnknownChunk(stream, size, tag));
      }
    }
  }

  /**
   * @param {BinaryStream} stream
   */
  loadVersionChunk(stream) {
    this.version = stream.readUint32();
  }

  /**
   * @param {BinaryStream} stream
   */
  loadModelChunk(stream) {
    this.name = stream.read(80);
    this.animationFile = stream.read(260);
    this.extent.readMdx(stream);
    this.blendTime = stream.readUint32();
  }

  /**
   * @param {Array<Sequence|Texture>} out
   * @param {constructor} constructor
   * @param {BinaryStream} stream
   * @param {number} count
   */
  loadStaticObjects(out, constructor, stream, count) {
    for (let i = 0; i < count; i++) {
      let object = new constructor();

      object.readMdx(stream);

      out.push(object);
    }
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} size
   */
  loadGlobalSequenceChunk(stream, size) {
    for (let i = 0, l = size / 4; i < l; i++) {
      this.globalSequences.push(stream.readUint32());
    }
  }

  /**
   * @param {Array<Material|TextureAnimation|Geoset|GeosetAnimation|GenericObject|Camera>} out
   * @param {constructor} constructor
   * @param {BinaryStream} stream
   * @param {number} size
   */
  loadDynamicObjects(out, constructor, stream, size) {
    let totalSize = 0;

    while (totalSize < size) {
      let object = new constructor();

      object.readMdx(stream);

      totalSize += object.getByteLength();

      out.push(object);
    }
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} size
   */
  loadPivotPointChunk(stream, size) {
    for (let i = 0, l = size / 12; i < l; i++) {
      this.pivotPoints.push(stream.readFloat32Array(new Float32Array(3)));
    }
  }

  /**
   * Save the model as MDX.
   *
   * @return {ArrayBuffer}
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

    return buffer;
  }

  /**
   * @param {BinaryStream} stream
   */
  saveVersionChunk(stream) {
    stream.write('VERS');
    stream.writeUint32(4);
    stream.writeUint32(this.version);
  }

  /**
   * @param {BinaryStream} stream
   */
  saveModelChunk(stream) {
    stream.write('MODL');
    stream.writeUint32(372);
    stream.write(this.name);
    stream.skip(80 - this.name.length);
    stream.write(this.animationFile);
    stream.skip(260 - this.animationFile.length);
    this.extent.writeMdx(stream);
    stream.writeUint32(this.blendTime);
  }

  /**
   * @param {BinaryStream} stream
   * @param {string} name
   * @param {Array<Sequence|Texture>} objects
   * @param {number} size
   */
  saveStaticObjectChunk(stream, name, objects, size) {
    if (objects.length) {
      stream.write(name);
      stream.writeUint32(objects.length * size);

      for (let object of objects) {
        object.writeMdx(stream);
      }
    }
  }

  /**
   * @param {BinaryStream} stream
   */
  saveGlobalSequenceChunk(stream) {
    if (this.globalSequences.length) {
      stream.write('GLBS');
      stream.writeUint32(this.globalSequences.length * 4);

      for (let globalSequence of this.globalSequences) {
        stream.writeUint32(globalSequence);
      }
    }
  }

  /**
   * @param {BinaryStream} stream
   * @param {string} name
   * @param {Array<Material|TextureAnimation|Geoset|GeosetAnimation|GenericObject|Camera>} objects
   */
  saveDynamicObjectChunk(stream, name, objects) {
    if (objects.length) {
      stream.write(name);
      stream.writeUint32(this.getObjectsByteLength(objects));

      for (let object of objects) {
        object.writeMdx(stream);
      }
    }
  }

  /**
   * @param {BinaryStream} stream
   */
  savePivotPointChunk(stream) {
    if (this.pivotPoints.length) {
      stream.write('PIVT');
      stream.writeUint32(this.pivotPoints.length * 12);

      for (let pivotPoint of this.pivotPoints) {
        stream.writeFloat32Array(pivotPoint);
      }
    }
  }

  /**
   * Load the model from MDL.
   *
   * @param {string} buffer
   */
  loadMdl(buffer) {
    let token;
    let stream = new TokenStream(buffer);

    while (token = stream.read()) {
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

  /**
   * @param {TokenStream} stream
   */
  loadVersionBlock(stream) {
    for (let token of stream.readBlock()) {
      if (token === 'FormatVersion') {
        this.version = stream.readInt();
      } else {
        throw new Error(`Unknown token in Version: "${token}"`);
      }
    }
  }

  /**
   * @param {TokenStream} stream
   */
  loadModelBlock(stream) {
    this.name = stream.read();

    for (let token of stream.readBlock()) {
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

  /**
   * @param {Array<Sequence|Texture|Material|TextureAnimation>} out
   * @param {constructor} constructor
   * @param {string} name
   * @param {TokenStream} stream
   */
  loadNumberedObjectBlock(out, constructor, name, stream) {
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

  /**
   * @param {TokenStream} stream
   */
  loadGlobalSequenceBlock(stream) {
    stream.read(); // Don't care about the number, the array will grow.

    for (let token of stream.readBlock()) {
      if (token === 'Duration') {
        this.globalSequences.push(stream.readInt());
      } else {
        throw new Error(`Unknown token in GlobalSequences: "${token}"`);
      }
    }
  }

  /**
   * @param {Array<Geoset|GeosetAnimation|GenericObject|Camera>} out
   * @param {constructor} constructor
   * @param {TokenStream} stream
   */
  loadObject(out, constructor, stream) {
    let object = new constructor();

    object.readMdl(stream);

    out.push(object);
  }

  /**
   * @param {TokenStream} stream
   */
  loadPivotPointBlock(stream) {
    let count = stream.readInt();

    stream.read(); // {

    for (let i = 0; i < count; i++) {
      this.pivotPoints.push(stream.readFloatArray(new Float32Array(3)));
    }

    stream.read(); // }
  }

  /**
   * Save the model as MDL.
   *
   * @return {string}
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

  /**
   * @param {TokenStream} stream
   */
  saveVersionBlock(stream) {
    stream.startBlock('Version');
    stream.writeAttrib('FormatVersion', this.version);
    stream.endBlock();
  }

  /**
   * @param {TokenStream} stream
   */
  saveModelBlock(stream) {
    stream.startObjectBlock('Model', this.name);
    stream.writeAttrib('BlendTime', this.blendTime);
    this.extent.writeMdl(stream);
    stream.endBlock();
  }

  /**
   * @param {TokenStream} stream
   * @param {string} name
   * @param {Array<Sequence|Texture|Material|TextureAnimation>} objects
   */
  saveStaticObjectsBlock(stream, name, objects) {
    if (objects.length) {
      stream.startBlock(name, objects.length);

      for (let object of objects) {
        object.writeMdl(stream);
      }

      stream.endBlock();
    }
  }

  /**
   * @param {TokenStream} stream
   */
  saveGlobalSequenceBlock(stream) {
    if (this.globalSequences.length) {
      stream.startBlock('GlobalSequences', this.globalSequences.length);

      for (let globalSequence of this.globalSequences) {
        stream.writeAttrib('Duration', globalSequence);
      }

      stream.endBlock();
    }
  }

  /**
   * @param {TokenStream} stream
   * @param {Array<Geoset|GeosetAnimation|GenericObject|Camera>} objects
   */
  saveObjects(stream, objects) {
    for (let object of objects) {
      object.writeMdl(stream);
    }
  }

  /**
   * @param {TokenStream} stream
   */
  savePivotPointBlock(stream) {
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
   *
   * @return {number}
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
    size += 8 * this.unknownChunks.length + this.getDynamicObjectsChunkByteLength(this.unknownChunks);

    return size;
  }

  /**
   * @param {Array<Material|TextureAnimation|Geoset|GeosetAnimation|GenericObject|Camera|UnknownChunk>} objects
   * @return {number}
   */
  getObjectsByteLength(objects) {
    let size = 0;

    for (let object of objects) {
      size += object.getByteLength();
    }

    return size;
  }

  /**
   * @param {Array<Material|TextureAnimation|Geoset|GeosetAnimation|GenericObject|Camera|UnknownChunk>} objects
   * @return {number}
   */
  getDynamicObjectsChunkByteLength(objects) {
    if (objects.length) {
      return 8 + this.getObjectsByteLength(objects);
    }

    return 0;
  }

  /**
   * @param {Array<Sequence|number|Texture|Float32Array>} objects
   * @param {number} size
   * @return {number}
   */
  getStaticObjectsChunkByteLength(objects, size) {
    if (objects.length) {
      return 8 + objects.length * size;
    }

    return 0;
  }
}
