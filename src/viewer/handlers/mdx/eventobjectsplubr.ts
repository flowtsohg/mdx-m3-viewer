import { vec3 } from 'gl-matrix';
import EmittedObject from '../../emittedobject';
import EventObjectEmitterObject from './eventobjectemitterobject';
import MdxModelInstance from './modelinstance';
import EventObjectSplEmitter from './eventobjectsplemitter';
import EventObjectUbrEmitter from './eventobjectubremitter';

const vertexHeap = vec3.create();

/**
 * An MDX splat or ubersplat object.
 */
export default class EventObjectSplUbr extends EmittedObject {
  vertices: Float32Array = new Float32Array(12);

  bind() {
    let emitter = <EventObjectSplEmitter | EventObjectUbrEmitter>this.emitter;
    let instance = <MdxModelInstance>emitter.instance;
    let emitterObject = <EventObjectEmitterObject>emitter.emitterObject;
    let vertices = this.vertices;
    let scale = emitterObject.scale;
    let node = instance.nodes[emitterObject.index];
    let worldMatrix = node.worldMatrix;

    this.health = emitterObject.lifeSpan;

    vertexHeap[0] = scale;
    vertexHeap[1] = scale;
    vec3.transformMat4(<vec3>vertices.subarray(0, 2), vertexHeap, worldMatrix);

    vertexHeap[0] = -scale;
    vertexHeap[1] = scale;
    vec3.transformMat4(<vec3>vertices.subarray(3, 5), vertexHeap, worldMatrix);

    vertexHeap[0] = -scale;
    vertexHeap[1] = -scale;
    vec3.transformMat4(<vec3>vertices.subarray(6, 8), vertexHeap, worldMatrix);

    vertexHeap[0] = scale;
    vertexHeap[1] = -scale;
    vec3.transformMat4(<vec3>vertices.subarray(9, 11), vertexHeap, worldMatrix);
  }

  update(dt: number) {
    this.health -= dt;
  }
}
