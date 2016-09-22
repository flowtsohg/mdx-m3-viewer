function GenericFile(env, pathSolver) {
    DownloadableResource.call(this, env, pathSolver);
}

GenericFile.prototype = {
    get objectType() {
        return "file";
    }
};

mix(GenericFile.prototype, DownloadableResource.prototype);
