import ModelInstance from '../../modelinstance';

/**
 * A simple model instance.
 */
export default class MdxSimpleInstance extends ModelInstance {
  /**
   * @override
   * @return {boolean}
   */
  isBatched() {
    return true;
  }
}
