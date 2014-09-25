// Async mixin.
// Used to add an asynchronous action queue to an object.
var Async = (function () {
  // Create the required variables in the object.
  function setup() {
    this.asyncActions = [];
  }
  
  // Add an action to the queue.
  function addAsyncAction(functor, args) {
    this.asyncActions.push([functor, args]);
  }
  
  // Run all the actions.
  function runAsyncActions() {
    var i,
          l,
          actions = this.asyncActions,
          action;
    
    for (i = 0, l = actions.length; i < l; i++) {
      action = actions[i];
      
      this[action[0]].apply(this, action[1]);
    }
    
    actions = [];
  }
  
  return function () {
    this.setupAsync = setup;
    this.addAsyncAction = addAsyncAction;
    this.runAsyncActions = runAsyncActions;
    
    return this;
  };
}());