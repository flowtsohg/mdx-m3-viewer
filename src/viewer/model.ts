import { HandlerResource } from './handlerresource';
import Bounds from './bounds';
import ModelInstance from './modelinstance';

/**
 * A model.
 */
export default abstract class Model extends HandlerResource {
  bounds: Bounds = new Bounds();

  /**
   * Create the actual instance object and return it.
   * 
   * The given type can be used to select between instance classes, if there are more than one.
   */
  abstract addInstance(): ModelInstance;
}
