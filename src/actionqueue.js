function ActionQueue() {
     this.actions = [];
}
 
ActionQueue.prototype = {
    addAction(action, args) {
        this.actions.push([action, args]);
    },

    applyActions() {
        for (let action of this.actions) {
            action[0].apply(this, action[1]);
        }

        this.actions = [];
    }
};
