import ModelInstance from '../../modelinstance';

/**
 * An OBJ model instance.
 */
export default class ObjModelInstance extends ModelInstance {
  /**
   *
   */
  load() {
    // Let's give every instance its own color!
    this.color = new Float32Array([Math.random(), Math.random(), Math.random()]);
  }

  /**
   *
   */
  updateAnimations() {

  }
}
