/**
 * A quadtree cell.
 */
class Cell {
  /**
   * @param {QuadTree} tree
   * @param {Array<number>} location
   */
  constructor(tree, location) {
    let cellSize = tree.cellSize;

    this.tree = tree;
    this.instances = [];
    this.corners = [
      location,
      [location[0] + cellSize[0], location[1]],
      [location[0] + cellSize[0], location[1] + cellSize[1]],
      [location[0], location[1] + cellSize[1]],
    ];
    this.rendered = true;
  }

  /**
   * @param {ModelInstance} instance
   */
  add(instance) {
    this.instances.push(instance);
    instance.cell = this;
  }

  /**
   * @param {ModelInstance} instance
   */
  remove(instance) {
    let index = this.instances.indexOf(instance);

    this.instances.splice(index, 1);
    instance.cell = null;
  }
}

/**
 * A quadtree.
 */
export default class QuadTree {
  /**
   * @param {Array<number>} location
   * @param {Array<number>} size
   * @param {Array<number>} cellSize
   */
  constructor(location, size, cellSize) {
    this.location = location;
    this.size = size;
    this.cellSize = cellSize;
    this.cells = [];

    let columns = size[0] / cellSize[0];
    let rows = size[1] / cellSize[1];

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        this.cells[y * columns + x] = new Cell(this, [location[0] + x * cellSize[0], location[1] + y * cellSize[1]]);
      }
    }

    this.columns = columns;
    this.rows = rows;
  }

  /**
   * @param {ModelInstance} instance
   */
  add(instance) {
    let cell = this.cellAt(instance.worldLocation);

    if (cell) {
      cell.add(instance);
    }
  }

  /**
   * @param {ModelInstance} instance
   */
  remove(instance) {
    let cell = instance.cell;

    if (cell) {
      cell.remove(instance);
    }
  }

  /**
   * @param {ModelInstance} instance
   */
  moved(instance) {
    let cell = this.cellAt(instance.worldLocation);

    if (cell) {
      if (cell !== instance.cell) {
        this.remove(instance);

        cell.add(instance);
      }
    } else {
      this.remove(instance);
    }
  }

  /**
   * @param {Array<number>} location
   * @return {?Cell}
   */
  cellAt(location) {
    let x = Math.floor((location[0] - this.location[0]) / this.cellSize[0]);
    let y = Math.floor((location[1] - this.location[1]) / this.cellSize[1]);

    if (x >= 0 && x < this.columns && y >= 0 && y < this.rows) {
      return this.cells[y * this.columns + x];
    }

    return null;
  }
}
