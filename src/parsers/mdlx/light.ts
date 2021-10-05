import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';
import GenericObject from './genericobject';

export const enum LightType {
  None = -1,
  Omnidirectional = 0,
  Directional = 1,
  Ambient = 2,
}

/**
 * A light.
 */
export default class Light extends GenericObject {
  type = LightType.None;
  attenuation = new Float32Array(2);
  color = new Float32Array(3);
  intensity = 0;
  ambientColor = new Float32Array(3);
  ambientIntensity = 0;

  constructor() {
    super(0x200);
  }

  override readMdx(stream: BinaryStream): void {
    const start = stream.index;
    const size = stream.readUint32();

    super.readMdx(stream);

    this.type = stream.readUint32();
    stream.readFloat32Array(this.attenuation);
    stream.readFloat32Array(this.color);
    this.intensity = stream.readFloat32();
    stream.readFloat32Array(this.ambientColor);
    this.ambientIntensity = stream.readFloat32();

    this.readAnimations(stream, size - (stream.index - start));
  }

  override writeMdx(stream: BinaryStream): void {
    stream.writeUint32(this.getByteLength());

    super.writeMdx(stream);

    stream.writeUint32(this.type);
    stream.writeFloat32Array(this.attenuation);
    stream.writeFloat32Array(this.color);
    stream.writeFloat32(this.intensity);
    stream.writeFloat32Array(this.ambientColor);
    stream.writeFloat32(this.ambientIntensity);

    this.writeNonGenericAnimationChunks(stream);
  }

  readMdl(stream: TokenStream): void {
    for (const token of super.readGenericBlock(stream)) {
      if (token === 'Omnidirectional') {
        this.type = LightType.Omnidirectional;
      } else if (token === 'Directional') {
        this.type = LightType.Directional;
      } else if (token === 'Ambient') {
        this.type = LightType.Ambient;
      } else if (token === 'static AttenuationStart') {
        this.attenuation[0] = stream.readFloat();
      } else if (token === 'AttenuationStart') {
        this.readAnimation(stream, 'KLAS');
      } else if (token === 'static AttenuationEnd') {
        this.attenuation[1] = stream.readFloat();
      } else if (token === 'AttenuationEnd') {
        this.readAnimation(stream, 'KLAE');
      } else if (token === 'static Intensity') {
        this.intensity = stream.readFloat();
      } else if (token === 'Intensity') {
        this.readAnimation(stream, 'KLAI');
      } else if (token === 'static Color') {
        stream.readColor(this.color);
      } else if (token === 'Color') {
        this.readAnimation(stream, 'KLAC');
      } else if (token === 'static AmbIntensity') {
        this.ambientIntensity = stream.readFloat();
      } else if (token === 'AmbIntensity') {
        this.readAnimation(stream, 'KLBI');
      } else if (token === 'static AmbColor') {
        stream.readColor(this.ambientColor);
      } else if (token === 'AmbColor') {
        this.readAnimation(stream, 'KLBC');
      } else if (token === 'Visibility') {
        this.readAnimation(stream, 'KLAV');
      } else {
        throw new Error(`Unknown token in Light: "${token}"`);
      }
    }
  }

  writeMdl(stream: TokenStream): void {
    stream.startObjectBlock('Light', this.name);
    this.writeGenericHeader(stream);

    if (this.type === LightType.Omnidirectional) {
      stream.writeFlag('Omnidirectional');
    } else if (this.type === LightType.Directional) {
      stream.writeFlag('Directional');
    } else if (this.type === LightType.Ambient) {
      stream.writeFlag('Ambient');
    }

    if (!this.writeAnimation(stream, 'KLAS')) {
      stream.writeNumberAttrib('static AttenuationStart', this.attenuation[0]);
    }

    if (!this.writeAnimation(stream, 'KLAE')) {
      stream.writeNumberAttrib('static AttenuationEnd', this.attenuation[1]);
    }

    if (!this.writeAnimation(stream, 'KLAI')) {
      stream.writeNumberAttrib('static Intensity', this.intensity);
    }

    if (!this.writeAnimation(stream, 'KLAC')) {
      stream.writeColor('static Color', this.color);
    }

    if (!this.writeAnimation(stream, 'KLBI')) {
      stream.writeNumberAttrib('static AmbIntensity', this.ambientIntensity);
    }

    if (!this.writeAnimation(stream, 'KLBC')) {
      stream.writeColor('static AmbColor', this.ambientColor);
    }

    this.writeAnimation(stream, 'KLAV');

    this.writeGenericAnimations(stream);
    stream.endBlock();
  }

  override getByteLength(): number {
    return 48 + super.getByteLength();
  }
}

