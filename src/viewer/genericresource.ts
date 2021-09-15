import { Resource, ResourceData } from './resource';

/**
 * A generic resource.
 */
export default class GenericResource extends Resource {
  data: unknown = null;

  constructor(data: unknown, resourceData: ResourceData) {
    super(resourceData);

    this.data = data;
  }
}
