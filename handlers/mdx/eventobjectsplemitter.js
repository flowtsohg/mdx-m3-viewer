/**
 * @constructor
 * @param {MdxModel} model
 * @param {MdxEventObject} object
 */
function MdxEventObjectSplEmitter(model, object) {
    let gl = model.gl,
        emitter = object.emitter,
        slk = object.slk;

    this.type = "SPL";

    this.model = model;
    this.node = object.node;
    this.id = object.id;

    this.active = [];
    this.inactive = [];
    
    this.tracks = emitter.tracks;
    this.ready = false;
    this.globalSequence = null;
    this.defval = vec2.create();

    let globalSequenceId = emitter.globalSequenceId;
    if (globalSequenceId !== -1) {
        this.globalSequence = model.globalSequences[globalSequenceId];
    }

    this.buffer = new ResizeableBuffer(gl);
    this.bytesPerEmit = 4 * 30;

    slk.whenLoaded(() => this.initialize(slk));
}

MdxEventObjectSplEmitter.prototype = {
    initialize(slk) {
        let row = slk.map[this.id];
        
        if (row) {
            let model = this.model,
                gl = model.gl;

            this.intervals = [
                [row.UVLifespanStart, row.UVLifespanEnd, row.LifespanRepeat],
                [row.UVDecayStart, row.UVDecayEnd, row.DecayRepeat]
            ];

            this.texture = model.env.load("replaceabletextures/splats/" + row.file + ".blp", model.pathSolver);
            this.dimensions = [row.Columns, row.Rows];

            this.scale = row.Scale;
            this.colors = [[row.StartR, row.StartG, row.StartB, row.StartA], [row.MiddleR, row.MiddleG, row.MiddleB, row.MiddleA], [row.EndR, row.EndG, row.EndB, row.EndA]];

            this.intervalTimes = [row.Lifespan, row.Decay];
            this.lifespan = row.Lifespan + row.Decay;

            this.selectFilterMode(row.BlendMode);

            this.ready = true;
        }
    },

    emit(emitterView) {
        if (this.ready) {
            let inactive = this.inactive,
                object;

            if (inactive.length) {
                object = inactive.pop();
            } else {
                this.buffer.grow((this.active.length + 1) * this.bytesPerEmit);
                object = new MdxEventObjectSpl(this);
            }

            object.reset(emitterView);

            this.active.push(object);
        }
    },

    selectFilterMode: MdxParticle2Emitter.prototype.selectFilterMode,
    update: MdxParticleEmitter.prototype.update,
    updateData: MdxParticle2Emitter.prototype.updateData,
    render: MdxParticle2Emitter.prototype.render,
    getValue: MdxEventObjectSpnEmitter.prototype.getValue,
    getValueAtTime: MdxEventObjectSpnEmitter.prototype.getValueAtTime
};
