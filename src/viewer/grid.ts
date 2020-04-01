import Cell from './cell';
import ModelInstance from './modelinstance';

/**
 * A grid.
 */
export default class Grid {
  x: number;
  y: number;
  width: number;
  depth: number;
  cellWidth: number;
  cellDepth: number;
  columns: number;
  rows: number;
  cells: Cell[] = [];

  constructor(x: number, y: number, width: number, depth: number, cellWidth: number, cellDepth: number) {
    let columns = width / cellWidth;
    let rows = depth / cellDepth;

    this.x = x;
    this.y = y;
    this.width = width;
    this.depth = depth;
    this.cellWidth = cellWidth;
    this.cellDepth = cellDepth;
    this.columns = columns;
    this.rows = rows;

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        let left = x + column * cellWidth;
        let right = left + cellWidth;
        let bottom = y + row * cellDepth;
        let top = bottom + cellDepth;

        this.cells[row * columns + column] = new Cell(left, right, bottom, top);
      }
    }
  }

  add(instance: ModelInstance) {
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

  remove(instance: ModelInstance) {
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

  moved(instance: ModelInstance) {
    let cellWidth = this.cellWidth;
    let cellDepth = this.cellDepth;
    let bounds = instance.model.bounds;
    let x = instance.worldLocation[0] + bounds.x - this.x;
    let y = instance.worldLocation[1] + bounds.y - this.y;
    let r = bounds.r;
    let s = instance.worldScale;
    let left = Math.floor((x - r * s[0]) / cellWidth);
    let right = Math.floor((x + r * s[0]) / cellWidth);
    let bottom = Math.floor((y - r * s[1]) / cellDepth);
    let top = Math.floor((y + r * s[1]) / cellDepth);

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

  /**
   * Removes all of the instances from this grid.
   */
  clear() {
    for (let cell of this.cells) {
      cell.clear();
    }
  }
}
