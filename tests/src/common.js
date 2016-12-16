function wc3Solver(path) {
    return ["../resources/warcraft/" + path, path.substr(path.lastIndexOf(".")), true];
}

function sc2Solver(path) {
    return ["../resources/starcraft2/" + path, path.substr(path.lastIndexOf(".")), true];
}

function geoSolver(src) {
    return [src, ".geo", false];
}