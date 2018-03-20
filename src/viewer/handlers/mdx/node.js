import { vec3, quat } from 'gl-matrix';
import MdxSdContainer from './sd';

// Heap allocations needed for this module.
let translationHeap = vec3.create(),
    rotationHeap = quat.create(),
    scaleHeap = vec3.create();

export default class MdxNode {
    /**
     * @param {MdxModel} model
     * @param {MdxParserNode} node
     * @param {Array<MdxParserPivot>} pivots
     */
    constructor(model, node, pivots) {
        let pivot = pivots[node.objectId],
            flags = node.flags;

        this.index = node.index;
        this.name = node.name;
        this.objectId = node.objectId;
        this.parentId = node.parentId;
        this.pivot = pivot ? pivot.value : vec3.create();
        this.sd = new MdxSdContainer(model, node.tracks);

        this.dontInheritTranslation = flags & 0x1;
        this.dontInheritRotation = flags & 0x2;
        this.dontInheritScaling = flags & 0x4;
        this.billboarded = flags & 0x8;
        this.billboardedX = flags & 0x10;
        this.billboardedY = flags & 0x20;
        this.billboardedZ = flags & 0x40;
        this.cameraAnchored = flags & 0x80;
        this.bone = flags & 0x100;
        this.light = flags & 0x200;
        this.eventObject = flags & 0x400;
        this.attachment = flags & 0x800;
        this.particleEmitter = flags & 0x1000;
        this.collisionShape = flags & 0x2000;
        this.ribbonEmitter = flags & 0x4000;
        this.emitterUsesMdlOrUnshaded = flags & 0x8000;
        this.emitterUsesTgaOrSortPrimitivesFarZ = flags & 0x10000;
        this.lineEmitter = flags & 0x20000;
        this.unfogged = flags & 0x40000;
        this.modelSpace = flags & 0x80000;
        this.xYQuad = flags & 0x100000;

        if (node.objectId === node.parentId) {
            this.parentId = -1;
        }

        let variants = {
            translation: [],
            rotation: [],
            scale: [],
            any: []
        };

        for (let i = 0, l = model.sequences.length; i < l; i++) {
            let translation = this.isTranslationVariant(i),
                rotation = this.isRotationVariant(i),
                scale = this.isScaleVariant(i),
                any = translation || rotation || scale;

            variants.translation[i] = translation;
            variants.rotation[i] = rotation;
            variants.scale[i] = scale;
            variants.any[i] = any;
        }

        this.variants = variants;
    }

    getTranslation(instance) {
        return this.sd.getValue3(translationHeap, 'KGTR', instance, vec3.ZERO);
    }

    getRotation(instance) {
        return this.sd.getValue4(rotationHeap, 'KGRT', instance, quat.DEFAULT);
    }

    getScale(instance) {
        return this.sd.getValue3(scaleHeap, 'KGSC', instance, vec3.ONE);
    }

    isTranslationVariant(sequence) {
        return this.sd.isVariant('KGTR', sequence);
    }

    isRotationVariant(sequence) {
        return this.sd.isVariant('KGRT', sequence);
    }

    isScaleVariant(sequence) {
        return this.sd.isVariant('KGSC', sequence);
    }
};
