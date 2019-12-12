import JassAgent from './agent';

/**
 * type unit
 */
export default class JassHashTable extends JassAgent {
  table: Map<number, Map<number, any>> = new Map();

  save(parentKey: number, childKey: number, value: any) {
    let table = this.table;
    let childTable = table.get(parentKey);

    if (!childTable) {
      childTable = new Map();

      table.set(parentKey, childTable);
    }

    childTable.set(childKey, value);
  }

  load(parentKey: number, childKey: number, defaultValue?: number) {
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

  have(parentKey: number, childKey: number) {
    let table = this.table;
    let childTable = table.get(parentKey);

    if (!childTable) {
      return false;
    }

    return childTable.has(childKey);
  }

  remove(parentKey: number, childKey: number) {
    let table = this.table;
    let childTable = table.get(parentKey);

    if (childTable) {
      childTable.delete(childKey);

      if (!childTable.size) {
        table.delete(parentKey);
      }
    }
  }

  flush() {
    this.table.clear();
  }

  flushChild(parentKey: number) {
    let child = this.table.get(parentKey);

    if (child) {
      child.clear();
    }
  }
}
