import { vec3, quat, mat4 } from "gl-matrix";
import mix from "../../mix";
import Skeleton from "../../skeleton";

// Heap allocations needed for this module.
let locationHeap = vec3.create(),
    rotationHeap = quat.create(),
    scaleHeap = vec3.create(),
    matrixHeap = mat4.create();

/**
 * @constructor
 * @extends {Skeleton}
 * @param {M3ModelInstance} instance
 */
function M3Skeleton(instance) {
    let model = instance.model,
        bones = model.bones,
        boneLookup = model.boneLookup;

    Skeleton.call(this, bones.length, instance);

    this.instance = instance;
    this.modelNodes = bones;
    this.initialReference = model.initialReference;
    this.sts = model.sts;
    this.stc = model.stc;
    this.stg = model.stg;
    this.boneLookup = boneLookup;
    
    // Set the bone parent references
    for (let i = 0, l = bones.length; i < l; i++) {
        this.nodes[i].setParent(this.getNode(bones[i].parent));
    }
}

M3Skeleton.prototype = {
    update() {
        let instance = this.instance;

        if (instance.bucket) {
            // Update the nodes.
            let nodes = this.nodes,
                modelNodes = this.modelNodes;

            for (let i = 0, l = nodes.length; i < l; i++) {
                let node = nodes[i],
                    modelNode = modelNodes[i],
                    location = this.getValue3(locationHeap, modelNode.location, instance),
                    rotation = this.getValue4(rotationHeap, modelNode.rotation, instance),
                    scale = this.getValue3(scaleHeap, modelNode.scale, instance);

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

                node.setTransformation(location, rotation, scale);
            }

            // Update the bone texture data.
            let sequence = instance.sequence,
                boneArray = instance.boneArray,
                initialReferences = this.initialReference,
                boneLookup = this.boneLookup,
                finalMatrix;

            if (sequence === -1) {
                finalMatrix = instance.worldMatrix;
            } else {
                finalMatrix = matrixHeap;

                mat4.identity(finalMatrix);
            }

            for (let i = 0, l = boneLookup.length; i < l; i++) {
                if (sequence !== -1) {
                    let bone = boneLookup[i];

                    mat4.multiply(finalMatrix, nodes[bone].worldMatrix, initialReferences[bone]);
                }

                let base = i * 16;

                boneArray[base] = finalMatrix[0];
                boneArray[base + 1] = finalMatrix[1];
                boneArray[base + 2] = finalMatrix[2];
                boneArray[base + 3] = finalMatrix[3];
                boneArray[base + 4] = finalMatrix[4];
                boneArray[base + 5] = finalMatrix[5];
                boneArray[base + 6] = finalMatrix[6];
                boneArray[base + 7] = finalMatrix[7];
                boneArray[base + 8] = finalMatrix[8];
                boneArray[base + 9] = finalMatrix[9];
                boneArray[base + 10] = finalMatrix[10];
                boneArray[base + 11] = finalMatrix[11];
                boneArray[base + 12] = finalMatrix[12];
                boneArray[base + 13] = finalMatrix[13];
                boneArray[base + 14] = finalMatrix[14];
                boneArray[base + 15] = finalMatrix[15];
                //boneArray.set(finalMatrix, i * 16);
            }

            instance.bucket.updateBoneTexture[0] = 1;
        }
    },

    getValueUnsafe(animRef, instance) {
        let sequence = instance.sequence;

        if (sequence !== -1) {
            return this.stg[sequence].getValueUnsafe(animRef, instance);
        }

        return animRef.initValue;
    },

    getValue(animRef, instance) {
        return this.getValueUnsafe(animRef, instance);
    },

    getValue2(out, animRef, instance) {
        let unsafeHeap = this.getValueUnsafe(animRef, instance);

        out[0] = unsafeHeap[0];
        out[1] = unsafeHeap[1];

        return out;
    },

    getValue3(out, animRef, instance) {
        let unsafeHeap = this.getValueUnsafe(animRef, instance);

        out[0] = unsafeHeap[0];
        out[1] = unsafeHeap[1];
        out[2] = unsafeHeap[2];

        return out;
    },

    getValue4(out, animRef, instance) {
        let unsafeHeap = this.getValueUnsafe(animRef, instance);

        out[0] = unsafeHeap[0];
        out[1] = unsafeHeap[1];
        out[2] = unsafeHeap[2];
        out[3] = unsafeHeap[3];

        return out;
    }
};

mix(M3Skeleton.prototype, Skeleton.prototype);

export default M3Skeleton;
