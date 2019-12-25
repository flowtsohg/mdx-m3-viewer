import { vec3, quat, mat4 } from 'gl-matrix';
import ShaderProgram from '../../gl/program';
import Scene from '../../scene';
import { SkeletalNode, createSkeletalNodes } from '../../node';
import ModelInstance from '../../modelinstance';
import gltfHandler from './handler';
import GltfModel from './model';
import GltfBatch from './batch';

/**
 * A glTF model instance.
 */
export default class GltfInstance extends ModelInstance {
  nodes: SkeletalNode[] = [];

  load() {
    let model = <GltfModel>this.model;
    let modelNodes = model.nodes;
    let nodeCount = modelNodes.length;
    let sharedNodeData = createSkeletalNodes(nodeCount);

    this.nodes.push(...sharedNodeData.nodes);

    for (let scene of model.scenes) {
      for (let node of scene.nodes) {
        this.loadNode(node, -1);
      }
    }
  }

  loadNode(index: number, parent: number) {
    let model = <GltfModel>this.model;
    let modelNode = model.nodes[index];
    let nodes = this.nodes;
    let node = nodes[index];

    if (modelNode.translation !== undefined) {
      vec3.copy(node.localLocation, modelNode.translation);
    }

    if (modelNode.rotation !== undefined) {
      quat.copy(node.localRotation, modelNode.rotation);
    }

    if (modelNode.scale !== undefined) {
      vec3.copy(node.localScale, modelNode.scale);
    }

    if (modelNode.matrix !== undefined) {
      mat4.getTranslation(node.localLocation, modelNode.matrix);
      mat4.getRotation(node.localRotation, modelNode.matrix);
      mat4.getScaling(node.localScale, modelNode.matrix);
    }

    if (modelNode.camera !== undefined) {
      // Handle cameras.
    }

    if (modelNode.mesh !== undefined) {
      node.object = model.meshes[modelNode.mesh];
    }

    if (parent === -1) {
      node.parent = this;
    } else {
      node.parent = nodes[parent];
    }

    if (modelNode.children !== undefined) {
      for (let child of modelNode.children) {
        this.loadNode(child, index);
      }
    }
  }

  updateAnimations(dt: number) {
    let scene = <Scene>this.scene;

    for (let node of this.nodes) {
      node.recalculateTransformation(scene);
    }
  }

  renderOpaque() {
    let model = <GltfModel>this.model;

    for (let group of model.groups) {
      group.render(this);
    }
  }

  renderTranslucent() {

  }
}
