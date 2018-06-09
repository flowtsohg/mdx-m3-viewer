import {vec3} from 'gl-matrix';
import {uint8ToUint24} from '../../../common/typecast';

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
    this.health = 0;
    this.emitterView = null;

    this.vertices = new Float32Array(12);
    this.lta = 0;
    this.lba = 0;
    this.rta = 0;
    this.rba = 0;
    this.rgb = 0;
  }

  /**
   * @param {RibbonEmitterView} emitterView
   */
  reset(emitterView) {
    let emitter = this.emitter;
    let vertices = this.vertices;

    this.index = emitterView.currentRibbon++;

    emitterView.ribbonCount++;

    this.emitterView = emitterView;

    this.health = emitter.modelObject.lifeSpan;

    let lastEmit = emitterView.lastEmit;

    // If this isn't the first ribbon, construct a quad.
    // Otherwise, the vertices will be filled with zeroes, and the ribbon will not render.
    // This allows the emitter to always work with quads, and therefore it can work with many views, because the ribbon chains are implicit.
    if (lastEmit && lastEmit.health > 0) {
      let node = emitterView.instance.nodes[emitter.modelObject.index];
      let pivot = node.pivot;

      emitterView.getHeightBelow(belowHeap);
      emitterView.getHeightAbove(aboveHeap);

      vec3.set(belowHeap, pivot[0], pivot[1] - belowHeap[0], pivot[2]);
      vec3.transformMat4(belowHeap, belowHeap, node.worldMatrix);

      vec3.set(aboveHeap, pivot[0], pivot[1] + aboveHeap[0], pivot[2]);
      vec3.transformMat4(aboveHeap, aboveHeap, node.worldMatrix);

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
    } else {
      vertices[0] = 0;
      vertices[1] = 0;
      vertices[2] = 0;
      vertices[3] = 0;
      vertices[4] = 0;
      vertices[5] = 0;
      vertices[6] = 0;
      vertices[7] = 0;
      vertices[8] = 0;
      vertices[9] = 0;
      vertices[10] = 0;
      vertices[11] = 0;
    }
  }

  /**
   *
   */
  update() {
    let emitterView = this.emitterView;

    emitterView.getColor(colorHeap);
    emitterView.getAlpha(alphaHeap);
    emitterView.getTextureSlot(slotHeap);

    let modelObject = this.emitter.modelObject;
    let dt = modelObject.model.viewer.frameTime * 0.001;
    let gravity = modelObject.gravity * dt * dt;
    let vertices = this.vertices;
    let animatedAlpha = alphaHeap[0];
    let animatedSlot = slotHeap[0];
    let chainLengthFactor = 1 / emitterView.ribbonCount;
    let locationInChain = (emitterView.currentRibbon - this.index - 1);

    this.health -= dt;

    vertices[1] -= gravity;
    vertices[4] -= gravity;
    vertices[7] -= gravity;
    vertices[10] -= gravity;

    if (this.health <= 0) {
      emitterView.ribbonCount--;
    } else {
      let columns = modelObject.dimensions[0];
      let left = (animatedSlot % columns) + (locationInChain * chainLengthFactor);
      let top = (animatedSlot / columns) | 0;
      let right = left + chainLengthFactor;
      let bottom = top + 1;

      left = (left * 255) | 0;
      top = (top * 255) | 0;
      right = (right * 255) | 0;
      bottom = (bottom * 255);
      animatedAlpha = (animatedAlpha * 255) | 0;

      this.lta = uint8ToUint24(left, top, animatedAlpha);
      this.lba = uint8ToUint24(left, bottom, animatedAlpha);
      this.rta = uint8ToUint24(right, top, animatedAlpha);
      this.rba = uint8ToUint24(right, bottom, animatedAlpha);
      this.rgb = uint8ToUint24((colorHeap[0] * 255) | 0, (colorHeap[1] * 255) | 0, (colorHeap[2] * 255) | 0); // Color even used???
    }
  }
}
