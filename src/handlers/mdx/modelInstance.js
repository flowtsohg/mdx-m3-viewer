function ModelInstance(model, textureMap, context) {
    BaseModelInstance.call(this, model, textureMap);

    this.setup(model, context);
}

ModelInstance.prototype = extend(BaseModelInstance.prototype, {
    setup: function (model, context) {
        var gl = context.gl;
        var ctx = gl.ctx;
        var i, l, objects;

        this.counter = 0;
        this.skeleton = new Skeleton(model, ctx);

        if (model.particleEmitters && model.particleEmitters.length > 0) {
            objects = model.particleEmitters;

            this.particleEmitters = [];

            for (i = 0, l = objects.length; i < l; i++) {
                this.particleEmitters[i] = new ParticleEmitter(objects[i], model, this, context);
            }
        }

        if (model.particleEmitters2 && model.particleEmitters2.length > 0) {
            objects = model.particleEmitters2;

            this.particleEmitters2 = [];

            for (i = 0, l = objects.length; i < l; i++) {
                this.particleEmitters2[i] = new ParticleEmitter2(objects[i], model, this, ctx);
            }
        }

        if (model.ribbonEmitters && model.ribbonEmitters.length > 0) {
            objects = model.ribbonEmitters;

            this.ribbonEmitters = [];

            for (i = 0, l = objects.length; i < l; i++) {
                this.ribbonEmitters[i] = new RibbonEmitter(objects[i], model, this, ctx);
            }
        }
        
        this.attachmentInstances = [];
        this.attachments = [];
        this.attachmentVisible = [];
        
        for (i = 0, l = model.attachments.length; i < l; i++) {
            var path = model.attachments[i].path.replace(/\\/g, "/").toLowerCase().replace(".mdl", ".mdx");
            
            // Second condition is against custom resources using arbitrary paths...
            if (path !== "" && path.indexOf(".mdx") != -1) {
                var instance = context.loadInternalResource(context.urls.mpqFile(path));
                instance.setSequence(0);
                instance.setSequenceLoopMode(2);
                instance.setParent(this.getAttachment(model.attachments[i].attachmentId));
                
                this.attachmentInstances.push(instance);
                this.attachments.push(model.attachments[i]);
                this.attachmentVisible.push(true);
            }
        }
        
        
        if (model.eventObjects) {
            objects = model.eventObjects;
            
            this.eventObjectEmitters = [];
            
            for (i = 0, l = objects.length; i < l; i++) {
                this.eventObjectEmitters[i] = new EventObjectEmitter(objects[i], model, this, context);
            }
        }
    },

    updateEmitters: function (emitters, allowCreate, context) {
        if (emitters) {
            for (var i = 0, l = emitters.length; i < l; i++) {
                emitters[i].update(allowCreate, this.sequence, this.frame, this.counter, context);
            }
        }
    },

    update: function (instance, context) {
        var allowCreate = false;

        if (this.sequence !== -1) {
            var sequence = this.model.sequences[this.sequence];

            this.frame += context.frameTime;
            this.counter += context.frameTime;

            allowCreate = true;

            if (this.frame >= sequence.interval[1]) {
                if (this.sequenceLoopMode === 2 || (this.sequenceLoopMode === 0 && sequence.flags === 0)) {
                    this.frame = sequence.interval[0];
                    allowCreate = true;
                } else {
                    this.frame = sequence.interval[1];
                    this.counter -= context.frameTime;
                    allowCreate = false;
                }
            }
        }

        this.skeleton.update(this.sequence, this.frame, this.counter, instance, context);

        this.updateEmitters(this.particleEmitters, allowCreate, context);
        this.updateEmitters(this.particleEmitters2, allowCreate, context);
        this.updateEmitters(this.ribbonEmitters, allowCreate, context);
        this.updateEmitters(this.eventObjectEmitters, allowCreate, context);
        
        var attachmentInstances = this.attachmentInstances;
        var attachments = this.attachments;
        var attachmentVisible = this.attachmentVisible;
        var attachment;
        var sd;
        var visibility;
        var value;
        
        for (var i = 0, l = attachments.length; i < l; i++) {
            attachment = attachments[i];
            sd = attachment.sd;
            
            attachmentVisible[i] = true;
            
            if (sd) {
                visibility = sd.visibility;
                
                if (visibility) {
                    value = visibility.getValue(null, this.sequence, this.frame, this.counter);
                    
                    if (value < 0.1) {
                        attachmentVisible[i] = false;
                    }
                }
            }
            
            if (attachmentVisible[i]) {
                this.attachmentInstances[i].update(context);
            }
        }
    },
    
    render: function(context) {
        if (this.eventObjectEmitters) {
            var emitters = this.eventObjectEmitters;
            
            for (i = 0, l = emitters.length; i < l; i++) {
                emitters[i].render(context);
            }
        }
        
        this.model.render(this, context);
        
        var attachmentInstances = this.attachmentInstances;
        var attachmentVisible = this.attachmentVisible;
        
        for (var i = 0, l = attachmentInstances.length; i < l; i++) {
            if (attachmentVisible[i]) {
                attachmentInstances[i].render(context);
            }
        }
    },
    
    renderEmitters: function(context) {
        if (this.eventObjectEmitters) {
            var emitters = this.eventObjectEmitters;
            
            for (i = 0, l = emitters.length; i < l; i++) {
                emitters[i].renderEmitters(context);
            }
        }
        
        this.model.renderEmitters(this, context);
        
        var attachmentInstances = this.attachmentInstances;
        var attachmentVisible = this.attachmentVisible;
        
        for (var i = 0, l = attachmentInstances.length; i < l; i++) {
            if (attachmentVisible[i]) {
                attachmentInstances[i].renderEmitters(context);
            }
        }
    },
    
    setTeamColor: function (id) {
        var idString = ((id < 10) ? "0" + id : id);

        this.overrideTexture("replaceabletextures/teamcolor/teamcolor00.blp", urls.mpqFile("replaceabletextures/teamcolor/teamcolor" + idString + ".blp"));
        this.overrideTexture("replaceabletextures/teamglow/teamglow00.blp", urls.mpqFile("replaceabletextures/teamglow/teamglow" + idString + ".blp"));
        this.teamColor = id;
    },

    setSequence: function (id) {
        if (this.model.sequences.length) {
            this.sequence = id;

            if (id === -1) {
                this.frame = 0;
            } else {
                var sequence = this.model.sequences[id];

                this.frame = sequence.interval[0];
            }
        }
    },

    getAttachment: function (id) {
        var attachment = this.model.attachments[id];

        if (attachment) {
            return this.skeleton.nodes[attachment.node];
        } else {
            return this.skeleton.nodes[0];
        }
    }
});