import { vec3, quat } from 'gl-matrix';
import GenericObject from './genericobject';

// Heap allocations needed for this module.
let translationHeap = vec3.create(),
    rotationHeap = quat.create(),
    scaleHeap = vec3.create();

export default class TextureAnimation extends GenericObject {
    getTranslation(instance) {
        return this.getValue3(translationHeap, 'KTAT', instance, vec3.ZERO);
    }

    isTranslationVariant(sequence) {
        return this.isVariant('KTAT', sequence);
    }

    getRotation(instance) {
        return this.getValue4(rotationHeap, 'KTAR', instance, quat.DEFAULT);
    }

    getScale(instance) {
        return this.getValue3(scaleHeap, 'KTAS', instance, vec3.ONE);
    }
};
