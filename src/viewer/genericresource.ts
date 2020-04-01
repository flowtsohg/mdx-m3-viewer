import { Resource } from './resource';

/**
 * A generic resource.
 */
export default class GenericResource extends Resource {
  data: any = null;

  load(data: any) {
    this.data = data;
  }
}
