import Reference from '../../../parsers/m3/reference';
import Layer from '../../../parsers/m3/layer';
import Texture from '../../texture';
import ShaderProgram from '../../gl/program';
import TextureMapper from '../../texturemapper';
import M3StandardMaterial from './standardmaterial';
import M3Model from './model';

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
  active: number = 0;
  layer: Layer | null = null;
  gl: WebGLRenderingContext;
  uniformMap: { map: string; enabled: string; op: string; channels: string; teamColorMode: string; invert: string; clampResult: string; uvCoordinate: string; };
  source: string = '';
  texture: Texture | null = null;
  flags: number = 0;
  colorChannels: number = 0;
  type: string = '';
  op: number = 0;
  uvCoordinate: number = 0;
  textureUnit: number = 0;
  invert: number = 0;
  clampResult: number = 0;
  teamColorMode: number = 0;

  constructor(material: M3StandardMaterial, layerReference: Reference | null, type: string, op: number) {
    let model = material.model;

    this.model = model;
    this.gl = material.gl;

    let uniform = 'u_' + type;
    let settings = uniform + 'LayerSettings.';

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
    if (layerReference) {
      let layer = layerReference.get();

      this.layer = layer;

      let pathSolver = model.pathSolver;

      let source = layer.imagePath.getAll().join('').replace('\0', '').toLowerCase();

      if (source.length) {
        this.source = source;

        this.texture = <Texture>model.viewer.load(source, pathSolver);

        this.active = 1;

        let uvSource = layer.uvSource;
        let flags = layer.flags;

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
      }
    }
  }

  bind(shader: ShaderProgram, textureMapper: TextureMapper) {
    let gl = this.gl;
    let uniformMap = this.uniformMap;
    let uniforms = shader.uniforms;
    let active = this.active;

    gl.uniform1f(uniforms[uniformMap.enabled], active);

    if (active) {
      let texture = this.texture;
      let textureUnit = this.textureUnit;

      gl.uniform1i(uniforms[uniformMap.map], textureUnit);

      this.model.viewer.webgl.bindTexture(textureMapper.get(texture) || texture, textureUnit);

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

  unbind(shader: ShaderProgram) {
    if (this.active) {
      this.gl.uniform1f(shader.uniforms[this.uniformMap.enabled], 0);
    }
  }
}
