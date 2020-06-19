import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';
import GenericObject from './genericobject';

/**
 * A particle emitter type 2.
 */
export default class ParticleEmitter2 extends GenericObject {
  speed: number = 0;
  variation: number = 0;
  latitude: number = 0;
  gravity: number = 0;
  lifeSpan: number = 0;
  emissionRate: number = 0;
  width: number = 0;
  length: number = 0;
  filterMode: number = 0;
  rows: number = 0;
  columns: number = 0;
  headOrTail: number = 0;
  tailLength: number = 0;
  timeMiddle: number = 0;
  segmentColors: Float32Array[] = [new Float32Array(3), new Float32Array(3), new Float32Array(3)];
  segmentAlphas: Uint8Array = new Uint8Array(3);
  segmentScaling: Float32Array = new Float32Array(3);
  headIntervals: Uint32Array[] = [new Uint32Array(3), new Uint32Array(3)];
  tailIntervals: Uint32Array[] = [new Uint32Array(3), new Uint32Array(3)];
  textureId: number = -1;
  squirt: number = 0;
  priorityPlane: number = 0;
  replaceableId: number = 0;

  readMdx(stream: BinaryStream) {
    const start = stream.index;
    const size = stream.readUint32();

    super.readMdx(stream);

    this.speed = stream.readFloat32();
    this.variation = stream.readFloat32();
    this.latitude = stream.readFloat32();
    this.gravity = stream.readFloat32();
    this.lifeSpan = stream.readFloat32();
    this.emissionRate = stream.readFloat32();
    this.width = stream.readFloat32();
    this.length = stream.readFloat32();
    this.filterMode = stream.readUint32();
    this.rows = stream.readUint32();
    this.columns = stream.readUint32();
    this.headOrTail = stream.readUint32();
    this.tailLength = stream.readFloat32();
    this.timeMiddle = stream.readFloat32();
    stream.readFloat32Array(this.segmentColors[0]);
    stream.readFloat32Array(this.segmentColors[1]);
    stream.readFloat32Array(this.segmentColors[2]);
    stream.readUint8Array(this.segmentAlphas);
    stream.readFloat32Array(this.segmentScaling);
    stream.readUint32Array(this.headIntervals[0]);
    stream.readUint32Array(this.headIntervals[1]);
    stream.readUint32Array(this.tailIntervals[0]);
    stream.readUint32Array(this.tailIntervals[1]);
    this.textureId = stream.readInt32();
    this.squirt = stream.readUint32();
    this.priorityPlane = stream.readInt32();
    this.replaceableId = stream.readUint32();

    this.readAnimations(stream, size - (stream.index - start));
  }

  writeMdx(stream: BinaryStream) {
    stream.writeUint32(this.getByteLength());

    super.writeMdx(stream);

    stream.writeFloat32(this.speed);
    stream.writeFloat32(this.variation);
    stream.writeFloat32(this.latitude);
    stream.writeFloat32(this.gravity);
    stream.writeFloat32(this.lifeSpan);
    stream.writeFloat32(this.emissionRate);
    stream.writeFloat32(this.width);
    stream.writeFloat32(this.length);
    stream.writeUint32(this.filterMode);
    stream.writeUint32(this.rows);
    stream.writeUint32(this.columns);
    stream.writeUint32(this.headOrTail);
    stream.writeFloat32(this.tailLength);
    stream.writeFloat32(this.timeMiddle);
    stream.writeFloat32Array(this.segmentColors[0]);
    stream.writeFloat32Array(this.segmentColors[1]);
    stream.writeFloat32Array(this.segmentColors[2]);
    stream.writeUint8Array(this.segmentAlphas);
    stream.writeFloat32Array(this.segmentScaling);
    stream.writeUint32Array(this.headIntervals[0]);
    stream.writeUint32Array(this.headIntervals[1]);
    stream.writeUint32Array(this.tailIntervals[0]);
    stream.writeUint32Array(this.tailIntervals[1]);
    stream.writeInt32(this.textureId);
    stream.writeUint32(this.squirt);
    stream.writeInt32(this.priorityPlane);
    stream.writeUint32(this.replaceableId);

    this.writeNonGenericAnimationChunks(stream);
  }

