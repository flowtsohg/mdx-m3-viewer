import Bucket from '../../bucket';

/**
 * GEO bucket implementation.
 */
export default class GeometryBucket extends Bucket {
  /**
   * @param {GeometryModelView} modelView
   */
  constructor(modelView) {
    super(modelView);

    const numberOfBones = 1;

    let model = modelView.model;
    let gl = model.viewer.gl;
    let batchSize = model.batchSize;

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

    // Color (per instance)
    this.vertexColorArray = new Uint8Array(4 * batchSize);
    this.vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexColorArray, gl.DYNAMIC_DRAW);

    // Edge color (per instance)
    this.edgeColorArray = new Uint8Array(4 * batchSize);
    this.edgeColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.edgeColorArray, gl.DYNAMIC_DRAW);
  }

  /**
   * @override
   * @param {ModelInstance} instance
   */
  renderInstance(instance) {
    let boneArray = this.boneArray;
    let vertexColorArray = this.vertexColorArray;
    let edgeColorArray = this.edgeColorArray;
    let instanceOffset = this.count;
    let worldMatrix = instance.worldMatrix;
    let vertexColor = instance.vertexColor;
    let edgeColor = instance.edgeColor;
    let offset = instanceOffset * 16;

    boneArray[offset] = worldMatrix[0];
    boneArray[offset + 1] = worldMatrix[1];
    boneArray[offset + 2] = worldMatrix[2];
    boneArray[offset + 3] = worldMatrix[3];
    boneArray[offset + 4] = worldMatrix[4];
    boneArray[offset + 5] = worldMatrix[5];
    boneArray[offset + 6] = worldMatrix[6];
    boneArray[offset + 7] = worldMatrix[7];
    boneArray[offset + 8] = worldMatrix[8];
    boneArray[offset + 9] = worldMatrix[9];
    boneArray[offset + 10] = worldMatrix[10];
    boneArray[offset + 11] = worldMatrix[11];
    boneArray[offset + 12] = worldMatrix[12];
    boneArray[offset + 13] = worldMatrix[13];
    boneArray[offset + 14] = worldMatrix[14];
    boneArray[offset + 15] = worldMatrix[15];

    // Vertex color
    vertexColorArray[instanceOffset * 4] = vertexColor[0];
    vertexColorArray[instanceOffset * 4 + 1] = vertexColor[1];
    vertexColorArray[instanceOffset * 4 + 2] = vertexColor[2];
    vertexColorArray[instanceOffset * 4 + 3] = vertexColor[3];

    // Edge color
    edgeColorArray[instanceOffset * 4] = edgeColor[0];
    edgeColorArray[instanceOffset * 4 + 1] = edgeColor[1];
    edgeColorArray[instanceOffset * 4 + 2] = edgeColor[2];
    edgeColorArray[instanceOffset * 4 + 3] = edgeColor[3];

    this.count += 1;
  }

  /**
   * @override
   */
  updateBuffers() {
    if (this.count) {
      let gl = this.modelView.model.viewer.gl;

      gl.activeTexture(gl.TEXTURE15);
      gl.bindTexture(gl.TEXTURE_2D, this.boneTexture);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.boneTextureWidth, this.count, gl.RGBA, gl.FLOAT, this.boneArray);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexColorArray);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeColorBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.edgeColorArray);
    }
  }
}
