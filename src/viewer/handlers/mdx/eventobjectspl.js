import { vec3, vec4 } from 'gl-matrix';
import { lerp } from '../../../common/math';
import { uint8ToUint24 } from '../../../common/typecast';

export default class EventObjectSpl {
    /**
     * @param {MdxEventObjectEmitter} emitter
     */
    constructor(emitter) {
        this.emitter = emitter;
        this.health = 0;
        this.color = new Uint8Array(4);
        this.vertices = new Float32Array(12);
        this.lta = 0;
        this.lba = 0;
        this.rta = 0;
        this.rba = 0;
        this.rgb = 0;
    }

    reset(emitterView) {
        let modelObject = this.emitter.modelObject,
            vertices = this.vertices,
            emitterScale = modelObject.scale,
            node = emitterView.instance.nodes[modelObject.index],
            worldMatrix = node.worldMatrix,
            vertex;

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

    update() {
        let modelObject = this.emitter.modelObject,
            columns = modelObject.dimensions[0],
            intervalTimes = modelObject.intervalTimes,
            intervals = modelObject.intervals,
            first = intervalTimes[0],
            second = intervalTimes[1],
            colors = modelObject.colors,
            color = this.color,
            factor,
            interval,
            firstColor,
            index;

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
        let left = index % columns,
            top = Math.floor(index / columns),
            right = left + 1,
            bottom = top + 1,
            a = color[3];

        // Encode the UV rectangle and color in floats.
        // This is a shader optimization.
        this.lta = uint8ToUint24(right, bottom, a);
        this.lba = uint8ToUint24(left, bottom, a);
        this.rta = uint8ToUint24(right, top, a);
        this.rba = uint8ToUint24(left, top, a);
        this.rgb = uint8ToUint24(color[0], color[1], color[2]);
    }
};
