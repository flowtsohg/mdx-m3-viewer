import { vec3, quat } from 'gl-matrix';
import { VEC3_ZERO, VEC3_ONE, QUAT_DEFAULT } from '../../../common/gl-matrix-addon';
import AnimatedObject from './animatedobject';

// Heap allocations needed for this module.
let translationHeap = vec3.create(),
    rotationHeap = quat.create(),
    scaleHeap = vec3.create();

export default class GenericObject extends AnimatedObject {
    /**
     * @param {MdxModel} model
     * @param {MdxParserNode} node
     * @param {Array<MdxParserPivot>} pivots
     */
    constructor(model, object, pivotPoints, index) {
        super(model, object);

        this.index = index;
        this.name = object.name;
        this.objectId = object.objectId;
        this.parentId = object.parentId;
        this.pivot = pivotPoints[object.objectId] || vec3.create();

        let flags = object.flags;

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

        this.anyBillboarding = this.billboarded || this.billboardedX || this.billboardedY || this.billboardedZ;

        if (object.objectId === object.parentId) {
            this.parentId = -1;
        }

        let variants = {
            translation: [],
            rotation: [],
            scale: [],
            generic: []
        };

        for (let i = 0, l = model.sequences.length; i < l; i++) {
            let translation = this.isTranslationVariant(i),
                rotation = this.isRotationVariant(i),
                scale = this.isScaleVariant(i);

            variants.translation[i] = translation;
            variants.rotation[i] = rotation;
            variants.scale[i] = scale;
            variants.generic[i] = translation || rotation || scale;
        }

        this.variants = variants;
    }

    getTranslation(instance) {
        return this.getValue3(translationHeap, 'KGTR', instance, VEC3_ZERO);
    }

    getRotation(instance) {
        return this.getValue4(rotationHeap, 'KGRT', instance, QUAT_DEFAULT);
    }

    getScale(instance) {
        return this.getValue3(scaleHeap, 'KGSC', instance, VEC3_ONE);
    }

    isTranslationVariant(sequence) {
        return this.isVariant('KGTR', sequence);
    }

    isRotationVariant(sequence) {
        return this.isVariant('KGRT', sequence);
    }

    isScaleVariant(sequence) {
        return this.isVariant('KGSC', sequence);
    }

    // Many of the generic objects have animated visibilities.
    // This is a generic getter to allow the code to be consistent.
    getVisibility(instance) {
        return 1;
    }
};
