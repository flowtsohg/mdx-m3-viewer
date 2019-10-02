import {vec3} from 'gl-matrix';
import {BYTES_PER_OBJECT, FLOATS_PER_OBJECT, FLOAT_OFFSET_P0, BYTE_OFFSET_COLOR, BYTE_OFFSET_LEFT_RIGHT_TOP} from './geometryemitter';

// Heap allocations needed for this module.
let belowHeap = vec3.create();
let aboveHeap = vec3.create();
let colorHeap = vec3.create();
let alphaHeap = new Float32Array(1);
let slotHeap = new Float32Array(1);

/**
 * A ribbon.
 */
export default class Ribbon {
  /**
   * @param {MdxRibbonEmitter} emitter
   */
  constructor(emitter) {
    this.emitter = emitter;
    this.emitterView = null;
    this.index = 0;
    this.health = 0;
    this.vertices = new Float32Array(12);
  }

  /**
   * @param {RibbonEmitterView} emitterView
   */
  bind(emitterView) {
    let emitter = this.emitter;

    emitterView.ribbonCount++;

    this.emitterView = emitterView;
    this.index = emitterView.currentRibbon++;
    this.health = emitter.modelObject.lifeSpan;

    let lastEmit = emitterView.lastEmit;

    // If this isn't the first ribbon, construct a quad.
    // Otherwise, the vertices will be filled with zeroes, and the ribbon will not render.
    // This allows the emitter to always work with quads, and therefore it can work with many views, because the ribbon chains are implicit.
    if (lastEmit && lastEmit.health > 0) {
      let node = emitterView.instance.nodes[emitter.modelObject.index];
      let [x, y, z] = node.pivot;
      let worldMatrix = node.worldMatrix;

      emitterView.getHeightBelow(belowHeap);
      emitterView.getHeightAbove(aboveHeap);

      let heightBelow = belowHeap[0];
      let heightAbove = aboveHeap[0];

      belowHeap[0] = x;
      belowHeap[1] = y - heightBelow;
      belowHeap[2] = z;

      aboveHeap[0] = x;
      aboveHeap[1] = y + heightAbove;
      aboveHeap[2] = z;

      vec3.transformMat4(belowHeap, belowHeap, worldMatrix);
      vec3.transformMat4(aboveHeap, aboveHeap, worldMatrix);

      let vertices = this.vertices;
      let lastVertices = lastEmit.vertices;

      // Left top
      vertices[0] = aboveHeap[0];
      vertices[1] = aboveHeap[1];
      vertices[2] = aboveHeap[2];

      // Left bottom
      vertices[3] = belowHeap[0];
      vertices[4] = belowHeap[1];
      vertices[5] = belowHeap[2];

      // Right bottom
      vertices[6] = lastVertices[3];
      vertices[7] = lastVertices[4];
      vertices[8] = lastVertices[5];

      // Right top
      vertices[9] = lastVertices[0];
      vertices[10] = lastVertices[1];
      vertices[11] = lastVertices[2];
    }
  }

  /**
   * @param {number} offset
   * @param {number} dt
   */
  render(offset, dt) {
    let emitterView = this.emitterView;

    this.health -= dt;

    if (this.health > 0) {
      let emitter = this.emitter;
      let modelObject = emitter.modelObject;
      let byteView = emitter.byteView;
      let floatView = emitter.floatView;
      let byteOffset = offset * BYTES_PER_OBJECT;
      let floatOffset = offset * FLOATS_PER_OBJECT;
      let p0Offset = floatOffset + FLOAT_OFFSET_P0;
      let colorOffset = byteOffset + BYTE_OFFSET_COLOR;
      let leftRightTopOffset = byteOffset + BYTE_OFFSET_LEFT_RIGHT_TOP;

      emitterView.getColor(colorHeap);
      emitterView.getAlpha(alphaHeap);
      emitterView.getTextureSlot(slotHeap);

      let animatedSlot = slotHeap[0];
      let chainLengthFactor = 1 / emitterView.ribbonCount;
      let locationInChain = (emitterView.currentRibbon - this.index - 1);
      let columns = modelObject.dimensions[0];
      let left = (animatedSlot % columns) + (locationInChain * chainLengthFactor);
      let top = (animatedSlot / columns) | 0;
      let right = left + chainLengthFactor;
      let vertices = this.vertices;
      let gravity = modelObject.gravity * dt * dt;

      vertices[1] -= gravity;
      vertices[4] -= gravity;
      vertices[7] -= gravity;
      vertices[10] -= gravity;

      floatView[p0Offset + 0] = vertices[0];
      floatView[p0Offset + 1] = vertices[1];
      floatView[p0Offset + 2] = vertices[2];
      floatView[p0Offset + 3] = vertices[3];
      floatView[p0Offset + 4] = vertices[4];
      floatView[p0Offset + 5] = vertices[5];
      floatView[p0Offset + 6] = vertices[6];
      floatView[p0Offset + 7] = vertices[7];
      floatView[p0Offset + 8] = vertices[8];
      floatView[p0Offset + 9] = vertices[9];
      floatView[p0Offset + 10] = vertices[10];
      floatView[p0Offset + 11] = vertices[11];

      byteView[colorOffset + 0] = colorHeap[0] * 255;
      byteView[colorOffset + 1] = colorHeap[1] * 255;
      byteView[colorOffset + 2] = colorHeap[2] * 255;
      byteView[colorOffset + 3] = alphaHeap[0] * 255;

      byteView[leftRightTopOffset + 0] = left * 255;
      byteView[leftRightTopOffset + 1] = right * 255;
      byteView[leftRightTopOffset + 2] = top * 255;
    } else {
      emitterView.ribbonCount--;
    }
  }
}
