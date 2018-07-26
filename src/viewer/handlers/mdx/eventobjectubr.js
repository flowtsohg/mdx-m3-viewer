import {vec3, vec4} from 'gl-matrix';
import {uint8ToUint24} from '../../../common/typecast';

/**
 * An MDX ubersplat object.
 */
export default class EventObjectUbr {
  /**
   * @param {MdxEventObjectEmitter} emitter
   */
  constructor(emitter) {
    this.emitter = emitter;
    this.emitterView = null;
    this.health = 0;
    this.color = new Uint8Array(4);
    this.vertices = new Float32Array(12);
    this.lta = 0;
    this.lba = 0;
    this.rta = 0;
    this.rba = 0;
    this.rgb = 0;
  }

  /**
   * @param {EventObjectEmitterView} emitterView
   */
  reset(emitterView) {
    let modelObject = this.emitter.modelObject;
    let vertices = this.vertices;
    let emitterScale = modelObject.scale;
    let node = emitterView.instance.nodes[modelObject.index];
    let worldMatrix = node.worldMatrix;
    let vertex;

    this.emitterView = emitterView;

    vertex = vertices.subarray(0, 2);
    vec3.transformMat4(vertex, [-emitterScale, -emitterScale, 0], worldMatrix);

    vertex = vertices.subarray(3, 5);
    vec3.transformMat4(vertex, [-emitterScale, emitterScale, 0], worldMatrix);

    vertex = vertices.subarray(6, 8);
    vec3.transformMat4(vertex, [emitterScale, emitterScale, 0], worldMatrix);

    vertex = vertices.subarray(9, 11);
    vec3.transformMat4(vertex, [emitterScale, -emitterScale, 0], worldMatrix);

    this.health = modelObject.lifespan;
  }

  /**
   *
   */
  update() {
    let modelObject = this.emitter.modelObject;
    let intervalTimes = modelObject.intervalTimes;
    let first = intervalTimes[0];
    let second = intervalTimes[1];
    let third = intervalTimes[2];
    let colors = modelObject.colors;
    let color = this.color;

    this.health -= modelObject.model.viewer.frameTime * 0.001;

    // Inverse of health
    let time = modelObject.lifespan - this.health;

    if (time < first) {
      vec4.lerp(color, colors[0], colors[1], time / first);
    } else if (time < first + second) {
      vec4.copy(color, modelObject.colors[1]);
    } else {
      vec4.lerp(color, colors[1], colors[2], (time - first - second) / third);
    }

    // Calculate the UV rectangle.
    let a = color[3];

    // Encode the UV rectangle and color in floats.
    // This is a shader optimization.
    this.lta = uint8ToUint24(1, 0, a);
    this.lba = uint8ToUint24(0, 0, a);
    this.rta = uint8ToUint24(1, 1, a);
    this.rba = uint8ToUint24(0, 1, a);
    this.rgb = uint8ToUint24(color[0], color[1], color[2]);
  }
}
