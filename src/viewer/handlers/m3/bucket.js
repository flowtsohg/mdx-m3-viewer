import {mat4} from 'gl-matrix';
import Bucket from '../../bucket';

// Heap allocations needed for this module.
let matrixHeap = mat4.create();

/**
 * An M3 bucket.
 */
export default class M3Bucket extends Bucket {
  /**
   * @param {TexturedModelView} modelView
   */
  constructor(modelView) {
    super(modelView);

    const model = this.model;
    const gl = model.viewer.gl;

    this.gl = gl;

    let numberOfBones = model.initialReference.length;

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

    // Team colors (per instance)
    this.teamColorArray = new Uint8Array(batchSize);
    this.teamColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.teamColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.teamColorArray, gl.DYNAMIC_DRAW);

    // Vertex color (per instance)
    this.vertexColorArray = new Uint8Array(4 * batchSize).fill(255); // Vertex color initialized to white
    this.vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexColorArray, gl.DYNAMIC_DRAW);
  }

  /**
   * @override
   * @param {ModelInstance} instance
   */
  renderInstance(instance) {
    let model = this.model;
    let initialReferences = model.initialReference;
    let boneLookup = model.boneLookup;
    let boneArray = this.boneArray;
    let teamColorArray = this.teamColorArray;
    let vertexColorArray = this.vertexColorArray;
    let instanceOffset = this.count;
    let vertexColor = instance.vertexColor;
    let base = instanceOffset * this.boneArrayInstanceSize;
    let sequence = instance.sequence;
    let nodes = instance.skeleton.nodes;
    let finalMatrix;

    if (sequence === -1) {
      finalMatrix = instance.worldMatrix;
    } else {
      finalMatrix = matrixHeap;

      mat4.identity(finalMatrix);
    }

    for (let i = 0, l = boneLookup.length; i < l; i++) {
      let offset = base + i * 16;

      if (sequence !== -1) {
        let bone = boneLookup[i];

        mat4.multiply(finalMatrix, nodes[bone].worldMatrix, initialReferences[bone]);
      }

      boneArray[offset] = finalMatrix[0];
      boneArray[offset + 1] = finalMatrix[1];
      boneArray[offset + 2] = finalMatrix[2];
      boneArray[offset + 3] = finalMatrix[3];
      boneArray[offset + 4] = finalMatrix[4];
      boneArray[offset + 5] = finalMatrix[5];
      boneArray[offset + 6] = finalMatrix[6];
      boneArray[offset + 7] = finalMatrix[7];
      boneArray[offset + 8] = finalMatrix[8];
      boneArray[offset + 9] = finalMatrix[9];
      boneArray[offset + 10] = finalMatrix[10];
      boneArray[offset + 11] = finalMatrix[11];
      boneArray[offset + 12] = finalMatrix[12];
      boneArray[offset + 13] = finalMatrix[13];
      boneArray[offset + 14] = finalMatrix[14];
      boneArray[offset + 15] = finalMatrix[15];
    }

    // Team color
    teamColorArray[instanceOffset] = instance.teamColor;

    // Vertex color
    vertexColorArray[instanceOffset * 4] = vertexColor[0];
    vertexColorArray[instanceOffset * 4 + 1] = vertexColor[1];
    vertexColorArray[instanceOffset * 4 + 2] = vertexColor[2];
    vertexColorArray[instanceOffset * 4 + 3] = vertexColor[3];

    this.count += 1;
  }

  /**
   * @override
   */
  updateBuffers() {
    if (this.count) {
      let gl = this.model.viewer.gl;

      gl.activeTexture(gl.TEXTURE15);
      gl.bindTexture(gl.TEXTURE_2D, this.boneTexture);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.boneTextureWidth, this.count, gl.RGBA, gl.FLOAT, this.boneArray);


      gl.bindBuffer(gl.ARRAY_BUFFER, this.teamColorBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.teamColorArray);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexColorArray);
    }
  }
}
