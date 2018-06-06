import GenericObject from './genericobject';

/**
 * A particle emitter type 2.
 */
export default class ParticleEmitter2 extends GenericObject {
  /**
   *
   */
  constructor() {
    super();

    /** @member {number} */
    this.speed = 0;
    /** @member {number} */
    this.variation = 0;
    /** @member {number} */
    this.latitude = 0;
    /** @member {number} */
    this.gravity = 0;
    /** @member {number} */
    this.lifeSpan = 0;
    /** @member {number} */
    this.emissionRate = 0;
    /** @member {number} */
    this.length = 0;
    /** @member {number} */
    this.width = 0;
    /** @member {number} */
    this.filterMode = 0;
    /** @member {number} */
    this.rows = 0;
    /** @member {number} */
    this.columns = 0;
    /** @member {number} */
    this.headOrTail = 0;
    /** @member {number} */
    this.tailLength = 0;
    /** @member {number} */
    this.timeMiddle = 0;
    /** @member {Array<Float32Array>} */
    this.segmentColors = [new Float32Array(3), new Float32Array(3), new Float32Array(3)];
    /** @member {Uint8Array} */
    this.segmentAlphas = new Uint8Array(3);
    /** @member {Float32Array} */
    this.segmentScaling = new Float32Array(3);
    /** @member {Array<Uint32Array>} */
    this.headIntervals = [new Uint32Array(3), new Uint32Array(3)];
    /** @member {Array<Uint32Array>} */
    this.tailIntervals = [new Uint32Array(3), new Uint32Array(3)];
    /** @member {number} */
    this.textureId = -1;
    /** @member {number} */
    this.squirt = 0;
    /** @member {number} */
    this.priorityPlane = 0;
    /** @member {number} */
    this.replaceableId = 0;
  }

  /**
   * @param {BinaryStream} stream
   */
  readMdx(stream) {
    const size = stream.readUint32();

    super.readMdx(stream);

    this.speed = stream.readFloat32();
    this.variation = stream.readFloat32();
    this.latitude = stream.readFloat32();
    this.gravity = stream.readFloat32();
    this.lifeSpan = stream.readFloat32();
    this.emissionRate = stream.readFloat32();
    this.length = stream.readFloat32();
    this.width = stream.readFloat32();
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

    this.readAnimations(stream, size - this.getByteLength());
  }

  /**
   * @param {BinaryStream} stream
   */
  writeMdx(stream) {
    stream.writeUint32(this.getByteLength());

    super.writeMdx(stream);

    stream.writeFloat32(this.speed);
    stream.writeFloat32(this.variation);
    stream.writeFloat32(this.latitude);
    stream.writeFloat32(this.gravity);
    stream.writeFloat32(this.lifeSpan);
    stream.writeFloat32(this.emissionRate);
    stream.writeFloat32(this.length);
    stream.writeFloat32(this.width);
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

  /**
   * @param {TokenStream} stream
   */
  readMdl(stream) {
    for (const token of super.readMdl(stream)) {
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
        this.readAnimation(stream, 'KP2W');
      } else if (token === 'static Length') {
        this.length = stream.readFloat();
      } else if (token === 'Length') {
        this.readAnimation(stream, 'KP2N');
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
        stream.readIntArray(this.segmentAlphas);
      } else if (token === 'ParticleScaling') {
        stream.readFloatArray(this.segmentScaling);
      } else if (token === 'LifeSpanUVAnim') {
        stream.readIntArray(this.headIntervals[0]);
      } else if (token === 'DecayUVAnim') {
        stream.readIntArray(this.headIntervals[1]);
      } else if (token === 'TailUVAnim') {
        stream.readIntArray(this.tailIntervals[0]);
      } else if (token === 'TailDecayUVAnim') {
        stream.readIntArray(this.tailIntervals[1]);
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

  /**
   * @param {TokenStream} stream
   */
  writeMdl(stream) {
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
      stream.writeFloatAttrib('static Speed', this.speed);
    }

    if (!this.writeAnimation(stream, 'KP2R')) {
      stream.writeFloatAttrib('static Variation', this.variation);
    }

    if (!this.writeAnimation(stream, 'KP2L')) {
      stream.writeFloatAttrib('static Latitude', this.latitude);
    }

    if (!this.writeAnimation(stream, 'KP2G')) {
      stream.writeFloatAttrib('static Gravity', this.gravity);
    }

    this.writeAnimation(stream, 'KP2V');

    if (this.squirt) {
      stream.writeFlag('Squirt');
    }

    stream.writeFloatAttrib('LifeSpan', this.lifeSpan);

    if (!this.writeAnimation(stream, 'KP2E')) {
      stream.writeFloatAttrib('static EmissionRate', this.emissionRate);
    }

    if (!this.writeAnimation(stream, 'KP2W')) {
      stream.writeFloatAttrib('static Width', this.width);
    }

    if (!this.writeAnimation(stream, 'KP2N')) {
      stream.writeFloatAttrib('static Length', this.length);
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

    stream.writeAttrib('Rows', this.rows);
    stream.writeAttrib('Columns', this.columns);

    if (this.headOrTail === 0) {
      stream.writeFlag('Head');
    } else if (this.headOrTail === 1) {
      stream.writeFlag('Tail');
    } else if (this.headOrTail === 2) {
      stream.writeFlag('Both');
    }

    stream.writeFloatAttrib('TailLength', this.tailLength);
    stream.writeFloatAttrib('Time', this.timeMiddle);

    stream.startBlock('SegmentColor');
    stream.writeColor('Color', this.segmentColors[0]);
    stream.writeColor('Color', this.segmentColors[1]);
    stream.writeColor('Color', this.segmentColors[2]);
    stream.endBlockComma();

    stream.writeArrayAttrib('Alpha', this.segmentAlphas);
    stream.writeFloatArrayAttrib('ParticleScaling', this.segmentScaling);
    stream.writeArrayAttrib('LifeSpanUVAnim', this.headIntervals[0]);
    stream.writeArrayAttrib('DecayUVAnim', this.headIntervals[1]);
    stream.writeArrayAttrib('TailUVAnim', this.tailIntervals[0]);
    stream.writeArrayAttrib('TailDecayUVAnim', this.tailIntervals[1]);
    stream.writeAttrib('TextureID', this.textureId);

    if (this.replaceableId !== 0) {
      stream.writeAttrib('ReplaceableId', this.replaceableId);
    }

    if (this.priorityPlane !== 0) {
      stream.writeAttrib('PriorityPlane', this.priorityPlane);
    }

    this.writeGenericAnimations(stream);
    stream.endBlock();
  }

  /**
   * @return {number}
   */
  getByteLength() {
    return 175 + super.getByteLength();
  }
}
