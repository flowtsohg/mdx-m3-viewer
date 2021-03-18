import { HandlerResource } from './handlerresource';
import Bounds from './bounds';
import ModelInstance from './modelinstance';

/**
 * A model.
 */
export default abstract class Model extends HandlerResource {
  bounds: Bounds = new Bounds();

  /**
   * Create a new instance and return it.
   */
  abstract addInstance(): ModelInstance;
}