  readMdl(stream: TokenStream) {
    for (const token of super.readGenericBlock(stream)) {
      if (token === 'SortPrimsFarZ') {
        this.flags |= 0x10000;
      } else if (token === 'Unshaded') {
        this.flags |= 0x8000;
      } else if (token === 'LineEmitter') {
        this.flags |= 0x20000;
      } else if (token === 'Unfogged') {
        this.flags |= 0x40000;
      } else if (token === 'ModelSpace') {
        this.flags |= 0x80000;
      } else if (token === 'XYQuad') {
        this.flags |= 0x100000;
      } else if (token === 'static Speed') {
        this.speed = stream.readFloat();
      } else if (token === 'Speed') {
        this.readAnimation(stream, 'KP2S');
      } else if (token === 'static Variation') {
        this.variation = stream.readFloat();
      } else if (token === 'Variation') {
        this.readAnimation(stream, 'KP2R');
      } else if (token === 'static Latitude') {
        this.latitude = stream.readFloat();
      } else if (token === 'Latitude') {
        this.readAnimation(stream, 'KP2L');
      } else if (token === 'static Gravity') {
        this.gravity = stream.readFloat();
      } else if (token === 'Gravity') {
        this.readAnimation(stream, 'KP2G');
      } else if (token === 'Visibility') {
        this.readAnimation(stream, 'KP2V');
      } else if (token === 'Squirt') {
        this.squirt = 1;
      } else if (token === 'LifeSpan') {
        this.lifeSpan = stream.readFloat();
      } else if (token === 'static EmissionRate') {
        this.emissionRate = stream.readFloat();
      } else if (token === 'EmissionRate') {
        this.readAnimation(stream, 'KP2E');
      } else if (token === 'static Width') {
        this.width = stream.readFloat();
      } else if (token === 'Width') {
        this.readAnimation(stream, 'KP2N');
      } else if (token === 'static Length') {
        this.length = stream.readFloat();
      } else if (token === 'Length') {
        this.readAnimation(stream, 'KP2W');
      } else if (token === 'Blend') {
        this.filterMode = 0;
      } else if (token === 'Additive') {
        this.filterMode = 1;
      } else if (token === 'Modulate') {
        this.filterMode = 2;
      } else if (token === 'Modulate2x') {
        this.filterMode = 3;
      } else if (token === 'AlphaKey') {
        this.filterMode = 4;
      } else if (token === 'Rows') {
        this.rows = stream.readInt();
      } else if (token === 'Columns') {
        this.columns = stream.readInt();
      } else if (token === 'Head') {
        this.headOrTail = 0;
      } else if (token === 'Tail') {
        this.headOrTail = 1;
      } else if (token === 'Both') {
        this.headOrTail = 2;
      } else if (token === 'TailLength') {
        this.tailLength = stream.readFloat();
      } else if (token === 'Time') {
        this.timeMiddle = stream.readFloat();
      } else if (token === 'SegmentColor') {
        stream.read(); // {

        for (let i = 0; i < 3; i++) {
          stream.read(); // Color
          stream.readColor(this.segmentColors[i]);
        }

        stream.read(); // }
      } else if (token === 'Alpha') {
        stream.readVector(this.segmentAlphas);
      } else if (token === 'ParticleScaling') {
        stream.readVector(this.segmentScaling);
      } else if (token === 'LifeSpanUVAnim') {
        stream.readVector(this.headIntervals[0]);
      } else if (token === 'DecayUVAnim') {
        stream.readVector(this.headIntervals[1]);
      } else if (token === 'TailUVAnim') {
        stream.readVector(this.tailIntervals[0]);
      } else if (token === 'TailDecayUVAnim') {
        stream.readVector(this.tailIntervals[1]);
      } else if (token === 'TextureID') {
        this.textureId = stream.readInt();
      } else if (token === 'ReplaceableId') {
        this.replaceableId = stream.readInt();
      } else if (token === 'PriorityPlane') {
        this.priorityPlane = stream.readInt();
      } else {
        throw new Error(`Unknown token in ParticleEmitter2: "${token}"`);
      }
    }
  }

