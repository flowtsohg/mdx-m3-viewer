import { getRotationX, getRotationY, getRotationZ } from '../../../common/gl-matrix-addon';
import TexturedModelInstance from '../../texturedmodelinstance';
import { createSkeletalNodes } from '../../node';
import AttachmentInstance from './attachmentinstance';
import ParticleEmitterView from './particleemitterview';
import ParticleEmitter2View from './particleemitter2view';
import RibbonEmitterView from './ribbonemitterview';
import EventObjectEmitterView from './eventobjectemitterview';

export default class ModelInstance extends TexturedModelInstance {
    /**
     * @param {MdxModel} model
     */
    constructor(model) {
        super(model);

        this.attachments = [];
        this.particleEmitters = [];
        this.particleEmitters2 = [];
        this.ribbonEmitters = [];
        this.eventObjectEmitters = [];
        this.nodes = [];
        this.sortedNodes = [];

        this.frame = 0;
        this.counter = 0; // Global sequences
        this.sequence = -1;
        this.sequenceLoopMode = 0;

        this.teamColor = 0;
        this.vertexColor = new Uint8Array([255, 255, 255, 255]);

        this.allowParticleSpawn = false; // Particles do not spawn when the sequence is -1, or when the sequence finished and it's not repeating

        // If forced is true, everything will update regardless of variancy.
        // Any later non-forced update can then use variancy to skip updating things.
        // It is set to true every time the sequence is set with setSequence().
        this.forced = true;
    }

    load() {
        let model = this.model,
            geosetCount = model.geosets.length,
            layerCount = model.layers.length;

        this.geosetColors = new Uint8Array(geosetCount * 4);
        this.layerAlphas = new Uint8Array(layerCount);
        this.uvOffsets = new Float32Array(layerCount * 4);
        this.uvScales = new Float32Array(layerCount);
        this.uvRots = new Float32Array(layerCount * 2);

        // Create the needed amount of shared nodes.
        let sharedNodeData = createSkeletalNodes(model.genericObjects.length),
            nodes = sharedNodeData.nodes,
            nodeIndex = 0;

        this.nodes.push(...nodes);

        // A shared typed array for all world matrices of the internal nodes.
        this.worldMatrices = sharedNodeData.worldMatrices;

        // And now initialize all of the nodes and objects
        for (let bone of model.bones) {
            this.initNode(nodes, nodes[nodeIndex++], bone);
        }

        for (let light of model.lights) {
            this.initNode(nodes, nodes[nodeIndex++], light);
        }

        for (let helper of model.helpers) {
            this.initNode(nodes, nodes[nodeIndex++], helper);
        }

        for (let attachment of model.attachments) {
            let attachmentInstance;

            // Attachments may have game models attached to them, such as Undead and Nightelf building animations.
            if (attachment.internalModel) {
                attachmentInstance = new AttachmentInstance(this, attachment);

                this.attachments.push(attachmentInstance);
            }

            this.initNode(nodes, nodes[nodeIndex++], attachment, attachmentInstance);
        }

        for (let emitter of model.particleEmitters) {
            let emitterView = new ParticleEmitterView(this, emitter);

            this.particleEmitters.push(emitterView);

            this.initNode(nodes, nodes[nodeIndex++], emitter, emitterView);
        }

        for (let emitter of model.particleEmitters2) {
            let emitterView = new ParticleEmitter2View(this, emitter);

            this.particleEmitters2.push(emitterView);

            this.initNode(nodes, nodes[nodeIndex++], emitter, emitterView);
        }

        for (let emitter of model.ribbonEmitters) {
            let emitterView = new RibbonEmitterView(this, emitter);

            this.ribbonEmitters.push(emitterView);

            this.initNode(nodes, nodes[nodeIndex++], emitter, emitterView);
        }

        for (let camera of model.cameras) {
            this.initNode(nodes, nodes[nodeIndex++], camera);
        }

        for (let emitter of model.eventObjects) {
            let emitterView = new EventObjectEmitterView(this, emitter);

            this.eventObjectEmitters.push(emitterView);

            this.initNode(nodes, nodes[nodeIndex++], emitter, emitterView);
        }

        for (let collisionShape of model.collisionShapes) {
            this.initNode(nodes, nodes[nodeIndex++], collisionShape);
        }

        // Save a sorted array of all of the nodes, such that every child node comes after its parent.
        // This allows for flat iteration when updating.
        let hierarchy = model.hierarchy;

        for (let i = 0, l = nodes.length; i < l; i++) {
            this.sortedNodes[i] = nodes[hierarchy[i]];
        }

        // If the sequence was changed before the model was loaded, reset it now that the model loaded.
        this.setSequence(this.sequence);
    }

