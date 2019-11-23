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

    /** @member {Float32Array} */
    this.vertices = new Float32Array(6);
    /** @member {Uint8Array} */
    this.color = new Uint8Array(4);
    /** @member {number} */
    this.slot = 0;
    /** @member {?Ribbon} */
    this.prev = null;
    /** @member {?Ribbon} */
    this.next = null;
  }

  /**
   * @override
   */
  bind() {
    let emitter = this.emitter;
    let instance = emitter.instance;
    let emitterObject = emitter.emitterObject;
    let node = instance.nodes[emitterObject.index];
    let [x, y, z] = node.pivot;
    let worldMatrix = node.worldMatrix;
    let vertices = this.vertices;

    this.health = emitter.emitterObject.lifeSpan;

    emitterObject.getHeightBelow(belowHeap, instance);
    emitterObject.getHeightAbove(aboveHeap, instance);

    belowHeap[1] = y - belowHeap[0];
    belowHeap[0] = x;
    belowHeap[2] = z;

    aboveHeap[1] = y + aboveHeap[0];
    aboveHeap[0] = x;
    aboveHeap[2] = z;

    vec3.transformMat4(belowHeap, belowHeap, worldMatrix);
    vec3.transformMat4(aboveHeap, aboveHeap, worldMatrix);

    vertices[0] = aboveHeap[0];
    vertices[1] = aboveHeap[1];
    vertices[2] = aboveHeap[2];
    vertices[3] = belowHeap[0];
    vertices[4] = belowHeap[1];
    vertices[5] = belowHeap[2];
  }

  /**
   * @override
   * @param {number} dt
   */
  update(dt) {
    this.health -= dt;

    if (this.health > 0) {
      let emitter = this.emitter;
      let instance = emitter.instance;
      let emitterObject = emitter.emitterObject;
      let color = this.color;
      let vertices = this.vertices;
      let gravity = emitterObject.gravity * dt * dt;

      emitterObject.getColor(colorHeap, instance);
      emitterObject.getAlpha(alphaHeap, instance);
      emitterObject.getTextureSlot(slotHeap, instance);

      vertices[1] -= gravity;
      vertices[4] -= gravity;

      color[0] = colorHeap[0] * 255;
      color[1] = colorHeap[1] * 255;
      color[2] = colorHeap[2] * 255;
      color[3] = alphaHeap[0] * 255;

      this.slot = slotHeap[0];
    }
  }
}
