/**
 * @constructor
 * @param {MdxModel} model
 * @param {MdxParserEventObjectEmitter} emitter
 */
function MdxEventObjectEmitter(model, emitter) {
    let node = model.nodes[emitter.node.index],
        name = node.name,
        type = name.substring(0, 3),
        id = name.substring(4);
    
    // No difference?
    if (type === "FPT") {
        type = "SPL";
    }
    
    this.model = model;
    this.node = node;
    this.type = type;
    this.active = [];
    this.inactive = [];
    this.id = id;
    this.tracks = emitter.tracks;
    this.ready = false;
    this.globalSequence = null;
    this.defval = vec2.create();

    let globalSequenceId = emitter.globalSequenceId;
    if (globalSequenceId !== -1) {
        this.globalSequence = model.globalSequences[globalSequenceId];
    }

    // Load the appropriate SLK
    let slkFile;
    
    if (type === "SPN") {
        slkFile = "Splats/SpawnData.slk";
    } else if (type === "SPL") {
        slkFile = "Splats/SplatData.slk";
    } else if (type === "UBR") {
        slkFile = "Splats/UberSplatData.slk";
    }

    // Sound event objects not supported
    if (slkFile) {
        this.slk = model.env.load(slkFile, model.pathSolver);
        this.slk.whenLoaded(() => this.initialize());
    }
}

