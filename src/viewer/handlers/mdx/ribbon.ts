import { vec3 } from 'gl-matrix';
import EmittedObject from '../../emittedobject';
import RibbonEmitterObject from './ribbonemitterobject';
import MdxModelInstance from './modelinstance';
import RibbonEmitter from './ribbonemitter';

const belowHeap = vec3.create();
const aboveHeap = vec3.create();
const colorHeap = new Float32Array(3);
const alphaHeap = new Float32Array(1);
const slotHeap = new Uint32Array(1);

/**
 * A ribbon.
 */
export default class Ribbon extends EmittedObject {
  vertices: Float32Array = new Float32Array(6);
  color: Uint8Array = new Uint8Array(4);
  slot: number = 0;
  prev: Ribbon | null = null;
  next: Ribbon | null = null;

  bind() {
    let emitter = <RibbonEmitter>this.emitter;
    let instance = <MdxModelInstance>emitter.instance;
    let sequence = instance.sequence;
    let frame = instance.frame;
    let counter = instance.counter;
    let emitterObject = <RibbonEmitterObject>emitter.emitterObject;
    let node = instance.nodes[emitterObject.index];
    let [x, y, z] = node.pivot;
    let worldMatrix = node.worldMatrix;
    let vertices = this.vertices;

    this.health = emitter.emitterObject.lifeSpan;

    emitterObject.getHeightBelow(<Float32Array>belowHeap, sequence, frame, counter);
    emitterObject.getHeightAbove(<Float32Array>aboveHeap, sequence, frame, counter);

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

  update(dt: number) {
    this.health -= dt;

    if (this.health > 0) {
      let emitter = <RibbonEmitter>this.emitter;
      let instance = <MdxModelInstance>emitter.instance;
      let sequence = instance.sequence;
      let frame = instance.frame;
      let counter = instance.counter;
      let emitterObject = <RibbonEmitterObject>emitter.emitterObject;
      let color = this.color;
      let vertices = this.vertices;
      let gravity = emitterObject.gravity * dt * dt;

      emitterObject.getColor(colorHeap, sequence, frame, counter);
      emitterObject.getAlpha(alphaHeap, sequence, frame, counter);
      emitterObject.getTextureSlot(slotHeap, sequence, frame, counter);

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
