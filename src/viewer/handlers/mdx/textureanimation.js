import { vec3, quat } from 'gl-matrix';
import { VEC3_ZERO, VEC3_ONE, QUAT_DEFAULT } from '../../../common/gl-matrix-addon';
import AnimatedObject from './animatedobject';

// Heap allocations needed for this module.
let translationHeap = vec3.create(),
    rotationHeap = quat.create(),
    scaleHeap = vec3.create();

export default class TextureAnimation extends AnimatedObject {
    getTranslation(instance) {
        return this.getValue3(translationHeap, 'KTAT', instance, VEC3_ZERO);
    }

    isTranslationVariant(sequence) {
        return this.isVariant('KTAT', sequence);
    }

    getRotation(instance) {
        return this.getValue4(rotationHeap, 'KTAR', instance, QUAT_DEFAULT);
    }

    isRotationVariant(sequence) {
        return this.isVariant('KTAR', sequence);
    }

    getScale(instance) {
        return this.getValue3(scaleHeap, 'KTAS', instance, VEC3_ONE);
    }

    isScaleVariant(sequence) {
        return this.isVariant('KTAS', sequence);
    }
};