    initNode(nodes, node, genericObject, object) {
        node.setPivot(genericObject.pivot);

        if (genericObject.parentId === -1) {
            node.setParent(this);
        } else {
            node.setParent(nodes[genericObject.parentId]);
        }

        if (object) {
            node.object = object;
        }
    }

    /**
     * Overriden to hide also attachment models.
     */
    hide() {
        super.hide();

        for (let attachment of this.attachments) {
            attachment.internalInstance.hide();
        }
    }

    /**
     * Overriden to show also attachment models.
     */
    show() {
        super.show();

        for (let attachment of this.attachments) {
            attachment.internalInstance.show();
        }
    }

    /**
     * Updates the animation timers.
     * Emits a 'seqend' event every time a sequence ends.
     */
    updateTimers() {
        if (this.sequence !== -1) {
            let model = this.model,
                sequence = model.sequences[this.sequence],
                interval = sequence.interval,
                frameTime = model.viewer.frameTime;

            this.frame += frameTime;
            this.counter += frameTime;
            this.allowParticleSpawn = true;

            if (this.frame >= interval[1]) {
                if (this.sequenceLoopMode === 2 || (this.sequenceLoopMode === 0 && sequence.flags === 0)) {
                    this.frame = interval[0];

                    this.resetEventEmitters();
                } else {
                    this.frame = interval[1];
                    this.counter -= frameTime;
                    this.allowParticleSpawn = false;
                }

                this.dispatchEvent({ type: 'seqend' });
            }
        }
    }

    // Updates all of this instance internal nodes and objects.
    // Nodes that are determined to not be visible will not be updated, nor will any of their children down the hierarchy.
    updateNodes(forced) {
        let sortedNodes = this.sortedNodes,
            sequence = this.sequence,
            sortedGenericObjects = this.model.sortedGenericObjects,
            scene = this.scene;

        // Update the nodes
        for (let i = 0, l = sortedNodes.length; i < l; i++) {
            let genericObject = sortedGenericObjects[i],
                node = sortedNodes[i],
                parent = node.parent,
                objectVisible = genericObject.getVisibility(this) >= 0.75,
                nodeVisible = forced || (parent.visible && objectVisible);

            node.visible = nodeVisible;

            // Every node only needs to be updated if this is a forced update, or if both the parent node and the generic object corresponding to this node are visible.
            // Incoming messy code for optimizations!
            if (nodeVisible) {
                let wasDirty = false,
                    variants = genericObject.variants,
                    localLocation = node.localLocation,
                    localRotation = node.localRotation,
                    localScale = node.localScale;

                // Only update the local node data if there is a need to
                if (forced || variants.generic[sequence]) {
                    wasDirty = true;

                    // Translation
                    if (forced || variants.translation[sequence]) {
                        let translation = genericObject.getTranslation(this);

                        localLocation[0] = translation[0];
                        localLocation[1] = translation[1];
                        localLocation[2] = translation[2];
                    }

                    // Rotation
                    if (forced || variants.rotation[sequence]) {
                        let rotation = genericObject.getRotation(this);

                        localRotation[0] = rotation[0];
                        localRotation[1] = rotation[1];
                        localRotation[2] = rotation[2];
                        localRotation[3] = rotation[3];
                    }

                    // Scale
                    if (forced || variants.scale[sequence]) {
                        let scale = genericObject.getScale(this);

                        localScale[0] = scale[0];
                        localScale[1] = scale[1];
                        localScale[2] = scale[2];
                    }
                }

                // Handle billboarding.
                if (genericObject.anyBillboarding) {
                    wasDirty = true;

                    /// TODO: Not sure if this is correct for the axis specific billboarding.
                    quat.copy(localRotation, parent.inverseWorldRotation);

                    let cameraInverseWorldRotation = scene.camera.inverseWorldRotation,
                        halfPI = Math.PI / 2;

                    // Full billboarding or axis specific billboarding.
                    if (genericObject.billboarded) {
                        // Rotate inversly to the camera, so as to always face it.
                        quat.mul(localRotation, localRotation, cameraInverseWorldRotation);

                        // The coordinate systems are different between the handler and the viewer.
                        // Therefore, get to the viewer's coordinate system.
                        quat.rotateZ(localRotation, localRotation, halfPI);
                        quat.rotateY(localRotation, localRotation, -halfPI);
                    } else {
                        if (genericObject.billboardedX) {
                            /// TODO: Not sure if this is correct
                            quat.rotateX(localRotation, localRotation, getRotationX(cameraInverseWorldRotation) - halfPI);
                        }

                        if (genericObject.billboardedY) {
                            /// TODO: Not sure if this is correct
                            quat.rotateY(localRotation, localRotation, getRotationY(cameraInverseWorldRotation) - halfPI);
                        }

                        if (genericObject.billboardedZ) {
                            // Rotate inversly to the camera on the Z axis, and move to the viewer's coordinate system.
                            quat.rotateZ(localRotation, localRotation, getRotationZ(cameraInverseWorldRotation) - halfPI);
                        }
                    }
                }

                let wasReallyDirty = forced || wasDirty || parent.wasDirty;

                node.wasDirty = wasReallyDirty;

                // If this is a forced update, or this node's local data was updated, or the parent node was updated, do a full world update.
                if (wasReallyDirty) {
                    node.recalculateTransformation();
                }

                // If there is an instance object associated with this node, and the node is visible (which might not be the case for a forced update!), update the object.
                // This includes attachments and emitters.
                let object = node.object;

                if (object && objectVisible) {
                    object.update();
                }

                // Update all of the node's non-skeletal children, which will update their children, and so on.
                node.updateChildren(scene);
            }
        }
    }

