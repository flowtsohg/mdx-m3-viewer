import { Resource, ResourceData } from './resource';

/**
 * A generic resource.
 */
export default class GenericResource extends Resource {
  data: any = null;

  constructor(data: any, resourceData: ResourceData) {
    super(resourceData);

    this.data = data;
  }
}
