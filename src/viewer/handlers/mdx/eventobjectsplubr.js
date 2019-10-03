import {vec3} from 'gl-matrix';
import {FLOATS_PER_OBJECT, FLOAT_OFFSET_P0, FLOAT_OFFSET_HEALTH} from './geometryemitter';

const vertexHeap = vec3.create();

/**
 * An MDX splat or ubersplat object.
 */
export default class EventObjectSplUbr {
  /**
   * @param {EventObjectSplEmitter|EventObjectUbrEmitter} emitter
   */
  constructor(emitter) {
    this.emitter = emitter;
    this.emitterView = null;
    this.health = 0;
    this.vertices = new Float32Array(12);
  }

  /**
   * @param {EventObjectEmitterView} emitterView
   */
  bind(emitterView) {
    let modelObject = this.emitter.modelObject;
    let vertices = this.vertices;
    let scale = modelObject.scale;
    let node = emitterView.instance.nodes[modelObject.index];
    let worldMatrix = node.worldMatrix;

    this.emitterView = emitterView;
    this.health = modelObject.lifeSpan;

    // Note that the order here isn't the same as particles/ribbons.
    vertexHeap[0] = scale;
    vertexHeap[1] = scale;
    vertexHeap[2] = 0;
    vec3.transformMat4(vertices.subarray(0, 2), vertexHeap, worldMatrix);

    vertexHeap[0] = -scale;
    vertexHeap[1] = scale;
    vertexHeap[2] = 0;
    vec3.transformMat4(vertices.subarray(3, 5), vertexHeap, worldMatrix);

    vertexHeap[0] = -scale;
    vertexHeap[1] = -scale;
    vertexHeap[2] = 0;
    vec3.transformMat4(vertices.subarray(6, 8), vertexHeap, worldMatrix);

    vertexHeap[0] = scale;
    vertexHeap[1] = -scale;
    vertexHeap[2] = 0;
    vec3.transformMat4(vertices.subarray(9, 11), vertexHeap, worldMatrix);
  }

  /**
   * @param {number} offset
   * @param {number} dt
   */
  render(offset, dt) {
    this.health -= dt;

    if (this.health > 0) {
      let emitter = this.emitter;
      let floatView = emitter.floatView;
      let floatOffset = offset * FLOATS_PER_OBJECT;
      let p0Offset = floatOffset + FLOAT_OFFSET_P0;
      let vertices = this.vertices;

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

      floatView[floatOffset + FLOAT_OFFSET_HEALTH] = this.health;
    }
  }
}
