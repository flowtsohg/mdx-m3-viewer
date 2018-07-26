import {vec3, vec4} from 'gl-matrix';
import {lerp} from '../../../common/math';
import {uint8ToUint24} from '../../../common/typecast';

/**
 * An MDX splat object.
 */
export default class EventObjectSpl {
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
    let columns = modelObject.dimensions[0];
    let intervalTimes = modelObject.intervalTimes;
    let intervals = modelObject.intervals;
    let first = intervalTimes[0];
    let second = intervalTimes[1];
    let colors = modelObject.colors;
    let color = this.color;
    let factor;
    let interval;
    let firstColor;
    let index;

    this.health -= modelObject.model.viewer.frameTime * 0.001;

    // Inverse of health
    let time = modelObject.lifespan - this.health;

    if (time < first) {
      factor = time / first;
      interval = intervals[0];
      firstColor = 0;
    } else {
      factor = (time - first) / second;
      interval = intervals[1];
      firstColor = 1;
    }

    // Interpolated color
    vec4.lerp(color, colors[firstColor], colors[firstColor + 1], factor);

    // The texture portion to index
    index = Math.floor(lerp(interval[0], interval[1], factor));

    // Calculate the UV rectangle.
    let left = index % columns;
    let top = Math.floor(index / columns);
    let right = left + 1;
    let bottom = top + 1;
    let a = color[3];

    // Encode the UV rectangle and color in floats.
    // This is a shader optimization.
    this.lta = uint8ToUint24(right, bottom, a);
    this.lba = uint8ToUint24(left, bottom, a);
    this.rta = uint8ToUint24(right, top, a);
    this.rba = uint8ToUint24(left, top, a);
    this.rgb = uint8ToUint24(color[0], color[1], color[2]);
  }
}
