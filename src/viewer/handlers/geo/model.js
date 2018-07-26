import TexturedModel from '../../texturedmodel';

/**
 * A geometry model.
 *
 * Used to render simple geometric shapes.
 */
export default class GeometryModel extends TexturedModel {
  /**
   * Load the model.
   *
   * @param {Object} src
   */
  load(src) {
    const gl = this.viewer.gl;

    let geometry = src.geometry;
    let material = src.material;

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.vertices, gl.STATIC_DRAW);

    let uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.uvs, gl.STATIC_DRAW);

    let faceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.faces, gl.STATIC_DRAW);

    let edgeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, edgeBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.edges, gl.STATIC_DRAW);

    this.boundingRadius = geometry.boundingRadius;

    this.vertexArray = geometry.vertices;
    this.uvArray = geometry.uvs;
    this.faceArray = geometry.faces;
    this.edgeArray = geometry.edges;
    this.vertexBuffer = vertexBuffer;
    this.uvBuffer = uvBuffer;
    this.faceBuffer = faceBuffer;
    this.edgeBuffer = edgeBuffer;

    let bytesPerElement = geometry.faces.BYTES_PER_ELEMENT;

    if (bytesPerElement === 1) {
      this.faceIndexType = gl.UNSIGNED_BYTE;
    } else if (bytesPerElement === 2) {
      this.faceIndexType = gl.UNSIGNED_SHORT;
    } else {
      this.faceIndexType = gl.UNSIGNED_INT;
    }

    bytesPerElement = geometry.edges.BYTES_PER_ELEMENT;

    if (bytesPerElement === 1) {
      this.edgeIndexType = gl.UNSIGNED_BYTE;
    } else if (bytesPerElement === 2) {
      this.edgeIndexType = gl.UNSIGNED_SHORT;
    } else {
      this.edgeIndexType = gl.UNSIGNED_INT;
    }

    this.texture = material.texture;

    this.twoSided = material.twoSided || false;
    this.noDepthTest = material.noDepthSet || false;
    this.noDepthSet = material.noDepthSet || false;

    this.uvScale = material.uvScale || new Float32Array([1, 1]);
    this.uvOffset = material.uvOffset || new Float32Array(2);

    this.vertexColor = material.vertexColor || new Float32Array([255, 255, 255, 255]);
    this.edgeColor = material.edgeColor || new Float32Array([255, 255, 255, 255]);

    this.renderMode = 0;

    if (material.renderMode > 0) {
      this.renderMode = material.renderMode;
    }

    this.isBGR = material.isBGR || false;
    this.isBlended = material.isBlended || false;

    if (this.isBlended) {
      this.translucent = true;
    } else {
      this.opaque = true;
    }
  }

  /**
   *
   * @param {*} bucket
   * @param {*} scene
   * @param {*} modelView
   */
  render(bucket, scene, modelView) {
    let webgl = this.viewer.webgl;
    let gl = this.viewer.gl;
    let instancedArrays = webgl.extensions.instancedArrays;
    let shader = this.viewer.shaderMap.get('GeoStandardShader');
    let uniforms = shader.uniforms;
    let attribs = shader.attribs;

    webgl.useShaderProgram(shader);

    gl.uniformMatrix4fv(uniforms.u_mvp, false, scene.camera.worldProjectionMatrix);

    // Bone texture
    gl.activeTexture(gl.TEXTURE15);
    gl.bindTexture(gl.TEXTURE_2D, bucket.boneTexture);
    gl.uniform1i(uniforms.u_boneMap, 15);
    gl.uniform1f(uniforms.u_vectorSize, bucket.vectorSize);
    gl.uniform1f(uniforms.u_rowSize, bucket.rowSize);

    // Instanced IDs
    let instanceIdAttrib = attribs.a_InstanceID;
    gl.bindBuffer(gl.ARRAY_BUFFER, bucket.instanceIdBuffer);
    gl.vertexAttribPointer(instanceIdAttrib, 1, gl.UNSIGNED_SHORT, false, 2, 0);
    instancedArrays.vertexAttribDivisorANGLE(instanceIdAttrib, 1);

    // Vertices
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(attribs.a_position, 3, gl.FLOAT, false, 12, 0);

    // UVs
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.vertexAttribPointer(attribs.a_uv, 2, gl.FLOAT, false, 8, 0);

    if (this.twoSided) {
      gl.disable(gl.CULL_FACE);
    } else {
      gl.enable(gl.CULL_FACE);
    }

    if (this.noDepthTest) {
      gl.disable(gl.DEPTH_TEST);
    } else {
      gl.enable(gl.DEPTH_TEST);
    }

    if (this.noDepthSet) {
      gl.depthMask(0);
    } else {
      gl.depthMask(1);
    }

    if (this.isBlended) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    } else {
      gl.disable(gl.BLEND);
    }

    gl.uniform1i(uniforms.u_texture, 0);

    let colorAttrib = attribs.a_color;
    instancedArrays.vertexAttribDivisorANGLE(colorAttrib, 1);

    if (this.renderMode === 0 || this.renderMode === 2) {
      let texture = modelView.textures.get(null) || this.texture;

      webgl.bindTexture(texture, 0);

      let hasTexture = uniforms.u_hasTexture;
      if (texture) {
        gl.uniform1f(hasTexture, 1);
      } else {
        gl.uniform1f(hasTexture, 0);
      }

      gl.uniform1f(uniforms.u_isEdge, 0);
      gl.uniform2fv(uniforms.u_uvScale, this.uvScale);
      gl.uniform2fv(uniforms.u_uvOffset, this.uvOffset);
      gl.uniform1f(uniforms.u_isBGR, this.isBGR);
      gl.uniform1f(uniforms.u_alphaMod, this.alpha);

      // Colors
      gl.bindBuffer(gl.ARRAY_BUFFER, bucket.vertexColorBuffer);
      gl.vertexAttribPointer(colorAttrib, 4, gl.UNSIGNED_BYTE, true, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.faceBuffer);
      instancedArrays.drawElementsInstancedANGLE(gl.TRIANGLES, this.faceArray.length, this.faceIndexType, 0, bucket.count);
    }

    if (this.renderMode === 1 || this.renderMode === 2) {
      gl.uniform1f(uniforms.u_isEdge, 1);

      // Edge colors
      gl.bindBuffer(gl.ARRAY_BUFFER, bucket.edgeColorBuffer);
      gl.vertexAttribPointer(colorAttrib, 4, gl.UNSIGNED_BYTE, true, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgeBuffer);
      instancedArrays.drawElementsInstancedANGLE(gl.LINES, this.edgeArray.length, this.edgeIndexType, 0, bucket.count);
    }

    // / Reset the attributes to play nice with other handlers
    instancedArrays.vertexAttribDivisorANGLE(instanceIdAttrib, 0);
    instancedArrays.vertexAttribDivisorANGLE(colorAttrib, 0);
  }

  /**
   * @param {*} data
   */
  renderBuckets(data) {
    let scene = data.scene;
    let buckets = data.buckets;
    let modelView = data.modelView;

    for (let i = 0, l = data.usedBuckets; i < l; i++) {
      this.render(buckets[i], scene, modelView);
    }
  }

  /**
   * Render the opaque things in the given scene data.
   *
   * @param {Object} data
   */
  renderOpaque(data) {
    if (this.opaque) {
      this.renderBuckets(data);
    }
  }

  /**
   * Render the translucent things in the given scene data.
   *
   * @param {Object} data
   */
  renderTranslucent(data) {
    if (this.translucent) {
      this.renderBuckets(data);
    }
  }
}