    // Update the batch data.
    updateBatches(forced) {
        let model = this.model,
            geosets = model.geosets,
            layers = model.layers,
            geosetColors = this.geosetColors,
            layerAlphas = this.layerAlphas,
            uvOffsets = this.uvOffsets,
            uvScales = this.uvScales,
            uvRots = this.uvRots,
            sequence = this.sequence;

        // Geosets
        for (let i = 0, l = geosets.length; i < l; i++) {
            let geoset = geosets[i],
                offset = i * 4;

            // Color
            if (forced || geoset.variants.color[sequence]) {
                let color = geoset.getColor(this);

                geosetColors[offset] = color[0] * 255;
                geosetColors[offset + 1] = color[1] * 255;
                geosetColors[offset + 2] = color[2] * 255;
            }

            // Alpha
            if (forced || geoset.variants.alpha[sequence]) {
                geosetColors[offset + 3] = geoset.getAlpha(this) * 255;
            }
        }

        // Layers
        for (let i = 0, l = layers.length; i < l; i++) {
            let layer = layers[i],
                i2 = i * 2,
                i4 = i * 4;

            // Alpha
            if (forced || layer.variants.alpha[sequence]) {
                layerAlphas[i] = layer.getAlpha(this) * 255;
            }

            // UV translation animation
            if (forced || layer.variants.translation[sequence]) {
                let translation = layer.getTranslation(this);

                uvOffsets[i4] = translation[0];
                uvOffsets[i4 + 1] = translation[1];
            }

            // UV rotation animation
            if (forced || layer.variants.rotation[sequence]) {
                let rotation = layer.getRotation(this);

                uvRots[i2] = rotation[2];
                uvRots[i2 + 1] = rotation[3];
            }

            // UV scale animation
            if (forced || layer.variants.scale[sequence]) {
                let scale = layer.getScale(this);

                uvScales[i] = scale[0];
            }

            // Sprite animation
            if (forced || layer.variants.slot[sequence]) {
                let uvDivisor = layer.uvDivisor,
                    textureId = layer.getTextureId(this);

                uvOffsets[i4 + 2] = textureId % uvDivisor[0];
                uvOffsets[i4 + 3] = (textureId / uvDivisor[1]) | 0;
            }
        }
    }

    updateAnimations() {
        let forced = this.forced;

        if (forced || this.sequence !== -1) {
            this.forced = false;

            // Update the nodes
            this.updateNodes(forced);

            // Update the batches
            this.updateBatches(forced);
        }
    }

    setTeamColor(id) {
        this.teamColor = id;

        return this;
    }

    setVertexColor(color) {
        this.vertexColor.set(color);

        return this;
    }

    setSequence(id) {
        this.sequence = id;

        if (this.model.loaded) {
            let sequences = this.model.sequences;

            if (id < 0 || id > sequences.length - 1) {
                this.sequence = -1;
                this.frame = 0;
                this.allowParticleSpawn = false;
            } else {
                this.frame = sequences[id].interval[0];
            }

            this.resetEventEmitters();

            this.forced = true;
        }

        return this;
    }

    setSequenceLoopMode(mode) {
        this.sequenceLoopMode = mode;

        return this;
    }

    getAttachment(id) {
        let attachment = this.model.attachments[id];

        if (attachment) {
            return this.nodes[attachment.index];
        }
    }

    // Event emitters depend on keyframe index changes to emit, rather than only values.
    // To work, they need to check what the last keyframe was, and only if it's a different one, do something.
    // When changing sequences, these states need to be reset, so they can immediately emit things if needed.
    resetEventEmitters() {
        for (let eventEmitterView of this.eventObjectEmitters) {
            eventEmitterView.reset();
        }
    }
};
