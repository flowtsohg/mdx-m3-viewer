import { M3ParserAnimationReference } from '../../../parsers/m3/animationreference';
import { createSkeletalNodes } from '../../node';
import Scene from '../../scene';
import Node from './node';
import M3ModelInstance from './modelinstance';
import M3Bone from './bone';
import M3Sts from './sts';
import M3Stc from './stc';
import M3Stg from './stg';
import M3Model from './model';

/**
 * M3 skeleton.
 */
export default class M3Skeleton {
  nodes: Node[];
  worldMatrices: Float32Array;
  instance: M3ModelInstance;
  modelNodes: M3Bone[];
  initialReference: Float32Array[];
  sts: M3Sts[];
  stc: M3Stc[];
  stg: M3Stg[];
  boneLookup: any;

  constructor(instance: M3ModelInstance) {
    let model = <M3Model>instance.model;
    let bones = model.bones;
    let boneLookup = model.boneLookup;
    let sharedNodeData = createSkeletalNodes(bones.length, Node);
    let nodes = sharedNodeData.nodes;

    this.nodes = nodes;
    this.worldMatrices = sharedNodeData.worldMatrices;
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
        nodes[i].parent = instance;
      } else {
        nodes[i].parent = nodes[bone.parent];
      }

      if (bone.billboard1) {
        nodes[i].billboarded = true;
      }
    }
  }

  update(dt: number) {
    let instance = this.instance;
    let scene = <Scene>instance.scene;
    let nodes = this.nodes;
    let modelNodes = this.modelNodes;

    for (let i = 0, l = nodes.length; i < l; i++) {
      let node = nodes[i];
      let modelNode = modelNodes[i];

      this.getValue4(<TypedArray>node.localRotation, modelNode.rotation, instance);
      this.getValue3(<TypedArray>node.localLocation, modelNode.location, instance);
      this.getValue3(<TypedArray>node.localScale, modelNode.scale, instance);

      node.recalculateTransformation(scene);
      node.updateChildren(dt, scene);
    }
  }

  getValueUnsafe(animRef: M3ParserAnimationReference, instance: M3ModelInstance) {
    let sequence = instance.sequence;

    if (sequence !== -1) {
      return this.stg[sequence].getValueUnsafe(animRef, instance);
    }

    return animRef.initValue;
  }

  getValue(animRef: M3ParserAnimationReference, instance: M3ModelInstance) {
    return this.getValueUnsafe(animRef, instance);
  }

  getValue2(out: TypedArray, animRef: M3ParserAnimationReference, instance: M3ModelInstance) {
    let unsafeHeap = this.getValueUnsafe(animRef, instance);

    out[0] = unsafeHeap[0];
    out[1] = unsafeHeap[1];

    return out;
  }

  getValue3(out: TypedArray, animRef: M3ParserAnimationReference, instance: M3ModelInstance) {
    let unsafeHeap = this.getValueUnsafe(animRef, instance);

    out[0] = unsafeHeap[0];
    out[1] = unsafeHeap[1];
    out[2] = unsafeHeap[2];

    return out;
  }

  getValue4(out: TypedArray, animRef: M3ParserAnimationReference, instance: M3ModelInstance) {
    let unsafeHeap = this.getValueUnsafe(animRef, instance);

    out[0] = unsafeHeap[0];
    out[1] = unsafeHeap[1];
    out[2] = unsafeHeap[2];
    out[3] = unsafeHeap[3];

    return out;
  }
}
