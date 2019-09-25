/**
 * A quadtree cell.
 */
class Cell {
  /**
   * @param {number} left
   * @param {number} right
   * @param {number} bottom
   * @param {number} top
   */
  constructor(left, right, bottom, top) {
    /** @member {number} */
    this.left = left;
    /** @member {number} */
    this.right = right;
    /** @member {number} */
    this.bottom = bottom;
    /** @member {number} */
    this.top = top;
    /** @member {Array<ModelInstance>} */
    this.instances = [];
    /** @member {boolean} */
    this.visible = false;
  }

  /**
   * @param {ModelInstance} instance
   */
  add(instance) {
    this.instances.push(instance);
  }

  /**
   * @param {ModelInstance} instance
   */
  remove(instance) {
    let index = this.instances.indexOf(instance);

    this.instances.splice(index, 1);
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
    let columns = size[0] / cellSize[0];
    let rows = size[1] / cellSize[1];

    this.location = location;
    this.size = size;
    this.columns = columns;
    this.rows = rows;
    this.cellSize = cellSize;
    this.cells = [];

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        let left = location[0] + x * cellSize[0];
        let right = left + cellSize[0];
        let bottom = location[1] + y * cellSize[1];
        let top = bottom + cellSize[1];

        this.cells[y * columns + x] = new Cell(left, right, bottom, top);
      }
    }
  }

  /**
   * @param {ModelInstance} instance
   */
  add(instance) {
    let cells = this.cells;
    let columns = this.columns;
    let left = instance.left;
    let right = instance.right + 1;
    let bottom = instance.bottom;
    let top = instance.top + 1;

    if (left !== -1) {
      for (let y = bottom; y < top; y++) {
        for (let x = left; x < right; x++) {
          cells[y * columns + x].add(instance);
        }
      }
    }
  }

  /**
   * @param {ModelInstance} instance
   */
  remove(instance) {
    let cells = this.cells;
    let columns = this.columns;
    let left = instance.left;
    let right = instance.right + 1;
    let bottom = instance.bottom;
    let top = instance.top + 1;

    if (left !== -1) {
      instance.left = -1;

      for (let y = bottom; y < top; y++) {
        for (let x = left; x < right; x++) {
          cells[y * columns + x].remove(instance);
        }
      }
    }
  }

  /**
   * @param {ModelInstance} instance
   */
  moved(instance) {
    let cellSize = this.cellSize;
    let bounds = instance.model.bounds;
    let x = instance.worldLocation[0] + bounds.x - this.location[0];
    let y = instance.worldLocation[1] + bounds.y - this.location[1];
    let r = bounds.r;
    let s = instance.worldScale;
    let left = Math.floor((x - r * s[0]) / cellSize[0]);
    let right = Math.floor((x + r * s[0]) / cellSize[0]);
    let bottom = Math.floor((y - r * s[1]) / cellSize[1]);
    let top = Math.floor((y + r * s[1]) / cellSize[1]);

    if (right < 0 || left > this.columns - 1 || top < 0 || bottom > this.rows - 1) {
      // The instance is outside of the grid, so remove it.
      this.remove(instance);
    } else {
      // Clamp the values so they are in the grid.
      left = Math.max(left, 0);
      right = Math.min(right, this.columns - 1);
      bottom = Math.max(bottom, 0);
      top = Math.min(top, this.rows - 1);

      // If the values actually changed, update the cells.
      if (left !== instance.left || right !== instance.right || bottom !== instance.bottom || top !== instance.top) {
        /// TODO: This can be optimized by checking if there are shared cells.
        ///       That can be done in precisely the same way as done a few lines above, i.e. simple rectangle intersection.
        this.remove(instance);

        instance.left = left;
        instance.right = right;
        instance.bottom = bottom;
        instance.top = top;

        this.add(instance);
      }
    }
  }
}
