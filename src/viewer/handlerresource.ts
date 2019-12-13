import Resource from './resource';

export default abstract class HandlerResource extends Resource {
  pathSolver: PathSolver;

  constructor(resourceData: HandlerResourceData) {
    super(resourceData);

    this.pathSolver = resourceData.pathSolver;
  }
}
