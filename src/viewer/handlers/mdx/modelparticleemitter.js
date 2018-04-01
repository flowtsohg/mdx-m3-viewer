import GenericObject from './genericobject';

export default class ParticleEmitter extends GenericObject {
    /**
     * @param {MdxModel} model
     * @param {MdxParserParticleEmitter} emitter
     */
    constructor(model, emitter, pivotPoints, index) {
        super(model, emitter, pivotPoints, index);

        this.internalResource = model.env.load(emitter.path.replace(/\\/g, '/').toLowerCase().replace('.mdl', '.mdx'), model.pathSolver);
        this.speed = emitter.speed;
        this.latitude = emitter.latitude;
        this.longitude = emitter.longitude;
        this.lifeSpan = emitter.lifeSpan;
        this.gravity = emitter.gravity;
        this.emissionRate = emitter.emissionRate;
    }
};
