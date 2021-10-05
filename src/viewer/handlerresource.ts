import { ResourceData, Resource } from './resource';


export type SolverParams ={[key: string]: unknown };

/**
 * A path solver used for resolving fetch paths.
 */
export type PathSolver = (src: unknown, params?: SolverParams) => unknown;

/**
 * The data sent to every handler resource as part of the loading process.
 */
export type HandlerResourceData = ResourceData & { pathSolver?: PathSolver };

/**
 * A viewer handler resource.
 * 
 * Generally speaking handler resources are created via viewer.load().
 */
export abstract class HandlerResource extends Resource {
  pathSolver?: PathSolver;

  constructor(resourceData: HandlerResourceData) {
    super(resourceData);

    this.pathSolver = resourceData.pathSolver;
  }
}
