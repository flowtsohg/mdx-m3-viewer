import Model from './model';
import { Resource } from './resource';

/**
 * A resource mapper.
 */
export default class ResourceMapper {
  model: Model;
  resources: Map<number, Resource>;

  constructor(model: Model, resources?: Map<number, Resource>) {
    let map;

    if (resources) {
      map = new Map(resources);
    } else {
      map = new Map();
    }

    this.model = model;
    this.resources = map;
  }

  get(index: number) {
    return this.resources.get(index);
  }
}
