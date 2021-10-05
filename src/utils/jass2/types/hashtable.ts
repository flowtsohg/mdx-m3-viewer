import JassAgent from './agent';

/**
 * type unit
 */
export default class JassHashTable extends JassAgent {
  table: Map<number, Map<number, unknown>> = new Map();

  save(parentKey: number, childKey: number, value: unknown): void {
    const table = this.table;
    let childTable = table.get(parentKey);

    if (!childTable) {
      childTable = new Map();

      table.set(parentKey, childTable);
    }

    childTable.set(childKey, value);
  }

  load(parentKey: number, childKey: number, defaultValue?: unknown): unknown {
    const table = this.table;
    const childTable = table.get(parentKey);

    if (childTable) {
      const value = childTable.get(childKey);

      if (value !== undefined) {
        return value;
      }
    }

    return defaultValue;
  }

  have(parentKey: number, childKey: number): boolean {
    const table = this.table;
    const childTable = table.get(parentKey);

    if (!childTable) {
      return false;
    }

    return childTable.has(childKey);
  }

  remove(parentKey: number, childKey: number): void {
    const table = this.table;
    const childTable = table.get(parentKey);

    if (childTable) {
      childTable.delete(childKey);

      if (!childTable.size) {
        table.delete(parentKey);
      }
    }
  }

  flush(): void {
    this.table.clear();
  }

  flushChild(parentKey: number): void {
    const child = this.table.get(parentKey);

    if (child) {
      child.clear();
    }
  }
}
