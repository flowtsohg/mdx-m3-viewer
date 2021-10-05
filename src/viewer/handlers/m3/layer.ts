import Reference from '../../../parsers/m3/reference';
import Layer from '../../../parsers/m3/layer';
import Texture from '../../texture';
import Shader from '../../gl/shader';
import { M3StandardMaterial, STANDARD_MATERIAL_OFFSET } from './standardmaterial';
import M3Model from './model';
import M3Texture from './texture';

const layerTypeToTextureUnit = {
  diffuse: 1,
  decal: 2,
  specular: 3,
  gloss: 4,
  emissive: 5,
  emissive2: 6,
  evio: 7,
  evioMask: 8,
  alphaMask: 9,
  alphaMask2: 10,
  normal: 11,
  heightMap: 12,
  lightMap: 13,
  ao: 14,
};

/**
 * An M3 layer.
 */
export default class M3Layer {
  model: M3Model;
  material: M3StandardMaterial;
  index: number;
  active = 0;
  layer: Layer | null = null;
  gl: WebGLRenderingContext;
  uniformMap: { map: string; enabled: string; op: string; channels: string; teamColorMode: string; invert: string; clampResult: string; uvCoordinate: string; };
  source = '';
  texture: M3Texture | null = null;
  flags = 0;
  colorChannels = 0;
  type = '';
  op = 0;
  uvCoordinate = 0;
  textureUnit = 0;
  invert = 0;
  clampResult = 0;
  teamColorMode = 0;

  constructor(material: M3StandardMaterial, index: number, layerReference: Reference, type: string, op: number) {
    const model = material.model;

    this.model = model;
    this.material = material;
    this.gl = material.gl;
    this.index = index;

    const uniform = 'u_' + type;
    const settings = uniform + 'LayerSettings.';

    this.uniformMap = {
      map: uniform + 'Map',
      enabled: settings + 'enabled',
      op: settings + 'op',
      channels: settings + 'channels',
      teamColorMode: settings + 'teamColorMode',
      invert: settings + 'invert',
      clampResult: settings + 'clampResult',
      uvCoordinate: settings + 'uvCoordinate',
    };

    // Since Gloss doesn't exist in all versions
    if (layerReference.entries) {
      const layer = <Layer>layerReference.first();

      this.layer = layer;

      const pathSolver = model.pathSolver;

      const path = layer.imagePath.get();

      if (path) {
        const source = (<string>path).toLowerCase();

        if (source.length) {
          this.source = source;
          this.active = 1;

          const uvSource = layer.uvSource;
          const flags = layer.flags;

          this.flags = flags;
          this.colorChannels = layer.colorChannelSetting;

          this.model = model;
          this.type = type;
          this.op = op;

          let uvCoordinate = 0;

          if (uvSource === 1) {
            uvCoordinate = 1;
          } else if (uvSource === 9) {
            uvCoordinate = 2;
          } else if (uvSource === 10) {
            uvCoordinate = 3;
          }

          this.uvCoordinate = uvCoordinate;

          this.textureUnit = layerTypeToTextureUnit[type];

          this.invert = flags & 0x10;
          this.clampResult = flags & 0x20;

          // I am not sure if the emissive team color mode is even used, since so far combineColors takes care of it.
          if (type === 'diffuse') {
            this.teamColorMode = 1;
          }

          const m3Texture = new M3Texture(!!(flags & 0x4), !!(flags & 0x8));

          model.viewer.load(source, pathSolver)
            .then((texture) => {
              if (texture) {
                m3Texture.texture = <Texture>texture;
              }
            });

          this.texture = m3Texture;
        }
      }
    }
  }

  bind(shader: Shader, textureOverrides: Map<number, Texture>): void {
    const gl = this.gl;
    const uniformMap = this.uniformMap;
    const uniforms = shader.uniforms;
    const active = this.active;

    gl.uniform1f(uniforms[uniformMap.enabled], active);

    if (active) {
      const m3Texture = <M3Texture>this.texture;
      const texture = textureOverrides.get(this.material.index * STANDARD_MATERIAL_OFFSET + this.index) || m3Texture.texture;
      const textureUnit = this.textureUnit;

      gl.uniform1i(uniforms[uniformMap.map], textureUnit);

      this.model.viewer.webgl.bindTextureAndWrap(texture, textureUnit, m3Texture.wrapS, m3Texture.wrapT);

      gl.uniform1f(uniforms[uniformMap.op], this.op);
      gl.uniform1f(uniforms[uniformMap.channels], this.colorChannels);
      gl.uniform1f(uniforms[uniformMap.teamColorMode], this.teamColorMode);

      // Alpha is probably unknown12. Can this be confirmed?
      // Many of these flags seem to be incorrect
      // gl.setParameter(uniform + 'multAddAlpha', [this.model.getValue(this.rgbMultiply, sequence, frame), this.model.getValue(this.rgbAdd, sequence, frame), 0]);
      // gl.setParameter(uniform + 'useAlphaFactor', 0);

      gl.uniform1f(uniforms[uniformMap.invert], this.invert);

      // gl.setParameter(uniform + 'multColor', 0);
      // gl.setParameter(uniform + 'addColor', 0);

      gl.uniform1f(uniforms[uniformMap.clampResult], this.clampResult);

      // gl.setParameter(uniform + 'useConstantColor', this.flags && 0x400);
      // gl.setParameter(uniform + 'constantColor', this.model.getValue(this.color, sequence, frame));
      // gl.setParameter(settings + 'uvSource', this.uvSource);

      gl.uniform1f(uniforms[uniformMap.uvCoordinate], this.uvCoordinate);
    }
  }

  unbind(shader: Shader): void {
    if (this.active) {
      this.gl.uniform1f(shader.uniforms[this.uniformMap.enabled], 0);
    }
  }
}
