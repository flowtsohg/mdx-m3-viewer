function MdxEventObjectSpn(emitter) {
    var viewer = emitter.viewer;
    var pathSolver = emitter.pathSolver;
    var instance = viewer.loadInternalResource(pathSolver(emitter.path), pathSolver);

    instance.setSequence(0);
    instance.setLocation(emitter.node.worldLocation);
    instance.setScale(emitter.node.scale[0]); // Assuming uniform scale
    instance.setRotationQuat(emitter.node.worldRotation);
    
    this.instance = instance;
}

MdxEventObjectSpn.prototype = {
    update(emitter) {
        this.instance.update();
    },
    
    render(emitter) {
        this.instance.render();
    },
    
    renderEmitters: function (emitter) {
        this.instance.renderEmitters();
    },
    
    ended() {
        var instance = this.instance;
        
        if (instance.ready && instance.instance.frame >= instance.instance.model.sequences[0].interval[1]) {
            return true;
        }
        
        return false;
    }
};
