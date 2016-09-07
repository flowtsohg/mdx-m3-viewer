function File(env, pathSolver) {
    DownloadableResource.call(this, env, pathSolver);
}

File.prototype = {
    get objectType() {
        return "file";
    }
};

mix(File.prototype, DownloadableResource.prototype);
