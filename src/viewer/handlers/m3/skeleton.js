import { vec3, quat } from 'gl-matrix';
import { createSkeletalNodes } from '../../node';

// Heap allocations needed for this module.
let locationHeap = vec3.create(),
    rotationHeap = quat.create(),
    scaleHeap = vec3.create();

export default class M3Skeleton  {
    /**
     * @extends {Skeleton}
     * @param {M3ModelInstance} instance
     */
    constructor(instance) {
        let model = instance.model,
            bones = model.bones,
            boneLookup = model.boneLookup;

        let sharedNodeData = createSkeletalNodes(bones.length),
            nodes = sharedNodeData.nodes;

        this.nodes = nodes;
        this.instance = instance;
        this.modelNodes = bones;
        this.initialReference = model.initialReference;
        this.sts = model.sts;
        this.stc = model.stc;
        this.stg = model.stg;
        this.boneLookup = boneLookup;

        // Set the bone parent references
        for (let i = 0, l = bones.length; i < l; i++) {
            let bone = bones[i];

            if (bone.parent === -1) {
                nodes[i].setParent(instance);
            } else {
                nodes[i].setParent(nodes[bone.parent]);
            }
        }
    }

    update() {
        let instance = this.instance,
            nodes = this.nodes,
            modelNodes = this.modelNodes;

        for (let i = 0, l = nodes.length; i < l; i++) {
            let node = nodes[i],
                modelNode = modelNodes[i],
                location = this.getValue3(node.localLocation, modelNode.location, instance),
                rotation = this.getValue4(node.localRotation, modelNode.rotation, instance),
                scale = this.getValue3(node.localScale, modelNode.scale, instance);

            if (modelNode.billboard1) {
                // Cancel the parent's rotation.
                quat.copy(rotation, node.parent.inverseWorldRotation);

                // Rotate inversly to the camera, so as to always face it.
                quat.mul(rotation, rotation, instance.scene.camera.inverseWorldRotation);

                // The coordinate systems are different between the handler and the viewer.
                // Therefore, get to the viewer's coordinate system.
                quat.rotateZ(rotation, rotation, Math.PI / 2);
                quat.rotateY(rotation, rotation, -Math.PI / 2);
            }

            node.recalculateTransformation();

            node.updateChildren(instance.scene);
        }
    }

    getValueUnsafe(animRef, instance) {
        let sequence = instance.sequence;

        if (sequence !== -1) {
            return this.stg[sequence].getValueUnsafe(animRef, instance);
        }

        return animRef.initValue;
    }

    getValue(animRef, instance) {
        return this.getValueUnsafe(animRef, instance);
    }

    getValue2(out, animRef, instance) {
        let unsafeHeap = this.getValueUnsafe(animRef, instance);

        out[0] = unsafeHeap[0];
        out[1] = unsafeHeap[1];

        return out;
    }

    getValue3(out, animRef, instance) {
        let unsafeHeap = this.getValueUnsafe(animRef, instance);

        out[0] = unsafeHeap[0];
        out[1] = unsafeHeap[1];
        out[2] = unsafeHeap[2];

        return out;
    }

    getValue4(out, animRef, instance) {
        let unsafeHeap = this.getValueUnsafe(animRef, instance);

        out[0] = unsafeHeap[0];
        out[1] = unsafeHeap[1];
        out[2] = unsafeHeap[2];
        out[3] = unsafeHeap[3];

        return out;
    }
};
