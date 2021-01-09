import Parser from '../../../parsers/m3/model';
import M3ParserModel from '../../../parsers/m3/modelheader';
import M3ParserDivision from '../../../parsers/m3/division';
import StandardMaterial from '../../../parsers/m3/standardmaterial';
import Sequence from '../../../parsers/m3/sequence';
import Region from '../../../parsers/m3/region';
import Bone from '../../../parsers/m3/bone';
import Stc from '../../../parsers/m3/stc';
import Sts from '../../../parsers/m3/sts';
import Stg from '../../../parsers/m3/stg';
import AttachmentPoint from '../../../parsers/m3/attachmentpoint';
import Camera from '../../../parsers/m3/camera';
import Model from '../../model';
import { M3StandardMaterial } from './standardmaterial';
import M3Bone from './bone';
import M3Sequence from './sequence';
import M3Sts from './sts';
import M3Stc from './stc';
import M3Stg from './stg';
import M3AttachmentPoint from './attachment';
import M3Camera from './camera';
import M3Region from './region';
import M3ModelInstance from './modelinstance';
import M3Batch from './batch';
import { HandlerResourceData } from '../../handlerresource';

/**
 * An M3 model.
 */
export default class M3Model extends Model {
  name: string = '';
  batches: M3Batch[] = [];
  materials: any[][] = [[], []]; // 2D array for the possibility of adding more material types in the future
  materialMaps: any[] = [];
  bones: M3Bone[] = [];
  boneLookup: Uint16Array | null = null;
  sequences: M3Sequence[] = [];
  sts: M3Sts[] = [];
  stc: M3Stc[] = [];
  stg: M3Stg[] = [];
  attachments: M3AttachmentPoint[] = [];
  cameras: M3Camera[] = [];
  regions: M3Region[] = [];
  initialReference: Float32Array[] = [];
  elementBuffer: WebGLBuffer | null = null;
  arrayBuffer: WebGLBuffer | null = null;
  vertexSize: number = 0;
  uvSetCount: number = 0;

  constructor(bufferOrParser: ArrayBuffer | Parser, resourceData: HandlerResourceData) {
    super(resourceData);

    let parser;

    if (bufferOrParser instanceof Parser) {
      parser = bufferOrParser;
    } else {
      parser = new Parser();

      parser.load(bufferOrParser);
    }

    let model = <M3ParserModel>parser.model;
    let div = model.divisions.first();

    this.name = <string>model.modelName.get();

    this.setupGeometry(model, div);

    let materialMaps = <any[]>model.materialReferences.get();

    this.materialMaps = materialMaps;

    // Create concrete material objects for standard materials

    let standardMaterials = <StandardMaterial[]>model.materials[0].get();

    for (let i = 0, l = standardMaterials.length; i < l; i++) {
      this.materials[1].push(new M3StandardMaterial(this, i, standardMaterials[i]));
    }

    // Create concrete batch objects
    for (let batch of div.batches.getAll()) {
      let regionId = batch.regionIndex;
      let materialMap = materialMaps[batch.materialReferenceIndex];

      if (materialMap.materialType === 1) {
        this.batches.push(new M3Batch(this.regions[regionId], this.materials[1][materialMap.materialIndex]))
      }
    }

    /*
    var batchGroups = [[], [], [], [], [], []];

    for (i = 0, l = batches.length; i < l; i++) {
    var blendMode = batches[i].material.blendMode;

    batchGroups[blendMode].push(batches[i]);
    }

    function sortByPriority(a, b) {
    var a = a.material.priority;
    var b = b.material.priority;

    if (a < b) {
    return 1;
    } else if (a == b) {
    return 0;
    } else {
    return -1;
    }
    }

    for (i = 0; i < 6; i++) {
    batchGroups[i].sort(sortByPriority);
    }
    */
    /*
    // In the EggPortrait model the batches seem to be sorted by blend mode. Is this true for every model?
    this.batches.sort(function (a, b) {
    var ba = a.material.blendMode;
    var bb = b.material.blendMode;

    if (ba < bb) {
    return -1;
    } else if (ba == bb) {
    return 0;
    } else {
    return 1;
    }
    });
    */

    // this.batches = batchGroups[0].concat(batchGroups[1]).concat(batchGroups[2]).concat(batchGroups[3]).concat(batchGroups[4]).concat(batchGroups[5]);

    this.initialReference = <Float32Array[]>model.absoluteInverseBoneRestPositions.get();

    for (let bone of <Bone[]>model.bones.get()) {
      this.bones.push(new M3Bone(bone));
    }

    this.boneLookup = <Uint16Array>model.boneLookup.get();

    for (let sequence of <Sequence[]>model.sequences.get()) {
      this.sequences.push(new M3Sequence(sequence));
    }

    for (let sts of <Sts[]>model.sts.get()) {
      this.sts.push(new M3Sts(sts));
    }

    for (let stc of <Stc[]>model.stc.get()) {
      this.stc.push(new M3Stc(stc));
    }

    for (let stg of <Stg[]>model.stg.get()) {
      this.stg.push(new M3Stg(stg, this.sts, this.stc));
    }

    this.addGlobalAnims();

    /*
    if (parser.fuzzyHitTestObjects.length > 0) {
        for (i = 0, l = parser.fuzzyHitTestObjects.length; i < l; i++) {
            this.boundingShapes[i] = new M3BoundingShape(parser.fuzzyHitTestObjects[i], parser.bones, gl);
        }
    }
    */
    /*
    if (parser.particleEmitters.length > 0) {
    this.particleEmitters = [];

    for (i = 0, l = parser.particleEmitters.length; i < l; i++) {
    this.particleEmitters[i] = new M3ParticleEmitter(parser.particleEmitters[i], this);
    }
    }
    */

    for (let attachment of <AttachmentPoint[]>model.attachmentPoints.get()) {
      this.attachments.push(new M3AttachmentPoint(attachment));
    }

    for (let camera of <Camera[]>model.cameras.get()) {
      this.cameras.push(new M3Camera(camera));
    }
  }

