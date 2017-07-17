/**
 * @constructor
 * @param {MdxModel} model
 * @param {MdxParserEventObjectEmitter} emitter
 */
function MdxEventObject(model, emitter) {
    let env = model.env,
        pathSolver = model.pathSolver,
        node = model.nodes[emitter.node.index],
        name = node.name,
        type = name.substring(0, 3),
        id = name.substring(4),
        slk;

    if (type === "FPT") {
        type = "SPL";
    }

    if (type === "SPN") {
        slk = env.load("Splats/SpawnData.slk", pathSolver);
    } else if (type === "SPL") {
        slk = env.load("Splats/SplatData.slk", pathSolver);
    } else if (type === "UBR") {
        slk = env.load("Splats/UberSplatData.slk", pathSolver);
    }

    this.model = model;
    this.emitter = emitter;
    this.node = node;
    this.type = type;
    this.id = id;
    this.slk = slk;
}
