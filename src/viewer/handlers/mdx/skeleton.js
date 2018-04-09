import { vec3, quat } from 'gl-matrix';
import Skeleton from '../../skeleton';

export default class MdxSkeleton extends Skeleton {
    /**
     * @param {MdxModelInstance} instance
     */
    constructor(instance) {
        let model = instance.model,
            modelNodes = model.objects,
            modelBones = model.bones,
            hierarchy = model.hierarchy,
            nodes,
            sortedNodes = [],
            bones = [];

        super(modelNodes.length, instance);

        // Not defined before the Skeleton constructor
        nodes = this.nodes;

        /// TODO: HACK
        this.boneMatrices = new Float32Array(modelBones.length * 16);

        let boneIndex = 0;

        for (let i = 0, l = modelNodes.length; i < l; i++) {
            let node = nodes[i],
                modelNode = modelNodes[i];

            // Set the node pivots
            node.setPivot(modelNode.pivot);

            // Set the node parent references
            node.setParent(this.getNode(modelNode.parentId));

            node.object = modelNode;

            // Node flags
            //node.dontInheritTranslation = modelNode.dontInheritTranslation;
            //node.dontInheritRotation = modelNode.dontInheritRotation;
            //node.dontInheritScaling = modelNode.dontInheritScaling;

            // The sorted version of the nodes, for straight iteration in update()
            sortedNodes[i] = nodes[hierarchy[i]];

            if (modelBones.includes(modelNode)) {
                /// TODO: HACK
                node.worldMatrix = this.boneMatrices.subarray(boneIndex * 16, boneIndex * 16 + 16);

                bones[boneIndex++] = node;
            }
        }

        this.sortedNodes = sortedNodes;
        this.bones = bones;
        this.instance = instance;
    }

    update(forced) {
        let instance = this.instance;

        // If this skeleton has no bone array, it means the owning instance is not visible.
        // Therefore, there is no point to update the nodes.
        if (instance.bucket) {
            let nodes = this.sortedNodes,
                sequence = instance.sequence;

            // Update the nodes
            for (let i = 0, l = nodes.length; i < l; i++) {
                let node = nodes[i],
                    modelNode = node.object,
                    variants = modelNode.variants,
                    translation,
                    rotation,
                    scale;

                if (!(modelNode.attachment && node.children.length === 0)) {
                    //if (forced || variants.any[sequence] || node.parent.justUpdated) {
                    //    node.justUpdated = true;

                    // Translation
                    if (forced || variants.translation[sequence]) {
                        translation = modelNode.getTranslation(instance);
                    } else {
                        translation = node.localLocation;
                    }

                    // Rotation
                    if (forced || variants.rotation[sequence]) {
                        rotation = modelNode.getRotation(instance);
                    } else {
                        rotation = node.localRotation;
                    }

                    // Scale
                    if (forced || variants.scale[sequence]) {
                        scale = modelNode.getScale(instance);
                    } else {
                        scale = node.localScale;
                    }

                    // Billboarding
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

                    // Update the node
                    node.setTransformation(translation, rotation, scale);
                    //} else {
                    //    node.justUpdated = false;
                }
            }
        }
    }
};
