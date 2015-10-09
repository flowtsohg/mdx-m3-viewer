Mdx.EventObjectSpn = function (emitter) {
    var context = emitter.context;
    var pathSolver = emitter.pathSolver;
    var instance = context.loadInternalResource(pathSolver(emitter.path), pathSolver);

    instance.setSequence(0);
    instance.setLocation(emitter.node.worldLocation);
    instance.setScale(emitter.node.scale[0]); // Assuming uniform scale
    instance.setRotationQuat(emitter.node.worldRotation);
    
    this.instance = instance;
};

Mdx.EventObjectSpn.prototype = {
    update: function (emitter) {
        this.instance.update();
    },
    
    render: function (emitter) {
        this.instance.render();
    },
    
    renderEmitters: function (emitter) {
        this.instance.renderEmitters();
    },
    
    ended: function () {
        var instance = this.instance;
        
        if (instance.ready && instance.instance.frame >= instance.instance.model.sequences[0].interval[1]) {
            return true;
        }
        
        return false;
    }
};
