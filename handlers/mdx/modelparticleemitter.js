/**
 * @constructor
 * @param {MdxModel} model
 * @param {MdxParserParticleEmitter} emitter
 */
function MdxModelParticleEmitter(model, emitter) {
    this.model = model;
    this.emitter = emitter;
    this.internalModel = model.env.load(emitter.path.replace(/\\/g, "/").toLowerCase().replace(".mdl", ".mdx"), model.pathSolver);
    this.node = model.nodes[emitter.node.index];
    this.sd = new MdxSdContainer(model, emitter.tracks);
}
