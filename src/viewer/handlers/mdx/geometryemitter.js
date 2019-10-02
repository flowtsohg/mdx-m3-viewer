import {powerOfTwo} from '../../../common/math';
import Emitter from './emitter';

// The total storage that emitted objects can use.
// This is enough to support all of the MDX geometry emitters.
// The memory layout is the same as this C struct:
//
//   struct {
//     float p0[3]
//     float p1[3]
//     float p2[3]
//     float p3[3]
//     float health
//     byte color[4]
//     byte tail
//     byte leftRightTop[3]
//   }
export const BYTES_PER_OBJECT = 60;
export const FLOATS_PER_OBJECT = BYTES_PER_OBJECT >> 2;

// Offsets into the emitted object structure.
export const BYTE_OFFSET_P0 = 0;
export const BYTE_OFFSET_P1 = 12;
export const BYTE_OFFSET_P2 = 24;
export const BYTE_OFFSET_P3 = 36;
export const BYTE_OFFSET_HEALTH = 48;
export const BYTE_OFFSET_COLOR = 52;
export const BYTE_OFFSET_TAIL = 56;
export const BYTE_OFFSET_LEFT_RIGHT_TOP = 57;

// Offset aliases.
export const FLOAT_OFFSET_P0 = BYTE_OFFSET_P0 >> 2;
export const FLOAT_OFFSET_P1 = BYTE_OFFSET_P1 >> 2;
export const FLOAT_OFFSET_P2 = BYTE_OFFSET_P2 >> 2;
export const FLOAT_OFFSET_P3 = BYTE_OFFSET_P3 >> 2;
export const FLOAT_OFFSET_HEALTH = BYTE_OFFSET_HEALTH >> 2;
export const BYTE_OFFSET_TEAM_COLOR = BYTE_OFFSET_LEFT_RIGHT_TOP;

// Head or tail.
export const HEAD = 0;
export const TAIL = 1;

// Emitter types
export const EMITTER_PARTICLE2 = 0;
export const EMITTER_RIBBON = 1;
export const EMITTER_SPLAT = 2;
export const EMITTER_UBER = 3;

/**
 * A geometry emitter.
 * The base class of all MDX geometry emitters.
 */
export class GeometryEmitter extends Emitter {
  /**
   * @param {ModelViewData} modelViewData
   * @param {ParticleEmitter2|RibbonEmitter|EventObjectSplEmitter|EventObjectUbrEmitter} modelObject
   */
  constructor(modelViewData, modelObject) {
    super(modelViewData, modelObject);

    this.arrayBuffer = new ArrayBuffer(0);
    this.byteView = null;
    this.floatView = null;
    this.buffer = modelObject.model.viewer.gl.createBuffer();
  }

  /**
   * @override
   */
  update() {
    let bytesNeeded = this.alive * BYTES_PER_OBJECT;

    if (this.arrayBuffer.byteLength < bytesNeeded) {
      let gl = this.modelObject.model.viewer.gl;

      this.arrayBuffer = new ArrayBuffer(powerOfTwo(bytesNeeded));
      this.byteView = new Uint8Array(this.arrayBuffer);
      this.floatView = new Float32Array(this.arrayBuffer);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.arrayBuffer.byteLength, gl.DYNAMIC_DRAW);
    }

    super.update();
  }

  /**
   * @param {ModelView} modelView
   * @param {ShaderProgram} shader
   */
  render(modelView, shader) {
    if (this.alive) {
      let gl = this.modelObject.model.viewer.gl;
      let attribs = shader.attribs;

      this.bind(modelView, shader);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.byteView.subarray(0, this.alive * BYTES_PER_OBJECT));
      gl.vertexAttribPointer(attribs.a_p0, 3, gl.FLOAT, false, BYTES_PER_OBJECT, BYTE_OFFSET_P0);
      gl.vertexAttribPointer(attribs.a_p1, 3, gl.FLOAT, false, BYTES_PER_OBJECT, BYTE_OFFSET_P1);
      gl.vertexAttribPointer(attribs.a_p2, 3, gl.FLOAT, false, BYTES_PER_OBJECT, BYTE_OFFSET_P2);
      gl.vertexAttribPointer(attribs.a_p3, 3, gl.FLOAT, false, BYTES_PER_OBJECT, BYTE_OFFSET_P3);
      gl.vertexAttribPointer(attribs.a_health, 1, gl.FLOAT, false, BYTES_PER_OBJECT, BYTE_OFFSET_HEALTH);
      gl.vertexAttribPointer(attribs.a_color, 4, gl.UNSIGNED_BYTE, true, BYTES_PER_OBJECT, BYTE_OFFSET_COLOR);
      gl.vertexAttribPointer(attribs.a_tail, 1, gl.UNSIGNED_BYTE, false, BYTES_PER_OBJECT, BYTE_OFFSET_TAIL);
      gl.vertexAttribPointer(attribs.a_leftRightTop, 3, gl.UNSIGNED_BYTE, false, BYTES_PER_OBJECT, BYTE_OFFSET_LEFT_RIGHT_TOP);

      gl.extensions.instancedArrays.drawArraysInstancedANGLE(gl.TRIANGLES, 0, 6, this.alive);
    }
  }
}
