function EventObjectSpn(emitter, context) {
    var instance = context.loadInternalResource(context.urls.mpqFile(emitter.path));
                
    instance.setSequence(0);
    instance.setLocation(emitter.node.worldLocation);
    instance.setScale(emitter.node.scale[0]); // Assuming uniform scale
    instance.setRotationQuat(emitter.node.worldRotation);
    
    this.instance = instance;
}

EventObjectSpn.prototype = {
    update: function (emitter, context) {
        this.instance.update(context);
    },
    
    render: function (emitter, context) {
        this.instance.render(context);
    },
    
    renderEmitters: function (emitter, context) {
        this.instance.renderEmitters(context);
    },
    
    ended: function () {
        var instance = this.instance;
        
        if (instance.ready && instance.instance.frame >= instance.instance.model.sequences[0].interval[1]) {
            return true;
        }
        
        return false;
    }
};