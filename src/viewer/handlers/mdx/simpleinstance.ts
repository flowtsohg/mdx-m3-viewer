import ModelInstance from '../../modelinstance';

/**
 * A simple model instance.
 */
export default class MdxSimpleInstance extends ModelInstance {
  isBatched() {
    return true;
  }
}
