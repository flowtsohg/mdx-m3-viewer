import MdxParser from '../../../parsers/mdlx/model';
import {layerFilterMode} from '../mdx/filtermode';
import replaceableids from '../mdx/replaceableids';

/**
 * A static model.
 */
export default class SimpleModel {
  /**
   * @param {War3MapViewer} viewer
   * @param {ArrayBuffer} arrayBuffer
   * @param {number} instances
   * @param {Array<number>} instanceData
   */
  constructor(viewer, arrayBuffer, instances, instanceData) {
    let gl = viewer.gl;
    let parser = new MdxParser(arrayBuffer);
    let geosets = parser.geosets;
    let vertexBufferSize = 0;
    let faceBufferSize = 0;

    // First pass to get the total buffer sizes.
    for (let geoset of geosets) {
      vertexBufferSize += geoset.vertices.byteLength + geoset.normals.byteLength + geoset.uvSets[0].byteLength;
      faceBufferSize += geoset.faces.byteLength;
    }

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexBufferSize, gl.STATIC_DRAW);

    let faceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faceBufferSize, gl.STATIC_DRAW);

    let vertexOffset = 0;
    let faceOffset = 0;
    let offsets = [];
    let materials = parser.materials;
    let opaqueBatches = [];
    let translucentBatches = [];

    // Second pass to fill the buffers and calculate the offsets.
    for (let i = 0, l = geosets.length; i < l; i++) {
      let geoset = geosets[i];
      let vertices = geoset.vertices;
      let normals = geoset.normals;
      let uvs = geoset.uvSets[0];
      let faces = geoset.faces;

      // Locations.
      gl.bufferSubData(gl.ARRAY_BUFFER, vertexOffset, vertices);

      offsets.push(vertexOffset);
      vertexOffset += vertices.byteLength;

      // Normals.
      gl.bufferSubData(gl.ARRAY_BUFFER, vertexOffset, normals);

      offsets.push(vertexOffset);
      vertexOffset += normals.byteLength;

      // Texture coordinates.
      gl.bufferSubData(gl.ARRAY_BUFFER, vertexOffset, uvs);

      offsets.push(vertexOffset);
      vertexOffset += uvs.byteLength;

      // Elements.
      offsets.push(faces.length);

      // Faces.
      gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, faceOffset, faces);

      offsets.push(faceOffset);
      faceOffset += faces.byteLength;

      let material = materials[geoset.materialId];

      for (let layer of material.layers) {
        let filterMode = layer.filterMode;
        let textureId = layer.textureId;
        let flags = layer.flags;
        let blended = (filterMode > 1) ? true : false;
        let [blendSrc, blendDst] = layerFilterMode(filterMode, gl);
        let depthMaskValue = (filterMode === 0 || filterMode === 1) ? 1 : 0;
        let alphaTestValue = (filterMode === 1) ? 1 : 0;
        let unshaded = flags & 0x1;
        let twoSided = flags & 0x10;
        let noDepthTest = flags & 0x40;
        let noDepthSet = flags & 0x80;
        let batch = {geosetId: i, textureId, blended, blendSrc, blendDst, depthMaskValue, alphaTestValue, unshaded, twoSided, noDepthTest, noDepthSet};

        if (filterMode > 1) {
          translucentBatches.push(batch);
        } else {
          opaqueBatches.push(batch);
        }
      }
    }

    let instanceDataBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, instanceDataBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(instanceData), gl.STATIC_DRAW);

    let textures = [];

    for (let texture of parser.textures) {
      let path = texture.path;
      let replaceableId = texture.replaceableId;

      if (replaceableId !== 0) {
        path = `ReplaceableTextures\\${replaceableids[replaceableId]}.blp`;
      }

      textures.push(viewer.load(path));
    }

    this.ok = false;

    viewer.whenLoaded(textures)
      .then(() => {
        this.ok = true;
      });

    /** @member {WebGLBuffer} */
    this.vertexBuffer = vertexBuffer;
    /** @member {WebGLBuffer} */
    this.faceBuffer = faceBuffer;
    /** @member {Array<number>} */
    this.offsets = offsets;
    /** @member {WebGLBuffer} */
    this.instanceDataBuffer = instanceDataBuffer;
    /** @member {number} */
    this.instances = instances;
    /** @member {Array<Object>} */
    this.opaqueBatches = opaqueBatches;
    /** @member {Array<Object>} */
    this.translucentBatches = translucentBatches;
    /** @member {Array<Texture>} */
    this.textures = textures;
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {ANGLEInstancedArrays} instancedArrays
   * @param {Object} uniforms
   * @param {Object} attribs
   * @param {Array<Object>} batches
   */
  render(gl, instancedArrays, uniforms, attribs, batches) {
    if (this.ok && batches.length) {
      // Matrices
      gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceDataBuffer);
      gl.vertexAttribPointer(attribs.a_instancePosition, 3, gl.FLOAT, false, 24, 0);
      gl.vertexAttribPointer(attribs.a_instanceRotation, 2, gl.FLOAT, false, 24, 12);
      gl.vertexAttribPointer(attribs.a_instanceScale, 1, gl.FLOAT, false, 24, 20);

      // Vertices.
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

      // Faces.
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.faceBuffer);

      let offsets = this.offsets;
      let textures = this.textures;

      for (let i = 0, l = batches.length; i < l; i++) {
        let batch = batches[i];
        let offset = batch.geosetId * 5;

        // Vertex attributes.
        gl.vertexAttribPointer(attribs.a_position, 3, gl.FLOAT, false, 12, offsets[offset]);
        gl.vertexAttribPointer(attribs.a_normal, 3, gl.FLOAT, false, 12, offsets[offset + 1]);
        gl.vertexAttribPointer(attribs.a_uv, 2, gl.FLOAT, false, 8, offsets[offset + 2]);

        // Layer settings.
        gl.uniform1f(uniforms.u_alphaTest, batch.alphaTestValue);
        gl.uniform1f(uniforms.u_unshaded, batch.unshaded);

        if (batch.blended) {
          gl.enable(gl.BLEND);
          gl.blendFunc(batch.blendSrc, batch.blendDst);
        } else {
          gl.disable(gl.BLEND);
        }

        if (batch.twoSided) {
          gl.disable(gl.CULL_FACE);
        } else {
          gl.enable(gl.CULL_FACE);
        }

        if (batch.noDepthTest) {
          gl.disable(gl.DEPTH_TEST);
        } else {
          gl.enable(gl.DEPTH_TEST);
        }

        if (batch.noDepthSet) {
          gl.depthMask(0);
        } else {
          gl.depthMask(batch.depthMaskValue);
        }

        // Texture.
        gl.bindTexture(gl.TEXTURE_2D, textures[batch.textureId].webglResource);

        // Draw.
        instancedArrays.drawElementsInstancedANGLE(gl.TRIANGLES, offsets[offset + 3], gl.UNSIGNED_SHORT, offsets[offset + 4], this.instances);
      }
    }
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {ANGLEInstancedArrays} instancedArrays
   * @param {Object} uniforms
   * @param {Object} attribs
   */
  renderOpaque(gl, instancedArrays, uniforms, attribs) {
    this.render(gl, instancedArrays, uniforms, attribs, this.opaqueBatches);
  }

  /**
   * @param {WebGLRenderingContext} gl
   * @param {ANGLEInstancedArrays} instancedArrays
   * @param {Object} uniforms
   * @param {Object} attribs
   */
  renderTranslucent(gl, instancedArrays, uniforms, attribs) {
    this.render(gl, instancedArrays, uniforms, attribs, this.translucentBatches);
  }
}
