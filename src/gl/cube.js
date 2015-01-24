/**
 * @memberof GL
 * @class A WebGL cube.
 * @name Cube
 * @param {number} x1 Minimum X coordinate.
 * @param {number} y1 Minimum Y coordinate.
 * @param {number} z1 Minimum Z coordinate.
 * @param {number} x2 Maximum X coordinate.
 * @param {number} y2 Maximum Y coordinate.
 * @param {number} z2 Maximum Z coordinate.
 * @property {WebGLBuffer} buffer
 * @property {Float32Array} data
 */
function Cube(ctx, x1, y1, z1, x2, y2, z2) {
    this.ctx = ctx;
    this.buffer = ctx.createBuffer();
    this.data = new Float32Array([
        x1, y2, z1,
        x1, y2, z2,
        x1, y2, z2,
        x2, y2, z2,
        x2, y2, z2,
        x2, y2, z1,
        x2, y2, z1,
        x1, y2, z1,
        x1, y1, z1,
        x1, y1, z2,
        x1, y1, z2,
        x2, y1, z2,
        x2, y1, z2,
        x2, y1, z1,
        x2, y1, z1,
        x1, y1, z1,
        x1, y1, z2,
        x1, y2, z2,
        x1, y2, z1,
        x1, y1, z1,
        x2, y1, z2,
        x2, y2, z2,
        x2, y2, z1,
        x2, y1, z1
    ]);

    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, this.data, ctx.STATIC_DRAW);
}

Cube.prototype = {
  /**
   * Renders a cubes's lines with the given shader.
   *
   * @memberof GL.Cube
   * @instance
   * @param {GL.Shader} shader
   */
    renderLines: function (shader) {
        var ctx = this.ctx;
        
        ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buffer);

        ctx.vertexAttribPointer(shader.variables.a_position, 3, ctx.FLOAT, false, 12, 0);

        ctx.drawArrays(ctx.LINES, 0, 24);
    }
};
