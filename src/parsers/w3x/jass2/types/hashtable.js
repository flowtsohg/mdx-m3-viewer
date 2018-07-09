import JassAgent from './agent';

/**
 * type unit
 */
export default class JassHashTable extends JassAgent {
  /**
   * @param {JassContext} jass
   */
  constructor(jass) {
    super(jass);

    /** @member {Map<string, Map<string, *>>} */
    this.table = new Map();
  }

  /**
   * @param {number} parentKey
   * @param {number} childKey
   * @param {*} value
   */
  save(parentKey, childKey, value) {
    let table = this.table;
    let childTable = table.get(parentKey);

    if (!childTable) {
      childTable = new Map();

      table.set(parentKey, childTable);
    }

    childTable.set(childKey, value);
  }

  /**
   * @param {number} parentKey
   * @param {number} childKey
   * @param {number|null} defaultValue
   * @return {*}
   */
  load(parentKey, childKey, defaultValue) {
    let table = this.table;
    let childTable = table.get(parentKey);

    if (childTable) {
      let value = childTable.get(childKey);

      if (value !== undefined) {
        return value;
      }
    }

    return defaultValue;
  }

  /**
   * @param {number} parentKey
   * @param {number} childKey
   * @return {boolean}
   */
  have(parentKey, childKey) {
    let table = this.table;
    let childTable = table.get(parentKey);

    if (!childTable) {
      return false;
    }

    return childTable.has(childKey);
  }

  /**
   * @param {number} parentKey
   * @param {number} childKey
   */
  remove(parentKey, childKey) {
    let table = this.table;
    let childTable = table.get(parentKey);

    if (childTable) {
      childTable.delete(childKey);

      if (!childTable.size) {
        table.delete(parentKey);
      }
    }
  }

  /**
   *
   */
  flush() {
    this.table.clear();
  }

  /**
   * @param {number} parentKey
   */
  flushChild(parentKey) {
    this.table.get(parentKey).clear();
  }
}
