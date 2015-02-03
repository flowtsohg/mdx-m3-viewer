/**
 * Used to add an asynchronous action queue to an object.
 *
 * @mixin
 * @name Async
 * @property {array} actions
 */
 function Async() {
     this.functors = [];
 }
 
Async.prototype = {
  /**
    * Adds a new action to the action queue.
    *
    * @memberof Async
    * @instance
    * @param {string} functor A function name.
    * @param {array} args The arguments that will be sent to the functor.
    */
    addFunctor: function (functor, args) {
        this.functors.push([functor, args]);
    },
  
  /**
    * Calls all the functors in the action queue, giving them their arguments.
    *
    * @memberof Async
    * @instance
    */
    runFunctors: function () {
        var functors = this.functors,
            functor,
            i,
            l;

        for (i = 0, l = functors.length; i < l; i++) {
            functor = functors[i];

            this[functor[0]].apply(this, functor[1]);
        }

        functors = [];
    }
};