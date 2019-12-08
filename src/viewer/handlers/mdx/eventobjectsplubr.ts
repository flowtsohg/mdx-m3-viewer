import { vec3 } from 'gl-matrix';
import EmittedObject from '../../emittedobject';
import EventObjectSplEmitter from './eventobjectsplemitter';
import EventObjectUbrEmitter from './eventobjectubremitter';
import MdxComplexInstance from './complexinstance';

const vertexHeap = vec3.create();

/**
 * An MDX splat or ubersplat object.
 */
export default class EventObjectSplUbr extends EmittedObject {
  vertices: Float32Array;

  constructor(emitter: EventObjectSplEmitter | EventObjectUbrEmitter) {
    super(emitter);

    this.vertices = new Float32Array(12);
  }

  bind() {
    let emitter = this.emitter;
    let instance = <MdxComplexInstance>emitter.instance;
    let emitterObject = emitter.emitterObject;
    let vertices = this.vertices;
    let scale = emitterObject.scale;
    let node = instance.nodes[emitterObject.index];
    let worldMatrix = node.worldMatrix;

    this.health = emitterObject.lifeSpan;

    vertexHeap[0] = scale;
    vertexHeap[1] = scale;
    vertexHeap[2] = 0;
    vec3.transformMat4(<vec3>vertices.subarray(0, 2), vertexHeap, worldMatrix);

    vertexHeap[0] = -scale;
    vertexHeap[1] = scale;
    vertexHeap[2] = 0;
    vec3.transformMat4(<vec3>vertices.subarray(3, 5), vertexHeap, worldMatrix);

    vertexHeap[0] = -scale;
    vertexHeap[1] = -scale;
    vertexHeap[2] = 0;
    vec3.transformMat4(<vec3>vertices.subarray(6, 8), vertexHeap, worldMatrix);

    vertexHeap[0] = scale;
    vertexHeap[1] = -scale;
    vertexHeap[2] = 0;
    vec3.transformMat4(<vec3>vertices.subarray(9, 11), vertexHeap, worldMatrix);
  }

  update(dt: number) {
    this.health -= dt;
  }
}
