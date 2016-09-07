function MdxEventObjectEmitter(eventObject, model, instance, viewer, pathSolver) {
    var node = instance.skeleton.nodes[eventObject.node.index];
    var name = node.nodeImpl.name;
    var type = name.substring(0, 3);
    var path = name.substring(4);
    
    // No difference?
    if (type === "FPT") {
        type = "SPL";
    }
    
    this.model = model;
    this.instance = instance;
    this.type = type;
    this.node = node;
    this.globalSequenceId = eventObject.globalSequenceId;
    this.globalSequences = model.globalSequences;
    this.sequences = model.sequences;
    this.tracks = eventObject.tracks;
    this.lastTrack = vec3.create();
    this.eventObjects = [];
    this.viewer = viewer;
    this.pathSolver = pathSolver;

    this.id = path;

    // Load the appropriate SLK, and request it to call this emitter's setup function
    if (type === "SPN") {
        viewer.load("Splats/SpawnData.slk", pathSolver).requestSetup(this);
    } else if (type === "SPL") {
        viewer.load("Splats/SplatData.slk", pathSolver).requestSetup(this);
    } else if (type === "UBR") {
        viewer.load("Splats/UberSplatData.slk", pathSolver).requestSetup(this);
    }
    
    this.track = vec3.create();
}

MdxEventObjectEmitter.prototype = {
    setup(slk) {
        var row = slk.map[this.id];
        
        if (row) {
            var type = this.type;

            if (type === "SPN") {
                this.path = row.Model.replace(".mdl", ".mdx");
            } else if (type === "SPL") {
                // While every SLK row comes with the file, they all point to this texture, might as well just load it without checking
                this.texture = this.viewer.load("replaceabletextures/splats/splat01mature.blp", this.pathSolver);

                this.rows = row.Rows;
                this.columns = row.Columns;
                this.blendMode = row.BlendMode;
                this.scale = row.Scale;
                this.firstIntervalTime = row.Lifespan;
                this.secondIntervalTime = row.Decay;
                this.firstInterval = [row.UVLifespanStart, row.UVLifespanEnd, row.LifespanRepeat];
                this.secondInterval = [row.UVDecayStart, row.UVDecayEnd, row.DecayRepeat];
                this.colors = [[row.StartR, row.StartG, row.startB, row.startA], [row.MiddleR, row.MiddleG, row.MiddleB, row.MiddleA], [row.EndR, row.EndG, row.EndB, row.EndA]];

                this.dimensions = [this.columns, this.rows];

                
            } else {
                this.texture = this.viewer.load("replaceabletextures/splats/" + row.file + ".blp", this.pathSolver);
                this.blendMode = row.BlendMode;
                this.scale = row.Scale
                this.firstIntervalTime = row.BirthTime;
                this.secondIntervalTime = row.PauseTime;
                this.thirdIntervalTime = row.Decay;
                this.colors = [[row.StartR, row.StartG, row.startB, row.startA], [row.MiddleR, row.MiddleG, row.MiddleB, row.MiddleA], [row.EndR, row.EndG, row.EndB, row.EndA]];

                this.dimensions = [1, 1];
                this.columns = 1;
            }

            this.ready = true;
        } else {
            console.warn("[MdxEventObjectEmitter:setup] No valid SLK row");
        }
    },

    update(allowCreate, sequence, frame, counter, viewer) {
        if (this.ready) {
            var eventObjects = this.eventObjects;
            var eventObject;
            var track = this.getValue(sequence, frame, counter, this.track);
            
            if (track[0] === 1 && (track[0] !== this.lastTrack[0] || track[1] !== this.lastTrack[1])) {
                switch (this.type) {
                    case "SPN":
                        eventObject = new MdxEventObjectSpn(this);
                        break;
                    case "SPL":
                        eventObject = new MdxEventObjectSpl(this);
                        break;
                    case "UBR":
                        eventObject = new MdxEventObjectUbr(this);
                        break;
                }
                
                eventObjects.push(eventObject);
            }
            
            this.lastTrack[0] = track[0];
            this.lastTrack[1] = track[1];
            
            for (var i = 0, l = eventObjects.length; i < l; i++) {
                eventObjects[i].update(this);
            }
            
            if (eventObjects.length) {
                if (eventObjects[0].ended()) {
                    eventObjects.shift();
                }
            }
        }
    },

    render() {
        if (this.ready) {
            var eventObjects = this.eventObjects;
            
            for (var i = 0, l = eventObjects.length; i < l; i++) {
                eventObjects[i].render(this);
            }
        }
    },
    
    renderEmitters() {
        if (this.ready) {
            var eventObjects = this.eventObjects;
            
            for (var i = 0, l = eventObjects.length; i < l; i++) {
                eventObjects[i].renderEmitters(this);
            }
        }
    },
    
    getValue(sequence, frame, counter, out) {
        if (this.globalSequenceId !== -1 && this.globalSequences) {
            var duration = this.globalSequences[this.globalSequenceId];

            return this.getValueAtTime(counter % duration , 0, duration, out);
        } else if (sequence !== -1) {
            var interval = this.sequences[sequence].interval;

            return this.getValueAtTime(frame, interval[0], interval[1], out);
        } else {
            out[0] = 0;
            out[1] = 0;
            return out;
        }
    },
    
    getValueAtTime(frame, start, end, out) {
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
