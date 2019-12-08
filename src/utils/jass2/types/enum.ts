import JassHandle from './handle';

/**
 * Parent class for all enum types.
 */
export default class JassEnum extends JassHandle {
  id: number;

  constructor(value: number) {
    super();

    this.id = value;
  }
}
