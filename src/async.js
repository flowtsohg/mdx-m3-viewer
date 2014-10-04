/**
 * Used to add an asynchronous action queue to an object.
 *
 * @mixin
 * @name Async
 * @property {array} actions
 */
var Async = {
  /**
    * Creates the needed properties in the mixed object.
    *
    * @memberof Async
    * @instance
    */
  setupAsync: function () {
    this.actions = [];
  },
  
  /**
    * Adds a new action to the action queue.
    *
    * @memberof Async
    * @instance
    * @param {string} functor A function name.
    * @param {array} args The arguments that will be sent to the functor.
    */
  addAction: function (functor, args) {
    this.actions.push([functor, args]);
  },
  
  /**
    * Calls all the functors in the action queue, giving them their arguments.
    *
    * @memberof Async
    * @instance
    */
  runActions: function () {
    var i,
          l,
          actions = this.actions,
          action;
    
    for (i = 0, l = actions.length; i < l; i++) {
      action = actions[i];
      
      this[action[0]].apply(this, action[1]);
    }
    
    actions = [];
  }
};