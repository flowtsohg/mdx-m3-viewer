let layerTypeToTextureUnit = {
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
  /**
   * @param {M3StandardMaterial} material
   * @param {M3ParserReference} layer
   * @param {string} type
   * @param {number} op
   */
  constructor(material, layer, type, op) {
    // Since Gloss doesn't exist in all versions
    if (layer) {
      layer = layer.get();

      let model = material.model;
      let pathSolver = model.pathSolver;

      this.active = false;
      this.layer = layer;
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

      let source = layer.imagePath.getAll().join('');

      if (source.length !== 0) {
        source = source.replace('\0', '').toLowerCase();

        this.source = source;

        this.texture = model.viewer.load(source, pathSolver);

        this.active = true;

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
        this.teamColorMode = (type === 'diffuse') & 1;
      }
    }
  }

  /**
   * @param {Bucket} bucket
   * @param {ShaderProgram} shader
   */
  bind(bucket, shader) {
    let gl = this.gl;
    let uniformMap = this.uniformMap;
    let uniforms = shader.uniforms;
    let active = this.active;

    gl.uniform1f(uniforms[uniformMap.enabled], active);

    if (active) {
      gl.uniform1i(uniforms[uniformMap.map], this.textureUnit);
      bucket.modelView.bindTexture(this.texture, this.textureUnit);

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

  /**
   * @param {ShaderProgram} shader
   */
  unbind(shader) {
    if (this.active) {
      this.gl.uniform1f(shader.uniforms[this.uniformMap.enabled], 0);
    }
  }
}
