function DownloadableResource(env, pathSolver) {
    this.pathSolver = pathSolver;

    AsyncResource.call(this, env);
}

DownloadableResource.prototype = {
    load(src, isBinary, serverFetch) {
        if (serverFetch) {
            get(src, isBinary, xhr => this.onprogress(xhr)).then(xhr => this.onload(xhr.response), xhr => this.onerror(xhr));
        } else {
            this.onload(src);
        }
    }
};

mix(DownloadableResource.prototype, AsyncResource.prototype);
