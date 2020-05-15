import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';
import GenericObject from './genericobject';

/**
 * A popcorn particle emitter.
 * References a pkfx file, which is used by the PopcornFX runtime.
 *
 * @since 900
 */
export default class ParticleEmitterPopcorn extends GenericObject {
  lifeSpan: number = 0;
  emissionRate: number = 0;
  speed: number = 0;
  color: Float32Array = new Float32Array(3);
  alpha: number = 1;
  replaceableId: number = 0;
  path: string = '';
  animationVisiblityGuide: string = '';

  readMdx(stream: BinaryStream) {
    const start = stream.index;
    const size = stream.readUint32();

    super.readMdx(stream);

    this.lifeSpan = stream.readFloat32();
    this.emissionRate = stream.readFloat32();
    this.speed = stream.readFloat32();
    stream.readFloat32Array(this.color);
    this.alpha = stream.readFloat32();
    this.replaceableId = stream.readUint32();
    this.path = stream.read(260);
    this.animationVisiblityGuide = stream.read(260);

    this.readAnimations(stream, size - (stream.index - start));
  }

  writeMdx(stream: BinaryStream) {
    stream.writeUint32(this.getByteLength());

    super.writeMdx(stream);

    stream.writeFloat32(this.lifeSpan);
    stream.writeFloat32(this.emissionRate);
    stream.writeFloat32(this.speed);
    stream.writeFloat32Array(this.color);
    stream.writeFloat32(this.alpha);
    stream.writeUint32(this.replaceableId);
    stream.write(this.path);
    stream.skip(260 - this.path.length);
    stream.write(this.animationVisiblityGuide);
    stream.skip(260 - this.animationVisiblityGuide.length);

    this.writeNonGenericAnimationChunks(stream);
  }

  readMdl(stream: TokenStream) {
    for (let token of super.readGenericBlock(stream)) {
      if (token === 'SortPrimsFarZ') {
        this.flags |= 0x10000;
      } else if (token === 'Unshaded') {
        this.flags |= 0x8000;
      } else if (token === 'Unfogged') {
        this.flags |= 0x40000;
      } else if (token === 'static LifeSpan') {
        this.lifeSpan = stream.readFloat();
      } else if (token === 'LifeSpan') {
        this.readAnimation(stream, 'KPPL');
      } else if (token === 'static EmissionRate') {
        this.emissionRate = stream.readFloat();
      } else if (token === 'EmissionRate') {
        this.readAnimation(stream, 'KPPE');
      } else if (token === 'static Speed') {
        this.speed = stream.readFloat();
      } else if (token === 'Speed') {
        this.readAnimation(stream, 'KPPS');
      } else if (token === 'static Color') {
        stream.readVector(this.color);
      } else if (token === 'Color') {
        this.readAnimation(stream, 'KPPC');
      } else if (token === 'static Alpha') {
        this.alpha = stream.readFloat();
      } else if (token === 'Alpha') {
        this.readAnimation(stream, 'KPPA');
      } else if (token === 'Visibility') {
        this.readAnimation(stream, 'KPPV');
      } else if (token === 'ReplaceableId') {
        this.replaceableId = stream.readInt();
      } else if (token === 'Path') {
        this.path = stream.read();
      } else if (token === 'AnimVisibilityGuide') {
        this.animationVisiblityGuide = stream.read();
      } else {
        throw new Error(`Unknown token in ParticleEmitterPopcorn: "${token}"`);
      }
    }
  }

  writeMdl(stream: TokenStream) {
    stream.startObjectBlock('ParticleEmitterPopcorn', this.name);
    this.writeGenericHeader(stream);

    if (this.flags & 0x10000) {
      stream.writeFlag('SortPrimsFarZ');
    }

    if (this.flags & 0x8000) {
      stream.writeFlag('Unshaded');
    }

    if (this.flags & 0x40000) {
      stream.writeFlag('Unfogged');
    }

    if (!this.writeAnimation(stream, 'KPPL')) {
      stream.writeNumberAttrib('static LifeSpan', this.lifeSpan);
    }

    if (!this.writeAnimation(stream, 'KPPE')) {
      stream.writeNumberAttrib('static EmissionRate', this.emissionRate);
    }

    if (!this.writeAnimation(stream, 'KPPS')) {
      stream.writeNumberAttrib('static Speed', this.speed);
    }

    if (!this.writeAnimation(stream, 'KPPC')) {
      stream.writeVectorAttrib('static Color', this.color);
    }

    if (!this.writeAnimation(stream, 'KPPA')) {
      stream.writeNumberAttrib('static Alpha', this.alpha);
    }

    this.writeAnimation(stream, 'KPPV');

    if (this.replaceableId !== 0) {
      stream.writeNumberAttrib('ReplaceableId', this.replaceableId);
    }

    if (this.path.length) {
      stream.writeStringAttrib('Path', this.path);
    }

    if (this.animationVisiblityGuide.length) {
      stream.writeStringAttrib('AnimVisibilityGuide', this.animationVisiblityGuide);
    }

    this.writeGenericAnimations(stream);
    stream.endBlock();
  }

  getByteLength() {
    return 556 + super.getByteLength();
  }
}

