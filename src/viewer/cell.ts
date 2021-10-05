import { testCell } from '../common/gl-matrix-addon';
import Camera from './camera';
import ModelInstance from './modelinstance';

/**
 * A grid cell.
 */
export default class Cell {
  left: number;
  right: number;
  bottom: number;
  top: number;
  plane = -1;
  instances: ModelInstance[] = [];
  visible = false;

  constructor(left: number, right: number, bottom: number, top: number) {
    this.left = left;
    this.right = right;
    this.bottom = bottom;
    this.top = top;
  }

  add(instance: ModelInstance): void {
    this.instances.push(instance);
  }

  remove(instance: ModelInstance): void {
    const index = this.instances.indexOf(instance);

    this.instances.splice(index, 1);
  }

  /**
   * Remove all of the instances from this cell.
   */
  clear(): void {
    this.instances.length = 0;
  }

  isVisible(camera: Camera): boolean {
    this.plane = testCell(camera.planes, this.left, this.right, this.bottom, this.top, this.plane);

    return this.plane === -1;
  }
}
