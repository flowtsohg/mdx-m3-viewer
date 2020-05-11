import Model from '../../parsers/mdlx/model';
import GenericObject from '../../parsers/mdlx/genericobject';
import Layer from '../../parsers/mdlx/layer';
import { getObjectTypeName, MdlxType } from './utils';

export interface SanityTestMessage {
  type: 'error' | 'severe' | 'warning' | 'unused';
  message: string;
}

export interface SanityTestNode {
  type: 'node';
  objectType: string;
  index?: number;
  errors: number;
  severe: number;
  warnings: number;
  unused: number;
  nodes: (SanityTestNode | SanityTestMessage)[];
  name?: string;
  uses?: number;
}


export default class SanityTestData {
  model: Model;
  objects: GenericObject[] = [];
  current: SanityTestNode;
  stack: SanityTestNode[];
  map: Map<MdlxType, SanityTestNode> = new Map();
  foundStand: boolean = false;
  foundDeath: boolean = false;

  constructor(model: Model) {
    this.model = model;
    this.current = { type: 'node', objectType: '', index: -1, errors: 0, severe: 0, warnings: 0, unused: 0, nodes: [] };
    this.stack = [this.current];

    this.addObjects(model.sequences);
    this.addObjects(model.globalSequences);
    this.addObjects(model.textures);
    this.addObjects(model.materials);
    this.addObjects(model.textureAnimations);
    this.addObjects(model.geosets);
    this.addObjects(model.geosetAnimations);
    this.addObjects(model.bones);
    this.addObjects(model.lights);
    this.addObjects(model.helpers);
    this.addObjects(model.attachments);
    this.addObjects(model.particleEmitters);
    this.addObjects(model.particleEmitters2);
    this.addObjects(model.particleEmittersPopcorn);
    this.addObjects(model.ribbonEmitters);
    this.addObjects(model.cameras);
    this.addObjects(model.eventObjects);
    this.addObjects(model.collisionShapes);
  }

  /**
   * Adds nodes for all of the given objects.
   * Also handles the flat array of generic objects.
   */
  addObjects(objects: MdlxType[]) {
    if (objects.length) {
      let objectType = getObjectTypeName(objects[0]);
      let areGeneric = objects[0] instanceof GenericObject;

      for (let i = 0, l = objects.length; i < l; i++) {
        let object = objects[i];
        let node = <SanityTestNode>{ type: 'node', objectType, index: i, errors: 0, severe: 0, warnings: 0, unused: 0, nodes: [] };

        if (typeof object !== 'number') {
          let name = object['path'] || object['name'];

          if (name) {
            node.name = name;
          }
        }

        if (!areGeneric) {
          node.uses = 0;
        }

        this.map.set(object, node);
      }

      if (areGeneric) {
        this.objects.push(...<GenericObject[]>objects);
      }
    }
  }

  /**
   * Pushes to the stack the node the given object maps to.
   * If this node does not exist, a new one will be created, which is used by internal nodes like material layers.
   */
  push(object: MdlxType, index: number) {
    let node = this.map.get(object);

    if (!node) {
      let objectType = getObjectTypeName(object);

      node = <SanityTestNode>{ type: 'node', objectType, errors: 0, severe: 0, warnings: 0, unused: 0, nodes: [] };

      // The code will reach this point for layers and animations.
      // It doesn't make sense to index animations, since any specific animation tag can only exist once in the same object.
      if (object instanceof Layer) {
        node.index = index;
      }
    }

    this.current.nodes.push(node);
    this.current = node;
    this.stack.unshift(node);
  }

  /**
   * Pops the current node from the stack.
   */
  pop() {
    this.stack.shift();
    this.current = this.stack[0];
  }

  /**
   * Adds a reference to the node the given object maps to.
   */
  addReference(object: MdlxType) {
    let data = <SanityTestNode>this.map.get(object);

    if (data.uses !== undefined) {
      data.uses += 1;
    }
  }

  /**
   * Add a reference to the current node.
   */
  addImplicitReference() {
    let data = this.current;

    if (data.uses !== undefined) {
      data.uses += 1;
    }
  }

  addAny(type: 'error' | 'severe' | 'warning' | 'unused', message: string) {
    this.current.nodes.push({ type, message });
  }

  addError(message: string) {
    this.addAny('error', message);

    for (let node of this.stack) {
      node.errors += 1;
    }
  }

  addSevere(message: string) {
    this.addAny('severe', message);

    for (let node of this.stack) {
      node.severe += 1;
    }
  }

  addWarning(message: string) {
    this.addAny('warning', message);

    for (let node of this.stack) {
      node.warnings += 1;
    }
  }

  addUnused(message: string) {
    this.addAny('unused', message);

    for (let node of this.stack) {
      node.unused += 1;
    }
  }

  assertError(condition: boolean, message: string) {
    if (!condition) {
      this.addError(message);
    }
  }

  assertSevere(condition: boolean, message: string) {
    if (!condition) {
      this.addSevere(message);
    }
  }

  assertWarning(condition: boolean, message: string) {
    if (!condition) {
      this.addWarning(message);
    }
  }

  assertUnused(condition: boolean, message: string) {
    if (!condition) {
      this.addUnused(message);
    }
  }
}
