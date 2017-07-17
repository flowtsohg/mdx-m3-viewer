/**
 * @constructor
 * @param {MdxModel} model
 * @param {MdxEventObject} object
 */
function MdxEventObjectSpnEmitter(model, object) {
    let emitter = object.emitter,
        slk = object.slk;

    this.type = "SPN";

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

    slk.whenLoaded(() => this.initialize(slk));
}

MdxEventObjectSpnEmitter.prototype = {
    initialize(slk) {
        let row = slk.map[this.id];
        
        if (row) {
            let model = this.model;

            this.internalModel = model.env.load(row.Model.replace(".mdl", ".mdx"), model.pathSolver);

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
                // An emitted object expects all of the state to be loaded.
                // This isn't true for models that simply fail to load due to an HTTP error.
                // Therefore, only emit instances if the model loaded.
                if (!this.internalModel.loaded) {
                    return;
                }

                object = new MdxEventObjectSpn(this);
            }

            object.reset(emitterView);

            this.active.push(object);
        }
    },

    update: MdxParticleEmitter.prototype.update,
    updateData: MdxParticleEmitter.prototype.updateData,
    render: MdxParticleEmitter.prototype.render,

    getValue(instance) {
        if (this.globalSequence) {
            var globalSequence = this.globalSequence;

            return this.getValueAtTime(instance.counter % globalSequence, 0, globalSequence);
        } else if (instance.sequence !== -1) {
            var interval = this.model.sequences[instance.sequence].interval;

            return this.getValueAtTime(instance.frame, interval[0], interval[1]);
        } else {
            return this.defval;
        }
    },

    getValueAtTime(frame, start, end) {
        var out = vec2.heap,
            tracks = this.tracks;
        
        if (frame < start || frame > end) {
            out[0] = 0;
            out[1] = 0;
            return out;
        }
        
        for (var i = tracks.length - 1; i > -1; i--) {
            if (tracks[i] < start) {
                out[0] = 0;
                out[1] = i;
                return out;
            } else if (tracks[i] <= frame) {
                out[0] = 1;
                out[1] = i;
                return out;
            }
        }
        
        out[0] = 0;
        out[1] = 0;
        return out;
    }
};
