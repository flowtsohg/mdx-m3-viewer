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
  vertices = new Float32Array(12);

  bind(): void {
    const emitter = <EventObjectSplEmitter | EventObjectUbrEmitter>this.emitter;
    const instance = <MdxModelInstance>emitter.instance;
    const emitterObject = <EventObjectEmitterObject>emitter.emitterObject;
    const vertices = this.vertices;
    const scale = emitterObject.scale;
    const { worldLocation, worldRotation } = instance.nodes[emitterObject.index];

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

  update(dt: number): void {
    this.health -= dt;
  }
}