MdxEventObjectEmitter.prototype = {
    initialize() {
        let row = this.slk.map[this.id];
        
        if (row) {
            let model = this.model,
                gl = model.gl,
                type = this.type;

            if (type === "SPN") {
                this.internalModel = model.env.load(row.Model.replace(".mdl", ".mdx"), model.pathSolver);
            } else if (type === "SPL" || type === "UBR") {
                let columns = 1,
                    rows = 1,
                    intervalTimes,
                    intervals,
                    lifespan;

                if (type === "SPL") {
                    rows = row.Rows;
                    columns = row.Columns;

                    intervalTimes = [
                        row.Lifespan,
                        row.Decay
                    ];

                    lifespan = row.Lifespan + row.Decay;

                    this.intervals = [
                        [row.UVLifespanStart, row.UVLifespanEnd, row.LifespanRepeat],
                        [row.UVDecayStart, row.UVDecayEnd, row.DecayRepeat]
                    ];
                } else {
                    intervalTimes = [
                        row.BirthTime,
                        row.PauseTime,
                        row.Decay
                    ];

                    lifespan = row.BirthTime + row.PauseTime + row.Decay;
                }

                this.texture = model.env.load("replaceabletextures/splats/" + row.file + ".blp", model.pathSolver);
                this.dimensions = [columns, rows];

                this.scale = row.Scale;
                this.colors = [[row.StartR, row.StartG, row.StartB, row.StartA], [row.MiddleR, row.MiddleG, row.MiddleB, row.MiddleA], [row.EndR, row.EndG, row.EndB, row.EndA]];

                this.intervalTimes = intervalTimes;
                this.lifespan = lifespan;

                this.buffer = new ResizeableBuffer(gl);
                this.bytesPerEmit = 4 * 30;

                let blendMode = row.BlendMode;
                switch (blendMode) {
                    // Blend
                    case 0:
                        this.blendSrc = gl.SRC_ALPHA;
                        this.blendDst = gl.ONE_MINUS_SRC_ALPHA;
                        break;
                        // Additive
                    case 1:
                        this.blendSrc = gl.SRC_ALPHA;
                        this.blendDst = gl.ONE;
                        break;
                        // Modulate
                    case 2:
                        this.blendSrc = gl.ZERO;
                        this.blendDst = gl.SRC_COLOR;
                        break;
                        // Modulate 2X
                    case 3:
                        this.blendSrc = gl.DEST_COLOR;
                        this.blendDst = gl.SRC_COLOR;
                        break;
                        // Add Alpha
                    case 4:
                        this.blendSrc = gl.SRC_ALPHA;
                        this.blendDst = gl.ONE;
                        break;
                }
            }

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
                switch (this.type) {
                    case "SPN":
                        object = new MdxEventObjectSpn(this);
                        break;
                    case "SPL":
                        this.buffer.grow((this.active.length + 1) * this.bytesPerEmit);
                        object = new MdxEventObjectSpl(this);
                        break;
                    case "UBR":
                        this.buffer.grow((this.active.length + 1) * this.bytesPerEmit);
                        object = new MdxEventObjectUbr(this);
                        break;
                }
            }

            object.reset(emitterView);

            this.active.push(object);
        }
    },

    update(scene) {
        let active = this.active,
            inactive = this.inactive;

        if (active.length > 0) {
            // First stage: remove dead particles.
            // The used particles array is a queue, dead particles will always come first.
            // As of the time of writing, the easiest and fastest way to implement a queue in Javascript is a normal array.
            // To add items, you push, to remove items, the array is reversed and you pop.
            // So the first stage reverses the array, and then keeps checking the last element for its health.
            // As long as we hit a dead particle, pop, and check the new last element.

            // Ready for pop mode
            active.reverse();

            let object = active[active.length - 1];
            while (object && object.health <= 0) {
                inactive.push(active.pop());

                // Need to recalculate the length each time
                object = active[active.length - 1];
            }

            // Ready for push mode
            active.reverse()

            // Second stage: update the living particles.
            // All the dead particles were removed, so a simple loop is all that's required.
            for (let i = 0, l = active.length; i < l; i++) {
                active[i].update();
            }

            this.updateHW(scene);
        }
    },

    updateHW(scene) {
        if (this.type === "SPL" || this.type === "UBR") {
            let active = this.active,
                data = this.buffer.float32array;

            for (let i = 0, l = active.length, offset = 0; i < l; i++, offset += 30) {
                let object = active[i],
                    vertices = object.vertices,
                    lta = object.lta,
                    lba = object.lba,
                    rta = object.rta,
                    rba = object.rba,
                    rgb = object.rgb;

                data[offset + 0] = vertices[0];
                data[offset + 1] = vertices[1];
                data[offset + 2] = vertices[2];
                data[offset + 3] = lta;
                data[offset + 4] = rgb;

                data[offset + 5] = vertices[3];
                data[offset + 6] = vertices[4];
                data[offset + 7] = vertices[5];
                data[offset + 8] = lba;
                data[offset + 9] = rgb;

                data[offset + 10] = vertices[6];
                data[offset + 11] = vertices[7];
                data[offset + 12] = vertices[8];
                data[offset + 13] = rba;
                data[offset + 14] = rgb;

                data[offset + 15] = vertices[0];
                data[offset + 16] = vertices[1];
                data[offset + 17] = vertices[2];
                data[offset + 18] = lta;
                data[offset + 19] = rgb;

                data[offset + 20] = vertices[6];
                data[offset + 21] = vertices[7];
                data[offset + 22] = vertices[8];
                data[offset + 23] = rba;
                data[offset + 24] = rgb;

                data[offset + 25] = vertices[9];
                data[offset + 26] = vertices[10];
                data[offset + 27] = vertices[11];
                data[offset + 28] = rta;
                data[offset + 29] = rgb;
            }
        }
    },

    render(bucket, shader) {
        if (this.type === "SPL" || this.type === "UBR") {
            let active = this.active.length;

            if (active > 0) {
                let model = this.model,
                    gl = model.gl;

                gl.blendFunc(this.blendSrc, this.blendDst);

                gl.uniform2fv(shader.uniforms.get("u_dimensions"), this.dimensions);

                model.bindTexture(this.texture, 0, bucket.modelView);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.buffer);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.buffer.float32array.subarray(0, active * 30));

                gl.vertexAttribPointer(shader.attribs.get("a_position"), 3, gl.FLOAT, false, 20, 0);
                gl.vertexAttribPointer(shader.attribs.get("a_uva_rgb"), 2, gl.FLOAT, false, 20, 12);

                gl.drawArrays(gl.TRIANGLES, 0, active * 6);
            }
        }
    },

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
