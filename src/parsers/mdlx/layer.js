import AnimatedObject from './animatedobject';

let filterModeToMdx = {
  None: 0,
  Transparent: 1,
  Blend: 2,
  Additive: 3,
  AddAlpha: 4,
  Modulate: 5,
  Modulate2x: 6,
};

let filterModeToMdl = {
  0: 'None',
  1: 'Transparent',
  2: 'Blend',
  3: 'Additive',
  4: 'AddAlpha',
  5: 'Modulate',
  6: 'Modulate2x',
};

/**
 * A layer.
 */
export default class Layer extends AnimatedObject {
  /**
   *
   */
  constructor() {
    super();

    /** @member {number} */
    this.filterMode = 0;
    /** @member {number} */
    this.flags = 0;
    /** @member {number} */
    this.textureId = -1;
    /** @member {number} */
    this.textureAnimationId = -1;
    /** @member {number} */
    this.coordId = 0;
    /** @member {number} */
    this.alpha = 1;
  }

  /**
   * @param {BinaryStream} stream
   */
  readMdx(stream) {
    let size = stream.readUint32();

    this.filterMode = stream.readUint32();
    this.flags = stream.readUint32();
    this.textureId = stream.readInt32();
    this.textureAnimationId = stream.readInt32();
    this.coordId = stream.readUint32();
    this.alpha = stream.readFloat32();

    this.readAnimations(stream, size - 28);
  }

  /**
   * @param {BinaryStream} stream
   */
  writeMdx(stream) {
    stream.writeUint32(this.getByteLength());
    stream.writeUint32(this.filterMode);
    stream.writeUint32(this.flags);
    stream.writeInt32(this.textureId);
    stream.writeInt32(this.textureAnimationId);
    stream.writeUint32(this.coordId);
    stream.writeFloat32(this.alpha);

    this.writeAnimations(stream);
  }

  /**
   * @param {TokenStream} stream
   */
  readMdl(stream) {
    for (let token of this.readAnimatedBlock(stream)) {
      if (token === 'FilterMode') {
        this.filterMode = filterModeToMdx[stream.read()];
      } else if (token === 'Unshaded') {
        this.flags |= 0x1;
      } else if (token === 'SphereEnvMap') {
        this.flags |= 0x2;
      } else if (token === 'TwoSided') {
        this.flags |= 0x10;
      } else if (token === 'Unfogged') {
        this.flags |= 0x20;
      } else if (token === 'NoDepthTest') {
        this.flags |= 0x40;
      } else if (token === 'NoDepthSet') {
        this.flags |= 0x100;
      } else if (token === 'static TextureID') {
        this.textureId = stream.readInt();
      } else if (token === 'TextureID') {
        this.readAnimation(stream, 'KMTF');
      } else if (token === 'TVertexAnimId') {
        this.textureAnimationId = stream.readInt();
      } else if (token === 'CoordId') {
        this.coordId = stream.readInt();
      } else if (token === 'static Alpha') {
        this.alpha = stream.readFloat();
      } else if (token === 'Alpha') {
        this.readAnimation(stream, 'KMTA');
      } else {
        throw new Error(`Unknown token in Layer: "${token}"`);
      }
    }
  }

  /**
   * @param {TokenStream} stream
   */
  writeMdl(stream) {
    stream.startBlock('Layer');

    stream.writeAttrib('FilterMode', filterModeToMdl[this.filterMode]);

    if (this.flags & 0x1) {
      stream.writeFlag('Unshaded');
    }

    if (this.flags & 0x2) {
      stream.writeFlag('SphereEnvMap');
    }

    if (this.flags & 0x10) {
      stream.writeFlag('TwoSided');
    }

    if (this.flags & 0x20) {
      stream.writeFlag('Unfogged');
    }

    if (this.flags & 0x40) {
      stream.writeFlag('NoDepthTest');
    }

    if (this.flags & 0x100) {
      stream.writeFlag('NoDepthSet');
    }

    if (!this.writeAnimation(stream, 'KMTF')) {
      stream.writeAttrib('static TextureID', this.textureId);
    }

    if (this.textureAnimationId !== -1) {
      stream.writeAttrib('TVertexAnimId', this.textureAnimationId);
    }

    if (this.coordId !== 0) {
      stream.writeAttrib('CoordId', this.coordId);
    }

    if (!this.writeAnimation(stream, 'KMTA') && this.alpha !== 1) {
      stream.writeFloatAttrib('static Alpha', this.alpha);
    }

    stream.endBlock();
  }

  /**
   * @return {number}
   */
  getByteLength() {
    return 28 + super.getByteLength();
  }
}
