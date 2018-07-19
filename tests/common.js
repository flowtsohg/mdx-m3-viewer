function geoSolver(src) {
    return [src, ".geo", false];
}

function wc3Solver(path) {
    return ["../../resources/warcraft/" + path, path.substr(path.lastIndexOf(".")), true];
}

function sc2Solver(path) {
    return ["../../resources/starcraft2/" + path, path.substr(path.lastIndexOf(".")), true];
}

ModelViewer = ModelViewer.default;

let glMatrix = ModelViewer.common.glMatrix;
let vec2 = glMatrix.vec2;
let vec3 = glMatrix.vec3;
let vec4 = glMatrix.vec4;
let quat = glMatrix.quat;
let mat3 = glMatrix.mat3;
let mat4 = glMatrix.mat4;
let UnitTester = ModelViewer.utils.UnitTester;
let geometry = ModelViewer.common.geometry;
let math = ModelViewer.common.math;