  writeMdl(stream: TokenStream) {
    stream.startObjectBlock('ParticleEmitter2', this.name);
    this.writeGenericHeader(stream);

    if (this.flags & 0x10000) {
      stream.writeFlag('SortPrimsFarZ');
    }

    if (this.flags & 0x8000) {
      stream.writeFlag('Unshaded');
    }

    if (this.flags & 0x20000) {
      stream.writeFlag('LineEmitter');
    }

    if (this.flags & 0x40000) {
      stream.writeFlag('Unfogged');
    }

    if (this.flags & 0x80000) {
      stream.writeFlag('ModelSpace');
    }

    if (this.flags & 0x100000) {
      stream.writeFlag('XYQuad');
    }

    if (!this.writeAnimation(stream, 'KP2S')) {
      stream.writeNumberAttrib('static Speed', this.speed);
    }

    if (!this.writeAnimation(stream, 'KP2R')) {
      stream.writeNumberAttrib('static Variation', this.variation);
    }

    if (!this.writeAnimation(stream, 'KP2L')) {
      stream.writeNumberAttrib('static Latitude', this.latitude);
    }

    if (!this.writeAnimation(stream, 'KP2G')) {
      stream.writeNumberAttrib('static Gravity', this.gravity);
    }

    this.writeAnimation(stream, 'KP2V');

    if (this.squirt) {
      stream.writeFlag('Squirt');
    }

    stream.writeNumberAttrib('LifeSpan', this.lifeSpan);

    if (!this.writeAnimation(stream, 'KP2E')) {
      stream.writeNumberAttrib('static EmissionRate', this.emissionRate);
    }

    if (!this.writeAnimation(stream, 'KP2N')) {
      stream.writeNumberAttrib('static Width', this.width);
    }

    if (!this.writeAnimation(stream, 'KP2W')) {
      stream.writeNumberAttrib('static Length', this.length);
    }

    if (this.filterMode === 0) {
      stream.writeFlag('Blend');
    } else if (this.filterMode === 1) {
      stream.writeFlag('Additive');
    } else if (this.filterMode === 2) {
      stream.writeFlag('Modulate');
    } else if (this.filterMode === 3) {
      stream.writeFlag('Modulate2x'); // Does this exist in any model?
    } else if (this.filterMode === 4) {
      stream.writeFlag('AlphaKey');
    }

    stream.writeNumberAttrib('Rows', this.rows);
    stream.writeNumberAttrib('Columns', this.columns);

    if (this.headOrTail === 0) {
      stream.writeFlag('Head');
    } else if (this.headOrTail === 1) {
      stream.writeFlag('Tail');
    } else if (this.headOrTail === 2) {
      stream.writeFlag('Both');
    }

    stream.writeNumberAttrib('TailLength', this.tailLength);
    stream.writeNumberAttrib('Time', this.timeMiddle);

    stream.startBlock('SegmentColor');
    stream.writeColor('Color', this.segmentColors[0]);
    stream.writeColor('Color', this.segmentColors[1]);
    stream.writeColor('Color', this.segmentColors[2]);
    stream.endBlockComma();

    stream.writeVectorAttrib('Alpha', this.segmentAlphas);
    stream.writeVectorAttrib('ParticleScaling', this.segmentScaling);
    stream.writeVectorAttrib('LifeSpanUVAnim', this.headIntervals[0]);
    stream.writeVectorAttrib('DecayUVAnim', this.headIntervals[1]);
    stream.writeVectorAttrib('TailUVAnim', this.tailIntervals[0]);
    stream.writeVectorAttrib('TailDecayUVAnim', this.tailIntervals[1]);
    stream.writeNumberAttrib('TextureID', this.textureId);

    if (this.replaceableId !== 0) {
      stream.writeNumberAttrib('ReplaceableId', this.replaceableId);
    }

    if (this.priorityPlane !== 0) {
      stream.writeNumberAttrib('PriorityPlane', this.priorityPlane);
    }

    this.writeGenericAnimations(stream);
    stream.endBlock();
  }

  getByteLength() {
    return 175 + super.getByteLength();
  }
}
