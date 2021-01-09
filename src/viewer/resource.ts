import ModelViewer from './viewer';

/**
 * The data sent to every resource as a part of the loading process.
 */
export type ResourceData = { viewer: ModelViewer, fetchUrl: string };

/**
 * A viewer resource.
 * 
 * Generally speaking resources are created via viewer.load(), or viewer.loadGeneric().
 */
export abstract class Resource {
  viewer: ModelViewer;
  fetchUrl: string;
  blockers: Promise<Resource | undefined>[] = [];

  constructor(resourceData: ResourceData) {
    this.viewer = resourceData.viewer;
    this.fetchUrl = resourceData.fetchUrl;
  }

  /**
   * Remove this resource from its viewer's cache.
   * 
   * Equivalent to viewer.unload(resource).
   */
  detach() {
    return this.viewer.unload(this);
  }
}
