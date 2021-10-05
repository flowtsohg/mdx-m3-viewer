import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';
import GenericObject from './genericobject';

export const enum Flags {
  Unshaded = 0x8000,
  SortPrimsFarZ = 0x10000,
  LineEmitter = 0x20000,
  Unfogged = 0x40000,
  ModelSpace = 0x80000,
  XYQuad = 0x100000,
}

export const enum FilterMode {
  Blend = 0,
  Additive = 1,
  Modulate = 2,
  Modulate2x = 3,
  AlphaKey = 4,
}

export const enum HeadOrTail {
  Head = 0,
  Tail = 1,
  Both = 2,
}

/**
 * A particle emitter type 2.
 */
export default class ParticleEmitter2 extends GenericObject {
  speed = 0;
  variation = 0;
  latitude = 0;
  gravity = 0;
  lifeSpan = 0;
  emissionRate = 0;
  width = 0;
  length = 0;
  filterMode = FilterMode.Blend;
  rows = 0;
  columns = 0;
  headOrTail = HeadOrTail.Head;
  tailLength = 0;
  timeMiddle = 0;
  segmentColors: Float32Array[] = [new Float32Array(3), new Float32Array(3), new Float32Array(3)];
  segmentAlphas = new Uint8Array(3);
  segmentScaling = new Float32Array(3);
  headIntervals: Uint32Array[] = [new Uint32Array(3), new Uint32Array(3)];
  tailIntervals: Uint32Array[] = [new Uint32Array(3), new Uint32Array(3)];
  textureId = -1;
  squirt = 0;
  priorityPlane = 0;
  replaceableId = 0;

  override readMdx(stream: BinaryStream): void {
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

  override writeMdx(stream: BinaryStream): void {
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

  readMdl(stream: TokenStream): void {
    for (const token of super.readGenericBlock(stream)) {
      if (token === 'SortPrimsFarZ') {
        this.flags |= Flags.SortPrimsFarZ;
      } else if (token === 'Unshaded') {
        this.flags |= Flags.Unshaded;
      } else if (token === 'LineEmitter') {
        this.flags |= Flags.LineEmitter;
      } else if (token === 'Unfogged') {
        this.flags |= Flags.Unfogged;
      } else if (token === 'ModelSpace') {
        this.flags |= Flags.ModelSpace;
      } else if (token === 'XYQuad') {
        this.flags |= Flags.XYQuad;
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
        this.filterMode = FilterMode.Blend;
      } else if (token === 'Additive') {
        this.filterMode = FilterMode.Additive;
      } else if (token === 'Modulate') {
        this.filterMode = FilterMode.Modulate;
      } else if (token === 'Modulate2x') {
        this.filterMode = FilterMode.Modulate2x;
      } else if (token === 'AlphaKey') {
        this.filterMode = FilterMode.AlphaKey;
      } else if (token === 'Rows') {
        this.rows = stream.readInt();
      } else if (token === 'Columns') {
        this.columns = stream.readInt();
      } else if (token === 'Head') {
        this.headOrTail = HeadOrTail.Head;
      } else if (token === 'Tail') {
        this.headOrTail = HeadOrTail.Tail;
      } else if (token === 'Both') {
        this.headOrTail = HeadOrTail.Both;
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

  writeMdl(stream: TokenStream): void {
    stream.startObjectBlock('ParticleEmitter2', this.name);
    this.writeGenericHeader(stream);

    if (this.flags & Flags.SortPrimsFarZ) {
      stream.writeFlag('SortPrimsFarZ');
    }

    if (this.flags & Flags.Unshaded) {
      stream.writeFlag('Unshaded');
    }

    if (this.flags & Flags.LineEmitter) {
      stream.writeFlag('LineEmitter');
    }

    if (this.flags & Flags.Unfogged) {
      stream.writeFlag('Unfogged');
    }

    if (this.flags & Flags.ModelSpace) {
      stream.writeFlag('ModelSpace');
    }

    if (this.flags & Flags.XYQuad) {
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

    if (this.filterMode === FilterMode.Blend) {
      stream.writeFlag('Blend');
    } else if (this.filterMode === FilterMode.Additive) {
      stream.writeFlag('Additive');
    } else if (this.filterMode === FilterMode.Modulate) {
      stream.writeFlag('Modulate');
    } else if (this.filterMode === FilterMode.Modulate2x) {
      stream.writeFlag('Modulate2x');
    } else if (this.filterMode === FilterMode.AlphaKey) {
      stream.writeFlag('AlphaKey');
    }

    stream.writeNumberAttrib('Rows', this.rows);
    stream.writeNumberAttrib('Columns', this.columns);

    if (this.headOrTail === HeadOrTail.Head) {
      stream.writeFlag('Head');
    } else if (this.headOrTail === HeadOrTail.Tail) {
      stream.writeFlag('Tail');
    } else if (this.headOrTail === HeadOrTail.Both) {
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

  override getByteLength(): number {
    return 175 + super.getByteLength();
  }
}
