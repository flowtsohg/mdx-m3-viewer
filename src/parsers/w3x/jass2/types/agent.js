import JassHandle from './handle';

/**
 * type agent
 */
export default class JassAgent extends JassHandle {
  /**
   * @param {JassContext} jass
   */
  constructor(jass) {
    super(jass);

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
