import MdxSdContainer from './sd';

export default class MdxModelParticleEmitter {
    /**
     * @param {MdxModel} model
     * @param {MdxParserParticleEmitter} emitter
     */
    constructor(model, emitter) {
        this.model = model;
        this.emitter = emitter;
        this.internalResource = model.env.load(emitter.path.replace(/\\/g, '/').toLowerCase().replace('.mdl', '.mdx'), model.pathSolver);
        this.node = model.nodes[emitter.node.index];
        this.sd = new MdxSdContainer(model, emitter.tracks);
        this.speed = emitter.speed;
        this.latitude = emitter.latitude;
        this.longitude = emitter.longitude;
        this.lifespan = emitter.lifespan;
        this.gravity = emitter.gravity;
        this.emissionRate = emitter.emissionRate;
    }
};
