import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';
import AnimatedObject from './animatedobject';

export const enum FilterMode {
  None = 0,
  Transparent = 1,
  Blend = 2,
  Additive = 3,
  AddAlpha = 4,
  Modulate = 5,
  Modulate2x = 6,
}

export const enum Flags {
  None = 0x0,
  Unshaded = 0x1,
  SphereEnvMap = 0x2,
  TwoSided = 0x10,
  Unfogged = 0x20,
  NoDepthTest = 0x40,
  NoDepthSet = 0x80,
  Unlit = 0x100,
}

// These two functions are needed because I am using const enums, which lets TS completely remove them from the output.
// I think it's worth it for the price of these two functions that effectively were always here either way.
function stringToMode(s: string): FilterMode {
  if (s === 'None') return FilterMode.None;
  if (s === 'Transparent') return FilterMode.Transparent;
  if (s === 'Blend') return FilterMode.Blend;
  if (s === 'Additive') return FilterMode.Additive;
  if (s === 'AddAlpha') return FilterMode.AddAlpha;
  if (s === 'Modulate') return FilterMode.Modulate;
  if (s === 'Modulate2x') return FilterMode.Modulate2x;
  return FilterMode.None;
}

function modeToString(m: FilterMode): string {
  if (m === FilterMode.None) return 'None';
  if (m === FilterMode.Transparent) return 'Transparent';
  if (m === FilterMode.Blend) return 'Blend';
  if (m === FilterMode.Additive) return 'Additive';
  if (m === FilterMode.AddAlpha) return 'AddAlpha';
  if (m === FilterMode.Modulate) return 'Modulate';
  if (m === FilterMode.Modulate2x) return 'Modulate2x';
  return 'None';
}

/**
 * A layer.
 */
export default class Layer extends AnimatedObject {
  filterMode = FilterMode.None;
  flags = Flags.None;
  textureId = -1;
  textureAnimationId = -1;
  coordId = 0;
  alpha = 1;
  /** 
   * @since 900
   */
  emissiveGain = 1;
  /** 
   * @since 1000
   */
  fresnelColor = new Float32Array([1, 1, 1]);
  /** 
   * @since 1000
   */
  fresnelOpacity = 0;
  /** 
   * @since 1000
   */
  fresnelTeamColor = 0;

  readMdx(stream: BinaryStream, version: number): void {
    const start = stream.index;
    const size = stream.readUint32();

    this.filterMode = stream.readUint32();
    this.flags = stream.readUint32();
    this.textureId = stream.readInt32();
    this.textureAnimationId = stream.readInt32();
    this.coordId = stream.readUint32();
    this.alpha = stream.readFloat32();

    // Note that even though these fields were introduced in versions 900 and 1000 separately, the game does not offer backwards compatibility.
    if (version > 800) {
      this.emissiveGain = stream.readFloat32();
      stream.readFloat32Array(this.fresnelColor);
      this.fresnelOpacity = stream.readFloat32();
      this.fresnelTeamColor = stream.readFloat32();
    }

    this.readAnimations(stream, size - (stream.index - start));
  }

  writeMdx(stream: BinaryStream, version: number): void {
    stream.writeUint32(this.getByteLength(version));
    stream.writeUint32(this.filterMode);
    stream.writeUint32(this.flags);
    stream.writeInt32(this.textureId);
    stream.writeInt32(this.textureAnimationId);
    stream.writeUint32(this.coordId);
    stream.writeFloat32(this.alpha);

    // See note above in readMdx.
    if (version > 800) {
      stream.writeFloat32(this.emissiveGain);
      stream.writeFloat32Array(this.fresnelColor);
      stream.writeFloat32(this.fresnelOpacity);
      stream.writeFloat32(this.fresnelTeamColor);
    }

    this.writeAnimations(stream);
  }

