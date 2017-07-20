import { vec3, quat } from "gl-matrix";
import { mix } from "../../common";
import Skeleton from "../../skeleton";

/**
 * @constructor
 * @augments Skeleton
 * @param {MdxModelInstance} instance
 */
function MdxSkeleton(instance) {
    let model = instance.model,
        modelNodes = model.nodes,
        modelBones = model.bones,
        hierarchy = model.hierarchy,
        nodes,
        sortedNodes = [],
        bones = [];

    Skeleton.call(this, modelNodes.length, instance);

    // Not defined before the Skeleton constructor
    nodes = this.nodes;

    for (let i = 0, l = modelNodes.length; i < l; i++) {
        let node = nodes[i],
            modelNode = modelNodes[i];

        // Set the node pivots
        node.setPivot(modelNode.pivot);

        // Set the node parent references
        node.setParent(this.getNode(modelNode.parentId));

        // Node flags
        //node.dontInheritTranslation = modelNode.dontInheritTranslation;
        //node.dontInheritRotation = modelNode.dontInheritRotation;
        //node.dontInheritScaling = modelNode.dontInheritScaling;

        // The sorted version of the nodes, for straight iteration in update()
        sortedNodes[i] = nodes[hierarchy[i]];
    }

    // The sorted version of the bone references in the model, for straight iteration in updateHW()
    for (let i = 0, l = modelBones.length; i < l; i++) {
        bones[i] = nodes[modelBones[i].node.index];
    }

    this.modelNodes = model.sortedNodes;
    this.sortedNodes = sortedNodes;
    this.bones = bones;
    this.instance = instance;
}

MdxSkeleton.prototype = {
    update() {
        let instance = this.instance;

        // If this skeleton has no bone array, it means the owning instance is not visible.
        // Therefore, there is no point to update the nodes.
        if (instance.bucket) {
            let nodes = this.sortedNodes,
                modelNodes = this.modelNodes,
                bones = this.bones,
                boneArray = this.instance.boneArray;

            // Update the nodes
            for (let i = 0, l = nodes.length; i < l; i++) {
                let node = nodes[i],
                    modelNode = modelNodes[i],
                    translation = modelNode.getTranslation(instance),
                    rotation = modelNode.getRotation(instance),
                    scale = modelNode.getScale(instance);

                if (modelNode.billboarded) {
                    // Cancel the parent's rotation.
                    quat.copy(rotation, node.parent.inverseWorldRotation);

                    // Rotate inversly to the camera, so as to always face it.
                    quat.mul(rotation, rotation, instance.scene.camera.inverseWorldRotation);

                    // The coordinate systems are different between the handler and the viewer.
                    // Therefore, get to the viewer's coordinate system.
                    quat.rotateZ(rotation, rotation, Math.PI / 2);
                    quat.rotateY(rotation, rotation, -Math.PI / 2);
                }

                node.setTransformation(translation, rotation, scale);
            }

            // Update the bone texture.
            for (let i = 0, l = bones.length; i < l; i++) {
                let matrix = bones[i].worldMatrix,
                    base = 16 + i * 16;

                boneArray[base] = matrix[0];
                boneArray[base + 1] = matrix[1];
                boneArray[base + 2] = matrix[2];
                boneArray[base + 3] = matrix[3];
                boneArray[base + 4] = matrix[4];
                boneArray[base + 5] = matrix[5];
                boneArray[base + 6] = matrix[6];
                boneArray[base + 7] = matrix[7];
                boneArray[base + 8] = matrix[8];
                boneArray[base + 9] = matrix[9];
                boneArray[base + 10] = matrix[10];
                boneArray[base + 11] = matrix[11];
                boneArray[base + 12] = matrix[12];
                boneArray[base + 13] = matrix[13];
                boneArray[base + 14] = matrix[14];
                boneArray[base + 15] = matrix[15];
                //boneArray.set(bones[i].worldMatrix, i * 16 + 16);
            }

            this.instance.bucket.updateBoneTexture[0] = 1;
        }
    }
};

mix(MdxSkeleton.prototype, Skeleton.prototype);

export default MdxSkeleton;
