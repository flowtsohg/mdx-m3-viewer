import { vec3, quat } from 'gl-matrix';
import MdxSdContainer from './sd';

// Heap allocations needed for this module.
let translationHeap = vec3.create(),
    rotationHeap = quat.create(),
    scaleHeap = vec3.create();

export default class MdxTextureAnimation {
    /**
     * @param {MdxModel} model
     * @param {MdxParserTextureAnimation} textureAnimation
     */
    constructor(model, textureAnimation) {
        this.sd = new MdxSdContainer(model, textureAnimation.tracks);
    }

    getTranslation(instance) {
        return this.sd.getValue3(translationHeap, 'KTAT', instance, vec3.ZERO);
    }

    isTranslationVariant(sequence) {
        return this.sd.isVariant('KTAT', sequence);
    }

    getRotation(instance) {
        return this.sd.getValue4(rotationHeap, 'KTAR', instance, quat.DEFAULT);
    }

    getScale(instance) {
        return this.sd.getValue3(scaleHeap, 'KTAS', instance, vec3.ONE);
    }
};