  addInstance(): M3ModelInstance {
    return new M3ModelInstance(this);
  }

  setupGeometry(parser: M3ParserModel, div: M3ParserDivision) {
    let gl = this.viewer.gl;
    let uvSetCount = 1;
    let vertexFlags = parser.vertexFlags;

    if (vertexFlags & 0x40000) {
      uvSetCount = 2;
    } else if (vertexFlags & 0x80000) {
      uvSetCount = 3;
    } else if (vertexFlags & 0x100000) {
      uvSetCount = 4;
    }

    let regions = <Region[]>div.regions.get();
    let totalElements = 0;
    let offsets = [];

    for (let i = 0, l = regions.length; i < l; i++) {
      offsets[i] = totalElements;
      totalElements += regions[i].triangleIndicesCount;
    }

    let elementArray = new Uint16Array(totalElements);

    let triangles = <Uint16Array>div.triangles.get();

    for (let i = 0, l = regions.length; i < l; i++) {
      this.regions.push(new M3Region(this, regions[i], triangles, elementArray, offsets[i]));
    }

    let vertices = <Uint8Array>parser.vertices.get();

    this.elementBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elementArray, gl.STATIC_DRAW);

    let arrayBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    this.arrayBuffer = arrayBuffer;
    this.vertexSize = (7 + uvSetCount) * 4;
    this.uvSetCount = uvSetCount;
  }

  mapMaterial(index: number) {
    let materialMap = this.materialMaps[index];

    return this.materials[materialMap.materialType][materialMap.materialIndex];
  }

  addGlobalAnims() {
    /*
    var i, l;
    var glbirth, glstand, gldeath;
    var stgs = this.stg;
    var stg, name;

    for (i = 0, l = stgs.length; i < l; i++) {
    stg = stgs[i];
    name = stg.name.toLowerCase(); // Because obviously there will be a wrong case in some model...

    if (name === 'glbirth') {
    glbirth = stg;
    } else if (name === 'glstand') {
    glstand = stg;
    } else if (name === 'gldeath') {
    gldeath = stg;
    }
    }

    for (i = 0, l = stgs.length; i < l; i++) {
    stg = stgs[i];
    name = stg.name.toLowerCase(); // Because obviously there will be a wrong case in some model...

    if (name !== 'glbirth' && name !== 'glstand' && name !== 'gldeath') {
    if (name.indexOf('birth') !== -1 && glbirth) {
    stg.stcIndices = stg.stcIndices.concat(glbirth.stcIndices);
    } else  if (name.indexOf('death') !== -1 && gldeath) {
    stg.stcIndices = stg.stcIndices.concat(gldeath.stcIndices);
    } else if (glstand) {
    stg.stcIndices = stg.stcIndices.concat(glstand.stcIndices);
    }
    }
    }
    */
  }

  // getValue(animRef: M3ParserAnimationReference, sequence: number, frame: number) {
  //   if (sequence !== -1) {
  //     return this.stg[sequence].getValue(animRef, frame);
  //   } else {
  //     return animRef.initValue;
  //   }
  // }
}
