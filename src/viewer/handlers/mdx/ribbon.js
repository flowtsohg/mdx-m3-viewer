import {vec3} from 'gl-matrix';
import EmittedObject from '../../emittedobject';

// Heap allocations needed for this module.
let belowHeap = vec3.create();
let aboveHeap = vec3.create();
let colorHeap = vec3.create();
let alphaHeap = new Float32Array(1);
let slotHeap = new Float32Array(1);

/**
 * A ribbon.
 */
export default class Ribbon extends EmittedObject {
  /**
   * @param {RibbonEmitter} emitter
   */
  constructor(emitter) {
    super(emitter);

    this.ribbonIndex = 0;
    this.vertices = new Float32Array(12);
    this.color = new Uint8Array(4);
    this.slot = 0;
  }

  /**
   * @override
   */
  bind() {
    let emitter = this.emitter;

    this.ribbonIndex = emitter.currentIndex++;
    this.health = emitter.emitterObject.lifeSpan;

    let currentRibbon = emitter.currentRibbon;

    // If this isn't the first ribbon, construct a quad.
    // Otherwise, the vertices will be filled with zeroes, and the ribbon will not render.
    // This allows the emitter to always work with quads.
    if (currentRibbon && currentRibbon.health > 0) {
      let instance = emitter.instance;
      let emitterObject = emitter.emitterObject;
      let node = instance.nodes[emitterObject.index];
      let [x, y, z] = node.pivot;
      let worldMatrix = node.worldMatrix;

      emitterObject.getHeightBelow(belowHeap, instance);
      emitterObject.getHeightAbove(aboveHeap, instance);

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
      let lastVertices = currentRibbon.vertices;

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
   * @override
   * @param {number} dt
   */
  update(dt) {
    let emitter = this.emitter;

    this.health -= dt;

    if (this.health > 0) {
      let instance = emitter.instance;
      let emitterObject = emitter.emitterObject;
      let color = this.color;

      emitterObject.getColor(colorHeap, instance);
      emitterObject.getAlpha(alphaHeap, instance);
      emitterObject.getTextureSlot(slotHeap, instance);

      color[0] = colorHeap[0] * 255;
      color[1] = colorHeap[1] * 255;
      color[2] = colorHeap[2] * 255;
      color[3] = alphaHeap[0] * 255;

      this.slot = slotHeap[0];

      let vertices = this.vertices;
      let gravity = emitterObject.gravity * dt * dt;

      vertices[1] -= gravity;
      vertices[4] -= gravity;
      vertices[7] -= gravity;
      vertices[10] -= gravity;
    } else {
      emitter.baseIndex += 1;
    }
  }
}
