import GenericObject from './genericobject';

/**
 * A particle emitter.
 */
export default class ParticleEmitter extends GenericObject {
  /**
   *
   */
  constructor() {
    super(0x1000);

    /** @member {number} */
    this.emissionRate = 0;
    /** @member {number} */
    this.gravity = 0;
    /** @member {number} */
    this.longitude = 0;
    /** @member {number} */
    this.latitude = 0;
    /** @member {string} */
    this.path = '';
    /** @member {number} */
    this.lifeSpan = 0;
    /** @member {number} */
    this.speed = 0;
  }

  /**
   * @param {BinaryStream} stream
   */
  readMdx(stream) {
    let size = stream.readUint32();

    super.readMdx(stream);

    this.emissionRate = stream.readFloat32();
    this.gravity = stream.readFloat32();
    this.longitude = stream.readFloat32();
    this.latitude = stream.readFloat32();
    this.path = stream.read(260);
    this.lifeSpan = stream.readFloat32();
    this.speed = stream.readFloat32();

    this.readAnimations(stream, size - this.getByteLength());
  }

  /**
   * @param {BinaryStream} stream
   */
  writeMdx(stream) {
    stream.writeUint32(this.getByteLength());

    super.writeMdx(stream);

    stream.writeFloat32(this.emissionRate);
    stream.writeFloat32(this.gravity);
    stream.writeFloat32(this.longitude);
    stream.writeFloat32(this.latitude);
    stream.write(this.path);
    stream.skip(260 - this.path.length);
    stream.writeFloat32(this.lifeSpan);
    stream.writeFloat32(this.speed);

    this.writeNonGenericAnimationChunks(stream);
  }

  /**
   * @param {TokenStream} stream
   */
  readMdl(stream) {
    for (let token of super.readMdl(stream)) {
      if (token === 'EmitterUsesMDL') {
        this.flags |= 0x8000;
      } else if (token === 'EmitterUsesTGA') {
        this.flags |= 0x10000;
      } else if (token === 'static EmissionRate') {
        this.emissionRate = stream.readFloat();
      } else if (token === 'EmissionRate') {
        this.readAnimation(stream, 'KPEE');
      } else if (token === 'static Gravity') {
        this.gravity = stream.readFloat();
      } else if (token === 'Gravity') {
        this.readAnimation(stream, 'KPEG');
      } else if (token === 'static Longitude') {
        this.longitude = stream.readFloat();
      } else if (token === 'Longitude') {
        this.readAnimation(stream, 'KPLN');
      } else if (token === 'static Latitude') {
        this.latitude = stream.readFloat();
      } else if (token === 'Latitude') {
        this.readAnimation(stream, 'KPLT');
      } else if (token === 'Visibility') {
        this.readAnimation(stream, 'KPEV');
      } else if (token === 'Particle') {
        for (token of this.readAnimatedBlock(stream)) {
          if (token === 'static LifeSpan') {
            this.lifeSpan = stream.readFloat();
          } else if (token === 'LifeSpan') {
            this.readAnimation(stream, 'KPEL');
          } else if (token === 'static InitVelocity') {
            this.speed = stream.readFloat();
          } else if (token === 'InitVelocity') {
            this.readAnimation(stream, 'KPES');
          } else if (token === 'Path') {
            this.path = stream.read();
          }
        }
      } else {
        throw new Error(`Unknown token in ParticleEmitter: "${token}"`);
      }
    }
  }

  /**
   * @param {TokenStream} stream
   */
  writeMdl(stream) {
    stream.startObjectBlock('ParticleEmitter', this.name);
    this.writeGenericHeader(stream);

    if (this.flags & 0x8000) {
      stream.writeFlag('EmitterUsesMDL');
    }

    if (this.flags & 0x10000) {
      stream.writeFlag('EmitterUsesTGA');
    }

    if (!this.writeAnimation(stream, 'KPEE')) {
      stream.writeFloatAttrib('static EmissionRate', this.emissionRate);
    }

    if (!this.writeAnimation(stream, 'KPEG')) {
      stream.writeFloatAttrib('static Gravity', this.gravity);
    }

    if (!this.writeAnimation(stream, 'KPLN')) {
      stream.writeFloatAttrib('static Longitude', this.longitude);
    }

    if (!this.writeAnimation(stream, 'KPLT')) {
      stream.writeFloatAttrib('static Latitude', this.latitude);
    }

    this.writeAnimation(stream, 'KPEV');

    stream.startBlock('Particle');

    if (!this.writeAnimation(stream, 'KPEL')) {
      stream.writeFloatAttrib('static LifeSpan', this.lifeSpan);
    }

    if (!this.writeAnimation(stream, 'KPES')) {
      stream.writeFloatAttrib('static InitVelocity', this.speed);
    }

    if ((this.flags & 0x8000) || (this.flags & 0x10000)) {
      stream.writeAttrib('Path', this.path);
    }

    stream.endBlock();

    this.writeGenericAnimations(stream);
    stream.endBlock();
  }

  /**
   * @return {number}
   */
  getByteLength() {
    return 288 + super.getByteLength();
  }
}
