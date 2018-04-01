function geoSolver(src) {
    return [src, ".geo", false];
}

function wc3Solver(path) {
    return ["../resources/warcraft/" + path, path.substr(path.lastIndexOf(".")), true];
}

function sc2Solver(path) {
    return ["../resources/starcraft2/" + path, path.substr(path.lastIndexOf(".")), true];
}

ModelViewer = ModelViewer.default;

let glMatrix = ModelViewer.common.glMatrix,
    vec2 = glMatrix.vec2,
    vec3 = glMatrix.vec3,
    vec4 = glMatrix.vec4,
    quat = glMatrix.quat,
    mat3 = glMatrix.mat3,
    mat4 = glMatrix.mat4,
    UnitTester = ModelViewer.Viewer.UnitTester,
    geometry = ModelViewer.common.geometry,
    math = ModelViewer.common.math;
