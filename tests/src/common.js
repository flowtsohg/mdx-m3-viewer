function wc3Solver(path) {
    return ["../resources/warcraft/" + path, path.substr(path.lastIndexOf(".")), true];
}

function sc2Solver(path) {
    return ["../resources/starcraft2/" + path, path.substr(path.lastIndexOf(".")), true];
}

const unitTester = new UnitTester();
