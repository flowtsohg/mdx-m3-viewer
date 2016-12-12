/**
 * @class
 * @classdesc A simple queue of actions. An action is composed of a function, and the arguments to be used.
 *            This class is used wherever asyncronyous code needs to happen.
 */
function ActionQueue() {
    /** @member {array} */
    this.actions = [];
}
 
ActionQueue.prototype = {
    /**
     * @method
     * @desc Add an action to the queue.
     * @param {function} action The action.
     * @param {array} args The action arguments.
     */
    addAction(action, args) {
        this.actions.push([action, args]);
    },

    /**
     * @method
     * @desc Runs all of the actions in the queue, emptying it.
     */
    applyActions() {
        let actions = this.actions;

        this.actions = [];

        for (let action of actions) {
            action[0].apply(this, action[1]);
        }  
    }
};
