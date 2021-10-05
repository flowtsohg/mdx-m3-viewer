import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';
import GenericObject from './genericobject';

export const enum Flags {
  EmitterUsesMDL = 0x8000,
  EmitterUsesTGA = 0x10000,
}

/**
 * A particle emitter.
 */
export default class ParticleEmitter extends GenericObject {
  emissionRate = 0;
  gravity = 0;
  longitude = 0;
  latitude = 0;
  path = '';
  lifeSpan = 0;
  speed = 0;

  constructor() {
    super(0x1000);
  }

  override readMdx(stream: BinaryStream): void {
    const start = stream.index;
    const size = stream.readUint32();

    super.readMdx(stream);

    this.emissionRate = stream.readFloat32();
    this.gravity = stream.readFloat32();
    this.longitude = stream.readFloat32();
    this.latitude = stream.readFloat32();
    this.path = stream.read(260);
    this.lifeSpan = stream.readFloat32();
    this.speed = stream.readFloat32();

    this.readAnimations(stream, size - (stream.index - start));
  }

  override writeMdx(stream: BinaryStream): void {
    stream.writeUint32(this.getByteLength());

    super.writeMdx(stream);

    stream.writeFloat32(this.emissionRate);
    stream.writeFloat32(this.gravity);
    stream.writeFloat32(this.longitude);
    stream.writeFloat32(this.latitude);
    stream.skip(260 - stream.write(this.path));
    stream.writeFloat32(this.lifeSpan);
    stream.writeFloat32(this.speed);

    this.writeNonGenericAnimationChunks(stream);
  }

  readMdl(stream: TokenStream): void {
    for (let token of super.readGenericBlock(stream)) {
      if (token === 'EmitterUsesMDL') {
        this.flags |= Flags.EmitterUsesMDL;
      } else if (token === 'EmitterUsesTGA') {
        this.flags |= Flags.EmitterUsesTGA;
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

  writeMdl(stream: TokenStream): void {
    stream.startObjectBlock('ParticleEmitter', this.name);
    this.writeGenericHeader(stream);

    if (this.flags & Flags.EmitterUsesMDL) {
      stream.writeFlag('EmitterUsesMDL');
    }

    if (this.flags & Flags.EmitterUsesTGA) {
      stream.writeFlag('EmitterUsesTGA');
    }

    if (!this.writeAnimation(stream, 'KPEE')) {
      stream.writeNumberAttrib('static EmissionRate', this.emissionRate);
    }

    if (!this.writeAnimation(stream, 'KPEG')) {
      stream.writeNumberAttrib('static Gravity', this.gravity);
    }

    if (!this.writeAnimation(stream, 'KPLN')) {
      stream.writeNumberAttrib('static Longitude', this.longitude);
    }

    if (!this.writeAnimation(stream, 'KPLT')) {
      stream.writeNumberAttrib('static Latitude', this.latitude);
    }

    this.writeAnimation(stream, 'KPEV');

    stream.startBlock('Particle');

    if (!this.writeAnimation(stream, 'KPEL')) {
      stream.writeNumberAttrib('static LifeSpan', this.lifeSpan);
    }

    if (!this.writeAnimation(stream, 'KPES')) {
      stream.writeNumberAttrib('static InitVelocity', this.speed);
    }

    if ((this.flags & Flags.EmitterUsesMDL) || (this.flags & Flags.EmitterUsesTGA)) {
      stream.writeStringAttrib('Path', this.path);
    }

    stream.endBlock();

    this.writeGenericAnimations(stream);
    stream.endBlock();
  }

  override getByteLength(): number {
    return 288 + super.getByteLength();
  }
}
