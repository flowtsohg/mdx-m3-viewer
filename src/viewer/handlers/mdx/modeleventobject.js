import { vec2 } from 'gl-matrix';
import GenericObject from './genericobject';
import { emitterFilterMode } from './filtermode';

let typeToSlk = {
    'SPN': 'Splats/SpawnData.slk',
    'SPL': 'Splats/SplatData.slk',
    'UBR': 'Splats/UberSplatData.slk'
};

export default class EventObject extends GenericObject {
    /**
     * @param {MdxModel} model
     * @param {MdxParserEventObjectEmitter} emitter
     */
    constructor(model, eventObject, pivotPoints, index) {
        super(model, eventObject, pivotPoints, index);

        let env = model.viewer,
            name = eventObject.name,
            type = name.substring(0, 3),
            id = name.substring(4);

        // Same thing
        if (type === 'FPT') {
            type = 'SPL';
        }
        
        this.ready = false;
        this.type = type;
        this.id = id;

        this.internalResource = null;

        this.tracks = eventObject.tracks;
        this.ready = false;
        this.globalSequence = null;
        this.defval = vec2.create();

        let globalSequenceId = eventObject.globalSequenceId;
        if (globalSequenceId !== -1) {
            this.globalSequence = model.globalSequences[globalSequenceId];
        }

        let path = typeToSlk[type];
        
        if (path) {
            let slk = env.load(path, model.pathSolver);

            if (slk.loaded) {
                this.initialize(slk.getRow(id));
            } else {
                // Promise that there is a future load that the code cannot know about yet, so Viewer.whenAllLoaded() isn't called prematurely.
                let promise = env.makePromise();

                slk.whenLoaded()
                    .then(() => {
                        this.initialize(slk.getRow(id));

                        // Resolve the promise.
                        promise.resolve();
                    });
            }
        }
    }

    initialize(row) {
        if (row) {
            let type = this.type,
                model = this.model;

            if (type === 'SPN') {
                this.internalResource = model.viewer.load(row.Model.replace('.mdl', '.mdx'), model.pathSolver);
            } else if (type === 'SPL' || type === 'UBR') {
                this.internalResource = model.viewer.load('replaceabletextures/splats/' + row.file + '.blp', model.pathSolver);
                this.colors = [[row.StartR, row.StartG, row.StartB, row.StartA], [row.MiddleR, row.MiddleG, row.MiddleB, row.MiddleA], [row.EndR, row.EndG, row.EndB, row.EndA]];
                this.scale = row.Scale;

                if (type === 'SPL') {
                    this.dimensions = [row.Columns, row.Rows];
                    this.intervals = [[row.UVLifespanStart, row.UVLifespanEnd, row.LifespanRepeat], [row.UVDecayStart, row.UVDecayEnd, row.DecayRepeat]];
                    this.intervalTimes = [row.Lifespan, row.Decay];
                    this.lifespan = row.Lifespan + row.Decay;
                } else {
                    this.dimensions = [1, 1];
                    this.intervalTimes = [row.BirthTime, row.PauseTime, row.Decay];
                    this.lifespan = row.BirthTime + row.PauseTime + row.Decay;
                }

                [this.blendSrc, this.blendDst] = emitterFilterMode(row.BlendMode, this.model.viewer.gl);
            }

            if (this.internalResource) {
                this.internalResource.whenLoaded().then(() => { this.ready = true; });
            }
        }
    }

    getValue(out, instance) {
        if (this.globalSequence) {
            var globalSequence = this.globalSequence;

            return this.getValueAtTime(out, instance.counter % globalSequence, 0, globalSequence);
        } else if (instance.sequence !== -1) {
            var interval = this.model.sequences[instance.sequence].interval;

            return this.getValueAtTime(out, instance.frame, interval[0], interval[1]);
        } else {
            let defval = this.defval;

            out[0] = defval[0];
            out[1] = defval[1];

            return out;
        }
    }

    getValueAtTime(out, frame, start, end) {
        var tracks = this.tracks;

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
