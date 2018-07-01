import Model from '../../model';

/**
 * An OBJ model.
 */
export default class ObjModel extends Model {
  /**
   * @param {Object} resourceData
   */
  constructor(resourceData) {
    super(resourceData);

    /** @member {?WebGLBuffer} */
    this.vertexBuffer = null;
    /** @member {?WebGLBuffer} */
    this.faceBuffer = null;
    /** @member {number} */
    this.elements = 0;
  }

  /**
   * @param {string} buffer
   */
  load(buffer) {
    let lines = buffer.split('\n');
    let vertices = [];
    let faces = [];

    for (let i = 0, l = lines.length; i < l; i++) {
      // Strip comments
      let line = lines[i].split('#')[0];

      // Skip empty lines
      if (line !== '') {
        // Try to match a vertex: v <real> <real> <real>
        let match = line.match(/v\s+([\d.\-+]+)\s+([\d.\-+]+)\s+([\d.\-+]+)/);

        if (match) {
          vertices.push(parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]));
        } else {
          // Try to match a face: f <integer> <integer> <integer>
          match = line.match(/f\s+([\d]+)\s+([\d]+)\s+([\d]+)/);

          if (match) {
            // OBJ uses 1-based indexing, so we have to deduce 1
            faces.push(parseInt(match[1], 10) - 1, parseInt(match[2], 10) - 1, parseInt(match[3], 10) - 1);
          }
        }
      }
    }

    // gl is the WebGLRenderingContext object used by the viewer.
    let gl = this.viewer.gl;
    let vertexArray = new Float32Array(vertices);
    let faceArray = new Uint16Array(faces);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);

    const faceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faceArray, gl.STATIC_DRAW);

    this.vertexBuffer = vertexBuffer;
    this.faceBuffer = faceBuffer;
    this.elements = faces.length;
  }

  /**
   * Render the opaque things in the given scene data.
   *
   * @param {Object} data
   */
  renderOpaque(data) {
    let scene = data.scene;
    let webgl = this.viewer.webgl;
    let gl = this.viewer.gl;
    let shader = this.viewer.shaderMap.get('ObjShader');
    let uniforms = shader.uniforms;
    let attribs = shader.attribs;
    let instances = data.instances;

    webgl.useShaderProgram(shader);

    gl.uniformMatrix4fv(uniforms.u_mvp, false, scene.camera.worldProjectionMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(attribs.a_position, 3, gl.FLOAT, false, 12, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.faceBuffer);

    // Now let's render each instance.
    for (let i = 0, l = instances.length; i < l; i++) {
      // Use the color!
      gl.uniform3fv(uniforms.u_color, instances[i].color);

      // And send the instance's world matrix, so it can be moved
      gl.uniformMatrix4fv(uniforms.u_transform, false, instances[i].worldMatrix);

      gl.drawElements(gl.TRIANGLES, this.elements, gl.UNSIGNED_SHORT, 0);
    }
  }
}
