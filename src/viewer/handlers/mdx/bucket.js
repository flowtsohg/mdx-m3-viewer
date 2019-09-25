import Bucket from '../../bucket';

/**
 * An MDX bucket.
 */
export default class extends Bucket {
  /**
   * @param {MdxModelView} modelView
   */
  constructor(modelView) {
    super(modelView);

    let model = modelView.model;
    let batchSize = model.batchSize;
    let gl = model.viewer.gl;
    let numberOfBones = model.bones.length + 1;

    this.boneArrayInstanceSize = numberOfBones * 16;
    this.boneArray = new Float32Array(this.boneArrayInstanceSize * batchSize);

    this.boneTexture = gl.createTexture();
    this.boneTextureWidth = numberOfBones * 4;
    this.boneTextureHeight = batchSize;
    this.vectorSize = 1 / this.boneTextureWidth;
    this.rowSize = 1 / this.boneTextureHeight;

    gl.activeTexture(gl.TEXTURE15);
    gl.bindTexture(gl.TEXTURE_2D, this.boneTexture);
    model.viewer.webgl.setTextureMode(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.boneTextureWidth, this.boneTextureHeight, 0, gl.RGBA, gl.FLOAT, this.boneArray);

    // Team colors and vertex colors
    // [TC, RR, GG, BB, AA]
    this.colorData = new Uint8Array(batchSize * 5);
    this.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.colorData.byteLength, gl.DYNAMIC_DRAW);

    // Batches
    if (model.batches > 0) {
      this.geosetColorsData = new Uint8Array(batchSize * model.geosets.length * 4);
      this.geosetColorsBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.geosetColorsBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.geosetColorsData.byteLength, gl.DYNAMIC_DRAW);
    }

    // Layers
    // This buffer first contains the texture animation data for each instance, for each layer, and then every alpha for each instance for each layer.
    // Every texture animation data per instance contains the following:
    //     [Tx, Ty, Rz, Rw, S, Ox, Oy]
    // Where:
    //     T = translation
    //     R = rotation (quaternion with x=0 and y=0)
    //     S = scale (uniform)
    //     O = offset for sprite animations
    this.layersData = new ArrayBuffer(batchSize * model.layers.length * 29);
    this.uvTransformsData = new Float32Array(this.layersData, 0, batchSize * model.layers.length * 7);
    this.layerAlphasData = new Uint8Array(this.layersData, batchSize * model.layers.length * 28, batchSize * model.layers.length);
    this.layersBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.layersBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.layersData.byteLength, gl.DYNAMIC_DRAW);
  }

  /**
   * @override
   * @param {ModelInstance} instance
   */
  renderInstance(instance) {
    let model = this.modelView.model;
    let batchSize = model.batchSize;
    let batchCount = model.batches;
    let geosetCount = model.geosets.length;
    let layerCount = model.layers.length;
    let boneCount = model.bones.length;
    let colorData = this.colorData;
    let vertexColor = instance.vertexColor;
    let instanceOffset = this.count;
    let instanceOffset5 = instanceOffset * 5;

    // Bones
    if (boneCount) {
      let boneArray = this.boneArray;
      let worldMatrices = instance.worldMatrices;
      let base = 16 + instanceOffset * (16 + boneCount * 16);

      for (let i = 0, l = boneCount * 16; i < l; i++) {
        boneArray[base + i] = worldMatrices[i];
      }
    }

    // Team color
    colorData[instanceOffset5] = instance.teamColor;

    // Vertex color
    colorData[instanceOffset5 + 1] = vertexColor[0];
    colorData[instanceOffset5 + 2] = vertexColor[1];
    colorData[instanceOffset5 + 3] = vertexColor[2];
    colorData[instanceOffset5 + 4] = vertexColor[3];

    if (batchCount) {
      let geosetColorsData = this.geosetColorsData;
      let geosetColors = instance.geosetColors;
      let instanceOffset4 = instanceOffset * 4;

      for (let i = 0; i < geosetCount; i++) {
        let index = i * 4;
        let base = batchSize * index + instanceOffset4;

        // Geoset color
        geosetColorsData[base] = geosetColors[index];
        geosetColorsData[base + 1] = geosetColors[index + 1];
        geosetColorsData[base + 2] = geosetColors[index + 2];
        geosetColorsData[base + 3] = geosetColors[index + 3];
      }
    }

    if (layerCount) {
      let uvTransformsData = this.uvTransformsData;
      let layerAlphasData = this.layerAlphasData;
      let uvOffsets = instance.uvOffsets;
      let uvRots = instance.uvRots;
      let uvScales = instance.uvScales;
      let layerAlphas = instance.layerAlphas;
      let instanceOffset7 = instanceOffset * 7;

      for (let i = 0; i < layerCount; i++) {
        let index = i * 4;
        let base = batchSize * i * 7 + instanceOffset7;

        // Translation
        uvTransformsData[base] = uvOffsets[index];
        uvTransformsData[base + 1] = uvOffsets[index + 1];

        // Rotation
        uvTransformsData[base + 2] = uvRots[i * 2];
        uvTransformsData[base + 3] = uvRots[i * 2 + 1];

        // Scale
        uvTransformsData[base + 4] = uvScales[i];

        // Sprite animation
        uvTransformsData[base + 5] = uvOffsets[index + 2];
        uvTransformsData[base + 6] = uvOffsets[index + 3];

        // Layer alpha
        layerAlphasData[batchSize * i + instanceOffset] = layerAlphas[i];
      }
    }

    this.count += 1;
  }

  /**
   * @override
   */
  updateBuffers() {
    if (this.count) {
      let model = this.modelView.model;
      let gl = model.viewer.gl;

      gl.activeTexture(gl.TEXTURE15);
      gl.bindTexture(gl.TEXTURE_2D, this.boneTexture);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.boneTextureWidth, this.count, gl.RGBA, gl.FLOAT, this.boneArray);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.colorData);

      if (model.geosets.length) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.geosetColorsBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.geosetColorsData);
      }

      if (model.layers.length) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.layersBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.layersData);
      }
    }
  }
}
