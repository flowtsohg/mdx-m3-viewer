function MdxParticleEmitter(instance, emitter) {
    const model = instance.model;

    var i, l;
    var keys = Object.keys(emitter);

    for (i = keys.length; i--;) {
        this[keys[i]] = emitter[keys[i]];
    }

    this.lastCreation = 0;

    var path = emitter.path.replace(/\\/g, "/").toLowerCase().replace(".mdl", ".mdx");

    this.instance = instance;
    this.spawnModel = model.env.load(path, model.pathSolver);

    this.node = instance.skeleton.nodes[emitter.node.index];
    this.sd = new MdxSdContainer(emitter.tracks, model);

    var particles;

    // This is the maximum number of particles that are going to exist at the same time
    if (emitter.tracks.emissionRate) {
        var tracks = emitter.tracks.emissionRate;
        var biggest = 0;

        for (i = 0, l = tracks.length; i < l; i++) {
            var track = tracks[i];

            if (track.vector > biggest) {
                biggest = track.vector;
            }
        }
        // For a reason I can't understand, biggest*lifespan isn't enough for emission rate tracks, multiplying by 2 seems to be the lowest reasonable value that works
        particles = Math.round(biggest * Math.ceil(emitter.lifespan) * 2);
    } else {
        particles = Math.round(emitter.emissionRate * Math.ceil(emitter.lifespan));
    }


    

    this.particles = [];
    this.reusables = [];

    for (let i = 0; i < particles; i++) {
        this.particles[i] = new MdxParticle(this);
        this.reusables.push(i);
    }
    

    // To avoid heap alocations
    this.heapVelocity = vec3.create();
    this.heapMat = mat4.create();
    this.heapVel1 = vec3.create();
    this.heapVel3 = vec3.create();
}

MdxParticleEmitter.prototype = {
    update(allowCreate) {
        const particles = this.particles,
            reusables = this.reusables;

        for (let i = 0, l = particles.length; i < l; i++) {
            const particle = particles[i];

            if (particle.alive) {
                if (particle.health <= 0) {
                    particle.kill();

                    reusables.push(i);
                } else {
                    particle.update();
                }
            }
        }

        if (allowCreate && this.shouldRender()) {
            this.lastCreation += 1;

            const amount = this.getEmissionRate() * this.instance.env.frameTime * 0.001 * this.lastCreation;

            if (amount >= 1) {
                this.lastCreation = 0;

                for (let i = 0; i < amount; i++) {
                    if (reusables.length > 0) {
                        particles[reusables.pop()].reset();
                    }
                }
            }
        }
    },

    render() {
        
    },

    shouldRender() {
        return this.getVisibility(this.instance) > 0.75;
    },

    getSpeed() {
        return this.sd.getKPESValue(this.instance, this.speed);
    },

    getLatitude() {
        return this.sd.getKPLTValue(this.instance, this.latitude);
    },

    getLongitude() {
        return this.sd.getKPLNValue(this.instance, this.longitude);
    },

    getLifespan() {
        return this.sd.getKPELValue(this.instance, this.lifespan);
    },

    getGravity() {
        return this.sd.getKPEGValue(this.instance, this.gravity);
    },

    getEmissionRate() {
        return this.sd.getKPEEValue(this.instance, this.emissionRate);
    },

    getVisibility() {
        return this.sd.getKPEVValue(this.instance, 1);
    }
};
