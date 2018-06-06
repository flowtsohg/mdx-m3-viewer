import {quat} from 'gl-matrix';
import {createSkeletalNodes} from '../../node';
import Node from './node';

/**
 * M3 skeleton.
 */
export default class M3Skeleton {
  /**
   * @extends {Skeleton}
   * @param {M3ModelInstance} instance
   */
  constructor(instance) {
    let model = instance.model;
    let bones = model.bones;
    let boneLookup = model.boneLookup;
    let sharedNodeData = createSkeletalNodes(bones.length, Node);
    let nodes = sharedNodeData.nodes;

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
        nodes[i].parent = instance;
      } else {
        nodes[i].parent = nodes[bone.parent];
      }

      if (bone.billboard1) {
        nodes[i].billboarded = true;
      }
    }
  }

  /**
   *
   */
  update() {
    let instance = this.instance;
    let nodes = this.nodes;
    let modelNodes = this.modelNodes;

    for (let i = 0, l = nodes.length; i < l; i++) {
      let node = nodes[i];
      let modelNode = modelNodes[i];

      this.getValue4(node.localRotation, modelNode.rotation, instance);
      this.getValue3(node.localLocation, modelNode.location, instance);
      this.getValue3(node.localScale, modelNode.scale, instance);

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
}
