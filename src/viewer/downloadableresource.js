import Resource from './resource';

export default class DownloadableResource extends Resource {
    /**
     * @param {ModelViewer} env
     * @param {function(?)} pathSolver
     * @param {Handler} handler
     * @param {string} extension
     */
    constructor(env, pathSolver, handler, extension) {
        super(env);

        /** @member {function(?)} */
        this.pathSolver = pathSolver;
        /** @member {Handler} */
        this.handler = handler;
        /** @member {string} */
        this.extension = extension;
        /** @member {string} */
        this.fetchUrl = '';
    }
};
