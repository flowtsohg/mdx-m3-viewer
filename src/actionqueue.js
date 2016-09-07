function ActionQueue() {
     this.actions = [];
}
 
ActionQueue.prototype = {
    addAction(action, args) {
        this.actions.push([action, args]);
    },

    applyActions() {
        for (let action of this.actions) {
            Reflect.apply(action[0], this, action[1]);
        }

        this.actions = [];
    }
};
