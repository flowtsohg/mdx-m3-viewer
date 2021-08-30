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
    let { worldLocation, worldRotation } = instance.nodes[emitterObject.index];

    this.health = emitterObject.lifeSpan;

    vec3.set(vertexHeap, scale, scale, 0);
    vec3.transformQuat(vertexHeap, vertexHeap, worldRotation);
    vec3.add(<vec3>vertices.subarray(0, 2), vertexHeap, worldLocation);

    vec3.set(vertexHeap, -scale, scale, 0);
    vec3.transformQuat(vertexHeap, vertexHeap, worldRotation);
    vec3.add(<vec3>vertices.subarray(3, 5), vertexHeap, worldLocation);

    vec3.set(vertexHeap, -scale, -scale, 0);
    vec3.transformQuat(vertexHeap, vertexHeap, worldRotation);
    vec3.add(<vec3>vertices.subarray(6, 8), vertexHeap, worldLocation);

    vec3.set(vertexHeap, scale, -scale, 0);
    vec3.transformQuat(vertexHeap, vertexHeap, worldRotation);
    vec3.add(<vec3>vertices.subarray(9, 11), vertexHeap, worldLocation);
  }

  update(dt: number) {
    this.health -= dt;
  }
}