  readMdl(stream: TokenStream): void {
    for (const token of super.readAnimatedBlock(stream)) {
      if (token === 'FilterMode') {
        this.filterMode = stringToMode(stream.read());
      } else if (token === 'Unshaded') {
        this.flags |= Flags.Unshaded;
      } else if (token === 'SphereEnvMap') {
        this.flags |= Flags.SphereEnvMap;
      } else if (token === 'TwoSided') {
        this.flags |= Flags.TwoSided;
      } else if (token === 'Unfogged') {
        this.flags |= Flags.Unfogged;
      } else if (token === 'NoDepthTest') {
        this.flags |= Flags.NoDepthTest;
      } else if (token === 'NoDepthSet') {
        this.flags |= Flags.NoDepthSet;
      } else if (token === 'Unlit') {
        this.flags |= Flags.Unlit;
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
      } else if (token === 'static EmissiveGain') {
        this.emissiveGain = stream.readFloat();
      } else if (token === 'EmissiveGain') {
        this.readAnimation(stream, 'KMTE');
      } else if (token === 'static FresnelColor') {
        stream.readVector(this.fresnelColor);
      } else if (token === 'FresnelColor') {
        this.readAnimation(stream, 'KFC3');
      } else if (token === 'static FresnelOpacity') {
        this.fresnelOpacity = stream.readFloat();
      } else if (token === 'FresnelOpacity') {
        this.readAnimation(stream, 'KFCA');
      } else if (token === 'static FresnelTeamColor') {
        this.fresnelTeamColor = stream.readFloat();
      } else if (token === 'FresnelTeamColor') {
        this.readAnimation(stream, 'KFTC');
      } else {
        throw new Error(`Unknown token in Layer: "${token}"`);
      }
    }
  }

  writeMdl(stream: TokenStream, version: number): void {
    stream.startBlock('Layer');

    stream.writeFlagAttrib('FilterMode', modeToString(this.filterMode));

    if (this.flags & Flags.Unshaded) {
      stream.writeFlag('Unshaded');
    }

    if (this.flags & Flags.SphereEnvMap) {
      stream.writeFlag('SphereEnvMap');
    }

    if (this.flags & Flags.TwoSided) {
      stream.writeFlag('TwoSided');
    }

    if (this.flags & Flags.Unfogged) {
      stream.writeFlag('Unfogged');
    }

    if (this.flags & Flags.NoDepthTest) {
      stream.writeFlag('NoDepthTest');
    }

    if (this.flags & Flags.NoDepthSet) {
      stream.writeFlag('NoDepthSet');
    }

    if (version > 800) {
      if (this.flags & Flags.Unlit) {
        stream.writeFlag('Unlit');
      }
    }

    if (!this.writeAnimation(stream, 'KMTF')) {
      stream.writeNumberAttrib('static TextureID', this.textureId);
    }

    if (this.textureAnimationId !== -1) {
      stream.writeNumberAttrib('TVertexAnimId', this.textureAnimationId);
    }

    if (this.coordId !== 0) {
      stream.writeNumberAttrib('CoordId', this.coordId);
    }

    if (!this.writeAnimation(stream, 'KMTA') && this.alpha !== 1) {
      stream.writeNumberAttrib('static Alpha', this.alpha);
    }

    if (version > 800) {
      if (!this.writeAnimation(stream, 'KMTE') && this.emissiveGain !== 1) {
        stream.writeNumberAttrib('static EmissiveGain', this.emissiveGain);
      }

      if (!this.writeAnimation(stream, 'KFC3') && (this.fresnelColor[0] !== 1 || this.fresnelColor[1] !== 1 || this.fresnelColor[2] !== 1)) {
        stream.writeVectorAttrib('static FresnelColor', this.fresnelColor);
      }

      if (!this.writeAnimation(stream, 'KFCA') && this.fresnelOpacity !== 0) {
        stream.writeNumberAttrib('static FresnelOpacity', this.fresnelOpacity);
      }

      if (!this.writeAnimation(stream, 'KFTC') && this.fresnelTeamColor !== 0) {
        stream.writeNumberAttrib('static FresnelTeamColor', this.fresnelTeamColor);
      }
    }

    stream.endBlock();
  }

  override getByteLength(version: number): number {
    let size = 28 + super.getByteLength();

    // See note above in readMdx.
    if (version > 800) {
      size += 24;
    }

    return size;
  }
}
