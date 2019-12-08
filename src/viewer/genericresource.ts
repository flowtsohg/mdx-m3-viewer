import Resource from './resource';

/**
 * A generic resource.
 */
export default class GenericResource extends Resource {
  data: any;

  constructor(resourceData: ResourceData) {
    super(resourceData);

    this.data = null;
  }

  load(data: any) {
    this.data = data;
  }
}
