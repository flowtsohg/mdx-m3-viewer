import JassHandle from './handle';

/**
 * type agent
 */
export default class JassAgent extends JassHandle {
  /**
   * @param {JassContext} jassContext
   */
  constructor(jassContext) {
    super(jassContext);

    /** @member {Set<JassReference>} */
    this.references = new Set();
  }

  /**
   * @param {JassReference} reference
   */
  addReference(reference) {
    this.references.add(reference);
  }

  /**
   * @param {JassReference} reference
   */
  removeReference(reference) {
    this.references.delete(reference);
  }
}
