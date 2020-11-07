import ModelViewer from './viewer';

/**
 * The data sent to every resource as a part of the loading process.
 */
export type ResourceData = { viewer: ModelViewer, extension?: string, fetchUrl?: string };

/**
 * A viewer resource.
 * 
 * Generally speaking resources are created via viewer.load(), or viewer.loadGeneric().
 */
export abstract class Resource {
  viewer: ModelViewer;
  extension: string;
  fetchUrl: string;
  blockers: Promise<Resource>[] = [];

  constructor(resourceData: ResourceData) {
    this.viewer = resourceData.viewer;
    this.extension = resourceData.extension || '';
    this.fetchUrl = resourceData.fetchUrl || '';
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
